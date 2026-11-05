import { RUPEE, DOT } from '../lib/money';

export type RentalType = 'flat' | 'house' | 'villa' | 'commercial' | 'office';
export type RentalFurnishing = 'Unfurnished' | 'Semi-furnished' | 'Furnished' | 'Bare shell' | 'Fitted';
export type RentalTenant = 'Family' | 'Bachelors' | 'Company';
export type RentBucket = 'under-10000' | '10000-to-25000' | '25000-to-50000' | 'above-50000';
export type BhkBucketRent = '1-bhk-for-rent' | '2-bhk-for-rent' | '3-bhk-for-rent' | '4-bhk-for-rent' | 'none';

export interface RentalKeyDetail {
  label: string;
  value: string;
}

export interface RentalView {
  src: string;
  label: string;
  alt: string;
  imagePrompt?: string;
}

export interface Rental {
  id: string;
  name: string; // contains "\n"
  location: string;
  type: RentalType;
  subtype: string;
  project?: string;
  rent: number; // rupees per month
  depositMonths: number;
  maintenance: number; // rupees per month; 0 means included
  furnishing: RentalFurnishing;
  availableFrom: string; // "Immediate" or a short date such as "Dec 1"
  tenants: RentalTenant[];
  pets: boolean;
  parking: string;
  floor: string;
  facing: string;
  area: number;
  areaUnit: 'sq ft';
  beds: number | null;
  baths: number | null;
  leaseNote: string;
  tagline: string;
  description: string;
  highlights: [string, string, string];
  longDescription: string;
  amenities: [string, string, string, string, string, string];
  keyDetails?: RentalKeyDetail[];
  image: string;
  focal: string;
  imagePrompt: string;
  views?: RentalView[];
}

export const rentBucket = (r: Rental): RentBucket => {
  if (r.rent < 10000) return 'under-10000';
  if (r.rent < 25000) return '10000-to-25000';
  if (r.rent < 50000) return '25000-to-50000';
  return 'above-50000';
};

export const bhkBucketRent = (r: Rental): BhkBucketRent => {
  if (r.beds === 1) return '1-bhk-for-rent';
  if (r.beds === 2) return '2-bhk-for-rent';
  if (r.beds === 3) return '3-bhk-for-rent';
  if (r.beds === 4) return '4-bhk-for-rent';
  return 'none';
};

export const deposit = (r: Rental): number => {
  return r.rent * r.depositMonths;
};

export const moveInCost = (r: Rental): number => {
  return r.rent + deposit(r);
};

export const getKeyDetails = (r: Rental): RentalKeyDetail[] => {
  if (r.keyDetails && r.keyDetails.length > 0) {
    return r.keyDetails;
  }
  return [
    { label: 'Configuration', value: `${r.beds} BHK ${DOT} ${r.baths} Bath` },
    { label: 'Furnishing', value: r.furnishing },
    { label: 'Available', value: r.availableFrom },
  ];
};

export const formatRentMonthly = (n: number): string => {
  return RUPEE + n.toLocaleString('en-IN');
};

export const searchText = (r: Rental): string => {
  return (
    r.name.replace(/\n/g, ' ') +
    ' ' +
    r.location +
    ' ' +
    r.subtype +
    ' ' +
    (r.project || '')
  ).toLowerCase();
};

const RENTAL_VIEWS_MAP: Record<string, RentalView[]> = {
  R1: [
    {
      src: '/rentals/rental-1.jpg',
      label: 'Exterior',
      alt: 'Metro Heights Compact Nest exterior',
      imagePrompt: 'Architectural exterior photograph of Metro Heights apartment complex in Kukatpally, cream and terracotta facade, tidy mid-rise building, warm natural light, straight verticals, no people, no text.',
    },
    {
      src: '/rentals/rental-1-b.webp',
      label: 'Living room',
      alt: 'Cream and terracotta living room',
      imagePrompt: 'Property Bible: Kukatpally 1 BHK, cream and terracotta, tidy, unfurnished. Clean, bare, well-lit living room, polished vitrified tile flooring, warm afternoon light through balcony doorway, no furniture, no people, no text.',
    },
    {
      src: '/rentals/rental-1-c.webp',
      label: 'Bedroom',
      alt: 'Tidy unfurnished bedroom',
      imagePrompt: 'Property Bible: Kukatpally 1 BHK, cream and terracotta, tidy, unfurnished. Clean unfurnished bedroom, pale cream walls with terracotta accent, large window with natural sunlight, empty space, no people, no text.',
    },
    {
      src: '/rentals/rental-1-d.webp',
      label: 'Kitchen',
      alt: 'Kitchen with granite counter',
      imagePrompt: 'Property Bible: Kukatpally 1 BHK, cream and terracotta, tidy, unfurnished. Clean unfurnished kitchen, polished black granite platform, stainless steel sink, terracotta ceramic wall tiles, no people, no text.',
    },
  ],
  R2: [
    {
      src: '/rentals/rental-2.jpg',
      label: 'Exterior',
      alt: 'Cyber View Studio Tower exterior',
      imagePrompt: 'Modern glass and warm grey residential studio high-rise tower in Madhapur, clean architectural lines, clear blue sky, no people, no text.',
    },
    {
      src: '/rentals/rental-2-b.webp',
      label: 'Living area',
      alt: 'Warm grey furnished living area',
      imagePrompt: 'Property Bible: Madhapur furnished 1 BHK, glass, warm grey, rooftop pool tower. Fully furnished modern living area, sleek grey sofa, minimalist timber coffee table, warm ambient lighting, no people, no text.',
    },
    {
      src: '/rentals/rental-2-c.webp',
      label: 'Bedroom',
      alt: 'Furnished studio bedroom',
      imagePrompt: 'Property Bible: Madhapur furnished 1 BHK, glass, warm grey, rooftop pool tower. Furnished bedroom with integrated wardrobe, upholstered bed frame in warm charcoal fabric, floor-to-ceiling window, no people, no text.',
    },
    {
      src: '/rentals/rental-2-d.webp',
      label: 'Rooftop pool',
      alt: 'Rooftop infinity pool with city view',
      imagePrompt: 'Property Bible: Madhapur furnished 1 BHK, glass, warm grey, rooftop pool tower. Luxurious rooftop swimming pool overlooking Hitec City skyline, glass safety balustrade, wooden sun loungers, golden hour, no people, no text.',
    },
  ],
  R3: [
    {
      src: '/rentals/rental-3.jpg',
      label: 'Exterior',
      alt: 'Botanica Enclave gated community exterior',
      imagePrompt: 'Lush gated community in Kondapur, timber accents, manicured landscape and courtyard entrance, warm natural lighting, no people, no text.',
    },
    {
      src: '/rentals/rental-3-b.webp',
      label: 'Living room',
      alt: 'Timber and garden themed living room',
      imagePrompt: 'Property Bible: Kondapur 2 BHK, garden, timber, courtyard, semi-furnished. Semi-furnished living room opening onto a green courtyard, warm oak veneer feature wall, sliding glass doors, natural light, no people, no text.',
    },
    {
      src: '/rentals/rental-3-c.webp',
      label: 'Bedroom',
      alt: 'Semi-furnished bedroom with wooden wardrobes',
      imagePrompt: 'Property Bible: Kondapur 2 BHK, garden, timber, courtyard, semi-furnished. Semi-furnished bedroom with fitted floor-to-ceiling timber wardrobes, light timber finish flooring, soft daylight, no people, no text.',
    },
    {
      src: '/rentals/rental-3-d.webp',
      label: 'Kitchen',
      alt: 'Modular timber kitchen',
      imagePrompt: 'Property Bible: Kondapur 2 BHK, garden, timber, courtyard, semi-furnished. Modular kitchen with warm oak cabinet fronts, quartz countertop, recessed ceiling spotlights, window overlooking garden foliage, no people, no text.',
    },
  ],
  R4: [
    {
      src: '/rentals/rental-4.jpg',
      label: 'Living room',
      alt: 'High floor living room with skyline view',
      imagePrompt: 'Property Bible: Madhapur 2 BHK high floor, skyline views, semi-furnished. High floor living room with expansive skyline view through wide panoramic windows, semi-furnished, sleek finishes, no people, no text.',
    },
    {
      src: '/rentals/rental-4-b.webp',
      label: 'Bedroom',
      alt: 'Semi-furnished master bedroom',
      imagePrompt: 'Property Bible: Madhapur 2 BHK high floor, skyline views, semi-furnished. Bright master bedroom with built-in minimalist wardrobes, corner glass window framing the Hyderabad skyline, no people, no text.',
    },
    {
      src: '/rentals/rental-4-c.webp',
      label: 'Kitchen',
      alt: 'Modern modular kitchen',
      imagePrompt: 'Property Bible: Madhapur 2 BHK high floor, skyline views, semi-furnished. Streamlined semi-furnished kitchen with matte grey cabinetry, white quartz worktop, stainless steel chimney, soft morning light, no people, no text.',
    },
    {
      src: '/rentals/rental-4-d.webp',
      label: 'Tower exterior',
      alt: 'Tower exterior',
      imagePrompt: 'Property Bible: Madhapur 2 BHK high floor, skyline views, semi-furnished. Impressive architectural low-angle view of the contemporary high-rise residential tower in Madhapur against blue sky, no people, no text.',
    },
  ],
  R5: [
    {
      src: '/rentals/rental-5.jpg',
      label: 'Exterior',
      alt: 'One Kokapet high-rise exterior',
      imagePrompt: 'High-end luxury residential skyscraper in Kokapet with landscaped driveway, water fountain, and manicured green lawns, no people, no text.',
    },
    {
      src: '/rentals/rental-5-b.webp',
      label: 'Living room',
      alt: 'Spacious 3 BHK living room',
      imagePrompt: 'Property Bible: Kokapet 3 BHK, clubhouse high-rise, semi-furnished. Grand semi-furnished living hall with large ivory Italian marble slabs, deep covered balcony with glass railing, airy atmosphere, no people, no text.',
    },
    {
      src: '/rentals/rental-5-c.webp',
      label: 'Bedroom',
      alt: 'Master bedroom with balcony',
      imagePrompt: 'Property Bible: Kokapet 3 BHK, clubhouse high-rise, semi-furnished. Spacious master bedroom with floor-to-ceiling wardrobes in champagne laminate, glass door leading to private balcony, no people, no text.',
    },
    {
      src: '/rentals/rental-5-d.webp',
      label: 'Clubhouse pool',
      alt: 'Clubhouse swimming pool',
      imagePrompt: 'Property Bible: Kokapet 3 BHK, clubhouse high-rise, semi-furnished. Resort-grade clubhouse swimming pool with turquoise water, poolside daybeds under timber pergolas, palm trees, no people, no text.',
    },
  ],
  R6: [
    {
      src: '/rentals/rental-6.jpg',
      label: 'Living room',
      alt: 'Marble floor sky home living room',
      imagePrompt: 'Property Bible: Kokapet sky home, marble, furnished, terrace deck. Lavishly furnished double-height penthouse living room with imported Statuario marble flooring, designer brass chandelier, no people, no text.',
    },
    {
      src: '/rentals/rental-6-b.webp',
      label: 'Terrace deck',
      alt: 'Terrace deck',
      imagePrompt: 'Property Bible: Kokapet sky home, marble, furnished, terrace deck. Private outdoor sky terrace with teak decking, glass perimeter parapet, outdoor lounge seating, overlooking city lake, no people, no text.',
    },
    {
      src: '/rentals/rental-6-c.webp',
      label: 'Master bedroom',
      alt: 'Master bedroom suite',
      imagePrompt: 'Property Bible: Kokapet sky home, marble, furnished, terrace deck. Ultra-luxurious furnished master suite with king-size designer bed, warm mood lighting, silk wall panels, panoramic vistas, no people, no text.',
    },
    {
      src: '/rentals/rental-6-d.webp',
      label: 'Tower exterior',
      alt: 'Tower exterior',
      imagePrompt: 'Property Bible: Kokapet sky home, marble, furnished, terrace deck. Sleek sculptural glass and steel skyscraper reaching into the dusk sky, illuminated crown, no people, no text.',
    },
  ],
  R7: [
    {
      src: '/rentals/rental-7.jpg',
      label: 'Exterior',
      alt: 'Whitewashed independent house exterior',
      imagePrompt: 'Charming independent villa in Manikonda with pristine whitewashed walls, solid teakwood front door, private entrance gate and landscaped front garden, no people, no text.',
    },
    {
      src: '/rentals/rental-7-b.webp',
      label: 'Living room',
      alt: 'Living room with wooden door',
      imagePrompt: 'Property Bible: Manikonda independent house, whitewash, wood door, courtyard, unfurnished. Clean unfurnished living room with high ceilings, exposed timber doorframe, polished stone floor, abundant natural light, no people, no text.',
    },
    {
      src: '/rentals/rental-7-c.webp',
      label: 'Courtyard',
      alt: 'Inner courtyard',
      imagePrompt: 'Property Bible: Manikonda independent house, whitewash, wood door, courtyard, unfurnished. Open-to-sky central courtyard with white pebble border, potted frangipani plant, terracotta floor tiles, soft daylight, no people, no text.',
    },
    {
      src: '/rentals/rental-7-d.webp',
      label: 'Bedroom',
      alt: 'Quiet bedroom',
      imagePrompt: 'Property Bible: Manikonda independent house, whitewash, wood door, courtyard, unfurnished. Unfurnished airy ground-floor bedroom, whitewashed walls, large wooden window looking out to the courtyard, no people, no text.',
    },
  ],
  R8: [
    {
      src: '/rentals/rental-8.jpg',
      label: 'Exterior',
      alt: 'Jubilee Hills bungalow floor facade',
      imagePrompt: 'Stately residential bungalow in Jubilee Hills, stone cladding, flowering crimson gulmohar tree overhead, private paved porch, no people, no text.',
    },
    {
      src: '/rentals/rental-8-b.webp',
      label: 'Living room',
      alt: 'Spacious living room',
      imagePrompt: 'Property Bible: Jubilee Hills bungalow floor, pergola, gulmohar, semi-furnished. Generous semi-furnished drawing room with wooden ceiling beams, wide French windows looking out onto the garden pergola, no people, no text.',
    },
    {
      src: '/rentals/rental-8-c.webp',
      label: 'Bedroom',
      alt: 'Semi-furnished bedroom suite',
      imagePrompt: 'Property Bible: Jubilee Hills bungalow floor, pergola, gulmohar, semi-furnished. Expansive bedroom with polished hardwood flooring, built-in teak wardrobe cabinetry, gentle garden breeze, no people, no text.',
    },
    {
      src: '/rentals/rental-8-d.webp',
      label: 'Garden',
      alt: 'Garden and pergola',
      imagePrompt: 'Property Bible: Jubilee Hills bungalow floor, pergola, gulmohar, semi-furnished. Lush private garden with blooming gulmohar canopy, rustic stone garden bench, timber pergola draped with bougainvillea, no people, no text.',
    },
  ],
  R9: [
    {
      src: '/rentals/rental-9.jpg',
      label: 'Exterior',
      alt: 'Gachibowli estate villa exterior',
      imagePrompt: 'Magnificent contemporary estate villa in Gachibowli with double-height glass facade, travertine stone portal, and immaculate front lawn, no people, no text.',
    },
    {
      src: '/rentals/rental-9-b.webp',
      label: 'Living room',
      alt: 'Double-height glass living room',
      imagePrompt: 'Property Bible: Gachibowli estate villa, double-height glass, furnished. Grand double-height living room with 20-foot glass walls, bespoke contemporary furnishings in neutral tones, floating staircase, no people, no text.',
    },
    {
      src: '/rentals/rental-9-c.webp',
      label: 'Pool',
      alt: 'Private swimming pool',
      imagePrompt: 'Property Bible: Gachibowli estate villa, double-height glass, furnished. Private sunken courtyard pool with turquoise mosaic tiles, stone sun deck, minimalist water feature spilling into pool, no people, no text.',
    },
    {
      src: '/rentals/rental-9-d.webp',
      label: 'Master bedroom',
      alt: 'Furnished master bedroom',
      imagePrompt: 'Property Bible: Gachibowli estate villa, double-height glass, furnished. Opulent furnished master bedroom suite with private terrace access, custom headboard wall in walnut and brass, plush rug, no people, no text.',
    },
  ],
  R10: [
    {
      src: '/rentals/rental-10.jpg',
      label: 'Exterior',
      alt: 'Bachupally garden villa exterior',
      imagePrompt: 'Picturesque modern villa in Bachupally with pitched terracotta-tiled roof, broad covered veranda, and lush green lawn, warm sunlight, no people, no text.',
    },
    {
      src: '/rentals/rental-10-b.webp',
      label: 'Living room',
      alt: 'Living room with veranda access',
      imagePrompt: 'Property Bible: Bachupally garden villa, pitched roof, veranda, semi-furnished. Cozy semi-furnished living room with warm wooden details, wide double doors opening out to the garden veranda, natural daylight, no people, no text.',
    },
    {
      src: '/rentals/rental-10-c.webp',
      label: 'Garden',
      alt: 'Private garden and lawn',
      imagePrompt: 'Property Bible: Bachupally garden villa, pitched roof, veranda, semi-furnished. Landscaped green garden with flowering frangipani, paved stepping stones, wooden patio furniture, peaceful morning light, no people, no text.',
    },
    {
      src: '/rentals/rental-10-d.webp',
      label: 'Bedroom',
      alt: 'Airy bedroom with sloped ceiling',
      imagePrompt: 'Property Bible: Bachupally garden villa, pitched roof, veranda, semi-furnished. Semi-furnished bedroom with exposed wooden ceiling trusses, built-in wardrobes, private balcony overlooking the garden, no people, no text.',
    },
  ],
  R11: [
    {
      src: '/rentals/rental-11.jpg',
      label: 'Street view',
      alt: 'Jubilee Hills retail unit street view',
      imagePrompt: 'Prestigious retail storefront on Road No 36 Jubilee Hills, polished granite columns, expansive frameless glass display windows, wide sidewalk, no people, no text.',
    },
    {
      src: '/rentals/rental-11-b.webp',
      label: 'Interior',
      alt: 'Bare shell commercial interior',
      imagePrompt: 'Property Bible: Jubilee Hills retail unit, glass front, stone, bare shell. Raw bare-shell commercial retail showroom floor with industrial polished concrete finish, exposed ceiling ducting, vast open floorplan, no people, no text.',
    },
    {
      src: '/rentals/rental-11-c.webp',
      label: 'Frontage detail',
      alt: 'Frontage detail and stone portal',
      imagePrompt: 'Property Bible: Jubilee Hills retail unit, glass front, stone, bare shell. Architectural detail of the floor-to-ceiling glass boutique frontage, clean brushed steel framing, stone lintel, warm storefront lighting, no people, no text.',
    },
    {
      src: '/rentals/rental-11-d.webp',
      label: 'Neighbourhood street',
      alt: 'Neighbourhood street in Jubilee Hills',
      imagePrompt: 'Property Bible: Jubilee Hills retail unit, glass front, stone, bare shell. Tree-lined luxury shopping avenue in Jubilee Hills with designer storefronts and wide paved sidewalks, afternoon sunlight, no people, no text.',
    },
  ],
  R12: [
    {
      src: '/rentals/rental-12.jpg',
      label: 'Workspace',
      alt: 'Kondapur fitted office workspace',
      imagePrompt: 'Property Bible: Kondapur fitted office, glass partitions, grey and oak. Fully fitted corporate office floor with modern ergonomic workstations, acoustic felt panels, linear LED pendant lighting, no people, no text.',
    },
    {
      src: '/rentals/rental-12-b.webp',
      label: 'Building exterior',
      alt: 'Grade A corporate commercial glass tower',
      imagePrompt: 'Property Bible: Kondapur fitted office, glass partitions, grey and oak. Landmark Grade A corporate IT commercial park in Kondapur with reflective blue-tinted glass curtain wall and landscaped entry plaza, no people, no text.',
    },
    {
      src: '/rentals/rental-12-c.webp',
      label: 'Pantry',
      alt: 'Executive cafeteria and pantry',
      imagePrompt: 'Property Bible: Kondapur fitted office, glass partitions, grey and oak. Sleek modern office pantry and breakout area with oak breakfast bar, grey quartz counter, designer bar stools, espresso machine, no people, no text.',
    },
    {
      src: '/rentals/rental-12-d.webp',
      label: 'Reception',
      alt: 'Minimalist oak and marble entrance reception',
      imagePrompt: 'Property Bible: Kondapur fitted office, glass partitions, grey and oak. Elegant corporate reception lobby with natural oak fluted wall panels, monolithic grey marble reception desk, indirect cove lighting, no people, no text.',
    },
  ],
};

export const rentalViews = (r: Rental): RentalView[] => {
  if (r.views && r.views.length >= 4) {
    return r.views;
  }
  const mapped = RENTAL_VIEWS_MAP[r.id];
  if (mapped && mapped.length >= 4) {
    return mapped;
  }
  const baseName = r.image.replace(/(\.jpg|\.webp)$/, '');
  return [
    { src: r.image, label: 'Exterior', alt: r.name.replace('\n', ' ') + ' exterior' },
    { src: `${baseName}-b.webp`, label: 'Living room', alt: r.name.replace('\n', ' ') + ' living area' },
    { src: `${baseName}-c.webp`, label: 'Bedroom', alt: r.name.replace('\n', ' ') + ' bedroom' },
    { src: `${baseName}-d.webp`, label: 'Details', alt: r.name.replace('\n', ' ') + ' interior' },
  ];
};

export const rentals: Rental[] = [
  {
    id: 'R1',
    name: 'Metro Heights\nCompact Nest',
    location: 'Kukatpally, Hyderabad',
    type: 'flat',
    subtype: '1 BHK apartment',
    project: 'Kukatpally Metro Heights',
    rent: 9500,
    depositMonths: 2,
    maintenance: 0,
    furnishing: 'Unfurnished',
    availableFrom: 'Immediate',
    tenants: ['Family', 'Bachelors'],
    pets: false,
    parking: 'Bike',
    floor: '4th of 9',
    facing: 'East',
    area: 600,
    areaUnit: 'sq ft',
    beds: 1,
    baths: 1,
    leaseNote: 'Minimum 11 months',
    tagline: 'A tidy 1 BHK a short walk from the metro',
    description:
      'A bright, well-kept 1 BHK in a gated community with a lift, power backup and 24x7 security, a short walk from the metro and everyday shops.',
    highlights: [
      'Short walk to the metro',
      'Gated with lift and power backup',
      'Bike parking included',
    ],
    longDescription:
      'Positioned on the fourth floor of Kukatpally Metro Heights, this compact one-bedroom residence provides an efficient layout with natural light throughout the living area and bedroom. The flat includes an independent utility balcony and tiled flooring.\n\nThe gated building provides round-the-clock security personnel, a dedicated passenger elevator, and essential power backup. Residents benefit from quick walking access to the metro station and daily neighbourhood grocers.',
    amenities: [
      'Lift Access',
      '24x7 Security',
      'Power Backup',
      'Rainwater Harvesting',
      'Waste Disposal',
      'Water Supply',
    ],
    image: '/rentals/rental-1.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Mid-rise gated apartment block in Kukatpally, Hyderabad, soft morning light, cream and terracotta facade, tidy entrance with young trees, a metro viaduct softly visible in the distance, clean and welcoming.',
  },
  {
    id: 'R2',
    name: 'Skyline Towers\nFurnished Suite',
    location: 'Madhapur, Hyderabad',
    type: 'flat',
    subtype: '1 BHK furnished apartment',
    project: 'Madhapur Skyline Towers',
    rent: 18000,
    depositMonths: 3,
    maintenance: 0,
    furnishing: 'Furnished',
    availableFrom: 'Immediate',
    tenants: ['Family', 'Bachelors', 'Company'],
    pets: false,
    parking: 'Bike',
    floor: '11th of 24',
    facing: 'North',
    area: 520,
    areaUnit: 'sq ft',
    beds: 1,
    baths: 1,
    leaseNote: 'Minimum 11 months',
    tagline: 'Fully furnished 1 BHK, minutes from the IT hub',
    description:
      'A fully furnished 1 BHK on a high floor with city views, a gym and a pool in the building, ten minutes from the major IT parks.',
    highlights: [
      'Fully furnished and move-in ready',
      'Gym and pool in the building',
      'Minutes from the IT parks',
    ],
    longDescription:
      'Set high on the eleventh floor of Madhapur Skyline Towers, this fully furnished suite includes a queen bed, wardrobe units, living seating, and an equipped kitchen with standard appliances. Large windows overlook the surrounding Hitec City skyline.\n\nThe tower offers modern shared facilities including a fitness studio, swimming pool, high-speed passenger elevators, and covered two-wheeler parking. The property sits within ten minutes of major corporate offices and metro transit.',
    amenities: [
      'Swimming Pool',
      'Fitness Studio',
      'High-Speed Lifts',
      '24x7 Security',
      'Power Backup',
      'Visitor Parking',
    ],
    image: '/rentals/rental-2.jpg',
    focal: 'center 45%',
    imagePrompt:
      'High-rise residential tower in Madhapur, Hyderabad, at golden hour: glass balconies, a rooftop pool deck glowing, IT-park towers on the skyline, warm light.',
  },
  {
    id: 'R3',
    name: 'Courtyard Homes\nGarden Flat',
    location: 'Kondapur, Hyderabad',
    type: 'flat',
    subtype: '2 BHK apartment',
    project: 'Kondapur Courtyard Homes',
    rent: 24000,
    depositMonths: 3,
    maintenance: 1500,
    furnishing: 'Semi-furnished',
    availableFrom: 'Immediate',
    tenants: ['Family'],
    pets: true,
    parking: 'Car and bike',
    floor: '2nd of 4',
    facing: 'East',
    area: 1150,
    areaUnit: 'sq ft',
    beds: 2,
    baths: 2,
    leaseNote: 'Minimum 11 months',
    tagline: 'Garden-facing 2 BHK in a quiet courtyard community',
    description:
      'A bright 2 BHK in a low-rise courtyard community with a central garden, covered parking and daily needs within a short walk.',
    highlights: [
      'Garden-facing and quiet',
      'Low-rise courtyard community',
      'Pet-friendly society',
    ],
    longDescription:
      'Located on the second floor of a four-storey community, this two-bedroom home looks out onto a leafy central garden. The plan includes a semi-furnished modular kitchen, built-in bedroom wardrobes, and cross-ventilated living spaces with an east-facing balcony.\n\nKondapur Courtyard Homes maintains quiet paved walkways, dedicated car and two-wheeler parking, and rainwater harvesting. The society welcomes domestic pets and is walking distance from local schools and markets.',
    amenities: [
      'Central Garden',
      'Covered Car Parking',
      'Pet-Friendly',
      'Intercom Facility',
      '24x7 Security',
      'Borewell & Municipal Water',
    ],
    image: '/rentals/rental-3.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Low-rise courtyard apartment homes in Kondapur, Hyderabad, afternoon sun: garden-facing balconies, a lush central courtyard with mature trees and benches, quiet and green.',
  },
  {
    id: 'R4',
    name: 'Skyline Towers\nCity-View Flat',
    location: 'Madhapur, Hyderabad',
    type: 'flat',
    subtype: '2 BHK apartment',
    project: 'Madhapur Skyline Towers',
    rent: 32000,
    depositMonths: 3,
    maintenance: 2000,
    furnishing: 'Semi-furnished',
    availableFrom: 'Dec 1',
    tenants: ['Family', 'Bachelors', 'Company'],
    pets: false,
    parking: 'Car and bike',
    floor: '16th of 24',
    facing: 'North-East',
    area: 1250,
    areaUnit: 'sq ft',
    beds: 2,
    baths: 2,
    leaseNote: 'Minimum 11 months',
    tagline: 'A bright high-floor 2 BHK with skyline views',
    description:
      'A spacious 2 BHK on a high floor with floor-to-ceiling windows, a modular kitchen and access to the tower\'s gym and pool.',
    highlights: [
      'High floor with skyline views',
      'Modular kitchen and wardrobes',
      'Gym and pool access',
    ],
    longDescription:
      'Perched on the sixteenth floor, this two-bedroom residence commands expansive unobstructed vistas of Madhapur. The apartment features floor-to-ceiling glass in the living hall, a granite-topped modular kitchen, and custom built-in wardrobes in both bedrooms.\n\nResidents receive access to the tower clubhouse, heated swimming pool, fitness centre, and reserved basement parking. The complex offers round-the-clock security and swift road links to Inorbit Mall and the Durgam Cheruvu cable bridge.',
    amenities: [
      'Clubhouse',
      'Swimming Pool',
      'Gymnasium',
      'Basement Parking',
      '100% Power Backup',
      'High-Speed Elevators',
    ],
    image: '/rentals/rental-4.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Bright modern apartment living room with floor-to-ceiling windows and a balcony overlooking the Hyderabad skyline at golden hour: neutral sofa, wood floor, sheer curtains.',
  },
  {
    id: 'R5',
    name: 'Crest Residences\nFamily Flat',
    location: 'Kokapet, Hyderabad',
    type: 'flat',
    subtype: '3 BHK apartment',
    project: 'Kokapet Crest Residences',
    rent: 48000,
    depositMonths: 3,
    maintenance: 3500,
    furnishing: 'Semi-furnished',
    availableFrom: 'Immediate',
    tenants: ['Family', 'Company'],
    pets: true,
    parking: 'Two cars',
    floor: '9th of 22',
    facing: 'East',
    area: 1900,
    areaUnit: 'sq ft',
    beds: 3,
    baths: 3,
    leaseNote: 'Minimum 11 months',
    tagline: 'Spacious 3 BHK with a clubhouse and pool',
    description:
      'A roomy 3 BHK in a gated high-rise community with a clubhouse, a pool, a children\'s play area and quick access to the Outer Ring Road.',
    highlights: [
      'Clubhouse and pool',
      'Spacious 3 BHK layout',
      'Quick Outer Ring Road access',
    ],
    longDescription:
      'This ninth-floor three-bedroom apartment in Kokapet Crest Residences offers an expansive living and dining layout with vitrified tile flooring and wide balcony openings. The kitchen includes modular cabinets and an attached utility balcony.\n\nThe gated high-rise community provides a comprehensive clubhouse, swimming pool, children play park, and two reserved parking slots. The development connects directly to the Outer Ring Road, making Financial District offices easily accessible.',
    amenities: [
      'Clubhouse & Lounge',
      'Swimming Pool',
      'Children Play Area',
      'Two-Car Parking',
      'Tennis Court',
      '24x7 Security',
    ],
    image: '/rentals/rental-5.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Premium high-rise residential community in Kokapet, Hyderabad, at sunrise: layered terraces, clubhouse and pool in the foreground, manicured landscaping, clear sky.',
  },
  {
    id: 'R6',
    name: 'Crest Residences\nSky Home',
    location: 'Kokapet, Hyderabad',
    type: 'flat',
    subtype: '3 BHK sky home',
    project: 'Kokapet Crest Residences',
    rent: 68000,
    depositMonths: 3,
    maintenance: 0,
    furnishing: 'Furnished',
    availableFrom: 'Dec 15',
    tenants: ['Family', 'Company'],
    pets: true,
    parking: 'Two cars',
    floor: '21st of 22',
    facing: 'North',
    area: 2200,
    areaUnit: 'sq ft',
    beds: 3,
    baths: 4,
    leaseNote: 'Minimum 11 months',
    tagline: 'Fully furnished sky home with a terrace deck',
    description:
      'A fully furnished top-floor home with an open living and dining area, a terrace deck and panoramic views across the city.',
    highlights: [
      'Fully furnished top-floor home',
      'Terrace deck with city views',
      'Maintenance included in rent',
    ],
    longDescription:
      'Occupying the penultimate 21st floor of Crest Residences, this premium sky home features an open-plan lounge connecting to an expansive private terrace deck. Italian marble flooring, designer furnishings, and central air conditioning define the interior.\n\nAll three bedrooms feature en-suite bathrooms and walk-in dressing areas. Monthly rent includes community maintenance, giving full access to the luxury clubhouse, infinity pool, concierge service, and two covered car bays.',
    amenities: [
      'Private Terrace Deck',
      'Infinity Pool',
      'Clubhouse & Spa',
      'Concierge Service',
      'Two Covered Car Bays',
      'Full Power Backup',
    ],
    image: '/rentals/rental-6.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Luxurious furnished high-floor apartment: open living and dining, large glass doors opening to a terrace deck at dusk, warm lamps, marble floor, panoramic city lights.',
  },
  {
    id: 'R7',
    name: 'Manikonda\nCourtyard House',
    location: 'Manikonda, Hyderabad',
    type: 'house',
    subtype: 'Independent house (G+1)',
    rent: 22000,
    depositMonths: 3,
    maintenance: 0,
    furnishing: 'Unfurnished',
    availableFrom: 'Immediate',
    tenants: ['Family'],
    pets: true,
    parking: 'Car and bike',
    floor: 'Ground and first floor',
    facing: 'East',
    area: 1200,
    areaUnit: 'sq ft',
    beds: 2,
    baths: 2,
    leaseNote: 'Minimum 11 months',
    tagline: 'Independent house with a courtyard and parking',
    description:
      'A cosy independent house with a small courtyard, a terrace and covered parking on a quiet residential street.',
    highlights: [
      'Independent house, no shared walls',
      'Courtyard and terrace',
      'Covered parking',
    ],
    longDescription:
      'This standalone two-storey residence on a peaceful residential lane in Manikonda offers private living without shared walls. The ground level comprises a front verandah, living room, kitchen, and an open courtyard with a mature neem tree.\n\nThe upper level houses two private bedrooms and opens onto a tiled rooftop terrace. The property includes an independent borewell, dedicated covered parking, and pet-friendly outdoor spaces within easy reach of Lanco Hills.',
    amenities: [
      'Private Courtyard',
      'Rooftop Terrace',
      'Covered Car Porch',
      'Independent Borewell',
      'No Shared Walls',
      'Pet-Friendly',
    ],
    image: '/rentals/rental-7.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Cosy independent house in Manikonda, Hyderabad, at golden hour: whitewashed walls, a wooden door, a small courtyard with a tulsi platform and a mango tree, an open car porch.',
  },
  {
    id: 'R8',
    name: 'Jubilee Hills\nBungalow Floor',
    location: 'Jubilee Hills, Hyderabad',
    type: 'house',
    subtype: 'Independent floor',
    rent: 75000,
    depositMonths: 3,
    maintenance: 0,
    furnishing: 'Semi-furnished',
    availableFrom: 'Immediate',
    tenants: ['Family', 'Company'],
    pets: true,
    parking: 'Two cars',
    floor: 'First floor of a bungalow',
    facing: 'East',
    area: 2400,
    areaUnit: 'sq ft',
    beds: 3,
    baths: 3,
    leaseNote: 'Minimum 11 months',
    tagline: 'A private floor in a leafy Jubilee Hills bungalow',
    description:
      'A private first floor in a bungalow with its own entrance, a pergola terrace, mature gulmohar trees and secure parking.',
    highlights: [
      'Private entrance and terrace',
      'Leafy, quiet street',
      'Two-car parking',
    ],
    longDescription:
      'Occupying the complete first level of a stately Jubilee Hills residence, this independent floor features a private exterior staircase and dedicated arrival entrance. The floor plate includes expansive living rooms opening to a pergola terrace framed by mature gulmohar trees.\n\nThe three spacious bedrooms feature attached bathrooms and teak woodwork. The property provides two secure covered car parking bays, complete privacy, and a prestigious address walking distance from Jubilee Hills Club.',
    amenities: [
      'Private Entrance',
      'Pergola Terrace',
      'Two-Car Covered Parking',
      'Teak Woodwork',
      'Staff Quarters',
      '24x7 Security',
    ],
    image: '/rentals/rental-8.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Elegant bungalow in Jubilee Hills, Hyderabad, early morning: a first-floor terrace with a wooden pergola, mature gulmohar trees, soft mist, stone gate pillars with no lettering.',
  },
  {
    id: 'R9',
    name: 'Gachibowli\nEstate Villa',
    location: 'Gachibowli, Hyderabad',
    type: 'villa',
    subtype: '4 BHK gated villa',
    project: 'Gachibowli Estate Villas',
    rent: 110000,
    depositMonths: 3,
    maintenance: 8000,
    furnishing: 'Furnished',
    availableFrom: 'Jan 1',
    tenants: ['Family', 'Company'],
    pets: true,
    parking: 'Three cars',
    floor: 'Ground plus two floors',
    facing: 'East',
    area: 4200,
    areaUnit: 'sq ft',
    beds: 4,
    baths: 5,
    leaseNote: 'Minimum 11 months',
    tagline: 'Four-bedroom gated villa with a garden and pool access',
    description:
      'A fully furnished four-bedroom villa in a gated estate with a private garden, a shared pool, a clubhouse and round-the-clock security.',
    highlights: [
      'Gated estate with clubhouse',
      'Private garden and pool access',
      'Fully furnished',
    ],
    longDescription:
      'Situated in an exclusive gated villa enclave in Gachibowli, this four-bedroom triplex home spans 4,200 sq ft of bespoke furnished living. The ground floor connects a double-height living room to a manicured private lawn and dining veranda.\n\nThe upper levels include four expansive en-suite bedrooms, a family lounge, and a rooftop recreation deck. Estate amenities include a shared swimming pool, clubhouse, tennis court, three private car bays, and round-the-clock security.',
    amenities: [
      'Private Lawn',
      'Clubhouse & Pool',
      'Tennis Court',
      'Three-Car Parking',
      '24x7 Gated Security',
      'Full Power Backup',
    ],
    image: '/rentals/rental-9.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Contemporary four-bedroom villa in a gated estate in Gachibowli, Hyderabad, at sunset: double-height glazing, a landscaped lawn, a shallow pool, warm interior glow.',
  },
  {
    id: 'R10',
    name: 'Bachupally\nGarden Villa',
    location: 'Bachupally, Hyderabad',
    type: 'villa',
    subtype: '3 BHK garden villa',
    project: 'Bachupally Garden Villas',
    rent: 45000,
    depositMonths: 3,
    maintenance: 2500,
    furnishing: 'Semi-furnished',
    availableFrom: 'Immediate',
    tenants: ['Family'],
    pets: true,
    parking: 'Two cars',
    floor: 'Ground plus one floor',
    facing: 'North',
    area: 2800,
    areaUnit: 'sq ft',
    beds: 3,
    baths: 3,
    leaseNote: 'Minimum 11 months',
    tagline: 'A garden villa in a gated community with a clubhouse',
    description:
      'A charming three-bedroom villa with a wide veranda, a private lawn and a community clubhouse on a quiet street.',
    highlights: [
      'Private lawn and veranda',
      'Clubhouse in the community',
      'Quiet, low-density street',
    ],
    longDescription:
      'Set along a tranquil tree-lined avenue in Bachupally, this two-storey garden villa features an inviting wide veranda overlooking a private front lawn with frangipani trees. The interior provides three airy bedrooms with fitted wardrobes and large windows.\n\nThe gated community provides a resident clubhouse, gymnasium, children play park, and dedicated security gates. Two covered car parking spots and reliable municipal and borewell water supplies ensure everyday ease.',
    amenities: [
      'Private Front Lawn',
      'Clubhouse & Gym',
      'Children Play Park',
      'Two-Car Parking',
      '24x7 Security',
      'Wide Veranda',
    ],
    image: '/rentals/rental-10.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Charming three-bedroom garden villa in a gated community in Bachupally, Hyderabad, late afternoon: pitched roof, a wide veranda, a green lawn, frangipani trees, a quiet street.',
  },
  {
    id: 'R11',
    name: 'Jubilee Hills\nStreet-Front Shop',
    location: 'Jubilee Hills, Hyderabad',
    type: 'commercial',
    subtype: 'Street-front retail unit',
    rent: 95000,
    depositMonths: 6,
    maintenance: 0,
    furnishing: 'Bare shell',
    availableFrom: 'Immediate',
    tenants: ['Company'],
    pets: false,
    parking: 'Street and two cars',
    floor: 'Ground floor',
    facing: 'North',
    area: 900,
    areaUnit: 'sq ft',
    beds: null,
    baths: null,
    leaseNote: 'Minimum 11 months, 6-month lock-in',
    tagline: 'A glass-front retail unit on a premium high street',
    description:
      'A ground-floor retail unit with a 20 ft frontage, high ceilings and steady footfall from the surrounding residential neighbourhood.',
    highlights: [
      '20 ft street frontage',
      'High ceiling and glass front',
      'Strong residential footfall',
    ],
    keyDetails: [
      { label: 'Type', value: 'Retail unit' },
      { label: 'Frontage', value: '20 ft' },
      { label: 'Available', value: 'Immediate' },
    ],
    longDescription:
      'Prominently positioned on a premier Jubilee Hills commercial avenue, this ground-floor retail space offers a continuous 20-foot glass frontage with exceptional street visibility. The bare-shell layout features 14-foot slab-to-slab clear height suitable for bespoke retail fit-outs.\n\nThe premises include dedicated front parking for two customer vehicles plus roadside bays, three-phase commercial electrical supply, and drainage provisions. The unit draws affluent footfall from adjoining luxury residential enclaves.',
    amenities: [
      '20 ft Glass Frontage',
      '14 ft Clear Ceiling',
      'Customer Parking',
      'Three-Phase Power',
      'High Footfall Street',
      'Loading Access',
    ],
    image: '/rentals/rental-11.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Street-front retail unit on a tree-lined high street in Jubilee Hills, Hyderabad, at dusk: a glass shopfront with warm interior light, stone frontage, high ceiling, no signage.',
  },
  {
    id: 'R12',
    name: 'Kondapur\nFitted Office',
    location: 'Kondapur, Hyderabad',
    type: 'office',
    subtype: 'Fitted office suite',
    rent: 38000,
    depositMonths: 4,
    maintenance: 4000,
    furnishing: 'Fitted',
    availableFrom: 'Immediate',
    tenants: ['Company'],
    pets: false,
    parking: 'Two cars and four bikes',
    floor: '5th of 12',
    facing: 'West',
    area: 600,
    areaUnit: 'sq ft',
    beds: null,
    baths: null,
    leaseNote: 'Minimum 11 months, 6-month lock-in',
    tagline: 'A plug-and-play office for a team of 6 to 8',
    description:
      'A fitted office with glass partitions, a pantry, power backup and fibre-ready connectivity in a Grade-A building.',
    highlights: [
      'Fitted and ready to occupy',
      'Power backup and parking',
      'Fibre-ready building',
    ],
    keyDetails: [
      { label: 'Type', value: 'Fitted office' },
      { label: 'Floor', value: '5th of 12' },
      { label: 'Available', value: 'Immediate' },
    ],
    longDescription:
      'Situated on the fifth floor of a modern commercial tower in Kondapur, this plug-and-play office suite is fully fitted to seat 6 to 8 professionals. It incorporates acoustic glass partitions, a private meeting room, and a wet pantry.\n\nThe commercial complex provides 100% generator power backup, central air conditioning, dual high-speed elevators, and two reserved car spaces. The location offers quick transit connectivity to Hitec City and the outer IT ring.',
    amenities: [
      'Plug-and-Play Desks',
      'Private Meeting Room',
      'Wet Pantry',
      '100% Power Backup',
      'High-Speed Elevators',
      'Two Car Bays',
    ],
    image: '/rentals/rental-12.jpg',
    focal: 'center 45%',
    imagePrompt:
      'Modern fitted small office in Kondapur, Hyderabad, morning light: six desks with monitors off, glass partitions, a pantry corner, a window with a city view.',
  },
];

export default rentals;

