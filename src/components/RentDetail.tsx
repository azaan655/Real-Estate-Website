import React, { useState, useEffect, useRef } from 'react';
import { X, Check, MessageCircle, Calendar, ShieldCheck, Heart } from 'lucide-react';
import gsap from 'gsap';
import { Rental, deposit, moveInCost, rentalViews, RentalView } from '../data/rentals';
import { RUPEE, DOT, formatInr } from '../lib/money';

const WHATSAPP_NUMBER = '91XXXXXXXXXX';

interface RentDetailProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLElement | null>;
  initialViewIndex?: number;
}

export const RentDetail: React.FC<RentDetailProps> = ({
  rental,
  isOpen,
  onClose,
  triggerButtonRef,
  initialViewIndex = 0,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);

  const views = rentalViews(rental);
  const [activeViewIdx, setActiveViewIdx] = useState(initialViewIndex);

  useEffect(() => {
    if (isOpen) {
      setActiveViewIdx(initialViewIndex);
    }
  }, [isOpen, initialViewIndex]);

  // Form state
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; email?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  // Lock body scroll & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Entrance & Exit animations
  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const content = contentWrapRef.current;
    if (!panel || !backdrop) return;

    if (prefersReducedMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(panel, { yPercent: 0, opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power2.out' },
      0
    );

    tl.fromTo(
      panel,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.75, ease: 'power3.out' },
      0
    );

    if (content) {
      const animItems = content.querySelectorAll('.rent-detail-anim');
      tl.fromTo(
        animItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
        },
        0.3
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

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        if (triggerButtonRef?.current) triggerButtonRef.current.focus();
      },
    });

    tl.to(panel, { yPercent: 100, duration: 0.4, ease: 'power3.in' });
    tl.to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1);
  };

  const validateForm = () => {
    const errs: { name?: string; mobile?: string; email?: string } = {};

    if (!fullName.trim()) {
      errs.name = 'Full name is required';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!cleanMobile) {
      errs.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(cleanMobile)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errs.email = 'Enter a valid email address';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmittedName(fullName.trim());
    setIsSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello VESTA, I am interested in viewing the rental property "${rental.name.replace('\n', ' ')}" in ${rental.location} (${RUPEE}${formatInr(rental.rent)}/month). Please share more details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  const depositAmount = deposit(rental);
  const totalSigningCost = moveInCost(rental);
  const maintenanceText =
    rental.maintenance === 0 ? 'Included' : `${RUPEE}${formatInr(rental.maintenance)} / mo`;

  // Move-in cost stacked bar percentages
  const rentPct = Math.round((rental.rent / totalSigningCost) * 100);
  const depositPct = 100 - rentPct;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-end justify-center overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rent-detail-title"
    >
      {/* Dimmed Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Main Slide-Up Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#0E0E0E] text-white rounded-t-3xl border-t border-x border-white/15 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10"
      >
        {/* Top Header Bar with Close Button */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-white/10">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D4AF6A] block">
              {rental.location}
            </span>
            <h2
              id="rent-detail-title"
              className="text-xl sm:text-2xl font-serif text-white tracking-wide"
            >
              {rental.name.replace('\n', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-sans opacity-50 block">Monthly Rent</span>
              <span className="text-xl font-serif text-[#D4AF6A]">
                {RUPEE}{formatInr(rental.rent)}
                <span className="text-xs font-sans text-white/60"> / mo</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close details"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={contentWrapRef}
          className="overflow-y-auto px-6 sm:px-10 py-8 flex-1 space-y-10"
        >
          {/* Header Image Stage */}
          <div className="rent-detail-anim relative aspect-[16/8] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            <img
              key={views[activeViewIdx]?.src || rental.image}
              src={views[activeViewIdx]?.src || rental.image}
              alt={views[activeViewIdx]?.alt || rental.name.replace('\n', ' ')}
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ objectPosition: rental.focal || 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-sans font-medium text-white border border-white/20 inline-block">
                    {rental.availableFrom.toLowerCase() === 'immediate'
                      ? 'Available Immediately'
                      : `Available from ${rental.availableFrom}`}
                  </span>
                  {views[activeViewIdx]?.label && (
                    <span className="px-3 py-1 rounded-full bg-[#D4AF6A]/20 backdrop-blur-md text-xs font-sans font-semibold text-[#D4AF6A] border border-[#D4AF6A]/30 inline-block">
                      {views[activeViewIdx].label}
                    </span>
                  )}
                </div>
                <p className="font-serif text-lg sm:text-2xl text-white max-w-2xl">
                  {rental.tagline}
                </p>
              </div>

              <span className="font-sans text-xs uppercase tracking-wider text-white/60 hidden md:block">
                {rental.subtype}
              </span>
            </div>
          </div>

          {/* GALLERY THUMBNAIL ROW (4 thumbs, 88 x 62px) */}
          {views.length > 1 && (
            <div className="rent-detail-anim flex items-center gap-3 overflow-x-auto pb-1 -mt-4">
              {views.map((v, i) => (
                <button
                  key={`${v.src}-${i}`}
                  type="button"
                  onClick={() => setActiveViewIdx(i)}
                  aria-label={`View ${v.label}`}
                  className={`relative flex-shrink-0 w-[88px] h-[62px] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeViewIdx === i
                      ? 'border-[#D4AF6A] ring-2 ring-[#D4AF6A]'
                      : 'border-white/20 hover:border-white/50 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={v.src}
                    alt={v.alt}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] font-sans truncate text-white bg-black/70 px-1 py-0.5 rounded text-center">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Two-Column Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Stats, Cost Breakdown, Description, Terms, Amenities */}
            <div className="lg:col-span-7 space-y-10">
              {/* 3 Main Stat Blocks */}
              <div className="rent-detail-anim grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-wider opacity-50 block mb-1">
                    Monthly Rent
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-[#D4AF6A] block">
                    {RUPEE}{formatInr(rental.rent)}
                  </span>
                  <span className="text-[10px] font-sans opacity-50 block">per month</span>
                </div>

                <div className="border-x border-white/10 px-2">
                  <span className="text-[11px] font-sans uppercase tracking-wider opacity-50 block mb-1">
                    Security Deposit
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-white block">
                    {RUPEE}{formatInr(depositAmount)}
                  </span>
                  <span className="text-[10px] font-sans opacity-50 block">
                    {rental.depositMonths} months
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-sans uppercase tracking-wider opacity-50 block mb-1">
                    Maintenance
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-white block">
                    {rental.maintenance === 0 ? 'Included' : `${RUPEE}${formatInr(rental.maintenance)}`}
                  </span>
                  <span className="text-[10px] font-sans opacity-50 block">
                    {rental.maintenance === 0 ? 'in rent' : 'per month'}
                  </span>
                </div>
              </div>

              {/* Move-in Cost Breakdown Card */}
              <div className="rent-detail-anim p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-white">Move-in Cost Breakdown</h3>
                  <span className="text-xs font-sans uppercase tracking-wider text-[#D4AF6A]">
                    Due at Signing
                  </span>
                </div>

                {/* Stacked Proportional Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden bg-white/10 flex">
                  <div
                    style={{ width: `${rentPct}%` }}
                    className="h-full bg-white/40"
                    title={`First Month Rent: ${rentPct}%`}
                  />
                  <div
                    style={{ width: `${depositPct}%` }}
                    className="h-full bg-[#D4AF6A]"
                    title={`Security Deposit: ${depositPct}%`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/40 flex-shrink-0" />
                    <span className="opacity-70">First Month Rent:</span>
                    <span className="font-medium text-white">{RUPEE}{formatInr(rental.rent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF6A] flex-shrink-0" />
                    <span className="opacity-70">Security Deposit:</span>
                    <span className="font-medium text-white">{RUPEE}{formatInr(depositAmount)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-sans text-sm opacity-80">Total Required to Move In:</span>
                  <span className="font-serif text-2xl text-[#D4AF6A]">
                    {RUPEE}{formatInr(totalSigningCost)}
                  </span>
                </div>
              </div>

              {/* Long Description (2 short paragraphs) */}
              <div className="rent-detail-anim space-y-4">
                <h3 className="font-serif text-xl text-white">About the Residence</h3>
                {rental.longDescription.split('\n\n').map((para, idx) => (
                  <p key={idx} className="font-sans text-sm sm:text-base opacity-80 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Highlights (3 with gold checks) */}
              <div className="rent-detail-anim space-y-3">
                <h3 className="font-serif text-xl text-white">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rental.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="font-sans text-xs sm:text-sm opacity-90 leading-snug">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Terms Definition Grid */}
              <div className="rent-detail-anim space-y-3">
                <h3 className="font-serif text-xl text-white">Rental Terms &amp; Conditions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-sans">
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Furnishing
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.furnishing}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Available From
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.availableFrom}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Preferred Tenants
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">
                      {rental.tenants.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Pets
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">
                      {rental.pets ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Parking
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.parking}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Floor Level
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.floor}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Facing
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.facing}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block uppercase tracking-wider text-[10px]">
                      Lease Term
                    </span>
                    <span className="font-medium opacity-90 mt-1 block">{rental.leaseNote}</span>
                  </div>
                </div>
              </div>

              {/* Amenities Chips (6) */}
              <div className="rent-detail-anim space-y-3">
                <h3 className="font-serif text-xl text-white">Society &amp; Unit Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {rental.amenities.map((am, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 font-sans text-xs text-white/85"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Sticky): Schedule a Visit Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                <div>
                  <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#D4AF6A] block mb-1">
                    Direct Inspection
                  </span>
                  <h3 className="font-serif text-2xl text-white">Schedule a Private Visit</h3>
                  <p className="font-sans text-xs opacity-60 mt-1">
                    Accompanied by a dedicated VESTA leasing advisor.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-6 rounded-xl bg-white/10 border border-[#D4AF6A]/30 space-y-4 text-center animate-[fadeIn_0.4s_ease-out]">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center mx-auto">
                      <ShieldCheck size={28} />
                    </div>
                    <h4 className="font-serif text-xl text-white">
                      Visit Requested, {submittedName}
                    </h4>
                    <p className="font-sans text-xs opacity-75 leading-relaxed">
                      Our leasing coordinator will contact you at {mobile} to confirm the viewing
                      appointment time.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-sans text-[#D4AF6A] hover:underline block mx-auto pt-2"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider opacity-70 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Your full name"
                        className="w-full h-11 px-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-sans text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                      />
                      {errors.name && (
                        <span className="text-red-400 text-[11px] font-sans mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider opacity-70 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full h-11 px-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-sans text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                      />
                      {errors.mobile && (
                        <span className="text-red-400 text-[11px] font-sans mt-1 block">
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider opacity-70 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="your.email@domain.com"
                        className="w-full h-11 px-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-sans text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                      />
                      {errors.email && (
                        <span className="text-red-400 text-[11px] font-sans mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider opacity-70 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider opacity-70 mb-1">
                        Message / Special Note
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Specify preferred timing or questions regarding terms..."
                        className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-sm font-sans text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF6A]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#D4AF6A] text-[#0C0C0C] font-sans text-sm font-semibold hover:bg-[#e0be7d] transition-colors cursor-pointer shadow-lg"
                    >
                      Request Visit Appointment
                    </button>

                    <div className="relative py-2 flex items-center justify-center">
                      <div className="w-full border-t border-white/10" />
                      <span className="absolute bg-[#121212] px-3 text-[11px] font-sans opacity-40 uppercase">
                        or
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="w-full py-3 rounded-xl border border-white/20 hover:border-white/40 text-white font-sans text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle size={16} className="text-[#25D366]" />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Footer Demo Note */}
          <div className="pt-6 border-t border-white/10 text-center">
            <p className="font-sans text-xs opacity-40 italic">
              Sample listing with AI-generated imagery for demonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentDetail;

