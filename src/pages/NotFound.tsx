import React from 'react';
import { TransitionLink } from '../components/PageTransition';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
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
        <ArrowLeft size={16} />
        <span>Back to home</span>
      </TransitionLink>
    </div>
  );
};

export default NotFound;

