import { properties, Property, budgetBucket, bhkBucket } from './properties';

export interface TaxonomyOption {
  slug: string;
  label: string;
  badge?: string;
  groupKey: 'popular' | 'type' | 'budget' | 'bhk';
}

export interface TaxonomyGroup {
  key: 'popular' | 'type' | 'budget' | 'bhk';
  title: string;
  options: TaxonomyOption[];
}

export const BUY_TAXONOMY_GROUPS: TaxonomyGroup[] = [
  {
    key: 'popular',
    title: 'Popular Choices',
    options: [
      { slug: 'ready-to-move', label: 'Ready to Move', groupKey: 'popular' },
      { slug: 'under-construction', label: 'Under Construction', groupKey: 'popular' },
      { slug: 'new-launch', label: 'New Launch', badge: 'HOT', groupKey: 'popular' },
      { slug: 'featured-properties', label: 'Featured Properties', groupKey: 'popular' },
    ],
  },
  {
    key: 'type',
    title: 'Property Types',
    options: [
      { slug: 'flats-apartments', label: 'Flats/Apartments', groupKey: 'type' },
      { slug: 'independent-houses', label: 'Independent Houses', groupKey: 'type' },
      { slug: 'villas', label: 'Villas', groupKey: 'type' },
      { slug: 'plots-land', label: 'Plots/Land', groupKey: 'type' },
      { slug: 'commercial', label: 'Commercial', groupKey: 'type' },
    ],
  },
  {
    key: 'budget',
    title: 'Budget',
    options: [
      { slug: 'under-50-lacs', label: 'Under \u20B950 Lacs', groupKey: 'budget' },
      { slug: '50-lacs-to-1-cr', label: '\u20B950 Lacs - \u20B91 Cr', groupKey: 'budget' },
      { slug: '1-cr-to-5-cr', label: '\u20B91 Cr - \u20B95 Cr', groupKey: 'budget' },
      { slug: 'above-5-cr', label: 'Above \u20B95 Cr', groupKey: 'budget' },
    ],
  },
  {
    key: 'bhk',
    title: 'BHK Type',
    options: [
      { slug: '1-bhk', label: '1 BHK', groupKey: 'bhk' },
      { slug: '2-bhk', label: '2 BHK', groupKey: 'bhk' },
      { slug: '3-bhk', label: '3 BHK', groupKey: 'bhk' },
      { slug: '4-bhk', label: '4 BHK', groupKey: 'bhk' },
      { slug: '4-plus-bhk', label: '4+ BHK', groupKey: 'bhk' },
    ],
  },
];

export const ALL_TAXONOMY_OPTIONS: TaxonomyOption[] = BUY_TAXONOMY_GROUPS.flatMap(
  (g) => g.options
);

export const getOptionBySlug = (slug: string): TaxonomyOption | undefined => {
  return ALL_TAXONOMY_OPTIONS.find((opt) => opt.slug === slug);
};

export const getFilterForSlug = (slug: string): ((p: Property) => boolean) => {
  switch (slug) {
    case 'ready-to-move':
      return (p) => p.status === 'ready';
    case 'under-construction':
      return (p) => p.status === 'under-construction';
    case 'new-launch':
      return (p) => p.status === 'new-launch';
    case 'featured-properties':
      return (p) => Boolean(p.featured);

    case 'flats-apartments':
      return (p) => p.type === 'apartment';
    case 'independent-houses':
      return (p) => p.type === 'house';
    case 'villas':
      return (p) => p.type === 'villa';
    case 'plots-land':
      return (p) => p.type === 'plot';
    case 'commercial':
      return (p) => p.type === 'commercial';

    case 'under-50-lacs':
      return (p) => budgetBucket(p) === 'under-50-lacs';
    case '50-lacs-to-1-cr':
      return (p) => budgetBucket(p) === '50-lacs-to-1-cr';
    case '1-cr-to-5-cr':
      return (p) => budgetBucket(p) === '1-cr-to-5-cr';
    case 'above-5-cr':
      return (p) => budgetBucket(p) === 'above-5-cr';

    case '1-bhk':
      return (p) => bhkBucket(p) === '1-bhk';
    case '2-bhk':
      return (p) => bhkBucket(p) === '2-bhk';
    case '3-bhk':
      return (p) => bhkBucket(p) === '3-bhk';
    case '4-bhk':
      return (p) => bhkBucket(p) === '4-bhk';
    case '4-plus-bhk':
      return (p) => bhkBucket(p) === '4-plus-bhk';

    default:
      return () => true;
  }
};

export const countFor = (slug: string): number => {
  const filter = getFilterForSlug(slug);
  return properties.filter(filter).length;
};

export const getPropertiesForSlug = (slug: string): Property[] => {
  const filter = getFilterForSlug(slug);
  return properties.filter(filter);
};

/**
 * Returns matching properties, and if fewer than 3, appends closest matches ("You may also like").
 * Priority order for recommendations:
 * 1. Budget bucket neighbours
 * 2. Same or compatible property type
 */
export const getPropertiesWithFallback = (slug: string): {
  primary: Property[];
  suggestions: Property[];
} => {
  const primary = getPropertiesForSlug(slug);
  if (primary.length >= 3) {
    return { primary, suggestions: [] };
  }

  const existingIds = new Set(primary.map((p) => p.id));
  const suggestions: Property[] = [];

  // If primary has items, try to find closest neighbours by budget or type
  const targetSample = primary[0] || properties[0];
  const targetBudget = budgetBucket(targetSample);

  // 1. Budget bucket neighbours
  const budgetMatches = properties.filter(
    (p) => !existingIds.has(p.id) && budgetBucket(p) === targetBudget
  );
  for (const p of budgetMatches) {
    if (primary.length + suggestions.length >= 3) break;
    suggestions.push(p);
    existingIds.add(p.id);
  }

  // 2. Type neighbours
  if (primary.length + suggestions.length < 3) {
    const typeMatches = properties.filter(
      (p) => !existingIds.has(p.id) && p.type === targetSample.type
    );
    for (const p of typeMatches) {
      if (primary.length + suggestions.length >= 3) break;
      suggestions.push(p);
      existingIds.add(p.id);
    }
  }

  // 3. Any remaining featured or top properties
  if (primary.length + suggestions.length < 3) {
    for (const p of properties) {
      if (!existingIds.has(p.id)) {
        suggestions.push(p);
        existingIds.add(p.id);
        if (primary.length + suggestions.length >= 3) break;
      }
    }
  }

  return { primary, suggestions };
};

