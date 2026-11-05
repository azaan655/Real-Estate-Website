import { rentals, Rental } from './rentals';

export interface RentalProject {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  amenities: [string, string, string, string, string, string];
  image: string;
  unitIds: string[];
}

export const rentalProjects: RentalProject[] = [
  {
    id: 'kukatpally-metro-heights',
    name: 'Kukatpally Metro Heights',
    location: 'Kukatpally, Hyderabad',
    tagline: 'Compact homes beside the metro',
    description:
      'A mid-rise residential community featuring well-ventilated compact apartments with round-the-clock security and elevator access. The complex offers direct walking proximity to metro connections, everyday retail, and local services.',
    amenities: [
      'Elevator Access',
      'Power Backup',
      '24x7 Security',
      'Rainwater Harvesting',
      'Covered Parking',
      'Municipal Water',
    ],
    image: '/rentals/rental-1.jpg',
    unitIds: ['R1'],
  },
  {
    id: 'madhapur-skyline-towers',
    name: 'Madhapur Skyline Towers',
    location: 'Madhapur, Hyderabad',
    tagline: 'High-rise living beside the IT hub',
    description:
      'A contemporary 24-storey high-rise tower providing panoramic skyline vistas and comprehensive shared amenities including a fitness studio and rooftop pool. Located minutes from major Hitec City tech campuses and retail hubs.',
    amenities: [
      'Rooftop Swimming Pool',
      'Fitness Studio',
      'High-Speed Elevators',
      'Basement Car Parking',
      '100% Power Backup',
      '24x7 CCTV Security',
    ],
    image: '/rentals/rental-2.jpg',
    unitIds: ['R2', 'R4'],
  },
  {
    id: 'kondapur-courtyard-homes',
    name: 'Kondapur Courtyard Homes',
    location: 'Kondapur, Hyderabad',
    tagline: 'Green courtyards in a walkable neighbourhood',
    description:
      'A low-rise residential enclave centered around a tranquil landscaped courtyard with mature shade trees and benches. The pet-friendly society ensures quiet living within walking distance of prime Kondapur amenities.',
    amenities: [
      'Central Landscaped Garden',
      'Pet-Friendly Society',
      'Dedicated Car Bays',
      'Intercom Facility',
      'Rainwater Harvesting',
      'Borewell & Water Supply',
    ],
    image: '/rentals/rental-3.jpg',
    unitIds: ['R3'],
  },
  {
    id: 'kokapet-crest-residences',
    name: 'Kokapet Crest Residences',
    location: 'Kokapet, Hyderabad',
    tagline: 'Clubhouse living near the Outer Ring Road',
    description:
      'A premier gated high-rise community comprising modern residences with expansive balconies and private terrace decks. Residents enjoy a full-scale clubhouse, swimming pool, and immediate connectivity to the Outer Ring Road.',
    amenities: [
      'Luxury Clubhouse',
      'Swimming Pool',
      'Children Play Park',
      'Tennis Court',
      'Multi-Level Parking',
      '24x7 Gated Security',
    ],
    image: '/rentals/rental-5.jpg',
    unitIds: ['R5', 'R6'],
  },
  {
    id: 'gachibowli-estate-villas',
    name: 'Gachibowli Estate Villas',
    location: 'Gachibowli, Hyderabad',
    tagline: 'Gated villa estate with a private clubhouse',
    description:
      'An exclusive gated enclave of contemporary four-bedroom triplex villas featuring manicured private gardens and double-height living areas. The community provides a private clubhouse, shared swimming pool, and round-the-clock security.',
    amenities: [
      'Private Gardens',
      'Estate Clubhouse',
      'Shared Swimming Pool',
      'Tennis Court',
      'Three-Car Parking',
      'Round-the-Clock Security',
    ],
    image: '/rentals/rental-9.jpg',
    unitIds: ['R9'],
  },
  {
    id: 'bachupally-garden-villas',
    name: 'Bachupally Garden Villas',
    location: 'Bachupally, Hyderabad',
    tagline: 'Garden villas on quiet, low-density streets',
    description:
      'A peaceful gated community of two-storey garden villas with expansive front verandas and lush private lawns. Features low-density tree-lined avenues, a resident clubhouse, and convenient connectivity to regional schools.',
    amenities: [
      'Private Front Lawns',
      'Resident Clubhouse',
      'Gymnasium',
      'Children Play Park',
      'Two-Car Covered Bays',
      'Gated Entry with CCTV',
    ],
    image: '/rentals/rental-10.jpg',
    unitIds: ['R10'],
  },
];

export const unitsFor = (project: RentalProject): Rental[] => {
  return rentals.filter((r) => r.project === project.name);
};

export const rentRange = (project: RentalProject): [number, number] => {
  const units = unitsFor(project);
  if (units.length === 0) return [0, 0];
  const rents = units.map((u) => u.rent);
  return [Math.min(...rents), Math.max(...rents)];
};

export default rentalProjects;

