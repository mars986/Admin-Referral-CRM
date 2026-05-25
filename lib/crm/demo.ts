import type {
  ContactRecord,
  EmailLogRecord,
  EmailTemplateRecord,
  FileRecord,
  LeadRecord,
  OrderRecord,
  TaskRecord,
} from "@/lib/crm/types";

const now = new Date();
const iso = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

export const demoLeads: LeadRecord[] = [
  {
    id: "lead_demo_1",
    first_name: "Avery",
    last_name: "Cole",
    email: "avery@example.com",
    phone: "4805550101",
    product_interest: "TriMix",
    message: "Interested in getting started and learning about timelines.",
    source: "Website",
    status: "New",
    lead_value_estimate: 450,
    assigned_user_id: "user_admin",
    pipeline_stage_id: "stage_new_lead",
    pipeline_stage_name: "New Lead",
    next_follow_up_at: iso(1),
    last_contacted_at: null,
    created_at: iso(-1),
    updated_at: iso(-1),
  },
  {
    id: "lead_demo_2",
    first_name: "Jordan",
    last_name: "Lane",
    email: "jordan@example.com",
    phone: "4805550102",
    product_interest: "NAD+ 500MG",
    message: "Requested product availability guidance.",
    source: "Referral",
    status: "Qualified",
    lead_value_estimate: 825,
    assigned_user_id: "user_admin",
    pipeline_stage_id: "stage_pending_payment",
    pipeline_stage_name: "Pending Payment",
    next_follow_up_at: iso(2),
    last_contacted_at: iso(-2),
    created_at: iso(-4),
    updated_at: iso(-1),
  },
];

export const demoContacts: ContactRecord[] = [
  {
    id: "contact_demo_1",
    first_name: "Morgan",
    last_name: "Hayes",
    email: "morgan@example.com",
    phone: "4805550111",
    customer_status: "Active Customer",
    tags: ["Priority", "Subscription"],
    product_interests: ["PT-141", "NAD+ 500MG"],
    last_contacted_at: iso(-3),
    next_follow_up_at: iso(4),
    notes_summary: "Requested a shipment status update and refill review.",
    created_at: iso(-30),
    updated_at: iso(-1),
  },
];

export const demoOrders: OrderRecord[] = [
  {
    id: "order_demo_1",
    contact_id: "contact_demo_1",
    email: "morgan@example.com",
    status: "Shipped",
    subtotal: 329,
    total: 349,
    payment_status: "Paid",
    stripe_payment_id: "pi_demo_1",
    product_name: "PT-141",
    tracking_number: "1Z9999999999999999",
    carrier: "UPS",
    tracking_url: "https://www.ups.com/track?tracknum=1Z9999999999999999",
    shipped_at: iso(-1),
    delivered_at: null,
    created_at: iso(-2),
    updated_at: iso(-1),
  },
];

export const demoTasks: TaskRecord[] = [
  {
    id: "task_demo_1",
    title: "Follow up on Avery intake submission",
    description: "Confirm next-step guidance and product interest details.",
    due_at: iso(1),
    status: "Open",
    assigned_user_id: "user_admin",
    lead_id: "lead_demo_1",
    contact_id: null,
    notes: "Reach out by email first.",
    completed_at: null,
    created_at: iso(-1),
    updated_at: iso(-1),
  },
];

export const demoEmailTemplates: EmailTemplateRecord[] = [
  {
    id: "tmpl_assessment_started",
    name: "Assessment Confirmation",
    event_type: "assessment_started",
    subject: "We received your Apex Wellness assessment request",
    html_content:
      "<p>Hi {{first_name}},</p><p>Your request has been received. Our team will review it and follow up with next-step guidance.</p>",
    text_content:
      "Hi {{first_name}}, your request has been received. Our team will review it and follow up with next-step guidance.",
    is_enabled: 1,
    created_at: iso(-10),
    updated_at: iso(-1),
  },
];

export const demoEmailLogs: EmailLogRecord[] = [
  {
    id: "elog_demo_1",
    recipient_email: "morgan@example.com",
    template_id: "tmpl_assessment_started",
    event_type: "shipment_tracking_added",
    delivery_status: "sent",
    provider_message_id: "re_demo_1",
    error_message: null,
    created_at: iso(-1),
  },
];

export const demoFiles: FileRecord[] = [
  {
    id: "file_demo_1",
    owner_type: "contact",
    owner_id: "contact_demo_1",
    bucket_key: "demo/contact_demo_1/intake-summary.pdf",
    filename: "intake-summary.pdf",
    content_type: "application/pdf",
    file_size: 182940,
    uploaded_by_user_id: "user_admin",
    created_at: iso(-6),
  },
];
