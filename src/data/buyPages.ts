export type DisplayFont = 'instrument' | 'cormorant' | 'fraunces' | 'grotesk';
export type MotionVariant = 'maskRise' | 'blueprint' | 'ticker' | 'contour' | 'numeral' | 'goldSweep';

export interface TimelineStep {
  title: string;
  text: string;
}

export interface FactItem {
  label: string;
  value: string;
}

export interface PersonaCard {
  title: string;
  text: string;
}

export type Module =
  | { kind: 'timeline'; title: string; intro?: string; steps: TimelineStep[] }
  | { kind: 'checklist'; title: string; intro?: string; items: string[] }
  | { kind: 'factGrid'; title: string; intro?: string; facts: FactItem[] }
  | { kind: 'table'; title: string; intro?: string; head: string[]; rows: string[][]; note?: string }
  | { kind: 'personas'; title: string; cards: PersonaCard[] }
  | { kind: 'emi'; title: string; presetPriceCr: number }
  | { kind: 'yield'; title: string }
  | { kind: 'plotTools'; title: string }
  | { kind: 'compare'; title: string }
  | { kind: 'concierge'; title: string; items: string[]; ctaLabel: string }
  | { kind: 'rentBudget'; title: string; presetRent: number }
  | { kind: 'seatCalc'; title: string };

export interface BuyPageTheme {
  mode: 'light' | 'dark';
  bg: string;
  ink?: string;
  accent: string;
  accentInk: string;
  dark1: string;
  dark2: string;
}

export interface BuyPageConfig {
  slug: string;
  group: 'popular' | 'type' | 'budget' | 'bhk';
  label: string;
  eyebrow: string;
  headline: string; // supports "\n" and "*italic accent*"
  lead: string;
  theme: BuyPageTheme;
  displayFont: DisplayFont;
  motion: MotionVariant;
  numeral?: string;
  modules: Module[];
  faq: [
    { q: string; hint: string },
    { q: string; hint: string }
  ];
  cta: { label: string };
}

export const BUY_PAGE_CONFIGS: Record<string, BuyPageConfig> = {
  // =========================================================================
  // 1. POPULAR CHOICES
  // =========================================================================
  'ready-to-move': {
    slug: 'ready-to-move',
    group: 'popular',
    label: 'Ready to Move',
    eyebrow: 'Popular Choice \u00B7 Ready to Move',
    headline: 'Homes that are\n*ready when you are.*',
    lead: 'No waiting and no construction risk. Every residence here is complete, inspected and available for registration and possession.',
    theme: {
      mode: 'light',
      bg: '#F5F1E8',
      ink: '#0C0C0C',
      accent: '#2E9C8A',
      accentInk: '#1D7A6B',
      dark1: '#24352F',
      dark2: '#09110E',
    },
    displayFont: 'fraunces',
    motion: 'maskRise',
    modules: [
      {
        kind: 'timeline',
        title: 'From viewing to move-in',
        steps: [
          { title: 'Private viewing', text: 'Inspect finishes, fittings, structural integrity, seepage risks, and water pressure firsthand with our property specialists.' },
          { title: 'Document review', text: 'Scrutinize the sale deed draft, Occupancy Certificate, encumbrance certificate, and sanctioned building drawings.' },
          { title: 'Agreement and token', text: 'Agree on indicative transaction terms, payment milestones, and token schedule formally in writing.' },
          { title: 'Registration', text: 'Complete stamp duty disbursement and deed registration at the competent local sub-registrar office.' },
          { title: 'Possession', text: 'Key handover, utility meter transfers, society no-objection certificate, and maintenance corpus deposit.' },
        ],
      },
    ],
    faq: [
      {
        q: 'What is an Occupancy Certificate and why does it matter?',
        hint: 'An Occupancy Certificate is issued by local civic planning bodies after construction is fully completed. It certifies that the building has been erected in strict accordance with approved blueprints, safety provisions, and infrastructure standards. Securing an OC is essential before taking possession. Buyers should verify all title and certification documents with a qualified legal advocate.',
      },
      {
        q: 'Can I negotiate on a ready property?',
        hint: 'Yes. Because ready-to-move homes eliminate construction speculation, developers and private sellers often have flexibility regarding final indicative pricing, registration cost adjustments, or inclusive parking allocations within prevailing market boundaries. Terms depend on local micro-market inventory levels. Buyers are advised to consult a property advisor and financial professional before finalizing agreements.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'under-construction': {
    slug: 'under-construction',
    group: 'popular',
    label: 'Under Construction',
    eyebrow: 'Popular Choice \u00B7 Under Construction',
    headline: 'Build your future,\n*one floor at a time.*',
    lead: "Lower entry prices and milestone-linked payment plans for projects still rising. Check the RERA registration and the builder's track record before you book.",
    theme: {
      mode: 'light',
      bg: '#EDF1F6',
      ink: '#0C0C0C',
      accent: '#4FA3D9',
      accentInk: '#1F6FA8',
      dark1: '#14263C',
      dark2: '#060D17',
    },
    displayFont: 'grotesk',
    motion: 'blueprint',
    modules: [
      {
        kind: 'timeline',
        title: 'How construction-linked payments work',
        intro: 'Payments are linked to construction milestones; confirm the exact schedule in your agreement.',
        steps: [
          { title: 'Booking', text: 'Token amount to reserve the unit.' },
          { title: 'Agreement for sale', text: 'Signed with the payment schedule.' },
          { title: 'Foundation and structure', text: 'Instalments follow progress.' },
          { title: 'Finishing', text: 'Flooring, fittings, painting.' },
          { title: 'Possession', text: 'Final instalment, handover.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Before you book',
        items: [
          'Confirm the RERA registration number and validity on the state RERA website',
          "Review the promoter's earlier projects and delivery record",
          'Check approved plans and the stated completion date',
          'Understand GST applicability on under-construction homes and verify the current rate',
          'Read the delay and refund clauses in the agreement',
        ],
      },
    ],
    faq: [
      {
        q: 'What if the project is delayed?',
        hint: 'Under RERA regulations, homebuyers are protected against project delivery delays. Registered developer agreements must stipulate concrete completion timelines alongside interest obligations payable to buyers for delayed periods or exit refund mechanisms. Buyers experiencing substantial delays should review agreement covenants carefully and seek guidance from an accredited real estate legal professional.',
      },
      {
        q: 'Is GST applicable on under-construction homes?',
        hint: 'Goods and Services Tax is generally applicable on under-construction real estate purchases at standard government rates, typically without input tax credit benefits, whereas completed units with an Occupancy Certificate are exempt. Tax structures and rates vary periodically. Buyers should independently verify applicable indicative tax slabs with a certified chartered accountant or tax consultant.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'new-launch': {
    slug: 'new-launch',
    group: 'popular',
    label: 'New Launch',
    eyebrow: 'Popular Choice \u00B7 New Launch',
    headline: 'First in line,\n*first pick.*',
    lead: 'Fresh launches priced for early buyers, with the widest choice of floors, facings and layouts before inventory narrows.',
    theme: {
      mode: 'light',
      bg: '#FBF3EC',
      ink: '#0C0C0C',
      accent: '#FF6A2B',
      accentInk: '#C2410C',
      dark1: '#3A1A10',
      dark2: '#120704',
    },
    displayFont: 'grotesk',
    motion: 'ticker',
    numeral: 'NEW LAUNCH \u00B7 EARLY ACCESS \u00B7 PRIVATE PREVIEW \u00B7 LIMITED UNITS',
    modules: [
      {
        kind: 'factGrid',
        title: 'Why buy at launch',
        facts: [
          { label: 'Widest choice', value: 'Pick your floor, facing and layout before the best units go' },
          { label: 'Early pricing', value: 'Launch offers and introductory price points' },
          { label: 'Flexible plans', value: 'Payment schemes designed for early bookings' },
          { label: 'Time to plan', value: 'A longer runway to arrange funds and loans' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Verify before paying a booking amount',
        items: [
          'RERA registration for the project',
          'Land title and approvals',
          "Developer's delivery record",
          'Written payment schedule and refund terms',
        ],
      },
    ],
    faq: [
      {
        q: 'Is it safe to book at launch?',
        hint: "Booking during a fresh launch offers pricing benefits and premium inventory choices, provided all statutory RERA registrations, layout approvals, and title sanctions are in place. Investors must evaluate the promoter's historic execution capability and financial backing. Prospective buyers should always verify legal approvals and contractual covenants with an independent legal advisor.",
      },
      {
        q: 'How do I get early access to upcoming launches?',
        hint: 'Priority allocations and private preview windows are typically shared with accredited client advisory networks prior to public release. Registering with our advisory desk provides advance notice of verified upcoming developments, indicative pricing sheets, and unit layout drafts. Buyers should review all initial documentation with their property and wealth advisors.',
      },
    ],
    cta: { label: 'Join the Launch List' },
  },

  'featured-properties': {
    slug: 'featured-properties',
    group: 'popular',
    label: 'Featured Properties',
    eyebrow: 'Popular Choice \u00B7 Featured',
    headline: 'Hand-picked,\n*by our advisors.*',
    lead: 'A short list of exceptional homes selected for location, build quality and long-term value, each reviewed in person by our team.',
    theme: {
      mode: 'light',
      bg: '#FAF8F4',
      ink: '#0C0C0C',
      accent: '#D4AF6A',
      accentInk: '#A8832F',
      dark1: '#3A3226',
      dark2: '#0B0906',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'personas',
        title: 'How we select',
        cards: [
          { title: 'Location and connectivity', text: 'Micro-market strength, commute and everyday convenience.' },
          { title: 'Build quality and approvals', text: 'Construction standards, specifications and documentation.' },
          { title: 'Fair pricing', text: 'Compared against recent transactions in the locality.' },
          { title: 'Long-term value', text: 'Resale demand, rental potential and neighbourhood growth.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How are featured properties chosen?',
        hint: 'Our advisory team evaluates each candidate residence against strict benchmarks: micro-market connectivity, clear title verification, superior construction specifications, and defensible historical valuations. Only homes demonstrating balanced lifestyle utility and reliable capital appreciation potential are highlighted. Buyers are encouraged to review all indicative valuations and property titles with their independent legal counsel.',
      },
      {
        q: 'Can I request a private tour?',
        hint: 'Yes. Private guided viewings can be arranged for any featured residence through our advisory desk. Our property consultants accompany prospective buyers on dedicated walkthroughs to inspect architectural finishes, community amenities, and surrounding neighborhood infrastructure. We recommend coordinating with our team to align viewing schedules with your convenience.',
      },
    ],
    cta: { label: 'Request a Private Tour' },
  },

  // =========================================================================
  // 2. PROPERTY TYPES
  // =========================================================================
  'flats-apartments': {
    slug: 'flats-apartments',
    group: 'type',
    label: 'Flats/Apartments',
    eyebrow: 'Property Type \u00B7 Flats and Apartments',
    headline: 'Skyline living,\n*simplified.*',
    lead: 'From compact 1 BHKs to full-floor penthouses, in gated communities with security, parking and clubhouse life built in.',
    theme: {
      mode: 'light',
      bg: '#F1F3F6',
      ink: '#0C0C0C',
      accent: '#8FA3B8',
      accentInk: '#4E6580',
      dark1: '#26303C',
      dark2: '#0A0D12',
    },
    displayFont: 'instrument',
    motion: 'maskRise',
    modules: [
      {
        kind: 'table',
        title: 'Typical sizes by BHK',
        head: ['Configuration', 'Typical super built-up area'],
        rows: [
          ['1 BHK', '450 - 700 sq ft'],
          ['2 BHK', '900 - 1,300 sq ft'],
          ['3 BHK', '1,400 - 2,200 sq ft'],
          ['4 BHK', '2,500 - 4,000 sq ft'],
        ],
        note: 'Indicative ranges for projects in Hyderabad; actual sizes vary by project.',
      },
      {
        kind: 'checklist',
        title: 'Check before you choose',
        items: [
          'Power backup for common areas and lifts',
          'Covered and allotted parking',
          'Lifts, security and visitor management',
          'Clubhouse, pool and play areas',
          'Maintenance charge per sq ft and corpus fund',
          'Water supply and drainage',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the difference between carpet, built-up and super built-up area?',
        hint: 'Carpet area represents net usable floor space inside internal walls. Built-up area includes the carpet area plus thickness of external walls and exclusive balconies. Super built-up area incorporates proportionate shares of shared spaces like lobbies, lifts, and staircases. Always request RERA carpet measurements in writing and verify area schedules with an architect.',
      },
      {
        q: 'What are maintenance and corpus charges?',
        hint: 'Maintenance charges cover recurring monthly operational expenditures including security, common electricity, landscaping, and lift servicing. The corpus or sinking fund is a one-time reserve collected for future major capital repairs or structural upgrades. Always ask developers or resident associations for itemized indicative billing schedules before signing your property purchase contract.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'independent-houses': {
    slug: 'independent-houses',
    group: 'type',
    label: 'Independent Houses',
    eyebrow: 'Property Type \u00B7 Independent Houses',
    headline: 'A home that is\n*entirely yours.*',
    lead: 'Own the land beneath your home. Independent houses offer privacy, room to extend and a garden of your own.',
    theme: {
      mode: 'light',
      bg: '#FAF2EA',
      ink: '#0C0C0C',
      accent: '#C2693C',
      accentInk: '#9A4A22',
      dark1: '#4A2A1B',
      dark2: '#150C07',
    },
    displayFont: 'fraunces',
    motion: 'contour',
    modules: [
      {
        kind: 'personas',
        title: 'What to understand',
        cards: [
          { title: 'Land and built-up', text: 'You pay for both the plot and the structure; ask for each separately.' },
          { title: 'Facing and vastu', text: "East and north-east facing homes are often preferred; check the plot's orientation." },
          { title: 'Setbacks and approvals', text: 'Confirm the building permission and the completed structure match.' },
          { title: 'Resale follows the plot', text: 'Location, plot size and road width drive long-term value.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Inspect before you buy',
        items: [
          'Title chain and an encumbrance certificate',
          'Building permission and completion documents',
          'Boundaries and the survey number',
          'Structure, plumbing and electrical condition',
          'Water source, drainage and road access',
        ],
      },
    ],
    faq: [
      {
        q: 'How is an independent house valued?',
        hint: 'An independent home valuation separates underlying plot land value from depreciated structure construction costs. Land rates reflect prevailing per-square-yard market transactions, road width, and municipal zone permissions, while structural valuation considers age, maintenance, and material specifications. We recommend obtaining an independent appraisal from a certified government-approved valuer before finalizing terms.',
      },
      {
        q: 'Can I add another floor later?',
        hint: 'Vertical expansions depend strictly on municipal sanction approvals, Floor Space Index (FSI) limits, and existing structural foundation load capacity. Even if zoning permits extra floors, existing columns and footings must be certified by a structural engineer. Verify local municipal town-planning guidelines and title documents with a qualified architect or property lawyer.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'villas': {
    slug: 'villas',
    group: 'type',
    label: 'Villas',
    eyebrow: 'Property Type \u00B7 Villas',
    headline: 'Estate living,\n*beautifully private.*',
    lead: 'Gated villas and standalone estates with private gardens, pools and a true sense of arrival, built for generations.',
    theme: {
      mode: 'light',
      bg: '#F8F5EF',
      ink: '#0C0C0C',
      accent: '#B88A44',
      accentInk: '#8A6420',
      dark1: '#3B2A18',
      dark2: '#0E0905',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'factGrid',
        title: 'Four ways to own a villa',
        facts: [
          { label: 'Gated-community villa', value: 'Shared clubhouse, security and landscaping with a private plot.' },
          { label: 'Standalone estate', value: 'A single residence on a large plot with total privacy.' },
          { label: 'Row villa or townhouse', value: 'Connected homes with private gardens at a gentler price.' },
          { label: 'Farm villa', value: 'A weekend estate on larger land outside the city.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Villa essentials',
        items: [
          'Plot area versus built-up area',
          'Clubhouse, security and common-area upkeep',
          'Monthly maintenance and corpus fund',
          'Staff quarters and parking',
          'Pool, lift and automation provisions',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the difference between a villa and an independent house?',
        hint: 'While independent houses are usually standalone residential plots on public roads, villas are typically developed within master-planned gated enclaves offering centralized security, landscaped parks, and private clubhouse amenities. Gated villas combine independent plot ownership with organized community services. Prospective buyers should inspect society by-laws and maintenance contracts with their legal advisor.',
      },
      {
        q: 'Are gated villas better for resale?',
        hint: 'Gated community villas often sustain resilient resale liquidity and rental interest due to integrated security, professional grounds upkeep, and lifestyle amenities. However, long-term capital appreciation remains heavily influenced by micro-market proximity, road infrastructure, and developer maintenance standards. Always evaluate historical transaction benchmarks with a licensed property professional.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'plots-land': {
    slug: 'plots-land',
    group: 'type',
    label: 'Plots/Land',
    eyebrow: 'Property Type \u00B7 Plots and Land',
    headline: 'Own the land.\n*Build the legacy.*',
    lead: "Clear-title plots in Hyderabad's growth corridors, for a home of your own design or a patient long-term investment.",
    theme: {
      mode: 'light',
      bg: '#F3F2E9',
      ink: '#0C0C0C',
      accent: '#8A9A4B',
      accentInk: '#5E6B2C',
      dark1: '#2F3420',
      dark2: '#0C0E07',
    },
    displayFont: 'fraunces',
    motion: 'contour',
    modules: [
      {
        kind: 'checklist',
        title: 'Plot due diligence',
        items: [
          'Verify the title chain and link documents',
          'Get an encumbrance certificate',
          'Confirm the layout approval (HMDA or DTCP) and the plot demarcation on site',
          'Check the survey number and the road width',
          'Confirm facing and shape (vastu preferences)',
          'Compare the price per sq yd with nearby layouts',
          'Visit the site and verify the boundaries yourself',
        ],
      },
      {
        kind: 'plotTools',
        title: 'Plot calculator',
      },
    ],
    faq: [
      {
        q: 'What is the difference between an approved and an unapproved layout?',
        hint: 'Approved layouts carry formal sanctions from authorities like HMDA or DTCP, ensuring legitimate road widths, open green spaces, and utility reservations. Unapproved agricultural sub-divisions lack sanctioned permissions and may face steep regularization fees or legal injunctions. We strongly advise buyers to conduct a rigorous link document title search with an accredited land advocate.',
      },
      {
        q: 'Can I start building right after buying a plot?',
        hint: 'Construction cannot begin immediately after land deed registration. You must first secure sanctioned building drawings from the municipal town-planning authority, which requires soil tests, structural blueprints, and fee disbursements. Allow ample time and budget for statutory clearances, and consult an architectural firm and legal advisor before breaking ground.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'commercial': {
    slug: 'commercial',
    group: 'type',
    label: 'Commercial',
    eyebrow: 'Property Type \u00B7 Commercial',
    headline: 'Space that\n*works for you.*',
    lead: "Office suites, retail showrooms and income-ready commercial space across Hyderabad's business districts.",
    theme: {
      mode: 'light',
      bg: '#F2F2F0',
      ink: '#0C0C0C',
      accent: '#E3A72F',
      accentInk: '#9B6A06',
      dark1: '#2A2D31',
      dark2: '#0A0B0C',
    },
    displayFont: 'grotesk',
    motion: 'blueprint',
    modules: [
      {
        kind: 'yield',
        title: 'Rental yield calculator',
      },
      {
        kind: 'factGrid',
        title: 'What to evaluate',
        facts: [
          { label: 'Location and footfall', value: 'Visibility, access and surrounding demand.' },
          { label: 'Floor and frontage', value: 'Floor height, frontage and signage rights.' },
          { label: 'Parking ratio', value: 'Parking for staff, visitors and customers.' },
          { label: 'Lease terms', value: 'Tenure, escalation and lock-in in existing leases.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How do I evaluate the rental yield of a commercial property?',
        hint: 'Gross indicative rental yield is computed by dividing expected annual lease income by total acquisition cost including registration expenses. Net yield further deducts property taxes, insurance, and maintenance voids. Commercial office yields typically surpass residential yields but involve tenancy vacancy risks. Investors should verify tenancy lease documents and financial metrics with a qualified chartered accountant.',
      },
      {
        q: 'What lease terms are common for commercial space?',
        hint: 'Institutional commercial leases typically span nine-year terms with structured three-year rent escalations of ten to fifteen percent and mandatory lock-in periods for both parties. Inclusions such as tenant fit-out periods, security deposits, and common area maintenance must be vetted. Always review corporate lease agreements with a commercial real estate lawyer.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  // =========================================================================
  // 3. BUDGET
  // =========================================================================
  'under-50-lacs': {
    slug: 'under-50-lacs',
    group: 'budget',
    label: 'Under \u20B950 Lacs',
    eyebrow: 'Budget \u00B7 Under \u20B950 Lacs',
    headline: 'Your first home\nstarts *here.*',
    lead: 'Compact apartments and plots under \u20B950 Lacs, chosen for location, legal clarity and long-term appreciation.',
    theme: {
      mode: 'light',
      bg: '#FBF3F0',
      ink: '#0C0C0C',
      accent: '#F0846A',
      accentInk: '#C2503A',
      dark1: '#4A231B',
      dark2: '#140806',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '50L',
    modules: [
      {
        kind: 'personas',
        title: 'Smart starter tips',
        cards: [
          { title: 'Legal clarity first', text: 'A clean title beats extra square feet.' },
          { title: 'Choose connectivity', text: 'Metro, ring road and IT corridor access lift both rent and resale.' },
          { title: 'Plan your margin', text: 'Keep the down payment and loan margin ready before booking.' },
          { title: 'Keep a buffer', text: 'Budget for registration, moving and interiors.' },
        ],
      },
      {
        kind: 'emi',
        title: 'Estimate your EMI',
        presetPriceCr: 0.4,
      },
    ],
    faq: [
      {
        q: 'How much down payment do I need?',
        hint: "Banks and housing finance companies usually provide loans covering up to eighty percent of the property's sanctioned agreement value, requiring the buyer to fund the remaining twenty percent down payment. Additional costs including stamp duty, registration fees, and GST must be budgeted separately. Always verify current loan eligibility parameters with your lending bank.",
      },
      {
        q: 'At this budget, is a flat or a plot better?',
        hint: 'Deciding between a flat or plot depends on your housing timeline. A ready apartment delivers immediate living utility or monthly rental income, whereas a clear-title plot in an emerging corridor may yield greater long-term land appreciation without building depreciation. Buyers should evaluate personal cash flow with a certified financial advisor.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '50-lacs-to-1-cr': {
    slug: '50-lacs-to-1-cr',
    group: 'budget',
    label: '\u20B950 Lacs - \u20B91 Cr',
    eyebrow: 'Budget \u00B7 \u20B950 Lacs - \u20B91 Cr',
    headline: 'Smart space,\n*smarter value.*',
    lead: 'Well-connected 2 BHKs and office suites between \u20B950 Lacs and \u20B91 Cr, where the right location makes every rupee count.',
    theme: {
      mode: 'light',
      bg: '#FBF2F3',
      ink: '#0C0C0C',
      accent: '#B5485D',
      accentInk: '#8C2A3F',
      dark1: '#3A1522',
      dark2: '#12060A',
    },
    displayFont: 'fraunces',
    motion: 'numeral',
    numeral: '1Cr',
    modules: [
      {
        kind: 'table',
        title: 'What this range typically buys',
        head: ['Option', 'Where it fits'],
        rows: [
          ['2 BHK apartment', 'Growth corridors and established neighbourhoods'],
          ['1 - 2 BHK in a prime area', 'Smaller footprint in premium localities'],
          ['Office suite', 'Fitted suites in IT corridors'],
          ['Plot on the outskirts', 'Large plots for long-term appreciation'],
        ],
        note: 'Indicative only; availability varies.',
      },
      {
        kind: 'emi',
        title: 'Estimate your EMI',
        presetPriceCr: 0.75,
      },
    ],
    faq: [
      {
        q: 'Is it better to buy ready or under construction at this price?',
        hint: 'Ready properties eliminate construction wait times, rental overlaps, and delivery uncertainty, but carry higher upfront capital outlays. Under-construction units offer staggered milestone payments and lower entry valuations, though requiring RERA delivery monitoring. Balance your immediate housing requirements and risk appetite, and review terms with an experienced real estate advisor.',
      },
      {
        q: 'What loan tenure keeps the EMI comfortable?',
        hint: 'A longer indicative home loan tenure of twenty to twenty-five years reduces monthly EMI obligations, improving household liquidity, but substantially increases total cumulative interest payable over the loan life. Shorter tenures minimize borrowing costs but require higher monthly disposable income. Consult with a qualified mortgage specialist to model optimal repayment terms.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '1-cr-to-5-cr': {
    slug: '1-cr-to-5-cr',
    group: 'budget',
    label: '\u20B91 Cr - \u20B95 Cr',
    eyebrow: 'Budget \u00B7 \u20B91 Cr - \u20B95 Cr',
    headline: 'The sweet spot of\n*premium living.*',
    lead: 'Spacious 3 BHKs, independent houses and premium commercial space, where size, location and amenities find their balance.',
    theme: {
      mode: 'light',
      bg: '#F1F4F8',
      ink: '#0C0C0C',
      accent: '#D4AF6A',
      accentInk: '#A8832F',
      dark1: '#1B2A44',
      dark2: '#070C16',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '5Cr',
    modules: [
      {
        kind: 'compare',
        title: 'Compare side by side',
      },
      {
        kind: 'personas',
        title: 'What to compare',
        cards: [
          { title: 'Price per unit', text: 'Compare per sq ft or sq yd, not just the total.' },
          { title: 'Possession', text: 'Ready versus under construction changes risk and cost.' },
          { title: 'Facing and layout', text: 'Light, ventilation and usable space matter most.' },
          { title: 'Extras', text: 'Budget for registration, parking, maintenance deposit and interiors.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How do I compare price per sq ft across projects?',
        hint: 'Ensure comparisons evaluate standardized units by checking RERA carpet area alongside super built-up claims. A project with a lower quoted super built-up rate may actually be pricier per carpet square foot if loading exceeds expectations. Request audited architectural area schedules and verify price breakdowns with an independent property consultant.',
      },
      {
        q: 'What extras should I budget for beyond the price?',
        hint: 'Beyond base agreement value, buyers should budget for statutory stamp duty and registration fees, applicable GST, dedicated covered parking allocations, club membership deposits, and advance society maintenance corpus reserves. Bespoke interior fit-outs can add ten to fifteen percent. Verify comprehensive all-inclusive indicative cost sheets with your sales advisor.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'above-5-cr': {
    slug: 'above-5-cr',
    group: 'budget',
    label: 'Above \u20B95 Cr',
    eyebrow: 'Budget \u00B7 Above \u20B95 Cr',
    headline: 'Residences of\n*rare distinction.*',
    lead: 'Penthouses, estates and statement commercial addresses above \u20B95 Cr. Many are shown privately and never listed publicly.',
    theme: {
      mode: 'dark',
      bg: '#0A0C12',
      ink: '#F4EFE6',
      accent: '#C8B07A',
      accentInk: '#E3D3A8',
      dark1: '#1A2233',
      dark2: '#04060B',
    },
    displayFont: 'cormorant',
    motion: 'numeral',
    numeral: '5Cr+',
    modules: [
      {
        kind: 'concierge',
        title: 'Private client services',
        items: [
          'Private viewings by appointment',
          'Off-market opportunities shared discreetly',
          'Confidential negotiation',
          'Coordination with legal and wealth advisors',
          'Relocation and staging support',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Do you offer off-market listings?',
        hint: 'Yes. Prominent trophy estates, bespoke penthouses, and signature land parcels are routinely represented off-market to preserve owner privacy and transaction confidentiality. These discreet opportunities are made available exclusively to verified private clients through dedicated advisory introductions. Register your confidential mandate with our senior desk to access private portfolios.',
      },
      {
        q: 'Can you assist overseas buyers?',
        hint: 'Our advisory desk provides end-to-end representation for overseas citizens and NRI investors, managing virtual walkthroughs, Power of Attorney protocols, NRE/NRO banking transfers, and statutory tax compliance. All international remittances and FEMA property acquisition rules should be validated with an accredited international tax advisor and qualified legal attorney.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

  // =========================================================================
  // 4. BHK TYPE
  // =========================================================================
  '1-bhk': {
    slug: '1-bhk',
    group: 'bhk',
    label: '1 BHK',
    eyebrow: 'BHK Type \u00B7 1 BHK',
    headline: 'Small footprint,\n*big start.*',
    lead: 'Efficient 1 BHK homes for first-time buyers, young professionals and investors seeking steady rental demand.',
    theme: {
      mode: 'light',
      bg: '#FBF8F2',
      ink: '#0C0C0C',
      accent: '#E4C896',
      accentInk: '#A07A38',
      dark1: '#4B4132',
      dark2: '#15110C',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '1',
    modules: [
      {
        kind: 'personas',
        title: 'Who it suits',
        cards: [
          { title: 'First-time buyers', text: 'A manageable price and EMI.' },
          { title: 'Young professionals', text: 'Close to work with low upkeep.' },
          { title: 'Investors', text: 'Strong rental demand near IT hubs.' },
          { title: 'Second homes', text: 'A simple base in the city.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '450 - 700 sq ft'],
          ['Households', '1 - 2 people'],
          ['Best for', 'Starter home or rental'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: 'Is a 1 BHK a good investment?',
        hint: 'Compact 1 BHK homes located near employment hubs and metro corridors generally command high occupancy rates and attractive percentage yields due to sustained young professional demand. However, resale appreciation may trail family-sized 2 and 3 BHK layouts over long investment horizons. Review local rental absorption rates with a certified financial advisor.',
      },
      {
        q: 'Can I upgrade later?',
        hint: 'Starter homes offer high liquidity when positioned in established micro-markets, allowing owners to build early home equity before upgrading to larger residential configurations. Future transition planning must factor in capital gains tax exemptions, loan transfer fees, and brokerage costs. Consult a chartered accountant to optimize your transition roadmap.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '2-bhk': {
    slug: '2-bhk',
    group: 'bhk',
    label: '2 BHK',
    eyebrow: 'BHK Type \u00B7 2 BHK',
    headline: 'Room to grow,\n*without the stretch.*',
    lead: 'The most sought-after layout in the city: two bedrooms for small families and home offices, with steady resale demand.',
    theme: {
      mode: 'light',
      bg: '#F8F3EA',
      ink: '#0C0C0C',
      accent: '#D9B77A',
      accentInk: '#9A7230',
      dark1: '#45382A',
      dark2: '#130F0A',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '2',
    modules: [
      {
        kind: 'checklist',
        title: 'Layout checks',
        items: [
          'Bedroom proportions and wardrobe space',
          'Cross-ventilation and natural light',
          'Balcony orientation',
          'Storage and utility space',
          'A corner for working from home',
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '900 - 1,300 sq ft'],
          ['Households', '2 - 4 people'],
          ['Best for', 'Small families and couples'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: '2 BHK or 3 BHK for a growing family?',
        hint: 'A 2 BHK offers accessible entry pricing and manageable maintenance for young couples, but growing families often encounter space constraints as children grow or if dual work-from-home arrangements are required. If long-term tenure is intended, evaluating 3 BHK financing options early may avert future relocation expenses. Seek guidance from your financial planner.',
      },
      {
        q: 'What is a good carpet area for a 2 BHK?',
        hint: "In Hyderabad's premium developments, a functional 2 BHK layout typically provides between 700 and 950 square feet of usable carpet area, accommodating well-proportioned bedrooms, attached baths, and a utility balcony. Always prioritize ergonomic room dimensions and circulation efficiency over inflated super built-up marketing figures, verifying drawings with an architect.",
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '3-bhk': {
    slug: '3-bhk',
    group: 'bhk',
    label: '3 BHK',
    eyebrow: 'BHK Type \u00B7 3 BHK',
    headline: 'Space for\n*every chapter.*',
    lead: 'Generous 3 BHKs for families who want a study, a guest room or a bedroom for every child, in communities built for family life.',
    theme: {
      mode: 'light',
      bg: '#F4EDE1',
      ink: '#0C0C0C',
      accent: '#CFA65F',
      accentInk: '#8F6724',
      dark1: '#3F3023',
      dark2: '#110C08',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '3',
    modules: [
      {
        kind: 'personas',
        title: 'Who it suits',
        cards: [
          { title: 'Growing families', text: 'A bedroom for each child.' },
          { title: 'Joint families', text: 'Room for parents and guests.' },
          { title: 'Work-from-home professionals', text: 'A dedicated study.' },
          { title: 'Upgraders', text: 'More space, same neighbourhood.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '1,400 - 2,200 sq ft'],
          ['Typical features', '2 - 3 balconies, utility area'],
          ['Best for', 'Families of 4 - 6'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: 'Is a 3 BHK worth the premium?',
        hint: 'Three-bedroom layouts represent the most liquid segment in the Indian family housing market. The additional room offers versatility for home offices, visiting parents, or children, sustaining superior long-term resale liquidity compared to smaller homes. While the absolute ticket size is higher, value per square foot remains competitive. Consult an advisor on micro-market demand.',
      },
      {
        q: 'Which floor is best in a high-rise?',
        hint: "Higher floors deliver expansive panoramic city views, superior cross-ventilation, and reduced ambient street noise, often commanding premium floor-rise developer charges. Middle floors balance visual elevation with quicker elevator turnaround during peak hours. Evaluate your family's personal lifestyle preference and safety comfort before confirming specific tower levels with your advisor.",
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '4-bhk': {
    slug: '4-bhk',
    group: 'bhk',
    label: '4 BHK',
    eyebrow: 'BHK Type \u00B7 4 BHK',
    headline: 'Spacious\n*by design.*',
    lead: 'Four bedrooms, family lounges and private terraces for households that need room for everyone, and for guests.',
    theme: {
      mode: 'light',
      bg: '#EFE6D8',
      ink: '#0C0C0C',
      accent: '#C4964A',
      accentInk: '#85591B',
      dark1: '#35261B',
      dark2: '#0E0906',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '4',
    modules: [
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '2,500 - 4,000 sq ft'],
          ['Typical features', 'Family lounge, staff room, terraces'],
          ['Parking', '2 - 3 cars'],
        ],
        note: 'Indicative.',
      },
      {
        kind: 'checklist',
        title: 'Premium features to ask for',
        items: [
          'Private lift lobby or dedicated entry',
          'Staff room and separate entry',
          'Terrace or garden access',
          'Smart-home provisions',
          'Dedicated covered parking',
        ],
      },
    ],
    faq: [
      {
        q: 'Penthouse or villa for a 4 BHK?',
        hint: 'A 4 BHK sky penthouse delivers dramatic aerial skyline perspectives, lock-and-leave gated security, and centralized tower amenities, whereas an independent villa grants private land title, ground-level gardens, and vertical expansion autonomy. Choice pivots on your lifestyle preference for vertical convenience versus private ground-level estate ownership. Consult with our advisors on options.',
      },
      {
        q: 'How are premium maintenance charges decided?',
        hint: 'Maintenance for large format 4 BHK residences is assessed on a per-square-foot basis by resident welfare associations to service extensive clubhouse facilities, power backups, swimming pools, and dedicated concierge security. Larger footprints entail proportionally higher monthly contributions. Always request formal copies of current association audited maintenance balance sheets.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '4-plus-bhk': {
    slug: '4-plus-bhk',
    group: 'bhk',
    label: '4+ BHK',
    eyebrow: 'BHK Type \u00B7 4+ BHK',
    headline: 'Beyond four:\n*estates without limits.*',
    lead: 'Five bedrooms and more: villas, estates and farmhouses designed for multi-generational living and entertaining on a grand scale.',
    theme: {
      mode: 'dark',
      bg: '#120C08',
      ink: '#F4EFE6',
      accent: '#D4AF6A',
      accentInk: '#E9DCC0',
      dark1: '#2A1D12',
      dark2: '#070403',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '4+',
    modules: [
      {
        kind: 'factGrid',
        title: 'What to expect',
        facts: [
          { label: 'Typical area', value: '4,500+ sq ft' },
          { label: 'Plot size', value: '600+ sq yd for villas' },
          { label: 'Signature features', value: 'Pool, home theatre, staff quarters, lift' },
          { label: 'Best suited to', value: 'Multi-generational households' },
        ],
      },
      {
        kind: 'concierge',
        title: 'Private client services',
        items: [
          'Private viewings by appointment',
          'Off-market estates',
          'Legal and valuation coordination',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Do large estates need extra approvals?',
        hint: 'Expansive estates exceeding substantial plot areas or built-up thresholds must adhere strictly to environmental clearances, enhanced fire safety setbacks, structural seismic designs, and local municipal zoning permissions. Unauthorized extensions can trigger legal enforcement actions. Ensure an accredited architect and legal counsel audit all sanction orders and completion certificates before entering sale contracts.',
      },
      {
        q: 'How is a 5+ BHK home valued?',
        hint: 'Appraising palatial estates integrates prime underlying land valuations with replacement costs for bespoke architectural finishes, imported fixtures, private elevators, and landscape architecture. Scarcity value and location prestige also shape pricing. We recommend commissioning an independent valuation report from a certified government-registered valuer prior to finalizing binding financial commitments.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },
};

export const getBuyPageConfig = (slug: string): BuyPageConfig | undefined => {
  return BUY_PAGE_CONFIGS[slug];
};
