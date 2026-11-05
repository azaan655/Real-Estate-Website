import React from 'react';
import ServicesSection from '../components/ServicesSection';

export const Services: React.FC = () => {
  return (
    <div className="w-full bg-[#0C0C0C] min-h-screen text-white">
      {/* Black Page Header space below Navbar */}
      <div className="w-full pt-16 sm:pt-20 md:pt-24 pb-8 px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center">
        <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mb-3" />
        <span className="font-sans text-xs uppercase tracking-[0.28em] text-white/60">
          Tailored Real Estate Solutions
        </span>
      </div>

      {/* Luxury Services Section (ivory paper #FAF8F4 with rounded top corners) */}
      <ServicesSection />
    </div>
  );
};

export default Services;

