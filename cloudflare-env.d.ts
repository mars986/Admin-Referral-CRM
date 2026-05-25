declare global {
  interface CloudflareEnv {
    DB: D1Database;
    REFERRAL_ASSETS: R2Bucket;
    ASSETS: Fetcher;
    WORKER_SELF_REFERENCE: Fetcher;
    APEX_WEBSITE_URL?: string;
    APEX_PORTAL_URL?: string;
    APEX_SUPPORT_EMAIL?: string;
    APEX_ADMIN_EMAIL?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    ADMIN_NOTIFICATION_EMAIL?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    APP_URL?: string;
    CRM_BRAND_NAME?: string;
    ACCESS_ENFORCED?: string;
  }
}

export {};
