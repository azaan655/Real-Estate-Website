export interface KeyDetail {
  label: string;
  value: string;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'plot' | 'commercial';
export type PropertyStatus = 'ready' | 'under-construction' | 'new-launch';
export type BudgetBucket = 'under-50-lacs' | '50-lacs-to-1-cr' | '1-cr-to-5-cr' | 'above-5-cr';
export type BhkBucket = '1-bhk' | '2-bhk' | '3-bhk' | '4-bhk' | '4-plus-bhk' | 'none';

export interface Property {
  id: string | number;
  name: string; // contains "\n"
  location: string;
  city?: string;
  type: PropertyType;
  subtype: string;
  status: PropertyStatus;
  possession: string;
  featured: boolean;
  priceCr: number;
  area: number;
  areaUnit: 'sq ft' | 'sq yd';
  beds: number | null;
  baths: number | null;
  facing: string;
  tagline: string;
  description: string;
  highlights: string[]; // exactly 3 short phrases
  longDescription: string;
  amenities: string[]; // exactly 6
  keyDetails: KeyDetail[]; // exactly 3
  reraId: string;
  image: string;
  focal: string;
  imagePrompt: string;
  badge?: string;
}

export const formatPrice = (priceCr: number): string => {
  if (priceCr < 1) {
    const lakhs = Math.round(priceCr * 100);
    return `\u20B9${lakhs} L`;
  }
  // Drop trailing zeros: e.g. 18.50 -> 18.5, 18.0 -> 18
  const formatted = priceCr % 1 === 0 ? priceCr.toString() : parseFloat(priceCr.toFixed(2)).toString();
  return `\u20B9${formatted} Cr`;
};

export const pricePerUnit = (p: Property): string => {
  const rate = Math.round((p.priceCr * 1e7) / p.area);
  return `\u20B9${rate.toLocaleString('en-IN')} / ${p.areaUnit}`;
};

export const budgetBucket = (p: Property): BudgetBucket => {
  if (p.priceCr < 0.5) return 'under-50-lacs';
  if (p.priceCr < 1) return '50-lacs-to-1-cr';
  if (p.priceCr < 5) return '1-cr-to-5-cr';
  return 'above-5-cr';
};

export const bhkBucket = (p: Property): BhkBucket => {
  if (p.beds === 1) return '1-bhk';
  if (p.beds === 2) return '2-bhk';
  if (p.beds === 3) return '3-bhk';
  if (p.beds === 4) return '4-bhk';
  if (p.beds !== null && p.beds > 4) return '4-plus-bhk';
  return 'none';
};

export const getKeyDetails = (p: Property): KeyDetail[] => {
  if (p.keyDetails && p.keyDetails.length > 0) {
    return p.keyDetails;
  }
  return [
    { label: 'Configuration', value: `${p.beds ?? 0} BHK \u00B7 ${p.baths ?? 0} Bath` },
    { label: 'Facing', value: p.facing },
    { label: 'Possession', value: p.possession }
  ];
};

export const properties: Property[] = [
  {
    id: 1,
    location: "Jubilee Hills, Hyderabad",
    city: "Jubilee Hills",
    name: "Jubilee\nCrest Villa",
    type: "villa",
    subtype: "Independent villa",
    status: "ready",
    possession: "Ready to move",
    featured: true,
    priceCr: 18.5,
    area: 6800,
    areaUnit: "sq ft",
    beds: 5,
    baths: 6,
    facing: "East",
    tagline: "Independent rock-garden villa minutes from Road No. 36",
    description: "A contemporary independent villa on a rock-garden plot, with a double-height living room, a private pool deck and a home theatre, minutes from Road No. 36.",
    longDescription: "Set upon a generous 600 square yard plot amidst the weathered granite formations of Jubilee Hills, this residence balances monolithic privacy with airy, light-drenched volumes. Floor-to-ceiling architectural glazing opens directly onto a private lap pool deck and indigenous Deccan rockery.\n\nThe ground level flows effortlessly between formal entertainment lounges, a show kitchen, and a private temperature-controlled cinema. With an internal private elevator and discreet staff quarters, it offers a serene urban sanctuary just moments from Road No. 36.",
    highlights: [
      "Independent villa on a 600 sq yd plot",
      "Private pool and landscaped garden",
      "Home theatre and elevator"
    ],
    amenities: [
      "Private lap pool",
      "Home theatre",
      "Private elevator",
      "Rock garden",
      "Covered 3-car parking",
      "Separate staff quarters"
    ],
    keyDetails: [
      { label: "Configuration", value: "5 BHK \u00B7 6 Baths" },
      { label: "Facing", value: "East" },
      { label: "Possession", value: "Ready to move" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Contemporary luxury villa in Jubilee Hills, Hyderabad, at golden hour: flat cantilevered roofs, white stone and warm teak cladding, floor-to-ceiling glass, a turquoise infinity pool in front, natural Deccan granite boulders landscaped into the garden, gulmohar and neem trees, soft warm interior lights glowing.",
    image: "/properties/property-1.jpg",
    focal: "center 45%",
    badge: "Exclusive"
  },
  {
    id: 2,
    location: "Banjara Hills, Hyderabad",
    city: "Banjara Hills",
    name: "Banjara\nSky Penthouse",
    type: "apartment",
    subtype: "Penthouse",
    status: "ready",
    possession: "Ready to move",
    featured: true,
    priceCr: 12.8,
    area: 4200,
    areaUnit: "sq ft",
    beds: 4,
    baths: 5,
    facing: "North-East",
    tagline: "Full-floor penthouse with panoramic city and lake views",
    description: "A full-floor penthouse with panoramic views over the Hussain Sagar skyline, a private terrace and an entry lobby reserved for the residence.",
    longDescription: "Commanding the crown of one of Banjara Hills' quietest residential enclaves, this full-floor penthouse commands panoramic skyline vistas stretching toward Hussain Sagar. An exclusive high-speed lift opens directly into a private arrival vestibule, setting an immediate tone of restraint and luxury.\n\nThe floor plate spans wrap-around terrace gardens with outdoor timber decking, a private plunge pool, and expansive gallery walls designed for serious art collections. Triple-aspect exposures invite gentle cross breezes and sweeping sunset panoramas.",
    highlights: [
      "Full-floor penthouse with terrace",
      "Panoramic city and lake views",
      "Private lift lobby"
    ],
    amenities: [
      "Private lift lobby",
      "Terrace plunge pool",
      "Wrap-around deck",
      "Smart-home automation",
      "Double-height foyer",
      "24/7 concierge service"
    ],
    keyDetails: [
      { label: "Configuration", value: "4 BHK \u00B7 5 Baths" },
      { label: "Facing", value: "North-East" },
      { label: "Possession", value: "Ready to move" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Luxury high-rise penthouse terrace in Banjara Hills, Hyderabad, at dusk: glass balustrade, outdoor lounge furniture, a plunge pool, the city skyline and a distant lake glowing with lights, deep blue sky fading to orange.",
    image: "/properties/property-2.jpg",
    focal: "50% 55%"
  },
  {
    id: 3,
    location: "Kokapet, Hyderabad",
    city: "Kokapet",
    name: "Kokapet\nSky Residences",
    type: "apartment",
    subtype: "High-rise apartment",
    status: "under-construction",
    possession: "Dec 2027",
    featured: false,
    priceCr: 4.9,
    area: 2450,
    areaUnit: "sq ft",
    beds: 3,
    baths: 3,
    facing: "West",
    tagline: "Elevated high-rise living moments from the ORR corridor",
    description: "Elevated three-bedroom apartments in a gated high-rise township with a sky lounge, a clubhouse and easy access to the Outer Ring Road.",
    longDescription: "Positioned directly in Kokapet's high-growth corridor with seamless Outer Ring Road connectivity, this elevated residence provides an effortless commute to the Financial District and international airport. Clean rectilinear architecture pairs with expansive viewing balconies framing the western horizon.\n\nResidents enjoy unrestricted access to a comprehensive 50,000 sq ft clubhouse, Olympic-grade swimming facilities, and dedicated co-working sky lounges, establishing a modern standard for integrated urban living.",
    highlights: [
      "Gated high-rise township",
      "Sky lounge and clubhouse",
      "Quick ORR access"
    ],
    amenities: [
      "Sky lounge & deck",
      "50,000 sq ft clubhouse",
      "Olympic-length pool",
      "Tennis & squash courts",
      "EV charging bays",
      "Multilevel security"
    ],
    keyDetails: [
      { label: "Configuration", value: "3 BHK \u00B7 3 Baths" },
      { label: "Facing", value: "West" },
      { label: "Possession", value: "Dec 2027" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Modern gated high-rise residential towers in Kokapet, Hyderabad, at sunset: layered balconies, landscaped podium garden with a pool in front, warm lit windows, clear sky with soft clouds.",
    image: "/properties/property-3.jpg",
    focal: "center 40%"
  },
  {
    id: 4,
    location: "Gachibowli, Hyderabad",
    city: "Gachibowli",
    name: "Gachibowli\nGlass Residences",
    type: "apartment",
    subtype: "Smart apartment",
    status: "new-launch",
    possession: "Jun 2028",
    featured: false,
    priceCr: 3.6,
    area: 2100,
    areaUnit: "sq ft",
    beds: 3,
    baths: 3,
    facing: "North",
    tagline: "Connected glass-facade home next to Hyderabad's IT hub",
    description: "Smart-home apartments a short drive from the Financial District, with floor-to-ceiling glazing, co-working lounges and covered parking.",
    longDescription: "Tailored for tech executives and entrepreneurs, this contemporary glass-fronted tower sits minutes from Hyderabad's premier IT parks and corporate headquarters. High acoustic insulation and floor-to-ceiling low-E glazing keep interiors tranquil and naturally illuminated.\n\nAutomated lighting, climate controls, and integrated fiber infrastructure cater to seamless remote work. A dedicated residents' business center, rooftop fitness studio, and private cafe provide everyday convenience.",
    highlights: [
      "Walk to the Financial District",
      "Smart-home automation",
      "Co-working lounge on site"
    ],
    amenities: [
      "Smart home integration",
      "Co-working business hub",
      "Rooftop fitness studio",
      "Covered basement parking",
      "100% power backup",
      "On-site cafe & lounge"
    ],
    keyDetails: [
      { label: "Configuration", value: "3 BHK \u00B7 3 Baths" },
      { label: "Facing", value: "North" },
      { label: "Possession", value: "Jun 2028" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Sleek glass-fronted luxury apartment towers in Gachibowli, Hyderabad, at blue hour, reflective facade with warm interior lights, a manicured entrance plaza with water feature, slim modern towers in the distance.",
    image: "/properties/property-4.jpg",
    focal: "center 45%"
  },
  {
    id: 5,
    location: "Gandipet, Hyderabad",
    city: "Gandipet",
    name: "Himayat Sagar\nLake Farmhouse",
    type: "house",
    subtype: "Lake farmhouse",
    status: "ready",
    possession: "Ready to move",
    featured: true,
    priceCr: 9.5,
    area: 5600,
    areaUnit: "sq ft",
    beds: 5,
    baths: 5,
    facing: "East",
    tagline: "Private waterfront retreat on three acres of orchards",
    description: "A three-acre lake-facing farmhouse retreat with orchards, a plunge pool and a covered veranda built for long weekends away from the city.",
    longDescription: "Spanning three sprawling private acres facing the tranquil waters of Himayat Sagar, this rustic-modern farmhouse celebrates unhurried open-air living. Traditional shaded verandas and exposed local stone blend into manicured lawns and mature mango and guava orchards.\n\nA private plunge pool, outdoor wood-fired cooking area, and solar-supported infrastructure make weekend entertaining seamless, while keeping central Hyderabad under a comfortable 45-minute drive.",
    highlights: [
      "3 acres facing the lake",
      "Orchard and plunge pool",
      "Under an hour from the city"
    ],
    amenities: [
      "Plunge pool",
      "Organic mango orchard",
      "Borewell & solar setup",
      "Caretaker quarters",
      "Outdoor fire pit",
      "Covered dining veranda"
    ],
    keyDetails: [
      { label: "Configuration", value: "5 BHK \u00B7 5 Baths" },
      { label: "Facing", value: "East" },
      { label: "Possession", value: "Ready to move" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Luxury farmhouse retreat overlooking Himayat Sagar lake near Hyderabad at sunrise: a low single-storey home with a tiled sloping roof, stone walls and a wide veranda, a plunge pool, mango orchard, mist over the lake, granite hills beyond.",
    image: "/properties/property-5.jpg",
    focal: "center 50%"
  },
  {
    id: 6,
    location: "Narsingi, Hyderabad",
    city: "Narsingi",
    name: "Narsingi\nGarden Estate",
    type: "villa",
    subtype: "Gated-community villa",
    status: "under-construction",
    possession: "Mar 2027",
    featured: false,
    priceCr: 6.2,
    area: 4500,
    areaUnit: "sq ft",
    beds: 4,
    baths: 4,
    facing: "North-East",
    tagline: "Gated luxury villa with private landscaped garden",
    description: "A four-bedroom villa in a low-density gated community with private gardens, a clubhouse and a landscaped central park.",
    longDescription: "Located within an exclusive, low-density gated enclave in Narsingi, this triplex villa emphasizes natural ventilation, private courtyard gardens, and artisanal timber detailing. The master suite commands panoramic views over tree-lined internal avenues.\n\nWith zero surface vehicular traffic along central walkways, families benefit from safe pedestrian access to the community clubhouse, tennis courts, and children's activity zones. It combines neighborhood warmth with complete architectural sophistication.",
    highlights: [
      "Low-density gated community",
      "Private garden and car porch",
      "Clubhouse and central park"
    ],
    amenities: [
      "Private front & rear lawn",
      "Double-height foyer",
      "Community central park",
      "Clubhouse & gymnasium",
      "Covered 2-car porch",
      "Solar water heating"
    ],
    keyDetails: [
      { label: "Configuration", value: "4 BHK \u00B7 4 Baths" },
      { label: "Facing", value: "North-East" },
      { label: "Possession", value: "Mar 2027" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Premium gated-community villa in Narsingi, Hyderabad, at golden hour: modern tropical architecture with a pitched roof, wooden louvres, a manicured lawn, palm trees, a car porch and a quiet landscaped street.",
    image: "/properties/property-6.jpg",
    focal: "center 50%"
  },
  {
    id: 7,
    location: "Bachupally, Hyderabad",
    city: "Bachupally",
    name: "Bachupally\nUrban Nest",
    type: "apartment",
    subtype: "Compact 1 BHK",
    status: "new-launch",
    possession: "Sep 2028",
    featured: false,
    priceCr: 0.42,
    area: 640,
    areaUnit: "sq ft",
    beds: 1,
    baths: 1,
    facing: "North",
    tagline: "A smart first home with every essential close by",
    description: "A compact, well-planned 1 BHK in a gated community with a play area, a clubhouse and easy access to the IT corridor.",
    longDescription: "Designed for efficient modern living, this compact 1 BHK residence maximizes functional square footage with an open-plan living and dining layout. Large north-facing windows ensure ample daylight throughout the day while keeping utility costs low.\n\nSet within a secure gated community in Bachupally, residents benefit from shared amenities including an active clubhouse, children's play zones, and reliable power backup, all situated within easy commuting distance of Miyapur and the IT corridor.",
    highlights: [
      "Gated community with clubhouse",
      "Efficient 640 sq ft layout",
      "Easy access to the IT corridor"
    ],
    amenities: [
      "Clubhouse & gym",
      "Children's play area",
      "24/7 security & CCTV",
      "Covered car parking",
      "100% power backup",
      "Landscaped walking track"
    ],
    keyDetails: [
      { label: "Configuration", value: "1 BHK \u00B7 1 Bath" },
      { label: "Facing", value: "North" },
      { label: "Possession", value: "Sep 2028" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Modern mid-rise apartment tower in Bachupally, Hyderabad, late afternoon: clean white and warm-grey facade with timber-toned balconies, a landscaped courtyard with a small play area in front, young trees, soft clouds.",
    image: "/properties/property-7.jpg",
    focal: "center 50%"
  },
  {
    id: 8,
    location: "Kondapur, Hyderabad",
    city: "Kondapur",
    name: "Kondapur\nCourtyard Residences",
    type: "apartment",
    subtype: "2 BHK courtyard apartment",
    status: "ready",
    possession: "Ready to move",
    featured: false,
    priceCr: 0.92,
    area: 1180,
    areaUnit: "sq ft",
    beds: 2,
    baths: 2,
    facing: "East",
    tagline: "Move-in-ready 2 BHK around a landscaped courtyard",
    description: "A bright 2 BHK in a low-rise courtyard community, with a central garden, covered parking and daily needs within a short walk.",
    longDescription: "Situated in a low-density residential pocket of Kondapur, this move-in-ready two-bedroom home surrounds a quiet internal landscaped courtyard. The layout features cross-ventilated living areas, two well-proportioned bedrooms, and an east-facing balcony enjoying morning sun.\n\nThe development provides covered basement parking, comprehensive power backup, and gated perimeter security. Daily grocers, healthcare clinics, and schools are located within a short walking radius of the community gate.",
    highlights: [
      "Low-rise courtyard community",
      "Covered parking and power backup",
      "Walkable to daily needs"
    ],
    amenities: [
      "Landscaped central courtyard",
      "Covered basement parking",
      "24/7 power backup",
      "Intercom & gated security",
      "Rooftop terrace garden",
      "Rainwater harvesting"
    ],
    keyDetails: [
      { label: "Configuration", value: "2 BHK \u00B7 2 Bath" },
      { label: "Facing", value: "East" },
      { label: "Possession", value: "Ready to move" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Low-rise courtyard apartment community in Kondapur, Hyderabad, at dusk: four storeys, timber screens, a central landscaped courtyard with a shallow water feature, warm glowing windows, a deep blue sky.",
    image: "/properties/property-8.jpg",
    focal: "50% 50%"
  },
  {
    id: 9,
    location: "Manikonda, Hyderabad",
    city: "Manikonda",
    name: "Manikonda\nHeritage House",
    type: "house",
    subtype: "Independent house (G+1)",
    status: "ready",
    possession: "Ready to move",
    featured: false,
    priceCr: 2.8,
    area: 2400,
    areaUnit: "sq ft",
    beds: 3,
    baths: 4,
    facing: "North-East",
    tagline: "Independent two-storey home with a private courtyard",
    description: "A contemporary independent house with carved jaali screens, a private courtyard, a terrace garden and a car porch on a quiet residential street.",
    longDescription: "Built on an independent plot on a quiet residential street in Manikonda, this two-storey residence integrates traditional architectural elements like terracotta accents and carved jaali screens. The ground floor centers on a private open-to-sky courtyard bringing light into the dining hall.\n\nThe upper level features three en-suite bedrooms and opens onto a landscaped private terrace garden. Complete with a covered car porch and individual borewell connection, the property ensures complete independence minutes from Lanco Hills.",
    highlights: [
      "Independent G+1 house on its own plot",
      "Private courtyard and terrace garden",
      "Quiet residential street"
    ],
    amenities: [
      "Private internal courtyard",
      "Landscaped terrace garden",
      "Covered car porch",
      "Carved architectural jaali screens",
      "Borewell & municipal water",
      "Separate utility and laundry room"
    ],
    keyDetails: [
      { label: "Configuration", value: "3 BHK \u00B7 4 Bath" },
      { label: "Facing", value: "North-East" },
      { label: "Possession", value: "Ready to move" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Two-storey contemporary independent house in Manikonda, Hyderabad, morning light: carved jaali screen, terracotta and white plaster, a covered car porch, a mature neem tree, a small front garden, a quiet residential street.",
    image: "/properties/property-9.jpg",
    focal: "center 50%"
  },
  {
    id: 10,
    location: "Shadnagar, Hyderabad",
    city: "Shadnagar",
    name: "Shadnagar\nGreen Plots",
    type: "plot",
    subtype: "Gated plotted layout",
    status: "ready",
    possession: "Ready for registration",
    featured: false,
    priceCr: 0.38,
    area: 267,
    areaUnit: "sq yd",
    beds: null,
    baths: null,
    facing: "East",
    tagline: "Gated plots with avenue trees and wide roads",
    description: "A plotted community with 40 ft internal roads, avenue plantation, drainage and a gated entrance, ideal for building your own home or holding for the long term.",
    longDescription: "Located in the developing regional growth corridor of Shadnagar, this gated plotted community offers demarcated residential plots ready for immediate registration. The master plan features wide 40-foot blacktop internal roads, underground drainage, and electricity connections.\n\nAvenue plantations and landscaped green parks frame the perimeter, while a controlled entrance arch ensures round-the-clock security. The location offers straightforward connectivity to the Bengaluru highway and regional rail links.",
    highlights: [
      "40 ft internal roads",
      "Avenue plantation and parks",
      "Gated entrance with security"
    ],
    amenities: [
      "40-foot blacktop internal roads",
      "Underground drainage system",
      "Electricity line with streetlights",
      "Avenue plantation & green parks",
      "Gated entrance with security cabin",
      "Compound wall around layout"
    ],
    keyDetails: [
      { label: "Plot size", value: "267 sq yd" },
      { label: "Facing", value: "East" },
      { label: "Road width", value: "40 ft" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Wide view of a gated plotted development near Hyderabad at golden hour: demarcated residential plots with boundary stones, wide black-top roads with avenue trees, a plain gated entrance arch with no lettering, open green land and distant hills.",
    image: "/properties/property-10.jpg",
    focal: "center 55%"
  },
  {
    id: 11,
    location: "Madhapur, Hyderabad",
    city: "Madhapur",
    name: "Madhapur\nOffice Suites",
    type: "commercial",
    subtype: "Office suite",
    status: "ready",
    possession: "Ready to move",
    featured: false,
    priceCr: 0.95,
    area: 650,
    areaUnit: "sq ft",
    beds: null,
    baths: null,
    facing: "West",
    tagline: "Plug-and-play suites in the heart of the IT corridor",
    description: "Fitted office suites in a Grade-A building, with 24x7 access, power backup, ample parking and a lobby built to host clients.",
    longDescription: "Positioned in the prime commercial sector of Madhapur, this 650 sq ft fitted office suite provides turnkey infrastructure within a certified Grade-A commercial tower. The unit features central air conditioning, high-speed data cabling, and generous natural light from west-facing acoustic glazing.\n\nBuilding infrastructure includes high-speed passenger elevators, 100% DG power redundancy, professional reception management, and multi-level vehicular parking. Metro stations and dining options are within immediate walking range.",
    highlights: [
      "Grade-A building in the IT corridor",
      "Power backup and ample parking",
      "Ready for immediate fit-out"
    ],
    amenities: [
      "Grade-A reception lobby",
      "100% DG power backup",
      "High-speed passenger elevators",
      "Central HVAC system",
      "Multi-tier security access control",
      "Reserved basement car parking"
    ],
    keyDetails: [
      { label: "Type", value: "Office suite" },
      { label: "Floor", value: "7th of 14" },
      { label: "Possession", value: "Ready" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Mid-rise glass-and-aluminium Grade-A office building in Madhapur, Hyderabad, at blue hour: reflective facade lit from within, a landscaped plaza with a water feature in front, modern and calm.",
    image: "/properties/property-11.jpg",
    focal: "50% 50%"
  },
  {
    id: 12,
    location: "Banjara Hills, Hyderabad",
    city: "Banjara Hills",
    name: "Banjara Hills\nRetail Showroom",
    type: "commercial",
    subtype: "Street-front showroom",
    status: "under-construction",
    possession: "Dec 2027",
    featured: true,
    priceCr: 7.8,
    area: 3000,
    areaUnit: "sq ft",
    beds: null,
    baths: null,
    facing: "North",
    tagline: "A double-height showroom on a premium high street",
    description: "A double-height retail showroom with a 40 ft frontage, dedicated parking and steady footfall from the surrounding residential neighbourhoods.",
    longDescription: "Prominently positioned along a main commercial avenue in Banjara Hills, this street-front commercial space features a striking 40-foot double-height glass facade. The expansive layout offers uninterrupted floor area optimized for flagship retail, luxury lifestyle brands, or private banking lounges.\n\nThe development features dedicated valet and customer parking bays, service access loading docks, and heavy-duty three-phase electrical connections. Surrounding prime residential enclaves ensure consistent high-net-worth patronage.",
    highlights: [
      "40 ft street frontage",
      "Double-height glass facade",
      "Dedicated customer parking"
    ],
    amenities: [
      "40-foot double-height glass frontage",
      "Dedicated surface & valet parking",
      "Three-phase high-load power connection",
      "Service loading bay & goods lift",
      "Central air conditioning provision",
      "24/7 security & fire safety systems"
    ],
    keyDetails: [
      { label: "Type", value: "Retail showroom" },
      { label: "Frontage", value: "40 ft" },
      { label: "Possession", value: "Dec 2027" }
    ],
    reraId: "RERA ID to be added",
    imagePrompt: "Premium street-front retail showroom in Banjara Hills, Hyderabad, at dusk: double-height glass storefront with warm interior lighting, stone cladding, a tree-lined high street, no brand names or signage.",
    image: "/properties/property-12.jpg",
    focal: "50% 50%"
  }
];

export default properties;
