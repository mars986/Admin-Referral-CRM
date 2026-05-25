ALTER TABLE referral_partners ADD COLUMN company_name TEXT;
ALTER TABLE referral_partners ADD COLUMN phone TEXT;
ALTER TABLE referral_partners ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE referral_partners ADD COLUMN commission_type TEXT NOT NULL DEFAULT 'flat';
ALTER TABLE referral_partners ADD COLUMN commission_value REAL NOT NULL DEFAULT 0;
ALTER TABLE referral_partners ADD COLUMN referral_code TEXT;

ALTER TABLE leads ADD COLUMN referral_code TEXT;
ALTER TABLE orders ADD COLUMN referral_code TEXT;

ALTER TABLE audit_logs ADD COLUMN actor_email TEXT;
ALTER TABLE audit_logs ADD COLUMN metadata TEXT;

CREATE TABLE IF NOT EXISTS referral_codes (
  id TEXT PRIMARY KEY,
  partner_id TEXT,
  code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  landing_url TEXT,
  qr_image_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS referral_clicks (
  id TEXT PRIMARY KEY,
  referral_code TEXT NOT NULL,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON referral_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_created_at ON referral_clicks(created_at);

CREATE TABLE IF NOT EXISTS referral_leads (
  id TEXT PRIMARY KEY,
  referral_code TEXT NOT NULL,
  customer_email_hash TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  source_page TEXT,
  intake_status TEXT NOT NULL DEFAULT 'new',
  consultation_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_leads_code ON referral_leads(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_leads_email_hash ON referral_leads(customer_email_hash);

CREATE TABLE IF NOT EXISTS referral_conversions (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  referral_code TEXT NOT NULL,
  order_id TEXT,
  product_name TEXT NOT NULL,
  order_total REAL NOT NULL DEFAULT 0,
  conversion_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES referral_leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_code ON referral_conversions(referral_code);

CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  partner_id TEXT,
  referral_code TEXT NOT NULL,
  conversion_id TEXT,
  commission_type TEXT NOT NULL DEFAULT 'flat',
  commission_value REAL NOT NULL DEFAULT 0,
  commission_amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  adjustment_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE SET NULL,
  FOREIGN KEY (conversion_id) REFERENCES referral_conversions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);

CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY,
  partner_id TEXT,
  amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_notes TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (partner_id) REFERENCES referral_partners(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payouts_partner_id ON payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

INSERT OR IGNORE INTO referral_codes (
  id, partner_id, code, status, landing_url, qr_image_key, created_at, updated_at
) VALUES
  ('rcode_seed_m0369e', NULL, 'M0369E', 'active', 'https://wellness.apexcompounding.com/?ref=M0369E', NULL, datetime('now'), datetime('now')),
  ('rcode_seed_j3428v', NULL, 'J3428V', 'active', 'https://wellness.apexcompounding.com/?ref=J3428V', NULL, datetime('now'), datetime('now'));
