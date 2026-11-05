// Indicative timelines and sample copy for a client demo; confirm with the agency before launch.

export type HowStep = {
  icon: string;
  tint: 't1' | 't2' | 't3';
  title: string;
  text: string;
  points: [string, string, string];
  duration: string;
};

export type HowTab = {
  id: 'buy' | 'rent' | 'sell';
  label: string;
  steps: [HowStep, HowStep, HowStep];
};

export const HOW_TABS: HowTab[] = [
  {
    id: 'buy',
    label: 'Buying',
    steps: [
      {
        icon: 'PieChart',
        tint: 't1',
        title: 'Discover and Evaluate',
        text: 'We listen to your budget, timeline and lifestyle, then compare verified homes on price per sq ft, approvals and resale potential, so you only see options that truly fit.',
        points: [
          'Written brief and budget plan',
          'Price and approvals comparison',
          'Curated shortlist of verified homes',
        ],
        duration: 'Typically 2 to 5 days',
      },
      {
        icon: 'Users',
        tint: 't2',
        title: 'Meet Your Advisor',
        text: 'One dedicated advisor walks you through private viewings, answers every question on the spot and negotiates price, inclusions and payment terms on your behalf.',
        points: [
          'Private and virtual viewings',
          'Neighbourhood and resale notes',
          'Negotiation with every number in writing',
        ],
        duration: 'Typically 1 to 3 weeks',
      },
      {
        icon: 'BadgeCheck',
        tint: 't3',
        title: 'Close with Confidence',
        text: 'We coordinate legal checks, home loans, stamp duty and registration, then hand over your keys, with complete transparency at every stage.',
        points: [
          'Title and encumbrance checks',
          'Loan coordination and cost sheet',
          'Registration and handover',
        ],
        duration: 'Typically 3 to 6 weeks',
      },
    ],
  },
  {
    id: 'rent',
    label: 'Renting',
    steps: [
      {
        icon: 'Search',
        tint: 't1',
        title: 'Shortlist and View',
        text: 'Tell us your budget, locality and move-in date. We shortlist verified rentals and arrange viewings that fit your schedule.',
        points: [
          'Verified listings only',
          'Deposit and charges shown upfront',
          'Same-week viewings',
        ],
        duration: 'Typically 1 to 3 days',
      },
      {
        icon: 'FileCheck',
        tint: 't2',
        title: 'Verify and Agree',
        text: 'We help you review the lease, deposit, maintenance and lock-in terms, and coordinate tenant verification, so there are no surprises.',
        points: [
          'Plain-language lease review',
          'Inventory and condition checklist',
          'Tenant verification support',
        ],
        duration: 'Typically 2 to 4 days',
      },
      {
        icon: 'Key',
        tint: 't3',
        title: 'Move In',
        text: 'Sign, pay and collect your keys. We coordinate the handover, utility transfers and move-in support, and stay available after you settle in.',
        points: [
          'Agreement signing and receipts',
          'Utility and society formalities',
          'Post move-in support',
        ],
        duration: 'Typically 1 to 2 days',
      },
    ],
  },
  {
    id: 'sell',
    label: 'Selling',
    steps: [
      {
        icon: 'TrendingUp',
        tint: 't1',
        title: 'Price and Prepare',
        text: 'A comparative market analysis sets the right asking price, while staging advice, professional photography and a document checklist prepare your home for the market.',
        points: [
          'Comparative market analysis',
          'Cinematic photography and walkthrough',
          'Documents checklist',
        ],
        duration: 'Typically 3 to 7 days',
      },
      {
        icon: 'Megaphone',
        tint: 't2',
        title: 'Market and Meet Buyers',
        text: 'We showcase your home to verified buyers, investors and NRIs, screen every enquiry and host private viewings so only serious buyers visit.',
        points: [
          'Targeted outreach',
          'Screened enquiries',
          'Private viewings and feedback',
        ],
        duration: 'Varies with demand',
      },
      {
        icon: 'Handshake',
        tint: 't3',
        title: 'Negotiate and Close',
        text: 'We negotiate offers, coordinate the buyer\u2019s loan and legal checks, and see the sale through registration and handover.',
        points: [
          'Offer comparison',
          'Sale agreement and registration',
          'Smooth handover',
        ],
        duration: 'Typically 4 to 8 weeks',
      },
    ],
  },
];

