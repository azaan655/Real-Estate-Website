import React from 'react';
import HeroSection from '../components/HeroSection';
import PropertyShowcase from '../components/PropertyShowcase';
import RecentRentals from '../components/RecentRentals';
import HowItWorks from '../components/HowItWorks';
import FindByLocations from '../components/FindByLocations';
import SiteFooter from '../components/SiteFooter';

export const Home: React.FC = () => {
  return (
    <div className="w-full bg-black text-white">
      <HeroSection />
      <PropertyShowcase />
      <RecentRentals />
      <HowItWorks />
      <FindByLocations />
      <SiteFooter overlap={true} />
    </div>
  );
};

export default Home;
