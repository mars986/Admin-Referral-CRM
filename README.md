# Apex Wellness Referral Admin Portal

Cloudflare-first referral management portal and gated purchase flow for Apex Wellness.

## Live URLs

- Production domain: [https://wellness.apexcompounding.com](https://wellness.apexcompounding.com)
- Worker fallback URL: [https://apex-wellness-crm.marcelloefficace.workers.dev](https://apex-wellness-crm.marcelloefficace.workers.dev)
- Hidden entry route: [https://wellness.apexcompounding.com/referral](https://wellness.apexcompounding.com/referral)
- Admin route: [https://wellness.apexcompounding.com/admin](https://wellness.apexcompounding.com/admin)
- Admin alias: [https://wellness.apexcompounding.com/admin/referral](https://wellness.apexcompounding.com/admin/referral)
- Partner portal: [https://wellness.apexcompounding.com/partner-portal](https://wellness.apexcompounding.com/partner-portal)

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Hono API routes mounted at `/api/*`
- OpenNext for Cloudflare Workers deployment
- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2 bindings for referral QR assets and CRM uploads
- Cloudflare Access for `/admin*`
- Cloudflare Turnstile on public referral gating

## Referral Features

- Hidden admin portal with:
  - `/admin/dashboard`
  - `/admin/partners`
  - `/admin/referral-codes`
  - `/admin/leads`
  - `/admin/conversions`
  - `/admin/commissions`
  - `/admin/payouts`
  - `/admin/fraud`
  - `/admin/reports`
  - `/admin/partner-portal`
  - `/admin/settings`
  - `/admin/audit-logs`
- Public referral capture from `?ref=CODE`
- Referral-gated purchase access on gated products
- Referral validation endpoint with Turnstile and basic rate limiting
- Referral click, lead, conversion, commission, payout, and audit tracking
- Fraud review based on duplicate hashes, self-referral, suspicious conversion rate, and repeated device signals
- CSV export for referral reports

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Set these in local `.env.local` and in Cloudflare Worker or Pages environment settings:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
APEX_WEBSITE_URL=https://wellness.apexcompounding.com
APEX_PORTAL_URL=https://wellness.apexcompounding.com
APEX_SUPPORT_EMAIL=support@apexwellness.com
APEX_ADMIN_EMAIL=
```

Do not expose any secret with a `NEXT_PUBLIC_` prefix.

## Database

Current live D1 binding:

- Binding: `DB`
- Database name: `apex-compounding-db`
- Database ID: `0021e6df-93f2-46b9-90ec-24cb8c8d20da`

Requested separate referral database:

- Target name: `apex-wellness-referrals`
- Current status: not created because the Cloudflare account is already at the D1 database limit

### Create a D1 database

If you free a D1 slot first:

```bash
npx wrangler d1 create apex-wellness-referrals
```

### Run migrations

Current bound production database:

```bash
npm run db:migrate:remote
```

Local database:

```bash
npm run db:migrate:local
```

### Seed referral codes

The referral migration already inserts the required active codes:

- `M0369E`
- `J3428V`

You can also run the dedicated referral seed:

```bash
npm run db:seed:referrals:remote
```

Local referral seed:

```bash
npm run db:seed:referrals:local
```

### Seed files

- [migrations/0001_initial.sql](/C:/Users/Sdcon/ApexWellness.codex/apex-site/migrations/0001_initial.sql)
- [migrations/0002_referral_management.sql](/C:/Users/Sdcon/ApexWellness.codex/apex-site/migrations/0002_referral_management.sql)
- [seed/0001_seed.sql](/C:/Users/Sdcon/ApexWellness.codex/apex-site/seed/0001_seed.sql)
- [seed/0002_referral_seed.sql](/C:/Users/Sdcon/ApexWellness.codex/apex-site/seed/0002_referral_seed.sql)

## Wrangler Bindings

Current D1 binding is configured in [wrangler.jsonc](/C:/Users/Sdcon/ApexWellness.codex/apex-site/wrangler.jsonc):

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "apex-compounding-db",
    "database_id": "0021e6df-93f2-46b9-90ec-24cb8c8d20da",
    "migrations_dir": "./migrations"
  }
]
```

R2 bindings are configured to use one bucket for referral QR storage and CRM file uploads:

```jsonc
{
  "binding": "REFERRAL_ASSETS",
  "bucket_name": "apex-wellness-referral-assets"
},
{
  "binding": "CRM_FILES",
  "bucket_name": "apex-wellness-referral-assets"
}
```

## R2 Setup

Requested bucket:

- `apex-wellness-referral-assets`

Current status:

- blocked because R2 is not enabled on the Cloudflare account
- Cloudflare API returned `10042: Please enable R2 through the Cloudflare Dashboard.`

After R2 is enabled:

```bash
npx wrangler r2 bucket create apex-wellness-referral-assets
```

Then redeploy. The `REFERRAL_ASSETS` and `CRM_FILES` bindings are already present in `wrangler.jsonc`.

## Deployment

This repo currently deploys through OpenNext + Wrangler to Cloudflare Workers.

Build:

```bash
npm run build:cf
```

Deploy:

```bash
npx wrangler deploy
```

Note:

- A Cloudflare Pages project named `apex-wellness` exists and has `wellness.apexcompounding.com` attached.
- The current full-stack CRM/referral deployment target is the existing Worker `apex-wellness-crm`, attached to `wellness.apexcompounding.com/*`.

## Cloudflare Access

Exact dashboard steps are documented in [CLOUDFLARE_ACCESS_SETUP.md](/C:/Users/Sdcon/ApexWellness.codex/apex-site/CLOUDFLARE_ACCESS_SETUP.md).

Protected paths:

- `/admin`
- `/admin/*`

## Cloudflare Turnstile

Exact dashboard steps are documented in [TURNSTILE_SETUP.md](/C:/Users/Sdcon/ApexWellness.codex/apex-site/TURNSTILE_SETUP.md).

Public referral gating uses Turnstile on:

- gated product unlock flow
- partner portal access form
- CRM public forms that are already wired in the app

## Stripe Product Import

The Stripe catalog import uses Stripe Products and one-time Stripe Prices. It does not create Payment Links and it does not modify checkout behavior.

CSV location:

- Recommended: `imports/apex_wellness_stripe_product_import.csv`
- Also checked: project root, `scripts/`, `data/`, `public/`, and `C:\Users\Sdcon\Downloads\apex_wellness_stripe_product_import.csv`

Add a Stripe test secret key to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

Run a dry import first:

```bash
npm run stripe:import:dry
```

Run the test-mode import:

```bash
npm run stripe:import:test
```

Confirm products and prices in the Stripe Dashboard:

- Open Stripe Dashboard in test mode.
- Go to Product catalog.
- Confirm each Apex Wellness Product exists.
- Confirm each size or variant has a one-time Price.
- Confirm each Price has the expected `lookup_key`.

Live-mode warning:

- Do not run live mode until the test-mode catalog has been reviewed.
- The script refuses `sk_live` keys unless `--live-confirm` is used.
- If live import is explicitly approved later, use `npm run stripe:import:live`.

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run build:cf
```

## Current Deployment Notes

- Referral migration `0002_referral_management.sql` has been applied to the live bound D1 database.
- Active seeded referral codes confirmed in remote D1:
  - `M0369E`
  - `J3428V`
- D1 creation for `apex-wellness-referrals` is blocked by the account database cap.
- R2 bucket creation for `apex-wellness-referral-assets` is blocked because R2 is disabled on the account.
