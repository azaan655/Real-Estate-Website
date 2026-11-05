import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Plus,
  Link2,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  Phone,
  Mail,
  MessageCircle,
  Home,
  Key,
  TrendingUp,
  FileCheck,
  Landmark,
  Globe,
  Handshake,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import { usePageTransition } from '../components/PageTransition';
import { FAQS, FAQ_CATEGORIES, Faq, FaqCategory } from '../data/faqs';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../data/services';

gsap.registerPlugin(ScrollTrigger);

const SEARCH_PLACEHOLDERS = [
  'Try stamp duty',
  'Try security deposit',
  'Try NRI',
  'Try RERA',
  'Try home loan',
];

export const Faqs: React.FC = () => {
  const { ready } = usePageTransition();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialCat = (searchParams.get('cat') as FaqCategory['id']) || 'all';
  const initialQ = searchParams.get('q') || '';

  const [activeCat, setActiveCat] = useState<'all' | FaqCategory['id']>(
    ['buying', 'renting', 'selling', 'legal', 'loans', 'nri', 'about'].includes(initialCat)
      ? initialCat
      : 'all'
  );
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [openId, setOpenId] = useState<string | null>(null);

  // Search input focus state for placeholder cycling
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Feedback state: { [faqId]: 'up' | 'down' }
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ask form state
  const [askName, setAskName] = useState('');
  const [askMobile, setAskMobile] = useState('');
  const [askQuestion, setAskQuestion] = useState('');
  const [askErrors, setAskErrors] = useState<{ name?: string; mobile?: string; question?: string }>({});
  const [isAskSubmitting, setIsAskSubmitting] = useState(false);
  const [isAskSuccess, setIsAskSuccess] = useState(false);

  // Refs for animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowDashRef = useRef<HTMLSpanElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const searchPillRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabPillRef = useRef<HTMLDivElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const askFormRef = useRef<HTMLDivElement>(null);

  // Sticky tabs tracker
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const headerBlockRef = useRef<HTMLDivElement>(null);

  // Page title
  useEffect(() => {
    document.title = 'FAQs | VESTA';
  }, []);

  // SEO: Structured data schema.org FAQPage & Meta Description
  useEffect(() => {
    // Meta description
    let meta = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
      createdMeta = true;
    }
    const prevDesc = meta.getAttribute('content') || '';
    meta.setAttribute(
      'content',
      'Answers to common questions on buying, renting, selling, legal paperwork and financing property in Hyderabad.'
    );

    // JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      if (createdMeta && meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.setAttribute('content', prevDesc);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Placeholder cycling every 3s when search is unfocused and empty
  useEffect(() => {
    if (isSearchFocused || searchQuery.trim().length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isSearchFocused, searchQuery]);

  // Debounce search query 150ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCat !== 'all') params.set('cat', activeCat);
    if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
    setSearchParams(params, { replace: true });
  }, [activeCat, debouncedQuery, setSearchParams]);

  // Handle URL hash on initial load or transition ready
  useEffect(() => {
    if (!ready) return;
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = FAQS.find((f) => f.id === hash);
      if (match) {
        setActiveCat('all');
        setSearchQuery('');
        setDebouncedQuery('');
        setOpenId(hash);
        setTimeout(() => {
          const el = document.getElementById('faq-' + hash);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 160;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 350);
        return;
      }
    }

    // If no hash, open first item by default on initial load
    if (openId === null && FAQS.length > 0) {
      setOpenId(FAQS[0].id);
    }
  }, [ready]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    let list = FAQS;
    if (activeCat !== 'all') {
      list = list.filter((f) => f.cat === activeCat);
    }

    const query = debouncedQuery.trim().toLowerCase();
    if (!query) return list;

    const tokens = query.split(/\s+/).filter((t) => t.length >= 2);
    if (tokens.length === 0) return list;

    return list.filter((item) => {
      const catLabel =
        FAQ_CATEGORIES.find((c) => c.id === item.cat)?.label.toLowerCase() || '';
      const text = `${item.q} ${item.a} ${catLabel}`.toLowerCase();
      return tokens.every((token) => text.includes(token));
    });
  }, [activeCat, debouncedQuery]);

  // Search counts per category
  const categoryCounts = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter((t) => t.length >= 2);

    const counts: Record<string, number> = { all: 0 };
    FAQ_CATEGORIES.forEach((c) => {
      counts[c.id] = 0;
    });

    FAQS.forEach((item) => {
      let matches = true;
      if (tokens.length > 0) {
        const catLabel =
          FAQ_CATEGORIES.find((c) => c.id === item.cat)?.label.toLowerCase() || '';
        const text = `${item.q} ${item.a} ${catLabel}`.toLowerCase();
        matches = tokens.every((token) => text.includes(token));
      }
      if (matches) {
        counts.all += 1;
        counts[item.cat] = (counts[item.cat] || 0) + 1;
      }
    });

    return counts;
  }, [debouncedQuery]);

  // Distinct topics present in current search results
  const distinctTopicsCount = useMemo(() => {
    const set = new Set(filteredFaqs.map((f) => f.cat));
    return set.size;
  }, [filteredFaqs]);

  // Sliding pill for Category Tabs
  const updateTabPill = useCallback(() => {
    if (!tabsContainerRef.current || !activeTabPillRef.current) return;
    const activeBtn = tabsContainerRef.current.querySelector(
      `button[data-cat="${activeCat}"]`
    ) as HTMLElement | null;

    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      gsap.to(activeTabPillRef.current, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.45,
        ease: 'power3.inOut',
      });
    }
  }, [activeCat]);

  useEffect(() => {
    updateTabPill();
    window.addEventListener('resize', updateTabPill);
    return () => window.removeEventListener('resize', updateTabPill);
  }, [updateTabPill]);

  // Sticky tabs detection
  useEffect(() => {
    const handleScroll = () => {
      if (!headerBlockRef.current) return;
      const rect = headerBlockRef.current.getBoundingClientRect();
      setIsTabsSticky(rect.bottom < 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Aurora card pause when off-screen
  useEffect(() => {
    const card = ctaCardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            card.removeAttribute('data-paused');
          } else {
            card.setAttribute('data-paused', 'true');
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Entrance animations sequence
  useEffect(() => {
    if (!ready || !pageContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Eyebrow dash draws
      if (eyebrowDashRef.current) {
        tl.fromTo(
          eyebrowDashRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power3.out' }
        );
      }

      // 2. Heading mask rise and gold sweep
      if (headingRef.current) {
        const accentSpan = headingRef.current.querySelector('.faq-accent-word') as HTMLElement | null;
        tl.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        );

        if (accentSpan) {
          tl.fromTo(
            accentSpan,
            { backgroundPosition: '200% 0' },
            {
              backgroundPosition: '-200% 0',
              duration: 1.6,
              ease: 'power2.inOut',
            },
            '-=0.2'
          );
        }
      }

      // 3. Lead text rise
      if (leadRef.current) {
        tl.fromTo(
          leadRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 0.65, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
      }

      // 4. Search pill rise
      if (searchPillRef.current) {
        tl.fromTo(
          searchPillRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
      }

      // 5. Tabs rise
      if (tabsContainerRef.current) {
        const tabs = tabsContainerRef.current.querySelectorAll('.faq-cat-tab');
        tl.fromTo(
          tabs,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
          '-=0.3'
        );
      }

      // 6. CTA Card entrance
      if (ctaCardRef.current) {
        gsap.fromTo(
          ctaCardRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaCardRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, [ready]);

  // Accordion row entrance scroll batch
  useEffect(() => {
    if (!ready || !accordionContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rows = accordionContainerRef.current.querySelectorAll('.faq-item-row');
    if (!rows || rows.length === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(rows, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        },
      });
    }, accordionContainerRef);

    return () => ctx.revert();
  }, [ready, filteredFaqs]);

  // Highlight helper for token search
  const highlightMatches = (text: string, query: string) => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
    if (tokens.length === 0) return text;

    // Build regex to match any of the tokens
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-transparent text-inherit underline decoration-[#D4AF6A] decoration-2"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Toggle FAQ item
  const handleToggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) {
      window.history.replaceState(null, '', `#${next}`);
    } else {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  };

  // Copy link with hash
  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?cat=${activeCat}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    });
  };

  // Feedback thumbs up/down
  const handleFeedback = (id: string, choice: 'up' | 'down') => {
    if (feedback[id]) return;
    setFeedback((prev) => ({ ...prev, [id]: choice }));
  };

  // Ask Us form submission
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; mobile?: string; question?: string } = {};

    if (!askName.trim()) {
      errors.name = 'Please provide your full name.';
    }
    if (!/^[6-9]\d{9}$/.test(askMobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (askQuestion.trim().length < 10) {
      errors.question = 'Question must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      setAskErrors(errors);
      return;
    }

    setAskErrors({});
    setIsAskSubmitting(true);

    setTimeout(() => {
      setIsAskSubmitting(false);
      setIsAskSuccess(true);
    }, 800);
  };

  // Icon renderer helper
  const renderCategoryIcon = (iconName: string, size = 16) => {
    switch (iconName) {
      case 'Home':
        return <Home size={size} />;
      case 'Key':
        return <Key size={size} />;
      case 'TrendingUp':
        return <TrendingUp size={size} />;
      case 'FileCheck':
        return <FileCheck size={size} />;
      case 'Landmark':
        return <Landmark size={size} />;
      case 'Globe':
        return <Globe size={size} />;
      case 'Handshake':
        return <Handshake size={size} />;
      default:
        return <Home size={size} />;
    }
  };

  // Group items by category for "All" or Search view
  const groupedFaqs = useMemo(() => {
    const groups: { category: FaqCategory; items: Faq[] }[] = [];
    FAQ_CATEGORIES.forEach((cat) => {
      const items = filteredFaqs.filter((f) => f.cat === cat.id);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    });
    return groups;
  }, [filteredFaqs]);

  return (
    <div
      ref={pageContainerRef}
      className="relative w-full min-h-screen bg-[#0B0907] text-[#0C0C0C] font-sans antialiased overflow-x-hidden"
    >
      {/* 1. BLACK HEADER with Navbar */}
      <div className="relative w-full bg-[#0B0907] pb-28 pt-6">
        <Navbar />
      </div>

      {/* 2. IVORY SECTION overlapping header */}
      <section
        className="relative z-30 w-full bg-[#FAF8F4] text-[#0C0C0C] -mt-[60px] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-24 md:py-32 shadow-2xl"
      >
        <div className="max-w-[1180px] mx-auto">
          {/* HEADER BLOCK */}
          <div ref={headerBlockRef} className="mb-14">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span
                ref={eyebrowDashRef}
                className="inline-block w-8 h-[2px] bg-[#D4AF6A] origin-left"
              />
              <span className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-[#8C671D]">
                Frequently Asked Questions
              </span>
            </div>

            {/* Heading and Lead */}
            <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <h1
                ref={headingRef}
                className="font-serif text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.02em] text-[#0C0C0C]"
              >
                Questions,
                <br />
                <span
                  className="faq-accent-word italic text-[#8C671D]"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #8C671D 0%, #D4AF6A 50%, #8C671D 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  answered.
                </span>
              </h1>

              <p
                ref={leadRef}
                className="mt-6 lg:mt-0 font-sans font-light text-[clamp(1rem,1.5vw,1.25rem)] max-w-xl text-[#0C0C0C]/65 leading-relaxed"
              >
                Straight answers on buying, renting, selling, paperwork and financing in Hyderabad, from the advisors who handle it every day.
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div ref={searchPillRef} className="max-w-2xl mx-auto mt-10">
              <div className="relative flex items-center h-16 rounded-full bg-white border border-black/10 shadow-[0_12px_40px_rgba(12,12,12,0.06)] px-6 transition-all duration-200 focus-within:border-[#8C671D] focus-within:ring-4 focus-within:ring-[#D4AF6A]/25">
                <Search size={20} className="text-black/40 mr-4 shrink-0" />
                <div className="relative flex-1 h-full flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setSearchQuery('');
                    }}
                    placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                    aria-label="Search frequently asked questions"
                    className="w-full h-full bg-transparent text-[16px] text-[#0C0C0C] placeholder-black/35 focus:outline-none"
                  />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors ml-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Live result counter */}
              <div
                aria-live="polite"
                className="text-center font-sans text-[13px] text-black/55 mt-3"
              >
                <span>
                  {filteredFaqs.length} answers across {distinctTopicsCount} topics
                </span>
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="relative mt-8">
              {/* Sticky Bar Wrapper */}
              <div
                className={`transition-all duration-300 ${
                  isTabsSticky
                    ? 'sticky top-4 z-40 bg-[#FAF8F4]/80 backdrop-blur-md py-3 px-4 rounded-full shadow-lg border border-black/10'
                    : ''
                }`}
              >
                <div
                  ref={tabsContainerRef}
                  className="relative flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x py-1 justify-start md:justify-center"
                >
                  {/* Shared sliding pill */}
                  <div
                    ref={activeTabPillRef}
                    className="absolute top-1 bottom-1 rounded-full bg-[#0C0C0C] pointer-events-none transition-all duration-300"
                    style={{ height: 'calc(100% - 8px)' }}
                  />

                  {/* 'All' Tab */}
                  <button
                    type="button"
                    data-cat="all"
                    onClick={() => setActiveCat('all')}
                    aria-pressed={activeCat === 'all'}
                    className={`faq-cat-tab relative z-10 snap-start h-11 px-5 rounded-full border border-black/10 font-sans font-medium text-[12px] uppercase tracking-[0.14em] flex items-center gap-2.5 transition-colors shrink-0 ${
                      activeCat === 'all'
                        ? 'text-white'
                        : 'text-[#0C0C0C]/80 hover:text-[#0C0C0C]'
                    } ${categoryCounts.all === 0 ? 'opacity-35' : ''}`}
                  >
                    <span>All</span>
                    <span
                      className={`text-[11px] ${
                        activeCat === 'all' ? 'text-[#D4AF6A]' : 'text-black/40'
                      }`}
                    >
                      {categoryCounts.all}
                    </span>
                  </button>

                  {/* 7 Category Tabs */}
                  {FAQ_CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    const isActive = activeCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-cat={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        aria-pressed={isActive}
                        className={`faq-cat-tab relative z-10 snap-start h-11 px-5 rounded-full border border-black/10 font-sans font-medium text-[12px] uppercase tracking-[0.14em] flex items-center gap-2 transition-colors shrink-0 ${
                          isActive
                            ? 'text-white'
                            : 'text-[#0C0C0C]/80 hover:text-[#0C0C0C]'
                        } ${count === 0 ? 'opacity-35' : ''}`}
                      >
                        <span className={isActive ? 'text-[#D4AF6A]' : 'text-black/60'}>
                          {renderCategoryIcon(cat.icon, 14)}
                        </span>
                        <span>{cat.label}</span>
                        <span
                          className={`text-[11px] ${
                            isActive ? 'text-[#D4AF6A]' : 'text-black/40'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: Accordion (Main) + Sticky Aurora CTA Card */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr] gap-8 items-start">
            {/* LEFT COLUMN: Aurora CTA Card (order-2 on mobile, order-1 on lg) */}
            <div className="order-2 lg:order-1 lg:sticky lg:top-28">
              <div
                ref={ctaCardRef}
                className="faq-aurora rounded-[28px] p-10 sm:p-12 min-h-[460px] flex flex-col items-center text-center text-white shadow-[0_30px_60px_rgba(12,12,12,0.18)]"
              >
                {/* 5 Aurora Animated Blobs */}
                <span className="faq-blob b1" aria-hidden="true" />
                <span className="faq-blob b2" aria-hidden="true" />
                <span className="faq-blob b3" aria-hidden="true" />
                <span className="faq-blob b4" aria-hidden="true" />
                <span className="faq-blob b5" aria-hidden="true" />

                {/* Card Content */}
                <div className="w-12 h-12 rounded-full border border-[#E9DCC0]/40 flex items-center justify-center text-[#D4AF6A] mb-6">
                  <MessageCircle size={20} />
                </div>

                <h2 className="font-serif text-[32px] leading-tight text-white mb-3">
                  Need personalised advice?
                </h2>

                <p className="font-sans font-light text-[15px] text-white/80 max-w-xs leading-relaxed">
                  Speak directly with an advisor who knows your micro-market, pricing trends and verified inventory.
                </p>

                {/* Consultation Button */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-8 relative overflow-hidden group h-12 px-8 rounded-full bg-white text-[#0C0C0C] font-sans font-medium text-[12px] uppercase tracking-[0.14em] inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-black">
                    <span>Talk to an Advisor</span>
                    <ArrowUpRight size={15} />
                  </span>
                  <span
                    className="absolute inset-0 bg-[#D4AF6A] origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                    aria-hidden="true"
                  />
                </a>

                {/* Call & WhatsApp secondary links */}
                <div className="flex items-center gap-3 mt-5 font-sans font-medium text-[13px]">
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="text-white hover:text-[#E9DCC0] underline underline-offset-4 transition-colors"
                  >
                    Call
                  </a>
                  <span className="text-white/40">&#183;</span>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-[#E9DCC0] underline underline-offset-4 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>

                {/* Operating hours */}
                <p className="font-sans text-[12px] text-white/60 mt-6">
                  Monday to Saturday, 9:30 am to 7:00 pm
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Accordion (order-1 on mobile, order-2 on lg) */}
            <div
              ref={accordionContainerRef}
              className="order-1 lg:order-2 space-y-12"
            >
              {/* Single Category Blurb Header if specific category is active */}
              {activeCat !== 'all' && (
                <div className="pb-4 border-b border-black/10">
                  <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-[#8C671D] mb-1">
                    {renderCategoryIcon(
                      FAQ_CATEGORIES.find((c) => c.id === activeCat)?.icon || 'Home',
                      14
                    )}
                    <span>{FAQ_CATEGORIES.find((c) => c.id === activeCat)?.label}</span>
                  </div>
                  <p className="text-[15px] font-sans text-black/60">
                    {FAQ_CATEGORIES.find((c) => c.id === activeCat)?.blurb}
                  </p>
                </div>
              )}

              {/* No results view */}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-16 px-4 bg-white/50 rounded-3xl border border-black/10">
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#0C0C0C] mb-3">
                    No answers match yet.
                  </h3>
                  <p className="font-sans text-[15px] text-[#8C671D] mb-6">
                    &quot;{debouncedQuery}&quot;
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCat('all');
                      }}
                      className="h-11 px-6 rounded-full bg-[#0C0C0C] text-white font-sans text-xs uppercase tracking-[0.14em] hover:bg-[#8C671D] transition-colors"
                    >
                      Clear search
                    </button>
                    <a
                      href="#ask-form"
                      className="font-sans text-sm text-[#0C0C0C]/70 hover:text-[#0C0C0C] underline underline-offset-4"
                    >
                      Ask us directly below &darr;
                    </a>
                  </div>
                </div>
              )}

              {/* Accordion Groups */}
              {activeCat === 'all'
                ? groupedFaqs.map((group, gIdx) => (
                    <section
                      key={group.category.id}
                      aria-labelledby={`cat-heading-${group.category.id}`}
                      className="space-y-2"
                    >
                      {/* Group Heading */}
                      <div className="pb-4 border-b border-black/10 mb-2">
                        <div className="flex items-baseline justify-between">
                          <h2
                            id={`cat-heading-${group.category.id}`}
                            className="font-serif text-[28px] text-[#0C0C0C]"
                          >
                            {group.category.label}
                          </h2>
                          <span className="font-serif italic text-[#8C671D] text-[18px]">
                            {String(gIdx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="font-sans text-[14px] text-black/55 mt-1">
                          {group.category.blurb}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-black/10">
                        {group.items.map((item, idx) => {
                          const isOpen = openId === item.id;
                          return (
                            <article
                              key={item.id}
                              className={`faq-item-row group relative transition-colors duration-300 ${
                                isOpen ? 'bg-[#D4AF6A]/[0.08]' : 'hover:bg-black/[0.02]'
                              }`}
                            >
                              {/* Left active 2px accent bar */}
                              <span
                                className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4AF6A] origin-top transition-transform duration-500 ease-out ${
                                  isOpen ? 'scale-y-100' : 'scale-y-0'
                                }`}
                              />

                              {/* Accordion Trigger Button */}
                              <button
                                type="button"
                                id={`faq-${item.id}`}
                                aria-expanded={isOpen}
                                aria-controls={`faq-panel-${item.id}`}
                                onClick={() => handleToggle(item.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const next = (e.currentTarget.closest('.faq-item-row')?.nextElementSibling?.querySelector('button[aria-expanded]') as HTMLElement) || null;
                                    next?.focus();
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const prev = (e.currentTarget.closest('.faq-item-row')?.previousElementSibling?.querySelector('button[aria-expanded]') as HTMLElement) || null;
                                    prev?.focus();
                                  }
                                }}
                                className="w-full flex items-start justify-between py-6 sm:py-7 gap-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C671D] rounded px-4"
                              >
                                <div className="flex items-baseline gap-4 sm:gap-5 flex-1">
                                  <span className="font-serif italic text-[18px] text-[#8C671D] w-[3ch] shrink-0">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <h3 className="font-serif text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.2] text-[#0C0C0C] transition-transform duration-300 group-hover:translate-x-2">
                                    {highlightMatches(item.q, debouncedQuery)}
                                  </h3>
                                </div>

                                <div
                                  className={`w-11 h-11 rounded-full border border-black/10 shrink-0 flex items-center justify-center transition-all duration-300 ${
                                    isOpen
                                      ? 'bg-[#0C0C0C] text-white rotate-45'
                                      : 'bg-white text-black/70 group-hover:border-black/30'
                                  }`}
                                >
                                  <Plus size={20} />
                                </div>
                              </button>

                              {/* Accordion Panel (CSS grid-rows) */}
                              <div
                                id={`faq-panel-${item.id}`}
                                role="region"
                                aria-labelledby={`faq-${item.id}`}
                                data-open={isOpen ? 'true' : 'false'}
                                className="faq-panel"
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    const btn = document.getElementById(`faq-${item.id}`);
                                    btn?.focus();
                                  }
                                }}
                              >
                                <div>
                                  <div className="pl-4 sm:pl-[calc(3ch+2rem)] pr-4 pb-7 pt-1 max-w-2xl">
                                    <p className="font-sans font-light text-[16px] leading-[1.75] text-[#0C0C0C]/70">
                                      {highlightMatches(item.a, debouncedQuery)}
                                    </p>

                                    {/* Footer line: Helpful feedback & Copy link */}
                                    <div className="mt-5 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-sans text-[12px] text-black/60">
                                      <div className="flex items-center gap-3">
                                        <span>Was this helpful?</span>
                                        {feedback[item.id] ? (
                                          <span className="text-[#8C671D] font-medium">
                                            Thank you for the feedback.
                                          </span>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => handleFeedback(item.id, 'up')}
                                              aria-label="Mark helpful"
                                              className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 hover:border-black/30 transition-colors"
                                            >
                                              <ThumbsUp size={14} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleFeedback(item.id, 'down')}
                                              aria-label="Mark not helpful"
                                              className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 hover:border-black/30 transition-colors"
                                            >
                                              <ThumbsDown size={14} />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => handleCopyLink(item.id, e)}
                                        className="inline-flex items-center gap-1.5 text-black/60 hover:text-[#0C0C0C] transition-colors"
                                      >
                                        <Link2 size={14} />
                                        <span>{copiedId === item.id ? 'Copied' : 'Copy link'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))
                : (
                    <div className="divide-y divide-black/10">
                      {filteredFaqs.map((item, idx) => {
                        const isOpen = openId === item.id;
                        return (
                          <article
                            key={item.id}
                            className={`faq-item-row group relative transition-colors duration-300 ${
                              isOpen ? 'bg-[#D4AF6A]/[0.08]' : 'hover:bg-black/[0.02]'
                            }`}
                          >
                            <span
                              className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4AF6A] origin-top transition-transform duration-500 ease-out ${
                                isOpen ? 'scale-y-100' : 'scale-y-0'
                              }`}
                            />

                            <button
                              type="button"
                              id={`faq-${item.id}`}
                              aria-expanded={isOpen}
                              aria-controls={`faq-panel-${item.id}`}
                              onClick={() => handleToggle(item.id)}
                              className="w-full flex items-start justify-between py-6 sm:py-7 gap-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C671D] rounded px-4"
                            >
                              <div className="flex items-baseline gap-4 sm:gap-5 flex-1">
                                <span className="font-serif italic text-[18px] text-[#8C671D] w-[3ch] shrink-0">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-serif text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.2] text-[#0C0C0C] transition-transform duration-300 group-hover:translate-x-2">
                                  {highlightMatches(item.q, debouncedQuery)}
                                </h3>
                              </div>

                              <div
                                className={`w-11 h-11 rounded-full border border-black/10 shrink-0 flex items-center justify-center transition-all duration-300 ${
                                  isOpen
                                    ? 'bg-[#0C0C0C] text-white rotate-45'
                                    : 'bg-white text-black/70 group-hover:border-black/30'
                                }`}
                              >
                                <Plus size={20} />
                              </div>
                            </button>

                            <div
                              id={`faq-panel-${item.id}`}
                              role="region"
                              aria-labelledby={`faq-${item.id}`}
                              data-open={isOpen ? 'true' : 'false'}
                              className="faq-panel"
                            >
                              <div>
                                <div className="pl-4 sm:pl-[calc(3ch+2rem)] pr-4 pb-7 pt-1 max-w-2xl">
                                  <p className="font-sans font-light text-[16px] leading-[1.75] text-[#0C0C0C]/70">
                                    {highlightMatches(item.a, debouncedQuery)}
                                  </p>

                                  <div className="mt-5 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-sans text-[12px] text-black/60">
                                    <div className="flex items-center gap-3">
                                      <span>Was this helpful?</span>
                                      {feedback[item.id] ? (
                                        <span className="text-[#8C671D] font-medium">
                                          Thank you for the feedback.
                                        </span>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleFeedback(item.id, 'up')}
                                            aria-label="Mark helpful"
                                            className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 hover:border-black/30 transition-colors"
                                          >
                                            <ThumbsUp size={14} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleFeedback(item.id, 'down')}
                                            aria-label="Mark not helpful"
                                            className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:bg-black/5 hover:border-black/30 transition-colors"
                                          >
                                            <ThumbsDown size={14} />
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyLink(item.id, e)}
                                      className="inline-flex items-center gap-1.5 text-black/60 hover:text-[#0C0C0C] transition-colors"
                                    >
                                      <Link2 size={14} />
                                      <span>{copiedId === item.id ? 'Copied' : 'Copy link'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}

              {/* 6. "ASK US ANYTHING" FORM (below accordion, same column, mt-16) */}
              <div
                id="ask-form"
                ref={askFormRef}
                className="mt-16 rounded-[24px] border border-black/10 bg-white p-8 sm:p-10 shadow-sm"
              >
                {isAskSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF6A]/20 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-[#8C671D]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          style={{
                            strokeDasharray: 50,
                            strokeDashoffset: 0,
                            animation: 'faq-check 0.7s ease-out forwards',
                          }}
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-[28px] text-[#0C0C0C]">
                      Thank you, {askName.split(' ')[0] || 'there'}.
                    </h3>
                    <p className="font-sans text-[15px] text-black/65">
                      An advisor will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-serif text-[32px] text-[#0C0C0C] mb-1">
                      Cannot find your answer?
                    </h3>
                    <p className="font-sans text-[14px] text-black/60 mb-6">
                      Send your question and an advisor will reply personally.
                    </p>

                    <form onSubmit={handleAskSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="ask-name"
                          className="block font-sans text-xs uppercase tracking-[0.14em] text-black/60 mb-1.5 font-medium"
                        >
                          Full Name *
                        </label>
                        <input
                          id="ask-name"
                          type="text"
                          value={askName}
                          onChange={(e) => {
                            setAskName(e.target.value);
                            if (askErrors.name) setAskErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="Your name"
                          className="w-full h-12 px-4 rounded-lg border border-black/15 text-[15px] focus:outline-none focus:border-[#8C671D] focus:ring-2 focus:ring-[#D4AF6A]/25"
                        />
                        {askErrors.name && (
                          <p className="text-xs text-red-500 mt-1" aria-live="polite">
                            {askErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="ask-mobile"
                          className="block font-sans text-xs uppercase tracking-[0.14em] text-black/60 mb-1.5 font-medium"
                        >
                          Mobile Number *
                        </label>
                        <input
                          id="ask-mobile"
                          type="tel"
                          value={askMobile}
                          onChange={(e) => {
                            setAskMobile(e.target.value);
                            if (askErrors.mobile) setAskErrors((prev) => ({ ...prev, mobile: undefined }));
                          }}
                          placeholder="10-digit mobile number"
                          className="w-full h-12 px-4 rounded-lg border border-black/15 text-[15px] focus:outline-none focus:border-[#8C671D] focus:ring-2 focus:ring-[#D4AF6A]/25"
                        />
                        {askErrors.mobile && (
                          <p className="text-xs text-red-500 mt-1" aria-live="polite">
                            {askErrors.mobile}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="ask-question"
                          className="block font-sans text-xs uppercase tracking-[0.14em] text-black/60 mb-1.5 font-medium"
                        >
                          Your Question *
                        </label>
                        <textarea
                          id="ask-question"
                          rows={4}
                          value={askQuestion}
                          onChange={(e) => {
                            setAskQuestion(e.target.value);
                            if (askErrors.question) setAskErrors((prev) => ({ ...prev, question: undefined }));
                          }}
                          placeholder="What would you like to know?"
                          className="w-full p-4 rounded-lg border border-black/15 text-[15px] focus:outline-none focus:border-[#8C671D] focus:ring-2 focus:ring-[#D4AF6A]/25 resize-y"
                        />
                        {askErrors.question && (
                          <p className="text-xs text-red-500 mt-1" aria-live="polite">
                            {askErrors.question}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isAskSubmitting}
                        className="h-12 px-8 rounded-full bg-[#0C0C0C] text-white font-sans font-medium text-xs uppercase tracking-[0.14em] hover:bg-[#8C671D] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isAskSubmitting ? 'Sending...' : 'Send my question'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 40px black gap before footer */}
      <div className="h-10 w-full bg-[#0B0907]" />

      {/* 7. SITE FOOTER (only rendered on /faqs) */}
      <SiteFooter />
    </div>
  );
};

export default Faqs;
