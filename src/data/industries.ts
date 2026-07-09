import type { Industry } from '@/types/industry';

// Placeholder images (verified working Unsplash URLs, free to use commercially under the
// Unsplash License). Replace with real photography once available.
const OIL_GAS_IMAGE =
  'https://images.unsplash.com/photo-1578356058390-f58c575337a2?w=1200&auto=format&fit=crop&q=80';
const MANUFACTURING_IMAGE =
  'https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1200&auto=format&fit=crop&q=80';
const CHEMICAL_IMAGE =
  'https://images.unsplash.com/photo-1767274714714-dda4c25c6376?w=1200&auto=format&fit=crop&q=80';
const INFRASTRUCTURE_IMAGE =
  'https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?w=1200&auto=format&fit=crop&q=80';

// Placeholder data — replace with real industry data once available.
export const industries: Industry[] = [
  {
    slug: 'oil-gas',
    name: 'Oil & Gas',
    summary: 'Fittings and instrumentation engineered for upstream and downstream operations.',
    description:
      'From wellheads to refineries, oil & gas operations demand fittings and instrumentation that perform reliably under extreme pressure, temperature, and corrosive conditions. We supply components engineered and certified for these exact demands.',
    applications: [
      'Wellhead and pipeline systems',
      'Refinery process instrumentation',
      'Offshore platform fittings',
      'Gas metering and regulation',
    ],
    images: [OIL_GAS_IMAGE],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    summary: 'Reliable components supporting continuous industrial production lines.',
    description:
      'Manufacturing facilities depend on consistent, reliable fluid and gas control to keep production lines running. Our fittings and instrumentation are built to minimize downtime and support demanding duty cycles.',
    applications: [
      'Compressed air systems',
      'Process line instrumentation',
      'Automated production equipment',
      'Facility utility systems',
    ],
    images: [MANUFACTURING_IMAGE],
  },
  {
    slug: 'chemical-processing',
    name: 'Chemical Processing',
    summary: 'Corrosion-resistant solutions for demanding chemical environments.',
    description:
      'Chemical processing environments require materials and designs that withstand corrosive media without compromising safety or accuracy. We supply corrosion-resistant fittings and precision instrumentation built for these conditions.',
    applications: [
      'Corrosive fluid handling',
      'Reactor and vessel instrumentation',
      'Chemical dosing systems',
      'Safety relief and containment',
    ],
    images: [CHEMICAL_IMAGE],
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    summary: 'Dependable systems for municipal and large-scale infrastructure projects.',
    description:
      'Municipal gas distribution and large-scale infrastructure projects require components built for decades of reliable service with minimal maintenance. We supply fittings and instrumentation designed for long-term infrastructure use.',
    applications: [
      'Municipal gas distribution',
      'Water treatment facilities',
      'District heating systems',
      'Public utility infrastructure',
    ],
    images: [INFRASTRUCTURE_IMAGE],
  },
];
