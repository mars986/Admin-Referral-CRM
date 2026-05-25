import type {
  activityTypes,
  emailEventTypes,
  leadSources,
  leadStatuses,
  orderStatuses,
  paymentStatuses,
  pipelineStages,
  publicFormTypes,
  taskStatuses,
} from "@/lib/crm/constants";

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type PipelineStageName = (typeof pipelineStages)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type TaskStatus = (typeof taskStatuses)[number];
export type ActivityType = (typeof activityTypes)[number];
export type EmailEventType = (typeof emailEventTypes)[number];
export type PublicFormType = (typeof publicFormTypes)[number];

export type DashboardMetric = {
  label: string;
  value: number | string;
  helper: string;
};

export type LeadRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  product_interest: string;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  lead_value_estimate: number;
  assigned_user_id: string | null;
  pipeline_stage_id: string | null;
  pipeline_stage_name?: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer_status: string;
  tags: string[];
  product_interests: string[];
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  notes_summary: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderRecord = {
  id: string;
  contact_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  payment_status: PaymentStatus;
  stripe_payment_id: string | null;
  product_name: string;
  tracking_number: string | null;
  carrier: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  due_at: string;
  status: TaskStatus;
  assigned_user_id: string | null;
  lead_id: string | null;
  contact_id: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailTemplateRecord = {
  id: string;
  name: string;
  event_type: EmailEventType;
  subject: string;
  html_content: string;
  text_content: string;
  is_enabled: number;
  created_at: string;
  updated_at: string;
};

export type EmailLogRecord = {
  id: string;
  recipient_email: string;
  template_id: string | null;
  event_type: EmailEventType;
  delivery_status: string;
  provider_message_id: string | null;
  error_message: string | null;
  created_at: string;
};

export type FileRecord = {
  id: string;
  owner_type: string;
  owner_id: string;
  bucket_key: string;
  filename: string;
  content_type: string;
  file_size: number;
  uploaded_by_user_id: string | null;
  created_at: string;
};
