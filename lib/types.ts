export type ProductStatus = "available" | "sold-out" | "coming-soon" | "pre-order";

export type ProductCategory = "Wellness" | "Performance" | "Longevity";

export type ProductVariant = {
  label: string;
  price: string;
};

export type NavItem = {
  label: string;
  href: string;
  showCaret?: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

export type TrustItem = {
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  title: string;
  items: FaqItem[];
};

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
  sizes: string[];
  variants?: ProductVariant[];
  status: ProductStatus;
  buttonLabel: string;
  categories: ProductCategory[];
  featured?: boolean;
  href?: string;
  categoryLabel?: string;
  bestFor?: string;
  cardEyebrow?: string;
  cardTitle?: string;
  cardDescription?: string;
  priceLabel?: string;
  strength?: string;
  activeIngredients?: string[];
  productType?: string[];
  heroTitle?: string;
  heroDescription?: string;
  featureBadges?: string[];
  overview?: string[];
  highlights?: string[];
  requiresReferralCode?: boolean;
  stabilityTitle?: string;
  stabilityDescription?: string;
  usageInformation?: string;
  reconstitutionIntro?: string;
  reconstitutionSteps?: string[];
  storageDetails?: string[];
  faqItems?: FaqItem[];
  disclaimer?: string;
};

export type InfoCard = {
  title: string;
  description: string;
};

export type QualityCareCard = {
  title: string;
  description: string;
  icon: string;
};

export type QualityCareSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta?: CtaLink;
  cards: QualityCareCard[];
};

export type QualityCareStep = {
  title: string;
  description: string;
  icon: string;
};

export type QualityCarePageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  sections: QualityCareSection[];
  howItWorks: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    steps: QualityCareStep[];
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
};

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select"
  | "checkbox"
  | "password";

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldConfig = {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: readonly FormFieldOption[];
};

export type FormSectionConfig = {
  title: string;
  description?: string;
  fields: readonly string[];
};
