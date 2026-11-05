export type FaqCategory = {
  id: 'buying' | 'renting' | 'selling' | 'legal' | 'loans' | 'nri' | 'about';
  label: string;
  icon: string;
  blurb: string;
};

export type Faq = {
  id: string;
  cat: FaqCategory['id'];
  q: string;
  a: string;
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'buying',
    label: 'Buying',
    icon: 'Home',
    blurb: 'Everything from first viewing to keys in hand.',
  },
  {
    id: 'renting',
    label: 'Renting',
    icon: 'Key',
    blurb: 'Leases, deposits and living arrangements.',
  },
  {
    id: 'selling',
    label: 'Selling',
    icon: 'TrendingUp',
    blurb: 'Pricing, marketing and closing with confidence.',
  },
  {
    id: 'legal',
    label: 'Legal and Documents',
    icon: 'FileCheck',
    blurb: 'Titles, approvals and registration, explained.',
  },
  {
    id: 'loans',
    label: 'Loans and Costs',
    icon: 'Landmark',
    blurb: 'Financing and the full cost of ownership.',
  },
  {
    id: 'nri',
    label: 'NRI and Investment',
    icon: 'Globe',
    blurb: 'Owning and growing from anywhere.',
  },
  {
    id: 'about',
    label: 'Working With Us',
    icon: 'Handshake',
    blurb: 'How our advisors work for you.',
  },
];

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

interface FaqInput {
  cat: FaqCategory['id'];
  q: string;
  a: string;
}

const RAW_FAQS: FaqInput[] = [
  // BUYING (6)
  {
    cat: 'buying',
    q: 'How do I start my property search?',
    a: 'Tell us your budget, preferred localities and timeline. An advisor shortlists verified options, arranges private viewings and compares them with you on price per sq ft, approvals and resale potential, so you only visit homes that genuinely fit.',
  },
  {
    cat: 'buying',
    q: 'What is the difference between carpet, built-up and super built-up area?',
    a: 'Carpet area is the usable floor inside your walls. Built-up area adds wall thickness and balconies. Super built-up adds your share of common areas such as lobbies and lifts. Compare homes on the same basis and ask for the carpet area in writing.',
  },
  {
    cat: 'buying',
    q: 'Should I buy a ready-to-move or an under-construction home?',
    a: "Ready homes offer certainty: you can inspect them, check the Occupancy Certificate and move in. Under-construction homes often cost less to enter and link payments to milestones, but carry delivery risk. Check the RERA registration and the developer's record before booking.",
  },
  {
    cat: 'buying',
    q: 'What is an Occupancy Certificate and why does it matter?',
    a: 'The Occupancy Certificate is issued by the local authority after completion and confirms the building follows the approved plans. Ask for it before buying a ready home. Without it, utility connections, loans and future resale can become difficult.',
  },
  {
    cat: 'buying',
    q: 'How do I know whether the price is fair?',
    a: "We compare recent transactions in the same micro-market, the price per sq ft or sq yd, the age and quality of construction and the project's amenities. A written comparison of similar listings helps you negotiate with confidence.",
  },
  {
    cat: 'buying',
    q: 'Can I negotiate the price?',
    a: 'Often, yes, especially on resale and ready homes. Room to negotiate depends on demand, urgency, payment terms and condition. Your advisor handles the negotiation and also looks at inclusions such as parking, furnishings and maintenance deposits.',
  },

  // RENTING (5)
  {
    cat: 'renting',
    q: 'How much security deposit is typical?',
    a: 'Residential deposits are commonly a few months of rent and commercial deposits are often higher, but the amount is agreed between you and the landlord. Record the amount, the refund conditions and the refund timeline in the rental agreement.',
  },
  {
    cat: 'renting',
    q: 'What should a rental agreement cover?',
    a: 'It should state the rent, deposit, maintenance responsibility, lease term, lock-in, notice period, rent escalation, permitted use and the condition of the home at move-in. Read every clause, and keep a signed copy with all receipts.',
  },
  {
    cat: 'renting',
    q: 'Who pays maintenance and utilities?',
    a: "It depends on the agreement. Society maintenance may be paid by the owner or the tenant as agreed, while electricity, water and internet are usually the tenant's. Clarify this before signing so there are no surprises.",
  },
  {
    cat: 'renting',
    q: 'Can I rent as a bachelor or with pets?',
    a: 'Rules vary by society and landlord. Tell us your requirement up front and we shortlist homes whose owners and associations welcome it, rather than discovering the restriction after a viewing.',
  },
  {
    cat: 'renting',
    q: 'How long is a lease, and can I extend it?',
    a: 'Eleven months is a common residential term, while commercial leases are often longer with a lock-in. Extensions and rent revisions are negotiated at renewal, so agree the escalation clause at the start.',
  },

  // SELLING (5)
  {
    cat: 'selling',
    q: "How do you decide my property's asking price?",
    a: 'We prepare a comparative market analysis using recent sales, current listings, condition and location, then agree a pricing strategy with you. Pricing correctly at launch usually attracts serious buyers faster than starting high and reducing later.',
  },
  {
    cat: 'selling',
    q: 'How will my property be marketed?',
    a: 'Through professional photography and cinematic walkthroughs, curated listings, outreach to verified buyers and investors, and private previews for qualified clients. Every enquiry is screened before a viewing is arranged.',
  },
  {
    cat: 'selling',
    q: 'Which documents do I need to sell?',
    a: 'Typically the title deed, earlier sale or link documents, encumbrance certificate, property tax receipts, utility bills, approved plans, society no-objection and your identity documents. We prepare a checklist specific to your property.',
  },
  {
    cat: 'selling',
    q: 'How long does a sale take?',
    a: 'It depends on pricing, demand and paperwork. A well-priced, well-documented home can attract a buyer quickly, but loan processing and registration add weeks. After reviewing your property we give you a realistic timeline.',
  },
  {
    cat: 'selling',
    q: 'Which costs and taxes apply when I sell?',
    a: 'Selling can involve capital gains tax, brokerage and clearing any outstanding loan. Tax treatment depends on how long you held the property and your circumstances, so consult a tax professional; we are happy to coordinate with your adviser.',
  },

  // LEGAL AND DOCUMENTS (6)
  {
    cat: 'legal',
    q: 'What is an encumbrance certificate?',
    a: 'It lists the registered transactions on a property over a period, such as sales and mortgages, and helps confirm the title is free of registered liens. We recommend obtaining one before any purchase.',
  },
  {
    cat: 'legal',
    q: 'What is RERA and how does it protect me?',
    a: "The Real Estate (Regulation and Development) Act requires many projects to register with the state authority and publish key details. It sets disclosure and delivery duties for promoters and gives buyers a complaint process. Verify a project's registration on the Telangana RERA website before booking.",
  },
  {
    cat: 'legal',
    q: 'Which approvals should I check for a project or plot?',
    a: "Check the layout or building approval from the competent authority such as HMDA or DTCP, the local body's permissions, the land-use classification and the survey number. Ask for copies and have a lawyer verify them.",
  },
  {
    cat: 'legal',
    q: 'How does registration work?',
    a: 'The sale deed is signed and registered at the sub-registrar office after stamp duty and registration charges are paid, with both parties and witnesses present. Afterwards, update property tax and utility records in your name.',
  },
  {
    cat: 'legal',
    q: 'What are stamp duty and registration charges?',
    a: 'These are government charges paid when a property is registered, calculated on the higher of the sale price or the government-assessed value. For planning, many buyers in Telangana budget roughly 6 percent of the value; rates change, so confirm the current figures before you commit.',
  },
  {
    cat: 'legal',
    q: 'What is the difference between an approved and an unapproved layout?',
    a: 'Approved layouts have sanctioned plans, roads and open spaces, which supports bank loans and resale. Unapproved layouts may need regularisation and can limit financing and building permissions. Have the approval verified before paying any token.',
  },

  // LOANS AND COSTS (5)
  {
    cat: 'loans',
    q: 'How much down payment do I need?',
    a: 'Banks usually finance a portion of the property value and you fund the rest as your margin. The exact share depends on the lender, your profile and the property. We arrange an eligibility estimate before you start negotiating.',
  },
  {
    cat: 'loans',
    q: 'Which costs should I budget beyond the price?',
    a: 'Plan for stamp duty and registration, GST where it applies to under-construction homes, brokerage if any, parking, maintenance deposits, loan processing fees, interiors and moving. Your advisor can prepare a full cost sheet so there are no surprises.',
  },
  {
    cat: 'loans',
    q: 'Can you help me get a home loan?',
    a: 'Yes. We introduce you to leading banks and housing finance companies, explain eligibility and documentation and coordinate with the lender. Approval, rates and terms are decided by the lender.',
  },
  {
    cat: 'loans',
    q: 'How much EMI is comfortable?',
    a: 'A common rule of thumb is to keep total monthly EMIs within about 40 percent of your income, and rent within about 30 percent. These are guides, not rules; your obligations and goals matter. Try our EMI estimator on the Buy page.',
  },
  {
    cat: 'loans',
    q: 'Is GST charged on property?',
    a: 'GST generally applies to under-construction properties but not to completed homes with an occupancy certificate, and rates vary by category. Rules change, so confirm the current treatment with a tax professional.',
  },

  // NRI AND INVESTMENT (4)
  {
    cat: 'nri',
    q: 'Can NRIs buy property in Hyderabad?',
    a: 'NRIs can generally buy residential and commercial property in India, but not agricultural land, plantation property or farmhouses. Documentation and payment routes are specific, so we coordinate with legal and banking partners. Confirm current rules before proceeding.',
  },
  {
    cat: 'nri',
    q: 'Can you manage my property while I am abroad?',
    a: 'Yes. Our property management covers tenant search, rent collection, maintenance, inspections and transparent monthly reporting, so your home is cared for while you are away.',
  },
  {
    cat: 'nri',
    q: 'How do I evaluate a rental investment?',
    a: 'Divide the annual rent by the purchase price for the gross yield, then factor in maintenance, vacancy, taxes and appreciation prospects. Use the yield calculator on our Commercial page for a quick estimate. Returns are never guaranteed.',
  },
  {
    cat: 'nri',
    q: 'Are plots or apartments better for investment?',
    a: 'Plots can appreciate with the area growth but produce no rent until built on. Apartments offer rental income and easier management but age over time. The right choice depends on your time horizon and risk appetite.',
  },

  // WORKING WITH US (4)
  {
    cat: 'about',
    q: 'How are your fees structured?',
    a: 'Our fee structure is explained clearly in writing at your first consultation, before you sign anything. It depends on the service, whether buying, selling or leasing, and there are no hidden charges.',
  },
  {
    cat: 'about',
    q: 'Are your listings verified?',
    a: 'Every listing is checked for ownership documents, approvals and pricing consistency before it is published. We encourage you to verify independently as well, and we will help you do it.',
  },
  {
    cat: 'about',
    q: 'Can I book a private viewing?',
    a: 'Yes. Choose a date on any listing and an advisor will confirm the viewing, accompany you and answer questions about the home and the neighbourhood. Virtual viewings can be arranged on request.',
  },
  {
    cat: 'about',
    q: 'Which areas do you cover?',
    a: 'We focus on Hyderabad premium and fast-growing micro-markets, including Jubilee Hills, Banjara Hills, Kokapet, Gachibowli, the Financial District, Madhapur, Kondapur, Manikonda, Narsingi, Bachupally and Gandipet.',
  },
];

export const FAQS: Faq[] = RAW_FAQS.map((item) => ({
  id: slugify(item.q),
  cat: item.cat,
  q: item.q,
  a: item.a,
}));

