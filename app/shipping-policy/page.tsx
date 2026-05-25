import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { getServerConfig } from "@/lib/cloudflare/env";

type PolicyCardProps = {
  title: string;
  children: ReactNode;
};

function PolicyCard({ title, children }: PolicyCardProps) {
  return (
    <article className="card-surface rounded-[1.75rem] p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-[var(--color-ink-soft)] sm:text-lg">
        {children}
      </div>
    </article>
  );
}

export default async function ShippingPolicyPage() {
  const { supportEmail } = await getServerConfig();
  const supportMailto = `mailto:${supportEmail}`;

  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Shipping Policy"
        description="Review processing, transit, packaging, and delivery expectations for Apex Wellness orders."
      />
      <section className="section-space">
        <div className="site-container grid max-w-4xl gap-6">
          <PolicyCard title="Shipping & Fulfillment">
            <p>
              At Apex Wellness, we focus on secure, discreet, and reliable order fulfillment
              across the United States.
            </p>
            <p>
              All orders are processed in the order they are received and are typically prepared
              for shipment within 2-4 business days unless otherwise stated on the product page.
            </p>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Processing times may vary during:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>High order volume periods</li>
                <li>Product restocks</li>
                <li>Pre-order windows</li>
                <li>Holidays or carrier delays</li>
              </ul>
            </div>
            <p>
              Once your order has shipped, tracking information will be sent to the email address
              provided during checkout.
            </p>
          </PolicyCard>

          <PolicyCard title="Shipping Availability">
            <p>We currently ship within the United States only.</p>
            <p>We do not currently offer:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>International shipping</li>
              <li>Freight forwarding support</li>
              <li>Reshipping services</li>
            </ul>
            <p>
              Orders submitted with unsupported forwarding addresses may be delayed, canceled, or
              refunded at our discretion.
            </p>
          </PolicyCard>

          <PolicyCard title="Discreet Packaging">
            <p>
              All orders are shipped in discreet outer packaging without unnecessary branding or
              product identifiers visible on the exterior of the shipment.
            </p>
            <p>Packaging appearance may vary depending on order size and fulfillment requirements.</p>
          </PolicyCard>

          <PolicyCard title="Delivery Estimates">
            <p>
              Estimated transit times may vary based on carrier operations, weather conditions,
              regional delivery limitations, and seasonal demand.
            </p>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">Typical domestic delivery windows:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Standard Shipping: 3-7 business days</li>
                <li>Expedited Shipping: 2-4 business days (when available)</li>
              </ul>
            </div>
            <p>Delivery estimates are not guaranteed.</p>
          </PolicyCard>

          <PolicyCard title="Tracking Information">
            <p>
              Once an order has been fulfilled and scanned by the carrier, tracking information
              will be automatically emailed to the customer.
            </p>
            <p>Please allow up to 24 hours for tracking updates to appear after label creation.</p>
          </PolicyCard>

          <PolicyCard title="Incorrect Shipping Information">
            <p>
              Customers are responsible for ensuring all shipping information is accurate before
              submitting an order.
            </p>
            <p>We are not responsible for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Delays caused by incorrect addresses</li>
              <li>Lost shipments due to customer entry errors</li>
              <li>Carrier rerouting issues</li>
              <li>Undeliverable packages</li>
            </ul>
            <p>
              If a package is returned due to an incorrect address, additional shipping charges may
              apply before reshipment.
            </p>
          </PolicyCard>

          <PolicyCard title="Lost, Delayed, or Stolen Packages">
            <p>
              Once a shipment has been transferred to the carrier, delivery responsibility shifts
              to the shipping provider.
            </p>
            <p>If a package appears lost or delayed:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Verify the shipping address entered at checkout</li>
              <li>Review carrier tracking updates</li>
              <li>Contact the carrier directly for additional information</li>
            </ul>
            <p>If additional assistance is needed, customers may contact our support team.</p>
            <p>We are not responsible for carrier-related delivery delays, stolen packages after delivery confirmation, or delivery exceptions outside our control.</p>
          </PolicyCard>

          <PolicyCard title="Damaged Orders">
            <p>
              If an order arrives visibly damaged, please contact support within 48 hours of
              delivery and include:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Order number</li>
              <li>Photos of the package</li>
              <li>Photos of the affected items</li>
            </ul>
            <p>Claims submitted outside this timeframe may not qualify for review.</p>
          </PolicyCard>

          <PolicyCard title="Pre-Orders">
            <p>
              Items marked as &quot;Pre-Order&quot; may require additional fulfillment time beyond standard
              processing windows.
            </p>
            <p>
              Estimated shipping timelines for pre-order items will be displayed on the applicable
              product page whenever available.
            </p>
            <p>
              Orders containing both in-stock and pre-order items may ship together once all items
              become available.
            </p>
          </PolicyCard>

          <PolicyCard title="Support">
            <p>
              For shipping or order-related questions, please contact our support team at{" "}
              <a className="text-[var(--color-primary)] underline underline-offset-4" href={supportMailto}>
                {supportEmail}
              </a>
              .
            </p>
          </PolicyCard>
        </div>
      </section>
    </>
  );
}
