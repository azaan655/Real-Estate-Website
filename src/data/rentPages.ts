import { DisplayFont, MotionVariant, Module, BuyPageTheme } from './buyPages';
import { RUPEE, DOT } from '../lib/money';

export type RentPageTheme = BuyPageTheme;

export interface RentPageConfig {
  slug: string;
  group: 'type' | 'budget' | 'bhk' | 'explore';
  label: string;
  eyebrow: string;
  headline: string; // supports "\n" and "*italic accent*"
  lead: string;
  note?: string; // optional side note under lead
  theme: RentPageTheme;
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

export const RENT_PAGE_CONFIGS: Record<string, RentPageConfig> = {
  // =========================================================================
  // 1. PROPERTY TYPES
  // =========================================================================
  'flats-for-rent': {
    slug: 'flats-for-rent',
    group: 'type',
    label: 'Flats for Rent',
    eyebrow: `Property Type ${DOT} Flats for Rent`,
    headline: 'Flats worth\n*coming home to.*',
    lead: 'From compact 1 BHKs to spacious family apartments, in gated communities with security, power backup and parking.',
    theme: {
      mode: 'light',
      bg: '#EFF4F6',
      accent: '#2F8F9D',
      accentInk: '#1D6A76',
      dark1: '#1B3B44',
      dark2: '#07151A',
    },
    displayFont: 'instrument',
    motion: 'maskRise',
    modules: [
      {
        kind: 'table',
        title: 'Typical monthly rent by size',
        head: ['Configuration', 'Indicative monthly rent'],
        rows: [
          ['1 BHK', `${RUPEE}8,000 - ${RUPEE}20,000`],
          ['2 BHK', `${RUPEE}15,000 - ${RUPEE}40,000`],
          ['3 BHK', `${RUPEE}28,000 - ${RUPEE}80,000`],
        ],
        note: 'Indicative ranges for Hyderabad; actual rents vary by locality and project.',
      },
      {
        kind: 'checklist',
        title: 'Flat rental checklist',
        items: [
          'Is maintenance included in the rent or charged separately?',
          'Water supply and power backup',
          'Allotted parking for car and bike',
          'Society rules on bachelors, pets and guests',
          'Lift, security and visitor management',
          'Condition of fittings, seepage and electrical points',
        ],
      },
    ],
    faq: [
      {
        q: 'How much security deposit is normal for a flat?',
        hint: 'In Hyderabad, landlords typically request between two and six months of monthly rent as an interest-free refundable security deposit. High-demand gated communities often require three months, though exact figures remain entirely subject to negotiation. Always record the agreed deposit amount and refund conditions in writing with the landlord.',
      },
      {
        q: 'Who pays maintenance, the tenant or the owner?',
        hint: 'Whether monthly society maintenance is paid by the tenant or absorbed by the landlord depends entirely on the lease terms. While many advertised rents include basic society dues, major capital repairs remain the owner responsibility. Clarify exact billing arrangements before signing and verify the payment schedule directly with the society association.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  'houses-for-rent': {
    slug: 'houses-for-rent',
    group: 'type',
    label: 'Houses for Rent',
    eyebrow: `Property Type ${DOT} Houses for Rent`,
    headline: 'Room to live,\n*room to breathe.*',
    lead: 'Independent houses and private floors with space, parking and the quiet that apartments rarely offer.',
    theme: {
      mode: 'light',
      bg: '#F2F4EC',
      accent: '#7C9A5E',
      accentInk: '#55723A',
      dark1: '#2B3A25',
      dark2: '#0B1209',
    },
    displayFont: 'fraunces',
    motion: 'contour',
    modules: [
      {
        kind: 'personas',
        title: 'Why rent an independent house',
        cards: [
          { title: 'Privacy', text: 'No shared walls and your own entrance.' },
          { title: 'Space to spare', text: 'Courtyards, terraces and parking for your vehicles.' },
          { title: 'Pets welcome', text: 'Houses are often easier for pets and families.' },
          { title: 'Flexible living', text: 'Room for guests, hobbies and home offices.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Inspect before you sign',
        items: [
          'Water source, borewell and drainage',
          'Structure, roof and seepage',
          'Electrical load and meter details',
          'Whether the owner lives on the premises',
          'Parking and gate access',
        ],
      },
    ],
    faq: [
      {
        q: 'Is an independent house cheaper than a flat?',
        hint: 'Rental rates for independent houses can offer more floor area per rupee, but overall monthly expenditure depends on utilities and private upkeep. Unlike apartments with bundled maintenance, tenants often manage their own water tankers, security, and minor repairs directly. Compare the complete monthly cost before committing and verify all utility billing with the landlord.',
      },
      {
        q: 'Do independent houses need extra paperwork?',
        hint: 'Renting an independent home follows the same legal principles as an apartment lease, requiring an eleven-month agreement and identity proofs. However, you should also inspect municipal tax receipts, separate electricity meters, and ownership records to avoid boundary or utility disputes. Verify all title documents and meter readings with the owner or a qualified professional.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  'villas-for-rent': {
    slug: 'villas-for-rent',
    group: 'type',
    label: 'Villas for Rent',
    eyebrow: `Property Type ${DOT} Villas for Rent`,
    headline: 'Villa living,\n*without the ownership.*',
    lead: 'Gated villas with private gardens, clubhouse access and the privacy of a home of your own, available on flexible leases.',
    theme: {
      mode: 'light',
      bg: '#F3F5F1',
      accent: '#C9A24B',
      accentInk: '#755914',
      dark1: '#123A32',
      dark2: '#05140F',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'factGrid',
        title: 'What a villa lease usually includes',
        facts: [
          { label: 'Clubhouse access', value: 'Gym, pool and community spaces.' },
          { label: 'Security', value: 'Gated entry and round-the-clock guards.' },
          { label: 'Garden and parking', value: 'Private lawn and covered parking for several cars.' },
          { label: 'Furnishing options', value: 'Unfurnished, semi-furnished or fully furnished.' },
        ],
      },
      {
        kind: 'concierge',
        title: 'Corporate and relocation leasing',
        items: [
          'Lease structuring for company accommodation',
          'Furnishing and setup support',
          'Move-in coordination',
          'Property management after move-in',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Are villas available fully furnished?',
        hint: 'Many luxury villas in gated enclaves are offered semi-furnished with modular kitchens and wardrobes, while fully furnished units cater to corporate relocations. If selecting a furnished villa, request a comprehensive room-by-room inventory document signed by both parties at move-in. Verify the working condition of all appliances and electrical fittings with the landlord.',
      },
      {
        q: 'Is a longer lease cheaper?',
        hint: 'Landlords frequently consider lower monthly rental rates or extended lock-in benefits for multi-year tenancy commitments. Corporate leases offering two to three-year terms provide rental stability that owners value over speculative turnover. Confirm notice periods, escalation caps, and early exit clauses in writing with the landlord or a qualified legal advisor.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

  'commercial-for-rent': {
    slug: 'commercial-for-rent',
    group: 'type',
    label: 'Commercial for Rent',
    eyebrow: `Property Type ${DOT} Commercial for Rent`,
    headline: 'Frontage that\n*finds your customers.*',
    lead: 'Street-front shops, showrooms and retail units in neighbourhoods with steady footfall and easy parking.',
    theme: {
      mode: 'light',
      bg: '#F3F2F0',
      accent: '#D9774A',
      accentInk: '#A04A22',
      dark1: '#23262F',
      dark2: '#090A0D',
    },
    displayFont: 'grotesk',
    motion: 'blueprint',
    modules: [
      {
        kind: 'checklist',
        title: 'Commercial lease checklist',
        items: [
          'Lock-in period and notice terms',
          'Annual rent escalation',
          'Security deposit amount and refund conditions',
          'Common area maintenance charges',
          'Signage rights and frontage',
          'Permitted use and any licences needed for your business',
        ],
      },
      {
        kind: 'factGrid',
        title: 'What to evaluate',
        facts: [
          { label: 'Footfall', value: 'Walk-by traffic and nearby anchors.' },
          { label: 'Visibility', value: 'Frontage, corner position and signage.' },
          { label: 'Parking', value: 'Customer and staff parking.' },
          { label: 'Utilities', value: 'Power load, water and drainage.' },
        ],
      },
    ],
    faq: [
      {
        q: 'What is a lock-in period?',
        hint: 'A commercial lock-in period is an agreed minimum term during which neither the tenant nor the landlord can terminate the tenancy without penalty. Exiting before this period expires usually forfeits the security deposit or requires rent payment for the remaining months. Review financial liability and exit conditions carefully with a qualified legal professional.',
      },
      {
        q: 'Is GST applicable on commercial rent?',
        hint: 'Goods and Services Tax is generally levied on commercial property rentals when the annual taxable turnover of the property owner exceeds statutory thresholds. If applicable, GST at eighteen percent is added on top of the base monthly rent and can be claimed as input tax credit. Confirm the GST registration status directly with the landlord.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  'office-for-rent': {
    slug: 'office-for-rent',
    group: 'type',
    label: 'Office for Rent',
    eyebrow: `Property Type ${DOT} Office for Rent`,
    headline: 'Offices ready\n*for day one.*',
    lead: "Fitted suites and floors in Grade-A buildings across Hyderabad's business districts, with power backup, parking and fibre-ready connectivity.",
    theme: {
      mode: 'light',
      bg: '#EEF1F7',
      accent: '#5F86B8',
      accentInk: '#365C8C',
      dark1: '#1D2A40',
      dark2: '#070B14',
    },
    displayFont: 'grotesk',
    motion: 'ticker',
    numeral: `OFFICE FOR RENT ${DOT} PLUG AND PLAY ${DOT} FLEXIBLE LEASES ${DOT} IT CORRIDOR`,
    modules: [
      {
        kind: 'seatCalc',
        title: 'Office space estimator',
      },
      {
        kind: 'table',
        title: 'Common office formats',
        head: ['Format', 'Best for'],
        rows: [
          ['Fitted (plug-and-play)', 'Small teams that want to start immediately'],
          ['Bare shell', 'Companies that want to design their own interiors'],
          ['Managed office', 'Teams that want services and flexibility'],
        ],
        note: 'Formats vary by building.',
      },
    ],
    faq: [
      {
        q: 'How much space do I need per employee?',
        hint: 'Commercial planners typically budget between eighty and one hundred twenty square feet of usable carpet area per employee, depending on density, collaboration rooms, and executive cabins. Indicative figures should account for circulation corridors, pantries, and server infrastructure. Consult an architect or workplace specialist to verify the exact architectural layout with the building landlord.',
      },
      {
        q: 'What should I check in a commercial building?',
        hint: 'Essential building infrastructure includes one hundred percent power backup with dual generators, high-speed elevators, centralized HVAC controls, dedicated parking allocations, and multi-carrier fibre-optic connectivity. Tenants must also verify certified fire-safety clearances, occupancy certificates, and building operating hours. Confirm all compliance documentation and utility charges with the property developer or landlord.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  // =========================================================================
  // 2. BUDGET (numeral variant)
  // =========================================================================
  'under-10000': {
    slug: 'under-10000',
    group: 'budget',
    label: `Under ${RUPEE}10,000`,
    eyebrow: `Budget ${DOT} Under ${RUPEE}10,000`,
    headline: 'Great homes,\n*gentle rents.*',
    lead: `Affordable, well-located rentals under ${RUPEE}10,000 a month, chosen for connectivity and clean paperwork.`,
    theme: {
      mode: 'light',
      bg: '#F7F4EE',
      accent: '#E58C5B',
      accentInk: '#9E471B',
      dark1: '#4A2A1C',
      dark2: '#150A06',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '10K',
    modules: [
      {
        kind: 'personas',
        title: 'Smart-saver tips',
        cards: [
          { title: 'Choose connectivity', text: 'Metro and bus access can save more than a lower rent.' },
          { title: 'Check what is included', text: 'Maintenance and water charges add up.' },
          { title: 'Read the tenant policy', text: 'Confirm family or bachelor rules before visiting.' },
          { title: 'Negotiate the lease', text: 'Longer commitments can earn a better rent.' },
        ],
      },
      {
        kind: 'rentBudget',
        title: 'Estimate your move-in cost',
        presetRent: 9500,
      },
    ],
    faq: [
      {
        q: 'How can I keep my monthly cost low?',
        hint: 'To keep total monthly outlay predictable, factor in separate water tanker costs, electricity charges, and society maintenance on top of the base rent. Choosing a home within walking distance of public transit often saves significant commute expenses. Verify all recurring utility splits and sub-meter arrangements in writing with the landlord.',
      },
      {
        q: 'Is a larger deposit worth a lower rent?',
        hint: 'Some landlords may agree to a modest monthly rent reduction if you provide a slightly higher upfront security deposit. Evaluate your available liquidity against potential savings, ensuring that clear deposit refund timelines are specified in the lease agreement. Confirm refund mechanisms and deduction clauses directly with the landlord before transferring funds.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  '10000-to-25000': {
    slug: '10000-to-25000',
    group: 'budget',
    label: `${RUPEE}10,000 - ${RUPEE}25,000`,
    eyebrow: `Budget ${DOT} ${RUPEE}10,000 - ${RUPEE}25,000`,
    headline: 'The popular\n*sweet spot.*',
    lead: `Furnished 1 BHKs, comfortable 2 BHKs and independent houses between ${RUPEE}10,000 and ${RUPEE}25,000, close to work and daily life.`,
    theme: {
      mode: 'light',
      bg: '#F2F6F3',
      accent: '#5FAE8E',
      accentInk: '#2B6B52',
      dark1: '#1F3A30',
      dark2: '#08130F',
    },
    displayFont: 'fraunces',
    motion: 'numeral',
    numeral: '25K',
    modules: [
      {
        kind: 'table',
        title: 'What this range typically rents',
        head: ['Option', 'Where it fits'],
        rows: [
          ['Furnished 1 BHK', 'IT corridor and city-centre locations'],
          ['2 BHK apartment', 'Established residential neighbourhoods'],
          ['Independent house', 'Quiet residential streets'],
        ],
        note: 'Indicative only; availability varies.',
      },
      {
        kind: 'rentBudget',
        title: 'Estimate your move-in cost',
        presetRent: 18000,
      },
    ],
    faq: [
      {
        q: 'Furnished or unfurnished at this price?',
        hint: 'A furnished home reduces upfront furniture purchases and relocation hassle, making it ideal for temporary assignments or relocating professionals. Conversely, unfurnished units offer lower monthly rents and long-term personalization for established families. Weigh initial furnishing costs against the cumulative monthly rental premium, and verify itemized inventory with the landlord.',
      },
      {
        q: 'How early should I start looking?',
        hint: 'Homes in this popular price bracket witness high tenant turnover, with prime apartments being finalized within two to three weeks of listing. Starting your search three to four weeks prior to your targeted move-in date provides optimal selection without double-paying rent. Always confirm availability dates and notice periods directly with the owner.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  '25000-to-50000': {
    slug: '25000-to-50000',
    group: 'budget',
    label: `${RUPEE}25,000 - ${RUPEE}50,000`,
    eyebrow: `Budget ${DOT} ${RUPEE}25,000 - ${RUPEE}50,000`,
    headline: 'Space for\n*your whole life.*',
    lead: `Spacious 2 and 3 BHK apartments, garden villas and fitted offices between ${RUPEE}25,000 and ${RUPEE}50,000, with clubhouses and covered parking.`,
    theme: {
      mode: 'light',
      bg: '#F2F4F9',
      accent: '#6A8FD6',
      accentInk: '#3F63A8',
      dark1: '#1B2B4A',
      dark2: '#070C18',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '50K',
    modules: [
      {
        kind: 'compare',
        title: 'Compare side by side',
      },
      {
        kind: 'rentBudget',
        title: 'Estimate your move-in cost',
        presetRent: 38000,
      },
    ],
    faq: [
      {
        q: 'What should I compare besides the rent?',
        hint: 'Beyond the nominal monthly rent, compare society maintenance charges, dedicated parking allocations, clubhouse fees, and average power backup costs. Gated communities with active sports facilities and round-the-clock security often justify slightly higher charges through daily lifestyle savings. Evaluate total anticipated monthly commitments and confirm all inclusions directly with the landlord.',
      },
      {
        q: 'Can I negotiate the rent at this level?',
        hint: 'Yes, landlords in this segment are often willing to negotiate rent, especially for tenants with stable corporate credentials offering longer lease commitments. You may also negotiate complimentary parking bays, fresh repainting, or upgraded fixtures rather than an outright discount. Document all negotiated concessions in the written draft before signing with the owner.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  'above-50000': {
    slug: 'above-50000',
    group: 'budget',
    label: `Above ${RUPEE}50,000`,
    eyebrow: `Budget ${DOT} Above ${RUPEE}50,000`,
    headline: 'Rentals of\n*quiet distinction.*',
    lead: `Furnished sky homes, private bungalow floors, gated estate villas and prime retail frontage above ${RUPEE}50,000 a month.`,
    theme: {
      mode: 'dark',
      bg: '#0B0F10',
      ink: '#F2EEE6',
      accent: '#CDB27A',
      accentInk: '#E4D3A6',
      dark1: '#1B2527',
      dark2: '#050708',
    },
    displayFont: 'cormorant',
    motion: 'numeral',
    numeral: '50K+',
    modules: [
      {
        kind: 'concierge',
        title: 'Premium rentals desk',
        items: [
          'Private viewings by appointment',
          'Fully furnished and serviced options',
          'Corporate and expatriate lease structuring',
          'Relocation and move-in coordination',
          'Discreet off-market rentals',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Are premium rentals available for short terms?',
        hint: 'While standard luxury leases typically stipulate an eleven to twenty-four month commitment, select high-end property owners and managed residences accommodate shorter corporate durations at an agreed premium. These arrangements typically include full utilities and housekeeping services. Review lease duration flexibility and deposit terms directly with the property advisor or landlord.',
      },
      {
        q: 'Can you manage the move-in?',
        hint: 'Our dedicated advisory desk coordinates every stage of high-value tenancies, from private viewings and corporate lease legal drafting to white-glove handover inspections and utility account transitions. We ensure society move-in protocols and key handovers proceed seamlessly. Confirm specific scope and bespoke onboarding services directly with your assigned rental advisor.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

  // =========================================================================
  // 3. BHK TYPE (instrument, numeral)
  // =========================================================================
  '1-bhk-for-rent': {
    slug: '1-bhk-for-rent',
    group: 'bhk',
    label: '1 BHK for Rent',
    eyebrow: `BHK Type ${DOT} 1 BHK for Rent`,
    headline: 'Small footprint,\n*easy living.*',
    lead: 'Efficient 1 BHK homes for young professionals, couples and first-time renters, close to metro and work hubs.',
    theme: {
      mode: 'light',
      bg: '#F4F8F8',
      accent: '#8CC5C9',
      accentInk: '#26686E',
      dark1: '#23424A',
      dark2: '#09161A',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '1',
    modules: [
      {
        kind: 'personas',
        title: 'Who it suits',
        cards: [
          { title: 'Young professionals', text: 'Close to work with low upkeep.' },
          { title: 'Couples', text: 'A private, manageable home.' },
          { title: 'First-time renters', text: 'A modest rent and simple setup.' },
          { title: 'Relocating employees', text: 'Furnished options for quick move-ins.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '450 - 700 sq ft'],
          ['Occupancy', '1 - 2 people'],
          ['Monthly rent', `${RUPEE}8,000 - ${RUPEE}20,000 (indicative)`],
        ],
      },
    ],
    faq: [
      {
        q: 'Is a furnished 1 BHK worth it?',
        hint: 'A furnished 1 BHK eliminates large upfront capital expenditures on beds, white goods, and modular wardrobes, making it exceptionally economical for single professionals or temporary assignments. However, verify the itemized inventory and working condition of all electronics before moving in. Always confirm replacement liability for normal wear and tear with the landlord.',
      },
      {
        q: 'Do 1 BHKs need a family or bachelor preference?',
        hint: 'Certain housing societies enforce specific tenancy guidelines regarding bachelors, single occupancy, or guest hours, whereas others welcome all backgrounds equally. Clarifying community rules early avoids administrative friction during police verification or society move-in pass approval. Confirm society tenant bylaws and gate access procedures directly with the owner.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  '2-bhk-for-rent': {
    slug: '2-bhk-for-rent',
    group: 'bhk',
    label: '2 BHK for Rent',
    eyebrow: `BHK Type ${DOT} 2 BHK for Rent`,
    headline: 'Room to grow,\n*room to work.*',
    lead: 'The most popular rental layout: two bedrooms for small families and home offices, with ventilation, balconies and parking.',
    theme: {
      mode: 'light',
      bg: '#EEF5F5',
      accent: '#5FB0B6',
      accentInk: '#2F7A80',
      dark1: '#1C3C44',
      dark2: '#071318',
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
          ['Occupancy', '2 - 4 people'],
          ['Monthly rent', `${RUPEE}15,000 - ${RUPEE}40,000 (indicative)`],
        ],
      },
    ],
    faq: [
      {
        q: '2 BHK or 1 BHK with a study?',
        hint: 'A true 2 BHK provides two full bathrooms, privacy for visiting family or children, and a dedicated workspace. A 1 BHK with a study may save monthly rent, but often lacks secondary washrooms and resale comfort. Evaluate your work-from-home schedule and long-term space requirements before confirming terms with the landlord.',
      },
      {
        q: 'What lease length is typical?',
        hint: 'Residential tenancy agreements in Hyderabad are standardly executed for an eleven-month duration to comply with stamp and registration statutory frameworks. Leases customarily include an annual rent escalation clause of five to ten percent upon mutual renewal. Review renewal terms, notice periods, and lock-in covenants in writing with the landlord.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  '3-bhk-for-rent': {
    slug: '3-bhk-for-rent',
    group: 'bhk',
    label: '3 BHK for Rent',
    eyebrow: `BHK Type ${DOT} 3 BHK for Rent`,
    headline: 'Space for\n*every chapter.*',
    lead: 'Generous 3 BHK apartments, villas and bungalow floors for families who want a study, a guest room or a bedroom for every child.',
    theme: {
      mode: 'light',
      bg: '#E8F1F2',
      accent: '#3A9AA3',
      accentInk: '#1F6A72',
      dark1: '#17343C',
      dark2: '#061013',
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
          { title: 'Corporate housing', text: 'Space for relocating executives.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '1,400 - 2,400 sq ft'],
          ['Occupancy', '4 - 6 people'],
          ['Monthly rent', `${RUPEE}28,000 - ${RUPEE}80,000 (indicative)`],
        ],
      },
    ],
    faq: [
      {
        q: 'Is a villa better than a 3 BHK flat?',
        hint: 'A gated villa provides private outdoor garden space, ground-level parking, and no shared walls, but requires independent upkeep and higher maintenance. High-rise 3 BHK apartments offer superior shared amenities, comprehensive security, and lower utility overheads. Weigh privacy versus convenience and verify comprehensive maintenance inclusions directly with the landlord.',
      },
      {
        q: 'Which floor suits a family best?',
        hint: 'Lower floors offer quicker access, garden views, and convenience during power or lift disruptions, making them preferable for seniors and young children. Higher floors deliver expansive skyline views, superior natural ventilation, and reduced street noise. Evaluate elevator redundancy, fire egress, and balcony safety railings before finalizing with the landlord.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  '4-bhk-for-rent': {
    slug: '4-bhk-for-rent',
    group: 'bhk',
    label: '4 BHK for Rent',
    eyebrow: `BHK Type ${DOT} 4 BHK for Rent`,
    headline: 'Spacious\n*by design.*',
    lead: 'Four-bedroom villas and estates for large households and corporate leases, with gardens, staff rooms and parking for several cars.',
    theme: {
      mode: 'dark',
      bg: '#0C1517',
      ink: '#F2EEE6',
      accent: '#C9A24B',
      accentInk: '#E4D3A6',
      dark1: '#13262B',
      dark2: '#04090A',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '4',
    modules: [
      {
        kind: 'factGrid',
        title: 'What to expect',
        facts: [
          { label: 'Typical area', value: '3,500 sq ft and above' },
          { label: 'Signature features', value: 'Garden, pool access, staff room' },
          { label: 'Parking', value: 'Three or more cars' },
          { label: 'Best suited to', value: 'Large families and corporate leases' },
        ],
      },
      {
        kind: 'concierge',
        title: 'Premium rentals desk',
        items: [
          'Private viewings by appointment',
          'Furnishing and setup support',
          'Corporate lease structuring',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Are large rentals negotiable?',
        hint: 'Yes, extensive 4 BHK residences and luxury estate properties frequently have room for rent and furnishing negotiations, especially with long-term corporate or expatriate lessees. Owners appreciate vetted corporate tenants who ensure disciplined property maintenance and uninterrupted tenure. Clarify all proposed modifications and maintenance expectations in writing with the landlord.',
      },
      {
        q: 'What approvals matter for corporate leases?',
        hint: 'Corporate lease agreements require formal board resolutions, authorized signatory documentation, PAN and GST certificates, and detailed indemnification clauses. Landlords must provide clear title proof, encumbrance certificates, and verified bank mandates for TDS compliance. Ensure all company documentation and tax withholding terms are reviewed thoroughly with qualified legal and tax advisers.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

  // =========================================================================
  // 4. EXPLORE & HUB
  // =========================================================================
  'all': {
    slug: 'all',
    group: 'explore',
    label: 'All Rental Properties',
    eyebrow: `Rent ${DOT} All Rental Properties`,
    headline: 'Find a home you will\n*love living in.*',
    lead: 'Rentals across Hyderabad, from compact flats to gated villas and offices, with deposits and charges shown upfront.',
    theme: {
      mode: 'light',
      bg: '#F2F6F5',
      accent: '#2F8F9D',
      accentInk: '#1D6A76',
      dark1: '#1B3B44',
      dark2: '#07151A',
    },
    displayFont: 'instrument',
    motion: 'maskRise',
    modules: [
      {
        kind: 'rentBudget',
        title: 'Estimate your move-in cost',
        presetRent: 30000,
      },
      {
        kind: 'checklist',
        title: 'Before you rent',
        items: [
          'Read the lease term, lock-in and notice period',
          "Photograph the home's condition at move-in",
          'Confirm who pays maintenance and utilities',
          'Get a written inventory for furnished homes',
          'Keep a signed copy of the agreement and every receipt',
          'Complete tenant verification formalities as required',
        ],
      },
    ],
    faq: [
      {
        q: 'How much should I budget for the move-in?',
        hint: 'A realistic move-in budget accounts for the first month rent, refundable security deposit (commonly two to three months), brokerage fee if applicable, and moving truck expenses. Additional outlays may include minor furnishings and utility deposits. Always calculate comprehensive initial commitments and verify payment schedules in writing with the landlord.',
      },
      {
        q: 'Do I need a written rental agreement?',
        hint: 'A formally executed and stamped written rental agreement is legally essential to protect both tenant and landlord rights throughout the lease period. It establishes rent amounts, deposit refund conditions, maintenance responsibilities, and dispute resolution mechanisms. Never rely on verbal understandings, and verify the final lease draft with a qualified legal professional.',
      },
    ],
    cta: { label: 'Talk to a Rental Advisor' },
  },

  'share-requirement': {
    slug: 'share-requirement',
    group: 'explore',
    label: 'Share Your Requirement',
    eyebrow: `Explore ${DOT} Share Requirement`,
    headline: 'Tell us what you need.\n*We will find it.*',
    lead: 'Share your requirement in three short steps and a rental advisor will shortlist matching homes for you.',
    note: 'Free. No obligation.',
    theme: {
      mode: 'light',
      bg: '#F2F6F5',
      accent: '#2F8F9D',
      accentInk: '#1D6A76',
      dark1: '#1B3B44',
      dark2: '#07151A',
    },
    displayFont: 'instrument',
    motion: 'maskRise',
    modules: [
      {
        kind: 'checklist',
        title: 'Why share your requirement with VESTA',
        items: [
          'Curated shortlists matched to your specific criteria',
          'Verified properties with genuine photographs and video tours',
          'Zero spam: dedicated advisor as single point of contact',
          'Transparent lease negotiation and move-in coordination',
        ],
      },
      {
        kind: 'personas',
        title: 'How our rental advisory works',
        cards: [
          { title: '1. Tell Us Your Needs', text: 'Share your preferred localities, budget, and family or team requirements.' },
          { title: '2. Curated Shortlist', text: 'Receive verified properties that meet your exact specifications.' },
          { title: '3. Guided Viewings', text: 'Tour shortlisted homes with an advisor who knows the neighbourhood.' },
          { title: '4. Seamless Move-In', text: 'Complete paperwork, inventory check, and key handover with confidence.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Is sharing my requirement really free?',
        hint: 'Submitting your rental requirement through our platform is completely free with no obligation to rent. Our advisors review your preferences and share curated property options that match your budget and lifestyle needs. Service or brokerage fees apply only when you finalize and sign a lease agreement with a landlord.',
      },
      {
        q: 'How quickly will an advisor contact me?',
        hint: 'A dedicated rental advisor typically reviews your requirement and connects via WhatsApp or phone call within two business hours. They will share an initial shortlist of available homes matching your criteria and schedule private viewing appointments. Confirm your preferred mode of contact and timing directly with the advisory team.',
      },
    ],
    cta: { label: 'Share Your Requirement' },
  },

  'projects': {
    slug: 'projects',
    group: 'explore',
    label: 'Rental Projects',
    eyebrow: `Explore ${DOT} Rental Projects`,
    headline: 'Communities worth\n*calling home.*',
    lead: 'Gated communities and managed residences with homes available for rent now.',
    theme: {
      mode: 'light',
      bg: '#F3F5F1',
      accent: '#C9A24B',
      accentInk: '#755914',
      dark1: '#123A32',
      dark2: '#05140F',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'factGrid',
        title: 'Why choose a gated project',
        facts: [
          { label: '24/7 Security', value: 'Trained guards and access control.' },
          { label: 'Full Backup', value: '100% generator power backup.' },
          { label: 'Lifestyle Amenities', value: 'Clubhouse, pool, gym and courts.' },
          { label: 'Professional Maintenance', value: 'Dedicated facility management teams.' },
        ],
      },
      {
        kind: 'personas',
        title: 'Project living profiles',
        cards: [
          { title: 'IT Enclaves', text: 'Towers minutes from Madhapur and Financial District with clubhouse living.' },
          { title: 'Quiet Family Belts', text: 'Low-rise courtyard apartments and garden communities near reputed schools.' },
          { title: 'Private Villa Reserves', text: 'Gated enclaves offering expansive private lawns, clubhouses and privacy.' },
          { title: 'Urban Metro Hubs', text: 'Connected apartments within walking distance of high-speed mass transit.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How do project rents compare to standalone buildings?',
        hint: 'Gated communities command an indicative ten to twenty-five percent rental premium over standalone buildings due to round-the-clock security, power backup, clubhouses, and landscaped gardens. Shared society amenities often eliminate outside gym or club memberships, offering compelling overall value. Verify the full breakdown of society maintenance dues with the landlord.',
      },
      {
        q: 'Can I view multiple units in the same project?',
        hint: 'Depending on inventory, our advisors can organize coordinated viewing appointments for several units across different towers and configurations within the same gated enclave during a single visit. This provides immediate comparisons of views, floor levels, and interior furnishing conditions. Schedule your project tour in advance with your rental advisor.',
      },
    ],
    cta: { label: 'Explore Rental Projects' },
  },
};

export const getRentPageConfig = (slug: string): RentPageConfig | undefined => {
  return RENT_PAGE_CONFIGS[slug];
};

export default RENT_PAGE_CONFIGS;
