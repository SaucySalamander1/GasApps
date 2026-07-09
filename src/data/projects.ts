import type { Project } from '@/types/project';

const OIL_GAS_IMAGE =
  'https://images.unsplash.com/photo-1578356058390-f58c575337a2?w=1200&auto=format&fit=crop&q=80';
const CHEMICAL_IMAGE =
  'https://images.unsplash.com/photo-1767274714714-dda4c25c6376?w=1200&auto=format&fit=crop&q=80';
const INFRASTRUCTURE_IMAGE =
  'https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?w=1200&auto=format&fit=crop&q=80';

// Placeholder data — replace with real project/case study data once available.
export const projects: Project[] = [
  {
    slug: 'refinery-retrofit',
    name: 'Refinery Valve Retrofit',
    industry: 'oil-gas',
    summary: 'Full valve system upgrade across a 40-year-old refinery, reducing downtime by 30%.',
    challenge:
      'An aging refinery was experiencing frequent unplanned shutdowns due to valve failures across critical process lines, with maintenance costs rising year over year.',
    solution:
      'We conducted a full valve audit, identified high-failure-risk components, and supplied and installed upgraded ball and gate valves engineered for the specific pressure and corrosion conditions on site, along with a revised maintenance schedule.',
    results: [
      { metric: 'Unplanned Downtime', value: '-30%' },
      { metric: 'Valves Replaced', value: '340' },
      { metric: 'Project Duration', value: '6 months' },
    ],
    productSlugs: ['ball-valves', 'gate-valves'],
    images: [OIL_GAS_IMAGE],
  },
  {
    slug: 'chemical-plant-instrumentation',
    name: 'Chemical Plant Instrumentation',
    industry: 'chemical-processing',
    summary: 'Deployment of precision monitoring instrumentation across 12 processing units.',
    challenge:
      'A chemical processing facility needed to upgrade legacy monitoring equipment to meet updated safety regulations and improve process visibility across multiple units.',
    solution:
      'Our team supplied and commissioned temperature transmitters and pressure gauges across all 12 units, integrated with the plant\u2019s existing control system, and provided calibration services to ensure ongoing compliance.',
    results: [
      { metric: 'Units Upgraded', value: '12' },
      { metric: 'Compliance Achieved', value: '100%' },
      { metric: 'Monitoring Accuracy', value: '+40%' },
    ],
    productSlugs: ['temperature-transmitters', 'pressure-gauges'],
    images: [CHEMICAL_IMAGE],
  },
  {
    slug: 'municipal-gas-infrastructure',
    name: 'Municipal Gas Infrastructure',
    industry: 'infrastructure',
    summary: 'Fittings and safety systems supplied for a city-wide gas distribution upgrade.',
    challenge:
      'A municipal utility needed to modernize an aging gas distribution network spanning multiple districts, with minimal disruption to residential and commercial service.',
    solution:
      'We supplied pressure regulators, flange adapters, and gate valves engineered for long-term buried and above-ground installation, along with technical support during phased rollout across the network.',
    results: [
      { metric: 'Network Coverage', value: '85 km' },
      { metric: 'Service Interruptions', value: '0' },
      { metric: 'Project Duration', value: '14 months' },
    ],
    productSlugs: ['pressure-regulators', 'flange-adapters', 'gate-valves'],
    images: [INFRASTRUCTURE_IMAGE],
  },
];
