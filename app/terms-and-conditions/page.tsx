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

export default async function TermsAndConditionsPage() {
  const { supportEmail } = await getServerConfig();
  const supportMailto = `mailto:${supportEmail}`;

  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Terms of Service"
        description="Review the terms that apply to use of the Apex Wellness website, products, and account experience."
      />
      <section className="section-space">
        <div className="site-container grid max-w-4xl gap-6">
          <PolicyCard title="Overview">
            <p>Welcome to Apex Wellness.</p>
            <p>
              By accessing or using this website, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any portion of
              these terms, you should not access or use this website.
            </p>
            <p>
              These Terms apply to all visitors, users, customers, and others who access the
              platform.
            </p>
          </PolicyCard>

          <PolicyCard title="1. Eligibility">
            <p>By using this website, you represent that:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>You are at least 18 years of age</li>
              <li>You are legally permitted to access and use this website under applicable laws</li>
              <li>Any information you submit is accurate and complete</li>
            </ul>
            <p>
              We reserve the right to refuse service, terminate accounts, or cancel orders at our
              discretion.
            </p>
          </PolicyCard>

          <PolicyCard title="2. Website Content">
            <p>
              All website content is provided for informational and general educational purposes
              only.
            </p>
            <p>Nothing on this website should be interpreted as:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Medical advice</li>
              <li>Clinical guidance</li>
              <li>Diagnostic recommendations</li>
              <li>Treatment recommendations</li>
              <li>Professional healthcare instruction</li>
            </ul>
            <p>
              Users are responsible for independently evaluating any information presented on this
              website.
            </p>
          </PolicyCard>

          <PolicyCard title="3. Product Information">
            <p>
              We attempt to provide accurate descriptions, images, pricing, and availability
              information.
            </p>
            <p>However, we do not guarantee:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Product availability</li>
              <li>Continuous inventory</li>
              <li>Error-free listings</li>
              <li>Uninterrupted website operation</li>
              <li>Complete accuracy of descriptions or specifications</li>
            </ul>
            <p>We reserve the right to correct errors, update pricing, modify product availability, cancel orders, and limit quantities without prior notice.</p>
          </PolicyCard>

          <PolicyCard title="4. Orders & Payments">
            <p>
              By submitting an order, you authorize us to process payment using the selected payment
              method.
            </p>
            <p>Orders may be delayed, refused, canceled, or reviewed for verification at our discretion.</p>
            <p>
              We reserve the right to refuse service to any order that appears fraudulent,
              unauthorized, abusive, high-risk, or in violation of these Terms.
            </p>
          </PolicyCard>

          <PolicyCard title="5. Shipping & Fulfillment">
            <p>Shipping timelines are estimates only and are not guaranteed.</p>
            <p>
              By placing an order, you acknowledge that carrier delays may occur, delivery estimates
              may vary, and tracking updates depend on carrier systems.
            </p>
            <p>Additional details are outlined in our Shipping Policy.</p>
          </PolicyCard>

          <PolicyCard title="6. Refunds & Returns">
            <p>Refund eligibility is governed by our Refund Policy.</p>
            <p>Certain products and purchases may be considered final sale and non-returnable.</p>
            <p>
              We reserve the right to deny refund requests that fall outside our policy guidelines.
            </p>
          </PolicyCard>

          <PolicyCard title="7. Account Security">
            <p>If account creation or portal access is available, users are responsible for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Maintaining account confidentiality</li>
              <li>Restricting unauthorized access</li>
              <li>Securing login credentials</li>
              <li>All activity occurring under their account</li>
            </ul>
            <p>
              We are not responsible for unauthorized account access caused by user negligence.
            </p>
          </PolicyCard>

          <PolicyCard title="8. Acceptable Use">
            <p>Users agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the website for unlawful purposes</li>
              <li>Attempt unauthorized access</li>
              <li>Interfere with platform operations</li>
              <li>Upload malicious code</li>
              <li>Abuse promotional systems</li>
              <li>Submit false or misleading information</li>
              <li>Violate intellectual property rights</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate access for violations of these Terms.
            </p>
          </PolicyCard>

          <PolicyCard title="9. Intellectual Property">
            <p>
              All website materials, including but not limited to logos, branding, product names,
              images, graphics, layouts, text, and design elements, are the property of Apex
              Wellness or its licensors and may not be copied, reproduced, or distributed without
              written permission.
            </p>
          </PolicyCard>

          <PolicyCard title="10. Third-Party Services">
            <p>
              This website may integrate with third-party platforms, including payment providers,
              shipping carriers, analytics tools, and authentication providers.
            </p>
            <p>We are not responsible for third-party outages, external policies, third-party content, or platform interruptions.</p>
            <p>
              Use of third-party services may also be subject to their individual terms and policies.
            </p>
          </PolicyCard>

          <PolicyCard title="11. Disclaimer of Warranties">
            <p>
              This website and all services are provided &quot;as is&quot; and &quot;as available&quot; without warranties
              of any kind, express or implied.
            </p>
            <p>We do not guarantee continuous website availability, error-free functionality, compatibility with all devices, uninterrupted access, or specific outcomes from product use.</p>
          </PolicyCard>

          <PolicyCard title="12. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Apex Wellness shall not be liable for indirect
              damages, incidental damages, consequential damages, lost profits, data loss, service
              interruptions, or delivery delays arising from the use of this website or related
              services.
            </p>
          </PolicyCard>

          <PolicyCard title="13. Indemnification">
            <p>
              You agree to indemnify and hold harmless Apex Wellness and its affiliates from any
              claims, damages, liabilities, costs, or expenses arising from your misuse of the
              website, violation of these Terms, violation of applicable laws, or unauthorized
              account activity.
            </p>
          </PolicyCard>

          <PolicyCard title="14. Modifications">
            <p>
              We reserve the right to update or modify these Terms at any time without prior notice.
            </p>
            <p>
              Continued use of the website following updates constitutes acceptance of the revised
              Terms.
            </p>
          </PolicyCard>

          <PolicyCard title="15. Governing Law">
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of the
              United States and the State of California, without regard to conflict of law principles.
            </p>
          </PolicyCard>

          <PolicyCard title="16. Contact Information">
            <p>
              For questions regarding these Terms of Service, please contact our support team at{" "}
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
