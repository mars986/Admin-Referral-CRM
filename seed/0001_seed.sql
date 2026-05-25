INSERT OR IGNORE INTO users (id, email, first_name, last_name, role, is_active, created_at, updated_at)
VALUES ('user_admin', 'admin@apexwellness.com', 'Apex', 'Admin', 'admin', 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO pipeline_stages (id, name, sort_order, color_token, created_at, updated_at) VALUES
('stage_new_lead', 'New Lead', 1, 'sky', datetime('now'), datetime('now')),
('stage_contacted', 'Contacted', 2, 'blue', datetime('now'), datetime('now')),
('stage_qualified', 'Qualified', 3, 'indigo', datetime('now'), datetime('now')),
('stage_consultation_booked', 'Consultation Booked', 4, 'violet', datetime('now'), datetime('now')),
('stage_pending_payment', 'Pending Payment', 5, 'amber', datetime('now'), datetime('now')),
('stage_active_customer', 'Active Customer', 6, 'emerald', datetime('now'), datetime('now')),
('stage_follow_up_needed', 'Follow-Up Needed', 7, 'orange', datetime('now'), datetime('now')),
('stage_lost', 'Lost', 8, 'rose', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO email_settings (id, event_type, is_enabled, created_at, updated_at) VALUES
('es_user_signup', 'user_signup', 1, datetime('now'), datetime('now')),
('es_assessment_started', 'assessment_started', 1, datetime('now'), datetime('now')),
('es_patient_signup', 'patient_signup', 1, datetime('now'), datetime('now')),
('es_product_interest', 'product_interest_submitted', 1, datetime('now'), datetime('now')),
('es_contact', 'contact_form_submitted', 1, datetime('now'), datetime('now')),
('es_purchase', 'purchase_success', 1, datetime('now'), datetime('now')),
('es_status', 'order_status_updated', 1, datetime('now'), datetime('now')),
('es_tracking', 'shipment_tracking_added', 1, datetime('now'), datetime('now')),
('es_follow_up', 'follow_up_due', 1, datetime('now'), datetime('now')),
('es_admin_lead', 'admin_new_lead', 1, datetime('now'), datetime('now')),
('es_admin_purchase', 'admin_new_purchase', 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO email_templates (id, name, event_type, subject, html_content, text_content, is_enabled, created_at, updated_at) VALUES
('tmpl_welcome', 'Welcome / Signup Confirmation', 'user_signup', 'Your Apex Wellness account is ready', '<p>Hi {{first_name}},</p><p>Your Apex Wellness account is ready.</p>', 'Hi {{first_name}}, your Apex Wellness account is ready.', 1, datetime('now'), datetime('now')),
('tmpl_assessment', 'Assessment Confirmation', 'assessment_started', 'We received your assessment request', '<p>Hi {{first_name}},</p><p>Your assessment request has been received. Our team will follow up with next-step guidance.</p>', 'Hi {{first_name}}, your assessment request has been received. Our team will follow up with next-step guidance.', 1, datetime('now'), datetime('now')),
('tmpl_patient', 'Become a Patient Confirmation', 'patient_signup', 'Your Apex Wellness request was submitted', '<p>Hi {{first_name}},</p><p>Your request has been submitted for review.</p>', 'Hi {{first_name}}, your request has been submitted for review.', 1, datetime('now'), datetime('now')),
('tmpl_contact', 'Contact Form Confirmation', 'contact_form_submitted', 'We received your message', '<p>Hi {{first_name}},</p><p>We received your message and will follow up shortly.</p>', 'Hi {{first_name}}, we received your message and will follow up shortly.', 1, datetime('now'), datetime('now')),
('tmpl_product', 'Product Interest Confirmation', 'product_interest_submitted', 'We received your product interest request', '<p>Hi {{first_name}},</p><p>We received your request about {{product_interest}}.</p>', 'Hi {{first_name}}, we received your request about {{product_interest}}.', 1, datetime('now'), datetime('now')),
('tmpl_purchase', 'Purchase Confirmation', 'purchase_success', 'Your order is confirmed', '<p>Hi {{first_name}},</p><p>Your order is confirmed and our team will send updates as it progresses.</p>', 'Hi {{first_name}}, your order is confirmed and our team will send updates as it progresses.', 1, datetime('now'), datetime('now')),
('tmpl_status', 'Order Status Update', 'order_status_updated', 'Your order status changed', '<p>Hi {{first_name}},</p><p>Your order status is now {{order_status}}.</p>', 'Hi {{first_name}}, your order status is now {{order_status}}.', 1, datetime('now'), datetime('now')),
('tmpl_tracking', 'Shipment Tracking', 'shipment_tracking_added', 'Your tracking details are ready', '<p>Hi {{first_name}},</p><p>Your tracking number is {{tracking_number}}.</p>', 'Hi {{first_name}}, your tracking number is {{tracking_number}}.', 1, datetime('now'), datetime('now')),
('tmpl_admin_lead', 'Admin New Lead Notification', 'admin_new_lead', 'New CRM lead received', '<p>A new lead was created for {{first_name}} {{last_name}}.</p>', 'A new lead was created for {{first_name}} {{last_name}}.', 1, datetime('now'), datetime('now')),
('tmpl_admin_purchase', 'Admin New Purchase Notification', 'admin_new_purchase', 'New Apex Wellness purchase', '<p>A new order was created for {{first_name}} {{last_name}}.</p>', 'A new order was created for {{first_name}} {{last_name}}.', 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO settings (id, category, key, value_json, created_at, updated_at) VALUES
('setting_crm_brand', 'crm', 'brand_name', '"Apex Wellness"', datetime('now'), datetime('now')),
('setting_crm_currency', 'crm', 'currency', '"USD"', datetime('now'), datetime('now')),
('setting_crm_access', 'crm', 'access_paths', '["/admin","/admin/crm"]', datetime('now'), datetime('now')),
('setting_forms', 'crm', 'enabled_forms', '["contact","assessment","patient","product_interest"]', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO leads (
  id, first_name, last_name, email, phone, product_interest, message, source, status,
  lead_value_estimate, assigned_user_id, pipeline_stage_id, next_follow_up_at, last_contacted_at, created_at, updated_at
) VALUES
('lead_seed_1', 'Avery', 'Cole', 'avery@example.com', '4805550101', 'TriMix', 'Interested in next-step guidance.', 'Website', 'New', 450, 'user_admin', 'stage_new_lead', datetime('now', '+1 day'), NULL, datetime('now', '-1 day'), datetime('now', '-1 day')),
('lead_seed_2', 'Jordan', 'Lane', 'jordan@example.com', '4805550102', 'NAD+ 500MG', 'Requested availability information.', 'Referral', 'Qualified', 825, 'user_admin', 'stage_pending_payment', datetime('now', '+2 day'), datetime('now', '-2 day'), datetime('now', '-4 day'), datetime('now', '-1 day'));

INSERT OR IGNORE INTO contacts (
  id, first_name, last_name, email, phone, customer_status, tags_json, product_interests_json, last_contacted_at, next_follow_up_at, notes_summary, created_at, updated_at
) VALUES
('contact_seed_1', 'Morgan', 'Hayes', 'morgan@example.com', '4805550111', 'Active Customer', '["Priority","Subscription"]', '["PT-141","NAD+ 500MG"]', datetime('now', '-3 day'), datetime('now', '+4 day'), 'Requested a shipment status update and refill review.', datetime('now', '-30 day'), datetime('now', '-1 day'));

INSERT OR IGNORE INTO deals (id, lead_id, contact_id, stage_id, stage_name, estimated_value, status, created_at, updated_at) VALUES
('deal_seed_1', 'lead_seed_1', NULL, 'stage_new_lead', 'New Lead', 450, 'New', datetime('now', '-1 day'), datetime('now', '-1 day')),
('deal_seed_2', 'lead_seed_2', NULL, 'stage_pending_payment', 'Pending Payment', 825, 'Qualified', datetime('now', '-4 day'), datetime('now', '-1 day'));

INSERT OR IGNORE INTO orders (
  id, contact_id, email, status, subtotal, total, payment_status, stripe_payment_id,
  product_name, tracking_number, carrier, tracking_url, shipped_at, delivered_at, created_at, updated_at
) VALUES
('order_seed_1', 'contact_seed_1', 'morgan@example.com', 'Shipped', 329, 349, 'Paid', 'pi_seed_1', 'PT-141', '1Z9999999999999999', 'UPS', 'https://www.ups.com/track?tracknum=1Z9999999999999999', datetime('now', '-1 day'), NULL, datetime('now', '-2 day'), datetime('now', '-1 day'));

INSERT OR IGNORE INTO tasks (
  id, title, description, due_at, status, assigned_user_id, lead_id, contact_id, notes, completed_at, created_at, updated_at
) VALUES
('task_seed_1', 'Follow up on Avery intake submission', 'Confirm next-step guidance and product interest details.', datetime('now', '+1 day'), 'Open', 'user_admin', 'lead_seed_1', NULL, 'Reach out by email first.', NULL, datetime('now', '-1 day'), datetime('now', '-1 day'));

INSERT OR IGNORE INTO referrals (
  id, lead_id, contact_id, referral_source, referral_partner_id, referral_code, conversion_value, commission_estimate, created_at, updated_at
) VALUES
('ref_seed_1', 'lead_seed_2', NULL, 'Referral', NULL, 'PARTNER10', 825, 82.5, datetime('now', '-2 day'), datetime('now', '-2 day'));

INSERT OR IGNORE INTO activity_logs (id, type, description, lead_id, contact_id, order_id, user_id, metadata_json, created_at) VALUES
('act_seed_1', 'lead_created', 'Lead created for Avery Cole', 'lead_seed_1', NULL, NULL, 'user_admin', '{}', datetime('now', '-1 day')),
('act_seed_2', 'order_created', 'Order created for morgan@example.com', NULL, 'contact_seed_1', 'order_seed_1', 'user_admin', '{"product_name":"PT-141","total":349}', datetime('now', '-2 day'));
