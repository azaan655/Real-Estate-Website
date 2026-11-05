import React from 'react';
import FadeIn from './FadeIn';
import AnimatedHeading from './AnimatedHeading';
import SearchCard from './SearchCard';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-svh flex flex-col justify-between overflow-hidden">
      {/* ========================================================================= */}
      {/* RAW VIDEO BACKGROUND (NO OVERLAY, NO GRADIENT, COVERS VIEWPORT)           */}
      {/* ========================================================================= */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Spacer for top navbar */}
      <div className="w-full h-20 sm:h-24" />

      {/* ========================================================================= */}
      {/* HERO CONTENT (BOTTOM OF VIEWPORT)                                         */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-8 sm:pb-12 lg:pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col items-start w-full">
            {/* Eyebrow */}
            <FadeIn delay={100} duration={800}>
              <p className="text-[11px] sm:text-xs uppercase font-medium text-white/70 tracking-[0.22em] mb-4 sm:mb-5 font-sans">
                Residential &middot; Commercial &middot; Investment
              </p>
            </FadeIn>

            {/* Animated Line-Mask Heading */}
            <AnimatedHeading
              text={'Find the place\nyou\'ll call *home.*'}
              delay={300}
              charDelay={22}
              className="font-serif font-normal leading-[0.95] mb-5 sm:mb-6 tracking-[-0.02em] text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]"
            />

            {/* Subheading */}
            <FadeIn delay={1000} duration={1000} y={12}>
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl mb-6 sm:mb-7 font-sans leading-relaxed">
                Curated homes, apartments and investment properties in the city&apos;s most sought-after neighborhoods &mdash; with advisors who handle every step.
              </p>
            </FadeIn>

            {/* Buttons Row */}
            <FadeIn delay={1300} duration={1000} y={12} className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 font-sans w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto min-h-[44px] bg-white text-black px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  Browse Properties
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto min-h-[44px] liquid-glass border border-white/20 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  Talk to an Advisor
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column Property Search Card */}
          <div className="w-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
