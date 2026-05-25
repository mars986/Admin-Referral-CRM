UPDATE referral_partners
SET commission_type = 'percentage',
    commission_value = 15,
    updated_at = datetime('now')
WHERE commission_value IS NULL
   OR commission_value = 0;
