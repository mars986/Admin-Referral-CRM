export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Consultation Scheduled",
  "Waiting on Customer",
  "Converted",
  "Lost",
] as const;

export const leadSources = [
  "Website",
  "Intake Form",
  "Referral",
  "Google",
  "Facebook",
  "Instagram",
  "Manual Entry",
] as const;

export const pipelineStages = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Consultation Booked",
  "Pending Payment",
  "Active Customer",
  "Follow-Up Needed",
  "Lost",
] as const;

export const orderStatuses = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
] as const;

export const paymentStatuses = ["Pending", "Paid", "Refunded", "Failed"] as const;

export const taskStatuses = ["Open", "Completed"] as const;

export const activityTypes = [
  "lead_created",
  "lead_updated",
  "lead_deleted",
  "lead_status_changed",
  "contact_created",
  "contact_updated",
  "form_submitted",
  "task_created",
  "task_completed",
  "note_created",
  "order_created",
  "order_status_changed",
  "shipment_tracking_added",
  "email_sent",
  "email_failed",
  "referral_created",
  "file_uploaded",
  "pipeline_stage_changed",
  "payment_event",
  "admin_access",
] as const;

export const emailEventTypes = [
  "user_signup",
  "assessment_started",
  "patient_signup",
  "product_interest_submitted",
  "contact_form_submitted",
  "purchase_success",
  "order_status_updated",
  "shipment_tracking_added",
  "follow_up_due",
  "admin_new_lead",
  "admin_new_purchase",
] as const;

export const publicFormTypes = [
  "contact",
  "assessment",
  "patient",
  "product_interest",
] as const;
