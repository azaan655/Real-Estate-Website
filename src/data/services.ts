export interface Service {
  id: string;
  name: string;
  description: string;
  tags: [string, string, string];
}

export const servicesData: Service[] = [
  {
    id: '01',
    name: 'Buying Advisory',
    description: "A private, curated search across Hyderabad's most sought-after addresses, from Jubilee Hills villas to Kokapet towers, with site visits, negotiation and a smooth closing.",
    tags: ['Curated shortlists', 'Site visits', 'Negotiation'],
  },
  {
    id: '02',
    name: 'Selling & Marketing',
    description: 'Premium positioning for your property: professional photography, cinematic walkthroughs, targeted outreach to verified buyers and NRIs, and disciplined price negotiation.',
    tags: ['Cinematic shoots', 'Verified buyers', 'Price strategy'],
  },
  {
    id: '03',
    name: 'Rentals & Leasing',
    description: 'Executive residences and managed leasing for families, expatriates and corporates, with tenant screening, clear agreements and a seamless move-in.',
    tags: ['Tenant screening', 'Lease agreements', 'Corporate housing'],
  },
  {
    id: '04',
    name: 'Investment Advisory',
    description: 'Data-led guidance on pre-launch projects, plots, farmland and commercial spaces, with yield, appreciation and risk modelled before you commit.',
    tags: ['Yield analysis', 'Plots & farmland', 'Commercial'],
  },
  {
    id: '05',
    name: 'Valuation & Market Analysis',
    description: 'Independent price opinions and micro-market reports, backed by recent transactions and infrastructure trends in your locality.',
    tags: ['Comparative pricing', 'Locality reports', 'Trend insight'],
  },
  {
    id: '06',
    name: 'Legal & Documentation',
    description: 'Title verification, encumbrance checks, RERA review, sale deed drafting and registration, coordinated with trusted legal partners.',
    tags: ['Title checks', 'RERA review', 'Registration'],
  },
  {
    id: '07',
    name: 'Home Loan Assistance',
    description: 'Introductions to leading banks and NBFCs, eligibility planning and paperwork support to secure competitive rates and a quicker sanction.',
    tags: ['Eligibility planning', 'Bank introductions', 'Documentation'],
  },
  {
    id: '08',
    name: 'Property & NRI Management',
    description: 'End-to-end care for properties you own but cannot be present for: rent collection, maintenance, inspections and transparent monthly reporting.',
    tags: ['Rent collection', 'Maintenance', 'Monthly reports'],
  },
];

export { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER } from './siteInfo';


