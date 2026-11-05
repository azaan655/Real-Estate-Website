import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { rentalProjects, unitsFor, rentRange } from '../data/rentalProjects';
import SearchBar from '../components/SearchBar';
import { TransitionLink, usePageTransition } from '../components/PageTransition';
import { RUPEE, formatInr } from '../lib/money';

export const RentProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { transitionTo } = usePageTransition();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Rental Projects | VESTA';
  }, []);

  const totalProjects = rentalProjects.length;
  const allProjectUnits = rentalProjects.flatMap((p) => unitsFor(p));
  const totalUnits = allProjectUnits.length;
  const minProjectRent =
    allProjectUnits.length > 0 ? Math.min(...allProjectUnits.map((u) => u.rent)) : 0;

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      transitionTo(`/rent?q=${encodeURIComponent(searchQuery.trim())}`, 'Rentals Search');
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[#F5F3ED] text-[#0C0C0C] font-sans overflow-x-hidden"
    >
      {/* Black Header with Search Bar */}
      <section className="w-full bg-[#0C0C0C] pt-28 sm:pt-32 pb-16 px-6 md:px-12 lg:px-16 text-white relative z-30">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="w-8 h-[2px] bg-[#D4AF6A] rounded-full mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-3">
            Signature Rental Projects
          </h1>
          <p className="font-sans text-sm text-white/70 max-w-lg mx-auto">
            Discover verified gated enclaves, towers, and villa communities with live rental inventory.
          </p>
        </div>

        <SearchBar
          mode="rent"
          q={searchQuery}
          onQChange={setSearchQuery}
          type=""
          onTypeChange={() => {}}
          budget=""
          onBudgetChange={() => {}}
          bhk=""
          onBhkChange={() => {}}
          onSearchSubmit={handleSearchSubmit}
        />
      </section>

      {/* Main Rounded Section */}
      <section className="relative -mt-8 rounded-t-[36px] sm:rounded-t-[48px] bg-[#F5F3ED] px-6 sm:px-10 md:px-16 lg:px-20 py-16 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header Introduction */}
          <div className="max-w-3xl space-y-4">
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-[#8C671D] block font-medium">
              Curated Communities &middot; Hyderabad
            </span>
            <h2
              className="text-[clamp(2.5rem,5.5vw,4.2rem)] leading-[1.08] font-normal"
              style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
            >
              Signature estates, <br />
              <span className="italic text-[#8C671D]">curated communities.</span>
            </h2>
            <p className="font-sans text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
              Discover high-rise towers, courtyard enclaves, and private gated villa developments
              offering premium rental residences with dedicated amenities.
            </p>
          </div>

          {/* Thin Rule */}
          <div className="w-full h-[1px] bg-black/10" />

          {/* 3-Stat Strip (Projects, Units Available, Rent From) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-black/10">
            <div>
              <span className="text-xs uppercase font-sans tracking-wider opacity-60 block mb-1">
                Featured Communities
              </span>
              <span className="font-serif text-3xl sm:text-4xl text-[#0C0C0C]">
                {totalProjects}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-sans tracking-wider opacity-60 block mb-1">
                Units Available for Rent
              </span>
              <span className="font-serif text-3xl sm:text-4xl text-[#0C0C0C]">
                {totalUnits} Residences
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-sans tracking-wider opacity-60 block mb-1">
                Rent Starting From
              </span>
              <span className="font-serif text-3xl sm:text-4xl text-[#8C671D] flex items-baseline gap-1">
                <span className="rupee font-sans">{RUPEE}</span>
                {formatInr(minProjectRent)}
                <span className="text-xs font-sans text-black/60"> / mo</span>
              </span>
            </div>
          </div>

          {/* 6 Projects as Alternating Wide Cards */}
          <div className="space-y-12">
            {rentalProjects.map((project, idx) => {
              const units = unitsFor(project);
              const [minR] = rentRange(project);
              const isEven = idx % 2 === 0;

              // Distinct types available in project
              const uniqueSubtypes = Array.from(new Set(units.map((u) => u.subtype))).join(', ');

              return (
                <div
                  key={project.id}
                  className={`rounded-[28px] overflow-hidden bg-white border border-black/10 shadow-lg flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Image Column (58%) */}
                  <div className="lg:w-[58%] relative min-h-[320px] sm:min-h-[420px] overflow-hidden bg-black/20 group">
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full liquid-glass bg-black/60 backdrop-blur-md text-xs font-sans text-white border border-white/20">
                      {project.location}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-sans uppercase tracking-widest text-[#D4AF6A] block mb-1">
                        Gated Community
                      </span>
                      <h4 className="font-serif text-2xl sm:text-3xl">{project.name}</h4>
                    </div>
                  </div>

                  {/* Info Column (42%) */}
                  <div className="lg:w-[42%] p-8 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#8C671D] block mb-1">
                          {project.location}
                        </span>
                        <h3
                          className="text-[32px] sm:text-[38px] leading-tight font-normal text-black"
                          style={{ fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)' }}
                        >
                          {project.name}
                        </h3>
                        <p className="font-serif text-lg text-black/70 italic mt-1">
                          &ldquo;{project.tagline}&rdquo;
                        </p>
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-black/75 leading-relaxed">
                        {project.description}
                      </p>

                      {/* 6 Amenity Chips */}
                      <div>
                        <span className="text-[10px] uppercase font-sans tracking-wider text-black/50 block mb-2">
                          Featured Amenities
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.amenities.map((am, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2.5 py-1 rounded-md bg-black/5 text-[11px] font-sans text-black/80"
                            >
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mini Stat Row & CTA Button */}
                    <div className="pt-6 border-t border-black/10 space-y-5">
                      <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/50 block">
                            Units for Rent
                          </span>
                          <span className="font-serif text-lg text-black block mt-0.5">
                            {units.length} Live
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/50 block">
                            Rent From
                          </span>
                          <span className="font-serif text-lg text-[#8C671D] block mt-0.5">
                            {RUPEE}{formatInr(minR)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-black/50 block">
                            Available Types
                          </span>
                          <span className="font-sans text-xs font-medium text-black block mt-0.5 truncate">
                            {uniqueSubtypes || 'Residential'}
                          </span>
                        </div>
                      </div>

                      <TransitionLink
                        to={`/rent?q=${encodeURIComponent(project.name)}`}
                        transitionLabel={project.name}
                        className="w-full py-3.5 rounded-full bg-black text-white hover:bg-[#D4AF6A] hover:text-black font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>View {units.length} Available Units</span>
                        <ArrowUpRight size={15} />
                      </TransitionLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing CTA */}
          <div className="rounded-3xl p-8 sm:p-12 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-3xl">Looking for a particular community?</h3>
              <p className="font-sans text-xs sm:text-sm opacity-70">
                Share your community preferences with our Hyderabad leasing specialists to access
                upcoming and unlisted rentals.
              </p>
            </div>

            <TransitionLink
              to="/rent/share-requirement"
              transitionLabel="Share Requirement"
              className="px-7 py-4 rounded-full bg-[#D4AF6A] text-[#0C0C0C] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#e0be7d] transition-colors flex-shrink-0 shadow-lg"
            >
              Share Your Requirement
            </TransitionLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentProjects;

