// Taglines are SAMPLE copy for a client demo. Counts are computed live from the listings.

export type Location = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  focal: string;
  imagePrompt: string;
  order: number;
};

export const locations: Location[] = [
  {
    slug: 'jubilee-hills',
    name: 'Jubilee Hills',
    tagline: 'Leafy lanes and landmark villas',
    image: '/locations/jubilee-hills.webp',
    focal: 'center center',
    imagePrompt:
      'A leafy residential street in Jubilee Hills, Hyderabad, golden hour: large granite boulders in landscaped gardens, elegant modern villas behind gates, gulmohar trees in bloom, a clean tarmac road.',
    order: 1,
  },
  {
    slug: 'banjara-hills',
    name: 'Banjara Hills',
    tagline: 'The hilltop address of the city\u2019s elite',
    image: '/locations/banjara-hills.webp',
    focal: 'center center',
    imagePrompt:
      'An upscale tree-lined boulevard in Banjara Hills, Hyderabad, at dusk: boutique stone-fronted buildings and premium apartment towers on a gentle hill, warm street lights, a calm lake glinting in the distance.',
    order: 2,
  },
  {
    slug: 'kokapet',
    name: 'Kokapet',
    tagline: 'The new skyline on the Outer Ring Road',
    image: '/locations/kokapet.webp',
    focal: 'center center',
    imagePrompt:
      'A cluster of new luxury high-rise residential towers in Kokapet, Hyderabad, early evening: a wide empty road in the foreground, landscaped medians, open land and soft clouds.',
    order: 3,
  },
  {
    slug: 'gachibowli',
    name: 'Gachibowli',
    tagline: 'Where the tech corridor meets city life',
    image: '/locations/gachibowli.webp',
    focal: 'center center',
    imagePrompt:
      'Modern glass IT office towers and a clean flyover in Gachibowli, Hyderabad, evening: lights coming on, a landscaped roadside, a warm sky.',
    order: 4,
  },
  {
    slug: 'financial-district',
    name: 'Financial District',
    tagline: 'Glass towers and global offices',
    image: '/locations/financial-district.webp',
    focal: 'center center',
    imagePrompt:
      'A group of tall glass skyscrapers around a paved plaza with a fountain in Hyderabad\u2019s Financial District, blue hour: reflections, manicured trees, a calm clean mood.',
    order: 5,
  },
  {
    slug: 'madhapur',
    name: 'Madhapur',
    tagline: 'The heartbeat of the IT corridor',
    image: '/locations/madhapur.webp',
    focal: 'center center',
    imagePrompt:
      'Tech-park towers along a wide tree-lined road in Madhapur, Hyderabad, golden hour: glass and aluminium facades, a footbridge, fresh greenery.',
    order: 6,
  },
  {
    slug: 'kondapur',
    name: 'Kondapur',
    tagline: 'Green courtyards, walkable convenience',
    image: '/locations/kondapur.webp',
    focal: 'center center',
    imagePrompt:
      'Mid-rise apartment communities with green courtyards and balconies in Kondapur, Hyderabad, afternoon light: a landscaped pedestrian walkway, neat shops at street level with no signage.',
    order: 7,
  },
  {
    slug: 'manikonda',
    name: 'Manikonda',
    tagline: 'Quiet streets, family-first living',
    image: '/locations/manikonda.webp',
    focal: 'center center',
    imagePrompt:
      'A quiet residential lane in Manikonda, Hyderabad, morning light: independent houses and low-rise apartments with potted plants, a small temple tower in the distance, a neem tree.',
    order: 8,
  },
  {
    slug: 'narsingi',
    name: 'Narsingi',
    tagline: 'Spacious villas on wide boulevards',
    image: '/locations/narsingi.webp',
    focal: 'center center',
    imagePrompt:
      'A modern gated villa community in Narsingi, Hyderabad, sunset: wide boulevards, manicured lawns, contemporary villas with pitched roofs, palm trees.',
    order: 9,
  },
  {
    slug: 'bachupally',
    name: 'Bachupally',
    tagline: 'Gated communities with room to grow',
    image: '/locations/bachupally.webp',
    focal: 'center center',
    imagePrompt:
      'New gated apartment towers with a landscaped park and walking track in Bachupally, Hyderabad, clear blue sky, fresh and family-friendly.',
    order: 10,
  },
  {
    slug: 'gandipet',
    name: 'Gandipet',
    tagline: 'Lakeside retreats and weekend estates',
    image: '/locations/gandipet.webp',
    focal: 'center center',
    imagePrompt:
      'A calm lake with granite hills and a few lakeside farmhouses near Gandipet, Hyderabad, at sunrise: mist over the water, soft golden light.',
    order: 11,
  },
  {
    slug: 'kukatpally',
    name: 'Kukatpally',
    tagline: 'Metro-connected, always in motion',
    image: '/locations/kukatpally.webp',
    focal: 'center center',
    imagePrompt:
      'A busy but orderly urban neighbourhood in Kukatpally, Hyderabad, early morning: a metro viaduct crossing above a wide road, mid-rise apartments and trees, soft warm light.',
    order: 12,
  },
];

