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

export default async function ReturnPolicyPage() {
  const { supportEmail } = await getServerConfig();
  const supportMailto = `mailto:${supportEmail}`;

  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Refund Policy"
        description="Review cancellations, returns, refund processing, and support expectations for Apex Wellness orders."
      />
      <section className="section-space">
        <div className="site-container grid max-w-4xl gap-6">
          <PolicyCard title="Refund & Return Policy">
            <p>
              At Apex Wellness, we are committed to maintaining a secure, professional, and
              transparent customer experience.
            </p>
            <p>
              Due to the nature of personal wellness and consumable products, all sales are
              considered final unless otherwise stated below.
            </p>
          </PolicyCard>

          <PolicyCard title="Order Cancellations">
            <p>Orders may only be canceled before fulfillment processing begins.</p>
            <p>
              Once an order has entered processing, packaging, or shipment preparation, it may no
              longer be eligible for cancellation.
            </p>
            <p>
              To request a cancellation, contact support as soon as possible after placing your
              order.
            </p>
            <p>Cancellation requests are not guaranteed.</p>
          </PolicyCard>

          <PolicyCard title="Returns">
            <p>
              For safety, quality assurance, and product integrity reasons, we do not accept
              returns on:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Opened products</li>
              <li>Used products</li>
              <li>Consumable items</li>
              <li>Personal wellness items</li>
              <li>Items marked as final sale</li>
              <li>Clearance or promotional items</li>
            </ul>
            <p>Products returned without authorization may be refused.</p>
          </PolicyCard>

          <PolicyCard title="Damaged or Incorrect Orders">
            <p>
              If your order arrives damaged, defective, or incorrect, please contact support within
              48 hours of delivery.
            </p>
            <p>Include:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Order number</li>
              <li>Photos of the shipping package</li>
              <li>Photos of the item received</li>
              <li>Brief description of the issue</li>
            </ul>
            <p>Approved claims may qualify for replacement product, store credit, or a partial or full refund at our discretion.</p>
            <p>Claims submitted after the review window may not qualify for resolution.</p>
          </PolicyCard>

          <PolicyCard title="Lost or Stolen Packages">
            <p>We are not responsible for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Carrier delays</li>
              <li>Lost packages marked &quot;Delivered&quot;</li>
              <li>Theft occurring after confirmed delivery</li>
              <li>Incorrect addresses entered during checkout</li>
            </ul>
            <p>
              Customers should contact the carrier directly for delivery investigation requests
              when applicable.
            </p>
          </PolicyCard>

          <PolicyCard title="Refund Processing">
            <p>
              If a refund is approved, it will be issued to the original payment method used during
              checkout.
            </p>
            <p>
              Please allow 5-10 business days for banking institutions to process refunds, plus
              additional processing time depending on the payment provider.
            </p>
            <p>Original shipping charges are non-refundable unless required by law.</p>
          </PolicyCard>

          <PolicyCard title="Chargebacks & Payment Disputes">
            <p>
              Customers are encouraged to contact our support team before initiating a payment
              dispute or chargeback.
            </p>
            <p>
              Fraudulent or abusive chargeback activity may result in account restrictions, refusal
              of future service, and submission of supporting order documentation to the payment
              processor.
            </p>
          </PolicyCard>

          <PolicyCard title="Pre-Order Items">
            <p>
              Pre-order purchases reserve inventory in advance and may require extended fulfillment
              timelines.
            </p>
            <p>
              Pre-order cancellation requests may be reviewed on a case-by-case basis prior to
              shipment.
            </p>
            <p>Estimated timelines are subject to change.</p>
          </PolicyCard>

          <PolicyCard title="Policy Updates">
            <p>
              We reserve the right to modify this Refund Policy at any time without prior notice.
            </p>
            <p>Updated versions will be posted on this page with immediate effect upon publication.</p>
          </PolicyCard>

          <PolicyCard title="Contact">
            <p>
              For refund or order support inquiries, please contact our support team at{" "}
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
