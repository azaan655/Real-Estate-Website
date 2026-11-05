
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    // React Router DOM primitives with graceful fallback
    const RRD = window.ReactRouterDOM || {};
    const BrowserRouter = RRD.BrowserRouter || (({ children }) => children);
    const Routes = RRD.Routes || (({ children }) => children);
    const Route = RRD.Route || (({ element }) => element);
    const Outlet = RRD.Outlet || (() => null);
    const Link = RRD.Link || (({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>);
    const NavLink = RRD.NavLink || Link;
    const useNavigate = RRD.useNavigate || (() => (to) => { window.location.href = to; });
    const useLocation = RRD.useLocation || (() => window.location);
    const useParams = RRD.useParams || (() => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      return { slug: parts[parts.length - 1] || '' };
    });
    const useSearchParams = RRD.useSearchParams || (() => {
      const [params, setParams] = useState(new URLSearchParams(window.location.search));
      const updateParams = (newP) => {
        const sp = new URLSearchParams(newP);
        setParams(sp);
        window.history.pushState({}, '', '?' + sp.toString());
      };
      return [params, updateParams];
    });

    const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";
    const WHATSAPP_NUMBER = "91XXXXXXXXXX";

    // =========================================================================
    // PAGE TRANSITIONS & SCROLL MANAGEMENT
    // =========================================================================
    const PageTransitionContext = React.createContext({
      transitionTo: () => {},
      isTransitioning: false,
    });
    const usePageTransition = () => React.useContext(PageTransitionContext);

    const PageTransitionProvider = ({ children }) => {
      const [isTransitioning, setIsTransitioning] = useState(false);
      const [curtainLabel, setCurtainLabel] = useState(null);
      const overlayRef = useRef(null);
      const labelWrapRef = useRef(null);
      const navigate = useNavigate();
      const location = useLocation();

      const transitionTo = (to, label) => {
        if (to.startsWith('/#') && location.pathname === '/') {
          const hash = to.replace('/', '');
          window.location.hash = hash;
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        if (to === location.pathname) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurtainLabel(label || null);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const overlay = overlayRef.current;

        if (prefersReducedMotion || !overlay || !window.gsap) {
          navigate(to);
          setIsTransitioning(false);
          setCurtainLabel(null);
          return;
        }

        const tl = window.gsap.timeline({
          onComplete: () => {
            navigate(to);
            window.gsap.to(overlay, {
              yPercent: -100,
              duration: 0.52,
              ease: 'power3.inOut',
              onComplete: () => {
                window.gsap.set(overlay, { yPercent: 100 });
                setIsTransitioning(false);
                setCurtainLabel(null);
              },
            });
          },
        });

        tl.fromTo(overlay, { yPercent: 100 }, { yPercent: 0, duration: 0.52, ease: 'power3.inOut' });
        if (labelWrapRef.current) {
          tl.fromTo(labelWrapRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.2);
        }
      };

      return (
        <PageTransitionContext.Provider value={{ transitionTo, isTransitioning, curtainLabel }}>
          {children}
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] bg-[#0C0C0C] pointer-events-none translate-y-full flex flex-col items-center justify-center px-6"
          >
            <div ref={labelWrapRef} className="flex flex-col items-center text-center">
              <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mb-3 animate-pulse" />
              {curtainLabel ? (
                <span className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-white tracking-[-0.01em]">
                  {curtainLabel}
                </span>
              ) : (
                <span className="font-sans text-xs tracking-[0.25em] text-white/50 uppercase">
                  VESTA
                </span>
              )}
            </div>
          </div>
        </PageTransitionContext.Provider>
      );
    };

    const TransitionLink = ({ to, children, className = '', activeClassName = '', transitionLabel, onClick, ...rest }) => {
      const { transitionTo } = usePageTransition();
      const location = useLocation();
      const isExactActive = location.pathname === to;
      const combined = (className + ' ' + (isExactActive ? activeClassName : '')).trim();

      const handleClick = (e) => {
        e.preventDefault();
        if (onClick) onClick(e);
        transitionTo(to, transitionLabel);
      };

      return (
        <a href={to} onClick={handleClick} className={combined} {...rest}>
          {children}
        </a>
      );
    };

    const ScrollManager = () => {
      const { pathname, hash } = useLocation();

      useEffect(() => {
        if (pathname.startsWith('/buy/')) {
          const slug = pathname.replace('/buy/', '').split('?')[0];
          const cfg = typeof BUY_PAGE_CONFIGS !== 'undefined' ? BUY_PAGE_CONFIGS[slug] : null;
          document.title = cfg ? `${cfg.label} | VESTA` : 'VESTA | Luxury Real Estate';
        } else if (pathname === '/buy') {
          document.title = 'Buy Luxury Real Estate in Hyderabad | VESTA';
        } else if (pathname === '/services') {
          document.title = 'Services | VESTA';
        } else if (pathname === '/faqs') {
          document.title = "FAQ's | VESTA";

        } else if (pathname === '/') {
          document.title = 'VESTA | Luxury Real Estate in Hyderabad';
        } else {
          document.title = 'VESTA | Luxury Real Estate';
        }

        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });










      }, [pathname, hash]);

      return null;
    };

    // =========================================================================
    // HERO COMPONENTS
    // =========================================================================
    const FadeIn = ({ delay = 0, duration = 800, y = 0, children, className = '' }) => {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setIsVisible(true);
          return;
        }
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
      }, [delay]);

      return (
        <div
          className={`transition-all ${className}`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : `translateY(${y}px)`,
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {children}
        </div>
      );
    };

    const AnimatedHeading = ({ text, delay = 300, charDelay = 22, className = '' }) => {
      const [isTriggered, setIsTriggered] = useState(false);
      const [reducedMotion, setReducedMotion] = useState(false);

      useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setReducedMotion(true);
          setIsTriggered(true);
          return;
        }
        const timer = setTimeout(() => setIsTriggered(true), delay);
        return () => clearTimeout(timer);
      }, [delay]);

      const lines = text.split('\n').map((lineStr) => {
        const segments = [];
        const parts = lineStr.split('*');
        let isItalic = false;

        for (let i = 0; i < parts.length; i++) {
          if (parts[i].length > 0) {
            segments.push({ text: parts[i], isItalic });
          }
          isItalic = !isItalic;
        }

        const totalLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
        return { segments, totalLength };
      });

      return (
        <h1 className={className}>
          {lines.map((line, lineIndex) => {
            let globalCharIndexInLine = 0;

            return (
              <span key={lineIndex} className="block overflow-hidden pb-[0.12em]">
                {line.segments.map((segment, segIndex) => {
                  const chars = segment.text.split('');

                  return (
                    <span
                      key={segIndex}
                      style={segment.isItalic ? { color: '#E9DCC0', fontStyle: 'italic' } : undefined}
                    >
                      {chars.map((char, cIdx) => {
                        const charIndex = globalCharIndexInLine++;
                        const staggerDelay = reducedMotion
                          ? 0
                          : lineIndex * line.totalLength * charDelay * 0.6 + charIndex * charDelay;

                        return (
                          <span
                            key={cIdx}
                            className="inline-block"
                            style={{
                              opacity: isTriggered ? 1 : 0,
                              transform: isTriggered ? 'translateY(0)' : 'translateY(110%)',
                              filter: isTriggered ? 'blur(0)' : 'blur(6px)',
                              transition: reducedMotion
                                ? 'none'
                                : 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1)',
                              transitionDelay: reducedMotion ? '0ms' : `${staggerDelay}ms`,
                              willChange: 'transform, opacity, filter',
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h1>
      );
    };

    // =========================================================================
    // =========================================================================
    // HYDERABAD PROPERTIES DATA & PRICE FORMATTERS
    // =========================================================================
    const formatPrice = (priceCr) => {
      if (priceCr < 1) {
        const lakhs = Math.round(priceCr * 100);
        return '\u20B9' + lakhs + ' L';
      }
      const formatted = priceCr % 1 === 0 ? priceCr.toString() : parseFloat(priceCr.toFixed(2)).toString();
      return '\u20B9' + formatted + ' Cr';
    };

    const pricePerUnit = (p) => {
      const rate = Math.round((p.priceCr * 1e7) / p.area);
      return '\u20B9' + rate.toLocaleString('en-IN') + ' / ' + p.areaUnit;
    };

    const budgetBucket = (p) => {
      if (p.priceCr < 0.5) return 'under-50-lacs';
      if (p.priceCr < 1) return '50-lacs-to-1-cr';
      if (p.priceCr < 5) return '1-cr-to-5-cr';
      return 'above-5-cr';
    };

    const bhkBucket = (p) => {
      if (p.beds === 1) return '1-bhk';
      if (p.beds === 2) return '2-bhk';
      if (p.beds === 3) return '3-bhk';
      if (p.beds === 4) return '4-bhk';
      if (p.beds !== null && p.beds > 4) return '4-plus-bhk';
      return 'none';
    };

    const getKeyDetails = (p) => {
      if (p.keyDetails && p.keyDetails.length > 0) {
        return p.keyDetails;
      }
      return [
        { label: 'Configuration', value: (p.beds || 0) + ' BHK \u00B7 ' + (p.baths || 0) + ' Bath' },
        { label: 'Facing', value: p.facing },
        { label: 'Possession', value: p.possession }
      ];
    };

    const propertiesData = [
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



    // =========================================================================
    // BUY TAXONOMY & MEGA MENU DATA
    // =========================================================================
    const BUY_TAXONOMY_GROUPS = [
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

    const getFilterForSlug = (slug) => {
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

    const countFor = (slug) => {
      const filter = getFilterForSlug(slug);
      return propertiesData.filter(filter).length;
    };

    const getPropertiesForSlug = (slug) => {
      const filter = getFilterForSlug(slug);
      return propertiesData.filter(filter);
    };

    const getPropertiesWithFallback = (slug) => {
      const primary = getPropertiesForSlug(slug);
      if (primary.length >= 3) {
        return { primary, suggestions: [] };
      }
      const existingIds = new Set(primary.map((p) => p.id));
      const suggestions = [];
      const targetSample = primary[0] || propertiesData[0];
      const targetBudget = budgetBucket(targetSample);

      const budgetMatches = propertiesData.filter(
        (p) => !existingIds.has(p.id) && budgetBucket(p) === targetBudget
      );
      for (const p of budgetMatches) {
        if (primary.length + suggestions.length >= 3) break;
        suggestions.push(p);
        existingIds.add(p.id);
      }

      if (primary.length + suggestions.length < 3) {
        const typeMatches = propertiesData.filter(
          (p) => !existingIds.has(p.id) && p.type === targetSample.type
        );
        for (const p of typeMatches) {
          if (primary.length + suggestions.length >= 3) break;
          suggestions.push(p);
          existingIds.add(p.id);
        }
      }

      if (primary.length + suggestions.length < 3) {
        for (const p of propertiesData) {
          if (!existingIds.has(p.id)) {
            suggestions.push(p);
            existingIds.add(p.id);
            if (primary.length + suggestions.length >= 3) break;
          }
        }
      }

      return { primary, suggestions };
    };

    const BUY_PAGE_CONFIGS = {
  // =========================================================================
  // 1. POPULAR CHOICES
  // =========================================================================
  'ready-to-move': {
    slug: 'ready-to-move',
    group: 'popular',
    label: 'Ready to Move',
    eyebrow: 'Popular Choice \u00B7 Ready to Move',
    headline: 'Homes that are\n*ready when you are.*',
    lead: 'No waiting and no construction risk. Every residence here is complete, inspected and available for registration and possession.',
    theme: {
      mode: 'light',
      bg: '#F5F1E8',
      ink: '#0C0C0C',
      accent: '#2E9C8A',
      accentInk: '#1D7A6B',
      dark1: '#24352F',
      dark2: '#09110E',
    },
    displayFont: 'fraunces',
    motion: 'maskRise',
    modules: [
      {
        kind: 'timeline',
        title: 'From viewing to move-in',
        steps: [
          { title: 'Private viewing', text: 'Inspect finishes, fittings, structural integrity, seepage risks, and water pressure firsthand with our property specialists.' },
          { title: 'Document review', text: 'Scrutinize the sale deed draft, Occupancy Certificate, encumbrance certificate, and sanctioned building drawings.' },
          { title: 'Agreement and token', text: 'Agree on indicative transaction terms, payment milestones, and token schedule formally in writing.' },
          { title: 'Registration', text: 'Complete stamp duty disbursement and deed registration at the competent local sub-registrar office.' },
          { title: 'Possession', text: 'Key handover, utility meter transfers, society no-objection certificate, and maintenance corpus deposit.' },
        ],
      },
    ],
    faq: [
      {
        q: 'What is an Occupancy Certificate and why does it matter?',
        hint: 'An Occupancy Certificate is issued by local civic planning bodies after construction is fully completed. It certifies that the building has been erected in strict accordance with approved blueprints, safety provisions, and infrastructure standards. Securing an OC is essential before taking possession. Buyers should verify all title and certification documents with a qualified legal advocate.',
      },
      {
        q: 'Can I negotiate on a ready property?',
        hint: 'Yes. Because ready-to-move homes eliminate construction speculation, developers and private sellers often have flexibility regarding final indicative pricing, registration cost adjustments, or inclusive parking allocations within prevailing market boundaries. Terms depend on local micro-market inventory levels. Buyers are advised to consult a property advisor and financial professional before finalizing agreements.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'under-construction': {
    slug: 'under-construction',
    group: 'popular',
    label: 'Under Construction',
    eyebrow: 'Popular Choice \u00B7 Under Construction',
    headline: 'Build your future,\n*one floor at a time.*',
    lead: "Lower entry prices and milestone-linked payment plans for projects still rising. Check the RERA registration and the builder's track record before you book.",
    theme: {
      mode: 'light',
      bg: '#EDF1F6',
      ink: '#0C0C0C',
      accent: '#4FA3D9',
      accentInk: '#1F6FA8',
      dark1: '#14263C',
      dark2: '#060D17',
    },
    displayFont: 'grotesk',
    motion: 'blueprint',
    modules: [
      {
        kind: 'timeline',
        title: 'How construction-linked payments work',
        intro: 'Payments are linked to construction milestones; confirm the exact schedule in your agreement.',
        steps: [
          { title: 'Booking', text: 'Token amount to reserve the unit.' },
          { title: 'Agreement for sale', text: 'Signed with the payment schedule.' },
          { title: 'Foundation and structure', text: 'Instalments follow progress.' },
          { title: 'Finishing', text: 'Flooring, fittings, painting.' },
          { title: 'Possession', text: 'Final instalment, handover.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Before you book',
        items: [
          'Confirm the RERA registration number and validity on the state RERA website',
          "Review the promoter's earlier projects and delivery record",
          'Check approved plans and the stated completion date',
          'Understand GST applicability on under-construction homes and verify the current rate',
          'Read the delay and refund clauses in the agreement',
        ],
      },
    ],
    faq: [
      {
        q: 'What if the project is delayed?',
        hint: 'Under RERA regulations, homebuyers are protected against project delivery delays. Registered developer agreements must stipulate concrete completion timelines alongside interest obligations payable to buyers for delayed periods or exit refund mechanisms. Buyers experiencing substantial delays should review agreement covenants carefully and seek guidance from an accredited real estate legal professional.',
      },
      {
        q: 'Is GST applicable on under-construction homes?',
        hint: 'Goods and Services Tax is generally applicable on under-construction real estate purchases at standard government rates, typically without input tax credit benefits, whereas completed units with an Occupancy Certificate are exempt. Tax structures and rates vary periodically. Buyers should independently verify applicable indicative tax slabs with a certified chartered accountant or tax consultant.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'new-launch': {
    slug: 'new-launch',
    group: 'popular',
    label: 'New Launch',
    eyebrow: 'Popular Choice \u00B7 New Launch',
    headline: 'First in line,\n*first pick.*',
    lead: 'Fresh launches priced for early buyers, with the widest choice of floors, facings and layouts before inventory narrows.',
    theme: {
      mode: 'light',
      bg: '#FBF3EC',
      ink: '#0C0C0C',
      accent: '#FF6A2B',
      accentInk: '#C2410C',
      dark1: '#3A1A10',
      dark2: '#120704',
    },
    displayFont: 'grotesk',
    motion: 'ticker',
    numeral: 'NEW LAUNCH \u00B7 EARLY ACCESS \u00B7 PRIVATE PREVIEW \u00B7 LIMITED UNITS',
    modules: [
      {
        kind: 'factGrid',
        title: 'Why buy at launch',
        facts: [
          { label: 'Widest choice', value: 'Pick your floor, facing and layout before the best units go' },
          { label: 'Early pricing', value: 'Launch offers and introductory price points' },
          { label: 'Flexible plans', value: 'Payment schemes designed for early bookings' },
          { label: 'Time to plan', value: 'A longer runway to arrange funds and loans' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Verify before paying a booking amount',
        items: [
          'RERA registration for the project',
          'Land title and approvals',
          "Developer's delivery record",
          'Written payment schedule and refund terms',
        ],
      },
    ],
    faq: [
      {
        q: 'Is it safe to book at launch?',
        hint: "Booking during a fresh launch offers pricing benefits and premium inventory choices, provided all statutory RERA registrations, layout approvals, and title sanctions are in place. Investors must evaluate the promoter's historic execution capability and financial backing. Prospective buyers should always verify legal approvals and contractual covenants with an independent legal advisor.",
      },
      {
        q: 'How do I get early access to upcoming launches?',
        hint: 'Priority allocations and private preview windows are typically shared with accredited client advisory networks prior to public release. Registering with our advisory desk provides advance notice of verified upcoming developments, indicative pricing sheets, and unit layout drafts. Buyers should review all initial documentation with their property and wealth advisors.',
      },
    ],
    cta: { label: 'Join the Launch List' },
  },

  'featured-properties': {
    slug: 'featured-properties',
    group: 'popular',
    label: 'Featured Properties',
    eyebrow: 'Popular Choice \u00B7 Featured',
    headline: 'Hand-picked,\n*by our advisors.*',
    lead: 'A short list of exceptional homes selected for location, build quality and long-term value, each reviewed in person by our team.',
    theme: {
      mode: 'light',
      bg: '#FAF8F4',
      ink: '#0C0C0C',
      accent: '#D4AF6A',
      accentInk: '#A8832F',
      dark1: '#3A3226',
      dark2: '#0B0906',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'personas',
        title: 'How we select',
        cards: [
          { title: 'Location and connectivity', text: 'Micro-market strength, commute and everyday convenience.' },
          { title: 'Build quality and approvals', text: 'Construction standards, specifications and documentation.' },
          { title: 'Fair pricing', text: 'Compared against recent transactions in the locality.' },
          { title: 'Long-term value', text: 'Resale demand, rental potential and neighbourhood growth.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How are featured properties chosen?',
        hint: 'Our advisory team evaluates each candidate residence against strict benchmarks: micro-market connectivity, clear title verification, superior construction specifications, and defensible historical valuations. Only homes demonstrating balanced lifestyle utility and reliable capital appreciation potential are highlighted. Buyers are encouraged to review all indicative valuations and property titles with their independent legal counsel.',
      },
      {
        q: 'Can I request a private tour?',
        hint: 'Yes. Private guided viewings can be arranged for any featured residence through our advisory desk. Our property consultants accompany prospective buyers on dedicated walkthroughs to inspect architectural finishes, community amenities, and surrounding neighborhood infrastructure. We recommend coordinating with our team to align viewing schedules with your convenience.',
      },
    ],
    cta: { label: 'Request a Private Tour' },
  },

  // =========================================================================
  // 2. PROPERTY TYPES
  // =========================================================================
  'flats-apartments': {
    slug: 'flats-apartments',
    group: 'type',
    label: 'Flats/Apartments',
    eyebrow: 'Property Type \u00B7 Flats and Apartments',
    headline: 'Skyline living,\n*simplified.*',
    lead: 'From compact 1 BHKs to full-floor penthouses, in gated communities with security, parking and clubhouse life built in.',
    theme: {
      mode: 'light',
      bg: '#F1F3F6',
      ink: '#0C0C0C',
      accent: '#8FA3B8',
      accentInk: '#4E6580',
      dark1: '#26303C',
      dark2: '#0A0D12',
    },
    displayFont: 'instrument',
    motion: 'maskRise',
    modules: [
      {
        kind: 'table',
        title: 'Typical sizes by BHK',
        head: ['Configuration', 'Typical super built-up area'],
        rows: [
          ['1 BHK', '450 - 700 sq ft'],
          ['2 BHK', '900 - 1,300 sq ft'],
          ['3 BHK', '1,400 - 2,200 sq ft'],
          ['4 BHK', '2,500 - 4,000 sq ft'],
        ],
        note: 'Indicative ranges for projects in Hyderabad; actual sizes vary by project.',
      },
      {
        kind: 'checklist',
        title: 'Check before you choose',
        items: [
          'Power backup for common areas and lifts',
          'Covered and allotted parking',
          'Lifts, security and visitor management',
          'Clubhouse, pool and play areas',
          'Maintenance charge per sq ft and corpus fund',
          'Water supply and drainage',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the difference between carpet, built-up and super built-up area?',
        hint: 'Carpet area represents net usable floor space inside internal walls. Built-up area includes the carpet area plus thickness of external walls and exclusive balconies. Super built-up area incorporates proportionate shares of shared spaces like lobbies, lifts, and staircases. Always request RERA carpet measurements in writing and verify area schedules with an architect.',
      },
      {
        q: 'What are maintenance and corpus charges?',
        hint: 'Maintenance charges cover recurring monthly operational expenditures including security, common electricity, landscaping, and lift servicing. The corpus or sinking fund is a one-time reserve collected for future major capital repairs or structural upgrades. Always ask developers or resident associations for itemized indicative billing schedules before signing your property purchase contract.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'independent-houses': {
    slug: 'independent-houses',
    group: 'type',
    label: 'Independent Houses',
    eyebrow: 'Property Type \u00B7 Independent Houses',
    headline: 'A home that is\n*entirely yours.*',
    lead: 'Own the land beneath your home. Independent houses offer privacy, room to extend and a garden of your own.',
    theme: {
      mode: 'light',
      bg: '#FAF2EA',
      ink: '#0C0C0C',
      accent: '#C2693C',
      accentInk: '#9A4A22',
      dark1: '#4A2A1B',
      dark2: '#150C07',
    },
    displayFont: 'fraunces',
    motion: 'contour',
    modules: [
      {
        kind: 'personas',
        title: 'What to understand',
        cards: [
          { title: 'Land and built-up', text: 'You pay for both the plot and the structure; ask for each separately.' },
          { title: 'Facing and vastu', text: "East and north-east facing homes are often preferred; check the plot's orientation." },
          { title: 'Setbacks and approvals', text: 'Confirm the building permission and the completed structure match.' },
          { title: 'Resale follows the plot', text: 'Location, plot size and road width drive long-term value.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Inspect before you buy',
        items: [
          'Title chain and an encumbrance certificate',
          'Building permission and completion documents',
          'Boundaries and the survey number',
          'Structure, plumbing and electrical condition',
          'Water source, drainage and road access',
        ],
      },
    ],
    faq: [
      {
        q: 'How is an independent house valued?',
        hint: 'An independent home valuation separates underlying plot land value from depreciated structure construction costs. Land rates reflect prevailing per-square-yard market transactions, road width, and municipal zone permissions, while structural valuation considers age, maintenance, and material specifications. We recommend obtaining an independent appraisal from a certified government-approved valuer before finalizing terms.',
      },
      {
        q: 'Can I add another floor later?',
        hint: 'Vertical expansions depend strictly on municipal sanction approvals, Floor Space Index (FSI) limits, and existing structural foundation load capacity. Even if zoning permits extra floors, existing columns and footings must be certified by a structural engineer. Verify local municipal town-planning guidelines and title documents with a qualified architect or property lawyer.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'villas': {
    slug: 'villas',
    group: 'type',
    label: 'Villas',
    eyebrow: 'Property Type \u00B7 Villas',
    headline: 'Estate living,\n*beautifully private.*',
    lead: 'Gated villas and standalone estates with private gardens, pools and a true sense of arrival, built for generations.',
    theme: {
      mode: 'light',
      bg: '#F8F5EF',
      ink: '#0C0C0C',
      accent: '#B88A44',
      accentInk: '#8A6420',
      dark1: '#3B2A18',
      dark2: '#0E0905',
    },
    displayFont: 'cormorant',
    motion: 'goldSweep',
    modules: [
      {
        kind: 'factGrid',
        title: 'Four ways to own a villa',
        facts: [
          { label: 'Gated-community villa', value: 'Shared clubhouse, security and landscaping with a private plot.' },
          { label: 'Standalone estate', value: 'A single residence on a large plot with total privacy.' },
          { label: 'Row villa or townhouse', value: 'Connected homes with private gardens at a gentler price.' },
          { label: 'Farm villa', value: 'A weekend estate on larger land outside the city.' },
        ],
      },
      {
        kind: 'checklist',
        title: 'Villa essentials',
        items: [
          'Plot area versus built-up area',
          'Clubhouse, security and common-area upkeep',
          'Monthly maintenance and corpus fund',
          'Staff quarters and parking',
          'Pool, lift and automation provisions',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the difference between a villa and an independent house?',
        hint: 'While independent houses are usually standalone residential plots on public roads, villas are typically developed within master-planned gated enclaves offering centralized security, landscaped parks, and private clubhouse amenities. Gated villas combine independent plot ownership with organized community services. Prospective buyers should inspect society by-laws and maintenance contracts with their legal advisor.',
      },
      {
        q: 'Are gated villas better for resale?',
        hint: 'Gated community villas often sustain resilient resale liquidity and rental interest due to integrated security, professional grounds upkeep, and lifestyle amenities. However, long-term capital appreciation remains heavily influenced by micro-market proximity, road infrastructure, and developer maintenance standards. Always evaluate historical transaction benchmarks with a licensed property professional.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'plots-land': {
    slug: 'plots-land',
    group: 'type',
    label: 'Plots/Land',
    eyebrow: 'Property Type \u00B7 Plots and Land',
    headline: 'Own the land.\n*Build the legacy.*',
    lead: "Clear-title plots in Hyderabad's growth corridors, for a home of your own design or a patient long-term investment.",
    theme: {
      mode: 'light',
      bg: '#F3F2E9',
      ink: '#0C0C0C',
      accent: '#8A9A4B',
      accentInk: '#5E6B2C',
      dark1: '#2F3420',
      dark2: '#0C0E07',
    },
    displayFont: 'fraunces',
    motion: 'contour',
    modules: [
      {
        kind: 'checklist',
        title: 'Plot due diligence',
        items: [
          'Verify the title chain and link documents',
          'Get an encumbrance certificate',
          'Confirm the layout approval (HMDA or DTCP) and the plot demarcation on site',
          'Check the survey number and the road width',
          'Confirm facing and shape (vastu preferences)',
          'Compare the price per sq yd with nearby layouts',
          'Visit the site and verify the boundaries yourself',
        ],
      },
      {
        kind: 'plotTools',
        title: 'Plot calculator',
      },
    ],
    faq: [
      {
        q: 'What is the difference between an approved and an unapproved layout?',
        hint: 'Approved layouts carry formal sanctions from authorities like HMDA or DTCP, ensuring legitimate road widths, open green spaces, and utility reservations. Unapproved agricultural sub-divisions lack sanctioned permissions and may face steep regularization fees or legal injunctions. We strongly advise buyers to conduct a rigorous link document title search with an accredited land advocate.',
      },
      {
        q: 'Can I start building right after buying a plot?',
        hint: 'Construction cannot begin immediately after land deed registration. You must first secure sanctioned building drawings from the municipal town-planning authority, which requires soil tests, structural blueprints, and fee disbursements. Allow ample time and budget for statutory clearances, and consult an architectural firm and legal advisor before breaking ground.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'commercial': {
    slug: 'commercial',
    group: 'type',
    label: 'Commercial',
    eyebrow: 'Property Type \u00B7 Commercial',
    headline: 'Space that\n*works for you.*',
    lead: "Office suites, retail showrooms and income-ready commercial space across Hyderabad's business districts.",
    theme: {
      mode: 'light',
      bg: '#F2F2F0',
      ink: '#0C0C0C',
      accent: '#E3A72F',
      accentInk: '#9B6A06',
      dark1: '#2A2D31',
      dark2: '#0A0B0C',
    },
    displayFont: 'grotesk',
    motion: 'blueprint',
    modules: [
      {
        kind: 'yield',
        title: 'Rental yield calculator',
      },
      {
        kind: 'factGrid',
        title: 'What to evaluate',
        facts: [
          { label: 'Location and footfall', value: 'Visibility, access and surrounding demand.' },
          { label: 'Floor and frontage', value: 'Floor height, frontage and signage rights.' },
          { label: 'Parking ratio', value: 'Parking for staff, visitors and customers.' },
          { label: 'Lease terms', value: 'Tenure, escalation and lock-in in existing leases.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How do I evaluate the rental yield of a commercial property?',
        hint: 'Gross indicative rental yield is computed by dividing expected annual lease income by total acquisition cost including registration expenses. Net yield further deducts property taxes, insurance, and maintenance voids. Commercial office yields typically surpass residential yields but involve tenancy vacancy risks. Investors should verify tenancy lease documents and financial metrics with a qualified chartered accountant.',
      },
      {
        q: 'What lease terms are common for commercial space?',
        hint: 'Institutional commercial leases typically span nine-year terms with structured three-year rent escalations of ten to fifteen percent and mandatory lock-in periods for both parties. Inclusions such as tenant fit-out periods, security deposits, and common area maintenance must be vetted. Always review corporate lease agreements with a commercial real estate lawyer.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  // =========================================================================
  // 3. BUDGET
  // =========================================================================
  'under-50-lacs': {
    slug: 'under-50-lacs',
    group: 'budget',
    label: 'Under \u20B950 Lacs',
    eyebrow: 'Budget \u00B7 Under \u20B950 Lacs',
    headline: 'Your first home\nstarts *here.*',
    lead: 'Compact apartments and plots under \u20B950 Lacs, chosen for location, legal clarity and long-term appreciation.',
    theme: {
      mode: 'light',
      bg: '#FBF3F0',
      ink: '#0C0C0C',
      accent: '#F0846A',
      accentInk: '#C2503A',
      dark1: '#4A231B',
      dark2: '#140806',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '50L',
    modules: [
      {
        kind: 'personas',
        title: 'Smart starter tips',
        cards: [
          { title: 'Legal clarity first', text: 'A clean title beats extra square feet.' },
          { title: 'Choose connectivity', text: 'Metro, ring road and IT corridor access lift both rent and resale.' },
          { title: 'Plan your margin', text: 'Keep the down payment and loan margin ready before booking.' },
          { title: 'Keep a buffer', text: 'Budget for registration, moving and interiors.' },
        ],
      },
      {
        kind: 'emi',
        title: 'Estimate your EMI',
        presetPriceCr: 0.4,
      },
    ],
    faq: [
      {
        q: 'How much down payment do I need?',
        hint: "Banks and housing finance companies usually provide loans covering up to eighty percent of the property's sanctioned agreement value, requiring the buyer to fund the remaining twenty percent down payment. Additional costs including stamp duty, registration fees, and GST must be budgeted separately. Always verify current loan eligibility parameters with your lending bank.",
      },
      {
        q: 'At this budget, is a flat or a plot better?',
        hint: 'Deciding between a flat or plot depends on your housing timeline. A ready apartment delivers immediate living utility or monthly rental income, whereas a clear-title plot in an emerging corridor may yield greater long-term land appreciation without building depreciation. Buyers should evaluate personal cash flow with a certified financial advisor.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '50-lacs-to-1-cr': {
    slug: '50-lacs-to-1-cr',
    group: 'budget',
    label: '\u20B950 Lacs - \u20B91 Cr',
    eyebrow: 'Budget \u00B7 \u20B950 Lacs - \u20B91 Cr',
    headline: 'Smart space,\n*smarter value.*',
    lead: 'Well-connected 2 BHKs and office suites between \u20B950 Lacs and \u20B91 Cr, where the right location makes every rupee count.',
    theme: {
      mode: 'light',
      bg: '#FBF2F3',
      ink: '#0C0C0C',
      accent: '#B5485D',
      accentInk: '#8C2A3F',
      dark1: '#3A1522',
      dark2: '#12060A',
    },
    displayFont: 'fraunces',
    motion: 'numeral',
    numeral: '1Cr',
    modules: [
      {
        kind: 'table',
        title: 'What this range typically buys',
        head: ['Option', 'Where it fits'],
        rows: [
          ['2 BHK apartment', 'Growth corridors and established neighbourhoods'],
          ['1 - 2 BHK in a prime area', 'Smaller footprint in premium localities'],
          ['Office suite', 'Fitted suites in IT corridors'],
          ['Plot on the outskirts', 'Large plots for long-term appreciation'],
        ],
        note: 'Indicative only; availability varies.',
      },
      {
        kind: 'emi',
        title: 'Estimate your EMI',
        presetPriceCr: 0.75,
      },
    ],
    faq: [
      {
        q: 'Is it better to buy ready or under construction at this price?',
        hint: 'Ready properties eliminate construction wait times, rental overlaps, and delivery uncertainty, but carry higher upfront capital outlays. Under-construction units offer staggered milestone payments and lower entry valuations, though requiring RERA delivery monitoring. Balance your immediate housing requirements and risk appetite, and review terms with an experienced real estate advisor.',
      },
      {
        q: 'What loan tenure keeps the EMI comfortable?',
        hint: 'A longer indicative home loan tenure of twenty to twenty-five years reduces monthly EMI obligations, improving household liquidity, but substantially increases total cumulative interest payable over the loan life. Shorter tenures minimize borrowing costs but require higher monthly disposable income. Consult with a qualified mortgage specialist to model optimal repayment terms.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '1-cr-to-5-cr': {
    slug: '1-cr-to-5-cr',
    group: 'budget',
    label: '\u20B91 Cr - \u20B95 Cr',
    eyebrow: 'Budget \u00B7 \u20B91 Cr - \u20B95 Cr',
    headline: 'The sweet spot of\n*premium living.*',
    lead: 'Spacious 3 BHKs, independent houses and premium commercial space, where size, location and amenities find their balance.',
    theme: {
      mode: 'light',
      bg: '#F1F4F8',
      ink: '#0C0C0C',
      accent: '#D4AF6A',
      accentInk: '#A8832F',
      dark1: '#1B2A44',
      dark2: '#070C16',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '5Cr',
    modules: [
      {
        kind: 'compare',
        title: 'Compare side by side',
      },
      {
        kind: 'personas',
        title: 'What to compare',
        cards: [
          { title: 'Price per unit', text: 'Compare per sq ft or sq yd, not just the total.' },
          { title: 'Possession', text: 'Ready versus under construction changes risk and cost.' },
          { title: 'Facing and layout', text: 'Light, ventilation and usable space matter most.' },
          { title: 'Extras', text: 'Budget for registration, parking, maintenance deposit and interiors.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How do I compare price per sq ft across projects?',
        hint: 'Ensure comparisons evaluate standardized units by checking RERA carpet area alongside super built-up claims. A project with a lower quoted super built-up rate may actually be pricier per carpet square foot if loading exceeds expectations. Request audited architectural area schedules and verify price breakdowns with an independent property consultant.',
      },
      {
        q: 'What extras should I budget for beyond the price?',
        hint: 'Beyond base agreement value, buyers should budget for statutory stamp duty and registration fees, applicable GST, dedicated covered parking allocations, club membership deposits, and advance society maintenance corpus reserves. Bespoke interior fit-outs can add ten to fifteen percent. Verify comprehensive all-inclusive indicative cost sheets with your sales advisor.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  'above-5-cr': {
    slug: 'above-5-cr',
    group: 'budget',
    label: 'Above \u20B95 Cr',
    eyebrow: 'Budget \u00B7 Above \u20B95 Cr',
    headline: 'Residences of\n*rare distinction.*',
    lead: 'Penthouses, estates and statement commercial addresses above \u20B95 Cr. Many are shown privately and never listed publicly.',
    theme: {
      mode: 'dark',
      bg: '#0A0C12',
      ink: '#F4EFE6',
      accent: '#C8B07A',
      accentInk: '#E3D3A8',
      dark1: '#1A2233',
      dark2: '#04060B',
    },
    displayFont: 'cormorant',
    motion: 'numeral',
    numeral: '5Cr+',
    modules: [
      {
        kind: 'concierge',
        title: 'Private client services',
        items: [
          'Private viewings by appointment',
          'Off-market opportunities shared discreetly',
          'Confidential negotiation',
          'Coordination with legal and wealth advisors',
          'Relocation and staging support',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Do you offer off-market listings?',
        hint: 'Yes. Prominent trophy estates, bespoke penthouses, and signature land parcels are routinely represented off-market to preserve owner privacy and transaction confidentiality. These discreet opportunities are made available exclusively to verified private clients through dedicated advisory introductions. Register your confidential mandate with our senior desk to access private portfolios.',
      },
      {
        q: 'Can you assist overseas buyers?',
        hint: 'Our advisory desk provides end-to-end representation for overseas citizens and NRI investors, managing virtual walkthroughs, Power of Attorney protocols, NRE/NRO banking transfers, and statutory tax compliance. All international remittances and FEMA property acquisition rules should be validated with an accredited international tax advisor and qualified legal attorney.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

  // =========================================================================
  // 4. BHK TYPE
  // =========================================================================
  '1-bhk': {
    slug: '1-bhk',
    group: 'bhk',
    label: '1 BHK',
    eyebrow: 'BHK Type \u00B7 1 BHK',
    headline: 'Small footprint,\n*big start.*',
    lead: 'Efficient 1 BHK homes for first-time buyers, young professionals and investors seeking steady rental demand.',
    theme: {
      mode: 'light',
      bg: '#FBF8F2',
      ink: '#0C0C0C',
      accent: '#E4C896',
      accentInk: '#A07A38',
      dark1: '#4B4132',
      dark2: '#15110C',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '1',
    modules: [
      {
        kind: 'personas',
        title: 'Who it suits',
        cards: [
          { title: 'First-time buyers', text: 'A manageable price and EMI.' },
          { title: 'Young professionals', text: 'Close to work with low upkeep.' },
          { title: 'Investors', text: 'Strong rental demand near IT hubs.' },
          { title: 'Second homes', text: 'A simple base in the city.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '450 - 700 sq ft'],
          ['Households', '1 - 2 people'],
          ['Best for', 'Starter home or rental'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: 'Is a 1 BHK a good investment?',
        hint: 'Compact 1 BHK homes located near employment hubs and metro corridors generally command high occupancy rates and attractive percentage yields due to sustained young professional demand. However, resale appreciation may trail family-sized 2 and 3 BHK layouts over long investment horizons. Review local rental absorption rates with a certified financial advisor.',
      },
      {
        q: 'Can I upgrade later?',
        hint: 'Starter homes offer high liquidity when positioned in established micro-markets, allowing owners to build early home equity before upgrading to larger residential configurations. Future transition planning must factor in capital gains tax exemptions, loan transfer fees, and brokerage costs. Consult a chartered accountant to optimize your transition roadmap.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '2-bhk': {
    slug: '2-bhk',
    group: 'bhk',
    label: '2 BHK',
    eyebrow: 'BHK Type \u00B7 2 BHK',
    headline: 'Room to grow,\n*without the stretch.*',
    lead: 'The most sought-after layout in the city: two bedrooms for small families and home offices, with steady resale demand.',
    theme: {
      mode: 'light',
      bg: '#F8F3EA',
      ink: '#0C0C0C',
      accent: '#D9B77A',
      accentInk: '#9A7230',
      dark1: '#45382A',
      dark2: '#130F0A',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '2',
    modules: [
      {
        kind: 'checklist',
        title: 'Layout checks',
        items: [
          'Bedroom proportions and wardrobe space',
          'Cross-ventilation and natural light',
          'Balcony orientation',
          'Storage and utility space',
          'A corner for working from home',
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '900 - 1,300 sq ft'],
          ['Households', '2 - 4 people'],
          ['Best for', 'Small families and couples'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: '2 BHK or 3 BHK for a growing family?',
        hint: 'A 2 BHK offers accessible entry pricing and manageable maintenance for young couples, but growing families often encounter space constraints as children grow or if dual work-from-home arrangements are required. If long-term tenure is intended, evaluating 3 BHK financing options early may avert future relocation expenses. Seek guidance from your financial planner.',
      },
      {
        q: 'What is a good carpet area for a 2 BHK?',
        hint: "In Hyderabad's premium developments, a functional 2 BHK layout typically provides between 700 and 950 square feet of usable carpet area, accommodating well-proportioned bedrooms, attached baths, and a utility balcony. Always prioritize ergonomic room dimensions and circulation efficiency over inflated super built-up marketing figures, verifying drawings with an architect.",
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '3-bhk': {
    slug: '3-bhk',
    group: 'bhk',
    label: '3 BHK',
    eyebrow: 'BHK Type \u00B7 3 BHK',
    headline: 'Space for\n*every chapter.*',
    lead: 'Generous 3 BHKs for families who want a study, a guest room or a bedroom for every child, in communities built for family life.',
    theme: {
      mode: 'light',
      bg: '#F4EDE1',
      ink: '#0C0C0C',
      accent: '#CFA65F',
      accentInk: '#8F6724',
      dark1: '#3F3023',
      dark2: '#110C08',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '3',
    modules: [
      {
        kind: 'personas',
        title: 'Who it suits',
        cards: [
          { title: 'Growing families', text: 'A bedroom for each child.' },
          { title: 'Joint families', text: 'Room for parents and guests.' },
          { title: 'Work-from-home professionals', text: 'A dedicated study.' },
          { title: 'Upgraders', text: 'More space, same neighbourhood.' },
        ],
      },
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '1,400 - 2,200 sq ft'],
          ['Typical features', '2 - 3 balconies, utility area'],
          ['Best for', 'Families of 4 - 6'],
        ],
        note: 'Indicative.',
      },
    ],
    faq: [
      {
        q: 'Is a 3 BHK worth the premium?',
        hint: 'Three-bedroom layouts represent the most liquid segment in the Indian family housing market. The additional room offers versatility for home offices, visiting parents, or children, sustaining superior long-term resale liquidity compared to smaller homes. While the absolute ticket size is higher, value per square foot remains competitive. Consult an advisor on micro-market demand.',
      },
      {
        q: 'Which floor is best in a high-rise?',
        hint: "Higher floors deliver expansive panoramic city views, superior cross-ventilation, and reduced ambient street noise, often commanding premium floor-rise developer charges. Middle floors balance visual elevation with quicker elevator turnaround during peak hours. Evaluate your family's personal lifestyle preference and safety comfort before confirming specific tower levels with your advisor.",
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '4-bhk': {
    slug: '4-bhk',
    group: 'bhk',
    label: '4 BHK',
    eyebrow: 'BHK Type \u00B7 4 BHK',
    headline: 'Spacious\n*by design.*',
    lead: 'Four bedrooms, family lounges and private terraces for households that need room for everyone, and for guests.',
    theme: {
      mode: 'light',
      bg: '#EFE6D8',
      ink: '#0C0C0C',
      accent: '#C4964A',
      accentInk: '#85591B',
      dark1: '#35261B',
      dark2: '#0E0906',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '4',
    modules: [
      {
        kind: 'table',
        title: 'At a glance',
        head: ['Detail', 'Typical'],
        rows: [
          ['Area', '2,500 - 4,000 sq ft'],
          ['Typical features', 'Family lounge, staff room, terraces'],
          ['Parking', '2 - 3 cars'],
        ],
        note: 'Indicative.',
      },
      {
        kind: 'checklist',
        title: 'Premium features to ask for',
        items: [
          'Private lift lobby or dedicated entry',
          'Staff room and separate entry',
          'Terrace or garden access',
          'Smart-home provisions',
          'Dedicated covered parking',
        ],
      },
    ],
    faq: [
      {
        q: 'Penthouse or villa for a 4 BHK?',
        hint: 'A 4 BHK sky penthouse delivers dramatic aerial skyline perspectives, lock-and-leave gated security, and centralized tower amenities, whereas an independent villa grants private land title, ground-level gardens, and vertical expansion autonomy. Choice pivots on your lifestyle preference for vertical convenience versus private ground-level estate ownership. Consult with our advisors on options.',
      },
      {
        q: 'How are premium maintenance charges decided?',
        hint: 'Maintenance for large format 4 BHK residences is assessed on a per-square-foot basis by resident welfare associations to service extensive clubhouse facilities, power backups, swimming pools, and dedicated concierge security. Larger footprints entail proportionally higher monthly contributions. Always request formal copies of current association audited maintenance balance sheets.',
      },
    ],
    cta: { label: 'Talk to a Buying Advisor' },
  },

  '4-plus-bhk': {
    slug: '4-plus-bhk',
    group: 'bhk',
    label: '4+ BHK',
    eyebrow: 'BHK Type \u00B7 4+ BHK',
    headline: 'Beyond four:\n*estates without limits.*',
    lead: 'Five bedrooms and more: villas, estates and farmhouses designed for multi-generational living and entertaining on a grand scale.',
    theme: {
      mode: 'dark',
      bg: '#120C08',
      ink: '#F4EFE6',
      accent: '#D4AF6A',
      accentInk: '#E9DCC0',
      dark1: '#2A1D12',
      dark2: '#070403',
    },
    displayFont: 'instrument',
    motion: 'numeral',
    numeral: '4+',
    modules: [
      {
        kind: 'factGrid',
        title: 'What to expect',
        facts: [
          { label: 'Typical area', value: '4,500+ sq ft' },
          { label: 'Plot size', value: '600+ sq yd for villas' },
          { label: 'Signature features', value: 'Pool, home theatre, staff quarters, lift' },
          { label: 'Best suited to', value: 'Multi-generational households' },
        ],
      },
      {
        kind: 'concierge',
        title: 'Private client services',
        items: [
          'Private viewings by appointment',
          'Off-market estates',
          'Legal and valuation coordination',
        ],
        ctaLabel: 'Request a Private Viewing',
      },
    ],
    faq: [
      {
        q: 'Do large estates need extra approvals?',
        hint: 'Expansive estates exceeding substantial plot areas or built-up thresholds must adhere strictly to environmental clearances, enhanced fire safety setbacks, structural seismic designs, and local municipal zoning permissions. Unauthorized extensions can trigger legal enforcement actions. Ensure an accredited architect and legal counsel audit all sanction orders and completion certificates before entering sale contracts.',
      },
      {
        q: 'How is a 5+ BHK home valued?',
        hint: 'Appraising palatial estates integrates prime underlying land valuations with replacement costs for bespoke architectural finishes, imported fixtures, private elevators, and landscape architecture. Scarcity value and location prestige also shape pricing. We recommend commissioning an independent valuation report from a certified government-registered valuer prior to finalizing binding financial commitments.',
      },
    ],
    cta: { label: 'Request a Private Viewing' },
  },

    };


    const getBuyPageConfig = (slug) => {
      return BUY_PAGE_CONFIGS[slug];
    };

    // =========================================================================
    // SHARED NAVBAR COMPONENT WITH BUY MEGA MENU & MOBILE ACCORDION
    // =========================================================================
    const ChevronDown = ({ size = 16, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
    const X = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
    const Menu = ({ size = 20, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    );
    const ArrowUpRight = ({ size = 14, className = "" }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
      </svg>
    );



const NAV_ITEMS = [
  { label: 'Buy', to: '/buy', isMega: true },
  { label: 'Rent', to: '/#rent' },
  { label: 'Sell', to: '/#sell' },
  { label: 'Services', to: '/services' },
  { label: 'Developments', to: '/#developments' },
  { label: 'Agents', to: '/#agents' },
  { label: "FAQ's", to: '/faqs' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState({
    popular: true,
    type: false,
    budget: false,
    bhk: false,
  });

  const location = useLocation();
  const { transitionTo } = usePageTransition();

  const navBarRef = useRef(null);
  const buyTriggerRef = useRef(null);
  const megaPanelRef = useRef(null);
  const megaTimelineRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const mobileMenuRef = useRef(null);
  const linksContainerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const isHome = location.pathname === '/';
  const isBuyActive = location.pathname.startsWith('/buy');

  // Route change closes mega menu & mobile menu
  useEffect(() => {
    setIsMegaOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener for Mega Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMegaOpen &&
        megaPanelRef.current &&
        !megaPanelRef.current.contains(e.target ) &&
        buyTriggerRef.current &&
        !buyTriggerRef.current.contains(e.target )
      ) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMegaOpen]);

  // Keyboard navigation inside Mega Menu
  const handleMegaKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMegaOpen(false);
      buyTriggerRef.current?.focus();
      return;
    }

    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const options = Array.from(
        megaPanelRef.current?.querySelectorAll('.mega-option-link') || []
      );
      if (options.length === 0) return;

      const currentIndex = options.indexOf(document.activeElement );
      if (currentIndex === -1) {
        options[0].focus();
        return;
      }

      // 4 columns, find columns groupings
      const colSizes = BUY_TAXONOMY_GROUPS.map((g) => g.options.length);
      let colIdx = 0;
      let acc = 0;
      let rowIdx = 0;
      for (let i = 0; i < colSizes.length; i++) {
        if (currentIndex < acc + colSizes[i]) {
          colIdx = i;
          rowIdx = currentIndex - acc;
          break;
        }
        acc += colSizes[i];
      }

      let targetIdx = currentIndex;
      if (e.key === 'ArrowDown') {
        const nextRow = (rowIdx + 1) % colSizes[colIdx];
        let offset = 0;
        for (let i = 0; i < colIdx; i++) offset += colSizes[i];
        targetIdx = offset + nextRow;
      } else if (e.key === 'ArrowUp') {
        const prevRow = (rowIdx - 1 + colSizes[colIdx]) % colSizes[colIdx];
        let offset = 0;
        for (let i = 0; i < colIdx; i++) offset += colSizes[i];
        targetIdx = offset + prevRow;
      } else if (e.key === 'ArrowRight') {
        const nextCol = (colIdx + 1) % colSizes.length;
        const targetRow = Math.min(rowIdx, colSizes[nextCol] - 1);
        let offset = 0;
        for (let i = 0; i < nextCol; i++) offset += colSizes[i];
        targetIdx = offset + targetRow;
      } else if (e.key === 'ArrowLeft') {
        const prevCol = (colIdx - 1 + colSizes.length) % colSizes.length;
        const targetRow = Math.min(rowIdx, colSizes[prevCol] - 1);
        let offset = 0;
        for (let i = 0; i < prevCol; i++) offset += colSizes[i];
        targetIdx = offset + targetRow;
      }

      options[targetIdx]?.focus();
    }
  };

  // GSAP animation for Mega Menu open / close
  useEffect(() => {
    const panel = megaPanelRef.current;
    if (!panel) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMegaOpen) {
      if (prefersReducedMotion) {
        gsap.set(panel, { opacity: 1, pointerEvents: 'auto', clipPath: 'inset(0% 0% 0% 0% round 16px)' });
      } else {
        const columns = panel.querySelectorAll('.mega-column');
        const rows = panel.querySelectorAll('.mega-option-row');

        if (megaTimelineRef.current) megaTimelineRef.current.kill();

        const tl = gsap.timeline();
        megaTimelineRef.current = tl;

        tl.fromTo(
          panel,
          { clipPath: 'inset(0% 0% 100% 0% round 24px)', opacity: 0, pointerEvents: 'auto' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1, duration: 0.55, ease: 'power3.out' }
        );

        tl.fromTo(
          columns,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.07 },
          0.1
        );

        tl.fromTo(
          rows,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.02 },
          0.2
        );
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(panel, { opacity: 0, pointerEvents: 'none' });
      } else {
        if (megaTimelineRef.current) megaTimelineRef.current.kill();
        gsap.to(panel, {
          opacity: 0,
          clipPath: 'inset(0% 0% 100% 0% round 24px)',
          duration: 0.3,
          ease: 'power2.in',
          pointerEvents: 'none',
        });
      }
    }
  }, [isMegaOpen]);

  // Hover intent helpers
  const handleTriggerMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsMegaOpen(true);
    }, 80);
  };

  const handleTriggerMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 220);
  };

  const handlePanelMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handlePanelMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 220);
  };

  // Lock body scroll & handle Escape key when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Mobile menu GSAP entrance & exit animations
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const linksWrap = linksContainerRef.current;
    if (!menu) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobileMenuOpen) {
      if (prefersReducedMotion) {
        gsap.set(menu, { opacity: 1, pointerEvents: 'auto' });
      } else {
        const linkItems = linksWrap?.querySelectorAll('.mobile-nav-link');
        const tl = gsap.timeline();

        tl.fromTo(
          menu,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out', pointerEvents: 'auto' }
        );

        if (linkItems && linkItems.length > 0) {
          tl.fromTo(
            linkItems,
            { yPercent: 120 },
            { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 },
            0.15
          );
        }
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(menu, { opacity: 0, pointerEvents: 'none' });
      } else {
        gsap.to(menu, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          pointerEvents: 'none',
        });
      }
    }
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = (to, label) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      transitionTo(to, label);
    }, 250);
  };

  const toggleMobileGroup = (key) => {
    setOpenMobileGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <header
        ref={navBarRef}
        className={`w-full px-6 md:px-12 lg:px-16 pt-6 z-50 ${
          isHome ? 'absolute top-0 left-0' : 'relative bg-[#0C0C0C]'
        }`}
      >
        <div className="relative w-full">
          <nav className="liquid-glass rounded-xl px-5 py-3 flex items-center justify-between">
            {/* Left: Brand Logo */}
            <TransitionLink
              to="/"
              className="font-sans text-lg font-medium uppercase text-white tracking-[0.28em] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              VESTA
            </TransitionLink>

            {/* Center: Navigation Links (hidden on mobile, md+) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-sans">
              {NAV_ITEMS.map((item) => {
                if (item.isMega) {
                  return (
                    <div
                      key={item.label}
                      className="relative py-1"
                      onMouseEnter={handleTriggerMouseEnter}
                      onMouseLeave={handleTriggerMouseLeave}
                    >
                      <button
                        ref={buyTriggerRef}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={isMegaOpen}
                        onClick={() => setIsMegaOpen((prev) => !prev)}
                        onFocus={() => setIsMegaOpen(true)}
                        className={`flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-colors duration-200 cursor-pointer ${
                          isBuyActive || isMegaOpen ? 'text-white' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${
                            isMegaOpen ? 'rotate-180 text-[#D4AF6A]' : 'text-white/60'
                          }`}
                        />
                      </button>
                      {/* Underline */}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1px] transform origin-left transition-transform duration-300 ${
                          isBuyActive
                            ? 'scale-x-100 bg-[#D4AF6A]'
                            : isMegaOpen
                            ? 'scale-x-100 bg-[#D4AF6A]'
                            : 'scale-x-0 bg-white'
                        }`}
                      />
                    </div>
                  );
                }

                const isActive = (item.to.startsWith('/') && !item.to.startsWith('/#')) ? location.pathname === item.to : (item.to === '/' && location.pathname === '/');


                    : item.to === '/' && location.pathname === '/';

                return (
                  <TransitionLink
                    key={item.label}
                    to={item.to}
                    className={`relative py-1 group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                      isActive ? 'text-white' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1px] transform origin-left transition-transform duration-300 ${
                        isActive
                          ? 'scale-x-100 bg-[#D4AF6A]'
                          : 'scale-x-0 group-hover:scale-x-100 bg-white'
                      }`}
                    />
                  </TransitionLink>
                );
              })}
            </div>

            {/* Right: CTA Button and Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium font-sans hover:bg-gray-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Book a Viewing
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="md:hidden liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <Menu size={20} />
              </button>
            </div>
          </nav>

          {/* ========================================================================= */}
          {/* BUY MEGA MENU GLASS PANEL (DESKTOP)                                       */}
          {/* ========================================================================= */}
          <div
            ref={megaPanelRef}
            role="region"
            aria-label="Buy Mega Menu"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onKeyDown={handleMegaKeyDown}
            className="hidden md:block absolute top-full mt-3 left-0 right-0 rounded-2xl liquid-glass bg-black/85 backdrop-blur-2xl border border-white/15 px-10 py-9 z-[80] shadow-[0_40px_80px_rgba(0,0,0,0.65)] pointer-events-none opacity-0"
            style={{
              clipPath: 'inset(0% 0% 100% 0% round 24px)',
            }}
          >
            {/* 4-column grid */}
            <div className="grid grid-cols-4 gap-x-12">
              {BUY_TAXONOMY_GROUPS.map((group) => (
                <div key={group.key} className="mega-column flex flex-col">
                  {/* Column Header */}
                  <h3 className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-white">
                    {group.title}
                  </h3>
                  {/* Hairline */}
                  <div className="w-full h-[1px] bg-white/15 mt-4 mb-5" />

                  {/* Options List */}
                  <div className="flex flex-col gap-1">
                    {group.options.map((opt) => {
                      const optTo = `/buy/${opt.slug}`;
                      const isCurrent = location.pathname === optTo;
                      const count = countFor(opt.slug);

                      return (
                        <div key={opt.slug} className="mega-option-row h-[36px] flex items-center">
                          <TransitionLink
                            to={optTo}
                            transitionLabel={opt.label}
                            className={`mega-option-link group relative flex items-center justify-between w-full h-full text-[14px] font-sans transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded px-1 ${
                              isCurrent ? 'text-white' : 'text-white/65 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[6px]">
                              {/* 5px gold dot */}
                              <span
                                className={`w-[5px] h-[5px] rounded-full bg-[#D4AF6A] mr-2 transition-opacity duration-300 ${
                                  isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                              />
                              <span>{opt.label}</span>
                              {/* HOT badge */}
                              {opt.badge && (
                                <span
                                  aria-label="Hot"
                                  className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] ml-2 inline-flex items-center animate-[pulse_2.4s_ease-in-out_infinite]"
                                >
                                  {opt.badge}
                                </span>
                              )}
                            </span>

                            {/* Tiny muted count */}
                            <span className="font-sans text-[11px] text-white/35 group-hover:text-white/60 transition-colors">
                              {count}
                            </span>
                          </TransitionLink>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Panel Footer Row */}
            <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between">
              <span className="font-sans text-xs text-white/40">
                12 residences, 18 collections
              </span>
              <TransitionLink
                to="/buy"
                transitionLabel="All Properties"
                className="font-sans text-xs font-medium text-white/80 hover:text-[#D4AF6A] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
              >
                <span>View all properties</span>
                <ArrowUpRight size={14} />
              </TransitionLink>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FULL-SCREEN MOBILE MENU PANEL (BLACK, Z-[90])                             */}
      {/* ========================================================================= */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-[#0C0C0C] z-[90] flex flex-col justify-between px-6 py-8 pointer-events-none opacity-0 md:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Top Header Row with Logo and Close Button */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-lg font-medium uppercase text-white tracking-[0.28em]">
            VESTA
          </span>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links List with Overflow-Hidden Mask and Serif Typography */}
        <div ref={linksContainerRef} className="flex flex-col gap-5 my-8">
          {/* Buy Accordion on Mobile */}
          <div className="border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => setMobileBuyOpen((prev) => !prev)}
              aria-expanded={mobileBuyOpen}
              className="mobile-nav-link text-left font-serif text-[clamp(2.25rem,9vw,3.5rem)] leading-tight tracking-[-0.02em] flex items-center justify-between w-full transition-colors duration-300 cursor-pointer"
              style={{
                color: isBuyActive ? '#D4AF6A' : '#ffffff',
              }}
            >
              <span>Buy</span>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${mobileBuyOpen ? 'rotate-180 text-[#D4AF6A]' : 'text-white/60'}`}
              />
            </button>

            {/* Collapsible Mobile Sub-groups */}
            {mobileBuyOpen && (
              <div className="mt-4 pl-2 flex flex-col gap-4 animate-[fadeIn_0.35s_ease-out]">
                <button
                  type="button"
                  onClick={() => handleMobileNavClick('/buy', 'All Properties')}
                  className="font-sans text-sm text-[#D4AF6A] flex items-center gap-2 py-1"
                >
                  <span>View All Residences & Collections</span>
                  <ArrowUpRight size={14} />
                </button>

                {BUY_TAXONOMY_GROUPS.map((group) => {
                  const isGroupOpen = openMobileGroups[group.key];
                  return (
                    <div key={group.key} className="border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => toggleMobileGroup(group.key)}
                        className="flex items-center justify-between w-full text-xs font-sans uppercase tracking-[0.2em] text-white/60 py-1"
                      >
                        <span>{group.title}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isGroupOpen ? 'rotate-180 text-[#D4AF6A]' : ''}`}
                        />
                      </button>

                      {isGroupOpen && (
                        <div className="flex flex-col gap-2 mt-2 pl-2">
                          {group.options.map((opt) => (
                            <button
                              key={opt.slug}
                              type="button"
                              onClick={() => handleMobileNavClick(`/buy/${opt.slug}`, opt.label)}
                              className="h-[44px] flex items-center justify-between font-serif text-[24px] text-white/90 hover:text-white text-left"
                            >
                              <span className="flex items-center gap-2">
                                <span>{opt.label}</span>
                                {opt.badge && (
                                  <span className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px]">
                                    {opt.badge}
                                  </span>
                                )}
                              </span>
                              <span className="font-sans text-xs text-white/35">
                                {countFor(opt.slug)}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Nav Items */}
          {NAV_ITEMS.filter((i) => !i.isMega).map((item) => {
            const isActive = (item.to.startsWith('/') && !item.to.startsWith('/#')) ? location.pathname === item.to : (item.to === '/' && location.pathname === '/');


                : item.to === '/' && location.pathname === '/';

            return (
              <div key={item.label} className="overflow-hidden pb-1">
                <button
                  type="button"
                  onClick={() => handleMobileNavClick(item.to)}
                  className="mobile-nav-link text-left font-serif text-[clamp(2.25rem,9vw,3.5rem)] leading-tight tracking-[-0.02em] block w-full transition-colors duration-300 cursor-pointer"
                  style={{
                    color: isActive ? '#D4AF6A' : '#ffffff',
                  }}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact / CTA */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-sans">
          <span>Hyderabad, Telangana</span>
          <span className="text-[#D4AF6A]">VESTA Agency</span>
        </div>
      </div>
    </>
  );
};


    const SearchCard = () => {
      const [propertyType, setPropertyType] = useState('');
      const [budget, setBudget] = useState('');
      const [bhk, setBhk] = useState('');
      const { transitionTo } = usePageTransition();

      const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (propertyType) params.set('type', propertyType);
        if (budget) params.set('budget', budget);
        if (bhk) params.set('bhk', bhk);
        const qs = params.toString();
        transitionTo(qs ? `/buy?${qs}` : '/buy', 'Property Search');
      };

      return (
        <FadeIn delay={1500} duration={1000} y={12} className="w-full max-w-md">
          <div className="liquid-glass border border-white/20 rounded-2xl p-5 w-full">
            <h2 className="font-serif text-2xl text-white mb-4">
              Start your search
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors"
                >
                  <option value="" className="bg-black text-white">Any type</option>
                  <option value="flats-apartments" className="bg-black text-white">Flats/Apartments</option>
                  <option value="independent-houses" className="bg-black text-white">Independent Houses</option>
                  <option value="villas" className="bg-black text-white">Villas</option>
                  <option value="plots-land" className="bg-black text-white">Plots/Land</option>
                  <option value="commercial" className="bg-black text-white">Commercial</option>
                </select>
              </div>

              <div>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors"
                >
                  <option value="" className="bg-black text-white">Any budget</option>
                  <option value="under-50-lacs" className="bg-black text-white">Under {'\u20B9'}50 Lacs</option>
                  <option value="50-lacs-to-1-cr" className="bg-black text-white">{'\u20B950 Lacs - \u20B91 Cr'}</option>
                  <option value="1-cr-to-5-cr" className="bg-black text-white">{'\u20B91 Cr - \u20B95 Cr'}</option>
                  <option value="above-5-cr" className="bg-black text-white">Above {'\u20B9'}5 Cr</option>
                </select>
              </div>

              <div>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-4 py-3 w-full font-sans focus:outline-none focus:border-white/40 transition-colors"
                >
                  <option value="" className="bg-black text-white">Any BHK</option>
                  <option value="1-bhk" className="bg-black text-white">1 BHK</option>
                  <option value="2-bhk" className="bg-black text-white">2 BHK</option>
                  <option value="3-bhk" className="bg-black text-white">3 BHK</option>
                  <option value="4-bhk" className="bg-black text-white">4 BHK</option>
                  <option value="4-plus-bhk" className="bg-black text-white">4+ BHK</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-200 mt-1 font-sans cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span>Search Properties</span>
              </button>
            </form>

            <div className="text-xs text-white/60 text-center mt-3 font-sans">
              {'Hyderabad \u00B7 Jubilee Hills \u00B7 Banjara Hills \u00B7 Kokapet'}
            </div>
          </div>
        </FadeIn>
      );
    };

    const HeroSection = () => {
      return (
        <section className="relative w-full min-h-svh flex flex-col justify-between overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="w-full h-24" />

          <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16">
            <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
              <div className="flex flex-col items-start">
                <FadeIn delay={100} duration={800}>
                  <p className="text-xs uppercase font-medium text-white/70 tracking-[0.22em] mb-5 font-sans">
                    {'Residential \u00B7 Commercial \u00B7 Investment'}
                  </p>
                </FadeIn>

                <AnimatedHeading
                  text={"Find the place\nyou'll call *home.*"}
                  delay={300}
                  charDelay={22}
                  className="font-serif font-normal leading-[0.95] mb-6 tracking-[-0.02em] text-white text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]"
                />

                <FadeIn delay={1000} duration={1000} y={12}>
                  <p className="text-base md:text-lg text-white/80 max-w-xl mb-7 font-sans leading-relaxed">
                    {'Curated homes, apartments and investment properties in the city\'s most sought-after neighborhoods \u2014 with advisors who handle every step.'}
                  </p>
                </FadeIn>

                <FadeIn delay={1300} duration={1000} y={12}>
                  <div className="flex flex-wrap gap-4 font-sans">
                    <button
                      type="button"
                      className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      Browse Properties
                    </button>
                    <button
                      type="button"
                      className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      Talk to an Advisor
                    </button>
                  </div>
                </FadeIn>
              </div>

              <div className="flex items-end justify-start lg:justify-end mt-10 lg:mt-0">
                <SearchCard />
              </div>
            </div>
          </div>
        </section>
      );
    };

    // =========================================================================
    // PROPERTY DETAIL OVERLAY COMPONENT (SECTION 11)
    // =========================================================================
    const PropertyDetail = ({ property, isOpen, onClose, triggerButtonRef }) => {
      const backdropRef = useRef(null);
      const panelRef = useRef(null);
      const contentWrapRef = useRef(null);
      const formCardRef = useRef(null);

      const [fullName, setFullName] = useState('');
      const [mobile, setMobile] = useState('');
      const [email, setEmail] = useState('');
      const [preferredDate, setPreferredDate] = useState('');
      const [message, setMessage] = useState('');
      const [errors, setErrors] = useState({});
      const [isSubmitted, setIsSubmitted] = useState(false);
      const [submittedName, setSubmittedName] = useState('');

      useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            handleClose();
          }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
          document.body.style.overflow = originalOverflow;
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [isOpen]);

      useEffect(() => {
        if (!isOpen) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const panel = panelRef.current;
        const backdrop = backdropRef.current;
        const content = contentWrapRef.current;
        if (!panel || !backdrop) return;

        if (prefersReducedMotion) {
          window.gsap.set(backdrop, { opacity: 1 });
          window.gsap.set(panel, { yPercent: 0, opacity: 1 });
          return;
        }

        const tl = window.gsap.timeline();
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
        tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "power3.out" }, 0);

        if (content) {
          const animItems = content.querySelectorAll('.detail-anim-in');
          tl.fromTo(animItems,
            { opacity: 0, y: 24, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out"
            },
            0.5
          );
        }
      }, [isOpen]);

      const handleClose = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const panel = panelRef.current;
        const backdrop = backdropRef.current;

        if (prefersReducedMotion || !panel || !backdrop) {
          onClose();
          if (triggerButtonRef?.current) triggerButtonRef.current.focus();
          return;
        }

        const tl = window.gsap.timeline({
          onComplete: () => {
            onClose();
            if (triggerButtonRef?.current) triggerButtonRef.current.focus();
          }
        });

        tl.to(panel, { yPercent: 100, duration: 0.5, ease: "power3.in" }, 0);
        tl.to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.1);
      };

      const validateForm = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.name = 'Full name is required';
        const mobileClean = mobile.replace(/[\s-]/g, '');
        if (!/^[6-9]\d{9}$/.test(mobileClean)) {
          newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          newErrors.email = 'Enter a valid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const firstName = fullName.trim().split(' ')[0] || fullName.trim();
        setSubmittedName(firstName);
        setIsSubmitted(true);

        setTimeout(() => {
          setIsSubmitted(false);
          setFullName('');
          setMobile('');
          setEmail('');
          setPreferredDate('');
          setMessage('');
          setErrors({});
        }, 4000);
      };

      const scrollToForm = () => {
        if (formCardRef.current) {
          formCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };

      const whatsappText = encodeURIComponent(`Hi, I would like to schedule a visit for ${property.name.replace('\n', ' ')} in ${property.location}.`);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

      if (!isOpen) return null;

      return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="property-detail-title"
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div
            ref={backdropRef}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            className="relative min-h-screen w-full bg-[#080808] text-white flex flex-col justify-between"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close property details"
              className="fixed top-6 right-6 md:right-12 lg:right-16 z-50 w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-white bg-black/60 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div ref={contentWrapRef} className="w-full flex-1 pb-24 md:pb-16">
              <div className="relative w-full h-[44svh] md:h-[56svh] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name.replace('\n', ' ')}
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: property.focal }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 35%, rgba(0,0,0,0.1) 70%, transparent 100%)',
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-8 max-w-[1200px] mx-auto pointer-events-none">
                  <p className="detail-anim-in font-sans text-xs uppercase tracking-[0.22em] text-white/90 mb-2">
                    {property.location}
                  </p>
                  <h1
                    id="property-detail-title"
                    className="detail-anim-in font-serif font-normal text-white leading-tight tracking-[-0.02em] text-[clamp(2.5rem,5vw,4.5rem)]"
                  >
                    {property.name.replace('\n', ' ')}
                  </h1>
                  <div className="detail-anim-in font-serif text-[32px] text-[#D4AF6A] mt-2 flex items-baseline gap-3">
                    <span>{formatPrice(property.priceCr)}</span>
                    <span className="font-sans text-xs md:text-sm text-white/60 font-normal tracking-normal">
                      ({pricePerUnit(property)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div className="lg:col-span-7 flex flex-col items-start text-left">
                  <div className="detail-anim-in w-full grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-8">
                    {property.type === 'plot' ? (
                      <React.Fragment>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white">
                            {property.area.toLocaleString('en-IN')} {property.areaUnit}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Plot Size
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white">
                            {property.facing}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Facing
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white">
                            {(property.keyDetails && property.keyDetails.find(k => k.label.toLowerCase().includes('road')))?.value || '40 ft'}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Road Width
                          </span>
                        </div>
                      </React.Fragment>
                    ) : property.type === 'commercial' ? (
                      <React.Fragment>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white truncate" title={property.subtype}>
                            {property.subtype}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Type
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white">
                            {property.area.toLocaleString('en-IN')} {property.areaUnit}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Area
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-2xl md:text-3xl text-white truncate" title={property.possession}>
                            {property.possession}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Possession
                          </span>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div className="flex flex-col">
                          <span className="font-serif text-3xl md:text-4xl text-white">
                            {property.beds} BHK
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Bedrooms
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-3xl md:text-4xl text-white">
                            {property.baths}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            Bathrooms
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-3xl md:text-4xl text-white">
                            {property.area.toLocaleString('en-IN')}
                          </span>
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                            {property.areaUnit === 'sq yd' ? 'Sq Yd Total' : 'Sq Ft Total'}
                          </span>
                        </div>
                      </React.Fragment>
                    )}
                  </div>

                  <div className="detail-anim-in mb-10 space-y-4 text-white/80 font-sans text-[15px] leading-relaxed">
                    {property.longDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="detail-anim-in w-full mb-10">
                    <h3 className="font-serif text-2xl text-white mb-4">
                      Key Highlights
                    </h3>
                    <div className="space-y-3 font-sans text-sm text-white/90">
                      {property.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#D4AF6A]/15 text-[#D4AF6A] flex-shrink-0">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-anim-in w-full mb-8">
                    <h3 className="font-serif text-2xl text-white mb-4">
                      Amenities & Features
                    </h3>
                    <div className="flex flex-wrap gap-2.5 font-sans">
                      {property.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/90 text-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  ref={formCardRef}
                  className="lg:col-span-5 lg:sticky lg:top-6 w-full"
                >
                  <div className="detail-anim-in rounded-2xl border border-white/15 bg-white/5 p-7 md:p-8 backdrop-blur-md shadow-2xl">
                    <h3 className="font-serif text-2xl md:text-[28px] text-white mb-1">
                      Schedule a visit
                    </h3>
                    <p className="font-sans text-xs text-white/60 mb-6">
                      Direct inquiry for {property.name.replace('\n', ' ')}
                    </p>

                    {isSubmitted ? (
                      <div className="py-8 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center mb-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <h4 className="font-serif text-xl text-white mb-1">
                          Inquiry Received
                        </h4>
                        <p className="font-sans text-sm text-white/80 leading-relaxed max-w-xs">
                          Thank you, {submittedName}. Our advisor will call you shortly to coordinate your private preview.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                        <div>
                          <input
                            type="text"
                            placeholder="Full name *"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                            }}
                            className={`w-full h-12 rounded-lg bg-white/10 border ${errors.name ? 'border-red-400' : 'border-white/20'} px-4 text-white text-sm font-sans placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors`}
                          />
                          {errors.name && (
                            <span className="text-[11px] text-red-400 mt-1 block font-sans">{errors.name}</span>
                          )}
                        </div>

                        <div>
                          <input
                            type="tel"
                            placeholder="Mobile number (10-digit) *"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.target.value);
                              if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                            }}
                            className={`w-full h-12 rounded-lg bg-white/10 border ${errors.mobile ? 'border-red-400' : 'border-white/20'} px-4 text-white text-sm font-sans placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors`}
                          />
                          {errors.mobile && (
                            <span className="text-[11px] text-red-400 mt-1 block font-sans">{errors.mobile}</span>
                          )}
                        </div>

                        <div>
                          <input
                            type="email"
                            placeholder="Email address (optional)"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                            }}
                            className={`w-full h-12 rounded-lg bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} px-4 text-white text-sm font-sans placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors`}
                          />
                          {errors.email && (
                            <span className="text-[11px] text-red-400 mt-1 block font-sans">{errors.email}</span>
                          )}
                        </div>

                        <div>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={3}
                            placeholder="Message or specific requests (optional)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white text-sm font-sans placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full h-12 rounded-lg bg-white text-black font-medium text-sm font-sans hover:bg-gray-100 transition-colors duration-200 mt-1"
                        >
                          Request a call back
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-10 rounded-lg border border-white/30 flex items-center justify-center gap-2 text-white/90 text-xs font-sans tracking-wide uppercase hover:bg-white/10 transition-colors"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          <span>Chat on WhatsApp</span>
                        </a>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 mt-16 pt-8 border-t border-white/10 text-center font-sans text-xs text-white/50">
                Sample listing with AI-generated imagery for demonstration. {property.reraId}.
              </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10 px-5 py-3.5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-serif text-xl text-[#D4AF6A] leading-tight">
                  {formatPrice(property.priceCr)}
                </span>
                <span className="font-sans text-[10px] text-white/60 uppercase tracking-wider">
                  {property.beds !== null
                    ? `${property.beds} BHK \u00B7 ${property.area.toLocaleString('en-IN')} ${property.areaUnit}`
                    : `${property.subtype} \u00B7 ${property.area.toLocaleString('en-IN')} ${property.areaUnit}`}
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className="bg-white text-black px-5 py-2.5 rounded-lg text-xs font-semibold font-sans hover:bg-gray-100 transition-colors"
              >
                Request a call back
              </button>
            </div>
          </div>
        </div>
      );
    };

    // =========================================================================
    // PROPERTY SHOWCASE SLIDER SECTION (WITH DETAIL OVERLAY INTEGRATION)
    // =========================================================================
    const EXPAND_DURATION = 0.9;
    const EXPAND_EASE = "power3.inOut";
    const TEXT_EASE = "power3.out";
    const AUTOPLAY_MS = 8000;
    const CARD_RADIUS = 14;

    const PropertyShowcase = () => {
      const [activeIndex, setActiveIndex] = useState(0);
      const [savedIds, setSavedIds] = useState({});
      const [displayNumber, setDisplayNumber] = useState(1);
      const [prevNumber, setPrevNumber] = useState(1);
      const [isRollDown, setIsRollDown] = useState(true);
      const [isDetailOpen, setIsDetailOpen] = useState(false);
      const [isHovered, setIsHovered] = useState(false);

      const sectionRef = useRef(null);
      const activeBgRef = useRef(null);
      const incomingBgRef = useRef(null);
      const textContainerRef = useRef(null);
      const stripContainerRef = useRef(null);
      const cardRefs = useRef([]);
      const progressBarRef = useRef(null);
      const counterOldRef = useRef(null);
      const counterNewRef = useRef(null);
      const viewPropertyBtnRef = useRef(null);

      const isAnimating = useRef(false);
      const autoplayTimer = useRef(null);
      const isHoveredOrFocused = useRef(false);
      const isIntersecting = useRef(true);
      const touchStartX = useRef(null);
      const touchStartY = useRef(null);

      const showcaseListings = propertiesData.filter(p => Number(p.id) <= 6);
      const total = showcaseListings.length;
      const currentProperty = showcaseListings[activeIndex];

      const upcomingQueue = [];
      for (let i = 1; i <= total; i++) {
        const idx = (activeIndex + i) % total;
        upcomingQueue.push({ property: showcaseListings[idx], originalIndex: idx });
      }

      const preloadUpcoming = useCallback((currIdx) => {
        for (let i = 1; i <= 3; i++) {
          const nextIdx = (currIdx + i) % total;
          const img = new Image();
          img.src = showcaseListings[nextIdx].image;
          if (img.decode) img.decode().catch(() => {});
        }
      }, [total]);

      useEffect(() => {
        preloadUpcoming(activeIndex);
      }, [activeIndex, preloadUpcoming]);

      const toggleSave = (id, e) => {
        e.stopPropagation();
        setSavedIds(prev => ({ ...prev, [id]: !prev[id] }));
      };

      const goToSlide = useCallback((targetIdx, direction, sourceCardElement) => {
        if (isAnimating.current || targetIdx === activeIndex || isDetailOpen) return;
        isAnimating.current = true;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targetProperty = showcaseListings[targetIdx];
        const section = sectionRef.current;
        if (!section) {
          isAnimating.current = false;
          return;
        }

        if (autoplayTimer.current) clearInterval(autoplayTimer.current);

        setPrevNumber(activeIndex + 1);
        setDisplayNumber(targetIdx + 1);
        setIsRollDown(direction === 'next');

        if (prefersReducedMotion) {
          setActiveIndex(targetIdx);
          if (activeBgRef.current) {
            activeBgRef.current.src = targetProperty.image;
            activeBgRef.current.style.objectPosition = targetProperty.focal;
          }
          isAnimating.current = false;
          return;
        }

        const tl = window.gsap.timeline({
          onComplete: () => {
            isAnimating.current = false;
          }
        });

        const sectionRect = section.getBoundingClientRect();

        if (direction === 'next') {
          const cardEl = sourceCardElement || cardRefs.current[0];
          let expander = null;

          if (cardEl) {
            cardEl.style.transform = 'none';
            const cardRect = cardEl.getBoundingClientRect();
            const initialLeft = cardRect.left - sectionRect.left;
            const initialTop = cardRect.top - sectionRect.top;
            const initialWidth = cardRect.width;
            const initialHeight = cardRect.height;

            // Keep clicked card invisible during expansion so it doesn't double-render
            cardEl.style.opacity = '0';

            // Pre-set incoming background image buffer
            if (incomingBgRef.current) {
              incomingBgRef.current.src = targetProperty.image;
              incomingBgRef.current.style.objectPosition = targetProperty.focal;
              incomingBgRef.current.style.opacity = '1';
            }

            expander = document.createElement('div');
            expander.style.position = 'absolute';
            expander.style.left = `${initialLeft}px`;
            expander.style.top = `${initialTop}px`;
            expander.style.width = `${initialWidth}px`;
            expander.style.height = `${initialHeight}px`;
            expander.style.borderRadius = `${CARD_RADIUS}px`;
            expander.style.overflow = 'hidden';
            expander.style.zIndex = '24';
            expander.style.boxShadow = '0 25px 60px rgba(0,0,0,0.6)';
            expander.style.contain = 'paint';
            expander.style.willChange = 'left, top, width, height, border-radius';

            const expImg = document.createElement('img');
            expImg.src = targetProperty.image;
            expImg.alt = targetProperty.name.replace('\n', ' ');
            expImg.style.width = '100%';
            expImg.style.height = '100%';
            expImg.style.objectFit = 'cover';
            expImg.style.objectPosition = targetProperty.focal;
            expImg.style.display = 'block';

            expander.appendChild(expImg);
            section.appendChild(expander);

            // Expand to fill the viewport
            tl.to(expander, {
              left: 0,
              top: 0,
              width: sectionRect.width,
              height: sectionRect.height,
              borderRadius: 0,
              duration: EXPAND_DURATION,
              ease: EXPAND_EASE,
            }, 0);

            // Fade out previous text
            if (textContainerRef.current) {
              const elements = textContainerRef.current.querySelectorAll('.showcase-anim-in');
              tl.to(elements, {
                opacity: 0,
                y: -12,
                filter: 'blur(6px)',
                duration: 0.3,
                ease: 'power2.in',
              }, 0);
            }

            // Shift strip cards smoothly
            if (stripContainerRef.current) {
              const firstCardWidth = cardRefs.current[0]?.offsetWidth || 180;
              const gap = window.innerWidth >= 640 ? 36 : 16;
              const shiftX = firstCardWidth + gap;

              tl.fromTo(stripContainerRef.current,
                { x: 0 },
                { x: -shiftX, duration: EXPAND_DURATION, ease: EXPAND_EASE },
                0
              );
            }

            // At 75% of expansion, commit state update underneath the expander
            tl.call(() => {
              setActiveIndex(targetIdx);
              if (activeBgRef.current) {
                activeBgRef.current.src = targetProperty.image;
                activeBgRef.current.style.objectPosition = targetProperty.focal;
              }
              if (stripContainerRef.current) {
                stripContainerRef.current.style.transform = 'none';
              }
              if (cardEl) {
                cardEl.style.opacity = '1';
              }
            }, undefined, EXPAND_DURATION * 0.75);

            // At completion, dissolve expander smoothly
            tl.to(expander, {
              opacity: 0,
              duration: 0.22,
              ease: 'power2.out',
              onComplete: () => {
                if (expander && expander.parentNode) {
                  expander.parentNode.removeChild(expander);
                }
                if (incomingBgRef.current) {
                  incomingBgRef.current.style.opacity = '0';
                }
              }
            }, EXPAND_DURATION);
          } else {
            setActiveIndex(targetIdx);
          }

          if (counterOldRef.current && counterNewRef.current) {
            tl.fromTo(counterOldRef.current,
              { yPercent: 0 },
              { yPercent: -100, duration: 0.6, ease: "power2.inOut" },
              0.25
            );
            tl.fromTo(counterNewRef.current,
              { yPercent: 100 },
              { yPercent: 0, duration: 0.6, ease: "power2.inOut" },
              0.25
            );
          }

          if (progressBarRef.current) {
            const nextPercent = ((targetIdx + 1) / total) * 100;
            tl.to(progressBarRef.current, {
              width: `${nextPercent}%`,
              duration: EXPAND_DURATION,
              ease: "power2.inOut"
            }, 0.1);
          }

          if (textContainerRef.current) {
            tl.call(() => {
              const elements = textContainerRef.current?.querySelectorAll('.showcase-anim-in');
              if (elements && elements.length > 0) {
                window.gsap.fromTo(elements,
                  { opacity: 0, y: 26, filter: 'blur(8px)' },
                  {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: TEXT_EASE,
                    stagger: 0.08,
                  }
                );
              }
            }, undefined, EXPAND_DURATION * 0.8);
          }
        } else {
          // PREV: Double-buffered smooth crossfade
          if (incomingBgRef.current) {
            incomingBgRef.current.src = targetProperty.image;
            incomingBgRef.current.style.objectPosition = targetProperty.focal;
            incomingBgRef.current.style.opacity = '0';

            tl.to(incomingBgRef.current, { opacity: 1, duration: 0.75, ease: EXPAND_EASE }, 0);
            tl.fromTo(incomingBgRef.current,
              { scale: 1.08 },
              { scale: 1, duration: 0.75, ease: EXPAND_EASE },
              0
            );
          }

          if (textContainerRef.current) {
            const elements = textContainerRef.current.querySelectorAll('.showcase-anim-in');
            tl.to(elements, { opacity: 0, y: 15, duration: 0.3, ease: 'power2.in' }, 0);
          }

          tl.call(() => {
            setActiveIndex(targetIdx);
            if (activeBgRef.current) {
              activeBgRef.current.src = targetProperty.image;
              activeBgRef.current.style.objectPosition = targetProperty.focal;
            }
            if (incomingBgRef.current) {
              incomingBgRef.current.style.opacity = '0';
            }
          }, undefined, 0.4);

          if (counterOldRef.current && counterNewRef.current) {
            tl.fromTo(counterOldRef.current,
              { yPercent: 0 },
              { yPercent: 100, duration: 0.6, ease: "power2.inOut" },
              0.2
            );
            tl.fromTo(counterNewRef.current,
              { yPercent: -100 },
              { yPercent: 0, duration: 0.6, ease: "power2.inOut" },
              0.2
            );
          }

          if (progressBarRef.current) {
            const prevPercent = ((targetIdx + 1) / total) * 100;
            tl.to(progressBarRef.current, {
              width: `${prevPercent}%`,
              duration: EXPAND_DURATION,
              ease: "power2.inOut"
            }, 0.1);
          }

          if (textContainerRef.current) {
            tl.call(() => {
              const elements = textContainerRef.current?.querySelectorAll('.showcase-anim-in');
              if (elements && elements.length > 0) {
                window.gsap.fromTo(elements,
                  { opacity: 0, y: -22, filter: 'blur(8px)' },
                  {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: TEXT_EASE,
                    stagger: 0.08,
                  }
                );
              }
            }, undefined, 0.45);
          }
        }
      }, [activeIndex, total, isDetailOpen]);

      const handleNext = useCallback(() => {
        const nextIdx = (activeIndex + 1) % total;
        goToSlide(nextIdx, 'next');
      }, [activeIndex, total, goToSlide]);

      const handlePrev = useCallback(() => {
        const prevIdx = (activeIndex - 1 + total) % total;
        goToSlide(prevIdx, 'prev');
      }, [activeIndex, total, goToSlide]);

      const startAutoplay = useCallback(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (autoplayTimer.current) clearInterval(autoplayTimer.current);
        if (isDetailOpen) return;

        autoplayTimer.current = setInterval(() => {
          if (!isHoveredOrFocused.current && isIntersecting.current && !isAnimating.current && !isDetailOpen) {
            handleNext();
          }
        }, AUTOPLAY_MS);
      }, [handleNext, isDetailOpen]);

      useEffect(() => {
        startAutoplay();
        return () => {
          if (autoplayTimer.current) clearInterval(autoplayTimer.current);
        };
      }, [startAutoplay, isDetailOpen]);

      useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersecting.current = entry.isIntersecting;
            });
          },
          { threshold: 0.5 }
        );

        observer.observe(section);
        return () => observer.disconnect();
      }, []);

      const handleKeyDown = (e) => {
        if (isDetailOpen) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        }
      };

      const onTouchStart = (e) => {
        if (isDetailOpen) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      };

      const onTouchEnd = (e) => {
        if (isDetailOpen) return;
        if (touchStartX.current === null || touchStartY.current === null) return;
        const diffX = e.changedTouches[0].clientX - touchStartX.current;
        const diffY = e.changedTouches[0].clientY - touchStartY.current;

        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
        touchStartX.current = null;
        touchStartY.current = null;
      };

      // Mouse Spotlight & Depth Parallax
      const handleSectionMouseMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        section.style.setProperty('--mouse-x', `${x}px`);
        section.style.setProperty('--mouse-y', `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        if (activeBgRef.current) {
          activeBgRef.current.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 0) scale(1.04)`;
        }
        if (incomingBgRef.current) {
          incomingBgRef.current.style.transform = `translate3d(${normX * -10}px, ${normY * -10}px, 0) scale(1.04)`;
        }
        if (textContainerRef.current) {
          textContainerRef.current.style.transform = `translate3d(${normX * 6}px, ${normY * 6}px, 0)`;
        }
      };

      // 3D Card Hover Tilt
      const handleCardMouseMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px) scale3d(1.04, 1.04, 1.04)`;

        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.opacity = '1';
          glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 255, 255, 0.25) 0%, rgba(212, 175, 106, 0.12) 35%, transparent 70%)`;
        }
      };

      const handleCardMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px) scale3d(1, 1, 1)';
        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.opacity = '0';
        }
      };

      return (
        <>
          <section
            id="properties"
            ref={sectionRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseMove={handleSectionMouseMove}
            onMouseEnter={() => {
              isHoveredOrFocused.current = true;
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              isHoveredOrFocused.current = false;
              setIsHovered(false);
              if (activeBgRef.current) {
                activeBgRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.02)';
              }
              if (textContainerRef.current) {
                textContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
              }
            }}
            onFocus={() => { isHoveredOrFocused.current = true; }}
            onBlur={() => { isHoveredOrFocused.current = false; }}
            aria-roledescription="carousel"
            aria-label="Featured properties"
            className="relative w-full h-[100svh] min-h-[640px] bg-black text-white overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] focus-visible:ring-offset-2"
            style={{
              '--mouse-x': '50%',
              '--mouse-y': '50%',
            }}
          >
            {/* Active Background Photo */}
            <img
              ref={activeBgRef}
              src={currentProperty.image}
              alt={currentProperty.name.replace('\n', ' ')}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover z-0 block pointer-events-none transition-transform duration-700 ease-out"
              style={{
                objectPosition: currentProperty.focal,
                transform: 'translate3d(0, 0, 0) scale(1.02)',
              }}
            />

            {/* Incoming Background Buffer */}
            <img
              ref={incomingBgRef}
              alt=""
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover z-[1] block pointer-events-none opacity-0 transition-opacity duration-300"
              style={{ transform: 'translate3d(0, 0, 0) scale(1.02)' }}
            />

            {/* Dual Legibility Gradients */}
            <div
              className="absolute inset-0 pointer-events-none z-[5]"
              style={{
                background: `
                  linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0) 72%),
                  linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 60%)
                `,
              }}
            />

            {/* Ambient Cursor Spotlight Glow */}
            <div
              className="pointer-events-none absolute inset-0 z-[6] transition-opacity duration-500 ease-out"
              style={{
                opacity: isHovered ? 1 : 0,
                background: 'radial-gradient(750px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 106, 0.12) 0%, rgba(212, 175, 106, 0.02) 40%, transparent 70%)',
              }}
            />

            {/* Left Text Block */}
            <div
              ref={textContainerRef}
              aria-live="polite"
              className="absolute left-0 z-10 w-full lg:w-[45vw] px-6 md:px-12 lg:px-16 flex flex-col items-start pointer-events-auto transition-transform duration-500 ease-out"
              style={{
                bottom: 'calc(clamp(14svh, 16svh, 18svh) + var(--services-overlap, 60px))',
              }}
            >
              <div
                className="showcase-anim-in w-8 h-[3px] bg-white rounded-full mb-4"
                style={{ transformOrigin: 'left' }}
              />

              <p className="showcase-anim-in font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-white/90 mb-3">
                {currentProperty.location}
              </p>

              <h2 className="showcase-anim-in font-serif font-normal text-white leading-[0.98] tracking-[-0.02em] mb-5 text-[clamp(2.75rem,5.5vw,6.5rem)]">
                {currentProperty.name.split('\n').map((line, idx) => (
                  <span key={idx} className="block overflow-hidden pb-[0.12em]">
                    <span className="block">{line}</span>
                  </span>
                ))}
              </h2>

              <p className="showcase-anim-in font-sans font-normal text-[14px] leading-[1.6] text-white/80 max-w-[28rem] line-clamp-4 md:line-clamp-none mb-5">
                {currentProperty.description}
              </p>

              {/* Spec Row (Hyderabad Market Format) */}
              <div className="showcase-anim-in flex flex-wrap items-center gap-4 font-sans font-medium text-[13px] text-white mb-6">
                {currentProperty.beds !== null && currentProperty.baths !== null ? (
                  <React.Fragment>
                    <span>{currentProperty.beds} BHK</span>
                    <span className="w-[1px] h-3.5 bg-white/25" />
                    <span>{currentProperty.baths} Baths</span>
                    <span className="w-[1px] h-3.5 bg-white/25" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span>{currentProperty.subtype}</span>
                    <span className="w-[1px] h-3.5 bg-white/25" />
                  </React.Fragment>
                )}
                <span>{currentProperty.area.toLocaleString('en-IN')} {currentProperty.areaUnit}</span>
                <span className="w-[1px] h-3.5 bg-white/25" />
                <span className="font-semibold text-[#D4AF6A]">{formatPrice(currentProperty.priceCr)}</span>
              </div>

              <div className="showcase-anim-in flex items-center gap-3 font-sans">
                <button
                  type="button"
                  onClick={(e) => toggleSave(currentProperty.id, e)}
                  aria-label={savedIds[currentProperty.id] ? "Saved property" : "Save property"}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF6A] text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,106,0.5)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={savedIds[currentProperty.id] ? "#ffffff" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>

                {/* View Property Button opens Detail Overlay */}
                <button
                  ref={viewPropertyBtnRef}
                  type="button"
                  onClick={() => setIsDetailOpen(true)}
                  aria-label={`View ${currentProperty.name.replace('\n', ' ')}`}
                  className="group h-10 px-6 rounded-full border border-white/70 bg-transparent text-white text-[11px] font-medium uppercase tracking-[0.14em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                >
                  <span>View Property</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Strip */}
            <div
              className="absolute left-6 sm:left-[38vw] lg:left-[45vw] z-30 pointer-events-auto"
              style={{
                bottom: 'calc(clamp(96px, 11svh, 120px) + var(--services-overlap, 60px))',
              }}
            >
              <div
                ref={stripContainerRef}
                className="flex items-center gap-[16px] sm:gap-[36px] overflow-visible"
                style={{ willChange: 'transform' }}
              >
                {upcomingQueue.map(({ property, originalIndex }, i) => {
                  const isSaved = !!savedIds[property.id];

                  return (
                    <button
                      key={`${property.id}-${i}`}
                      ref={(el) => { cardRefs.current[i] = el; }}
                      type="button"
                      onClick={(e) => goToSlide(originalIndex, 'next', e.currentTarget)}
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      aria-label={`Switch to ${property.name.replace('\n', ' ')}`}
                      className="group relative flex-shrink-0 rounded-[14px] overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
                      style={{
                        height: 'clamp(180px, 35svh, 290px)',
                        width: 'calc(clamp(180px, 35svh, 290px) * 0.66)',
                        boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
                        transformStyle: 'preserve-3d',
                        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    >
                      <img
                        src={property.image}
                        alt={property.name.replace('\n', ' ')}
                        decoding="async"
                        className="w-full h-full object-cover block pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105"
                        style={{ objectPosition: property.focal }}
                      />

                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0) 70%)',
                        }}
                      />

                      {/* Interactive Dynamic Glare */}
                      <div
                        className="card-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
                      />

                      {property.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-sans font-semibold tracking-wider uppercase bg-black/60 text-[#D4AF6A] border border-[#D4AF6A]/40 backdrop-blur-sm z-10">
                          {property.badge}
                        </span>
                      )}

                      {isSaved && (
                        <span className="absolute top-3 right-3 text-[#D4AF6A] z-10">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4AF6A" stroke="#D4AF6A" strokeWidth="2">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col items-start pointer-events-none z-10">
                        <div className="w-[18px] h-[2px] bg-white rounded-full mb-1.5 transition-all duration-300 group-hover:w-6 group-hover:bg-[#D4AF6A]" />
                        <span className="font-sans text-[11px] text-white/85 uppercase tracking-[0.14em] line-clamp-1">
                          {property.city || property.location.split(',')[0].trim()}
                        </span>
                        <span className="font-serif text-[20px] sm:text-[22px] leading-[1.05] text-white line-clamp-2 mt-0.5 group-hover:text-[#E9DCC0] transition-colors duration-300">
                          {property.name.replace('\n', ' ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls Row */}
            <div
              className="absolute left-6 sm:left-[38vw] lg:left-[45vw] right-6 md:right-12 lg:right-16 z-30 flex items-center justify-between pointer-events-auto"
              style={{
                bottom: 'calc(clamp(1.5rem, 4svh, 2rem) + var(--services-overlap, 60px))',
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous property"
                  className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next property"
                  className="w-11 h-11 rounded-full border border-[#D4AF6A] flex items-center justify-center text-white bg-black/20 backdrop-blur-sm hover:bg-[#D4AF6A] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A] cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 mx-4 sm:mx-6 h-[2px] bg-white/30 rounded-full overflow-hidden relative">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#D4AF6A] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                />
              </div>

              <div className="block sm:hidden font-sans text-xs text-white/70 font-medium tracking-widest tabular-nums">
                0{activeIndex + 1} / 0{total}
              </div>

              <div className="hidden sm:block relative h-[44px] overflow-hidden">
                <div className="relative font-serif text-[44px] leading-none text-white tabular-nums h-[44px] flex items-center justify-center">
                  <span
                    ref={counterOldRef}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {prevNumber}
                  </span>
                  <span
                    ref={counterNewRef}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: isRollDown ? 'translateY(100%)' : 'translateY(-100%)',
                    }}
                  >
                    {displayNumber}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Property Detail Overlay */}
          <PropertyDetail
            property={currentProperty}
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            triggerButtonRef={viewPropertyBtnRef}
          />
        </>
      );
    };

    // =========================================================================
    // SERVICES DATA (SECTION 3)
    // =========================================================================
    const servicesData = [
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

    // =========================================================================
    // SERVICES SECTION COMPONENT
    // =========================================================================
    const ServicesSection = () => {
      const sectionRef = useRef(null);
      const eyebrowDashRef = useRef(null);
      const eyebrowTextRef = useRef(null);
      const headingRef = useRef(null);
      const introRef = useRef(null);
      const listRef = useRef(null);
      const ctaRef = useRef(null);

      useEffect(() => {
        if (!window.gsap) return;
        if (window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const section = sectionRef.current;
        if (!section || prefersReducedMotion) return;

        const ctx = window.gsap.context(() => {
          const dash = eyebrowDashRef.current;
          const eyebrowText = eyebrowTextRef.current;
          const heading = headingRef.current;
          const intro = introRef.current;

          const charSpansLine1 = heading?.querySelectorAll('.char-line-1');
          const charSpansLine2 = heading?.querySelectorAll('.char-line-2');

          if (dash) window.gsap.set(dash, { scaleX: 0, transformOrigin: 'left' });
          if (eyebrowText) window.gsap.set(eyebrowText, { opacity: 0, y: 12 });
          if (charSpansLine1 && charSpansLine1.length) {
            window.gsap.set(charSpansLine1, { opacity: 0, yPercent: 110, filter: 'blur(6px)' });
          }
          if (charSpansLine2 && charSpansLine2.length) {
            window.gsap.set(charSpansLine2, { opacity: 0, yPercent: 110, filter: 'blur(6px)' });
          }
          if (intro) window.gsap.set(intro, { opacity: 0, y: 16, filter: 'blur(6px)' });

          const headerTl = window.gsap.timeline({
            scrollTrigger: {
              trigger: heading,
              start: 'top 75%',
              once: true,
            },
          });

          if (dash) {
            headerTl.to(dash, {
              scaleX: 1,
              duration: 0.6,
              ease: 'power3.out',
            }, 0);
          }

          if (eyebrowText) {
            headerTl.to(eyebrowText, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            }, 0.2);
          }

          if (charSpansLine1 && charSpansLine1.length) {
            headerTl.to(charSpansLine1, {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.022,
              onComplete: () => {
                window.gsap.set(charSpansLine1, { clearProps: 'willChange' });
              },
            }, 0.3);
          }

          const line1Duration = 0.9 + (charSpansLine1 ? (charSpansLine1.length - 1) * 0.022 : 0);
          const line2Start = 0.3 + line1Duration * 0.6;

          if (charSpansLine2 && charSpansLine2.length) {
            headerTl.to(charSpansLine2, {
              opacity: 1,
              yPercent: 0,
              filter: 'blur(0px)',
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.022,
              onComplete: () => {
                window.gsap.set(charSpansLine2, { clearProps: 'willChange' });
              },
            }, line2Start);
          }

          if (intro) {
            headerTl.to(intro, {
              opacity: 0.6,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.0,
              ease: 'power3.out',
              onComplete: () => {
                window.gsap.set(intro, { clearProps: 'willChange' });
              },
            }, 0.8);
          }

          // Rows batch animation
          const listItems = listRef.current?.querySelectorAll('li');
          if (listItems && listItems.length > 0 && window.ScrollTrigger) {
            listItems.forEach((li) => {
              const hairLine = li.querySelector('.row-hairline');
              const numeral = li.querySelector('.row-numeral');
              const name = li.querySelector('.row-name');
              const desc = li.querySelector('.row-desc');
              const chips = li.querySelectorAll('.row-chip');
              const arrowCircle = li.querySelector('.row-arrow-circle');

              if (hairLine) window.gsap.set(hairLine, { scaleX: 0, transformOrigin: 'left' });
              if (numeral) window.gsap.set(numeral, { yPercent: 100 });
              if (name) window.gsap.set(name, { yPercent: 100 });
              if (desc) window.gsap.set(desc, { opacity: 0, y: 16, filter: 'blur(6px)' });
              if (chips && chips.length) window.gsap.set(chips, { opacity: 0, y: 10 });
              if (arrowCircle) window.gsap.set(arrowCircle, { scale: 0.6, opacity: 0 });
            });

            window.ScrollTrigger.batch(listItems, {
              start: 'top 88%',
              once: true,
              interval: 0.1,
              onEnter: (batch) => {
                batch.forEach((li, batchIdx) => {
                  const hairLine = li.querySelector('.row-hairline');
                  const numeral = li.querySelector('.row-numeral');
                  const name = li.querySelector('.row-name');
                  const desc = li.querySelector('.row-desc');
                  const chips = li.querySelectorAll('.row-chip');
                  const arrowCircle = li.querySelector('.row-arrow-circle');

                  const delay = batchIdx * 0.1;
                  const rowTl = window.gsap.timeline({ delay });

                  if (hairLine) {
                    rowTl.to(hairLine, {
                      scaleX: 1,
                      duration: 0.9,
                      ease: 'power3.inOut',
                    }, 0);
                  }

                  if (numeral) {
                    rowTl.to(numeral, {
                      yPercent: 0,
                      duration: 0.9,
                      ease: 'power3.out',
                      onComplete: () => {
                        window.gsap.set(numeral, { clearProps: 'willChange' });
                      },
                    }, 0.1);
                  }

                  if (name) {
                    rowTl.to(name, {
                      yPercent: 0,
                      duration: 0.9,
                      ease: 'power3.out',
                      onComplete: () => {
                        window.gsap.set(name, { clearProps: 'willChange' });
                      },
                    }, 0.18);
                  }

                  if (desc) {
                    rowTl.to(desc, {
                      opacity: 0.6,
                      y: 0,
                      filter: 'blur(0px)',
                      duration: 0.8,
                      ease: 'power3.out',
                      onComplete: () => {
                        window.gsap.set(desc, { clearProps: 'willChange' });
                      },
                    }, 0.3);
                  }

                  if (chips && chips.length) {
                    rowTl.to(chips, {
                      opacity: 0.8,
                      y: 0,
                      duration: 0.6,
                      stagger: 0.06,
                      ease: 'power3.out',
                      onComplete: () => {
                        window.gsap.set(chips, { clearProps: 'willChange' });
                      },
                    }, 0.42);
                  }

                  if (arrowCircle) {
                    rowTl.to(arrowCircle, {
                      scale: 1,
                      opacity: 1,
                      duration: 0.6,
                      ease: 'back.out(1.6)',
                      onComplete: () => {
                        window.gsap.set(arrowCircle, { clearProps: 'willChange' });
                      },
                    }, 0.5);
                  }
                });
              },
            });
          }

          const cta = ctaRef.current;
          if (cta) {
            window.gsap.set(cta, { opacity: 0, y: 24, filter: 'blur(8px)' });
            window.gsap.to(cta, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cta,
                start: 'top 90%',
                once: true,
              },
              onComplete: () => {
                window.gsap.set(cta, { clearProps: 'willChange' });
              },
            });
          }
        }, section);

        return () => ctx.revert();
      }, []);

      return (
        <section
          id="services"
          ref={sectionRef}
          aria-labelledby="services-title"
          className="relative z-30 w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] text-[#0C0C0C] px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-28 md:py-36"
          style={{
            backgroundColor: '#FAF8F4',
            marginTop: 'calc(var(--services-overlap, 60px) * -1)',
            '--ink': '#0C0C0C',
            '--accent': '#D4AF6A',
            '--accent-ink': '#A8832F',
            '--hair': 'rgba(12, 12, 12, 0.15)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Heading & Intro Block */}
            <div className="mb-16 sm:mb-20 md:mb-28 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    ref={eyebrowDashRef}
                    className="w-8 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  <p
                    ref={eyebrowTextRef}
                    className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#0C0C0C]"
                  >
                    Our Services
                  </p>
                </div>

                <h2
                  id="services-title"
                  ref={headingRef}
                  className="font-serif font-normal text-[#0C0C0C] leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,7vw,6.5rem)]"
                >
                  <span className="block overflow-hidden pb-[0.12em]">
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">
                      {'Every'.split('').map((char, cIdx) => (
                        <span
                          key={`l1-ev-${cIdx}`}
                          className="char-line-1 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">
                      {'step'.split('').map((char, cIdx) => (
                        <span
                          key={`l1-st-${cIdx}`}
                          className="char-line-1 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span className="inline-block whitespace-nowrap">
                      {'of'.split('').map((char, cIdx) => (
                        <span
                          key={`l1-of-${cIdx}`}
                          className="char-line-1 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </span>

                  <span className="block overflow-hidden pb-[0.12em]">
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">
                      {'your'.split('').map((char, cIdx) => (
                        <span
                          key={`l2-your-${cIdx}`}
                          className="char-line-2 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span className="inline-block whitespace-nowrap mr-[0.25em] italic" style={{ color: 'var(--accent-ink)' }}>
                      {'property'.split('').map((char, cIdx) => (
                        <span
                          key={`l2-prop-${cIdx}`}
                          className="char-line-2 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span className="inline-block whitespace-nowrap italic" style={{ color: 'var(--accent-ink)' }}>
                      {'journey.'.split('').map((char, cIdx) => (
                        <span
                          key={`l2-jour-${cIdx}`}
                          className="char-line-2 inline-block will-change-transform"
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </span>
                </h2>
              </div>

              <p
                ref={introRef}
                className="font-sans font-light text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed max-w-sm text-[#0C0C0C] mt-6 lg:mt-0"
                style={{ opacity: 0.6 }}
              >
                From the first viewing to the final handover, one dedicated team manages every detail of your move.
              </p>
            </div>

            {/* Semantic Services List */}
            <ol
              ref={listRef}
              className="w-full max-w-6xl mx-auto border-t"
              style={{ borderColor: 'var(--hair)' }}
            >
              {servicesData.map((service) => (
                <li
                  key={service.id}
                  className="relative w-full border-b group"
                  style={{ borderColor: 'var(--hair)' }}
                >
                  <a
                    href="#contact"
                    aria-label={`Enquire about ${service.name}`}
                    className="relative block w-full py-8 sm:py-10 md:py-12 transition-colors duration-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{ outlineColor: 'var(--accent-ink)' }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                      style={{ backgroundColor: 'rgba(12, 12, 12, 0.03)' }}
                    />

                    <div className="relative z-10 grid grid-cols-[auto_1fr] md:grid-cols-[clamp(4.5rem,12vw,9rem)_1fr_auto] items-start gap-4 sm:gap-6 md:gap-10">
                      <div className="overflow-hidden">
                        <div
                          className="row-numeral font-serif tabular-nums text-[clamp(2.25rem,12vw,3.5rem)] md:text-[clamp(3rem,9vw,120px)] leading-none transition-colors duration-600 select-none"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(12, 12, 12, 0.4)',
                          }}
                        >
                          {service.id}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 min-w-0">
                        <div className="overflow-hidden">
                          <h3
                            className="row-name font-serif font-normal text-[#0C0C0C] text-[clamp(1.6rem,3.2vw,2.9rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3"
                          >
                            {service.name}
                          </h3>
                        </div>

                        <p
                          className="row-desc font-sans font-light text-[clamp(0.9rem,1.4vw,1.15rem)] leading-relaxed max-w-2xl text-[#0C0C0C] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2"
                          style={{ opacity: 0.6 }}
                        >
                          {service.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {service.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="row-chip font-sans font-medium text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-colors duration-600 group-hover:border-[#A8832F] group-focus-visible:border-[#A8832F]"
                              style={{
                                borderColor: 'rgba(12, 12, 12, 0.2)',
                                color: 'var(--ink)',
                                opacity: 0.8,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden md:flex items-center justify-center pt-2">
                        <div
                          className="row-arrow-circle w-[52px] h-[52px] rounded-full border flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#0C0C0C] group-hover:border-[#0C0C0C] group-focus-visible:bg-[#0C0C0C] group-focus-visible:border-[#0C0C0C]"
                          style={{
                            borderColor: 'var(--hair)',
                            color: 'var(--ink)',
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white group-hover:rotate-45 group-focus-visible:text-white group-focus-visible:rotate-45">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div
                      className="row-hairline absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
                      style={{ backgroundColor: 'var(--hair)' }}
                    />

                    <div
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left transform scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-10"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                  </a>
                </li>
              ))}
            </ol>

            {/* Closing CTA */}
            <div
              ref={ctaRef}
              className="mt-20 sm:mt-24 text-center max-w-2xl mx-auto flex flex-col items-center"
            >
              <h3 className="font-serif font-normal text-[#0C0C0C] text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em]">
                <span>Not sure where to </span>
                <span className="italic" style={{ color: 'var(--accent-ink)' }}>
                  begin?
                </span>
              </h3>

              <p
                className="font-sans font-light text-[16px] leading-relaxed text-[#0C0C0C] mt-4"
                style={{ opacity: 0.6 }}
              >
                Speak with a senior advisor. A private consultation is always complimentary.
              </p>

              <a
                href="#contact"
                className="group mt-8 inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full text-white font-sans font-medium text-[12px] uppercase tracking-[0.14em] transition-all duration-400 w-full sm:w-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  backgroundColor: 'var(--ink)',
                  outlineColor: 'var(--accent-ink)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ink)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <span>Book a Private Consultation</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-400 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>

          <style>{`
            @media (pointer: fine) {
              .group:hover .row-numeral {
                color: var(--ink) !important;
                -webkit-text-stroke: 1px var(--ink) !important;
              }
            }
            .group:focus-visible .row-numeral {
              color: var(--ink) !important;
              -webkit-text-stroke: 1px var(--ink) !important;
            }
          `}</style>
        </section>
      );
    };

    // =========================================================================
    // SERVICES SEPARATE COLUMN DRAWER COMPONENT
    // =========================================================================
    const ServicesDrawer = ({ isOpen, onClose }) => {
      const backdropRef = useRef(null);
      const drawerRef = useRef(null);

      useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
          }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
          document.body.style.overflow = originalOverflow;
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [isOpen, onClose]);

      useEffect(() => {
        const backdrop = backdropRef.current;
        const drawer = drawerRef.current;
        if (!backdrop || !drawer || !window.gsap) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isOpen) {
          if (prefersReducedMotion) {
            window.gsap.set(backdrop, { opacity: 1, pointerEvents: 'auto' });
            window.gsap.set(drawer, { x: 0 });
          } else {
            window.gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out', pointerEvents: 'auto' });
            window.gsap.fromTo(drawer,
              { x: '100%' },
              { x: '0%', duration: 0.6, ease: 'power3.out' }
            );
          }
        } else {
          if (prefersReducedMotion) {
            window.gsap.set(backdrop, { opacity: 0, pointerEvents: 'none' });
            window.gsap.set(drawer, { x: '100%' });
          } else {
            window.gsap.to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.in', pointerEvents: 'none' });
            window.gsap.to(drawer, { x: '100%', duration: 0.45, ease: 'power3.in' });
          }
        }
      }, [isOpen]);

      return (
        <div
          className={`fixed inset-0 z-50 transition-visibility duration-400 ${
            isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Services Column"
        >
          {/* Dark backdrop */}
          <div
            ref={backdropRef}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0 transition-opacity"
            aria-hidden="true"
          />

          {/* Side Column Drawer */}
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-[90vw] md:w-[680px] lg:w-[740px] xl:w-[820px] bg-[#FAF8F4] text-[#0C0C0C] shadow-2xl flex flex-col z-10 translate-x-full overflow-hidden"
            style={{
              '--ink': '#0C0C0C',
              '--accent': '#D4AF6A',
              '--accent-ink': '#A8832F',
              '--hair': 'rgba(12, 12, 12, 0.15)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 px-6 sm:px-10 py-5 bg-[#FAF8F4]/95 backdrop-blur-sm border-b flex items-center justify-between" style={{ borderColor: 'var(--hair)' }}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[2px] rounded-full bg-[#D4AF6A]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#0C0C0C]">
                  VESTA SERVICES
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close services column"
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:bg-[#0C0C0C] hover:text-white cursor-pointer"
                style={{ borderColor: 'var(--hair)', color: 'var(--ink)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 sm:py-12">
              <div className="mb-10 sm:mb-14">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] rounded-full bg-[#D4AF6A]" />
                  <p className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#0C0C0C]">
                    Our Services
                  </p>
                </div>

                <h2 className="font-serif font-normal text-[#0C0C0C] leading-[0.98] tracking-[-0.02em] text-[clamp(2.25rem,5.5vw,3.75rem)] mb-5">
                  <span className="block">
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">Every</span>
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">step</span>
                    <span className="inline-block whitespace-nowrap">of</span>
                  </span>
                  <span className="block mt-1">
                    <span className="inline-block whitespace-nowrap mr-[0.25em]">your</span>
                    <span className="inline-block whitespace-nowrap mr-[0.25em] italic text-[#A8832F]">property</span>
                    <span className="inline-block whitespace-nowrap italic text-[#A8832F]">journey.</span>
                  </span>
                </h2>

                <p className="font-sans font-light text-[15px] leading-relaxed max-w-xl text-[#0C0C0C]/70">
                  From the first viewing to the final handover, one dedicated team manages every detail of your move.
                </p>
              </div>

              <ol className="w-full border-t" style={{ borderColor: 'var(--hair)' }}>
                {servicesData.map((service) => (
                  <li
                    key={service.id}
                    className="relative border-b group transition-colors duration-300 hover:bg-black/[0.02]"
                    style={{ borderColor: 'var(--hair)' }}
                  >
                    <a
                      href="#contact"
                      onClick={onClose}
                      aria-label={`Enquire about ${service.name}`}
                      className="block py-6 sm:py-8 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ outlineColor: 'var(--accent-ink)' }}
                    >
                      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[4.5rem_1fr_auto] items-start gap-4 sm:gap-6">
                        <div
                          className="font-serif tabular-nums text-[2.5rem] sm:text-[3rem] leading-none transition-colors duration-300 select-none"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(12, 12, 12, 0.4)',
                          }}
                        >
                          {service.id}
                        </div>

                        <div className="flex flex-col gap-2 min-w-0">
                          <h3 className="font-serif text-[1.4rem] sm:text-[1.75rem] leading-[1.1] text-[#0C0C0C] group-hover:translate-x-1.5 transition-transform duration-300">
                            {service.name}
                          </h3>
                          <p className="font-sans font-light text-[13px] sm:text-[14px] leading-relaxed text-[#0C0C0C]/70">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {service.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="font-sans font-medium text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border border-black/15 text-[#0C0C0C]/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center pt-1">
                          <div
                            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-[#0C0C0C] group-hover:text-white"
                            style={{ borderColor: 'var(--hair)', color: 'var(--ink)' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-45">
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-12 pt-8 border-t text-center flex flex-col items-center" style={{ borderColor: 'var(--hair)' }}>
                <h3 className="font-serif text-[1.75rem] leading-tight text-[#0C0C0C]">
                  <span>Not sure where to </span>
                  <span className="italic text-[#A8832F]">begin?</span>
                </h3>
                <p className="font-sans font-light text-sm text-[#0C0C0C]/70 mt-2">
                  Speak with a senior advisor. A private consultation is always complimentary.
                </p>
                <a
                  href="#contact"
                  onClick={onClose}
                  className="mt-6 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#0C0C0C] text-white font-sans text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 hover:bg-[#D4AF6A] hover:text-[#0C0C0C]"
                >
                  <span>Book a Private Consultation</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // =========================================================================
    // PAGES: HOME, SERVICES, NOT FOUND (STEP 1 & 3)
    // =========================================================================
    const Home = () => {
      return (
        <div className="w-full bg-black text-white">
          <HeroSection />
          <PropertyShowcase />
        </div>
      );
    };

    const Services = () => {
      return (
        <div className="w-full bg-[#0C0C0C] min-h-screen text-white">
          <div className="w-full pt-16 sm:pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center">
            <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mb-3" />
            <span className="font-sans text-xs uppercase tracking-[0.28em] text-white/60">
              Tailored Real Estate Solutions
            </span>
          </div>
          <ServicesSection />
        </div>
      );
    };

    // =========================================================================
    // SEARCH BAR COMPONENT
    // =========================================================================
    const SearchBar = ({
      q,
      onQChange,
      type,
      onTypeChange,
      budget,
      onBudgetChange,
      bhk,
      onBhkChange,
      categoryLabel,
      className = '',
      onReset,
    }) => {
      const hasActiveFilters = Boolean(q || type || budget || bhk);

      return (
        <div className={`w-full max-w-4xl mx-auto flex flex-col items-center gap-2 ${className}`}>
          <div className="w-full liquid-glass rounded-2xl p-2.5 sm:p-3 border border-white/20 shadow-2xl backdrop-blur-xl bg-black/60 flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full min-w-[200px] flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 text-white/50 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={q}
                onChange={(e) => onQChange(e.target.value)}
                placeholder="Search by neighborhood, name or keywords..."
                className="w-full h-11 pl-10 pr-8 bg-white/5 hover:bg-white/10 rounded-xl text-white placeholder-white/45 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] transition-colors"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => onQChange('')}
                  className="absolute right-3 text-white/40 hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                <option value="" className="bg-[#121212] text-white">Any type</option>
                <option value="flats-apartments" className="bg-[#121212] text-white">Flats/Apartments</option>
                <option value="independent-houses" className="bg-[#121212] text-white">Independent Houses</option>
                <option value="villas" className="bg-[#121212] text-white">Villas</option>
                <option value="plots-land" className="bg-[#121212] text-white">Plots/Land</option>
                <option value="commercial" className="bg-[#121212] text-white">Commercial</option>
              </select>

              <select
                value={budget}
                onChange={(e) => onBudgetChange(e.target.value)}
                className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                <option value="" className="bg-[#121212] text-white">Any budget</option>
                <option value="under-50-lacs" className="bg-[#121212] text-white">Under {'\u20B9'}50 Lacs</option>
                <option value="50-lacs-to-1-cr" className="bg-[#121212] text-white">{'\u20B950 Lacs - \u20B91 Cr'}</option>
                <option value="1-cr-to-5-cr" className="bg-[#121212] text-white">{'\u20B91 Cr - \u20B95 Cr'}</option>
                <option value="above-5-cr" className="bg-[#121212] text-white">Above {'\u20B9'}5 Cr</option>
              </select>

              <select
                value={bhk}
                onChange={(e) => onBhkChange(e.target.value)}
                className="h-11 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A] border border-white/10 transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                <option value="" className="bg-[#121212] text-white">Any BHK</option>
                <option value="1-bhk" className="bg-[#121212] text-white">1 BHK</option>
                <option value="2-bhk" className="bg-[#121212] text-white">2 BHK</option>
                <option value="3-bhk" className="bg-[#121212] text-white">3 BHK</option>
                <option value="4-bhk" className="bg-[#121212] text-white">4 BHK</option>
                <option value="4-plus-bhk" className="bg-[#121212] text-white">4+ BHK</option>
              </select>

              {hasActiveFilters && onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  title="Reset all filters"
                  className="h-11 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-sans flex items-center gap-1 transition-colors"
                >
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {categoryLabel && (
            <div className="flex items-center gap-2 text-xs font-sans text-white/60 mt-1">
              <span>Searching within <strong className="text-white font-medium">{categoryLabel}</strong></span>
              <span className="text-white/30">{"\u00B7"}</span>
              <TransitionLink
                to="/buy"
                transitionLabel="All Properties"
                className="text-[#D4AF6A] hover:underline transition-colors"
              >
                Search all properties
              </TransitionLink>
            </div>
          )}
        </div>
      );
    };

    // =========================================================================
    // BUY CARD COMPONENT
    // =========================================================================
    function mixColor(color1, color2, weight) {
      const c1 = color1.replace('#', '');
      const c2 = color2.replace('#', '');
      const r1 = parseInt(c1.substring(0, 2), 16) || 0;
      const g1 = parseInt(c1.substring(2, 4), 16) || 0;
      const b1 = parseInt(c1.substring(4, 6), 16) || 0;

      const r2 = parseInt(c2.substring(0, 2), 16) || 0;
      const g2 = parseInt(c2.substring(2, 4), 16) || 0;
      const b2 = parseInt(c2.substring(4, 6), 16) || 0;

      const r = Math.round(r1 * (1 - weight) + r2 * weight);
      const g = Math.round(g1 * (1 - weight) + g2 * weight);
      const b = Math.round(b1 * (1 - weight) + b2 * weight);

      return `rgb(${r}, ${g}, ${b})`;
    }

    const BuyCard = ({
      property,
      index,
      theme,
      motion,
      isSaved = false,
      onToggleSave,
      onSelectProperty,
      isSuggested = false,
    }) => {
      const toneIndex = index % 3;
      let cardBgStyle = {};
      let isToneB = false;

      if (theme) {
        if (toneIndex === 0) {
          cardBgStyle = {
            background: `radial-gradient(120% 90% at 20% 0%, ${theme.dark1} 0%, ${theme.dark2} 100%)`,
            color: '#FFFFFF',
          };
        } else if (toneIndex === 1) {
          isToneB = true;
          const mixedAccent = mixColor(theme.accent, '#FFFFFF', 0.55);
          cardBgStyle = {
            background: `linear-gradient(160deg, ${mixedAccent} 0%, ${theme.accent} 100%)`,
            color: '#0C0C0C',
          };
        } else {
          const mixedDark1 = mixColor(theme.dark1, theme.accent, 0.3);
          cardBgStyle = {
            background: `radial-gradient(120% 90% at 20% 0%, ${mixedDark1} 0%, ${theme.dark2} 100%)`,
            color: '#FFFFFF',
          };
        }
      }

      const isBlueprint = motion === 'blueprint';
      const isGoldSweep = motion === 'goldSweep';

      return (
        <div
          onClick={() => onSelectProperty && onSelectProperty(property)}
          className={`buy-card group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between ${
            theme?.mode === 'dark' ? 'border-white/15' : 'border-black/10'
          }`}
          style={cardBgStyle}
        >
          {isBlueprint && (
            <React.Fragment>
              <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 z-20 pointer-events-none" style={{ borderColor: theme?.accent || '#D4AF6A' }} />
              <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 z-20 pointer-events-none" style={{ borderColor: theme?.accent || '#D4AF6A' }} />
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 z-20 pointer-events-none" style={{ borderColor: theme?.accent || '#D4AF6A' }} />
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 z-20 pointer-events-none" style={{ borderColor: theme?.accent || '#D4AF6A' }} />
            </React.Fragment>
          )}

          {isGoldSweep && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transform -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
            </div>
          )}

          <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
            <img
              src={property.image}
              alt={property.name.replace('\n', ' ')}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: property.focal || 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <div>
                {isSuggested ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-[#D4AF6A] text-black">
                    Suggested
                  </span>
                ) : property.badge ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {property.badge}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-black/50 backdrop-blur-md text-white/90 border border-white/10">
                    {property.subtype}
                  </span>
                )}
              </div>

              {onToggleSave && (
                <button
                  type="button"
                  aria-label={isSaved ? "Saved" : "Save property"}
                  onClick={(e) => onToggleSave(property.id, e)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF6A] hover:text-black hover:border-[#D4AF6A] transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-10">
              <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/90 drop-shadow">
                {property.location}
              </span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3
                className="text-2xl leading-tight mb-2 group-hover:text-[#D4AF6A] transition-colors line-clamp-1"
                style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
              >
                {property.name.replace('\n', ' ')}
              </h3>

              <p className={`font-sans text-xs mb-4 line-clamp-1 ${isToneB ? 'text-black/75' : 'text-white/70'}`}>
                {property.tagline}
              </p>

              <div className={`flex flex-wrap items-center gap-2 text-xs font-sans pb-3 mb-3 border-b ${isToneB ? 'border-black/15 text-black/85' : 'border-white/10 text-white/80'}`}>
                {property.beds !== null ? (
                  <React.Fragment>
                    <span className="font-medium">{property.beds} BHK</span>
                    <span className="opacity-40">{"\u00B7"}</span>
                    <span>{property.baths} Baths</span>
                    <span className="opacity-40">{"\u00B7"}</span>
                    <span>{property.area.toLocaleString('en-IN')} {property.areaUnit}</span>
                  </React.Fragment>
                ) : property.type === 'plot' ? (
                  <React.Fragment>
                    <span className="font-medium">{property.area.toLocaleString('en-IN')} sq yd</span>
                    <span className="opacity-40">{"\u00B7"}</span>
                    <span>{property.facing} Facing</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="font-medium">{property.subtype}</span>
                    <span className="opacity-40">{"\u00B7"}</span>
                    <span>{property.area.toLocaleString('en-IN')} sq ft</span>
                  </React.Fragment>
                )}
              </div>

              <div className="space-y-1 mb-4 font-sans text-[11px]">
                {property.highlights.slice(0, 2).map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 opacity-80 line-clamp-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D4AF6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-col">
                <span
                  className="font-serif text-2xl font-normal leading-none"
                  style={{ color: isToneB ? '#0C0C0C' : theme ? theme.accentInk : '#D4AF6A' }}
                >
                  {formatPrice(property.priceCr)}
                </span>
                <span className={`font-sans text-[10px] mt-0.5 ${isToneB ? 'text-black/60' : 'text-white/50'}`}>
                  {pricePerUnit(property)}
                </span>
              </div>

              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black ${isToneB ? 'border-black/30 text-black' : 'border-white/20 text-white group-hover:border-white'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // =========================================================================
    // CATEGORY MODULES (TIMELINE, CHECKLIST, FACTGRID, TABLE, PERSONAS, EMI, YIELD, PLOTTOOLS, COMPARE, CONCIERGE)
    // =========================================================================
    const CategoryModules = ({ modules, theme, topProperties, onEnquireClick }) => {
      return (
        <div className="w-full space-y-16 mt-20">
          {modules.map((mod, index) => (
            <section
              key={index}
              className="category-module rounded-3xl p-6 sm:p-10 md:p-12 border transition-all duration-300"
              style={{
                backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <h2
                className="text-[clamp(1.85rem,4vw,2.5rem)] leading-tight mb-3"
                style={{
                  fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                  color: theme.mode === 'dark' ? '#FFFFFF' : '#0C0C0C',
                }}
              >
                {mod.title}
              </h2>

              {mod.intro && (
                <p className="font-sans text-sm opacity-70 max-w-2xl mb-8">
                  {mod.intro}
                </p>
              )}

              {mod.kind === 'timeline' && (
                <div className="relative pl-6 sm:pl-8 border-l border-white/20 mt-8 space-y-8">
                  {mod.steps.map((step, sIdx) => (
                    <div key={sIdx} className="relative group">
                      <div
                        className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-sans text-xs font-semibold bg-black transition-colors"
                        style={{ borderColor: theme.accent, color: theme.accent }}
                      >
                        {sIdx + 1}
                      </div>
                      <h3 className="text-lg font-serif mb-1" style={{ color: theme.mode === 'dark' ? '#FFFFFF' : '#0C0C0C' }}>
                        {step.title}
                      </h3>
                      <p className="font-sans text-sm opacity-75 max-w-xl">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {mod.kind === 'checklist' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {mod.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${theme.accent}25`, color: theme.accent }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="font-sans text-sm opacity-90 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {mod.kind === 'factGrid' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
                  {mod.facts.map((fact, idx) => (
                    <div key={idx} className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
                      <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mb-3">
                        {fact.label}
                      </span>
                      <span
                        className="text-3xl sm:text-4xl leading-none"
                        style={{
                          fontFamily: 'var(--font-display, "Instrument Serif", serif)',
                          color: theme.mode === 'dark' ? theme.accentInk : theme.accent,
                        }}
                      >
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {mod.kind === 'table' && (
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left font-sans text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/15">
                        {mod.head.map((h, idx) => (
                          <th key={idx} className="pb-3 text-xs uppercase tracking-wider opacity-60 font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mod.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-4 pr-4 opacity-90">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {mod.note && (
                    <p className="font-sans text-xs opacity-50 mt-4 italic">
                      * {mod.note}
                    </p>
                  )}
                </div>
              )}

              {mod.kind === 'personas' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {mod.cards.map((card, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-xl mb-2">{card.title}</h3>
                        <p className="font-sans text-sm opacity-75 leading-relaxed">{card.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mod.kind === 'emi' && (
                <EmiEstimator presetPriceCr={mod.presetPriceCr} theme={theme} />
              )}

              {mod.kind === 'yield' && (
                <YieldEstimator theme={theme} />
              )}

              {mod.kind === 'plotTools' && (
                <PlotTools theme={theme} />
              )}

              {mod.kind === 'compare' && (
                <CompareTable properties={topProperties.slice(0, 3)} theme={theme} />
              )}

              {mod.kind === 'concierge' && (
                <div className="p-8 sm:p-10 rounded-2xl mt-6 border border-white/15 bg-black/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl space-y-3">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D4AF6A]">
                      Discreet & Verified
                    </span>
                    <div className="space-y-2 mt-2">
                      {mod.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 font-sans text-sm opacity-85">
                          <span className="text-[#D4AF6A]">{"\u2726"}</span>
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onEnquireClick}
                    className="px-6 py-3.5 rounded-full border border-[#D4AF6A] text-white hover:bg-[#D4AF6A] hover:text-black font-sans text-xs uppercase tracking-wider font-medium transition-all duration-300 flex-shrink-0 cursor-pointer shadow-lg"
                  >
                    {mod.ctaLabel}
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>
      );
    };

    const EmiEstimator = ({ presetPriceCr, theme }) => {
      const [priceCr, setPriceCr] = useState(presetPriceCr);
      const [downPaymentPct, setDownPaymentPct] = useState(20);
      const [ratePct, setRatePct] = useState(8.5);
      const [tenureYears, setTenureYears] = useState(20);

      const priceVal = priceCr * 1e7;
      const downPayment = (priceVal * downPaymentPct) / 100;
      const loanAmount = priceVal - downPayment;
      const monthlyRate = ratePct / 12 / 100;
      const totalMonths = tenureYears * 12;

      const emi = loanAmount > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : 0;

      const totalInterest = emi * totalMonths - loanAmount;
      const stampDutyReg = priceVal * 0.06;

      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-sans mb-1 opacity-80">
                <span>Property Value</span>
                <span className="font-medium text-white">{formatPrice(priceCr)}</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={20}
                step={0.1}
                value={priceCr}
                onChange={(e) => setPriceCr(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF6A] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-sans mb-1 opacity-80">
                <span>Down Payment: {downPaymentPct}%</span>
                <span className="font-medium text-white">{'\u20B9'}{Math.round(downPayment).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(parseInt(e.target.value))}
                className="w-full accent-[#D4AF6A] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans opacity-70 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={ratePct}
                  onChange={(e) => setRatePct(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans opacity-70 mb-1">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)}
                  className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="font-sans text-xs uppercase tracking-wider opacity-60">
                Monthly EMI Estimate
              </span>
              <div className="text-4xl font-serif mt-1 mb-6" style={{ color: theme.accent }}>
                {'\u20B9'}{Math.round(emi).toLocaleString('en-IN')}
                <span className="text-xs font-sans text-white/50 ml-1">/ month</span>
              </div>

              <div className="space-y-2.5 font-sans text-xs divide-y divide-white/10">
                <div className="flex justify-between pt-1 opacity-80">
                  <span>Loan Amount</span>
                  <span className="font-medium text-white">{'\u20B9'}{Math.round(loanAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 opacity-80">
                  <span>Total Interest</span>
                  <span className="font-medium text-white">{'\u20B9'}{Math.round(totalInterest).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 opacity-80">
                  <span>Estimated Stamp Duty & Reg (6%)</span>
                  <span className="font-medium text-white">{'\u20B9'}{Math.round(stampDutyReg).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <p className="font-sans text-[11px] opacity-40 mt-6 italic">
              * Indicative calculation only. Rates and eligibility depend on lender criteria.
            </p>
          </div>
        </div>
      );
    };

    const YieldEstimator = ({ theme }) => {
      const [price, setPrice] = useState(9500000);
      const [monthlyRent, setMonthlyRent] = useState(65000);

      const annualRent = monthlyRent * 12;
      const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
      const paybackYears = annualRent > 0 ? price / annualRent : 0;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans opacity-70 mb-1">Asset Acquisition Price ({'\u20B9'})</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full h-11 px-4 bg-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
              />
            </div>
            <div>
              <label className="block text-xs font-sans opacity-70 mb-1">Estimated Monthly Rental ({'\u20B9'})</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                className="w-full h-11 px-4 bg-white/10 rounded-xl text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center gap-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-sans uppercase tracking-wider opacity-60">Gross Rental Yield</span>
              <span className="text-3xl font-serif" style={{ color: theme.accent }}>
                {grossYield.toFixed(2)}% p.a.
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF6A] transition-all duration-500" style={{ width: `${Math.min(grossYield * 10, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs font-sans opacity-80 pt-2 border-t border-white/10">
              <span>Capital Payback Period</span>
              <span className="font-medium text-white">{paybackYears.toFixed(1)} Years</span>
            </div>
            <span className="text-[10px] font-sans opacity-40 italic">
              * Indicative only. Excludes vacancy risk and maintenance reserves.
            </span>
          </div>
        </div>
      );
    };

    const PlotTools = ({ theme }) => {
      const [sqYd, setSqYd] = useState(267);
      const [ratePerSqYd, setRatePerSqYd] = useState(14232);

      const sqFt = sqYd * 9;
      const totalCost = sqYd * ratePerSqYd;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-serif text-lg mb-2">Area Dimension Conversion</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans opacity-70 mb-1">Square Yards (sq yd)</label>
                <input
                  type="number"
                  value={sqYd}
                  onChange={(e) => setSqYd(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans opacity-70 mb-1">Square Feet (sq ft)</label>
                <input
                  type="number"
                  value={sqFt}
                  readOnly
                  className="w-full h-10 px-3 bg-white/5 rounded-lg text-sm font-sans text-white/70 border border-white/5"
                />
              </div>
            </div>
            <p className="text-xs font-sans opacity-50 pt-1">
              Rule of thumb: 1 Square Yard = 9 Square Feet.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg mb-4">Total Cost Calculation</h3>
              <div className="mb-4">
                <label className="block text-xs font-sans opacity-70 mb-1">Rate per Sq Yd ({'\u20B9'})</label>
                <input
                  type="number"
                  value={ratePerSqYd}
                  onChange={(e) => setRatePerSqYd(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-xs font-sans opacity-70">Estimated Cost:</span>
              <span className="text-2xl font-serif text-[#D4AF6A]">
                {'\u20B9'}{Math.round(totalCost).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      );
    };

    const CompareTable = ({ properties, theme }) => {
      if (!properties || properties.length === 0) return null;

      return (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left font-sans text-sm border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-white/15">
                <th className="pb-3 w-1/4 text-xs uppercase tracking-wider opacity-60">Parameter</th>
                {properties.map((p) => (
                  <th key={p.id} className="pb-3 text-sm font-serif font-normal text-white">
                    {p.name.replace('\n', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Price</td>
                {properties.map((p, idx) => (
                  <td key={p.id} className="py-3 font-serif text-lg text-[#D4AF6A]">
                    <div className="flex items-center gap-1.5">
                      {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]" />}
                      <span>{formatPrice(p.priceCr)}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Total Area</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-3 opacity-90">
                    {p.area.toLocaleString('en-IN')} {p.areaUnit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Unit Price</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-3 opacity-90">
                    {pricePerUnit(p)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Status</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-3 capitalize opacity-90">
                    {p.status.replace('-', ' ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Facing</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-3 opacity-90">
                    {p.facing}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs uppercase tracking-wider opacity-60">Possession</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-3 opacity-90">
                    {p.possession}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    };

    // =========================================================================
    // BUY PAGE (ALL PROPERTIES WITH 4 LINK COLUMNS)
    // =========================================================================
    const Buy = () => {
      const [searchParams, setSearchParams] = useSearchParams();
      const [q, setQ] = useState(searchParams.get('q') || '');
      const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
      const [budgetFilter, setBudgetFilter] = useState(searchParams.get('budget') || '');
      const [bhkFilter, setBhkFilter] = useState(searchParams.get('bhk') || '');
      const [sortOrder, setSortOrder] = useState('default');

      const [selectedProperty, setSelectedProperty] = useState(null);
      const [isDetailOpen, setIsDetailOpen] = useState(false);
      const [savedIds, setSavedIds] = useState({});

      useEffect(() => {
        document.title = 'Buy Luxury Real Estate in Hyderabad | VESTA';
      }, []);

      useEffect(() => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (typeFilter) params.set('type', typeFilter);
        if (budgetFilter) params.set('budget', budgetFilter);
        if (bhkFilter) params.set('bhk', bhkFilter);
        setSearchParams(params, { replace: true });
      }, [q, typeFilter, budgetFilter, bhkFilter, setSearchParams]);

      const filteredProperties = useMemo(() => {
        let list = propertiesData.filter((p) => {
          if (q.trim()) {
            const query = q.toLowerCase();
            const matchesName = p.name.toLowerCase().includes(query);
            const matchesLoc = p.location.toLowerCase().includes(query);
            const matchesDesc = p.description.toLowerCase().includes(query);
            const matchesSubtype = p.subtype.toLowerCase().includes(query);
            const matchesHighlights = p.highlights.some((h) => h.toLowerCase().includes(query));
            if (!matchesName && !matchesLoc && !matchesDesc && !matchesSubtype && !matchesHighlights) return false;
          }

          if (typeFilter) {
            if (typeFilter === 'flats-apartments' && p.type !== 'apartment') return false;
            if (typeFilter === 'independent-houses' && p.type !== 'house') return false;
            if (typeFilter === 'villas' && p.type !== 'villa') return false;
            if (typeFilter === 'plots-land' && p.type !== 'plot') return false;
            if (typeFilter === 'commercial' && p.type !== 'commercial') return false;
          }

          if (budgetFilter) {
            if (budgetFilter === 'under-50-lacs' && p.priceCr >= 0.5) return false;
            if (budgetFilter === '50-lacs-to-1-cr' && (p.priceCr < 0.5 || p.priceCr >= 1)) return false;
            if (budgetFilter === '1-cr-to-5-cr' && (p.priceCr < 1 || p.priceCr >= 5)) return false;
            if (budgetFilter === 'above-5-cr' && p.priceCr < 5) return false;
          }

          if (bhkFilter) {
            if (bhkFilter === '1-bhk' && p.beds !== 1) return false;
            if (bhkFilter === '2-bhk' && p.beds !== 2) return false;
            if (bhkFilter === '3-bhk' && p.beds !== 3) return false;
            if (bhkFilter === '4-bhk' && p.beds !== 4) return false;
            if (bhkFilter === '4-plus-bhk' && (p.beds === null || p.beds <= 4)) return false;
          }

          return true;
        });

        if (sortOrder === 'price-asc') {
          list = [...list].sort((a, b) => a.priceCr - b.priceCr);
        } else if (sortOrder === 'price-desc') {
          list = [...list].sort((a, b) => b.priceCr - a.priceCr);
        }

        return list;
      }, [q, typeFilter, budgetFilter, bhkFilter, sortOrder]);

      const toggleSave = (id, e) => {
        e.stopPropagation();
        setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
      };

      const handleSelectProperty = (p) => {
        setSelectedProperty(p);
        setIsDetailOpen(true);
      };

      return (
        <div className="relative w-full min-h-screen bg-[#0C0C0C] text-white">
          <div className="w-full pb-20 pt-4 px-6 md:px-12 lg:px-16 bg-[#0C0C0C]">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mx-auto mb-4" />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-3">
                Residences & Collections
              </h1>
              <p className="font-sans text-sm text-white/70 max-w-lg mx-auto">
                Explore 12 signature Hyderabad properties across 18 specialized architectural and investment collections.
              </p>
            </div>

            <SearchBar
              q={q}
              onQChange={setQ}
              type={typeFilter}
              onTypeChange={setTypeFilter}
              budget={budgetFilter}
              onBudgetChange={setBudgetFilter}
              bhk={bhkFilter}
              onBhkChange={setBhkFilter}
              onReset={() => {
                setQ('');
                setTypeFilter('');
                setBudgetFilter('');
                setBhkFilter('');
              }}
            />
          </div>

          <section className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#FAF8F4] text-[#0C0C0C] px-6 sm:px-10 md:px-16 lg:px-20 py-20 -mt-14 z-20 shadow-2xl">
            <div className="max-w-6xl mx-auto">
              {/* 4 LINK COLUMNS */}
              <div className="mb-20 pb-16 border-b border-black/10">
                <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block mb-2 font-medium">
                  Browse by Collection
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#0C0C0C] mb-8">
                  Explore Specialized Portfolios
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {BUY_TAXONOMY_GROUPS.map((group) => (
                    <div key={group.key} className="flex flex-col">
                      <h3 className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-[#0C0C0C]/80 pb-3 border-b border-black/10 mb-4">
                        {group.title}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {group.options.map((opt) => (
                          <TransitionLink
                            key={opt.slug}
                            to={`/buy/${opt.slug}`}
                            transitionLabel={opt.label}
                            className="group flex items-center justify-between py-1 text-left text-sm font-sans text-black/75 hover:text-black transition-colors"
                          >
                            <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A] mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="font-serif text-lg leading-tight">{opt.label}</span>
                              {opt.badge && (
                                <span className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] ml-2">
                                  {opt.badge}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-black/40 font-sans">
                              {countFor(opt.slug)}
                            </span>
                          </TransitionLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESULTS BAR */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="font-sans text-xs text-black/60">
                  Showing <strong className="text-black">{filteredProperties.length}</strong> of {propertiesData.length} residences
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-sans text-black/60 uppercase tracking-wider">Sort:</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-black/5 border border-black/15 rounded-lg px-3 py-1.5 text-xs font-sans text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                  >
                    <option value="default">Curated Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-black/5 border border-black/10">
                  <h3 className="font-serif text-2xl text-black mb-2">No matching listings found</h3>
                  <p className="font-sans text-sm text-black/60 max-w-md mx-auto mb-6">
                    Try clearing search terms or removing dropdown filters to see available properties.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQ('');
                      setTypeFilter('');
                      setBudgetFilter('');
                      setBhkFilter('');
                    }}
                    className="px-6 py-2.5 rounded-full border border-black text-xs font-sans uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map((p, idx) => (
                    <BuyCard
                      key={p.id}
                      property={p}
                      index={idx}
                      theme={{
                        mode: 'light',
                        bg: '#FAF8F4',
                        ink: '#0C0C0C',
                        accent: '#D4AF6A',
                        accentInk: '#8C671D',
                        dark1: '#1F1E1B',
                        dark2: '#0C0C0C',
                      }}
                      isSaved={Boolean(savedIds[p.id])}
                      onToggleSave={toggleSave}
                      onSelectProperty={handleSelectProperty}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {selectedProperty && (
            <PropertyDetail
              property={selectedProperty}
              isOpen={isDetailOpen}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </div>
      );
    };

    // =========================================================================
    // BUY CATEGORY PAGE (/buy/:slug)
    // =========================================================================
    const BuyCategory = () => {
      const { slug } = useParams();
      const config = slug ? getBuyPageConfig(slug) : undefined;

      const [q, setQ] = useState('');
      const [typeFilter, setTypeFilter] = useState('');
      const [budgetFilter, setBudgetFilter] = useState('');
      const [bhkFilter, setBhkFilter] = useState('');
      const [sortOrder, setSortOrder] = useState('default');

      const [selectedProperty, setSelectedProperty] = useState(null);
      const [isDetailOpen, setIsDetailOpen] = useState(false);
      const [savedIds, setSavedIds] = useState({});
      const [openFaqIndex, setOpenFaqIndex] = useState(null);

      const containerRef = useRef(null);
      const headlineRef = useRef(null);
      const numeralRef = useRef(null);
      const cardsGridRef = useRef(null);
      const { isTransitioning } = usePageTransition();

      if (!config || !slug) {
        return <NotFound />;
      }

      useEffect(() => {
        document.title = `${config.label} | VESTA`;
      }, [config.label]);

      useEffect(() => {
        const root = document.documentElement;
        const { theme, displayFont } = config;

        const fontMap = {
          instrument: '"Instrument Serif", Georgia, serif',
          cormorant: '"Cormorant Garamond", Georgia, serif',
          fraunces: 'Fraunces, Georgia, serif',
          grotesk: '"Space Grotesk", sans-serif',
        };

        root.style.setProperty('--bg', theme.bg);
        root.style.setProperty('--ink', theme.ink || '#0C0C0C');
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-ink', theme.accentInk);
        root.style.setProperty('--dark1', theme.dark1);
        root.style.setProperty('--dark2', theme.dark2);
        root.style.setProperty('--font-display', fontMap[displayFont]);
        root.setAttribute('data-mode', theme.mode);

        if (document.fonts) {
          document.fonts.load(`1em ${fontMap[displayFont]}`).catch(() => {});
        }

        return () => {
          root.style.removeProperty('--bg');
          root.style.removeProperty('--ink');
          root.style.removeProperty('--accent');
          root.style.removeProperty('--accent-ink');
          root.style.removeProperty('--dark1');
          root.style.removeProperty('--dark2');
          root.style.removeProperty('--font-display');
          root.removeAttribute('data-mode');
        };
      }, [config]);

      const { primary: baseProperties, suggestions } = useMemo(() => {
        return getPropertiesWithFallback(slug);
      }, [slug]);

      const filteredProperties = useMemo(() => {
        let list = baseProperties.filter((p) => {
          if (q.trim()) {
            const query = q.toLowerCase();
            const matchesName = p.name.toLowerCase().includes(query);
            const matchesLoc = p.location.toLowerCase().includes(query);
            const matchesDesc = p.description.toLowerCase().includes(query);
            const matchesSubtype = p.subtype.toLowerCase().includes(query);
            const matchesHighlights = p.highlights.some((h) => h.toLowerCase().includes(query));
            if (!matchesName && !matchesLoc && !matchesDesc && !matchesSubtype && !matchesHighlights) return false;
          }

          if (typeFilter) {
            if (typeFilter === 'flats-apartments' && p.type !== 'apartment') return false;
            if (typeFilter === 'independent-houses' && p.type !== 'house') return false;
            if (typeFilter === 'villas' && p.type !== 'villa') return false;
            if (typeFilter === 'plots-land' && p.type !== 'plot') return false;
            if (typeFilter === 'commercial' && p.type !== 'commercial') return false;
          }

          if (budgetFilter) {
            if (budgetFilter === 'under-50-lacs' && p.priceCr >= 0.5) return false;
            if (budgetFilter === '50-lacs-to-1-cr' && (p.priceCr < 0.5 || p.priceCr >= 1)) return false;
            if (budgetFilter === '1-cr-to-5-cr' && (p.priceCr < 1 || p.priceCr >= 5)) return false;
            if (budgetFilter === 'above-5-cr' && p.priceCr < 5) return false;
          }

          if (bhkFilter) {
            if (bhkFilter === '1-bhk' && p.beds !== 1) return false;
            if (bhkFilter === '2-bhk' && p.beds !== 2) return false;
            if (bhkFilter === '3-bhk' && p.beds !== 3) return false;
            if (bhkFilter === '4-bhk' && p.beds !== 4) return false;
            if (bhkFilter === '4-plus-bhk' && (p.beds === null || p.beds <= 4)) return false;
          }

          return true;
        });

        if (sortOrder === 'price-asc') {
          list = [...list].sort((a, b) => a.priceCr - b.priceCr);
        } else if (sortOrder === 'price-desc') {
          list = [...list].sort((a, b) => b.priceCr - a.priceCr);
        }

        return list;
      }, [baseProperties, q, typeFilter, budgetFilter, bhkFilter, sortOrder]);

      const displayedCards = useMemo(() => {
        if (filteredProperties.length >= 3) {
          return { primary: filteredProperties, suggested: [] };
        }
        const currentIds = new Set(filteredProperties.map((p) => p.id));
        const extraSuggestions = suggestions.filter((p) => !currentIds.has(p.id));
        return {
          primary: filteredProperties,
          suggested: extraSuggestions.slice(0, 3 - filteredProperties.length),
        };
      }, [filteredProperties, suggestions]);

      const stats = useMemo(() => {
        const list = baseProperties.length > 0 ? baseProperties : filteredProperties;
        const count = list.length;
        if (count === 0) {
          return { count: 0, priceRange: '\u2014', avgRate: '\u2014', unitLabel: 'per sq ft' };
        }

        const prices = list.map((p) => p.priceCr);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = minPrice === maxPrice
          ? formatPrice(minPrice)
          : `${formatPrice(minPrice)} \u2013 ${formatPrice(maxPrice)}`;

        const allPlots = list.every((p) => p.areaUnit === 'sq yd');
        const allSqFt = list.every((p) => p.areaUnit === 'sq ft');
        let avgRate = '\u2014';
        let unitLabel = 'per sq ft';

        if (allPlots) {
          const totalCost = list.reduce((sum, p) => sum + p.priceCr * 1e7, 0);
          const totalArea = list.reduce((sum, p) => sum + p.area, 0);
          avgRate = `\u20B9${Math.round(totalCost / totalArea).toLocaleString('en-IN')}`;
          unitLabel = 'per sq yd';
        } else if (allSqFt) {
          const totalCost = list.reduce((sum, p) => sum + p.priceCr * 1e7, 0);
          const totalArea = list.reduce((sum, p) => sum + p.area, 0);
          avgRate = `\u20B9${Math.round(totalCost / totalArea).toLocaleString('en-IN')}`;
          unitLabel = 'per sq ft';
        }

        return { count, priceRange, avgRate, unitLabel };
      }, [baseProperties, filteredProperties]);

      useEffect(() => {
        if (isTransitioning || !window.gsap) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = window.gsap.context(() => {
          const { motion } = config;

          if (motion === 'maskRise' || motion === 'goldSweep' || motion === 'numeral') {
            const words = headlineRef.current?.querySelectorAll('.mask-word');
            if (words && words.length > 0) {
              window.gsap.fromTo(
                words,
                { yPercent: 110, filter: 'blur(6px)', opacity: 0 },
                { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }
              );
            }
          }

          if (motion === 'blueprint') {
            const bgGrid = containerRef.current?.querySelector('.blueprint-grid');
            if (bgGrid) {
              window.gsap.fromTo(
                bgGrid,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }
              );
            }
          }

          if (motion === 'ticker') {
            const words = headlineRef.current?.querySelectorAll('.mask-word');
            if (words && words.length > 0) {
              window.gsap.fromTo(
                words,
                { y: 60, scale: 1.06, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)', stagger: 0.05 }
              );
            }
          }

          if (motion === 'numeral' && numeralRef.current) {
            window.gsap.fromTo(
              numeralRef.current,
              { yPercent: 100 },
              { yPercent: 0, duration: 1.2, ease: 'power3.out' }
            );
          }

          const cards = cardsGridRef.current?.querySelectorAll('.buy-card');
          if (cards && cards.length > 0) {
            window.gsap.fromTo(
              cards,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: cardsGridRef.current,
                  start: 'top 85%',
                },
              }
            );
          }
        }, containerRef);

        return () => ctx.revert();
      }, [config, isTransitioning, slug]);

      const toggleSave = (id, e) => {
        e.stopPropagation();
        setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
      };

      const handleSelectProperty = (p) => {
        setSelectedProperty(p);
        setIsDetailOpen(true);
      };

      const toggleFaq = (idx) => {
        setOpenFaqIndex((prev) => (prev === idx ? null : idx));
      };

      const { currentGroup, prevOption, nextOption, otherGroups } = useMemo(() => {
        const group = BUY_TAXONOMY_GROUPS.find((g) => g.key === config.group);
        if (!group) return { currentGroup: null, prevOption: null, nextOption: null, otherGroups: [] };
        const idx = group.options.findIndex((o) => o.slug === config.slug);
        const prev = group.options[(idx - 1 + group.options.length) % group.options.length];
        const next = group.options[(idx + 1) % group.options.length];
        const others = BUY_TAXONOMY_GROUPS.filter((g) => g.key !== config.group);
        return { currentGroup: group, prevOption: prev, nextOption: next, otherGroups: others };
      }, [config]);

      const renderHeadline = (headline) => {
        return headline.split('\n').map((line, lIdx) => {
          const parts = line.split(/(\*[^*]+\*)/g);
          return (
            <span key={lIdx} className="headline-line block overflow-hidden pb-2">
              {parts.map((part, pIdx) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  const text = part.slice(1, -1);
                  return (
                    <span key={pIdx} className="mask-word inline-block italic font-normal" style={{ color: config.theme.accent }}>
                      {text}&nbsp;
                    </span>
                  );
                }
                return part.split(' ').map((word, wIdx) => {
                  if (!word) return null;
                  return (
                    <span key={`${pIdx}-${wIdx}`} className="mask-word inline-block">
                      {word}&nbsp;
                    </span>
                  );
                });
              })}
            </span>
          );
        });
      };

      return (
        <div
          ref={containerRef}
          className="relative w-full min-h-screen text-[var(--ink)] overflow-x-hidden"
          style={{ backgroundColor: config.theme.dark2 }}
        >
          <div className="w-full pb-20 pt-4 px-6 md:px-12 lg:px-16" style={{ backgroundColor: config.theme.dark2 }}>
            <SearchBar
              q={q}
              onQChange={setQ}
              type={typeFilter}
              onTypeChange={setTypeFilter}
              budget={budgetFilter}
              onBudgetChange={setBudgetFilter}
              bhk={bhkFilter}
              onBhkChange={setBhkFilter}
              categoryLabel={config.label}
              onReset={() => {
                setQ('');
                setTypeFilter('');
                setBudgetFilter('');
                setBhkFilter('');
              }}
              className="mt-6"
            />
          </div>

          <section
            className="relative w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-6 sm:px-10 md:px-16 lg:px-20 py-20 -mt-14 z-20 transition-colors duration-500 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg)',
              color: 'var(--ink)',
            }}
          >
            {config.motion === 'blueprint' && (
              <div
                className="blueprint-grid absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, ${config.theme.accent} 1px, transparent 1px), linear-gradient(to bottom, ${config.theme.accent} 1px, transparent 1px)`,
                  backgroundSize: '48px 48px',
                }}
              />
            )}

            {config.motion === 'numeral' && config.numeral && (
              <div
                ref={numeralRef}
                aria-hidden="true"
                className="absolute top-12 right-6 sm:right-16 select-none pointer-events-none leading-none opacity-40 font-serif"
                style={{
                  fontSize: 'clamp(14rem, 36vw, 30rem)',
                  color: 'transparent',
                  WebkitTextStroke: `1px ${config.theme.accent}`,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {config.numeral}
              </div>
            )}

            {config.motion === 'ticker' && (
              <div
                className="w-full overflow-hidden border-y py-2.5 mb-12 -mx-6 sm:-mx-10 md:-mx-16 lg:-mx-20 px-6 sm:px-10 border-white/10"
                style={{ backgroundColor: `${config.theme.accent}15` }}
              >
                <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] gap-8 font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-[var(--ink)]">
                  <span>{config.label} Collection</span>
                  <span style={{ color: config.theme.accent }}>{"\u2726"}</span>
                  <span>Direct Developer Allocation</span>
                  <span style={{ color: config.theme.accent }}>{"\u2726"}</span>
                  <span>Verified Title & RERA Compliant</span>
                  <span style={{ color: config.theme.accent }}>{"\u2726"}</span>
                  <span>{'Jubilee Hills \u00B7 Banjara Hills \u00B7 Kokapet'}</span>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] rounded-full" style={{ backgroundColor: config.theme.accent }} />
                <span
                  className="font-sans text-xs uppercase tracking-[0.25em] font-medium"
                  style={{ color: config.theme.mode === 'dark' ? config.theme.accentInk : config.theme.accent }}
                >
                  {config.eyebrow}
                </span>
              </div>

              <h1
                ref={headlineRef}

                className="leading-[1.02] tracking-[-0.02em] mb-6 text-[clamp(2.75rem,7vw,6.25rem)] outline-none focus:outline-none focus-visible:outline-none"
                style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
              >
                {renderHeadline(config.headline)}
              </h1>

              <p className="font-sans font-light text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed mb-10">
                {config.lead}
              </p>

              <div className="w-full h-[1px] opacity-20 mb-12" style={{ backgroundColor: 'var(--ink)' }} />

              {/* STATS STRIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-white/10 mb-16">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl font-serif leading-none" style={{ color: config.theme.accent }}>
                    {stats.count}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                    Residences Available
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-serif leading-none truncate" style={{ color: config.theme.accent }}>
                    {stats.priceRange}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                    Price Range
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-serif leading-none" style={{ color: config.theme.accent }}>
                    {stats.avgRate}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] opacity-60 mt-2">
                    Avg Rate ({stats.unitLabel})
                  </span>
                </div>
              </div>

              {/* RESULTS BAR */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 font-sans text-xs opacity-75">
                  <span>Showing {displayedCards.primary.length} of {baseProperties.length} residences</span>
                  {Boolean(q || typeFilter || budgetFilter || bhkFilter) && (
                    <span className="text-[#D4AF6A]">(Filtered)</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-sans opacity-60 uppercase tracking-wider">Sort:</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                    style={{ color: 'var(--ink)' }}
                  >
                    <option value="default" className="bg-[#121212] text-white">Curated Order</option>
                    <option value="price-asc" className="bg-[#121212] text-white">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#121212] text-white">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* CARDS GRID */}
              {displayedCards.primary.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 mb-12">
                  <h3 className="font-serif text-2xl mb-2">No matching listings found</h3>
                  <p className="font-sans text-sm opacity-60 max-w-md mx-auto mb-6">
                    Try adjusting your search query or reset dropdown filters to see available properties.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQ('');
                      setTypeFilter('');
                      setBudgetFilter('');
                      setBhkFilter('');
                    }}
                    className="px-6 py-2.5 rounded-full border border-white/30 text-xs font-sans uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedCards.primary.map((p, idx) => (
                    <BuyCard
                      key={p.id}
                      property={p}
                      index={idx}
                      theme={config.theme}
                      motion={config.motion}
                      isSaved={Boolean(savedIds[p.id])}
                      onToggleSave={toggleSave}
                      onSelectProperty={handleSelectProperty}
                    />
                  ))}
                </div>
              )}

              {/* "YOU MAY ALSO LIKE" SECTION */}
              {displayedCards.suggested.length > 0 && (
                <div className="mt-16 pt-12 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-6 h-[1px] bg-[#D4AF6A]" />
                    <h3 className="font-serif text-2xl text-white">
                      You may also like
                    </h3>
                    <span className="font-sans text-xs text-white/50">
                      (Closest matching neighborhood residences)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedCards.suggested.map((p, idx) => (
                      <BuyCard
                        key={p.id}
                        property={p}
                        index={displayedCards.primary.length + idx}
                        theme={config.theme}
                        motion={config.motion}
                        isSaved={Boolean(savedIds[p.id])}
                        onToggleSave={toggleSave}
                        onSelectProperty={handleSelectProperty}
                        isSuggested
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* MODULES */}
              <CategoryModules
                modules={config.modules}
                theme={config.theme}
                topProperties={baseProperties}
                onEnquireClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
              />

              {/* FAQ ACCORDION */}
              <div className="mt-20 pt-16 border-t border-white/10">
                <h2
                  className="text-3xl sm:text-4xl leading-tight mb-8"
                  style={{ fontFamily: 'var(--font-display, "Instrument Serif", serif)' }}
                >
                  Frequently Answered Inquiries
                </h2>

                <div className="space-y-4">
                  {config.faq.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-colors">
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A]"
                        >
                          <span className="font-serif text-xl sm:text-2xl pr-4">
                            {item.q}
                          </span>
                          <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 bg-[#D4AF6A] text-black border-[#D4AF6A]' : 'text-white'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-1 font-sans text-sm opacity-80 leading-relaxed border-t border-white/5">
                            <p>{item.hint}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLLECTION NAVIGATION */}
              <div className="mt-24 pt-16 border-t border-white/10">
                <span className="font-sans text-xs uppercase tracking-[0.2em] opacity-60 block mb-2">
                  Explore more collections
                </span>
                <h2 className="font-serif text-3xl mb-8">
                  Navigate {currentGroup?.title || 'Taxonomy'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {prevOption && (
                    <TransitionLink
                      to={`/buy/${prevOption.slug}`}
                      transitionLabel={prevOption.label}
                      className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                          <line x1="19" y1="12" x2="5" y2="12" />
                          <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <div>
                          <span className="text-[10px] font-sans uppercase tracking-wider opacity-50 block">Previous</span>
                          <span className="font-serif text-xl group-hover:text-[#D4AF6A] transition-colors">{prevOption.label}</span>
                        </div>
                      </div>
                      <span className="font-sans text-xs opacity-40">{countFor(prevOption.slug)} units</span>
                    </TransitionLink>
                  )}

                  {nextOption && (
                    <TransitionLink
                      to={`/buy/${nextOption.slug}`}
                      transitionLabel={nextOption.label}
                      className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-wider opacity-50 block">Next</span>
                        <span className="font-serif text-xl group-hover:text-[#D4AF6A] transition-colors">{nextOption.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs opacity-40">{countFor(nextOption.slug)} units</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </TransitionLink>
                  )}
                </div>

                <div className="space-y-6">
                  {otherGroups.map((g) => (
                    <div key={g.key}>
                      <span className="font-sans text-xs uppercase tracking-[0.16em] opacity-50 block mb-3">
                        {g.title}
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {g.options.map((opt) => (
                          <TransitionLink
                            key={opt.slug}
                            to={`/buy/${opt.slug}`}
                            transitionLabel={opt.label}
                            className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black hover:border-white text-xs font-sans transition-all duration-200 flex items-center gap-2"
                          >
                            <span>{opt.label}</span>
                            {opt.badge && (
                              <span className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[8px] uppercase tracking-wider px-1 py-0.2 rounded">
                                {opt.badge}
                              </span>
                            )}
                            <span className="opacity-40 text-[10px]">({countFor(opt.slug)})</span>
                          </TransitionLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-20 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const mail = `mailto:advisory@vesta.in?subject=Enquiry%20regarding%20${encodeURIComponent(config.label)}`;
                    window.location.href = mail;
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-sans text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4AF6A] hover:text-white transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span>{config.cta.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {selectedProperty && (
            <PropertyDetail
              property={selectedProperty}
              isOpen={isDetailOpen}
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </div>
      );
    };

    const NotFound = () => {
      return (
        <div className="w-full min-h-[80svh] flex flex-col items-center justify-center px-6 text-center bg-[#0C0C0C] text-white">
          <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mb-6" />
          <span className="font-sans text-xs uppercase tracking-[0.28em] text-white/50 mb-3">
            Error 404
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-tight tracking-[-0.02em] mb-4 text-white">
            Page not found
          </h1>
          <p className="font-sans font-light text-base text-white/60 max-w-md mb-8 leading-relaxed">
            The destination you are looking for does not exist or has been moved to another luxury address.
          </p>
          <TransitionLink
            to="/"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-black font-sans text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300 hover:bg-[#D4AF6A] hover:text-black cursor-pointer"
          >
            <span>Back to home</span>
          </TransitionLink>
        </div>
      );
    };

    const Layout = () => {
      return (
        <PageTransitionProvider>
          <ScrollManager />
          <div className="relative w-full min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between">
            <Navbar />
            <main className="w-full flex-1">
              <Outlet />
            </main>
          </div>
        </PageTransitionProvider>
      );
    };

    // =========================================================================
    // MAIN APP ROUTER
    // =========================================================================
    // =========================================================================
    // FAQS PAGE COMPONENT
    // =========================================================================
    const FAQ_DATA = [
      {
        id: 'legal-docs',
        category: 'Buying & Legal',
        question: 'What legal documents should I inspect before acquiring a luxury property in Hyderabad?',
        answer: 'Before acquisition, conduct a 30-year title search via the Registration & Stamps Department of Telangana. Essential documents include the Registered Title Deed, Encumbrance Certificate (EC), sanctioned layout plans from GHMC or HMDA, land use zoning approvals, and valid TG-RERA registration. For completed residences, always verify the Occupancy Certificate (OC) before disbursement.',
        highlight: 'Always verify TG-RERA registration and Occupancy Certificate (OC) prior to commitment.'
      },
      {
        id: 'rera-protection',
        category: 'Buying & Legal',
        question: 'How does TG-RERA protect buyers in under-construction developments?',
        answer: 'Under the Real Estate (Regulation and Development) Act as implemented in Telangana, developers are legally obligated to deposit 70% of all purchaser funds into an escrow bank account reserved exclusively for construction and land outlays. This prevents capital diversion, enforces strict milestone completion dates, and guarantees compensation for unauthorized layout alterations.',
        highlight: '70% of collections are legally escrowed for construction integrity.'
      },
      {
        id: 'stamp-duty-telangana',
        category: 'Taxes & Duty',
        question: 'What are the current stamp duty, registration charges, and transfer taxes in Telangana?',
        answer: 'In Telangana, property transactions currently incur approximately 7.5% in statutory government levies: 4% Stamp Duty, 0.5% Registration Fee, 1.5% Transfer Duty, and applicable local cess. For under-construction homes, 5% Goods and Services Tax (GST) applies on non-affordable properties without Input Tax Credit. Completed properties with an Occupancy Certificate are exempt from GST.',
        highlight: 'Indicative total statutory levy is approximately 7.5% plus GST on under-construction units.'
      },
      {
        id: 'nri-investment-rules',
        category: 'NRI Investors',
        question: 'Can Non-Resident Indians (NRIs) and OCIs acquire luxury residential properties in India?',
        answer: 'Yes. The Reserve Bank of India (RBI) under FEMA grants general permission to NRIs and Overseas Citizens of India (OCIs) to acquire residential and commercial real estate in India. Transactions must be conducted via inward remittances through recognized banking channels (NRE, NRO, or FCNR accounts). Agricultural land, farmhouses, and plantation properties require prior RBI sanction.',
        highlight: 'General permission applies for residential and commercial purchases via banking channels.'
      },
      {
        id: 'nri-repatriation',
        category: 'NRI Investors',
        question: 'How does capital and rental repatriation work for NRI property owners?',
        answer: 'Rental income after tax deduction (TDS under Section 195) is fully repatriable via NRO account through Form 15CA/15CB certification from a chartered accountant. Upon property sale, original investment capital remitted through NRE accounts can be repatriated in foreign currency up to two residential properties, subject to annual limits under the Liberalised Remittance Scheme.',
        highlight: 'Annual repatriation up to $1M USD is permitted through standard banking certification.'
      },
      {
        id: 'carpet-area-definition',
        category: 'Buying & Legal',
        question: 'What is the distinction between Carpet Area, Built-Up Area, and Super Built-Up Area?',
        answer: 'RERA mandates that property pricing is quoted strictly on Carpet Area \u2014 the net usable floor area between internal walls. Built-up area includes outer walls and private balconies. Super Built-Up Area adds pro-rata share of common amenities (grand lobbies, lift corridors, clubhouse facilities). Luxury towers in Hyderabad typically feature a loading factor between 22% and 28%.',
        highlight: 'All formal agreements must explicitly specify RERA Net Usable Carpet Area.'
      },
      {
        id: 'maintenance-charges',
        category: 'Possession & Handover',
        question: 'What ongoing maintenance fees and sinking funds apply in premier gated enclaves?',
        answer: 'Gated villa and high-rise developments in Kokapet, Jubilee Hills, and Financial District assess monthly maintenance charges ranging between \u20B93.5 and \u20B96.5 per square foot. These funds sustain 24/7 private security, landscaped gardens, high-speed elevators, and clubhouse amenities. A one-time corpus (sinking) fund is typically deposited at handover.',
        highlight: 'Indicative maintenance averages \u20B93.5 to \u20B96.5 per sq ft per month.'
      },
      {
        id: 'mortgage-valuation',
        category: 'Mortgages & Valuation',
        question: 'How do private banks underwrite mortgages and conduct property valuations for prime residences?',
        answer: 'Private wealth lenders and scheduled commercial banks commission dual independent technical valuations and rigorous legal audits before underwriting high-value mortgages. Prime properties in Hyderabad typically qualify for loan-to-value (LTV) ratios of 75% to 80% for loans up to \u20B975 Lacs, and 75% for loans above \u20B975 Lacs, based on borrower financial profile.',
        highlight: 'Indicative Loan-to-Value (LTV) ratios reach up to 75% for high-value properties.'
      },
      {
        id: 'viewing-procedure',
        category: 'Possession & Handover',
        question: 'What is the procedure for scheduling private, confidential site viewings with VESTA?',
        answer: 'VESTA coordinates bespoke, private on-site viewings for qualified principals. You may request a viewing directly through the "Book a Viewing" portal or by contacting your dedicated Buying Advisor. We arrange private site access, architectural documentation previews, and confidential owner consultations across Hyderabad premier developments.',
        highlight: 'Discreet escorted viewings arranged with complete privacy and full documentation.'
      }
    ];

    const FAQ_CATEGORIES = [
      'All',
      'Buying & Legal',
      'Taxes & Duty',
      'NRI Investors',
      'Mortgages & Valuation',
      'Possession & Handover'
    ];

    const Faqs = () => {
      const [selectedCategory, setSelectedCategory] = useState('All');
      const [searchQuery, setSearchQuery] = useState('');
      const [openFaqId, setOpenFaqId] = useState('legal-docs');

      const filteredFaqs = React.useMemo(() => {
        return FAQ_DATA.filter((item) => {
          const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
          const q = searchQuery.toLowerCase().trim();
          const matchesSearch =
            q === '' ||
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);
          return matchesCategory && matchesSearch;
        });
      }, [selectedCategory, searchQuery]);

      const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
      };

      return (
        <div className="w-full bg-[#0C0C0C] min-h-screen text-white pt-24 sm:pt-28 md:pt-32 pb-24 font-sans selection:bg-[#D4AF6A] selection:text-black">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#D4AF6A] rounded-full" />
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF6A] font-medium">
                VESTA ADVISORY {'\u00B7'} KNOWLEDGE & CLARITY
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-[-0.02em] leading-[1.05] mb-6 outline-none focus:outline-none">
              Frequently Asked <span className="italic text-[#E9DCC0]">Questions.</span>
            </h1>

            <p className="font-sans font-light text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed mb-10">
              Essential legal, financial, and procedural guidance for acquiring, investing, and holding luxury residences across Hyderabad.
            </p>

            <div className="relative max-w-xl mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions on RERA, stamp duty, NRI rules, valuation..."
                className="w-full px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder-white/35 text-sm font-sans focus:outline-none focus:border-[#D4AF6A] focus:ring-1 focus:ring-[#D4AF6A] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-white/40 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#D4AF6A] text-black font-medium shadow-[0_0_15px_rgba(212,175,106,0.3)]'
                        : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="font-serif text-xl text-white mb-2">No matching questions found</h3>
                <p className="text-white/60 text-sm font-sans max-w-md mx-auto mb-6">
                  Try searching with different terms or select "All" categories to view all advisory guidelines.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-5 py-2 rounded-full border border-white/20 text-xs font-sans text-white hover:bg-white hover:text-black transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'border-[#D4AF6A]/40 bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                        className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-sans px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#D4AF6A] border border-white/10">
                              {faq.category}
                            </span>
                            <span className="text-xs text-white/30 font-serif">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <h2 className="font-serif text-lg sm:text-xl text-white font-normal tracking-[-0.01em] leading-snug">
                            {faq.question}
                          </h2>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                            isOpen
                              ? 'rotate-180 bg-[#D4AF6A] text-black border-[#D4AF6A]'
                              : 'border-white/20 text-white/70 group-hover:text-white'
                          }`}
                        >
                          <ChevronDown size={14} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 font-sans text-sm text-white/80 leading-relaxed border-t border-white/5 animate-[fadeIn_0.3s_ease-out]">
                          <p className="mb-4">{faq.answer}</p>
                          {faq.highlight && (
                            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                              <span className="text-xs text-white/70 font-sans">
                                <strong className="text-white font-medium">Key Takeaway:</strong> {faq.highlight}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="w-6 h-[2px] bg-[#D4AF6A] rounded-full mb-3" />
                <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF6A] font-medium block mb-2">
                  Bespoke Advisory Desk
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3 tracking-[-0.01em]">
                  Have a tailored inquiry regarding a specific enclave or title?
                </h3>

                <p className="font-sans font-light text-sm text-white/70 mb-8 leading-relaxed">
                  Our private client advisors in Jubilee Hills offer confidential consultations on title diligence, transaction structures, and off-market developer allocations.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <TransitionLink
                    to="/services"
                    transitionLabel="Our Services"
                    className="px-6 py-3 rounded-full bg-[#D4AF6A] text-black font-sans text-xs uppercase tracking-wider font-medium hover:bg-[#e0bc77] transition-all duration-200"
                  >
                    Explore Advisory Services
                  </TransitionLink>

                  <TransitionLink
                    to="/buy"
                    transitionLabel="All Residences"
                    className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/15 text-white font-sans text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
                  >
                    Browse All Properties
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const App = () => {
      return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="buy" element={<Buy />} />
            <Route path="buy/:slug" element={<BuyCategory />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      );
    };

    const rootEl = document.getElementById('root');
    if (rootEl && !rootEl.hasChildNodes()) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    }
  