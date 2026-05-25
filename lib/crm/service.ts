import { addDays } from "date-fns";
import { getServerConfig, getRuntimeEnv } from "@/lib/cloudflare/env";
import { leadsToCsv } from "@/lib/crm/csv";
import {
  demoContacts,
  demoEmailLogs,
  demoEmailTemplates,
  demoFiles,
  demoLeads,
  demoOrders,
  demoTasks,
} from "@/lib/crm/demo";
import { createId, first, jsonArray, nowIso, parseJsonArray, run, all } from "@/lib/crm/db";
import type {
  ContactRecord,
  EmailEventType,
  EmailLogRecord,
  EmailTemplateRecord,
  FileRecord,
  LeadRecord,
  OrderRecord,
  TaskRecord,
} from "@/lib/crm/types";
import {
  contactSchema,
  emailTemplateSchema,
  formSubmissionSchema,
  leadSchema,
  noteSchema,
  orderSchema,
  referralSchema,
  shipmentUpdateSchema,
  taskSchema,
} from "@/lib/crm/validation";
import { sendTransactionalEmail } from "@/lib/email/resend";
import {
  createReferralConversionFromOrder,
  createReferralLeadFromCrm,
} from "@/lib/referrals/service";
import { verifyTurnstile } from "@/lib/turnstile/verify";

type ListLeadOptions = {
  search?: string;
  status?: string;
  source?: string;
  productInterest?: string;
  sort?: "created_at" | "last_contacted_at" | "next_follow_up_at";
  direction?: "asc" | "desc";
};

function joinUrl(base: string, path = "") {
  const normalizedBase = base.replace(/\/$/, "");
  if (!path) {
    return normalizedBase;
  }

  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getDisplayName(firstName?: string | null, lastName?: string | null) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || "Apex Wellness Customer";
}

function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "customer";
  const normalized = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  return normalized || "Customer";
}

function getOrderStatusTemplateAlias(status: string, hasTrackingNumber: boolean) {
  if (status === "Shipped") {
    return "apex-order-shipped" as const;
  }

  if (status === "Delivered") {
    return "apex-delivered" as const;
  }

  if (hasTrackingNumber) {
    return "apex-shipping-label-created" as const;
  }

  return "apex-order-processing" as const;
}

export async function logActivity(input: {
  type: string;
  description: string;
  leadId?: string | null;
  contactId?: string | null;
  orderId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const id = createId("act");
  await run(
    "INSERT INTO activity_logs (id, type, description, lead_id, contact_id, order_id, user_id, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      input.type,
      input.description,
      input.leadId ?? null,
      input.contactId ?? null,
      input.orderId ?? null,
      input.userId ?? null,
      JSON.stringify(input.metadata ?? {}),
      nowIso(),
    ],
  );
}

function mapLead(row: Record<string, unknown>): LeadRecord {
  return {
    id: String(row.id),
    first_name: String(row.first_name),
    last_name: String(row.last_name),
    email: String(row.email),
    phone: String(row.phone),
    product_interest: String(row.product_interest),
    message: row.message ? String(row.message) : null,
    source: String(row.source) as LeadRecord["source"],
    status: String(row.status) as LeadRecord["status"],
    lead_value_estimate: Number(row.lead_value_estimate ?? 0),
    assigned_user_id: row.assigned_user_id ? String(row.assigned_user_id) : null,
    pipeline_stage_id: row.pipeline_stage_id ? String(row.pipeline_stage_id) : null,
    pipeline_stage_name: row.pipeline_stage_name ? String(row.pipeline_stage_name) as LeadRecord["pipeline_stage_name"] : null,
    next_follow_up_at: row.next_follow_up_at ? String(row.next_follow_up_at) : null,
    last_contacted_at: row.last_contacted_at ? String(row.last_contacted_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapContact(row: Record<string, unknown>): ContactRecord {
  return {
    id: String(row.id),
    first_name: String(row.first_name),
    last_name: String(row.last_name),
    email: String(row.email),
    phone: String(row.phone),
    customer_status: String(row.customer_status),
    tags: parseJsonArray(row.tags_json),
    product_interests: parseJsonArray(row.product_interests_json),
    last_contacted_at: row.last_contacted_at ? String(row.last_contacted_at) : null,
    next_follow_up_at: row.next_follow_up_at ? String(row.next_follow_up_at) : null,
    notes_summary: row.notes_summary ? String(row.notes_summary) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapOrder(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    contact_id: row.contact_id ? String(row.contact_id) : null,
    email: String(row.email),
    status: String(row.status) as OrderRecord["status"],
    subtotal: Number(row.subtotal ?? 0),
    total: Number(row.total ?? 0),
    payment_status: String(row.payment_status) as OrderRecord["payment_status"],
    stripe_payment_id: row.stripe_payment_id ? String(row.stripe_payment_id) : null,
    product_name: String(row.product_name),
    tracking_number: row.tracking_number ? String(row.tracking_number) : null,
    carrier: row.carrier ? String(row.carrier) : null,
    tracking_url: row.tracking_url ? String(row.tracking_url) : null,
    shipped_at: row.shipped_at ? String(row.shipped_at) : null,
    delivered_at: row.delivered_at ? String(row.delivered_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapTask(row: Record<string, unknown>): TaskRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    due_at: String(row.due_at),
    status: String(row.status) as TaskRecord["status"],
    assigned_user_id: row.assigned_user_id ? String(row.assigned_user_id) : null,
    lead_id: row.lead_id ? String(row.lead_id) : null,
    contact_id: row.contact_id ? String(row.contact_id) : null,
    notes: row.notes ? String(row.notes) : null,
    completed_at: row.completed_at ? String(row.completed_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapEmailTemplate(row: Record<string, unknown>): EmailTemplateRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    event_type: String(row.event_type) as EmailEventType,
    subject: String(row.subject),
    html_content: String(row.html_content),
    text_content: String(row.text_content),
    is_enabled: Number(row.is_enabled ?? 1),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapEmailLog(row: Record<string, unknown>): EmailLogRecord {
  return {
    id: String(row.id),
    recipient_email: String(row.recipient_email),
    template_id: row.template_id ? String(row.template_id) : null,
    event_type: String(row.event_type) as EmailEventType,
    delivery_status: String(row.delivery_status),
    provider_message_id: row.provider_message_id ? String(row.provider_message_id) : null,
    error_message: row.error_message ? String(row.error_message) : null,
    created_at: String(row.created_at),
  };
}

function mapFile(row: Record<string, unknown>): FileRecord {
  return {
    id: String(row.id),
    owner_type: String(row.owner_type),
    owner_id: String(row.owner_id),
    bucket_key: String(row.bucket_key),
    filename: String(row.filename),
    content_type: String(row.content_type),
    file_size: Number(row.file_size ?? 0),
    uploaded_by_user_id: row.uploaded_by_user_id ? String(row.uploaded_by_user_id) : null,
    created_at: String(row.created_at),
  };
}

export async function getDashboardSnapshot() {
  const runtimeEnv = await getRuntimeEnv();

  if (!runtimeEnv?.DB) {
    const newLeadsToday = demoLeads.filter((lead) => new Date(lead.created_at).toDateString() === new Date().toDateString()).length;
    const estimatedRevenue = demoOrders.reduce((total, order) => total + order.total, 0);
    return {
      cards: [
        { label: "Total leads", value: demoLeads.length, helper: "All lead records" },
        { label: "New leads today", value: newLeadsToday, helper: "Captured today" },
        { label: "Active customers", value: demoContacts.length, helper: "Current contact records" },
        { label: "Pending follow-ups", value: demoTasks.filter((task) => task.status === "Open").length, helper: "Open tasks" },
        { label: "Overdue follow-ups", value: 0, helper: "No DB bound" },
        { label: "Orders", value: demoOrders.length, helper: "Current order records" },
        { label: "Estimated revenue", value: estimatedRevenue, helper: "Sum of order totals" },
        { label: "Conversion rate", value: "50%", helper: "Demo data" },
      ],
      recentActivity: [
        { id: "demo_1", type: "lead_created", description: "Demo lead created for Avery Cole", created_at: demoLeads[0]?.created_at ?? nowIso() },
      ],
      leadSourceBreakdown: [{ label: "Website", value: 1 }, { label: "Referral", value: 1 }],
      productInterestBreakdown: [{ label: "TriMix", value: 1 }, { label: "NAD+ 500MG", value: 1 }],
    };
  }

  const counts = await first<{
    total_leads: number;
    leads_today: number;
    active_customers: number;
    pending_follow_ups: number;
    overdue_follow_ups: number;
    total_orders: number;
    estimated_revenue: number;
    converted_leads: number;
  }>(
    `
      SELECT
        (SELECT COUNT(*) FROM leads) AS total_leads,
        (SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now')) AS leads_today,
        (SELECT COUNT(*) FROM contacts) AS active_customers,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Open') AS pending_follow_ups,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Open' AND due_at < datetime('now')) AS overdue_follow_ups,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders) AS estimated_revenue,
        (SELECT COUNT(*) FROM leads WHERE status = 'Converted') AS converted_leads
    `,
  );

  const recentActivity = await all<{ id: string; type: string; description: string; created_at: string }>(
    "SELECT id, type, description, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 8",
  );

  const leadSourceBreakdown = await all<{ label: string; value: number }>(
    "SELECT source AS label, COUNT(*) AS value FROM leads GROUP BY source ORDER BY value DESC",
  );

  const productInterestBreakdown = await all<{ label: string; value: number }>(
    "SELECT product_interest AS label, COUNT(*) AS value FROM leads GROUP BY product_interest ORDER BY value DESC LIMIT 6",
  );

  const totalLeads = Number(counts?.total_leads ?? 0);
  const convertedLeads = Number(counts?.converted_leads ?? 0);

  return {
    cards: [
      { label: "Total leads", value: Number(counts?.total_leads ?? 0), helper: "All captured requests" },
      { label: "New leads today", value: Number(counts?.leads_today ?? 0), helper: "Submitted today" },
      { label: "Active customers", value: Number(counts?.active_customers ?? 0), helper: "Saved contact records" },
      { label: "Pending follow-ups", value: Number(counts?.pending_follow_ups ?? 0), helper: "Open tasks" },
      { label: "Overdue follow-ups", value: Number(counts?.overdue_follow_ups ?? 0), helper: "Past due" },
      { label: "Orders", value: Number(counts?.total_orders ?? 0), helper: "Tracked orders" },
      { label: "Estimated revenue", value: Number(counts?.estimated_revenue ?? 0), helper: "Order total sum" },
      { label: "Conversion rate", value: totalLeads ? `${Math.round((convertedLeads / totalLeads) * 100)}%` : "0%", helper: "Converted leads / total leads" },
    ],
    recentActivity,
    leadSourceBreakdown,
    productInterestBreakdown,
  };
}

export async function listLeads(options: ListLeadOptions = {}) {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoLeads;
  }

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options.search) {
    conditions.push("(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR product_interest LIKE ?)");
    params.push(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`);
  }

  if (options.status) {
    conditions.push("status = ?");
    params.push(options.status);
  }

  if (options.source) {
    conditions.push("source = ?");
    params.push(options.source);
  }

  if (options.productInterest) {
    conditions.push("product_interest = ?");
    params.push(options.productInterest);
  }

  const orderBy = options.sort ?? "created_at";
  const direction = options.direction ?? "desc";
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        leads.*,
        pipeline_stages.name AS pipeline_stage_name
      FROM leads
      LEFT JOIN pipeline_stages ON pipeline_stages.id = leads.pipeline_stage_id
      ${whereClause}
      ORDER BY ${orderBy} ${direction.toUpperCase()}
    `,
    params,
  );

  return rows.map(mapLead);
}

export async function getLead(id: string) {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoLeads.find((lead) => lead.id === id) ?? null;
  }

  const row = await first<Record<string, unknown>>(
    `
      SELECT
        leads.*,
        pipeline_stages.name AS pipeline_stage_name
      FROM leads
      LEFT JOIN pipeline_stages ON pipeline_stages.id = leads.pipeline_stage_id
      WHERE leads.id = ?
      LIMIT 1
    `,
    [id],
  );

  return row ? mapLead(row) : null;
}

async function getDefaultStageId() {
  const stage = await first<{ id: string }>(
    "SELECT id FROM pipeline_stages WHERE name = 'New Lead' LIMIT 1",
  );
  return stage?.id ?? null;
}

export async function upsertContactFromLead(lead: LeadRecord) {
  const existing = await first<{ id: string }>("SELECT id FROM contacts WHERE email = ? LIMIT 1", [
    lead.email,
  ]);
  const now = nowIso();

  if (existing) {
    await run(
      `
        UPDATE contacts
        SET first_name = ?, last_name = ?, phone = ?, product_interests_json = ?, updated_at = ?
        WHERE id = ?
      `,
      [lead.first_name, lead.last_name, lead.phone, jsonArray([lead.product_interest]), now, existing.id],
    );
    return existing.id;
  }

  const id = createId("contact");
  await run(
    `
      INSERT INTO contacts (
        id, first_name, last_name, email, phone, customer_status, tags_json, product_interests_json,
        last_contacted_at, next_follow_up_at, notes_summary, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone,
      "Active Customer",
      jsonArray([]),
      jsonArray([lead.product_interest]),
      lead.last_contacted_at,
      lead.next_follow_up_at,
      lead.message,
      now,
      now,
    ],
  );
  await logActivity({
    type: "contact_created",
    description: `Contact created for ${lead.first_name} ${lead.last_name}`,
    leadId: lead.id,
    contactId: id,
  });
  return id;
}

export async function createLead(input: unknown) {
  const data = leadSchema.parse(input);
  const id = createId("lead");
  const now = nowIso();
  const stageId = await getDefaultStageId();

  await run(
    `
      INSERT INTO leads (
        id, first_name, last_name, email, phone, product_interest, message, source, status,
        lead_value_estimate, assigned_user_id, pipeline_stage_id, next_follow_up_at,
        last_contacted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.product_interest,
      data.message ?? null,
      data.source,
      data.status,
      data.lead_value_estimate,
      data.assigned_user_id ?? null,
      stageId,
      data.next_follow_up_at ?? addDays(new Date(), 1).toISOString(),
      data.last_contacted_at ?? null,
      now,
      now,
    ],
  );

  await run(
    `
      INSERT INTO deals (
        id, lead_id, contact_id, stage_id, stage_name, estimated_value, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      createId("deal"),
      id,
      null,
      stageId,
      "New Lead",
      data.lead_value_estimate,
      data.status,
      now,
      now,
    ],
  );

  await createTask({
    title: `Initial follow-up for ${data.first_name} ${data.last_name}`,
    description: "Reach out after the new lead submission.",
    due_at: addDays(new Date(), 1).toISOString(),
    status: "Open",
    assigned_user_id: data.assigned_user_id ?? null,
    lead_id: id,
    contact_id: null,
    notes: data.message ?? null,
  });

  await logActivity({
    type: "lead_created",
    description: `Lead created for ${data.first_name} ${data.last_name}`,
    leadId: id,
  });

  return getLead(id);
}

export async function updateLead(id: string, input: unknown) {
  const data = leadSchema.partial().parse(input);
  const existing = await getLead(id);
  if (!existing) {
    return null;
  }

  const next = { ...existing, ...data, updated_at: nowIso() };

  await run(
    `
      UPDATE leads
      SET first_name = ?, last_name = ?, email = ?, phone = ?, product_interest = ?, message = ?, source = ?,
          status = ?, lead_value_estimate = ?, assigned_user_id = ?, next_follow_up_at = ?, last_contacted_at = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      next.first_name,
      next.last_name,
      next.email,
      next.phone,
      next.product_interest,
      next.message,
      next.source,
      next.status,
      next.lead_value_estimate,
      next.assigned_user_id,
      next.next_follow_up_at,
      next.last_contacted_at,
      next.updated_at,
      id,
    ],
  );

  await logActivity({
    type: "lead_updated",
    description: `Lead updated for ${next.first_name} ${next.last_name}`,
    leadId: id,
  });

  if (next.status === "Converted") {
    const contactId = await upsertContactFromLead(next);
    await run("UPDATE deals SET contact_id = ?, status = ?, updated_at = ? WHERE lead_id = ?", [
      contactId,
      "Converted",
      next.updated_at,
      id,
    ]);
  }

  return getLead(id);
}

export async function deleteLead(id: string) {
  await run("DELETE FROM leads WHERE id = ?", [id]);
  await logActivity({ type: "lead_deleted", description: `Lead deleted: ${id}`, leadId: id });
  return { ok: true };
}

export async function listContacts() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoContacts;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM contacts ORDER BY updated_at DESC");
  return rows.map(mapContact);
}

export async function getContact(id: string) {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoContacts.find((contact) => contact.id === id) ?? null;
  }
  const row = await first<Record<string, unknown>>("SELECT * FROM contacts WHERE id = ? LIMIT 1", [id]);
  return row ? mapContact(row) : null;
}

export async function updateContact(id: string, input: unknown) {
  const data = contactSchema.partial().parse(input);
  const existing = await getContact(id);
  if (!existing) {
    return null;
  }

  const next = { ...existing, ...data, updated_at: nowIso() };
  await run(
    `
      UPDATE contacts
      SET first_name = ?, last_name = ?, email = ?, phone = ?, customer_status = ?, tags_json = ?, product_interests_json = ?,
          last_contacted_at = ?, next_follow_up_at = ?, notes_summary = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      next.first_name,
      next.last_name,
      next.email,
      next.phone,
      next.customer_status,
      jsonArray(next.tags),
      jsonArray(next.product_interests),
      next.last_contacted_at,
      next.next_follow_up_at,
      next.notes_summary,
      next.updated_at,
      id,
    ],
  );
  await logActivity({ type: "contact_updated", description: `Contact updated for ${next.first_name} ${next.last_name}`, contactId: id });
  return getContact(id);
}

export async function listOrders() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoOrders;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM orders ORDER BY created_at DESC");
  return rows.map(mapOrder);
}

export async function getOrder(id: string) {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoOrders.find((order) => order.id === id) ?? null;
  }
  const row = await first<Record<string, unknown>>("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  return row ? mapOrder(row) : null;
}

export async function createOrder(input: unknown) {
  const data = orderSchema.parse(input);
  const id = createId("order");
  const now = nowIso();

  await run(
    `
      INSERT INTO orders (
        id, contact_id, email, status, subtotal, total, payment_status, stripe_payment_id,
        product_name, tracking_number, carrier, tracking_url, shipped_at, delivered_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.contact_id ?? null,
      data.email,
      data.status,
      data.subtotal,
      data.total,
      data.payment_status,
      data.stripe_payment_id ?? null,
      data.product_name,
      data.tracking_number ?? null,
      data.carrier ?? null,
      data.tracking_url ?? null,
      data.shipped_at ?? null,
      data.delivered_at ?? null,
      now,
      now,
    ],
  );

  await run(
    "INSERT INTO order_events (id, order_id, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)",
    [createId("oevt"), id, "order_created", JSON.stringify(data), now],
  );

  await logActivity({
    type: "order_created",
    description: `Order created for ${data.email}`,
    orderId: id,
    metadata: { product_name: data.product_name, total: data.total },
  });

  return getOrder(id);
}

export async function updateShipment(id: string, input: unknown) {
  const data = shipmentUpdateSchema.parse(input);
  const existing = await getOrder(id);
  if (!existing) {
    return null;
  }

  const next = { ...existing, ...data, updated_at: nowIso() };

  await run(
    `
      UPDATE orders
      SET status = ?, tracking_number = ?, carrier = ?, tracking_url = ?, shipped_at = ?, delivered_at = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      next.status,
      next.tracking_number,
      next.carrier,
      next.tracking_url,
      next.shipped_at,
      next.delivered_at,
      next.updated_at,
      id,
    ],
  );

  await run(
    "INSERT INTO order_events (id, order_id, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)",
    [createId("oevt"), id, data.tracking_number ? "shipment_tracking_added" : "order_status_updated", JSON.stringify(data), nowIso()],
  );

  await logActivity({
    type: data.tracking_number ? "shipment_tracking_added" : "order_status_changed",
    description: data.tracking_number
      ? `Tracking added for order ${id}`
      : `Order ${id} updated to ${next.status}`,
    orderId: id,
  });

  const config = await getServerConfig();
  const customerName = getNameFromEmail(existing.email);
  const templateAlias = getOrderStatusTemplateAlias(
    next.status,
    Boolean(next.tracking_number),
  );

  if (data.tracking_number || data.status) {
    await sendTransactionalEmail({
      eventType: data.tracking_number
        ? "shipment_tracking_added"
        : "order_status_updated",
      recipientEmail: existing.email,
      templateAlias,
      context: {
        CUSTOMER_NAME: customerName,
        ORDER_NUMBER: existing.id,
        ORDER_LINK: config.portalUrl,
        TRACKING_LINK: next.tracking_url ?? config.portalUrl,
        TRACKING_NUMBER: next.tracking_number ?? "Available in your secure account",
        CARRIER: next.carrier ?? "Carrier update pending",
        ESTIMATED_DELIVERY: next.delivered_at ?? "Carrier estimate pending",
        SUPPORT_EMAIL: config.supportEmail,
        WEBSITE_URL: config.appUrl,
      },
    });
  }

  return getOrder(id);
}

export async function handleStripePurchase(input: {
  paymentIntentId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  productName: string;
  subtotal: number;
  total: number;
  referralCode?: string | null;
  sourcePage?: string | null;
}) {
  const lead = await createLead({
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    product_interest: input.productName,
    message: "Created from purchase success webhook.",
    source: "Website",
    status: "Converted",
    lead_value_estimate: input.total,
  });

  const contactId = lead ? await upsertContactFromLead(lead) : null;

  const order = await createOrder({
    contact_id: contactId,
    email: input.email,
    status: "Paid",
    subtotal: input.subtotal,
    total: input.total,
    payment_status: "Paid",
    stripe_payment_id: input.paymentIntentId,
    product_name: input.productName,
  });

  const config = await getServerConfig();
  const customerName = getDisplayName(input.firstName, input.lastName);

  await sendTransactionalEmail({
    eventType: "purchase_success",
    recipientEmail: input.email,
    templateAlias: "apex-order-confirmation",
    context: {
      CUSTOMER_NAME: customerName,
      ORDER_NUMBER: order?.id ?? input.paymentIntentId,
      ORDER_TOTAL: formatCurrency(input.total),
      SHIPPING_ADDRESS: "Available in your secure account",
      ORDER_LINK: config.portalUrl,
      SUPPORT_EMAIL: config.supportEmail,
      WEBSITE_URL: config.appUrl,
    },
  });

  if (config.adminNotificationEmail) {
    await sendTransactionalEmail({
      eventType: "admin_new_purchase",
      recipientEmail: config.adminNotificationEmail,
      templateAlias: "apex-admin-new-order-placed",
      context: {
        ORDER_NUMBER: order?.id ?? input.paymentIntentId,
        CUSTOMER_NAME: customerName,
        ORDER_TOTAL: formatCurrency(input.total),
        PAYMENT_STATUS: "Paid",
        ADMIN_ORDER_LINK: joinUrl(config.appUrl, "/admin/crm/orders"),
        SUPPORT_EMAIL: config.supportEmail,
        WEBSITE_URL: config.appUrl,
      },
    });
  }

  await logActivity({
    type: "payment_event",
    description: `Stripe payment captured for ${input.email}`,
    orderId: order?.id ?? null,
  });

  if (order?.id && input.referralCode) {
    await createReferralConversionFromOrder({
      referralCode: input.referralCode,
      orderId: order.id,
      productName: input.productName,
      orderTotal: input.total,
      customerEmail: input.email,
      customerName: customerName,
      sourcePage: input.sourcePage ?? "/cart",
    });
  }

  return order;
}

export async function listTasks() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoTasks;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM tasks ORDER BY due_at ASC");
  return rows.map(mapTask);
}

export async function createTask(input: unknown) {
  const data = taskSchema.parse(input);
  const id = createId("task");
  const now = nowIso();
  await run(
    `
      INSERT INTO tasks (
        id, title, description, due_at, status, assigned_user_id, lead_id, contact_id, notes, completed_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.title,
      data.description ?? null,
      data.due_at,
      data.status,
      data.assigned_user_id ?? null,
      data.lead_id ?? null,
      data.contact_id ?? null,
      data.notes ?? null,
      null,
      now,
      now,
    ],
  );
  await logActivity({ type: "task_created", description: `Task created: ${data.title}`, leadId: data.lead_id ?? null, contactId: data.contact_id ?? null });
  return first<Record<string, unknown>>("SELECT * FROM tasks WHERE id = ? LIMIT 1", [id]).then((row) => (row ? mapTask(row) : null));
}

export async function updateTask(id: string, input: unknown) {
  const data = taskSchema.partial().parse(input);
  const current = await first<Record<string, unknown>>("SELECT * FROM tasks WHERE id = ? LIMIT 1", [id]);
  if (!current) {
    return null;
  }
  const existing = mapTask(current);
  const next = { ...existing, ...data, updated_at: nowIso() };
  await run(
    `
      UPDATE tasks
      SET title = ?, description = ?, due_at = ?, status = ?, assigned_user_id = ?, lead_id = ?, contact_id = ?, notes = ?, completed_at = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      next.title,
      next.description,
      next.due_at,
      next.status,
      next.assigned_user_id,
      next.lead_id,
      next.contact_id,
      next.notes,
      next.status === "Completed" ? nowIso() : next.completed_at,
      next.updated_at,
      id,
    ],
  );
  if (next.status === "Completed") {
    await logActivity({ type: "task_completed", description: `Task completed: ${next.title}`, leadId: next.lead_id, contactId: next.contact_id });
  }
  return first<Record<string, unknown>>("SELECT * FROM tasks WHERE id = ? LIMIT 1", [id]).then((row) => (row ? mapTask(row) : null));
}

export async function createNote(input: unknown) {
  const data = noteSchema.parse(input);
  const id = createId("note");
  await run(
    "INSERT INTO notes (id, lead_id, contact_id, order_id, body, note_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, data.lead_id ?? null, data.contact_id ?? null, data.order_id ?? null, data.body, data.note_type, nowIso(), nowIso()],
  );
  await logActivity({
    type: "note_created",
    description: "Internal note added",
    leadId: data.lead_id ?? null,
    contactId: data.contact_id ?? null,
    orderId: data.order_id ?? null,
  });
  return { ok: true, id };
}

export async function listRecentNotes(entity: { leadId?: string; contactId?: string; orderId?: string }) {
  const conditions: string[] = [];
  const params: string[] = [];
  if (entity.leadId) {
    conditions.push("lead_id = ?");
    params.push(entity.leadId);
  }
  if (entity.contactId) {
    conditions.push("contact_id = ?");
    params.push(entity.contactId);
  }
  if (entity.orderId) {
    conditions.push("order_id = ?");
    params.push(entity.orderId);
  }
  if (!conditions.length) {
    return [];
  }
  return all<{ id: string; body: string; note_type: string; created_at: string }>(
    `SELECT id, body, note_type, created_at FROM notes WHERE ${conditions.join(" OR ")} ORDER BY created_at DESC LIMIT 12`,
    params,
  );
}

export async function listActivityLogs() {
  const rows = await all<{ id: string; type: string; description: string; created_at: string }>(
    "SELECT id, type, description, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 100",
  );
  return rows;
}

export async function createReferral(input: unknown) {
  const data = referralSchema.parse(input);
  const id = createId("ref");
  await run(
    `
      INSERT INTO referrals (
        id, lead_id, contact_id, referral_source, referral_partner_id, referral_code,
        conversion_value, commission_estimate, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.lead_id ?? null,
      data.contact_id ?? null,
      data.referral_source,
      data.referral_partner_id ?? null,
      data.referral_code ?? null,
      data.conversion_value,
      data.commission_estimate,
      nowIso(),
      nowIso(),
    ],
  );
  await logActivity({
    type: "referral_created",
    description: `Referral recorded from ${data.referral_source}`,
    leadId: data.lead_id ?? null,
    contactId: data.contact_id ?? null,
  });
  return { ok: true, id };
}

export async function listReferrals() {
  return all<{
    id: string;
    referral_source: string;
    referral_code: string | null;
    conversion_value: number;
    commission_estimate: number;
    created_at: string;
  }>(
    "SELECT id, referral_source, referral_code, conversion_value, commission_estimate, created_at FROM referrals ORDER BY created_at DESC",
  );
}

export async function listEmailTemplates() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoEmailTemplates;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM email_templates ORDER BY event_type ASC");
  return rows.map(mapEmailTemplate);
}

export async function updateEmailTemplate(id: string, input: unknown) {
  const data = emailTemplateSchema.parse(input);
  await run(
    `
      UPDATE email_templates
      SET name = ?, event_type = ?, subject = ?, html_content = ?, text_content = ?, is_enabled = ?, updated_at = ?
      WHERE id = ?
    `,
    [data.name, data.event_type, data.subject, data.html_content, data.text_content, data.is_enabled, nowIso(), id],
  );
  return first<Record<string, unknown>>("SELECT * FROM email_templates WHERE id = ? LIMIT 1", [id]).then((row) =>
    row ? mapEmailTemplate(row) : null,
  );
}

export async function listEmailLogs() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoEmailLogs;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 100");
  return rows.map(mapEmailLog);
}

export async function resendEmailLog(id: string) {
  const log = await first<{ recipient_email: string; event_type: string }>(
    "SELECT recipient_email, event_type FROM email_logs WHERE id = ? LIMIT 1",
    [id],
  );
  if (!log) {
    return null;
  }
  const config = await getServerConfig();
  const customerName = getNameFromEmail(log.recipient_email);

  return sendTransactionalEmail({
    eventType: log.event_type as EmailEventType,
    recipientEmail: log.recipient_email,
    context: {
      CUSTOMER_NAME: customerName,
      PORTAL_LINK: config.portalUrl,
      ORDER_NUMBER: id,
      ORDER_LINK: config.portalUrl,
      ORDER_TOTAL: formatCurrency(149.99),
      SHIPPING_ADDRESS: "Available in your secure account",
      TRACKING_LINK: config.portalUrl,
      TRACKING_NUMBER: "Available in your secure account",
      CARRIER: "Carrier update pending",
      ESTIMATED_DELIVERY: "Available in your secure account",
      TICKET_NUMBER: id,
      SUPPORT_TICKET_LINK: config.portalUrl,
      CUSTOMER_EMAIL: log.recipient_email,
      SUBMITTED_AT: nowIso(),
      ADMIN_LINK: joinUrl(config.appUrl, "/admin/crm/leads"),
      ADMIN_ORDER_LINK: joinUrl(config.appUrl, "/admin/crm/orders"),
      PAYMENT_STATUS: "Paid",
      SUPPORT_EMAIL: config.supportEmail,
      WEBSITE_URL: config.appUrl,
    },
  });
}

export async function sendTestEmail(recipientEmail: string) {
  const config = await getServerConfig();
  return sendTransactionalEmail({
    eventType: "user_signup",
    recipientEmail,
    templateAlias: "apex-welcome-account-created",
    context: {
      CUSTOMER_NAME: "Test Customer",
      PORTAL_LINK: config.portalUrl,
      SUPPORT_EMAIL: config.supportEmail,
      WEBSITE_URL: config.appUrl,
    },
  });
}

export async function createFormSubmission(input: unknown, requestMeta?: { ip?: string | null; userAgent?: string | null }) {
  const data = formSubmissionSchema.parse(input);
  const verification = await verifyTurnstile(data.turnstileToken, requestMeta?.ip ?? null);
  if (!verification.success) {
    return { ok: false, status: 400, error: "Security verification failed. Please try again." };
  }

  const lead = await createLead({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    product_interest: data.product_interest || "General",
    message: data.message || null,
    source: data.source,
    status: "New",
    lead_value_estimate: 0,
    assigned_user_id: null,
    next_follow_up_at: addDays(new Date(), 1).toISOString(),
  });

  const formSubmissionId = createId("form");
  await run(
    `
      INSERT INTO form_submissions (
        id, lead_id, form_type, source, payload_json, turnstile_verified, ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      formSubmissionId,
      lead?.id ?? null,
      data.form_type,
      data.source,
      JSON.stringify({ ...data, turnstileToken: undefined, metadata: data.metadata }),
      verification.success ? 1 : 0,
      requestMeta?.ip ?? null,
      requestMeta?.userAgent ?? null,
      nowIso(),
    ],
  );

  await logActivity({
    type: "form_submitted",
    description: `${data.form_type} form submitted by ${data.first_name} ${data.last_name}`,
    leadId: lead?.id ?? null,
  });

  const eventType: EmailEventType =
    data.form_type === "contact"
      ? "contact_form_submitted"
      : data.form_type === "product_interest"
        ? "product_interest_submitted"
        : data.form_type === "patient"
          ? "patient_signup"
          : "assessment_started";

  const config = await getServerConfig();
  const customerName = getDisplayName(data.first_name, data.last_name);
  const customerTemplateAlias =
    data.form_type === "contact"
      ? "apex-support-request-confirmation"
      : data.form_type === "product_interest"
        ? "apex-referral-review-update"
        : "apex-intake-submitted";

  await sendTransactionalEmail({
    eventType,
    recipientEmail: data.email,
    templateAlias: customerTemplateAlias,
    context: {
      CUSTOMER_NAME: customerName,
      PORTAL_LINK: config.portalUrl,
      TICKET_NUMBER: formSubmissionId,
      SUPPORT_TICKET_LINK: config.portalUrl,
      SUPPORT_EMAIL: config.supportEmail,
      WEBSITE_URL: config.appUrl,
    },
  });

  if (config.adminNotificationEmail) {
    await sendTransactionalEmail({
      eventType: "admin_new_lead",
      recipientEmail: config.adminNotificationEmail,
      templateAlias: "apex-admin-new-intake-submitted",
      context: {
        CUSTOMER_NAME: customerName,
        CUSTOMER_EMAIL: data.email,
        SUBMITTED_AT: nowIso(),
        ADMIN_LINK: joinUrl(config.appUrl, "/admin/crm/leads"),
        SUPPORT_EMAIL: config.supportEmail,
        WEBSITE_URL: config.appUrl,
      },
    });
  }

  if (lead?.id && data.referral_code) {
    await createReferralLeadFromCrm({
      referralCode: data.referral_code,
      customerEmail: data.email,
      customerName: customerName,
      sourcePage: String(data.metadata?.sourcePage ?? data.source ?? "/"),
      intakeStatus: data.form_type === "assessment" || data.form_type === "patient" ? "intake_submitted" : "new",
      consultationStatus: "pending",
      orderStatus: "pending",
      leadId: lead.id,
      requestMeta,
    });
  }

  return { ok: true, lead };
}

export async function getPipeline() {
  const leads = await listLeads({ sort: "created_at", direction: "desc" });
  const rows = await all<{ id: string; name: string; sort_order: number }>(
    "SELECT id, name, sort_order FROM pipeline_stages ORDER BY sort_order ASC",
  );

  const stageMap = new Map(
    (rows.length
      ? rows.map((stage) => ({ id: stage.id, name: stage.name, cards: [] as LeadRecord[] }))
      : [
          { id: "stage_new_lead", name: "New Lead", cards: [] as LeadRecord[] },
          { id: "stage_contacted", name: "Contacted", cards: [] as LeadRecord[] },
          { id: "stage_qualified", name: "Qualified", cards: [] as LeadRecord[] },
          { id: "stage_consultation_booked", name: "Consultation Booked", cards: [] as LeadRecord[] },
          { id: "stage_pending_payment", name: "Pending Payment", cards: [] as LeadRecord[] },
          { id: "stage_active_customer", name: "Active Customer", cards: [] as LeadRecord[] },
          { id: "stage_follow_up_needed", name: "Follow-Up Needed", cards: [] as LeadRecord[] },
          { id: "stage_lost", name: "Lost", cards: [] as LeadRecord[] },
        ]).map((stage) => [stage.name, stage]),
  );

  for (const lead of leads) {
    const stageName = lead.pipeline_stage_name ?? "New Lead";
    const bucket = stageMap.get(stageName);
    if (bucket) {
      bucket.cards.push(lead);
    }
  }

  return Array.from(stageMap.values());
}

export async function movePipelineLead(leadId: string, stageId: string) {
  const stage = await first<{ id: string; name: string }>("SELECT id, name FROM pipeline_stages WHERE id = ? LIMIT 1", [stageId]);
  if (!stage) {
    return null;
  }
  const lead = await getLead(leadId);
  if (!lead) {
    return null;
  }

  await run("UPDATE leads SET pipeline_stage_id = ?, updated_at = ? WHERE id = ?", [stage.id, nowIso(), leadId]);
  await run("UPDATE deals SET stage_id = ?, stage_name = ?, updated_at = ? WHERE lead_id = ?", [stage.id, stage.name, nowIso(), leadId]);

  await logActivity({
    type: "pipeline_stage_changed",
    description: `${lead.first_name} ${lead.last_name} moved to ${stage.name}`,
    leadId,
    metadata: { stage_id: stage.id, stage_name: stage.name },
  });

  return getLead(leadId);
}

export async function getReportsSnapshot() {
  const leads = await listLeads();
  const orders = await listOrders();
  const tasks = await listTasks();
  const emailLogs = await listEmailLogs();

  const byKey = (items: string[]) =>
    Object.entries(items.reduce<Record<string, number>>((acc, item) => {
      acc[item] = (acc[item] ?? 0) + 1;
      return acc;
    }, {})).map(([label, value]) => ({ label, value }));

  return {
    leadsBySource: byKey(leads.map((lead) => lead.source)),
    leadsByStatus: byKey(leads.map((lead) => lead.status)),
    productInterestBreakdown: byKey(leads.map((lead) => lead.product_interest)),
    ordersByStatus: byKey(orders.map((order) => order.status)),
    emailDeliveryStatus: byKey(emailLogs.map((log) => log.delivery_status)),
    followUpCompletion: {
      open: tasks.filter((task) => task.status === "Open").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    },
    estimatedRevenue: orders.reduce((total, order) => total + order.total, 0),
    monthlyLeadVolume: byKey(
      leads.map((lead) =>
        new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
          new Date(lead.created_at),
        ),
      ),
    ),
  };
}

export async function listFiles() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv?.DB) {
    return demoFiles;
  }
  const rows = await all<Record<string, unknown>>("SELECT * FROM files ORDER BY created_at DESC");
  return rows.map(mapFile);
}

export async function uploadFile(input: { ownerType: string; ownerId: string; filename: string; contentType: string; bytes: ArrayBuffer; uploadedByUserId?: string | null }) {
  const env = await getRuntimeEnv();
  const bucket = env?.REFERRAL_ASSETS;

  if (!bucket) {
    return { ok: false, error: "Missing R2 binding" };
  }

  const key = `${input.ownerType}/${input.ownerId}/${Date.now()}-${input.filename}`;
  await bucket.put(key, input.bytes, {
    httpMetadata: { contentType: input.contentType },
  });

  const id = createId("file");
  await run(
    "INSERT INTO files (id, owner_type, owner_id, bucket_key, filename, content_type, file_size, uploaded_by_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, input.ownerType, input.ownerId, key, input.filename, input.contentType, input.bytes.byteLength, input.uploadedByUserId ?? null, nowIso()],
  );
  await logActivity({
    type: "file_uploaded",
    description: `File uploaded: ${input.filename}`,
    metadata: { owner_type: input.ownerType, owner_id: input.ownerId },
  });
  return { ok: true, id, key };
}

export async function exportLeadsToCsv() {
  const csv = leadsToCsv(await listLeads());
  const env = await getRuntimeEnv();
  const bucket = env?.REFERRAL_ASSETS;

  if (bucket) {
    const key = `exports/leads-${Date.now()}.csv`;
    await bucket.put(key, csv, {
      httpMetadata: { contentType: "text/csv" },
    });
    await run(
      "INSERT INTO files (id, owner_type, owner_id, bucket_key, filename, content_type, file_size, uploaded_by_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [createId("file"), "export", "leads", key, key.split("/").pop() ?? "leads.csv", "text/csv", csv.length, null, nowIso()],
    );
  }
  return csv;
}
