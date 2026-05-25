import { createHash } from "node:crypto";
import QRCode from "qrcode";
import { getServerConfig, getRuntimeEnv } from "@/lib/cloudflare/env";
import { all, createId, first, nowIso, run } from "@/lib/crm/db";
import {
  DEFAULT_REFERRAL_COMMISSION_TYPE,
  DEFAULT_REFERRAL_COMMISSION_VALUE,
} from "@/lib/referrals/constants";
import { verifyTurnstile } from "@/lib/turnstile/verify";
import type {
  CommissionRecord,
  FraudReviewRecord,
  PartnerPortalSnapshot,
  PayoutRecord,
  ReferralAuditLogRecord,
  ReferralCodeRecord,
  ReferralConversionRecord,
  ReferralDashboardSnapshot,
  ReferralLeadRecord,
  ReferralPartnerRecord,
} from "@/lib/referrals/types";
import {
  commissionUpdateSchema,
  partnerPortalAuthSchema,
  payoutCreateSchema,
  payoutUpdateSchema,
  referralClickSchema,
  referralCodeSchema,
  referralLeadSchema,
  referralLeadUpdateSchema,
  referralPartnerSchema,
  referralValidateSchema,
} from "@/lib/referrals/validation";

const validationAttempts = new Map<string, { count: number; resetAt: number }>();

function hashValue(value?: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function rateLimitValidation(key: string) {
  const now = Date.now();
  const current = validationAttempts.get(key);

  if (!current || current.resetAt < now) {
    validationAttempts.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (current.count >= 10) {
    return false;
  }

  current.count += 1;
  return true;
}

async function audit(input: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const id = createId("raudit");
  const metadata = JSON.stringify(input.metadata ?? {});

  await run(
    "INSERT INTO audit_logs (id, actor_user_id, actor_email, action, entity_type, entity_id, details_json, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      input.actorId ?? null,
      input.actorEmail ?? null,
      input.action,
      input.entityType,
      input.entityId ?? null,
      metadata,
      metadata,
      nowIso(),
    ],
  );
}

async function getReferralCodeRow(code: string) {
  return first<{
    id: string;
    code: string;
    status: string;
    partner_id: string | null;
    partner_name: string | null;
    landing_url: string | null;
  }>(
    `
      SELECT
        referral_codes.id,
        referral_codes.code,
        referral_codes.status,
        referral_codes.partner_id,
        referral_partners.name AS partner_name,
        referral_codes.landing_url
      FROM referral_codes
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      WHERE upper(referral_codes.code) = upper(?)
      LIMIT 1
    `,
    [code],
  );
}

async function ensureQrAsset(code: string, landingUrl: string) {
  const env = await getRuntimeEnv();
  const qrSvg = await QRCode.toString(landingUrl, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#0B1B35",
      light: "#FFFFFF",
    },
  });

  if (!env?.REFERRAL_ASSETS) {
    return { key: null, svg: qrSvg };
  }

  const key = `qr/${code}.svg`;
  await env.REFERRAL_ASSETS.put(key, qrSvg, {
    httpMetadata: { contentType: "image/svg+xml" },
  });

  return { key, svg: qrSvg };
}

async function calculateCommissionAmount(
  partnerId: string | null,
  referralCode: string,
  orderTotal: number,
) {
  const partner = partnerId
    ? await first<{ commission_type: string; commission_value: number }>(
        "SELECT commission_type, commission_value FROM referral_partners WHERE id = ? LIMIT 1",
        [partnerId],
      )
    : await first<{ commission_type: string; commission_value: number }>(
        `
          SELECT referral_partners.commission_type, referral_partners.commission_value
          FROM referral_codes
          LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
          WHERE referral_codes.code = ?
          LIMIT 1
        `,
        [referralCode],
      );

  if (!partner) {
    return {
      commission_type: DEFAULT_REFERRAL_COMMISSION_TYPE,
      commission_value: DEFAULT_REFERRAL_COMMISSION_VALUE,
      commission_amount: Number(
        (orderTotal * (DEFAULT_REFERRAL_COMMISSION_VALUE / 100)).toFixed(2),
      ),
    };
  }

  const commissionAmount =
    partner.commission_type === "percentage"
      ? Number((orderTotal * (Number(partner.commission_value) / 100)).toFixed(2))
      : Number(partner.commission_value ?? 0);

  return {
    commission_type: partner.commission_type,
    commission_value: Number(partner.commission_value ?? 0),
    commission_amount: commissionAmount,
  };
}

function mapPartner(row: Record<string, unknown>): ReferralPartnerRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    company_name: row.company_name ? String(row.company_name) : null,
    email: row.email ? String(row.email) : null,
    phone: row.phone ? String(row.phone) : null,
    referral_code: row.referral_code ? String(row.referral_code) : null,
    commission_type: String(row.commission_type ?? "flat") as ReferralPartnerRecord["commission_type"],
    commission_value: Number(row.commission_value ?? 0),
    status: String(row.status ?? "pending") as ReferralPartnerRecord["status"],
    notes: row.notes ? String(row.notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapCode(row: Record<string, unknown>): ReferralCodeRecord {
  return {
    id: String(row.id),
    partner_id: row.partner_id ? String(row.partner_id) : null,
    partner_name: row.partner_name ? String(row.partner_name) : null,
    code: String(row.code),
    status: String(row.status ?? "active") as ReferralCodeRecord["status"],
    landing_url: row.landing_url ? String(row.landing_url) : null,
    qr_image_key: row.qr_image_key ? String(row.qr_image_key) : null,
    qr_svg: row.qr_svg ? String(row.qr_svg) : null,
    clicks: Number(row.clicks ?? 0),
    leads: Number(row.leads ?? 0),
    conversions: Number(row.conversions ?? 0),
    revenue: Number(row.revenue ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapLead(row: Record<string, unknown>): ReferralLeadRecord {
  return {
    id: String(row.id),
    referral_code: String(row.referral_code),
    customer_email_hash: String(row.customer_email_hash),
    customer_name: String(row.customer_name),
    source_page: String(row.source_page),
    intake_status: String(row.intake_status) as ReferralLeadRecord["intake_status"],
    consultation_status: String(row.consultation_status ?? "pending"),
    order_status: String(row.order_status ?? "pending"),
    ip_hash: row.ip_hash ? String(row.ip_hash) : null,
    user_agent_hash: row.user_agent_hash ? String(row.user_agent_hash) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapConversion(row: Record<string, unknown>): ReferralConversionRecord {
  return {
    id: String(row.id),
    lead_id: row.lead_id ? String(row.lead_id) : null,
    referral_code: String(row.referral_code),
    order_id: row.order_id ? String(row.order_id) : null,
    product_name: String(row.product_name),
    order_total: Number(row.order_total ?? 0),
    conversion_status: String(row.conversion_status ?? "pending"),
    partner_name: row.partner_name ? String(row.partner_name) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapCommission(row: Record<string, unknown>): CommissionRecord {
  return {
    id: String(row.id),
    partner_id: row.partner_id ? String(row.partner_id) : null,
    partner_name: row.partner_name ? String(row.partner_name) : null,
    referral_code: String(row.referral_code),
    conversion_id: row.conversion_id ? String(row.conversion_id) : null,
    commission_type: String(row.commission_type ?? "flat") as CommissionRecord["commission_type"],
    commission_value: Number(row.commission_value ?? 0),
    commission_amount: Number(row.commission_amount ?? 0),
    status: String(row.status ?? "pending") as CommissionRecord["status"],
    adjustment_reason: row.adjustment_reason ? String(row.adjustment_reason) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapPayout(row: Record<string, unknown>): PayoutRecord {
  return {
    id: String(row.id),
    partner_id: row.partner_id ? String(row.partner_id) : null,
    partner_name: row.partner_name ? String(row.partner_name) : null,
    amount: Number(row.amount ?? 0),
    status: String(row.status ?? "pending") as PayoutRecord["status"],
    payment_method: row.payment_method ? String(row.payment_method) : null,
    payment_notes: row.payment_notes ? String(row.payment_notes) : null,
    paid_at: row.paid_at ? String(row.paid_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listReferralPartners() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        referral_partners.*,
        (
          SELECT code
          FROM referral_codes
          WHERE referral_codes.partner_id = referral_partners.id
          ORDER BY referral_codes.created_at ASC
          LIMIT 1
        ) AS referral_code
      FROM referral_partners
      ORDER BY referral_partners.created_at DESC
    `,
  );

  return rows.map(mapPartner);
}

export async function createReferralPartner(input: unknown, actorEmail?: string | null) {
  const data = referralPartnerSchema.parse(input);
  const id = createId("rpartner");
  const now = nowIso();

  await run(
    `
      INSERT INTO referral_partners (
        id, name, company_name, email, phone, status, commission_type, commission_value, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.name,
      data.company_name ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.status,
      data.commission_type,
      data.commission_value,
      data.notes ?? null,
      now,
      now,
    ],
  );

  if (data.referral_code) {
    await createReferralCode(
      {
        partner_id: id,
        code: data.referral_code,
        landing_url: "/",
        status: "active",
      },
      actorEmail,
    );
  }

  await audit({
    actorEmail,
    action: "partner.created",
    entityType: "referral_partner",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        referral_partners.*,
        (
          SELECT code FROM referral_codes WHERE referral_codes.partner_id = referral_partners.id LIMIT 1
        ) AS referral_code
      FROM referral_partners
      WHERE referral_partners.id = ?
      LIMIT 1
    `,
    [id],
  ).then((row) => (row ? mapPartner(row) : null));
}

export async function updateReferralPartner(id: string, input: unknown, actorEmail?: string | null) {
  const data = referralPartnerSchema.partial().parse(input);
  const existing = await first<Record<string, unknown>>("SELECT * FROM referral_partners WHERE id = ? LIMIT 1", [id]);
  if (!existing) {
    return null;
  }
  const nextName = String(data.name ?? existing.name ?? "");
  const nextCompanyName =
    data.company_name !== undefined ? data.company_name : existing.company_name ? String(existing.company_name) : null;
  const nextEmail = data.email !== undefined ? data.email : existing.email ? String(existing.email) : null;
  const nextPhone = data.phone !== undefined ? data.phone : existing.phone ? String(existing.phone) : null;
  const nextStatus = String(data.status ?? existing.status ?? "pending");
  const nextCommissionType = String(data.commission_type ?? existing.commission_type ?? "flat");
  const nextCommissionValue = Number(data.commission_value ?? existing.commission_value ?? 0);
  const nextNotes = data.notes !== undefined ? data.notes : existing.notes ? String(existing.notes) : null;
  const updatedAt = nowIso();

  await run(
    `
      UPDATE referral_partners
      SET name = ?, company_name = ?, email = ?, phone = ?, status = ?, commission_type = ?, commission_value = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      nextName,
      nextCompanyName,
      nextEmail,
      nextPhone,
      nextStatus,
      nextCommissionType,
      nextCommissionValue,
      nextNotes,
      updatedAt,
      id,
    ],
  );

  await audit({
    actorEmail,
    action: "partner.updated",
    entityType: "referral_partner",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        referral_partners.*,
        (
          SELECT code FROM referral_codes WHERE referral_codes.partner_id = referral_partners.id LIMIT 1
        ) AS referral_code
      FROM referral_partners
      WHERE referral_partners.id = ?
      LIMIT 1
    `,
    [id],
  ).then((row) => (row ? mapPartner(row) : null));
}

export async function listReferralCodes() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        referral_codes.*,
        referral_partners.name AS partner_name,
        (SELECT COUNT(*) FROM referral_clicks WHERE referral_clicks.referral_code = referral_codes.code) AS clicks,
        (SELECT COUNT(*) FROM referral_leads WHERE referral_leads.referral_code = referral_codes.code) AS leads,
        (SELECT COUNT(*) FROM referral_conversions WHERE referral_conversions.referral_code = referral_codes.code) AS conversions,
        (SELECT COALESCE(SUM(order_total), 0) FROM referral_conversions WHERE referral_conversions.referral_code = referral_codes.code) AS revenue,
        NULL AS qr_svg
      FROM referral_codes
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      ORDER BY referral_codes.created_at DESC
    `,
  );

  return Promise.all(
    rows.map(async (row) => {
      const mapped = mapCode(row);
      if (mapped.landing_url) {
        const { svg } = await ensureQrAsset(mapped.code, mapped.landing_url);
        mapped.qr_svg = svg;
      }
      return mapped;
    }),
  );
}

export async function createReferralCode(input: unknown, actorEmail?: string | null) {
  const data = referralCodeSchema.parse(input);
  const config = await getServerConfig();
  const id = createId("rcode");
  const now = nowIso();
  const code = data.code.trim().toUpperCase();
  const landingUrl = data.landing_url?.trim()
    ? data.landing_url.trim().startsWith("http")
      ? data.landing_url.trim()
      : `${config.appUrl.replace(/\/$/, "")}${data.landing_url.trim().startsWith("/") ? data.landing_url.trim() : `/${data.landing_url.trim()}`}`
    : `${config.appUrl.replace(/\/$/, "")}/?ref=${encodeURIComponent(code)}`;
  const qrAsset = await ensureQrAsset(code, landingUrl);

  await run(
    `
      INSERT INTO referral_codes (
        id, partner_id, code, status, landing_url, qr_image_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.partner_id ?? null,
      code,
      data.status,
      landingUrl,
      qrAsset.key,
      now,
      now,
    ],
  );

  await audit({
    actorEmail,
    action: "referral_code.created",
    entityType: "referral_code",
    entityId: id,
    metadata: { ...data, code, landingUrl },
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        referral_codes.*,
        referral_partners.name AS partner_name,
        0 AS clicks,
        0 AS leads,
        0 AS conversions,
        0 AS revenue,
        ? AS qr_svg
      FROM referral_codes
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      WHERE referral_codes.id = ?
      LIMIT 1
    `,
    [qrAsset.svg, id],
  ).then((row) => (row ? mapCode(row) : null));
}

export async function updateReferralCode(id: string, input: unknown, actorEmail?: string | null) {
  const data = referralCodeSchema.partial().parse(input);
  const existing = await first<Record<string, unknown>>("SELECT * FROM referral_codes WHERE id = ? LIMIT 1", [id]);
  if (!existing) {
    return null;
  }

  const config = await getServerConfig();
  const nextCode = String(data.code ?? existing.code).trim().toUpperCase();
  const nextPartnerId =
    data.partner_id !== undefined
      ? data.partner_id
      : existing.partner_id
        ? String(existing.partner_id)
        : null;
  const nextStatus = String(data.status ?? existing.status ?? "active");
  const landingUrl = data.landing_url?.trim()
    ? data.landing_url.trim().startsWith("http")
      ? data.landing_url.trim()
      : `${config.appUrl.replace(/\/$/, "")}${data.landing_url.trim().startsWith("/") ? data.landing_url.trim() : `/${data.landing_url.trim()}`}`
    : String(existing.landing_url ?? `${config.appUrl.replace(/\/$/, "")}/?ref=${encodeURIComponent(nextCode)}`);
  const qrAsset = await ensureQrAsset(nextCode, landingUrl);
  const updatedAt = nowIso();

  await run(
    `
      UPDATE referral_codes
      SET partner_id = ?, code = ?, status = ?, landing_url = ?, qr_image_key = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      nextPartnerId,
      nextCode,
      nextStatus,
      landingUrl,
      qrAsset.key,
      updatedAt,
      id,
    ],
  );

  await audit({
    actorEmail,
    action: "referral_code.updated",
    entityType: "referral_code",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        referral_codes.*,
        referral_partners.name AS partner_name,
        (SELECT COUNT(*) FROM referral_clicks WHERE referral_clicks.referral_code = referral_codes.code) AS clicks,
        (SELECT COUNT(*) FROM referral_leads WHERE referral_leads.referral_code = referral_codes.code) AS leads,
        (SELECT COUNT(*) FROM referral_conversions WHERE referral_conversions.referral_code = referral_codes.code) AS conversions,
        (SELECT COALESCE(SUM(order_total), 0) FROM referral_conversions WHERE referral_conversions.referral_code = referral_codes.code) AS revenue,
        ? AS qr_svg
      FROM referral_codes
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      WHERE referral_codes.id = ?
      LIMIT 1
    `,
    [qrAsset.svg, id],
  ).then((row) => (row ? mapCode(row) : null));
}

export async function validateReferralCode(
  input: unknown,
  requestMeta?: { ip?: string | null; userAgent?: string | null },
) {
  const data = referralValidateSchema.parse(input);
  const rateKey = hashValue(requestMeta?.ip ?? data.code) ?? data.code;

  if (!rateLimitValidation(rateKey)) {
    return { ok: false, error: "Too many validation attempts. Please try again shortly." };
  }

  if (data.turnstileToken) {
    const verification = await verifyTurnstile(data.turnstileToken, requestMeta?.ip ?? null);
    if (!verification.success) {
      return { ok: false, error: "Security verification failed. Please try again." };
    }
  }

  const row = await getReferralCodeRow(data.code);
  if (!row || row.status !== "active") {
    return { ok: false, error: "Please enter a valid referral code to continue." };
  }

  return {
    ok: true,
    data: {
      code: row.code,
      partner_name: row.partner_name,
      landing_url: row.landing_url,
      source_page: data.source_page,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
    },
  };
}

export async function recordReferralClick(
  input: unknown,
  requestMeta?: { ip?: string | null; userAgent?: string | null },
) {
  const data = referralClickSchema.parse(input);
  const row = await getReferralCodeRow(data.code);
  if (!row || row.status !== "active") {
    return { ok: false, error: "Invalid referral code" };
  }

  const id = createId("rclick");
  await run(
    `
      INSERT INTO referral_clicks (
        id, referral_code, source_page, utm_source, utm_medium, utm_campaign, ip_hash, user_agent_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      row.code,
      data.source_page,
      data.utm_source || null,
      data.utm_medium || null,
      data.utm_campaign || null,
      hashValue(requestMeta?.ip),
      hashValue(requestMeta?.userAgent),
      nowIso(),
    ],
  );

  return { ok: true, data: { id, code: row.code } };
}

export async function createReferralLead(
  input: unknown,
  requestMeta?: { ip?: string | null; userAgent?: string | null },
) {
  const data = referralLeadSchema.parse(input);
  const row = await getReferralCodeRow(data.referral_code);
  if (!row || row.status !== "active") {
    return { ok: false, error: "Please enter a valid referral code to continue." };
  }

  const id = createId("rlead");
  const now = nowIso();
  await run(
    `
      INSERT INTO referral_leads (
        id, referral_code, customer_email_hash, customer_name, source_page, intake_status, consultation_status, order_status, ip_hash, user_agent_hash, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      row.code,
      hashValue(data.customer_email) ?? "",
      data.customer_name,
      data.source_page,
      data.intake_status,
      data.consultation_status,
      data.order_status,
      hashValue(requestMeta?.ip),
      hashValue(requestMeta?.userAgent),
      now,
      now,
    ],
  );

  return {
    ok: true,
    data: {
      id,
      referral_code: row.code,
    },
  };
}

export async function createReferralLeadFromCrm(input: {
  referralCode: string;
  customerEmail: string;
  customerName: string;
  sourcePage: string;
  intakeStatus?: string;
  consultationStatus?: string;
  orderStatus?: string;
  leadId?: string | null;
  requestMeta?: { ip?: string | null; userAgent?: string | null };
}) {
  const created = await createReferralLead(
    {
      referral_code: input.referralCode,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
      source_page: input.sourcePage,
      intake_status: input.intakeStatus ?? "intake_submitted",
      consultation_status: input.consultationStatus ?? "pending",
      order_status: input.orderStatus ?? "pending",
    },
    input.requestMeta,
  );

  if (created.ok && input.leadId) {
    await run("UPDATE leads SET referral_code = ? WHERE id = ?", [input.referralCode, input.leadId]);
  }

  return created;
}

export async function listReferralLeads() {
  const rows = await all<Record<string, unknown>>(
    "SELECT * FROM referral_leads ORDER BY created_at DESC",
  );
  return rows.map(mapLead);
}

export async function updateReferralLead(id: string, input: unknown, actorEmail?: string | null) {
  const data = referralLeadUpdateSchema.parse(input);
  const existing = await first<Record<string, unknown>>("SELECT * FROM referral_leads WHERE id = ? LIMIT 1", [id]);
  if (!existing) {
    return null;
  }
  const nextIntakeStatus = String(data.intake_status ?? existing.intake_status ?? "new");
  const nextConsultationStatus = String(
    data.consultation_status ?? existing.consultation_status ?? "pending",
  );
  const nextOrderStatus = String(data.order_status ?? existing.order_status ?? "pending");
  const updatedAt = nowIso();

  await run(
    `
      UPDATE referral_leads
      SET intake_status = ?, consultation_status = ?, order_status = ?, updated_at = ?
      WHERE id = ?
    `,
    [nextIntakeStatus, nextConsultationStatus, nextOrderStatus, updatedAt, id],
  );

  await audit({
    actorEmail,
    action: "referral_lead.updated",
    entityType: "referral_lead",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>("SELECT * FROM referral_leads WHERE id = ? LIMIT 1", [id]).then((row) =>
    row ? mapLead(row) : null,
  );
}

export async function createReferralConversionFromOrder(input: {
  referralCode: string;
  orderId: string;
  productName: string;
  orderTotal: number;
  customerEmail?: string | null;
  customerName?: string | null;
  sourcePage?: string;
  requestMeta?: { ip?: string | null; userAgent?: string | null };
}) {
  const row = await getReferralCodeRow(input.referralCode);
  if (!row || row.status !== "active") {
    return null;
  }
  let leadId: string | null = null;

  if (input.customerEmail) {
    const existingLead = await first<{ id: string }>(
      `
        SELECT id
        FROM referral_leads
        WHERE referral_code = ? AND customer_email_hash = ?
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [row.code, hashValue(input.customerEmail)],
    );

    if (existingLead?.id) {
      leadId = existingLead.id;
    } else {
      const createdLead = await createReferralLead(
        {
          referral_code: row.code,
          customer_email: input.customerEmail,
          customer_name: input.customerName ?? "Apex Wellness Customer",
          source_page: input.sourcePage ?? "/cart",
          intake_status: "approved",
          consultation_status: "approved",
          order_status: "purchased",
        },
        input.requestMeta,
      );
      if (createdLead.ok && createdLead.data) {
        leadId = createdLead.data.id;
      }
    }
  }
  const conversionId = createId("rconv");
  const now = nowIso();

  await run(
    `
      INSERT INTO referral_conversions (
        id, lead_id, referral_code, order_id, product_name, order_total, conversion_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      conversionId,
      leadId,
      row.code,
      input.orderId,
      input.productName,
      input.orderTotal,
      "approved",
      now,
      now,
    ],
  );

  if (leadId) {
    await run(
      "UPDATE referral_leads SET order_status = ?, intake_status = ?, consultation_status = ?, updated_at = ? WHERE id = ?",
      ["purchased", "approved", "approved", now, leadId],
    );
  }

  const commissionInfo = await calculateCommissionAmount(row.partner_id, row.code, input.orderTotal);
  const commissionId = createId("rcomm");

  await run(
    `
      INSERT INTO commissions (
        id, partner_id, referral_code, conversion_id, commission_type, commission_value, commission_amount, status, adjustment_reason, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      commissionId,
      row.partner_id,
      row.code,
      conversionId,
      commissionInfo.commission_type,
      commissionInfo.commission_value,
      commissionInfo.commission_amount,
      "pending",
      null,
      now,
      now,
    ],
  );

  await run("UPDATE orders SET referral_code = ? WHERE id = ?", [row.code, input.orderId]);

  return { conversionId, commissionId, leadId };
}

export async function listReferralConversions() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        referral_conversions.*,
        referral_partners.name AS partner_name
      FROM referral_conversions
      LEFT JOIN referral_codes ON referral_codes.code = referral_conversions.referral_code
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      ORDER BY referral_conversions.created_at DESC
    `,
  );
  return rows.map(mapConversion);
}

export async function listCommissions() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        commissions.*,
        referral_partners.name AS partner_name
      FROM commissions
      LEFT JOIN referral_partners ON referral_partners.id = commissions.partner_id
      ORDER BY commissions.created_at DESC
    `,
  );
  return rows.map(mapCommission);
}

export async function updateCommission(id: string, input: unknown, actorEmail?: string | null) {
  const data = commissionUpdateSchema.parse(input);
  const existing = await first<Record<string, unknown>>("SELECT * FROM commissions WHERE id = ? LIMIT 1", [id]);
  if (!existing) {
    return null;
  }
  const nextStatus = String(data.status ?? existing.status ?? "pending");
  const nextAdjustmentReason =
    data.adjustment_reason !== undefined
      ? data.adjustment_reason
      : existing.adjustment_reason
        ? String(existing.adjustment_reason)
        : null;
  const nextCommissionAmount = Number(
    data.commission_amount ?? existing.commission_amount ?? 0,
  );
  const updatedAt = nowIso();

  await run(
    `
      UPDATE commissions
      SET status = ?, adjustment_reason = ?, commission_amount = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      nextStatus,
      nextAdjustmentReason,
      nextCommissionAmount,
      updatedAt,
      id,
    ],
  );

  await audit({
    actorEmail,
    action: "commission.updated",
    entityType: "commission",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        commissions.*,
        referral_partners.name AS partner_name
      FROM commissions
      LEFT JOIN referral_partners ON referral_partners.id = commissions.partner_id
      WHERE commissions.id = ?
      LIMIT 1
    `,
    [id],
  ).then((row) => (row ? mapCommission(row) : null));
}

export async function listPayouts() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        payouts.*,
        referral_partners.name AS partner_name
      FROM payouts
      LEFT JOIN referral_partners ON referral_partners.id = payouts.partner_id
      ORDER BY payouts.created_at DESC
    `,
  );
  return rows.map(mapPayout);
}

export async function createPayout(input: unknown, actorEmail?: string | null) {
  const data = payoutCreateSchema.parse(input);
  const id = createId("rpayout");
  const now = nowIso();

  await run(
    `
      INSERT INTO payouts (
        id, partner_id, amount, status, payment_method, payment_notes, paid_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      data.partner_id,
      data.amount,
      data.status,
      data.payment_method ?? null,
      data.payment_notes ?? null,
      data.status === "paid" ? now : null,
      now,
      now,
    ],
  );

  await audit({
    actorEmail,
    action: "payout.created",
    entityType: "payout",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        payouts.*,
        referral_partners.name AS partner_name
      FROM payouts
      LEFT JOIN referral_partners ON referral_partners.id = payouts.partner_id
      WHERE payouts.id = ?
      LIMIT 1
    `,
    [id],
  ).then((row) => (row ? mapPayout(row) : null));
}

export async function updatePayout(id: string, input: unknown, actorEmail?: string | null) {
  const data = payoutUpdateSchema.parse(input);
  const existing = await first<Record<string, unknown>>("SELECT * FROM payouts WHERE id = ? LIMIT 1", [id]);
  if (!existing) {
    return null;
  }
  const nextStatus = String(data.status ?? existing.status ?? "pending");
  const nextPaymentMethod =
    data.payment_method !== undefined
      ? data.payment_method
      : existing.payment_method
        ? String(existing.payment_method)
        : null;
  const nextPaymentNotes =
    data.payment_notes !== undefined
      ? data.payment_notes
      : existing.payment_notes
        ? String(existing.payment_notes)
        : null;
  const nextPaidAt =
    nextStatus === "paid"
      ? data.paid_at ?? nowIso()
      : data.paid_at ?? (existing.paid_at ? String(existing.paid_at) : null);
  const updatedAt = nowIso();

  await run(
    `
      UPDATE payouts
      SET status = ?, payment_method = ?, payment_notes = ?, paid_at = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      nextStatus,
      nextPaymentMethod,
      nextPaymentNotes,
      nextPaidAt,
      updatedAt,
      id,
    ],
  );

  await audit({
    actorEmail,
    action: "payout.updated",
    entityType: "payout",
    entityId: id,
    metadata: data,
  });

  return first<Record<string, unknown>>(
    `
      SELECT
        payouts.*,
        referral_partners.name AS partner_name
      FROM payouts
      LEFT JOIN referral_partners ON referral_partners.id = payouts.partner_id
      WHERE payouts.id = ?
      LIMIT 1
    `,
    [id],
  ).then((row) => (row ? mapPayout(row) : null));
}

export async function getFraudReview() {
  const leads = await listReferralLeads();
  const conversions = await listReferralConversions();
  const emailCounts = new Map<string, number>();
  const ipCounts = new Map<string, number>();
  const uaCounts = new Map<string, number>();
  const codeClicks = new Map<string, number>();
  const codeConversions = new Map<string, number>();
  const partnerEmailHashes = new Map<string, string>();
  const partners = await listReferralPartners();

  for (const partner of partners) {
    if (partner.email) {
      partnerEmailHashes.set(partner.referral_code ?? "", hashValue(partner.email) ?? "");
    }
  }

  const clicks = await all<{ referral_code: string; total: number }>(
    "SELECT referral_code, COUNT(*) AS total FROM referral_clicks GROUP BY referral_code",
  );
  for (const row of clicks) {
    codeClicks.set(String(row.referral_code), Number(row.total ?? 0));
  }

  for (const conversion of conversions) {
    codeConversions.set(
      conversion.referral_code,
      (codeConversions.get(conversion.referral_code) ?? 0) + 1,
    );
  }

  for (const lead of leads) {
    emailCounts.set(lead.customer_email_hash, (emailCounts.get(lead.customer_email_hash) ?? 0) + 1);
    if (lead.ip_hash) {
      ipCounts.set(lead.ip_hash, (ipCounts.get(lead.ip_hash) ?? 0) + 1);
    }
    if (lead.user_agent_hash) {
      uaCounts.set(lead.user_agent_hash, (uaCounts.get(lead.user_agent_hash) ?? 0) + 1);
    }
  }

  return leads
    .map<FraudReviewRecord>((lead) => {
      const reasons: string[] = [];

      if ((emailCounts.get(lead.customer_email_hash) ?? 0) > 1) {
        reasons.push("Duplicate email hash");
      }
      if (lead.ip_hash && (ipCounts.get(lead.ip_hash) ?? 0) > 1) {
        reasons.push("Duplicate IP hash");
      }
      if (lead.user_agent_hash && (uaCounts.get(lead.user_agent_hash) ?? 0) > 2) {
        reasons.push("Multiple accounts from same device hash");
      }
      const partnerHash = partnerEmailHashes.get(lead.referral_code);
      if (partnerHash && partnerHash === lead.customer_email_hash) {
        reasons.push("Potential self-referral");
      }
      const clickCount = codeClicks.get(lead.referral_code) ?? 0;
      const conversionCount = codeConversions.get(lead.referral_code) ?? 0;
      if (clickCount >= 3 && conversionCount / clickCount > 0.85) {
        reasons.push("Unusually high conversion rate");
      }
      if (conversionCount >= 3 && lead.order_status === "purchased") {
        reasons.push("Repeated suspicious conversions");
      }

      return {
        id: lead.id,
        referral_code: lead.referral_code,
        customer_name: lead.customer_name,
        reasons,
        status: reasons.length ? "flagged" : "clear",
        created_at: lead.created_at,
      };
    })
    .filter((item) => item.status !== "clear" || item.reasons.length > 0);
}

export async function getReferralAdminDashboard() {
  const counts = await first<{
    total_clicks: number;
    active_partners: number;
    pending_leads: number;
    approved_conversions: number;
    estimated_commissions: number;
    purchases: number;
  }>(
    `
      SELECT
        (SELECT COUNT(*) FROM referral_clicks) AS total_clicks,
        (SELECT COUNT(*) FROM referral_partners WHERE status = 'active') AS active_partners,
        (SELECT COUNT(*) FROM referral_leads WHERE intake_status IN ('new', 'intake_started', 'intake_submitted', 'consultation_pending')) AS pending_leads,
        (SELECT COUNT(*) FROM referral_conversions WHERE conversion_status = 'approved') AS approved_conversions,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM commissions WHERE status IN ('pending', 'approved', 'adjusted')) AS estimated_commissions,
        (SELECT COUNT(*) FROM referral_leads WHERE order_status = 'purchased') AS purchases
    `,
  );

  const revenueByPartner = await all<{ label: string; value: number }>(
    `
      SELECT
        COALESCE(referral_partners.name, 'Unassigned') AS label,
        COALESCE(SUM(referral_conversions.order_total), 0) AS value
      FROM referral_conversions
      LEFT JOIN referral_codes ON referral_codes.code = referral_conversions.referral_code
      LEFT JOIN referral_partners ON referral_partners.id = referral_codes.partner_id
      GROUP BY COALESCE(referral_partners.name, 'Unassigned')
      ORDER BY value DESC
      LIMIT 6
    `,
  );

  const recentClicks = await all<{ id: string; referral_code: string; created_at: string }>(
    "SELECT id, referral_code, created_at FROM referral_clicks ORDER BY created_at DESC LIMIT 4",
  );
  const recentLeads = await all<{ id: string; customer_name: string; referral_code: string; created_at: string }>(
    "SELECT id, customer_name, referral_code, created_at FROM referral_leads ORDER BY created_at DESC LIMIT 4",
  );
  const recentConversions = await all<{ id: string; product_name: string; referral_code: string; created_at: string }>(
    "SELECT id, product_name, referral_code, created_at FROM referral_conversions ORDER BY created_at DESC LIMIT 4",
  );

  const recentActivity = [
    ...recentClicks.map((row) => ({
      id: row.id,
      type: "click",
      description: `Referral click captured for ${row.referral_code}`,
      created_at: row.created_at,
    })),
    ...recentLeads.map((row) => ({
      id: row.id,
      type: "lead",
      description: `Referral lead created for ${row.customer_name}`,
      created_at: row.created_at,
    })),
    ...recentConversions.map((row) => ({
      id: row.id,
      type: "conversion",
      description: `Conversion recorded for ${row.product_name}`,
      created_at: row.created_at,
    })),
  ]
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .slice(0, 8);

  const funnel = {
    clicks: Number(counts?.total_clicks ?? 0),
    leads: (await first<{ total: number }>("SELECT COUNT(*) AS total FROM referral_leads"))?.total ?? 0,
    approvedConversions: Number(counts?.approved_conversions ?? 0),
    purchases: Number(counts?.purchases ?? 0),
  };

  const snapshot: ReferralDashboardSnapshot = {
    cards: [
      { label: "Total referrals", value: Number(counts?.total_clicks ?? 0), helper: "Tracked referral clicks" },
      { label: "Active partners", value: Number(counts?.active_partners ?? 0), helper: "Partners with active status" },
      { label: "Pending leads", value: Number(counts?.pending_leads ?? 0), helper: "Leads awaiting completion or review" },
      { label: "Approved conversions", value: Number(counts?.approved_conversions ?? 0), helper: "Conversions approved for commission tracking" },
      { label: "Estimated commissions", value: Number(counts?.estimated_commissions ?? 0), helper: "Pending and approved commission exposure" },
      { label: "Revenue by partner", value: revenueByPartner.length, helper: "Partners with attributed revenue" },
    ],
    revenueByPartner,
    recentActivity,
    funnel,
  };

  return snapshot;
}

export async function listReferralAuditLogs() {
  const rows = await all<Record<string, unknown>>(
    `
      SELECT
        id,
        actor_user_id AS actor_id,
        actor_email,
        action,
        entity_type,
        entity_id,
        COALESCE(metadata, details_json) AS metadata,
        created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 100
    `,
  );

  return rows as ReferralAuditLogRecord[];
}

export async function exportReferralReportCsv() {
  const codes = await listReferralCodes();
  const rows = [
    ["Code", "Status", "Partner", "Clicks", "Leads", "Conversions", "Revenue"],
    ...codes.map((code) => [
      code.code,
      code.status,
      code.partner_name ?? "",
      String(code.clicks),
      String(code.leads),
      String(code.conversions),
      String(code.revenue),
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
}

export async function getPartnerPortalSnapshot(input: unknown) {
  const data = partnerPortalAuthSchema.parse(input);
  if (data.turnstileToken) {
    const verification = await verifyTurnstile(data.turnstileToken);
    if (!verification.success) {
      return { ok: false, error: "Security verification failed. Please try again." };
    }
  }

  const partner = await first<Record<string, unknown>>(
    `
      SELECT
        referral_partners.*,
        (
          SELECT code FROM referral_codes WHERE referral_codes.partner_id = referral_partners.id LIMIT 1
        ) AS referral_code
      FROM referral_partners
      LEFT JOIN referral_codes ON referral_codes.partner_id = referral_partners.id
      WHERE lower(referral_partners.email) = lower(?) AND upper(referral_codes.code) = upper(?)
      LIMIT 1
    `,
    [data.email, data.code],
  );

  if (!partner) {
    return { ok: false, error: "Partner access could not be verified." };
  }

  const partnerRecord = mapPartner(partner);
  const codes = (await listReferralCodes()).filter((code) => code.partner_id === partnerRecord.id);
  const conversions = (await listReferralConversions()).filter((item) => codes.some((code) => code.code === item.referral_code));
  const commissions = (await listCommissions()).filter((item) => item.partner_id === partnerRecord.id);
  const payouts = (await listPayouts()).filter((item) => item.partner_id === partnerRecord.id);

  const snapshot: PartnerPortalSnapshot = {
    partner: partnerRecord,
    codes,
    conversions,
    commissions,
    payouts,
  };

  return { ok: true, data: snapshot };
}
