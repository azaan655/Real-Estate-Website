// SAMPLE DATA for a client demo. Replace with real facts before launch.
import { BRAND_NAME, FOUNDED_YEAR } from './siteInfo';
export { BRAND_NAME, FOUNDED_YEAR };

export interface StatItem {
  key: string;
  value: number;
  suffix?: string;
  label: string;
}

export const ABOUT_STATS: StatItem[] = [
  {
    key: 'years',
    value: new Date().getFullYear() - FOUNDED_YEAR,
    label: 'Years of experience',
  },
  {
    key: 'transactions',
    value: 1200,
    suffix: '+',
    label: 'Properties transacted',
  },
  {
    key: 'localities',
    value: 40,
    suffix: '+',
    label: 'Localities covered',
  },
  {
    key: 'advisors',
    value: 12,
    label: 'Dedicated advisors',
  },
];

export interface Milestone {
  year: number;
  title: string;
  description: string;
}

export const ABOUT_TIMELINE: Milestone[] = [
  {
    year: FOUNDED_YEAR,
    title: 'Founded in Banjara Hills',
    description: 'A two-person desk focused on verified residential resales.',
  },
  {
    year: FOUNDED_YEAR + 2,
    title: 'The luxury villas desk',
    description: 'A dedicated team for villas, estates and gated communities.',
  },
  {
    year: FOUNDED_YEAR + 4,
    title: 'Rentals and property management',
    description: 'Leasing, tenant screening and care for owners who live elsewhere.',
  },
  {
    year: FOUNDED_YEAR + 6,
    title: 'NRI and investment advisory',
    description: 'Remote buying, documentation and yield-led investment guidance.',
  },
  {
    year: FOUNDED_YEAR + 8,
    title: 'Private digital viewings',
    description: 'Virtual walkthroughs and scheduled private tours for busy clients.',
  },
  {
    year: FOUNDED_YEAR + 11,
    title: 'Plots, land and commercial',
    description: 'Approved layouts, retail frontage and fitted offices added to the portfolio.',
  },
];

export interface ValueItem {
  index: string;
  name: string;
  description: string;
}

export const ABOUT_VALUES: ValueItem[] = [
  {
    index: '01',
    name: 'Verified',
    description: 'Every listing is checked for ownership documents, approvals and pricing consistency before it is published.',
  },
  {
    index: '02',
    name: 'Transparent',
    description: 'Fees, taxes and charges are shown in writing before you commit. No hidden costs, ever.',
  },
  {
    index: '03',
    name: 'Personal',
    description: 'One dedicated advisor from your first viewing to handover, who knows your brief and your timeline.',
  },
  {
    index: '04',
    name: 'Discreet',
    description: 'Your enquiries, budget and viewings stay private. Many of the homes we show are never listed publicly.',
  },
];

export const ABOUT_MISSION = 'To make every property decision in Hyderabad clear, confident and personal.';
export const ABOUT_VISION = "To be the city's most trusted address for homes and investments.";

export interface ProcessStep {
  numeral: string;
  title: string;
  copy: string;
  tags: string[];
}

export const ABOUT_PROCESS: ProcessStep[] = [
  {
    numeral: '01',
    title: 'Discover',
    copy: 'We listen first: your budget, timeline, localities and lifestyle, in a private consultation.',
    tags: ['Free consultation', 'Written brief', 'Budget planning'],
  },
  {
    numeral: '02',
    title: 'Shortlist',
    copy: 'A curated list of verified options, compared on price per sq ft, approvals and resale potential.',
    tags: ['Verified listings', 'Price comparison', 'Approvals check'],
  },
  {
    numeral: '03',
    title: 'View',
    copy: 'Private viewings on your schedule, with an advisor who answers every question on the spot.',
    tags: ['Private tours', 'Virtual viewings', 'Neighbourhood notes'],
  },
  {
    numeral: '04',
    title: 'Negotiate',
    copy: 'We negotiate price, inclusions and payment terms on your behalf, and keep every number in writing.',
    tags: ['Price strategy', 'Payment terms', 'Full cost sheet'],
  },
  {
    numeral: '05',
    title: 'Close and care',
    copy: 'Legal checks, loan coordination, registration and handover, then property management if you want it.',
    tags: ['Legal coordination', 'Loan support', 'Property care'],
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  languages: string[];
  monogram: string;
  photo?: string;
}

export const ABOUT_TEAM: TeamMember[] = [
  {
    id: 'aarav-reddy',
    name: 'Aarav Reddy',
    role: 'Founder and Principal Advisor',
    specialty: 'Luxury residences and estates',
    languages: ['English', 'Hindi', 'Telugu'],
    monogram: 'AR',
  },
  {
    id: 'meera-iyer',
    name: 'Meera Iyer',
    role: 'Head of Luxury Residences',
    specialty: 'Villas, penthouses and gated communities',
    languages: ['English', 'Hindi'],
    monogram: 'MI',
  },
  {
    id: 'imran-qureshi',
    name: 'Imran Qureshi',
    role: 'Director, Commercial and Land',
    specialty: 'Offices, retail frontage and approved plots',
    languages: ['English', 'Hindi', 'Urdu'],
    monogram: 'IQ',
  },
  {
    id: 'sneha-varma',
    name: 'Sneha Varma',
    role: 'Rentals and Property Management',
    specialty: 'Leasing, NRI care and owner reporting',
    languages: ['English', 'Telugu'],
    monogram: 'SV',
  },
];

export const ABOUT_AREAS = [
  'Jubilee Hills',
  'Banjara Hills',
  'Kokapet',
  'Gachibowli',
  'Financial District',
  'Madhapur',
  'Kondapur',
  'Manikonda',
  'Narsingi',
  'Bachupally',
  'Gandipet',
  'Kukatpally',
];

export interface TestimonialItem {
  id: string;
  quote: string;
  attribution: string;
}

export const ABOUT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: 'They shortlisted three homes that genuinely fit, and every number was in writing before we said yes.',
    attribution: 'A family, Jubilee Hills',
  },
  {
    id: 't2',
    quote: 'Buying from abroad felt unthinkable until an advisor handled the viewings, paperwork and registration.',
    attribution: 'An NRI investor, Kokapet',
  },
  {
    id: 't3',
    quote: 'A fitted office and a clean lease within two weeks. Calm, quick and completely transparent.',
    attribution: 'A founder, Madhapur',
  },
];

