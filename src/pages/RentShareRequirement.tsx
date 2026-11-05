import React, { useState, useEffect, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { TransitionLink, usePageTransition } from '../components/PageTransition';
import { RUPEE, formatInr } from '../lib/money';

const WHATSAPP_NUMBER = '91XXXXXXXXXX';

const HYDERABAD_LOCALITIES = [
  'Jubilee Hills',
  'Banjara Hills',
  'Kokapet',
  'Gachibowli',
  'Financial District',
  'Madhapur',
  'Kondapur',
  'Manikonda',
  'Narsingi',
  'Bachupally',
  'Kukatpally',
];

export const RentShareRequirement: React.FC = () => {
  // Step State (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Step 1: What are you looking for?
  const [propertyType, setPropertyType] = useState<'Flat' | 'House' | 'Villa' | 'Commercial' | 'Office'>('Flat');
  const [bhk, setBhk] = useState<number>(2);
  const [teamSize, setTeamSize] = useState<number>(8);
  const [furnishing, setFurnishing] = useState<'Any' | 'Unfurnished' | 'Semi-furnished' | 'Furnished'>('Semi-furnished');

  // Step 2: Where and how much?
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(['Kondapur', 'Madhapur']);
  const [minBudget, setMinBudget] = useState<number>(20000);
  const [maxBudget, setMaxBudget] = useState<number>(50000);
  const [moveInDate, setMoveInDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [tenantType, setTenantType] = useState<'Family' | 'Bachelors' | 'Company'>('Family');
  const [hasPets, setHasPets] = useState(false);

  // Step 3: How can we reach you?
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'Call' | 'WhatsApp' | 'Email'>('WhatsApp');
  const [notes, setNotes] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Refs for animation
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const summaryCardRef = useRef<HTMLDivElement>(null);
  const checkSvgRef = useRef<SVGSVGElement>(null);

  const { isTransitioning } = usePageTransition();

  useEffect(() => {
    document.title = 'Share Your Requirement | VESTA';
  }, []);

  // Theme configuration for this teal-themed page
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', '#EAF3F2');
    root.style.setProperty('--ink', '#0C0C0C');
    root.style.setProperty('--accent', '#2E9C8A');
    root.style.setProperty('--accent-ink', '#1D7A6B');
    root.style.setProperty('--dark1', '#1F3430');
    root.style.setProperty('--dark2', '#091311');
    root.style.setProperty('--font-display', '"Instrument Serif", Georgia, serif');
    root.setAttribute('data-mode', 'light');

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
  }, []);

  // Animate step transition
  useEffect(() => {
    if (isTransitioning) return;
    const stepEl = stepContainerRef.current;
    if (!stepEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const startX = direction === 'forward' ? 35 : -35;
    gsap.fromTo(
      stepEl,
      { x: startX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );
  }, [currentStep, direction, isTransitioning]);

  // Entrance animations for wizard & summary card
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (summaryCardRef.current) {
      gsap.fromTo(
        summaryCardRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  const isCommercialOrOffice = propertyType === 'Commercial' || propertyType === 'Office';

  const toggleLocality = (loc: string) => {
    if (selectedLocalities.includes(loc)) {
      setSelectedLocalities((prev) => prev.filter((item) => item !== loc));
      if (errors.localities) setErrors((prev) => ({ ...prev, localities: '' }));
    } else {
      if (selectedLocalities.length >= 4) return;
      setSelectedLocalities((prev) => [...prev, loc]);
      if (errors.localities) setErrors((prev) => ({ ...prev, localities: '' }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!propertyType) newErrors.propertyType = 'Please select a property type';
    } else if (stepNum === 2) {
      if (selectedLocalities.length === 0) {
        newErrors.localities = 'Please select at least 1 preferred neighborhood';
      }
      if (!moveInDate) {
        newErrors.moveInDate = 'Please select your target move-in date';
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        if (moveInDate < todayStr) {
          newErrors.moveInDate = 'Move-in date cannot be in the past';
        }
      }
    } else if (stepNum === 3) {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required';
      const cleanMobile = mobile.replace(/\D/g, '');
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!cleanMobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!mobileRegex.test(cleanMobile)) {
        newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
      }

      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          newErrors.email = 'Enter a valid email address';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection('forward');
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setDirection('backward');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const ref = 'REQ-' + Math.floor(100000 + Math.random() * 900000);
    setReferenceId(ref);

    const submissionPayload = {
      referenceId: ref,
      propertyType,
      bhk: isCommercialOrOffice ? null : bhk,
      teamSize: isCommercialOrOffice ? teamSize : null,
      furnishing,
      selectedLocalities,
      minBudget,
      maxBudget,
      moveInDate,
      tenantType,
      hasPets,
      fullName,
      mobile,
      email,
      preferredContact,
      notes,
      submittedAt: new Date().toISOString(),
    };

    console.log('Rental Requirement Brief:', submissionPayload);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  // Derive filter params for "Browse matching rentals" button on success
  const getMatchingRentQuery = () => {
    const params = new URLSearchParams();
    if (propertyType === 'Flat') params.set('type', 'flats-for-rent');
    else if (propertyType === 'House') params.set('type', 'houses-for-rent');
    else if (propertyType === 'Villa') params.set('type', 'villas-for-rent');
    else if (propertyType === 'Commercial') params.set('type', 'commercial-for-rent');
    else if (propertyType === 'Office') params.set('type', 'office-for-rent');

    if (maxBudget < 10000) params.set('budget', 'under-10000');
    else if (maxBudget < 25000) params.set('budget', '10000-to-25000');
    else if (maxBudget < 50000) params.set('budget', '25000-to-50000');
    else params.set('budget', 'above-50000');

    if (!isCommercialOrOffice && bhk) {
      params.set('bhk', `${bhk}-bhk-for-rent`);
    }

    return `/rent?${params.toString()}`;
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello VESTA, I have submitted a rental requirement brief (${referenceId}) for a ${
        isCommercialOrOffice ? propertyType : `${bhk} BHK ${propertyType}`
      } in ${selectedLocalities.join(', ')} (Budget: ${RUPEE}${formatInr(minBudget)} - ${RUPEE}${formatInr(maxBudget)}). Please connect me with a leasing advisor.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const firstName = fullName.trim().split(' ')[0] || 'Friend';

  return (
    <div className="w-full min-h-screen bg-[#EAF3F2] text-[#0C0C0C] font-sans overflow-x-hidden">
      {/* Black Header (Navbar only, no search bar) */}
      <section className="w-full bg-[#0C0C0C] pt-28 sm:pt-32 pb-16 px-6 md:px-12 lg:px-16 text-center text-white relative z-30">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF6A] block">
            Rental Advisory &middot; Sourcing Brief
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-normal"
            style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
          >
            Tell us your brief, <br className="hidden sm:inline" />
            <span className="italic text-[#D4AF6A]">we find the address.</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
            Specify your layout preferences, neighborhood choices and move-in timeline for dedicated,
            verified sourcing.
          </p>
        </div>
      </section>

      {/* Main Form & Summary Section */}
      <section className="relative -mt-8 rounded-t-[36px] sm:rounded-t-[48px] bg-[#EAF3F2] px-6 sm:px-10 md:px-16 py-16 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator (3 Nodes with Filling Line) */}
          {!isSubmitted && (
            <div className="max-w-2xl mx-auto mb-14">
              <div className="relative flex items-center justify-between">
                {/* Background Track */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/10 -translate-y-1/2 z-0" />

                {/* Animated Filling Line */}
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[#2E9C8A] -translate-y-1/2 z-0 transition-all duration-600 ease-out"
                  style={{
                    width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                  }}
                />

                {[
                  { num: 1, label: 'Preferences' },
                  { num: 2, label: 'Location & Budget' },
                  { num: 3, label: 'Contact Details' },
                ].map((st) => {
                  const isActive = currentStep === st.num;
                  const isCompleted = currentStep > st.num;
                  return (
                    <div key={st.num} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-semibold transition-all duration-400 ${
                          isCompleted
                            ? 'bg-[#2E9C8A] text-white'
                            : isActive
                            ? 'bg-black text-white ring-4 ring-[#2E9C8A]/20'
                            : 'bg-white text-black/50 border border-black/15'
                        }`}
                      >
                        {isCompleted ? <Check size={18} strokeWidth={2.5} /> : st.num}
                      </div>
                      <span
                        className={`text-xs font-sans mt-2 tracking-wider uppercase transition-colors ${
                          isActive || isCompleted
                            ? 'text-black font-medium'
                            : 'text-black/40'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form and Summary Card Layout */}
          {isSubmitted ? (
            /* SUCCESS PANEL */
            <div className="max-w-2xl mx-auto p-10 sm:p-14 rounded-3xl bg-[#0E0E0E] text-white border border-white/10 shadow-2xl text-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
              {/* Gold SVG Animated Checkmark */}
              <div className="w-20 h-20 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center mx-auto">
                <svg
                  ref={checkSvgRef}
                  className="w-10 h-10 text-[#D4AF6A]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4AF6A] block mb-2">
                  Requirement Registered
                </span>
                <h2
                  className="text-4xl sm:text-5xl font-normal"
                  style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
                >
                  Thank you, {firstName}.
                </h2>
                <div className="mt-3 font-mono text-sm tracking-widest text-white/60">
                  Reference: <span className="text-white font-bold">{referenceId}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3 text-xs font-sans">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="opacity-60">Property Type:</span>
                  <span className="font-medium">
                    {isCommercialOrOffice
                      ? `${propertyType} (${teamSize} seats)`
                      : `${bhk} BHK ${propertyType}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="opacity-60">Localities:</span>
                  <span className="font-medium text-right">{selectedLocalities.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="opacity-60">Budget Range:</span>
                  <span className="font-medium">
                    {RUPEE}{formatInr(minBudget)} &ndash; {RUPEE}{formatInr(maxBudget)} / mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Target Move-in:</span>
                  <span className="font-medium">{moveInDate}</span>
                </div>
              </div>

              <p className="font-sans text-xs opacity-70">
                A rental advisor will contact you shortly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <TransitionLink
                  to={getMatchingRentQuery()}
                  transitionLabel="Matching Rentals"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#D4AF6A] text-black font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#e0be7d] transition-colors"
                >
                  Browse Matching Rentals
                </TransitionLink>

                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-sans text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* LEFT: 3-STEP WIZARD (7 cols) */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-black/10 shadow-lg">
                <form onSubmit={handleSubmit} noValidate>
                  <div ref={stepContainerRef}>
                    {/* ========================================================= */}
                    {/* STEP 1: What are you looking for?                         */}
                    {/* ========================================================= */}
                    {currentStep === 1 && (
                      <div className="space-y-8">
                        <div>
                          <span className="text-xs uppercase font-sans tracking-widest text-[#1D7A6B] block mb-1">
                            Step 1 of 3
                          </span>
                          <h2
                            className="text-3xl sm:text-4xl font-normal text-black"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            What are you looking for?
                          </h2>
                          <p className="font-sans text-xs sm:text-sm text-black/60 mt-1">
                            Choose the asset class and configuration that fits your lifestyle.
                          </p>
                        </div>

                        {/* Property Type Chips */}
                        <div>
                          <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-3">
                            Property Type
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            {(['Flat', 'House', 'Villa', 'Commercial', 'Office'] as const).map(
                              (type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setPropertyType(type)}
                                  className={`py-3 px-3 rounded-xl border text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                                    propertyType === type
                                      ? 'bg-black text-white border-black shadow-md scale-[1.02]'
                                      : 'bg-black/5 text-black/75 border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  {type}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* BHK Chips or Team Size Input */}
                        {!isCommercialOrOffice ? (
                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-3">
                              BHK Configuration
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                              {[1, 2, 3, 4].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setBhk(num)}
                                  className={`py-3 rounded-xl border text-sm font-sans font-medium transition-all duration-200 cursor-pointer ${
                                    bhk === num
                                      ? 'bg-[#2E9C8A] text-white border-[#2E9C8A] shadow-md'
                                      : 'bg-black/5 text-black/75 border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  {num} BHK
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-2">
                              Team Size (Required Desks)
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="number"
                                min={1}
                                max={200}
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-32 h-11 px-3.5 rounded-xl border border-black/15 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                              />
                              <span className="font-sans text-xs text-black/60">
                                Desks / Workstations
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Furnishing Chips */}
                        <div>
                          <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-3">
                            Furnishing Preference
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {(['Any', 'Unfurnished', 'Semi-furnished', 'Furnished'] as const).map(
                              (f) => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => setFurnishing(f)}
                                  className={`py-2.5 px-3 rounded-xl border text-xs font-sans transition-all duration-200 cursor-pointer ${
                                    furnishing === f
                                      ? 'bg-black text-white border-black font-medium'
                                      : 'bg-black/5 text-black/75 border-black/10 hover:border-black/30'
                                  }`}
                                >
                                  {f}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* STEP 2: Where and how much?                               */}
                    {/* ========================================================= */}
                    {currentStep === 2 && (
                      <div className="space-y-8">
                        <div>
                          <span className="text-xs uppercase font-sans tracking-widest text-[#1D7A6B] block mb-1">
                            Step 2 of 3
                          </span>
                          <h2
                            className="text-3xl sm:text-4xl font-normal text-black"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            Where and how much?
                          </h2>
                          <p className="font-sans text-xs sm:text-sm text-black/60 mt-1">
                            Choose up to 4 preferred localities and define your target monthly rent.
                          </p>
                        </div>

                        {/* Preferred Localities (Max 4) */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-xs uppercase font-sans tracking-wider text-black/70">
                              Preferred Neighborhoods (Max 4)
                            </label>
                            <span className="text-xs font-sans text-black/50">
                              {selectedLocalities.length}/4 selected
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {HYDERABAD_LOCALITIES.map((loc) => {
                              const isSelected = selectedLocalities.includes(loc);
                              return (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => toggleLocality(loc)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-sans border transition-all duration-200 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#2E9C8A] text-white border-[#2E9C8A] font-medium scale-[1.03]'
                                      : 'bg-black/5 text-black/70 border-black/10 hover:border-black/25'
                                  }`}
                                >
                                  {loc}
                                </button>
                              );
                            })}
                          </div>
                          {errors.localities && (
                            <span
                              aria-live="polite"
                              className="text-red-500 text-xs font-sans mt-2 block"
                            >
                              {errors.localities}
                            </span>
                          )}
                        </div>

                        {/* Monthly Budget Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs uppercase font-sans tracking-wider text-black/70">
                              Target Monthly Budget
                            </label>
                            <span className="font-serif text-xl text-[#1D7A6B]">
                              {RUPEE}{formatInr(minBudget)} &ndash; {RUPEE}{formatInr(maxBudget)}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="text-[11px] font-sans text-black/50 block mb-1">
                                Maximum Rent: {RUPEE}{formatInr(maxBudget)} / mo
                              </span>
                              <input
                                type="range"
                                min={5000}
                                max={200000}
                                step={1000}
                                value={maxBudget}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setMaxBudget(val);
                                  if (val < minBudget) setMinBudget(val);
                                }}
                                className="w-full accent-[#2E9C8A] cursor-pointer"
                              />
                            </div>
                            <div className="flex justify-between text-[11px] font-sans text-black/40">
                              <span>{RUPEE}5,000</span>
                              <span>{RUPEE}2,00,000 / month</span>
                            </div>
                          </div>
                        </div>

                        {/* Move-in Date, Tenants, Pets */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                              Move-in Date *
                            </label>
                            <input
                              type="date"
                              value={moveInDate}
                              onChange={(e) => {
                                setMoveInDate(e.target.value);
                                if (errors.moveInDate) setErrors((prev) => ({ ...prev, moveInDate: '' }));
                              }}
                              className="w-full h-11 px-3 rounded-xl border border-black/15 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                            />
                            {errors.moveInDate && (
                              <span
                                aria-live="polite"
                                className="text-red-500 text-[11px] font-sans mt-1 block"
                              >
                                {errors.moveInDate}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                              Tenant Profile
                            </label>
                            <select
                              value={tenantType}
                              onChange={(e) => setTenantType(e.target.value as any)}
                              className="w-full h-11 px-3 rounded-xl border border-black/15 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#2E9C8A] cursor-pointer"
                            >
                              <option value="Family">Family</option>
                              <option value="Bachelors">Bachelors</option>
                              <option value="Company">Company</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                              Domestic Pets
                            </label>
                            <button
                              type="button"
                              onClick={() => setHasPets((prev) => !prev)}
                              className={`w-full h-11 px-3 rounded-xl border text-xs font-sans transition-colors flex items-center justify-between cursor-pointer ${
                                hasPets
                                  ? 'bg-[#2E9C8A] text-white border-[#2E9C8A]'
                                  : 'bg-black/5 text-black/75 border-black/15'
                              }`}
                            >
                              <span>{hasPets ? 'Yes (Pets)' : 'No Pets'}</span>
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  hasPets ? 'bg-white' : 'bg-black/20'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* STEP 3: How can we reach you?                             */}
                    {/* ========================================================= */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <span className="text-xs uppercase font-sans tracking-widest text-[#1D7A6B] block mb-1">
                            Step 3 of 3
                          </span>
                          <h2
                            className="text-3xl sm:text-4xl font-normal text-black"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            How can we reach you?
                          </h2>
                          <p className="font-sans text-xs sm:text-sm text-black/60 mt-1">
                            Your contact details remain strictly private with your dedicated leasing
                            advisor.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                            }}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full h-11 px-3.5 rounded-xl border border-black/15 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                          />
                          {errors.fullName && (
                            <span
                              aria-live="polite"
                              className="text-red-500 text-xs font-sans mt-1 block"
                            >
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                              Mobile Number *
                            </label>
                            <input
                              type="tel"
                              value={mobile}
                              onChange={(e) => {
                                setMobile(e.target.value);
                                if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                              }}
                              placeholder="10-digit mobile number"
                              className="w-full h-11 px-3.5 rounded-xl border border-black/15 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                            />
                            {errors.mobile && (
                              <span
                                aria-live="polite"
                                className="text-red-500 text-xs font-sans mt-1 block"
                              >
                                {errors.mobile}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                              Email Address (Optional)
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                              }}
                              placeholder="name@domain.com"
                              className="w-full h-11 px-3.5 rounded-xl border border-black/15 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                            />
                            {errors.email && (
                              <span
                                aria-live="polite"
                                className="text-red-500 text-xs font-sans mt-1 block"
                              >
                                {errors.email}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-2">
                            Preferred Contact Channel
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {(['Call', 'WhatsApp', 'Email'] as const).map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPreferredContact(method)}
                                className={`py-2.5 rounded-xl border text-xs font-sans transition-colors cursor-pointer ${
                                  preferredContact === method
                                    ? 'bg-black text-white border-black font-medium'
                                    : 'bg-black/5 text-black/75 border-black/10 hover:border-black/25'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-sans tracking-wider text-black/70 mb-1">
                            Additional Notes or Special Requirements
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Mention floor preference, gated amenities, parking requirements, or lease duration..."
                            className="w-full p-3.5 rounded-xl border border-black/15 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-[#2E9C8A]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons Row */}
                  <div className="flex items-center justify-between pt-8 border-t border-black/10 mt-8">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-2.5 rounded-full border border-black/20 text-xs font-sans font-medium text-black/75 hover:text-black hover:border-black/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-7 py-3 rounded-full bg-black text-white text-xs font-sans font-medium hover:bg-black/85 flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-full bg-black text-white text-xs uppercase tracking-wider font-sans font-semibold hover:bg-black/85 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering Brief...' : 'Share My Requirement'}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* RIGHT: STICKY "YOUR BRIEF" SUMMARY CARD (5 cols, Obsidian tone) */}
              <div className="lg:col-span-5">
                <div
                  ref={summaryCardRef}
                  className="sticky top-28 p-7 sm:p-9 rounded-3xl bg-[#0E0E0E] text-white border border-white/10 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D4AF6A]">
                      Live Brief Summary
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#2E9C8A] animate-pulse" />
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                      <span className="opacity-60">Asset &amp; Layout:</span>
                      <span className="font-medium text-white text-sm text-right">
                        {isCommercialOrOffice
                          ? `${propertyType} (${teamSize} desks)`
                          : `${bhk} BHK ${propertyType}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                      <span className="opacity-60">Furnishing:</span>
                      <span className="font-medium text-white">{furnishing}</span>
                    </div>

                    <div className="flex justify-between items-start border-b border-white/10 pb-3">
                      <span className="opacity-60">Neighborhoods:</span>
                      <span className="font-medium text-white text-right max-w-[180px]">
                        {selectedLocalities.length > 0
                          ? selectedLocalities.join(', ')
                          : 'None selected'}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                      <span className="opacity-60">Budget Range:</span>
                      <span className="font-serif text-lg text-[#D4AF6A]">
                        {RUPEE}{formatInr(minBudget)} &ndash; {RUPEE}{formatInr(maxBudget)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                      <span className="opacity-60">Target Move-in:</span>
                      <span className="font-medium text-white">{moveInDate || 'Unspecified'}</span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="opacity-60">Tenant &amp; Pets:</span>
                      <span className="font-medium text-white">
                        {tenantType} {hasPets ? '(With Pets)' : '(No Pets)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-sans opacity-70 leading-relaxed">
                    Verified Hyderabad residences matching this profile are shared directly with you
                    without broker spam.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RentShareRequirement;

