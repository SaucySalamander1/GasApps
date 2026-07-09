import type { Service } from '@/types/service';

const INSTALLATION_IMAGE =
  'https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1200&auto=format&fit=crop&q=80';
const CALIBRATION_IMAGE =
  'https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?w=1200&auto=format&fit=crop&q=80';
const MAINTENANCE_IMAGE =
  'https://images.unsplash.com/photo-1767274714714-dda4c25c6376?w=1200&auto=format&fit=crop&q=80';

// Placeholder data — replace with real service data once a backend/CMS exists (Phase 5).
export const services: Service[] = [
  {
    slug: 'installation-support',
    name: 'Installation Support',
    summary: 'On-site guidance and technical support for correct, code-compliant installation.',
    description:
      'Our engineering team provides hands-on support during installation to ensure every fitting and instrument is correctly specified, positioned, and commissioned according to applicable codes and standards.',
    features: [
      'On-site technical supervision',
      'Code compliance verification',
      'Commissioning support',
      'Installation documentation',
    ],
    process: [
      {
        title: 'Site Assessment',
        description: 'Our engineers review your site plans and specifications.',
      },
      {
        title: 'Installation Planning',
        description: 'We develop a detailed installation and safety plan.',
      },
      {
        title: 'On-Site Support',
        description: 'Our team supports installation and commissioning on-site.',
      },
      { title: 'Final Verification', description: 'We verify correct operation before sign-off.' },
    ],
    images: [INSTALLATION_IMAGE],
    duration: '1\u20132 weeks on-site',
    coverageArea: 'Nationwide',
    certificationCodes: ['ISO 9001'],
  },
  {
    slug: 'calibration-services',
    name: 'Calibration Services',
    summary: 'Precision calibration to keep instrumentation accurate and compliant over time.',
    description:
      'Regular calibration ensures your pressure gauges, transmitters, and flow meters continue to deliver accurate readings — protecting both safety and process efficiency over the equipment lifecycle.',
    features: [
      'Certified calibration procedures',
      'Traceable calibration certificates',
      'On-site and lab-based options',
      'Scheduled maintenance programs',
    ],
    process: [
      {
        title: 'Assessment',
        description: 'We review your instrumentation and calibration history.',
      },
      {
        title: 'Calibration',
        description: 'Precision calibration performed to manufacturer standards.',
      },
      { title: 'Certification', description: 'You receive a traceable calibration certificate.' },
      { title: 'Scheduling', description: 'We help set up a recurring calibration schedule.' },
    ],
    images: [CALIBRATION_IMAGE],
    duration: '1\u20133 days per visit',
    coverageArea: 'Nationwide',
    certificationCodes: ['ISO 9001'],
  },
  {
    slug: 'maintenance-consultation',
    name: 'Maintenance & Consultation',
    summary: 'Ongoing maintenance plans and expert engineering consultation as needs evolve.',
    description:
      'Beyond one-time installation, we offer ongoing maintenance planning and engineering consultation to help your systems perform reliably as operating conditions and requirements change.',
    features: [
      'Preventive maintenance planning',
      'Engineering consultation on system upgrades',
      'Failure analysis and troubleshooting',
      'Long-term service agreements',
    ],
    process: [
      {
        title: 'Consultation',
        description: 'We discuss your current systems and operational goals.',
      },
      { title: 'Assessment', description: 'Our engineers assess condition and identify risks.' },
      {
        title: 'Recommendation',
        description: 'We provide a maintenance plan or upgrade recommendation.',
      },
      { title: 'Ongoing Support', description: 'We remain available for continued consultation.' },
    ],
    images: [MAINTENANCE_IMAGE],
    duration: 'Ongoing, flexible terms',
    coverageArea: 'Nationwide',
  },
];
