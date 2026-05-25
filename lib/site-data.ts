import type {
  CtaLink,
  FaqCategory,
  FooterLinkGroup,
  NavItem,
  Product,
  ProductCategory,
  QualityCarePageContent,
  Step,
  TrustItem,
} from "@/lib/types";

export const siteNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products", showCaret: true },
  { label: "Quality & Care", href: "/quality-care" },
  { label: "Contact", href: "/contact" },
];

export const contactConfig = {
  hasConfiguredDetails: true,
  phone: "",
  email: "support@wellness.apexcompounding.com",
  addressLines: [],
  supportHours: [],
} as const;

export const supportPaths = [
  {
    title: "New Inquiries",
    description:
      "Questions about getting started, product availability, or the assessment process.",
  },
  {
    title: "Existing Client Support",
    description:
      "Help with follow-up questions, account access, or order-related updates.",
  },
  {
    title: "General Support",
    description:
      "General Apex Wellness questions, site support, and next-step guidance.",
  },
] as const;

export const heroTrustItems: TrustItem[] = [
  {
    title: "Secure Patient Process",
    description: "A guided intake path designed to feel private, polished, and easy to follow.",
  },
  {
    title: "Provider Review",
    description:
      "Your submitted information is reviewed by a qualified provider to determine the appropriate next step in your Apex Wellness referral process.",
  },
  {
    title: "Lyophilized Stability",
    description:
      "Lyophilized powder formatting is designed to support product stability, cleaner storage, and reliable preparation before use.",
  },
  {
    title: "Discreet Fulfillment",
    description:
      "Orders are prepared with secure, discreet packaging to protect privacy from processing through delivery.",
  },
];

export const trustItems: TrustItem[] = [
  {
    title: "Precision Formulation",
    description: "Prepared with structured handling, polished presentation, and clear product hierarchy.",
  },
  {
    title: "Quality Standards",
    description: "Product pages, visuals, and support touchpoints are built around consistency and trust.",
  },
  {
    title: "Sterile Handling",
    description: "Storage, handling, and reconstitution guidance is kept readable, concise, and product specific.",
  },
  {
    title: "Discreet Fulfillment",
    description: "Protective packaging and privacy-conscious delivery language support a calmer customer experience.",
  },
  {
    title: "Responsive Support",
    description: "Support pathways are structured to make new inquiries and follow-up questions feel straightforward.",
  },
  {
    title: "Secure Checkout",
    description: "Checkout and next-step messaging are designed to feel polished, reassuring, and conversion focused.",
  },
];

const globalProductFaqs = [
  {
    question: "Do I need to become a patient?",
    answer:
      "Some products may require review by a licensed medical provider. The patient process helps determine eligibility where applicable.",
  },
  {
    question: "Do products require refrigerated shipping?",
    answer:
      "Products ship with handling guidance appropriate to the formulation and order details provided at the time of fulfillment.",
  },
  {
    question: "What does lyophilized mean?",
    answer:
      "Lyophilized means the product is prepared in a dry powder format and intended for reconstitution before use.",
  },
  {
    question: "How should products be stored?",
    answer:
      "Follow provider instructions, dispensing guidance, and product-specific handling information supplied with your order.",
  },
] as const;

const safetyWellnessDisclaimer =
  "Products shown are available only where permitted and may require review through the Apex Wellness intake process. Information on this website is provided for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.";

export const products: Product[] = [
  {
    slug: "trimix",
    name: "TriMix",
    subtitle:
      "Precision prepared intracavernosal formulation prepared for reconstitution.",
    imageSrc: "/images/trimix.png",
    imageAlt: "Product card transparent render for TriMix lyophilized powder",
    sizes: ["2.5mL Multi-Dose Vial", "5mL Multi-Dose Vial"],
    variants: [
      { label: "2.5mL", price: "$169.99" },
      { label: "5mL", price: "$309.99" },
    ],
    status: "pre-order",
    buttonLabel: "View Details",
    categories: ["Performance"],
    featured: true,
    href: "/products/trimix",
    requiresReferralCode: true,
    categoryLabel: "Performance Wellness",
    bestFor: "Best for guided performance-focused wellness review and structured next-step support.",
    cardEyebrow: "Lyophilized Powder",
    cardTitle: "TriMix",
    cardDescription:
      "A precision-formulated multi-component wellness blend developed for reliable performance, smooth reconstitution, and consistent preparation quality.",
    priceLabel: "From $169.99",
    strength: "150MG / 5MG / 50MCG",
    activeIngredients: [
      "Papaverine HCl",
      "Phentolamine",
      "Prostaglandin E1",
    ],
    productType: ["Lyophilized Powder", "Multi-Dose Vial"],
    heroTitle: "TriMix",
    heroDescription:
      "An advanced multi-component wellness formulation designed for precision, consistency, and elevated performance in a refined lyophilized format.",
    featureBadges: [
      "Stability-Focused Format",
      "Quality-Focused Preparation",
      "Prepared for Reconstitution",
      "Professional Handling",
      "Multi-Dose Vial",
    ],
    overview: [
      "TriMix is a provider-guided, lyophilized formulation presented for review, preparation, and discreet fulfillment where available.",
      "Its presentation is designed to support a polished clinical experience with clear handling guidance, refined product presentation, and a stable format before reconstitution.",
    ],
    highlights: [
      "Lyophilized powder formulation",
      "Prepared for reconstitution",
      "Precision prepared",
      "Clinical-grade ingredients",
      "Multi-dose vial format",
      "Stability-focused packaging",
    ],
    stabilityTitle: "Lyophilized Stability",
    stabilityDescription:
      "Freeze-dried formulation designed to support improved long-term storage, clean presentation, and product consistency before reconstitution.",
    usageInformation:
      "Use only as prescribed by a licensed medical provider. Reconstitution and handling should follow the instructions provided with your order.",
    reconstitutionIntro:
      "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    reconstitutionSteps: [
      "Use the instructed sterile diluent",
      "Add diluent to vial as directed",
      "Gently swirl until dissolved",
      "Inspect before use",
      "Use only as prescribed",
    ],
    storageDetails: [
      "Store as directed by the dispensing instructions",
      "Protect from light",
      "Keep in protective packaging until use",
      "Keep out of reach of children",
      "Follow all beyond-use date and handling instructions provided with your order",
    ],
    faqItems: [
      ...globalProductFaqs,
      {
        question: "How is TriMix fulfilled?",
        answer:
          "TriMix is fulfilled through a secure patient process with professional packaging, discreet shipping, and handling instructions provided with the order.",
      },
      {
        question: "Do I need a prescription?",
        answer:
          "Some products may require prescription review depending on the product and applicable regulations.",
      },
    ],
    disclaimer: safetyWellnessDisclaimer,
  },
  {
    slug: "quadmix",
    name: "QuadMix",
    subtitle:
      "Precision prepared intracavernosal formulation prepared for reconstitution.",
    imageSrc: "/images/quadmix.png",
    imageAlt: "Product card transparent render for QuadMix lyophilized powder",
    sizes: ["2.5mL Multi-Dose Vial", "5mL Multi-Dose Vial"],
    variants: [
      { label: "2.5mL", price: "$199.99" },
      { label: "5mL", price: "$379.99" },
    ],
    status: "pre-order",
    buttonLabel: "View Details",
    categories: ["Performance"],
    href: "/products/quadmix",
    requiresReferralCode: true,
    categoryLabel: "Performance Wellness",
    bestFor: "Best for those seeking product education and future availability updates.",
    cardEyebrow: "Lyophilized Powder",
    cardTitle: "QuadMix",
    cardDescription:
      "Precision-prepared lyophilized formulation presented for provider-guided review, reconstitution, and professional fulfillment where available.",
    priceLabel: "From $199.99",
    strength: "150MG / 10MG / 100MCG / 1MG",
    activeIngredients: [
      "Papaverine HCl",
      "Phentolamine",
      "Prostaglandin E1",
      "Atropine Sulfate",
    ],
    productType: ["Lyophilized Powder", "Multi-Dose Vial"],
    heroTitle: "QuadMix",
    heroDescription:
      "Precision-prepared lyophilized formulation presented for provider-guided review, reconstitution, and professional fulfillment where available.",
    featureBadges: [
      "Stability-Focused Format",
      "Quality-Focused Preparation",
      "Prepared for Reconstitution",
      "Professional Handling",
      "Multi-Dose Vial",
    ],
    overview: [
      "QuadMix is a provider-guided, lyophilized formulation presented for review, preparation, and discreet fulfillment where available.",
      "Its presentation emphasizes clean clinical styling, quality-focused handling language, and a stable format before reconstitution.",
    ],
    highlights: [
      "Lyophilized powder formulation",
      "Prepared for reconstitution",
      "Multi-dose vial format",
      "Clinical-grade ingredients",
      "Stability-focused packaging",
      "Provider review required where applicable",
    ],
    stabilityTitle: "Lyophilized Stability",
    stabilityDescription:
      "Freeze-dried formulation designed to support improved long-term storage and product consistency. The lyophilized presentation is intended to help preserve product integrity prior to reconstitution while maintaining a refined clinical appearance.",
    usageInformation:
      "Use only as prescribed by a licensed medical provider. Reconstitution and handling should follow the instructions provided with your order.",
    reconstitutionIntro:
      "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    reconstitutionSteps: [
      "Use the instructed sterile diluent",
      "Add diluent to vial as directed",
      "Gently swirl until dissolved",
      "Inspect before use",
      "Use only as prescribed",
    ],
    storageDetails: [
      "Store as directed by the dispensing instructions",
      "Protect from light",
      "Do not freeze unless specifically instructed",
      "Keep out of reach of children",
      "Follow all beyond-use date and handling instructions provided with your order",
    ],
    faqItems: [
      ...globalProductFaqs,
      {
        question: "Is QuadMix available for pre-order?",
        answer:
          "QuadMix is currently available for pre-order. Pre-orders require full payment at checkout and may still require review where applicable.",
      },
      {
        question: "Do I need a prescription?",
        answer:
          "Some products may require prescription review depending on the product and applicable regulations.",
      },
    ],
    disclaimer: safetyWellnessDisclaimer,
  },
  {
    slug: "nad-500mg",
    name: "NAD+ 500MG",
    subtitle: "Nicotinamide Adenine Dinucleotide prepared for reconstitution.",
    imageSrc: "/images/nad-500mg.png",
    imageAlt: "Product card transparent render for NAD+ 500MG lyophilized powder",
    sizes: ["10mL Vial"],
    variants: [{ label: "10mL", price: "$149.99" }],
    status: "pre-order",
    buttonLabel: "View Details",
    categories: ["Wellness", "Longevity"],
    href: "/products/nad-500mg",
    requiresReferralCode: true,
    categoryLabel: "Longevity Support",
    bestFor: "Best for future wellness-focused availability updates and guided review interest.",
    cardEyebrow: "Lyophilized Powder",
    cardTitle: "NAD+ 500MG",
    cardDescription:
      "A high-purity wellness formulation created to support cellular energy, recovery, and overall vitality in a stabilized lyophilized format.",
    priceLabel: "$149.99",
    strength: "500MG",
    activeIngredients: ["Nicotinamide Adenine Dinucleotide"],
    productType: ["Lyophilized Powder", "Multi-Dose Vial"],
    heroTitle: "NAD+ 500MG",
    heroDescription:
      "Premium lyophilized formulation presented for provider-guided review, clean clinical presentation, and professional fulfillment where available.",
    featureBadges: [
      "Stability-Focused Format",
      "Prepared for Reconstitution",
      "Clean Clinical Presentation",
      "Professional Fulfillment",
      "Protective Packaging",
      "Pre-Order Available",
    ],
    overview: [
      "NAD+ 500MG is presented as a lyophilized formulation prepared for reconstitution and intended for patient-specific use under the direction of a licensed healthcare provider.",
      "Its presentation emphasizes professional handling, stability-focused storage, and a premium clinical wellness experience from first view through fulfillment.",
    ],
    highlights: [
      "500MG NAD+ formula",
      "Lyophilized powder format",
      "Prepared for reconstitution",
      "Premium clinical presentation",
      "Stability-focused packaging",
      "Pre-order available",
    ],
    stabilityTitle: "Prepared for Stability",
    stabilityDescription:
      "Designed to support careful handling, polished presentation, and a refined patient experience before product use instructions are provided.",
    usageInformation:
      "Use only as prescribed by a licensed medical provider. Reconstitution and handling should follow the instructions provided with your order.",
    reconstitutionIntro:
      "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    reconstitutionSteps: [
      "Review the provided instructions",
      "Use the supplied or directed sterile diluent",
      "Reconstitute carefully as instructed",
      "Inspect before use",
      "Follow provider guidance",
    ],
    storageDetails: [
      "Store as directed with your order",
      "Protect from light",
      "Keep in original packaging until use",
      "Keep out of reach of children",
      "Follow the handling instructions supplied with the formulation",
    ],
    faqItems: [
      ...globalProductFaqs,
      {
        question: "Do I need a prescription?",
        answer:
          "Some products may require prescription review depending on the product and applicable regulations.",
      },
      {
        question: "Is NAD+ 500MG available for pre-order?",
        answer:
          "NAD+ 500MG is currently available for pre-order. Pre-orders require full payment at checkout and may still require review where applicable.",
      },
    ],
    disclaimer: safetyWellnessDisclaimer,
  },
  {
    slug: "pt-141",
    name: "PT-141",
    subtitle: "Bremelanotide / PT-141 prepared as a lyophilized formulation for reconstitution.",
    imageSrc: "/images/pt-141.png",
    imageAlt: "Product card transparent render for PT-141 lyophilized peptide",
    sizes: ["10mL Vial"],
    variants: [{ label: "10mL", price: "$149.99" }],
    status: "pre-order",
    buttonLabel: "View Details",
    categories: ["Wellness", "Performance"],
    href: "/products/pt-141",
    requiresReferralCode: true,
    categoryLabel: "Wellness Support",
    bestFor: "Best for exploring future product access with a private, guided intake path.",
    cardEyebrow: "Lyophilized Peptide",
    cardTitle: "PT-141",
    cardDescription:
      "A peptide-based wellness formulation designed to support responsiveness, confidence, and a more elevated personal experience.",
    priceLabel: "$149.99",
    strength: "10MG",
    activeIngredients: ["Bremelanotide / PT-141"],
    productType: ["Lyophilized Peptide", "Multi-Dose Vial"],
    heroTitle: "PT-141",
    heroDescription:
      "Premium lyophilized formulation presented for provider-guided review, clean clinical presentation, and secure pre-order access.",
    featureBadges: [
      "Stability-Focused Format",
      "Prepared for Reconstitution",
      "Clean Clinical Presentation",
      "Discreet Fulfillment",
      "Protective Packaging",
      "Pre-Order Available",
    ],
    overview: [
      "PT-141 is prepared as a lyophilized formulation for reconstitution prior to use and is intended for patient-specific use under the direction of a licensed healthcare provider.",
      "Its presentation is designed to emphasize clarity, professional handling, and a premium biotech wellness aesthetic across the patient journey.",
    ],
    highlights: [
      "10MG lyophilized peptide",
      "Prepared for reconstitution",
      "Clean clinical presentation",
      "Stability-focused powder format",
      "Professional wellness positioning",
      "Pre-order available",
    ],
    stabilityTitle: "Refined Product Presentation",
    stabilityDescription:
      "Prepared to support professional handling, premium presentation, and a stability-focused patient experience before use.",
    usageInformation:
      "Use only as prescribed by a licensed medical provider. Reconstitution and handling should follow the instructions supplied with your order.",
    reconstitutionIntro:
      "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    reconstitutionSteps: [
      "Review provided instructions",
      "Prepare the instructed sterile diluent",
      "Reconstitute carefully",
      "Inspect before use",
      "Follow provider guidance",
    ],
    storageDetails: [
      "Store as directed with your order",
      "Protect from light",
      "Keep in original packaging until use",
      "Keep out of reach of children",
      "Follow the provided handling instructions",
    ],
    faqItems: [
      ...globalProductFaqs,
      {
        question: "Do I need a prescription?",
        answer:
          "Some products may require prescription review depending on the product and applicable regulations.",
      },
      {
        question: "Is PT-141 available for pre-order?",
        answer:
          "PT-141 is currently available for pre-order. Pre-orders require full payment at checkout and may still require review where applicable.",
      },
    ],
    disclaimer: safetyWellnessDisclaimer,
  },
  {
    slug: "bacteriostatic-water",
    name: "Bacteriostatic Water",
    subtitle:
      "A sterile-style diluent presentation designed for reconstitution support in a clean multi-use vial format.",
    imageSrc: "/images/bacteriostatic-water.png",
    imageAlt: "Product card transparent render for Bacteriostatic Water",
    sizes: ["5mL Multi-Use Vial", "10mL Multi-Use Vial"],
    variants: [
      { label: "5mL", price: "$14.99" },
      { label: "10mL", price: "$24.99" },
    ],
    status: "pre-order",
    buttonLabel: "View Details",
    categories: ["Wellness"],
    href: "/products/bacteriostatic-water",
    requiresReferralCode: true,
    categoryLabel: "Reconstitution Support",
    bestFor: "Best for reconstitution support paired with clear handling communication and size selection.",
    cardEyebrow: "Diluent",
    cardTitle: "Bacteriostatic Water",
    cardDescription:
      "A sterile multi-use diluent formulated with benzyl alcohol to support safe and consistent reconstitution of lyophilized preparations.",
    priceLabel: "From $14.99",
    strength: "Deionized Pure Water with 0.9% Benzyl Alcohol",
    activeIngredients: ["Deionized Pure Water", "0.9% Benzyl Alcohol"],
    productType: ["Diluent", "Reconstitution Solution"],
    heroTitle: "Bacteriostatic Water",
    heroDescription:
      "Quality-focused reconstitution support formulation presented with clean handling guidance and professional fulfillment language.",
    featureBadges: [
      "Reconstitution Support",
      "Quality-Focused Preparation",
      "Professional Handling",
      "Multi-Use Vial",
      "Prepared for Reconstitution",
      "Clean Clinical Presentation",
    ],
    overview: [
      "Bacteriostatic Water is presented as a diluent and reconstitution support product featuring deionized pure water with 0.9% benzyl alcohol in a clean multi-use vial format.",
      "Its presentation is designed to align with the same premium clinical standards used across the Apex Wellness product catalog while supporting reconstitution-related workflows.",
    ],
    highlights: [
      "Reconstitution support solution",
      "Deionized pure water",
      "0.9% benzyl alcohol",
      "Multi-use vial format",
      "Clean clinical presentation",
      "Designed to pair with lyophilized formulations",
    ],
    stabilityTitle: "Handling & Storage",
    stabilityDescription:
      "Designed for clean professional presentation, reconstitution support, and quality-focused handling language aligned with the rest of the Apex Wellness catalog.",
    usageInformation:
      "Use only as directed by a licensed medical provider or dispensing instructions.",
    reconstitutionIntro:
      "Prepared for reconstitution prior to use. Use only as prescribed by a licensed medical provider.",
    reconstitutionSteps: [
      "Review the supplied instructions",
      "Use only the recommended diluent for the intended formulation",
      "Handle using clean technique",
      "Inspect before use",
      "Follow provider guidance",
    ],
    storageDetails: [
      "Store as directed with your order",
      "Keep in original packaging until use",
      "Protect from contamination",
      "Keep out of reach of children",
      "Follow supplied handling instructions",
    ],
    faqItems: [
      ...globalProductFaqs,
      {
        question: "Are products ready to use immediately?",
        answer:
          "Lyophilized products are prepared for reconstitution prior to use. Follow provider instructions and product-specific guidance.",
      },
      {
        question: "Can I use any diluent?",
        answer:
          "Use only the diluent or reconstitution solution recommended by your licensed provider or dispensing instructions.",
      },
    ],
    disclaimer: safetyWellnessDisclaimer,
  },
];

export const productFilters: Array<"All" | ProductCategory> = [
  "All",
  "Wellness",
  "Performance",
  "Longevity",
];

export const howItWorksSteps: Step[] = [
  {
    title: "Complete Intake",
    description: "Share your goals, wellness interests, and contact details through a guided request form.",
  },
  {
    title: "Provider Review",
    description: "Submitted information is reviewed where required so the next step feels clear and appropriate.",
  },
  {
    title: "Referral Approval",
    description: "When appropriate, the referral moves forward with clear communication on what comes next.",
  },
  {
    title: "Precision Preparation",
    description: "Product presentation and handling guidance are prepared with consistency, clarity, and professionalism.",
  },
  {
    title: "Secure Fulfillment",
    description: "Approved orders move forward with protective packaging and privacy-conscious fulfillment.",
  },
];

const startIntakeCta: CtaLink = {
  label: "Start Intake",
  href: "/become-a-patient#intake-form",
};

const viewProductsCta: CtaLink = {
  label: "View Products",
  href: "/products",
};

const contactSupportCta: CtaLink = {
  label: "Contact Support",
  href: "/contact",
};

const qualityCareHowItWorksCta: CtaLink = {
  label: "Learn How It Works",
  href: "/quality-care#how-it-works",
};

export const qualityCarePageContent: QualityCarePageContent = {
  hero: {
    title: "Quality & Care",
    description:
      "A premium guided process built around secure intake, referral review, approved referrals, discreet fulfillment, and calm communication at each step.",
    primaryCta: startIntakeCta,
    secondaryCta: viewProductsCta,
  },
  sections: [
    {
      id: "guided-referral-process",
      eyebrow: "Guided Process",
      title: "A More Structured Path From Intake To Fulfillment",
      description:
        "Apex Wellness is organized around a referral-based experience. Each request begins with intake, moves through referral review, and only proceeds toward discreet fulfillment when the required steps are complete.",
      cards: [
        {
          title: "Structured Intake",
          description:
            "The intake flow collects the key request details in a clear format so the next step can be reviewed without unnecessary friction.",
          icon: "intake",
        },
        {
          title: "Referral Review",
          description:
            "Submitted information is reviewed before a request can move forward. Approval is not automatic, and additional information may be requested.",
          icon: "review",
        },
        {
          title: "Approved Referral Flow",
          description:
            "Approved referrals move into the next stage with product selection, order details, and fulfillment timing presented in a more organized way.",
          icon: "workflow",
        },
        {
          title: "Discreet By Design",
          description:
            "The experience is designed to feel private from first visit through packaging, tracking, and post-order communication.",
          icon: "privacy",
        },
        {
          title: "Clear Next Steps",
          description:
            "Each stage is written to make the next action obvious, whether that means completing intake, waiting for referral review, or proceeding to checkout.",
          icon: "next-steps",
        },
      ],
    },
    {
      id: "product-clarity",
      eyebrow: "Product Clarity",
      title: "Product Details Presented With Restraint",
      description:
        "Product pages are structured to be direct and easy to scan. Strength, format, size options, active components, availability status, and fulfillment timing are presented without inflated claims or unnecessary language.",
      cta: viewProductsCta,
      cards: [
        {
          title: "Component Visibility",
          description:
            "Active components are shown in a clean layout so customers can review what is listed before beginning the guided process.",
          icon: "ingredient",
        },
        {
          title: "Strength & Size Details",
          description:
            "Available strengths, vial formats, and size options are displayed near the primary action areas to reduce unnecessary searching.",
          icon: "strength",
        },
        {
          title: "Pre-Order Visibility",
          description:
            "Pre-order notices are placed where customers can see expected timing before moving into cart or checkout.",
          icon: "status",
        },
        {
          title: "No Automatic Progression",
          description:
            "A referral code or submitted intake does not guarantee approval, outcome, or fulfillment. Requests move forward only when the required review step is complete.",
          icon: "review",
        },
      ],
    },
    {
      id: "process-control",
      eyebrow: "Process Control",
      title: "A Controlled Experience With Fewer Unknowns",
      description:
        "The process is intentionally paced. Customers are guided through intake, referral review, referral access, cart, checkout, and fulfillment updates without being asked to interpret a complicated workflow.",
      cta: startIntakeCta,
      cards: [
        {
          title: "Private Entry Point",
          description:
            "Customers begin through intake or referral access, depending on the route they were given.",
          icon: "intake",
        },
        {
          title: "Referral Access",
          description:
            "Verified referral codes can unlock the purchase path for eligible products while preserving referral attribution.",
          icon: "verification",
        },
        {
          title: "Approved Referrals",
          description:
            "Once a referral is approved, the request can continue into checkout, order processing, and fulfillment communication.",
          icon: "approval",
        },
        {
          title: "Order Review",
          description:
            "Product, size, referral code, and order details are kept together so the internal record remains easier to follow.",
          icon: "workflow",
        },
        {
          title: "Status Updates",
          description:
            "Customers receive clearer status language around pre-order timing, referral progress, and shipment tracking when available.",
          icon: "status",
        },
      ],
    },
    {
      id: "packaging-and-discretion",
      eyebrow: "Packaging & Discretion",
      title: "Discreet Fulfillment With A Refined Presentation",
      description:
        "Approved referrals are fulfilled with a quiet, privacy-conscious presentation. Packaging language, order updates, and tracking communication are designed to feel discreet rather than clinical or overly promotional.",
      cta: qualityCareHowItWorksCta,
      cards: [
        {
          title: "Discreet Outer Packaging",
          description:
            "Outbound shipments are presented with privacy in mind and avoid unnecessary product-forward language on the exterior.",
          icon: "package",
        },
        {
          title: "Organized Interior",
          description:
            "Interior materials are arranged to make product identification and order review feel clean and deliberate.",
          icon: "labeling",
        },
        {
          title: "Tracking When Available",
          description:
            "When tracking is available, customers receive order movement details without needing to contact the team for basic status.",
          icon: "status",
        },
        {
          title: "Professional Presentation",
          description:
            "The fulfillment experience is designed to feel minimal, premium, and aligned with the rest of the Apex Wellness brand.",
          icon: "presentation",
        },
      ],
    },
    {
      id: "communication",
      eyebrow: "Communication",
      title: "Calm Guidance Without Overpromising",
      description:
        "The communication model is built around restraint: clear answers, practical next steps, and no guaranteed approvals or exaggerated outcome language.",
      cta: contactSupportCta,
      cards: [
        {
          title: "Guided Experience",
          description:
            "The guided process is broken into visible steps so customers can understand what has happened and what remains.",
          icon: "guidance",
        },
        {
          title: "Referral Status Questions",
          description:
            "Customers can ask about intake submission, referral review status, referral access, or fulfillment timing.",
          icon: "communication",
        },
        {
          title: "Clean Language",
          description:
            "Page copy is written to stay calm, direct, and specific without creating claims the process cannot guarantee.",
          icon: "presentation",
        },
        {
          title: "Responsible Review",
          description:
            "Requests move forward only after the required referral review steps are complete and the request is eligible to proceed.",
          icon: "review",
        },
      ],
    },
  ],
  howItWorks: {
    id: "how-it-works",
    eyebrow: "How It Works",
    title: "How The Guided Process Works",
    description:
      "A clear path from intake or referral access through referral review, checkout, and discreet fulfillment.",
    primaryCta: startIntakeCta,
    secondaryCta: viewProductsCta,
    steps: [
      {
        title: "Complete Intake",
        description:
          "Begin with the intake form or enter a verified referral code when you have been given referral access.",
        icon: "intake",
      },
      {
        title: "Referral Review",
        description:
          "Submitted information is reviewed before a request can proceed. Approval, outcome, and fulfillment are not guaranteed.",
        icon: "review",
      },
      {
        title: "Approved Referral",
        description:
          "Approved referrals move into the next stage. If more information is needed, the customer may be contacted before the request can continue.",
        icon: "approval",
      },
      {
        title: "Checkout & Order Record",
        description:
          "Eligible approved referrals can continue to checkout, with referral code attribution and order details attached to the record.",
        icon: "verification",
      },
      {
        title: "Discreet Fulfillment",
        description:
          "Orders move through discreet fulfillment with tracking information provided when available.",
        icon: "fulfillment",
      },
    ],
  },
};

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Performance", href: "/performance" },
      { label: "Wellness", href: "/wellness" },
      { label: "Longevity", href: "/longevity" },
      { label: "Bacteriostatic Water", href: "/products/bacteriostatic-water" },
    ],
  },
  {
    title: "Patient Resources",
    links: [
      { label: "Become a Patient", href: "/become-a-patient" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQs", href: "/faqs" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Providers", href: "/our-providers" },
      { label: "Quality & Care", href: "/quality-care" },
      { label: "Contact Us", href: "/contact" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return Policy", href: "/return-policy" },
      { label: "Forgot Password", href: "/forgot-password" },
      { label: "Create Account", href: "/create-account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "Wellness Notice", href: "/wellness-notice" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const globalProductFaqQuestions = new Set<string>(globalProductFaqs.map((item) => item.question));

const productFaqCategories: FaqCategory[] = products
  .map((product) => ({
    title: `${product.name} FAQs`,
    items:
      product.faqItems?.filter((item) => !globalProductFaqQuestions.has(item.question)) ?? [],
  }))
  .filter((category) => category.items.length > 0);

export const faqCategories: FaqCategory[] = [
  {
    title: "Patient Process",
    items: [
      {
        question: "Do I need to become a patient?",
        answer:
          "Some products may require review by a licensed medical provider. The patient process helps determine eligibility where applicable.",
      },
      {
        question: "How does the medical review work?",
        answer:
          "Patients complete an assessment, after which information may be reviewed by an appropriate licensed provider where required.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "What does lyophilized mean?",
        answer:
          "Lyophilized means the product is prepared in a dry powder format and intended for reconstitution before use.",
      },
      {
        question: "Do products require refrigerated shipping?",
        answer:
          "Products ship with handling guidance appropriate to the formulation and order details provided at the time of fulfillment.",
      },
    ],
  },
  {
    title: "Reconstitution",
    items: [
      {
        question: "Are products ready to use immediately?",
        answer:
          "Lyophilized products are prepared for reconstitution prior to use. Follow provider instructions and product-specific guidance.",
      },
      {
        question: "Can I use any diluent?",
        answer:
          "Use only the diluent or reconstitution solution recommended by your licensed provider or dispensing instructions.",
      },
    ],
  },
  {
    title: "Shipping & Fulfillment",
    items: [
      {
        question: "How are products shipped?",
        answer:
          "Products are prepared for discreet fulfillment using protective packaging appropriate for lyophilized powder formulations.",
      },
      {
        question: "Is shipping discreet?",
        answer:
          "Yes. Orders are packaged with a professional, privacy-conscious fulfillment approach.",
      },
    ],
  },
  {
    title: "Safety & Prescriptions",
    items: [
      {
        question: "Do I need a prescription?",
        answer:
          "Some products may require prescription review depending on the product and applicable regulations.",
      },
      {
        question: "Is this medical advice?",
        answer:
          "No. Website information is educational only and is not a substitute for professional medical advice, diagnosis, or treatment.",
      },
    ],
  },
  ...productFaqCategories,
];

export const globalDisclaimer =
  safetyWellnessDisclaimer;
