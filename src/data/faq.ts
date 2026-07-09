import type { FaqItem, FaqCategory } from '@/types/faq';

// Placeholder data — replace/expand with real, verified answers once confirmed.
export const faqItems: FaqItem[] = [
  {
    category: 'General',
    question: 'What industries does GasApps serve?',
    answer:
      'We serve oil & gas, chemical processing, manufacturing, and infrastructure sectors, supplying fittings, instrumentation, and engineering services tailored to each industry\u2019s requirements.',
  },
  {
    category: 'General',
    question: 'Do you offer engineering consultation, or just products?',
    answer:
      'Both. Alongside our product catalog, we offer installation support, calibration services, and ongoing maintenance consultation to support the full equipment lifecycle.',
  },
  {
    category: 'Products',
    question: 'Are your products certified to industry standards?',
    answer:
      'Yes. Depending on the product, our fittings and valves are certified to standards including API 6D, ASME B16.34, and ISO 9001. Certification details are listed on each product\u2019s page.',
  },
  {
    category: 'Products',
    question: 'Can I request a custom specification not listed on your site?',
    answer:
      'Yes. Our product catalog reflects our standard offerings, but many items can be customized for specific pressure ratings, materials, or connection types. Use the "Request a Quote" button to describe your requirements.',
  },
  {
    category: 'Ordering',
    question: 'How do I get pricing for a product?',
    answer:
      'Pricing depends on specification, quantity, and customization, so we don\u2019t publish fixed prices. Use the "Request a Quote" button on any product or service page, and our team will follow up with pricing and lead time.',
  },
  {
    category: 'Ordering',
    question: 'Is there a minimum order quantity?',
    answer:
      'This varies by product and is discussed as part of the quote process. Let us know your expected volume when requesting a quote.',
  },
  {
    category: 'Shipping',
    question: 'What are typical lead times?',
    answer:
      'Lead times vary by product, typically ranging from 1 to 4 weeks depending on complexity and stock availability. Specific lead times are listed on each product page.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer:
      'Please contact our team to confirm shipping options and lead times for your specific location.',
  },
  {
    category: 'Support',
    question: 'Do you offer calibration for equipment purchased elsewhere?',
    answer:
      'In most cases, yes. Contact our team with your equipment details and we can advise on calibration service availability.',
  },
  {
    category: 'Support',
    question: 'What does your warranty cover?',
    answer:
      'Warranty terms vary by product (typically 1\u20132 years) and are listed on each product\u2019s page. Warranties cover manufacturing defects under normal operating conditions.',
  },
];

export const faqCategories: (FaqCategory | 'All')[] = [
  'All',
  'General',
  'Products',
  'Ordering',
  'Shipping',
  'Support',
];
