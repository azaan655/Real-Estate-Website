import React, { useState, useEffect, useRef } from 'react';
import { X, Check, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { Property, formatPrice, pricePerUnit, getKeyDetails } from '../data/properties';

const WHATSAPP_NUMBER = "91XXXXXXXXXX";

interface PropertyDetailProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  triggerButtonRef?: React.RefObject<HTMLElement | null>;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  isOpen,
  onClose,
  triggerButtonRef,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

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

    // Backdrop fade in + panel slide up from bottom
    tl.fromTo(backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      0
    );

    tl.fromTo(panel,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: "power3.out" },
      0
    );

    // Stagger in elements inside panel after slide-up completes
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

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        if (triggerButtonRef?.current) triggerButtonRef.current.focus();
      }
    });

    tl.to(panel, { yPercent: 100, duration: 0.5, ease: "power3.in" }, 0);
    tl.to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.1);
  };

  const validateForm = () => {
    const newErrors: { name?: string; mobile?: string; email?: string } = {};

    if (!fullName.trim()) {
      newErrors.name = 'Full name is required';
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const firstName = fullName.trim().split(' ')[0] || fullName.trim();
    setSubmittedName(firstName);
    setIsSubmitted(true);

    // Auto reset form after 4 seconds
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
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-detail-title"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Dark backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Main sliding panel */}
      <div
        ref={panelRef}
        className="relative min-h-screen w-full bg-[#080808] text-white flex flex-col justify-between"
      >
        {/* Floating Close Button (top-right, 44px circle) */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close property details"
          className="fixed top-6 right-6 md:right-12 lg:right-16 z-50 w-11 h-11 rounded-full border border-white/40 flex items-center justify-center text-white bg-black/60 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF6A]"
        >
          <X size={20} />
        </button>

        {/* Content Wrapper */}
        <div ref={contentWrapRef} className="w-full flex-1 pb-24 md:pb-16">
          {/* ===================================================================== */}
          {/* 1. HEADER IMAGE (56svh on desktop, 44svh on mobile)                  */}
          {/* ===================================================================== */}
          <div className="relative w-full h-[44svh] md:h-[56svh] overflow-hidden">
            <img
              src={property.image}
              alt={property.name.replace('\n', ' ')}
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: property.focal }}
            />
            {/* Bottom gradient fade into black */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 35%, rgba(0,0,0,0.1) 70%, transparent 100%)',
              }}
            />

            {/* Over-image titles: Eyebrow, Single-line Title, and Price */}
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

          {/* ===================================================================== */}
          {/* 2. TWO-COLUMN DETAILS LAYOUT (7 / 5 SPLIT, MAX-W 1200PX)              */}
          {/* ===================================================================== */}
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* LEFT COLUMN (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Stat blocks: Plot vs Commercial vs Residential */}
              <div className="detail-anim-in w-full grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-8">
                {property.type === 'plot' ? (
                  <>
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
                        {property.keyDetails?.find(k => k.label.toLowerCase().includes('road'))?.value || '40 ft'}
                      </span>
                      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-white/60 mt-1">
                        Road Width
                      </span>
                    </div>
                  </>
                ) : property.type === 'commercial' ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Long Description (2 paragraphs) */}
              <div className="detail-anim-in mb-10 space-y-4 text-white/80 font-sans text-[15px] leading-relaxed">
                {property.longDescription.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Highlights (3 phrases with gold check icon) */}
              <div className="detail-anim-in w-full mb-10">
                <h3 className="font-serif text-2xl text-white mb-4">
                  Key Highlights
                </h3>
                <div className="space-y-3 font-sans text-sm text-white/90">
                  {property.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#D4AF6A]/15 text-[#D4AF6A] flex-shrink-0">
                        <Check size={13} strokeWidth={2.5} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities (6 rounded chips) */}
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

            {/* RIGHT COLUMN: STICKY CONTACT FORM CARD (5 cols) */}
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
                  <div className="py-8 flex flex-col items-center text-center animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center mb-3">
                      <Check size={24} strokeWidth={2.5} />
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
                    {/* Full Name */}
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

                    {/* Mobile Number */}
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

                    {/* Email (Optional) */}
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

                    {/* Preferred Date */}
                    <div>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        rows={3}
                        placeholder="Message or specific requests (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white text-sm font-sans placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full h-12 rounded-lg bg-white text-black font-medium text-sm font-sans hover:bg-gray-100 transition-colors duration-200 mt-1"
                    >
                      Request a call back
                    </button>

                    {/* Secondary WhatsApp Button */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 rounded-lg border border-white/30 flex items-center justify-center gap-2 text-white/90 text-xs font-sans tracking-wide uppercase hover:bg-white/10 transition-colors"
                    >
                      <MessageCircle size={15} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Footer Line */}
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 mt-16 pt-8 border-t border-white/10 text-center font-sans text-xs text-white/50">
            Sample listing with AI-generated imagery for demonstration. {property.reraId}.
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar (<768px) */}
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

export default PropertyDetail;

