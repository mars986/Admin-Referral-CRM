import { z } from "zod";
import {
  emailEventTypes,
  leadSources,
  leadStatuses,
  orderStatuses,
  paymentStatuses,
  publicFormTypes,
  taskStatuses,
} from "@/lib/crm/constants";

export const optionalString = z.string().trim().optional().default("");

export const leadSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(10),
  product_interest: z.string().trim().min(1),
  message: z.string().trim().max(4000).optional().nullable(),
  source: z.enum(leadSources),
  status: z.enum(leadStatuses).default("New"),
  lead_value_estimate: z.coerce.number().min(0).default(0),
  assigned_user_id: z.string().trim().optional().nullable(),
  next_follow_up_at: z.string().datetime().optional().nullable(),
  last_contacted_at: z.string().datetime().optional().nullable(),
});

export const contactSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(10),
  customer_status: z.string().trim().default("Active"),
  tags: z.array(z.string().trim()).default([]),
  product_interests: z.array(z.string().trim()).default([]),
  last_contacted_at: z.string().datetime().optional().nullable(),
  next_follow_up_at: z.string().datetime().optional().nullable(),
  notes_summary: z.string().trim().max(4000).optional().nullable(),
});

export const orderSchema = z.object({
  contact_id: z.string().trim().optional().nullable(),
  email: z.email().trim().toLowerCase(),
  status: z.enum(orderStatuses).default("Pending"),
  subtotal: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  payment_status: z.enum(paymentStatuses).default("Pending"),
  stripe_payment_id: z.string().trim().optional().nullable(),
  product_name: z.string().trim().min(1),
  tracking_number: z.string().trim().optional().nullable(),
  carrier: z.string().trim().optional().nullable(),
  tracking_url: z.url().trim().optional().nullable(),
  shipped_at: z.string().datetime().optional().nullable(),
  delivered_at: z.string().datetime().optional().nullable(),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().max(4000).optional().nullable(),
  due_at: z.string().datetime(),
  status: z.enum(taskStatuses).default("Open"),
  assigned_user_id: z.string().trim().optional().nullable(),
  lead_id: z.string().trim().optional().nullable(),
  contact_id: z.string().trim().optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
});

export const noteSchema = z.object({
  lead_id: z.string().trim().optional().nullable(),
  contact_id: z.string().trim().optional().nullable(),
  order_id: z.string().trim().optional().nullable(),
  body: z.string().trim().min(1).max(4000),
  note_type: z.enum(["internal_note", "call_log", "email_log"]).default("internal_note"),
});

export const referralSchema = z.object({
  lead_id: z.string().trim().optional().nullable(),
  contact_id: z.string().trim().optional().nullable(),
  referral_source: z.string().trim().min(1),
  referral_partner_id: z.string().trim().optional().nullable(),
  referral_code: z.string().trim().optional().nullable(),
  conversion_value: z.coerce.number().min(0).default(0),
  commission_estimate: z.coerce.number().min(0).default(0),
});

export const emailTemplateSchema = z.object({
  name: z.string().trim().min(1),
  event_type: z.enum(emailEventTypes),
  subject: z.string().trim().min(1),
  html_content: z.string().trim().min(1),
  text_content: z.string().trim().min(1),
  is_enabled: z.coerce.number().int().min(0).max(1).default(1),
});

export const shipmentUpdateSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  tracking_number: z.string().trim().optional().nullable(),
  carrier: z.string().trim().optional().nullable(),
  tracking_url: z.url().trim().optional().nullable(),
  shipped_at: z.string().datetime().optional().nullable(),
  delivered_at: z.string().datetime().optional().nullable(),
});

export const formSubmissionSchema = z.object({
  form_type: z.enum(publicFormTypes),
  source: z.enum(leadSources).default("Website"),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(10),
  product_interest: z.string().trim().optional().default("General"),
  message: z.string().trim().max(4000).optional().default(""),
  date_of_birth: z.string().trim().optional().default(""),
  referral_code: z.string().trim().optional().default(""),
  consent: z.coerce.boolean().default(false),
  turnstileToken: z.string().trim().min(1),
  metadata: z.record(z.string(), z.string()).optional().default({}),
});

export const resendEmailSchema = z.object({
  event_type: z.enum(emailEventTypes),
  recipient_email: z.email().trim().toLowerCase(),
  context: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().trim().optional().default(""),
});
