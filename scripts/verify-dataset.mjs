import fs from 'fs';

// Quick sanity check on src/data/rentals.ts and src/data/rentalProjects.ts
const rentalsFile = fs.readFileSync('src/data/rentals.ts', 'utf8');
const projectsFile = fs.readFileSync('src/data/rentalProjects.ts', 'utf8');

console.log('--- Checking rentals data ---');
const ids = [...rentalsFile.matchAll(/id:\s*'(R\d+)'/g)].map(m => m[1]);
console.log('Listings (' + ids.length + '):', ids.join(', '));

const projIds = [...projectsFile.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
console.log('Projects (' + projIds.length + '):', projIds.join(', '));

if (ids.length === 12 && projIds.length === 6) {
  console.log('SUCCESS: All 12 rentals and 6 projects verified.');
} else {
  console.error('ERROR: Unexpected count');
  process.exit(1);
}

