# Cloudflare Turnstile Setup

Use these steps to create the Turnstile widget used by the Apex Wellness referral gate and related public forms.

## Goal

Create a Turnstile widget for:

- `wellness.apexcompounding.com`

Then add the site key and secret key to the deployment environment.

## Dashboard Steps

1. Sign in to the Cloudflare dashboard.
2. Open the correct account for `wellness.apexcompounding.com`.
3. In the left navigation, open `Turnstile`.
4. Click `Add widget`.
5. Name the widget `Apex Wellness Referral Gate`.
6. Under allowed hostnames, add:
   - `wellness.apexcompounding.com`
7. Choose `Managed` widget mode unless you need another challenge style.
8. Create the widget.
9. Copy:
   - `Site Key`
   - `Secret Key`

## Add Environment Variables

Add these values to the Cloudflare deployment environment for the Worker:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If you are using a Pages project instead of the current Worker deployment, add the same variables in Pages project settings under environment variables.

## Verify

1. Redeploy the site after adding the variables.
2. Open a gated product page such as:
   - `https://wellness.apexcompounding.com/products/trimix`
3. Confirm the referral gate renders.
4. Confirm the Turnstile challenge appears.
5. Confirm a valid code unlocks gated purchase access.
6. Confirm an invalid code returns:
   - `Please enter a valid referral code to continue.`

## Notes

- The public referral gate accepts a local development bypass only when no live site key is configured.
- Live production use should always include valid Turnstile keys.
