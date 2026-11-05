import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBuyPageConfig } from '../data/buyPages';

export const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Update document title per route
    if (pathname.startsWith('/buy/')) {
      const slug = pathname.replace('/buy/', '').split('?')[0];
      const cfg = getBuyPageConfig(slug);
      if (cfg) {
        document.title = `${cfg.label} | VESTA`;
      } else {
        document.title = 'VESTA | Luxury Real Estate';
      }
    } else if (pathname === '/buy') {
      document.title = 'Buy Luxury Real Estate in Hyderabad | VESTA';
    } else if (pathname === '/services') {
      document.title = 'Services | VESTA';
    } else if (pathname === '/faqs') {
      document.title = "FAQ's | VESTA";
    } else if (pathname === '/') {
      document.title = 'VESTA | Luxury Real Estate in Hyderabad';
    } else {
      document.title = 'VESTA | Luxury Real Estate';
    }

    // 2. Handle scroll position
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
