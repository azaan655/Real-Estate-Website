import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Menu, ChevronDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { TransitionLink, usePageTransition } from './PageTransition';
import { BUY_TAXONOMY_GROUPS, countFor as buyCountFor } from '../data/buyTaxonomy';
import { RENT_TAXONOMY_GROUPS, countForRent } from '../data/rentTaxonomy';

interface NavItem {
  label: string;
  to: string;
  megaMenu?: 'buy' | 'rent';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Buy', to: '/buy', megaMenu: 'buy' },
  { label: 'Rent', to: '/rent', megaMenu: 'rent' },
  { label: 'Sell', to: '/#sell' },
  { label: 'Services', to: '/services' },
  { label: 'Developments', to: '/#developments' },
  { label: 'About', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<'buy' | 'rent' | null>(null);

  // Mobile Accordion state
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const [mobileRentOpen, setMobileRentOpen] = useState(false);
  const [openMobileBuyGroups, setOpenMobileBuyGroups] = useState<Record<string, boolean>>({
    popular: true,
    type: false,
    budget: false,
    bhk: false,
  });
  const [openMobileRentGroups, setOpenMobileRentGroups] = useState<Record<string, boolean>>({
    type: true,
    budget: false,
    bhk: false,
    explore: false,
  });

  const location = useLocation();
  const { transitionTo } = usePageTransition();

  const buyTriggerRef = useRef<HTMLButtonElement>(null);
  const rentTriggerRef = useRef<HTMLButtonElement>(null);

  const buyPanelRef = useRef<HTMLDivElement>(null);
  const rentPanelRef = useRef<HTMLDivElement>(null);

  const buyTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const rentTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isBuyActive = location.pathname.startsWith('/buy');
  const isRentActive = location.pathname.startsWith('/rent');

  // Route change closes mega menus & mobile menu
  useEffect(() => {
    setActiveMega(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener for Mega Menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!activeMega) return;
      const target = e.target as Node;

      const isInsideBuy =
        buyPanelRef.current?.contains(target) || buyTriggerRef.current?.contains(target);
      const isInsideRent =
        rentPanelRef.current?.contains(target) || rentTriggerRef.current?.contains(target);

      if (!isInsideBuy && !isInsideRent) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMega]);

  // GSAP animation for Mega Menu open / close
  const animatePanel = useCallback(
    (
      panel: HTMLDivElement | null,
      timelineRef: React.MutableRefObject<gsap.core.Timeline | null>,
      isOpen: boolean
    ) => {
      if (!panel) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      if (isOpen) {
        // Remove hidden and inert before animating in
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
        panel.setAttribute('aria-hidden', 'false');
        panel.removeAttribute('inert');

        if (prefersReducedMotion) {
          gsap.set(panel, { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' });
        } else {
          const columns = panel.querySelectorAll('.mega-column');
          const rows = panel.querySelectorAll('.mega-option-row');

          const tl = gsap.timeline();
          timelineRef.current = tl;

          tl.fromTo(
            panel,
            { clipPath: 'inset(0% 0% 100% 0% round 24px)', opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1, duration: 0.5, ease: 'power3.out' }
          );

          tl.fromTo(
            columns,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05 },
            0.08
          );

          tl.fromTo(
            rows,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', stagger: 0.015 },
            0.15
          );
        }
      } else {
        if (prefersReducedMotion) {
          gsap.set(panel, { opacity: 0 });
          panel.style.visibility = 'hidden';
          panel.style.pointerEvents = 'none';
          panel.setAttribute('aria-hidden', 'true');
          panel.setAttribute('inert', '');
        } else {
          const tl = gsap.timeline({
            onComplete: () => {
              panel.style.visibility = 'hidden';
              panel.style.pointerEvents = 'none';
              panel.setAttribute('aria-hidden', 'true');
              panel.setAttribute('inert', '');
            },
          });
          timelineRef.current = tl;

          tl.to(panel, {
            opacity: 0,
            clipPath: 'inset(0% 0% 100% 0% round 24px)',
            duration: 0.3,
            ease: 'power2.in',
          });
        }
      }
    },
    []
  );

  useEffect(() => {
    animatePanel(buyPanelRef.current, buyTimelineRef, activeMega === 'buy');
    animatePanel(rentPanelRef.current, rentTimelineRef, activeMega === 'rent');
  }, [activeMega, animatePanel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (buyTimelineRef.current) buyTimelineRef.current.kill();
      if (rentTimelineRef.current) rentTimelineRef.current.kill();
    };
  }, []);

  // Hover intent helpers
  const handleTriggerMouseEnter = (menu: 'buy' | 'rent') => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveMega(menu);
    }, 80);
  };

  const handleTriggerMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 220);
  };

  const handlePanelMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handlePanelMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 220);
  };

  // Keyboard navigation inside Mega Menu
  const handleMegaKeyDown = (
    e: React.KeyboardEvent,
    menu: 'buy' | 'rent',
    panelRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setActiveMega(null);
      if (menu === 'buy') buyTriggerRef.current?.focus();
      else rentTriggerRef.current?.focus();
      return;
    }

    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const options = Array.from(
        panelRef.current?.querySelectorAll<HTMLAnchorElement>('.mega-option-link') || []
      );
      if (options.length === 0) return;

      const currentIndex = options.indexOf(document.activeElement as HTMLAnchorElement);
      if (currentIndex === -1) {
        options[0].focus();
        return;
      }

      const groups = menu === 'buy' ? BUY_TAXONOMY_GROUPS : RENT_TAXONOMY_GROUPS;
      const colSizes = groups.map((g) => g.options.length);

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

  // Lock body scroll & handle Escape key when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
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
        const tl = gsap.timeline();
        tl.set(menu, { pointerEvents: 'auto' });
        tl.fromTo(
          menu,
          { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.out' }
        );

        if (linksWrap) {
          const links = linksWrap.querySelectorAll('.mobile-nav-link');
          tl.fromTo(
            links,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.05 },
            0.15
          );
        }
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(menu, { opacity: 0, pointerEvents: 'none' });
      } else {
        const tl = gsap.timeline();
        tl.to(menu, {
          opacity: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            gsap.set(menu, { pointerEvents: 'none' });
          },
        });
      }
    }
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = (to: string, label?: string) => {
    setIsMobileMenuOpen(false);
    transitionTo(to, label);
  };

  const toggleMobileBuyGroup = (key: string) => {
    setOpenMobileBuyGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMobileRentGroup = (key: string) => {
    setOpenMobileRentGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="relative w-full max-w-7xl">
          <nav
            ref={buyTriggerRef}
            aria-label="Main Navigation"
            className="w-full liquid-glass rounded-2xl px-6 sm:px-8 py-3.5 flex items-center justify-between border border-white/20 shadow-2xl backdrop-blur-xl bg-black/40"
          >
            {/* Left: Brand Logo */}
            <TransitionLink
              to="/"
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              <span className="font-sans text-xl font-medium tracking-[0.22em] text-white uppercase">
                VESTA
              </span>
            </TransitionLink>

            {/* Middle: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-sm font-normal">
              {NAV_ITEMS.map((item) => {
                if (item.megaMenu === 'buy') {
                  const isOpen = activeMega === 'buy';
                  return (
                    <div
                      key={item.label}
                      className="relative py-1"
                      onMouseEnter={() => handleTriggerMouseEnter('buy')}
                      onMouseLeave={handleTriggerMouseLeave}
                    >
                      <button
                        ref={buyTriggerRef}
                        type="button"
                        onClick={() => setActiveMega(isOpen ? null : 'buy')}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        aria-controls="buy-mega-menu-panel"
                        className={`relative py-1 group flex items-center gap-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded cursor-pointer ${
                          isBuyActive || isOpen ? 'text-white' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>Buy</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF6A]' : 'text-white/60'}`}
                        />
                      </button>
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1px] transform origin-left transition-transform duration-300 ${
                          isBuyActive || isOpen ? 'scale-x-100 bg-[#D4AF6A]' : 'scale-x-0 bg-white'
                        }`}
                      />
                    </div>
                  );
                }

                if (item.megaMenu === 'rent') {
                  const isOpen = activeMega === 'rent';
                  return (
                    <div
                      key={item.label}
                      className="relative py-1"
                      onMouseEnter={() => handleTriggerMouseEnter('rent')}
                      onMouseLeave={handleTriggerMouseLeave}
                    >
                      <button
                        ref={rentTriggerRef}
                        type="button"
                        onClick={() => setActiveMega(isOpen ? null : 'rent')}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        aria-controls="rent-mega-menu-panel"
                        className={`relative py-1 group flex items-center gap-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded cursor-pointer ${
                          isRentActive || isOpen ? 'text-white' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>Rent</span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF6A]' : 'text-white/60'}`}
                        />
                      </button>
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1px] transform origin-left transition-transform duration-300 ${
                          isRentActive || isOpen ? 'scale-x-100 bg-[#D4AF6A]' : 'scale-x-0 bg-white'
                        }`}
                      />
                    </div>
                  );
                }

                const isActive =
                  item.to.startsWith('/') && !item.to.startsWith('/#')
                    ? location.pathname === item.to
                    : item.to === '/' && location.pathname === '/';

                const isFaq = item.to === '/faqs';

                return (
                  <TransitionLink
                    key={item.label}
                    to={item.to}
                    transitionLabel={item.label}
                    className={`relative py-1 group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                      isFaq ? 'hidden lg:inline-flex' : ''
                    } ${
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
                className="hidden sm:inline-flex bg-white text-black px-5 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium font-sans hover:bg-gray-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px] items-center justify-center"
              >
                Book a Viewing
              </button>

              {/* Mobile / Tablet Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <Menu size={20} />
              </button>
            </div>
          </nav>

          {/* ========================================================================= */}
          {/* BUY MEGA MENU GLASS PANEL (DESKTOP)                                       */}
          {/* ========================================================================= */}
          <div
            id="buy-mega-menu-panel"
            ref={buyPanelRef}
            role="region"
            aria-label="Buy Mega Menu"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onKeyDown={(e) => handleMegaKeyDown(e, 'buy', buyPanelRef)}
            className="hidden md:block absolute top-full mt-3 left-0 right-0 rounded-2xl liquid-glass bg-black/85 backdrop-blur-2xl border border-white/15 px-10 py-9 z-[80] shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
            style={{
              clipPath: 'inset(0% 0% 100% 0% round 24px)',
              visibility: 'hidden',
              pointerEvents: 'none',
              opacity: 0,
            }}
          >
            <div className="grid grid-cols-4 gap-x-12">
              {BUY_TAXONOMY_GROUPS.map((group) => (
                <div key={group.key} className="mega-column flex flex-col">
                  <h3 className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-white">
                    {group.title}
                  </h3>
                  <div className="w-full h-[1px] bg-white/15 mt-4 mb-5" />

                  <div className="flex flex-col gap-1">
                    {group.options.map((opt) => {
                      const optTo = `/buy/${opt.slug}`;
                      const isCurrent = location.pathname === optTo;
                      const count = buyCountFor(opt.slug);

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
                              <span
                                className={`w-[5px] h-[5px] rounded-full bg-[#D4AF6A] mr-2 transition-opacity duration-300 ${
                                  isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                              />
                              <span>{opt.label}</span>
                              {opt.badge && (
                                <span
                                  aria-label="Hot"
                                  className="bg-[#F5B800] text-[#0C0C0C] font-bold text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] ml-2 inline-flex items-center animate-[pulse_2.4s_ease-in-out_infinite]"
                                >
                                  {opt.badge}
                                </span>
                              )}
                            </span>

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

          {/* ========================================================================= */}
          {/* RENT MEGA MENU GLASS PANEL (DESKTOP)                                      */}
          {/* ========================================================================= */}
          <div
            id="rent-mega-menu-panel"
            ref={rentPanelRef}
            role="region"
            aria-label="Rent Mega Menu"
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            onKeyDown={(e) => handleMegaKeyDown(e, 'rent', rentPanelRef)}
            className="hidden md:block absolute top-full mt-3 left-0 right-0 rounded-2xl liquid-glass bg-black/85 backdrop-blur-2xl border border-white/15 px-10 py-9 z-[80] shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
            style={{
              clipPath: 'inset(0% 0% 100% 0% round 24px)',
              visibility: 'hidden',
              pointerEvents: 'none',
              opacity: 0,
            }}
          >
            <div className="grid grid-cols-4 gap-x-12">
              {RENT_TAXONOMY_GROUPS.map((group) => (
                <div key={group.key} className="mega-column flex flex-col">
                  <h3 className="font-sans font-medium text-[12px] uppercase tracking-[0.22em] text-white">
                    {group.title}
                  </h3>
                  <div className="w-full h-[1px] bg-white/15 mt-4 mb-5" />

                  <div className="flex flex-col gap-1">
                    {group.options.map((opt) => {
                      const isExplore = group.key === 'explore';
                      const isCurrent = location.pathname === opt.route;
                      const count = countForRent(opt.slug);

                      return (
                        <div key={opt.slug} className="mega-option-row h-[36px] flex items-center">
                          <TransitionLink
                            to={opt.route}
                            transitionLabel={opt.label}
                            className={`mega-option-link group relative flex items-center justify-between w-full h-full text-[14px] font-sans transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF6A] rounded px-1 ${
                              isCurrent
                                ? 'text-white'
                                : isExplore
                                ? 'text-white/80 hover:text-white font-medium'
                                : 'text-white/65 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[6px]">
                              <span
                                className={`w-[5px] h-[5px] rounded-full bg-[#D4AF6A] mr-2 transition-opacity duration-300 ${
                                  isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                              />
                              <span>{opt.label}</span>

                              {/* FREE tag for Share Requirement */}
                              {opt.badge && (
                                <span className="border border-white/40 text-white font-sans text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] ml-2 inline-flex items-center">
                                  {opt.badge}
                                </span>
                              )}
                            </span>

                            {/* ArrowUpRight on hover for explore, count for others */}
                            {isExplore ? (
                              <ArrowUpRight
                                size={14}
                                className="text-white/40 group-hover:text-white transition-colors"
                              />
                            ) : count !== undefined ? (
                              <span className="font-sans text-[11px] text-white/35 group-hover:text-white/60 transition-colors">
                                {count}
                              </span>
                            ) : null}
                          </TransitionLink>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between">
              <span className="font-sans text-xs text-white/40">
                12 rentals, 15 collections
              </span>
              <TransitionLink
                to="/rent"
                transitionLabel="All Rentals"
                className="font-sans text-xs font-medium text-white/80 hover:text-[#D4AF6A] flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
              >
                <span>View all rentals</span>
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
        className="fixed inset-0 bg-[#0C0C0C] z-[90] flex flex-col justify-between px-6 py-8 pointer-events-none opacity-0 lg:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
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

        {/* Links List */}
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

            {mobileBuyOpen && (
              <div className="mt-4 pl-2 flex flex-col gap-4 animate-[fadeIn_0.35s_ease-out]">
                <button
                  type="button"
                  onClick={() => handleMobileNavClick('/buy', 'All Properties')}
                  className="font-sans text-sm text-[#D4AF6A] flex items-center gap-2 py-1"
                >
                  <span>View All Residences &amp; Collections</span>
                  <ArrowUpRight size={14} />
                </button>

                {BUY_TAXONOMY_GROUPS.map((group) => {
                  const isGroupOpen = openMobileBuyGroups[group.key];
                  return (
                    <div key={group.key} className="border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => toggleMobileBuyGroup(group.key)}
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
                                {buyCountFor(opt.slug)}
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

          {/* Rent Accordion on Mobile */}
          <div className="border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => setMobileRentOpen((prev) => !prev)}
              aria-expanded={mobileRentOpen}
              className="mobile-nav-link text-left font-serif text-[clamp(2.25rem,9vw,3.5rem)] leading-tight tracking-[-0.02em] flex items-center justify-between w-full transition-colors duration-300 cursor-pointer"
              style={{
                color: isRentActive ? '#D4AF6A' : '#ffffff',
              }}
            >
              <span>Rent</span>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${mobileRentOpen ? 'rotate-180 text-[#D4AF6A]' : 'text-white/60'}`}
              />
            </button>

            {mobileRentOpen && (
              <div className="mt-4 pl-2 flex flex-col gap-4 animate-[fadeIn_0.35s_ease-out]">
                <button
                  type="button"
                  onClick={() => handleMobileNavClick('/rent', 'All Rentals')}
                  className="font-sans text-sm text-[#D4AF6A] flex items-center gap-2 py-1"
                >
                  <span>View All Rentals &amp; Collections</span>
                  <ArrowUpRight size={14} />
                </button>

                {RENT_TAXONOMY_GROUPS.map((group) => {
                  const isGroupOpen = openMobileRentGroups[group.key];
                  return (
                    <div key={group.key} className="border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => toggleMobileRentGroup(group.key)}
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
                              onClick={() => handleMobileNavClick(opt.route, opt.label)}
                              className="h-[44px] flex items-center justify-between font-serif text-[24px] text-white/90 hover:text-white text-left"
                            >
                              <span className="flex items-center gap-2">
                                <span>{opt.label}</span>
                                {opt.badge && (
                                  <span className="border border-white/40 text-white font-sans text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px]">
                                    {opt.badge}
                                  </span>
                                )}
                              </span>
                              <span className="font-sans text-xs text-white/35">
                                {countForRent(opt.slug)}
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
          {NAV_ITEMS.filter((i) => !i.megaMenu).map((item) => {
            const isActive =
              item.to.startsWith('/') && !item.to.startsWith('/#')
                ? location.pathname === item.to
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

        <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
          <button
            type="button"
            className="w-full min-h-[44px] py-3 rounded-lg bg-[#F4EFE6] text-[#0C0C0C] font-sans font-medium text-sm hover:bg-[#D4AF6A] transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            Book a Private Viewing
          </button>
          <div className="flex items-center justify-between text-xs text-white/60 font-sans">
            <span>Hyderabad, Telangana</span>
            <span className="text-[#D4AF6A]">VESTA Agency</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
