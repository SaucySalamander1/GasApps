import type { BlogPost } from '@/types/blog';

const VALVE_IMAGE =
  'https://images.unsplash.com/photo-1780034766246-68bab7c0ce00?w=1200&auto=format&fit=crop&q=80';
const MANUFACTURING_IMAGE =
  'https://images.unsplash.com/photo-1717386255773-1e3037c81788?w=1200&auto=format&fit=crop&q=80';
const CHEMICAL_IMAGE =
  'https://images.unsplash.com/photo-1767274714714-dda4c25c6376?w=1200&auto=format&fit=crop&q=80';

// Placeholder data — replace with real blog content once available.
export const blogPosts: BlogPost[] = [
  {
    slug: 'choosing-the-right-valve-material',
    title: 'Choosing the Right Valve Material for Your Application',
    category: 'Engineering',
    date: 'June 2026',
    excerpt:
      'A practical guide to selecting valve materials based on pressure, temperature, and media compatibility.',
    content: [
      'Selecting the correct valve material is one of the most consequential decisions in any fluid or gas control system. Get it wrong, and you risk premature failure, leaks, or costly downtime. Get it right, and the valve can perform reliably for decades.',
      'The starting point is always the media being controlled. Corrosive chemicals demand materials like stainless steel 316 or specialty alloys, while less aggressive applications may perform perfectly well with carbon steel or brass at a lower cost.',
      'Temperature range matters just as much as the media itself. Materials that perform well at ambient temperature can become brittle in cryogenic applications or lose structural integrity at high heat. Always check the manufacturer\u2019s rated temperature range against your actual operating conditions, including startup and shutdown extremes.',
      'Finally, consider pressure rating alongside a reasonable safety margin. Industrial systems rarely run at a perfectly constant pressure, and transient spikes during startup or valve actuation can exceed steady-state figures. Building in margin here is cheap insurance against catastrophic failure.',
    ],
    images: [VALVE_IMAGE],
  },
  {
    slug: 'gas-safety-standards-2026',
    title: 'Understanding Gas Safety Standards in 2026',
    category: 'Safety',
    date: 'May 2026',
    excerpt:
      'An overview of current gas safety compliance requirements and what they mean for your facility.',
    content: [
      'Gas safety standards continue to evolve as industry bodies respond to new data on failure modes and near-miss incidents. Staying current isn\u2019t just a compliance checkbox \u2014 it directly affects the safety of personnel and the reliability of operations.',
      'Recent updates have placed increased emphasis on documented inspection intervals for pressure-retaining components, particularly in facilities handling higher-hazard gas classifications. This means maintenance logs need to be more rigorous than a simple pass/fail checklist.',
      'Another area of focus is the correct specification of fire-safe valve designs in applications where a fire event could otherwise cause a secondary gas release. API 607 certification has become a baseline expectation rather than an optional upgrade in many jurisdictions.',
      'Facilities operating older infrastructure should conduct a gap analysis against current standards rather than assuming legacy installations remain compliant by default. Standards are not retroactive by law in most regions, but insurers and clients increasingly expect current-standard compliance regardless of installation date.',
    ],
    images: [CHEMICAL_IMAGE],
  },
  {
    slug: 'preventive-maintenance-instrumentation',
    title: 'Preventive Maintenance for Industrial Instrumentation',
    category: 'Maintenance',
    date: 'April 2026',
    excerpt:
      'Why scheduled calibration and inspection saves more than it costs over the equipment lifecycle.',
    content: [
      'Preventive maintenance is often the first budget line cut during cost pressure \u2014 and often the most expensive mistake a facility can make. Instrumentation that drifts out of calibration doesn\u2019t just produce bad data; it can mask genuine safety issues until they become expensive failures.',
      'A well-structured preventive maintenance program starts with a criticality assessment: which instruments, if they fail or drift, would have the largest operational or safety impact? These should receive the tightest calibration intervals, while lower-criticality instruments can follow a more relaxed schedule.',
      'Calibration certificates should be traceable to a recognized standard, and records should be kept for the full equipment lifecycle, not just the most recent cycle. This traceability becomes essential during audits, insurance reviews, or incident investigations.',
      'The return on investment for preventive maintenance is rarely visible in the same budget cycle it\u2019s spent \u2014 it shows up as the unplanned shutdowns and safety incidents that never happened. That makes it one of the harder line items to defend, and one of the most important to protect.',
    ],
    images: [MANUFACTURING_IMAGE],
  },
];

export const blogCategories: (BlogPost['category'] | 'All')[] = [
  'All',
  'Engineering',
  'Safety',
  'Maintenance',
  'Company News',
];
