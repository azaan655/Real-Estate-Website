import fs from 'fs';
import vm from 'vm';

async function main() {
  let babelSrc;
  if (fs.existsSync('scripts/babel.min.js')) {
    console.log('Loading Babel Standalone from local cache...');
    babelSrc = fs.readFileSync('scripts/babel.min.js', 'utf8');
  } else {
    console.log('Fetching Babel Standalone from CDN...');
    const babelRes = await fetch('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.4/babel.min.js');
    babelSrc = await babelRes.text();
    fs.writeFileSync('scripts/babel.min.js', babelSrc, 'utf8');
  }

  const ctx = { window: {}, self: {}, navigator: { userAgent: 'node' }, console };
  vm.createContext(ctx);
  vm.runInContext(babelSrc, ctx);
  const Babel = ctx.Babel || ctx.window.Babel;
  console.log('Babel Standalone loaded.');

  // Helper to transpile TSX to clean JSX
  function transpileTsx(src, filename) {
    // Replace <Home with <HomeIcon
    src = src.replace(/<Home(\s|\/|>)/g, '<HomeIcon$1');
    if (filename === 'RentCard.tsx') {
      src = src.replace(/case 'house':\s*return <Home /g, "case 'house': return <HomeIcon ");
    }
    // Remove duplicate WHATSAPP_NUMBER and contact constants since they are declared globally at top
    src = src.replace(/export\s+const\s+CONTACT_PHONE\s*=[^;]+;?/g, '');
    src = src.replace(/export\s+const\s+CONTACT_EMAIL\s*=[^;]+;?/g, '');
    src = src.replace(/export\s+const\s+WHATSAPP_NUMBER\s*=[^;]+;?/g, '');
    src = src.replace(/const\s+CONTACT_PHONE\s*=[^;]+;?/g, '');
    src = src.replace(/const\s+CONTACT_EMAIL\s*=[^;]+;?/g, '');
    src = src.replace(/const\s+WHATSAPP_NUMBER\s*=[^;]+;?/g, '');
    // Guard ScrollTrigger
    src = src.replace(/gsap\.registerPlugin\(ScrollTrigger\);?/g, "if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger && typeof gsap !== 'undefined') { gsap.registerPlugin(ScrollTrigger); }");

    // Strip imports and exports
    let code = src.replace(/import\s+[\s\S]*?from\s+['\x22][^'\x22]+['\x22];?/g, '');
    code = code.replace(/export\s*\{[^}]*\};?/g, '');
    code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '');
    code = code.replace(/export\s+(const|function|let|var)\s+/g, '$1 ');

    // Transform using Babel preset-typescript and syntax-jsx
    const result = Babel.transform(code, {
      presets: [
        ['typescript', { jsxPragma: 'React.createElement' }]
      ],
      plugins: [
        ['syntax-jsx']
      ],
      filename: filename
    });
    let out = result.code;
    out = out.replace(/export\s*\{[^}]*\};?/g, '');
    out = out.replace(/export\s+default\s+[^;]+;?/g, '');
    out = out.replace(/export\s+/g, '');
    return out;
  }

  let indexHtml = fs.readFileSync('index.html', 'utf8');

  // 1. Ensure RUPEE, DOT, formatInr, Money at top of script
  const globalsAnchor = 'const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";';
  const globalsCode = `
    const RUPEE = '\\u20B9';
    const DOT = '\\u00B7';
    const formatInr = (n) => (n !== undefined && n !== null ? n.toLocaleString('en-IN') : '0');
    const formatRupees = (n) => RUPEE + (n !== undefined && n !== null ? n.toLocaleString('en-IN') : '0');
    const Money = ({ amount, className = '', suffix = '', rupeeClassName = 'rupee' }) => (
      <span className={className}>
        <span className={rupeeClassName}>{RUPEE}</span>
        {formatInr(amount)}
        {suffix}
      </span>
    );
    const CONTACT_PHONE = '+91 91000 00000';
    const CONTACT_EMAIL = 'advisory@vesta.in';
`;
  if (!indexHtml.includes('const RUPEE =')) {
    indexHtml = indexHtml.replace(globalsAnchor, globalsCode + '\n    ' + globalsAnchor);
    console.log('Added RUPEE/Money globals');
  } else if (!indexHtml.includes('const CONTACT_PHONE =')) {
    indexHtml = indexHtml.replace(globalsAnchor, 'const CONTACT_PHONE = "+91 91000 00000";\n    const CONTACT_EMAIL = "advisory@vesta.in";\n    ' + globalsAnchor);
    console.log('Added CONTACT_PHONE and CONTACT_EMAIL');
  }

  // Inject FAQ CSS into <style> if missing
  if (!indexHtml.includes('.faq-aurora')) {
    const faqCss = `
    /* FAQ Aurora and Panel Styles */
    .faq-aurora { position: relative; isolation: isolate; overflow: hidden; background: #100C08; }
    .faq-aurora > * { position: relative; z-index: 3; }
    .faq-aurora::before { content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background: linear-gradient(180deg, rgba(10,8,5,0.30) 0%, rgba(10,8,5,0.55) 100%); }
    .faq-aurora::after { content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none; border-radius: inherit;
      box-shadow: inset 0 0 0 1px rgba(233,220,192,0.22); opacity: 1;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
      background-blend-mode: overlay; }
    .faq-blob { position: absolute; z-index: 0; width: 80%; aspect-ratio: 1; border-radius: 50%; pointer-events: none; will-change: transform; }
    .faq-blob.b1 { top: -28%; left: -22%; background: radial-gradient(circle, #E9DCC0 0%, rgba(233,220,192,0) 65%); animation: faq-d1 19s ease-in-out infinite; }
    .faq-blob.b2 { top: -22%; right: -26%; background: radial-gradient(circle, #D4AF6A 0%, rgba(212,175,106,0) 65%); animation: faq-d2 23s ease-in-out infinite; }
    .faq-blob.b3 { bottom: -30%; left: -18%; background: radial-gradient(circle, #8A5A2B 0%, rgba(138,90,43,0) 65%); animation: faq-d3 21s ease-in-out infinite; }
    .faq-blob.b4 { bottom: -26%; right: -24%; background: radial-gradient(circle, #0F4A3C 0%, rgba(15,74,60,0) 65%); animation: faq-d4 25s ease-in-out infinite; }
    .faq-blob.b5 { top: 20%; left: 10%; width: 60%; background: radial-gradient(circle, #B86B3D 0%, rgba(184,107,61,0) 65%); animation: faq-d5 17s ease-in-out infinite; }
    @keyframes faq-d1 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 33% { transform: translate3d(38%,16%,0) scale(1.25); } 66% { transform: translate3d(14%,48%,0) scale(0.9); } }
    @keyframes faq-d2 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 40% { transform: translate3d(-34%,26%,0) scale(1.2); } 70% { transform: translate3d(-12%,54%,0) scale(0.92); } }
    @keyframes faq-d3 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 35% { transform: translate3d(40%,-28%,0) scale(1.18); } 70% { transform: translate3d(18%,-12%,0) scale(0.9); } }
    @keyframes faq-d4 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 30% { transform: translate3d(-38%,-22%,0) scale(1.22); } 65% { transform: translate3d(-16%,-48%,0) scale(0.92); } }
    @keyframes faq-d5 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 25% { transform: translate3d(30%,-18%,0) scale(1.2); } 50% { transform: translate3d(48%,22%,0) scale(0.9); } 75% { transform: translate3d(8%,30%,0) scale(1.1); } }
    .faq-aurora[data-paused="true"] .faq-blob { animation-play-state: paused; }
    @media (prefers-reduced-motion: reduce) { .faq-blob { animation: none !important; } }

    .faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    .faq-panel[data-open="true"] { grid-template-rows: 1fr; }
    .faq-panel > div { overflow: hidden; }
`;
    indexHtml = indexHtml.replace('</style>', faqCss + '\n  </style>');
    console.log('Injected FAQ CSS into index.html');
  }

  // Update first getKeyDetails to handle both Buy and Rent
  indexHtml = indexHtml.replace(
    /const getKeyDetails = \(p\) => \{[\s\S]*?return \[\s*\{ label: 'Configuration', value: \(p\.beds \|\| 0\) \+ ' BHK \\u00B7 ' \+ \(p\.baths \|\| 0\) \+ ' Bath' \},[\s\S]*?\];\s*\};/,
    `const getKeyDetails = (p) => {
      if (!p) return [];
      if (p.keyDetails && p.keyDetails.length > 0) return p.keyDetails;
      if ('rent' in p) {
        return [
          { label: 'Configuration', value: (p.beds || 0) + ' BHK \\u00B7 ' + (p.baths || 0) + ' Bath' },
          { label: 'Furnishing', value: p.furnishing },
          { label: 'Available', value: p.availableFrom },
        ];
      }
      return [
        { label: 'Configuration', value: (p.beds || 0) + ' BHK \\u00B7 ' + (p.baths || 0) + ' Bath' },
        { label: 'Facing', value: p.facing },
        { label: 'Possession', value: p.possession }
      ];
    };`
  );

  // 2. Cleanly inject complete rent helpers between rentalProjectsData and RENT_TAXONOMY_GROUPS
  const pProjStart = indexHtml.indexOf('const rentalProjectsData = [');
  const pProjEnd = indexHtml.indexOf('];', pProjStart) + 2;
  const pTaxStart = indexHtml.indexOf('const RENT_TAXONOMY_GROUPS = [');

  const rentHelpers = `
    // =========================================================================
    // RENT HELPERS & TAXONOMY BRIDGE
    // =========================================================================
    const buyCountFor = (slug) => {
      return typeof countFor === 'function' ? countFor(slug) : undefined;
    };
    const properties = typeof propertiesData !== 'undefined' ? propertiesData : [];
    const rentals = rentalsData;
    const rentalProjects = rentalProjectsData;

    const rentBucket = (r) => {
      if (r.rent < 10000) return 'under-10000';
      if (r.rent < 25000) return '10000-to-25000';
      if (r.rent < 50000) return '25000-to-50000';
      return 'above-50000';
    };

    const bhkBucketRent = (r) => {
      if (r.beds === 1) return '1-bhk-for-rent';
      if (r.beds === 2) return '2-bhk-for-rent';
      if (r.beds === 3) return '3-bhk-for-rent';
      if (r.beds === 4) return '4-bhk-for-rent';
      return 'none';
    };

    const deposit = (r) => r.rent * r.depositMonths;
    const depositRent = deposit;

    const moveInCost = (r) => r.rent + deposit(r);
    const moveInCostRent = moveInCost;

    const getKeyDetailsRent = (r) => {
      if (r.keyDetails && r.keyDetails.length > 0) return r.keyDetails;
      return [
        { label: 'Configuration', value: \`\${r.beds} BHK \${DOT} \${r.baths} Bath\` },
        { label: 'Furnishing', value: r.furnishing },
        { label: 'Available', value: r.availableFrom },
      ];
    };

    const unitsFor = (project) => {
      return rentalsData.filter((r) => r.project === project.name);
    };
    const unitsForProject = unitsFor;

    const rentRange = (project) => {
      const units = unitsFor(project);
      if (units.length === 0) return [0, 0];
      const rents = units.map((u) => u.rent);
      return [Math.min(...rents), Math.max(...rents)];
    };
    const rentRangeForProject = rentRange;

    const formatRentMonthly = (n) => RUPEE + (n ? n.toLocaleString('en-IN') : '0');
    const searchText = (r) => (r.name.replace('\\n', ' ') + ' ' + r.location + ' ' + r.subtype + ' ' + (r.project || '')).toLowerCase();

    const RENTAL_VIEWS_MAP = {
      R1: [
        { src: '/rentals/rental-1.jpg', label: 'Exterior', alt: 'Metro Heights Compact Nest exterior' },
        { src: '/rentals/rental-1-b.webp', label: 'Living room', alt: 'Cream and terracotta living room' },
        { src: '/rentals/rental-1-c.webp', label: 'Bedroom', alt: 'Tidy unfurnished bedroom' },
        { src: '/rentals/rental-1-d.webp', label: 'Kitchen', alt: 'Kitchen with granite counter' },
      ],
      R2: [
        { src: '/rentals/rental-2.jpg', label: 'Exterior', alt: 'Cyber View Studio Tower exterior' },
        { src: '/rentals/rental-2-b.webp', label: 'Living area', alt: 'Warm grey furnished living area' },
        { src: '/rentals/rental-2-c.webp', label: 'Bedroom', alt: 'Furnished studio bedroom' },
        { src: '/rentals/rental-2-d.webp', label: 'Rooftop pool', alt: 'Rooftop infinity pool with city view' },
      ],
      R3: [
        { src: '/rentals/rental-3.jpg', label: 'Exterior', alt: 'Botanica Enclave gated community exterior' },
        { src: '/rentals/rental-3-b.webp', label: 'Living room', alt: 'Timber and garden themed living room' },
        { src: '/rentals/rental-3-c.webp', label: 'Bedroom', alt: 'Semi-furnished bedroom with wooden wardrobes' },
        { src: '/rentals/rental-3-d.webp', label: 'Kitchen', alt: 'Modular timber kitchen' },
      ],
      R4: [
        { src: '/rentals/rental-4.jpg', label: 'Living room', alt: 'High floor living room with skyline view' },
        { src: '/rentals/rental-4-b.webp', label: 'Bedroom', alt: 'Semi-furnished master bedroom' },
        { src: '/rentals/rental-4-c.webp', label: 'Kitchen', alt: 'Modern modular kitchen' },
        { src: '/rentals/rental-4-d.webp', label: 'Tower exterior', alt: 'Tower exterior' },
      ],
      R5: [
        { src: '/rentals/rental-5.jpg', label: 'Exterior', alt: 'One Kokapet high-rise exterior' },
        { src: '/rentals/rental-5-b.webp', label: 'Living room', alt: 'Spacious 3 BHK living room' },
        { src: '/rentals/rental-5-c.webp', label: 'Bedroom', alt: 'Master bedroom with balcony' },
        { src: '/rentals/rental-5-d.webp', label: 'Clubhouse pool', alt: 'Clubhouse swimming pool' },
      ],
      R6: [
        { src: '/rentals/rental-6.jpg', label: 'Living room', alt: 'Marble floor sky home living room' },
        { src: '/rentals/rental-6-b.webp', label: 'Terrace deck', alt: 'Terrace deck' },
        { src: '/rentals/rental-6-c.webp', label: 'Master bedroom', alt: 'Master bedroom suite' },
        { src: '/rentals/rental-6-d.webp', label: 'Tower exterior', alt: 'Tower exterior' },
      ],
      R7: [
        { src: '/rentals/rental-7.jpg', label: 'Exterior', alt: 'Whitewashed independent house exterior' },
        { src: '/rentals/rental-7-b.webp', label: 'Living room', alt: 'Living room with wooden door' },
        { src: '/rentals/rental-7-c.webp', label: 'Courtyard', alt: 'Inner courtyard' },
        { src: '/rentals/rental-7-d.webp', label: 'Bedroom', alt: 'Quiet bedroom' },
      ],
      R8: [
        { src: '/rentals/rental-8.jpg', label: 'Exterior', alt: 'Jubilee Hills bungalow floor facade' },
        { src: '/rentals/rental-8-b.webp', label: 'Living room', alt: 'Spacious living room' },
        { src: '/rentals/rental-8-c.webp', label: 'Bedroom', alt: 'Semi-furnished bedroom suite' },
        { src: '/rentals/rental-8-d.webp', label: 'Garden', alt: 'Garden and pergola' },
      ],
      R9: [
        { src: '/rentals/rental-9.jpg', label: 'Exterior', alt: 'Gachibowli estate villa exterior' },
        { src: '/rentals/rental-9-b.webp', label: 'Living room', alt: 'Double-height glass living room' },
        { src: '/rentals/rental-9-c.webp', label: 'Pool', alt: 'Private swimming pool' },
        { src: '/rentals/rental-9-d.webp', label: 'Master bedroom', alt: 'Furnished master bedroom' },
      ],
      R10: [
        { src: '/rentals/rental-10.jpg', label: 'Exterior', alt: 'Bachupally garden villa exterior' },
        { src: '/rentals/rental-10-b.webp', label: 'Living room', alt: 'Living room with veranda access' },
        { src: '/rentals/rental-10-c.webp', label: 'Garden', alt: 'Private garden and lawn' },
        { src: '/rentals/rental-10-d.webp', label: 'Bedroom', alt: 'Airy bedroom with sloped ceiling' },
      ],
      R11: [
        { src: '/rentals/rental-11.jpg', label: 'Street view', alt: 'Jubilee Hills retail unit street view' },
        { src: '/rentals/rental-11-b.webp', label: 'Interior', alt: 'Bare shell commercial interior' },
        { src: '/rentals/rental-11-c.webp', label: 'Frontage detail', alt: 'Frontage detail and stone portal' },
        { src: '/rentals/rental-11-d.webp', label: 'Neighbourhood street', alt: 'Neighbourhood street in Jubilee Hills' },
      ],
      R12: [
        { src: '/rentals/rental-12.jpg', label: 'Workspace', alt: 'Kondapur fitted office workspace' },
        { src: '/rentals/rental-12-b.webp', label: 'Building exterior', alt: 'Grade A corporate commercial glass tower' },
        { src: '/rentals/rental-12-c.webp', label: 'Pantry', alt: 'Executive cafeteria and pantry' },
        { src: '/rentals/rental-12-d.webp', label: 'Reception', alt: 'Minimalist oak and marble entrance reception' },
      ],
    };

    const rentalViews = (r) => {
      if (r && r.views && r.views.length >= 4) return r.views;
      if (r && RENTAL_VIEWS_MAP[r.id]) return RENTAL_VIEWS_MAP[r.id];
      const baseName = (r.image || '').replace(/(\\.[a-zA-Z]+)$/, '');
      return [
        { src: r.image, label: 'Exterior', alt: (r.name || '').replace(/\\n/g, ' ') + ' exterior' },
        { src: baseName + '-b.webp', label: 'Living room', alt: (r.name || '').replace(/\\n/g, ' ') + ' living area' },
        { src: baseName + '-c.webp', label: 'Bedroom', alt: (r.name || '').replace(/\\n/g, ' ') + ' bedroom' },
        { src: baseName + '-d.webp', label: 'Details', alt: (r.name || '').replace(/\\n/g, ' ') + ' interior' },
      ];
    };
`;

  if (pProjEnd !== -1 && pTaxStart !== -1) {
    indexHtml = indexHtml.substring(0, pProjEnd) + '\n\n' + rentHelpers + '\n\n    ' + indexHtml.substring(pTaxStart);
    console.log('Cleanly injected rentHelpers between rentalProjectsData and RENT_TAXONOMY_GROUPS');
  }

  // Sync RENT_PAGE_CONFIGS from src/data/rentPages.ts
  let rentPagesSrc = fs.readFileSync('src/data/rentPages.ts', 'utf8');
  rentPagesSrc = rentPagesSrc.replace(/import\s+[\s\S]*?from\s+['\x22][^'\x22]+['\x22];?/g, '');
  rentPagesSrc = rentPagesSrc.replace(/export\s+type\s+[\s\S]*?;/g, '');
  rentPagesSrc = rentPagesSrc.replace(/export\s+interface\s+[\s\S]*?\n\}/g, '');
  rentPagesSrc = rentPagesSrc.replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '');
  rentPagesSrc = rentPagesSrc.replace(/export\s+const\s+RENT_PAGE_CONFIGS:\s*Record<[^>]+>\s*=\s*/, 'const RENT_PAGE_CONFIGS = ');
  rentPagesSrc = rentPagesSrc.replace(/export\s+const\s+getRentPageConfig[\s\S]*$/, '').trim();

  const currentConfigsStart = indexHtml.indexOf('const RENT_PAGE_CONFIGS =');
  const currentConfigsEnd = indexHtml.indexOf('const getRentPageConfig = (slug) => {', currentConfigsStart);
  if (currentConfigsStart !== -1 && currentConfigsEnd !== -1) {
    indexHtml = indexHtml.substring(0, currentConfigsStart) + rentPagesSrc + '\n\n    ' + indexHtml.substring(currentConfigsEnd);
    console.log('Synced RENT_PAGE_CONFIGS from src/data/rentPages.ts');
  }

  // 3. Complete SVG icons suite
  const allIcons = `
    const ArrowLeft = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
      </svg>
    );
    const ArrowRight = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
      </svg>
    );
    const ArrowUpRight = ({ size = 14, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
      </svg>
    );
    const ChevronDown = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6"/>
      </svg>
    );
    const ChevronLeft = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6"/>
      </svg>
    );
    const ChevronRight = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6"/>
      </svg>
    );
    const Menu = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
    );
    const X = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    );
    const Check = ({ size = 16, className = "", strokeWidth = 2 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    );
    const Search = ({ size = 16, className = "", strokeWidth = 2 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    );
    const Heart = ({ size = 16, className = "", fill = "none" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    );
    const Building = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
      </svg>
    );
    const Building2 = ({ size = 20, className = "", strokeWidth = 1.8 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
      </svg>
    );
    const HomeIcon = ({ size = 20, className = "", strokeWidth = 1.8 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    );
    const TreePine = ({ size = 20, className = "", strokeWidth = 1.8 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 2 5 7h-3l4 7h-4l3 5H7l3-5H6l4-7H7l5-7Z"/><path d="M12 21v2"/>
      </svg>
    );
    const Store = ({ size = 20, className = "", strokeWidth = 1.8 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2"/><path d="M18 7a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2"/><path d="M14 7a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2"/><path d="M10 7a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2"/><path d="M6 7a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2"/>
      </svg>
    );
    const Briefcase = ({ size = 20, className = "", strokeWidth = 1.8 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>
      </svg>
    );
    const SlidersHorizontal = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>
      </svg>
    );
    const MapPin = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    );
    const Calendar = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
      </svg>
    );
    const Clock = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    );
    const Phone = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    );
    const PhoneCall = Phone;
    const MessageCircle = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
      </svg>
    );
    const MessageSquare = MessageCircle;
    const Sparkles = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>
      </svg>
    );
    const Shield = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </svg>
    );
    const ShieldCheck = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>
      </svg>
    );
    const Award = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    );
    const Bookmark = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
    );
    const Calculator = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
      </svg>
    );
    const Plus = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="M12 5v14"/>
      </svg>
    );
    const UserCheck = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
      </svg>
    );
    const FileText = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
      </svg>
    );
    const HelpCircle = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
      </svg>
    );
    const Link2 = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>
      </svg>
    );
    const ThumbsUp = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/>
      </svg>
    );
    const ThumbsDown = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/>
      </svg>
    );
    const Mail = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    );
    const Key = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
      </svg>
    );
    const TrendingUp = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    );
    const FileCheck = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>
      </svg>
    );
    const Landmark = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
      </svg>
    );
    const Globe = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
      </svg>
    );
    const Handshake = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L11 14"/><path d="m18 11 3.3-3.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L14 7"/><path d="m2 14 3.3-3.3a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4L6 18"/><path d="m7 7 2.6-2.6a1 1 0 0 1 1.4 0l4.3 4.3a1 1 0 0 1 0 1.4L13 12"/>
      </svg>
    );
    const Quote = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      </svg>
    );
    const Eye = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    );
    const BedDouble = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>
      </svg>
    );
    const Maximize2 = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>
      </svg>
    );
    const Pause = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/>
      </svg>
    );
    const Play = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="6 3 20 12 6 21 6 3"/>
      </svg>
    );
    const PieChart = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
      </svg>
    );
    const ChartPie = PieChart;
    const Users = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    );
    const BadgeCheck = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>
      </svg>
    );
    const Megaphone = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>
    );
    const Lock = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    );
    const ArrowUp = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
      </svg>
    );
`;

  // Replace existing icons section up to Navbar
  const iconStartMarker = indexHtml.includes('const ArrowLeft = ({ size = 20')
    ? 'const ArrowLeft = ({ size = 20, className = "" }) => ('
    : 'const ChevronDown = ({ size = 16, className = "" }) => (';
  const navbarStartMarker = 'const Navbar = () => {';

  const iconStartIdx = indexHtml.indexOf(iconStartMarker);
  const navbarStartIdx = indexHtml.indexOf(navbarStartMarker);

  if (iconStartIdx !== -1 && navbarStartIdx !== -1) {
    indexHtml = indexHtml.substring(0, iconStartIdx) + allIcons + '\n\n    ' + indexHtml.substring(navbarStartIdx);
    console.log('Replaced icon definitions with complete suite');
  }

  // 4. Update Navbar (from src/components/Navbar.tsx)
  const navbarTs = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
  const navbarJs = transpileTsx(navbarTs, 'Navbar.tsx');

  const navbarEndMarker = 'const SearchCard = () => {';
  const currentNavStartIdx = indexHtml.indexOf('const Navbar = () => {');
  const currentNavEndIdx = indexHtml.indexOf(navbarEndMarker);

  if (currentNavStartIdx !== -1 && currentNavEndIdx !== -1) {
    indexHtml = indexHtml.substring(0, currentNavStartIdx) + navbarJs + '\n\n    ' + indexHtml.substring(currentNavEndIdx);
    console.log('Updated Navbar component');
  }

  // 5. Update SearchCard (from src/components/SearchCard.tsx)
  const searchCardTs = fs.readFileSync('src/components/SearchCard.tsx', 'utf8');
  const searchCardJs = transpileTsx(searchCardTs, 'SearchCard.tsx');

  const heroMarker = 'const HeroSection = () => {';
  const currentSearchCardStart = indexHtml.indexOf('const SearchCard = () => {');
  const currentSearchCardEnd = indexHtml.indexOf(heroMarker);

  if (currentSearchCardStart !== -1 && currentSearchCardEnd !== -1) {
    indexHtml = indexHtml.substring(0, currentSearchCardStart) + searchCardJs + '\n\n    ' + indexHtml.substring(currentSearchCardEnd);
    console.log('Updated SearchCard component');
  }

  // 6. Update SearchBar (from src/components/SearchBar.tsx)
  const searchBarTs = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');
  const searchBarJs = transpileTsx(searchBarTs, 'SearchBar.tsx');

  const buyCardMarker = 'const BuyCard = ({';
  const currentSearchBarStart = indexHtml.includes('const RENT_PLACEHOLDERS =')
    ? indexHtml.indexOf('const RENT_PLACEHOLDERS =')
    : indexHtml.indexOf('const SearchBar = (');
  const currentSearchBarEnd = indexHtml.indexOf(buyCardMarker);

  if (currentSearchBarStart !== -1 && currentSearchBarEnd !== -1) {
    indexHtml = indexHtml.substring(0, currentSearchBarStart) + searchBarJs + '\n\n    ' + indexHtml.substring(currentSearchBarEnd);
    console.log('Updated SearchBar component');
  }

  // 7. Update CategoryModules (from src/components/CategoryModules.tsx)
  const categoryModulesTs = fs.readFileSync('src/components/CategoryModules.tsx', 'utf8');
  const categoryModulesJs = transpileTsx(categoryModulesTs, 'CategoryModules.tsx');

  const buyMarker = 'const Buy = () => {';
  const currentCatModulesStart = indexHtml.indexOf('const CategoryModules = ({');
  const currentCatModulesEnd = indexHtml.indexOf(buyMarker);

  if (currentCatModulesStart !== -1 && currentCatModulesEnd !== -1) {
    indexHtml = indexHtml.substring(0, currentCatModulesStart) + categoryModulesJs + '\n\n    ' + indexHtml.substring(currentCatModulesEnd);
    console.log('Updated CategoryModules component');
  }

  // 7b. Update Home (from src/pages/Home.tsx)
  const homeTs = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  const homeJs = transpileTsx(homeTs, 'Home.tsx');

  const currentHomeStart = indexHtml.indexOf('const Home = () => {');
  const currentHomeEnd = indexHtml.indexOf('const Services = () => {');

  if (currentHomeStart !== -1 && currentHomeEnd !== -1) {
    indexHtml = indexHtml.substring(0, currentHomeStart) + homeJs + '\n\n    ' + indexHtml.substring(currentHomeEnd);
    console.log('Updated Home component with About us section');
  }

  // 8. Add RentCard & RentDetail before CategoryModules
  const rentCardTs = fs.readFileSync('src/components/RentCard.tsx', 'utf8');
  const rentCardJs = transpileTsx(rentCardTs, 'RentCard.tsx');

  const rentDetailTs = fs.readFileSync('src/components/RentDetail.tsx', 'utf8');
  const rentDetailJs = transpileTsx(rentDetailTs, 'RentDetail.tsx');

  // 9. Transpile RentCollection, Rent, RentShareRequirement, RentProjects
  const rentCollectionTs = fs.readFileSync('src/pages/RentCollection.tsx', 'utf8');
  const rentCollectionJs = transpileTsx(rentCollectionTs, 'RentCollection.tsx');

  const rentTs = fs.readFileSync('src/pages/Rent.tsx', 'utf8');
  const rentJs = transpileTsx(rentTs, 'Rent.tsx');

  const rentShareReqTs = fs.readFileSync('src/pages/RentShareRequirement.tsx', 'utf8');
  const rentShareReqJs = transpileTsx(rentShareReqTs, 'RentShareRequirement.tsx');

  const rentProjectsTs = fs.readFileSync('src/pages/RentProjects.tsx', 'utf8');
  const rentProjectsJs = transpileTsx(rentProjectsTs, 'RentProjects.tsx');

  // Remove old mock FAQS PAGE COMPONENT if present
  const oldFaqsMarker = '// FAQS PAGE COMPONENT';
  if (indexHtml.includes(oldFaqsMarker)) {
    const fStart = indexHtml.indexOf(oldFaqsMarker);
    const appStart = indexHtml.indexOf('const App = () => {');
    if (fStart !== -1 && appStart !== -1 && fStart < appStart) {
      indexHtml = indexHtml.substring(0, fStart) + indexHtml.substring(appStart);
      console.log('Removed old mock FAQS PAGE COMPONENT');
    }
  }

  // Inject About CSS into <style> if missing
  if (!indexHtml.includes('about-marquee')) {
    const aboutCss = `
    /* About Page Styles */
    @keyframes about-marquee {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    @keyframes about-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes about-scroll-dot {
      0% { transform: translateY(0); opacity: 0; }
      30% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(32px); opacity: 0; }
    }
    @keyframes about-sheen {
      0% { transform: translateX(-120%) skewX(-20deg); }
      100% { transform: translateX(220%) skewX(-20deg); }
    }
    .about-marquee-track {
      display: flex;
      width: max-content;
      animation: about-marquee 45s linear infinite;
    }
    .about-marquee-track:hover {
      animation-play-state: paused;
    }
    .about-conic-ring {
      background: conic-gradient(from 0deg, rgba(212, 175, 106, 0.8), rgba(233, 220, 192, 0.2), rgba(212, 175, 106, 0.8));
      animation: about-spin 12s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .about-marquee-track { animation: none !important; }
      .about-conic-ring { animation: none !important; }
    }
`;
    indexHtml = indexHtml.replace('</style>', aboutCss + '\n  </style>');
    console.log('Injected About CSS into index.html');
  }

  // 9b. Transpile FAQ dataset, SiteFooter and Faqs
  let faqsTs = fs.readFileSync('src/data/faqs.ts', 'utf8');
  const faqsJs = transpileTsx(faqsTs, 'faqs.ts');

  const siteFooterTs = fs.readFileSync('src/components/SiteFooter.tsx', 'utf8');
  const siteFooterJs = transpileTsx(siteFooterTs, 'SiteFooter.tsx');

  const faqsPageTs = fs.readFileSync('src/pages/Faqs.tsx', 'utf8');
  const faqsPageJs = transpileTsx(faqsPageTs, 'Faqs.tsx');

  // 9c. Transpile About dataset and About page
  let aboutDataTs = fs.readFileSync('src/data/about.ts', 'utf8');
  const aboutDataJs = transpileTsx(aboutDataTs, 'about.ts');

  const aboutPageTs = fs.readFileSync('src/pages/About.tsx', 'utf8');
  const aboutPageJs = transpileTsx(aboutPageTs, 'About.tsx');

  // 9d. Transpile RecentRentals component
  const recentRentalsTs = fs.readFileSync('src/components/RecentRentals.tsx', 'utf8');
  const recentRentalsJs = transpileTsx(recentRentalsTs, 'RecentRentals.tsx');

  // 9e. Transpile HowItWorks dataset and component
  const howItWorksDataTs = fs.readFileSync('src/data/howItWorks.ts', 'utf8');
  const howItWorksDataJs = transpileTsx(howItWorksDataTs, 'howItWorks.ts');

  const howItWorksTs = fs.readFileSync('src/components/HowItWorks.tsx', 'utf8');
  const howItWorksJs = transpileTsx(howItWorksTs, 'HowItWorks.tsx');

  // Inject RecentRentals & HowItWorks CSS into <style> if missing
  if (!indexHtml.includes('how-travelling-dot-h')) {
    const howCss = `
    /* How It Works Styles */
    @keyframes how-dot-h {
      0% { left: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
    @keyframes how-dot-v {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .how-travelling-dot-h {
      animation: how-dot-h 3.2s linear infinite;
    }
    .how-travelling-dot-v {
      animation: how-dot-v 3.2s linear infinite;
    }
    .how-accent-sheen {
      background: linear-gradient(90deg, #E9DCC0 0%, #D4AF6A 40%, #FFF5DD 50%, #D4AF6A 60%, #E9DCC0 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @keyframes diamond-ring-pulse {
      0% { transform: scale(1) rotate(45deg); opacity: 0.8; }
      100% { transform: scale(1.4) rotate(45deg); opacity: 0; }
    }
    .diamond-pulse-ring {
      animation: diamond-ring-pulse 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
`;
    indexHtml = indexHtml.replace('</style>', howCss + '\n  </style>');
    console.log('Injected How It Works CSS into index.html');
  }

  // Inject RecentRentals CSS and --home-overlap into <style> if missing
  if (!indexHtml.includes('rent-dot-fill')) {
    const rentalsCss = `
    /* Recent Rentals Styles */
    :root {
      --home-overlap: 40px;
    }
    @media (min-width: 640px) {
      :root {
        --home-overlap: 50px;
      }
    }
    @media (min-width: 768px) {
      :root {
        --home-overlap: 60px;
      }
    }
    @keyframes rent-dot-fill {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    .recent-accent-sheen {
      background: linear-gradient(90deg, #A8832F 0%, #D4AF6A 40%, #FFF5DD 50%, #D4AF6A 60%, #A8832F 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
`;
    indexHtml = indexHtml.replace('</style>', rentalsCss + '\n  </style>');
    console.log('Injected Recent Rentals CSS into index.html');
  }

  // Update PropertyShowcase overlap references in index.html
  indexHtml = indexHtml.replace(
    /var\(--services-overlap,\s*60px\)/g,
    'var(--home-overlap, var(--services-overlap, 60px))'
  );

  // 9f. Transpile Locations dataset, FindByLocations and BackToTop
  const locationsDataTs = fs.readFileSync('src/data/locations.ts', 'utf8');
  const locationsDataJs = transpileTsx(locationsDataTs, 'locations.ts');

  const findByLocationsTs = fs.readFileSync('src/components/FindByLocations.tsx', 'utf8');
  const findByLocationsJs = transpileTsx(findByLocationsTs, 'FindByLocations.tsx');

  const backToTopTs = fs.readFileSync('src/components/BackToTop.tsx', 'utf8');
  const backToTopJs = transpileTsx(backToTopTs, 'BackToTop.tsx');

  // 9g. Transpile Site Info dataset, Terms and Privacy pages
  const siteInfoTs = fs.readFileSync('src/data/siteInfo.ts', 'utf8');
  const siteInfoJs = transpileTsx(siteInfoTs, 'siteInfo.ts');

  const termsPageTs = fs.readFileSync('src/pages/Terms.tsx', 'utf8');
  const termsPageJs = transpileTsx(termsPageTs, 'Terms.tsx');

  const privacyPageTs = fs.readFileSync('src/pages/Privacy.tsx', 'utf8');
  const privacyPageJs = transpileTsx(privacyPageTs, 'Privacy.tsx');

  // Inject Flip CDN if missing
  if (!indexHtml.includes('Flip.min.js')) {
    indexHtml = indexHtml.replace(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>',
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js"></script>'
    );
  }

  // Inject Find By Locations CSS into <style> if missing
  if (!indexHtml.includes('loc-accent-sheen')) {
    const locCss = `
    /* Find By Locations Styles */
    @keyframes loc-sheen {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .loc-accent-sheen {
      background: linear-gradient(90deg, #A8832F 0%, #D4AF6A 40%, #FFF5DD 50%, #D4AF6A 60%, #A8832F 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
`;
    indexHtml = indexHtml.replace('</style>', locCss + '\n  </style>');
    console.log('Injected Find By Locations CSS into index.html');
  }

  const newRentComponents = `
    // =========================================================================
    // RENT COMPONENTS (RentCard, RentDetail, RecentRentals, RentCollection, Rent, RentShareRequirement, RentProjects)
    // =========================================================================
    ${rentCardJs}

    ${rentDetailJs}

    ${recentRentalsJs}

    ${rentCollectionJs}

    ${rentJs}

    ${rentShareReqJs}

    ${rentProjectsJs}

    // =========================================================================
    // HOW IT WORKS DATASET & COMPONENT
    // =========================================================================
    ${howItWorksDataJs}

    ${howItWorksJs}

    // =========================================================================
    // FIND BY LOCATIONS DATASET & COMPONENT
    // =========================================================================
    ${locationsDataJs}

    ${findByLocationsJs}

    // =========================================================================
    // BACK TO TOP GLOBAL COMPONENT
    // =========================================================================
    ${backToTopJs}

    // =========================================================================
    // SITE INFO DATASET
    // =========================================================================
    ${siteInfoJs}

    // =========================================================================
    // FAQ DATASET, SITE FOOTER & FAQS PAGE
    // =========================================================================
    ${faqsJs}

    ${siteFooterJs}

    ${faqsPageJs}

    // =========================================================================
    // ABOUT DATASET & ABOUT US PAGE
    // =========================================================================
    ${aboutDataJs}

    ${aboutPageJs}

    // =========================================================================
    // TERMS & PRIVACY PAGES
    // =========================================================================
    ${termsPageJs}

    ${privacyPageJs}
`;

  // Insert before NotFound
  const notFoundMarker = 'const NotFound = () => {';
  const notFoundIdx = indexHtml.indexOf(notFoundMarker);

  // Remove existing RENT COMPONENTS if any were already inserted
  const existingRentMarkers = [
    '// RENT COMPONENTS (RentCard, RentDetail, RecentRentals, RentCollection, Rent, RentShareRequirement, RentProjects)',
    '// RENT COMPONENTS (RentCard, RentDetail, RentCollection, Rent, RentShareRequirement, RentProjects)',
    '// =========================================================================\n    // RENT COMPONENTS'
  ];
  for (const marker of existingRentMarkers) {
    if (indexHtml.includes(marker)) {
      const rStart = indexHtml.indexOf(marker);
      const currNotFoundIdx = indexHtml.indexOf(notFoundMarker);
      if (rStart !== -1 && currNotFoundIdx !== -1 && rStart < currNotFoundIdx) {
        indexHtml = indexHtml.substring(0, rStart) + indexHtml.substring(currNotFoundIdx);
      }
      break;
    }
  }

  const updatedNotFoundIdx = indexHtml.indexOf(notFoundMarker);
  indexHtml = indexHtml.substring(0, updatedNotFoundIdx) + newRentComponents + '\n\n    ' + indexHtml.substring(updatedNotFoundIdx);
  console.log('Inserted RentCard, RentDetail, RentCollection, Rent, RentShareRequirement, RentProjects, SiteFooter, Faqs, About');

  // 10. Update App routes
  const appRoutesAnchor = '<Route path="buy/:slug" element={<BuyCategory />} />';
  const rentRoutes = `
            <Route path="buy/:slug" element={<BuyCategory />} />
            <Route path="rent" element={<Rent />} />
            <Route path="rent/share-requirement" element={<RentShareRequirement />} />
            <Route path="rent/projects" element={<RentProjects />} />
            <Route path="rent/:slug" element={<RentCollection />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="about" element={<About />} />`;

  if (!indexHtml.includes('path="terms"')) {
    if (indexHtml.includes('path="about"')) {
      indexHtml = indexHtml.replace(
        '<Route path="about" element={<About />} />',
        '<Route path="about" element={<About />} />\n            <Route path="terms" element={<Terms />} />\n            <Route path="privacy" element={<Privacy />} />'
      );
    }
    console.log('Added terms and privacy routes to App');
  }

  // Update top contact declarations to siteInfo placeholders
  indexHtml = indexHtml.replace(
    'const CONTACT_PHONE = "+91 91000 00000";',
    'const CONTACT_PHONE = "+91 00000 00000";'
  );
  indexHtml = indexHtml.replace(
    'const CONTACT_EMAIL = "advisory@vesta.in";',
    'const CONTACT_EMAIL = "vip@vesta.example";'
  );
  indexHtml = indexHtml.replace(
    'const WHATSAPP_NUMBER = "91XXXXXXXXXX";',
    'const WHATSAPP_NUMBER = "+91 00000 00000";'
  );

  // Ensure BackToTop is rendered in Layout
  if (!indexHtml.includes('<BackToTop />')) {
    indexHtml = indexHtml.replace(
      '</div>\n        </PageTransitionProvider>',
      '</div>\n          <BackToTop />\n        </PageTransitionProvider>'
    );
    console.log('Added BackToTop to Layout');
  }

  // 11. Validate syntax of the entire Babel block
  console.log('Validating full index.html Babel script syntax...');
  const scriptStart = indexHtml.indexOf('<script type="text/babel">') + '<script type="text/babel">'.length;
  const scriptEnd = indexHtml.lastIndexOf('</script>');
  const fullBabelScript = indexHtml.substring(scriptStart, scriptEnd);

  try {
    Babel.transform(fullBabelScript, {
      presets: [
        ['react', { runtime: 'classic' }]
      ],
      filename: 'index.html.jsx'
    });
    console.log('SUCCESS: Full Babel script compiles with ZERO syntax errors!');
  } catch (err) {
    console.error('Babel compilation error in index.html:', err.message);
    if (err.loc) {
      const errLine = err.loc.line;
      const scriptLines = fullBabelScript.split('\n');
      console.error('Error line context:');
      for (let l = Math.max(0, errLine - 5); l <= Math.min(scriptLines.length - 1, errLine + 5); l++) {
        console.error(`${l + 1}: ${scriptLines[l]}`);
      }
    }
    process.exit(1);
  }

  // Write file
  fs.writeFileSync('index.html', indexHtml, 'utf8');
  console.log('Successfully wrote updated index.html');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
