import { z } from "zod";
import {
  DEFAULT_REFERRAL_COMMISSION_TYPE,
  DEFAULT_REFERRAL_COMMISSION_VALUE,
} from "@/lib/referrals/constants";
import {
  fraudStatuses,
  referralCodeStatuses,
  referralCommissionStatuses,
  referralCommissionTypes,
  referralLeadStatuses,
  referralPartnerStatuses,
  referralPayoutStatuses,
} from "@/lib/referrals/types";

const blankStringToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

const optionalText = z.preprocess(blankStringToNull, z.string().trim().optional().nullable());
const optionalEmail = z.preprocess(blankStringToNull, z.email().trim().toLowerCase().optional().nullable());
const optionalReferralCode = z.preprocess(
  blankStringToNull,
  z.string().trim().min(4).max(32).optional().nullable(),
);

export const referralPartnerSchema = z.object({
  name: z.string().trim().min(1),
  company_name: optionalText,
  email: optionalEmail,
  phone: optionalText,
  referral_code: optionalReferralCode,
  commission_type: z.enum(referralCommissionTypes).default(DEFAULT_REFERRAL_COMMISSION_TYPE),
  commission_value: z.coerce.number().min(0).default(DEFAULT_REFERRAL_COMMISSION_VALUE),
  status: z.enum(referralPartnerStatuses).default("pending"),
  notes: z.preprocess(blankStringToNull, z.string().trim().max(4000).optional().nullable()),
});

export const referralCodeSchema = z.object({
  partner_id: z.string().trim().optional().nullable(),
  code: z.string().trim().min(4).max(32),
  status: z.enum(referralCodeStatuses).default("active"),
  landing_url: z.string().trim().optional().nullable(),
});

export const referralValidateSchema = z.object({
  code: z.string().trim().min(1),
  source_page: z.string().trim().default("/"),
  utm_source: z.string().trim().optional().default(""),
  utm_medium: z.string().trim().optional().default(""),
  utm_campaign: z.string().trim().optional().default(""),
  turnstileToken: z.string().trim().optional().default(""),
});

export const referralClickSchema = z.object({
  code: z.string().trim().min(1),
  source_page: z.string().trim().default("/"),
  utm_source: z.string().trim().optional().default(""),
  utm_medium: z.string().trim().optional().default(""),
  utm_campaign: z.string().trim().optional().default(""),
});

export const referralLeadSchema = z.object({
  referral_code: z.string().trim().min(1),
  customer_email: z.email().trim().toLowerCase(),
  customer_name: z.string().trim().min(1),
  source_page: z.string().trim().default("/"),
  intake_status: z.enum(referralLeadStatuses).default("new"),
  consultation_status: z.string().trim().default("pending"),
  order_status: z.string().trim().default("pending"),
});

export const referralLeadUpdateSchema = z.object({
  intake_status: z.enum(referralLeadStatuses).optional(),
  consultation_status: z.string().trim().optional(),
  order_status: z.string().trim().optional(),
});

export const commissionUpdateSchema = z.object({
  status: z.enum(referralCommissionStatuses).optional(),
  adjustment_reason: z.string().trim().max(4000).optional().nullable(),
  commission_amount: z.coerce.number().min(0).optional(),
});

export const payoutCreateSchema = z.object({
  partner_id: z.string().trim().min(1),
  amount: z.coerce.number().min(0),
  status: z.enum(referralPayoutStatuses).default("pending"),
  payment_method: z.string().trim().optional().nullable(),
  payment_notes: z.string().trim().max(4000).optional().nullable(),
});

export const payoutUpdateSchema = z.object({
  status: z.enum(referralPayoutStatuses).optional(),
  payment_method: z.string().trim().optional().nullable(),
  payment_notes: z.string().trim().max(4000).optional().nullable(),
  paid_at: z.string().datetime().optional().nullable(),
});

export const partnerPortalAuthSchema = z.object({
  email: z.email().trim().toLowerCase(),
  code: z.string().trim().min(1),
  turnstileToken: z.string().trim().optional().default(""),
});

export const fraudStatusSchema = z.enum(fraudStatuses);
