# Cloudflare Access Setup

Use these steps if you need to create or update the Access policy for the Apex Wellness referral admin portal.

## Goal

Protect these paths:

- `https://wellness.apexcompounding.com/admin`
- `https://wellness.apexcompounding.com/admin/*`

Allow only approved admin users and block public access.

## Dashboard Steps

1. Sign in to the Cloudflare dashboard.
2. Open the correct account for `wellness.apexcompounding.com`.
3. Open `Zero Trust`.
4. In the left navigation, open `Access`.
5. Open `Applications`.
6. Click `Add an application`.
7. Choose `Self-hosted`.
8. Set the application name to `Apex Wellness Referral Admin`.
9. Set the session duration to your preferred secure default, such as `24 hours`.
10. Under `Application domain`, enter:
    - Domain: `wellness.apexcompounding.com`
    - Path: `/admin*`
11. Save and continue to policies.
12. Create an `Allow` policy named `Apex Wellness Admin Allowlist`.
13. Add an include rule:
    - `Emails` if you want a fixed email allowlist
    - or `Email ends in` if your team uses a controlled domain
14. Enter each approved admin email explicitly if using an allowlist.
15. Under authentication methods, require one of:
    - `One-time PIN`
    - `Google`
16. Add a block policy beneath the allow policy:
    - policy action: `Block`
    - include: `Everyone`
17. Save the application.

## Verify

1. Open `https://wellness.apexcompounding.com/admin`.
2. Confirm anonymous users are redirected to Cloudflare Access.
3. Confirm approved users can complete login and reach `/admin/dashboard`.
4. Confirm public pages like `/products` remain public.

## Notes

- The hidden public entry route `/referral` redirects into the protected admin portal. The protected enforcement still happens on `/admin*`.
- If you want to protect the hidden entry route as well, add a second Access application for `/referral` or change the route to redirect server-side only after Access.
