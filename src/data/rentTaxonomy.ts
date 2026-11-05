import { rentals, Rental, rentBucket, bhkBucketRent } from './rentals';
import { rentalProjects } from './rentalProjects';
import { RUPEE } from '../lib/money';

export interface RentTaxonomyOption {
  slug: string;
  label: string;
  route: string;
  badge?: string;
  groupKey: 'type' | 'budget' | 'bhk' | 'explore';
}

export interface RentTaxonomyGroup {
  key: 'type' | 'budget' | 'bhk' | 'explore';
  title: string;
  options: RentTaxonomyOption[];
}

export const RENT_TAXONOMY_GROUPS: RentTaxonomyGroup[] = [
  {
    key: 'type',
    title: 'Property Types',
    options: [
      { slug: 'flats-for-rent', label: 'Flats for Rent', route: '/rent/flats-for-rent', groupKey: 'type' },
      { slug: 'houses-for-rent', label: 'Houses for Rent', route: '/rent/houses-for-rent', groupKey: 'type' },
      { slug: 'villas-for-rent', label: 'Villas for Rent', route: '/rent/villas-for-rent', groupKey: 'type' },
      { slug: 'commercial-for-rent', label: 'Commercial for Rent', route: '/rent/commercial-for-rent', groupKey: 'type' },
      { slug: 'office-for-rent', label: 'Office for Rent', route: '/rent/office-for-rent', groupKey: 'type' },
    ],
  },
  {
    key: 'budget',
    title: 'Budget',
    options: [
      { slug: 'under-10000', label: `Under ${RUPEE}10,000`, route: '/rent/under-10000', groupKey: 'budget' },
      { slug: '10000-to-25000', label: `${RUPEE}10,000 - ${RUPEE}25,000`, route: '/rent/10000-to-25000', groupKey: 'budget' },
      { slug: '25000-to-50000', label: `${RUPEE}25,000 - ${RUPEE}50,000`, route: '/rent/25000-to-50000', groupKey: 'budget' },
      { slug: 'above-50000', label: `Above ${RUPEE}50,000`, route: '/rent/above-50000', groupKey: 'budget' },
    ],
  },
  {
    key: 'bhk',
    title: 'BHK Type',
    options: [
      { slug: '1-bhk-for-rent', label: '1 BHK for Rent', route: '/rent/1-bhk-for-rent', groupKey: 'bhk' },
      { slug: '2-bhk-for-rent', label: '2 BHK for Rent', route: '/rent/2-bhk-for-rent', groupKey: 'bhk' },
      { slug: '3-bhk-for-rent', label: '3 BHK for Rent', route: '/rent/3-bhk-for-rent', groupKey: 'bhk' },
      { slug: '4-bhk-for-rent', label: '4 BHK for Rent', route: '/rent/4-bhk-for-rent', groupKey: 'bhk' },
    ],
  },
  {
    key: 'explore',
    title: 'Explore',
    options: [
      { slug: 'all-rentals', label: 'All Rental Properties', route: '/rent', groupKey: 'explore' },
      { slug: 'share-requirement', label: 'Share Requirement', route: '/rent/share-requirement', badge: 'FREE', groupKey: 'explore' },
      { slug: 'view-projects', label: 'View Projects', route: '/rent/projects', groupKey: 'explore' },
    ],
  },
];

export const ALL_RENT_TAXONOMY_OPTIONS: RentTaxonomyOption[] = RENT_TAXONOMY_GROUPS.flatMap(
  (g) => g.options
);

export const getRentOptionBySlug = (slug: string): RentTaxonomyOption | undefined => {
  return ALL_RENT_TAXONOMY_OPTIONS.find((opt) => opt.slug === slug);
};

export const getRentFilterForSlug = (slug: string): ((r: Rental) => boolean) => {
  switch (slug) {
    case 'flats-for-rent':
      return (r) => r.type === 'flat';
    case 'houses-for-rent':
      return (r) => r.type === 'house';
    case 'villas-for-rent':
      return (r) => r.type === 'villa';
    case 'commercial-for-rent':
      return (r) => r.type === 'commercial';
    case 'office-for-rent':
      return (r) => r.type === 'office';

    case 'under-10000':
      return (r) => rentBucket(r) === 'under-10000';
    case '10000-to-25000':
      return (r) => rentBucket(r) === '10000-to-25000';
    case '25000-to-50000':
      return (r) => rentBucket(r) === '25000-to-50000';
    case 'above-50000':
      return (r) => rentBucket(r) === 'above-50000';

    case '1-bhk-for-rent':
      return (r) => bhkBucketRent(r) === '1-bhk-for-rent';
    case '2-bhk-for-rent':
      return (r) => bhkBucketRent(r) === '2-bhk-for-rent';
    case '3-bhk-for-rent':
      return (r) => bhkBucketRent(r) === '3-bhk-for-rent';
    case '4-bhk-for-rent':
      return (r) => bhkBucketRent(r) === '4-bhk-for-rent';

    default:
      return () => true;
  }
};

export const countForRent = (slug: string): number | undefined => {
  if (slug === 'all-rentals' || slug === '/rent') {
    return rentals.length;
  }
  if (slug === 'view-projects' || slug === '/rent/projects') {
    return rentalProjects.length;
  }
  if (slug === 'share-requirement' || slug === '/rent/share-requirement') {
    return undefined; // Share requirement has no count badge
  }
  const filter = getRentFilterForSlug(slug);
  return rentals.filter(filter).length;
};

export const getRentalsForSlug = (slug: string): Rental[] => {
  const filter = getRentFilterForSlug(slug);
  return rentals.filter(filter);
};

export const getRentalsWithFallback = (
  slug: string
): {
  primary: Rental[];
  suggestions: Rental[];
} => {
  const primary = getRentalsForSlug(slug);
  if (primary.length >= 3) {
    return { primary, suggestions: [] };
  }

  const existingIds = new Set(primary.map((r) => r.id));
  const suggestions: Rental[] = [];

  const targetSample = primary[0] || rentals[0];
  const targetBucket = rentBucket(targetSample);

  // 1. Neighbouring budget bucket
  const budgetNeighbours = rentals.filter(
    (r) => !existingIds.has(r.id) && rentBucket(r) === targetBucket
  );
  for (const r of budgetNeighbours) {
    if (primary.length + suggestions.length >= 3) break;
    suggestions.push(r);
    existingIds.add(r.id);
  }

  // 2. Type neighbours
  if (primary.length + suggestions.length < 3) {
    const typeNeighbours = rentals.filter(
      (r) => !existingIds.has(r.id) && r.type === targetSample.type
    );
    for (const r of typeNeighbours) {
      if (primary.length + suggestions.length >= 3) break;
      suggestions.push(r);
      existingIds.add(r.id);
    }
  }

  // 3. Any remaining listings
  if (primary.length + suggestions.length < 3) {
    for (const r of rentals) {
      if (!existingIds.has(r.id)) {
        suggestions.push(r);
        existingIds.add(r.id);
        if (primary.length + suggestions.length >= 3) break;
      }
    }
  }

  return { primary, suggestions };
};
