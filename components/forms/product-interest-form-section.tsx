import { CrmPublicForm } from "@/components/forms/crm-public-form";
import { getServerConfig } from "@/lib/cloudflare/env";
import type { Product } from "@/lib/types";

type ProductInterestFormSectionProps = {
  product: Product;
};

const productInterestFields = [
  { name: "firstName", label: "First Name", type: "text", placeholder: "First name", required: true },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Last name", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your phone number", required: true },
  {
    name: "productInterest",
    label: "Product Interest",
    type: "select",
    required: true,
    options: [],
  },
  {
    name: "message",
    label: "Questions or Goals",
    type: "textarea",
    placeholder: "Tell us what you'd like help with.",
    required: true,
  },
] as const;

export async function ProductInterestFormSection({
  product,
}: ProductInterestFormSectionProps) {
  const config = await getServerConfig();

  return (
    <section className="section-space pt-0">
      <div className="site-container grid gap-8 xl:grid-cols-[0.8fr_1fr]">
        <article className="card-surface rounded-[2rem] p-7 sm:p-8">
          <p className="eyebrow">Product Interest</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Request guidance for {product.name}.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-ink-soft)]">
            Use this short request form to route your product questions directly into the Apex Wellness CRM for follow-up, tasking, and email confirmation.
          </p>
        </article>
        <CrmPublicForm
          formType="product_interest"
          fields={[
            ...productInterestFields.map((field) =>
              field.name === "productInterest"
                ? {
                    ...field,
                    options: [{ label: product.name, value: product.name }],
                  }
                : field,
            ),
          ]}
          submitLabel="Request Product Guidance"
          successMessage="Your request has been captured. We’ll follow up with product-specific next-step guidance."
          turnstileSiteKey={config.turnstileSiteKey}
          defaultValues={{ productInterest: product.name }}
        />
      </div>
    </section>
  );
}
