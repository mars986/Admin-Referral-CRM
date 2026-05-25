export const referralPartnerStatuses = ["pending", "active", "suspended"] as const;
export const referralCodeStatuses = ["active", "disabled"] as const;
export const referralLeadStatuses = [
  "new",
  "intake_started",
  "intake_submitted",
  "consultation_pending",
  "approved",
  "rejected",
  "purchased",
  "cancelled",
] as const;
export const referralCommissionTypes = ["flat", "percentage"] as const;
export const referralCommissionStatuses = [
  "pending",
  "approved",
  "rejected",
  "adjusted",
  "paid",
] as const;
export const referralPayoutStatuses = ["pending", "paid"] as const;
export const fraudStatuses = [
  "clear",
  "flagged",
  "under_review",
  "resolved",
  "rejected",
] as const;

export type ReferralPartnerStatus = (typeof referralPartnerStatuses)[number];
export type ReferralCodeStatus = (typeof referralCodeStatuses)[number];
export type ReferralLeadStatus = (typeof referralLeadStatuses)[number];
export type ReferralCommissionType = (typeof referralCommissionTypes)[number];
export type ReferralCommissionStatus = (typeof referralCommissionStatuses)[number];
export type ReferralPayoutStatus = (typeof referralPayoutStatuses)[number];
export type FraudStatus = (typeof fraudStatuses)[number];

export type ReferralPartnerRecord = {
  id: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  referral_code: string | null;
  commission_type: ReferralCommissionType;
  commission_value: number;
  status: ReferralPartnerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralCodeRecord = {
  id: string;
  partner_id: string | null;
  partner_name: string | null;
  code: string;
  status: ReferralCodeStatus;
  landing_url: string | null;
  qr_image_key: string | null;
  qr_svg: string | null;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  created_at: string;
  updated_at: string;
};

export type ReferralLeadRecord = {
  id: string;
  referral_code: string;
  customer_email_hash: string;
  customer_name: string;
  source_page: string;
  intake_status: ReferralLeadStatus;
  consultation_status: string;
  order_status: string;
  ip_hash: string | null;
  user_agent_hash: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralConversionRecord = {
  id: string;
  lead_id: string | null;
  referral_code: string;
  order_id: string | null;
  product_name: string;
  order_total: number;
  conversion_status: string;
  partner_name: string | null;
  created_at: string;
  updated_at: string;
};

export type CommissionRecord = {
  id: string;
  partner_id: string | null;
  partner_name: string | null;
  referral_code: string;
  conversion_id: string | null;
  commission_type: ReferralCommissionType;
  commission_value: number;
  commission_amount: number;
  status: ReferralCommissionStatus;
  adjustment_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type PayoutRecord = {
  id: string;
  partner_id: string | null;
  partner_name: string | null;
  amount: number;
  status: ReferralPayoutStatus;
  payment_method: string | null;
  payment_notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FraudReviewRecord = {
  id: string;
  referral_code: string;
  customer_name: string;
  reasons: string[];
  status: FraudStatus;
  created_at: string;
};

export type ReferralDashboardSnapshot = {
  cards: Array<{
    label: string;
    value: number | string;
    helper: string;
  }>;
  revenueByPartner: Array<{ label: string; value: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
  }>;
  funnel: {
    clicks: number;
    leads: number;
    approvedConversions: number;
    purchases: number;
  };
};

export type PartnerPortalSnapshot = {
  partner: ReferralPartnerRecord;
  codes: ReferralCodeRecord[];
  conversions: ReferralConversionRecord[];
  commissions: CommissionRecord[];
  payouts: PayoutRecord[];
};

export type ReferralAuditLogRecord = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: string | null;
  created_at: string;
};
