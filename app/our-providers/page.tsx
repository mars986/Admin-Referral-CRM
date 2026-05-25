import { ContentCardGrid } from "@/components/content-card-grid";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";

const providerCards = [
  {
    title: "Provider Standards",
    description:
      "Apex Wellness works from a quality-first mindset with an emphasis on professionalism, consistency, and clear communication.",
  },
  {
    title: "Review Process",
    description:
      "Requests are reviewed with care so the process stays organized, well-paced, and aligned with the information submitted.",
  },
  {
    title: "Quality-Focused Care",
    description:
      "The experience is designed to feel thoughtful and patient centered, with premium presentation and dependable support throughout.",
  },
];

export default function OurProvidersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Providers"
        title="Our Providers"
        description="Apex Wellness emphasizes professionalism, careful review, and patient-focused service standards."
      />
      <ContentCardGrid
        eyebrow="Provider Overview"
        title="A quality-minded review experience."
        description="We focus on consistency, clear communication, and a polished experience that reflects the Apex Wellness standard."
        cards={providerCards}
      />
      <CtaBanner
        title="Begin your patient request."
        description="Complete the intake form to share your interests and start the next step with Apex Wellness."
        href="/become-a-patient"
        buttonLabel="Become a Patient"
      />
    </>
  );
}
