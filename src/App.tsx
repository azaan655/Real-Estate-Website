import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollManager from './components/ScrollManager';
import { PageTransitionProvider } from './components/PageTransition';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy load pages with Suspense
const Services = lazy(() => import('./pages/Services'));
const Buy = lazy(() => import('./pages/Buy'));
const BuyCategory = lazy(() => import('./pages/BuyCategory'));
const Rent = lazy(() => import('./pages/Rent'));
const RentShareRequirement = lazy(() => import('./pages/RentShareRequirement'));
const RentProjects = lazy(() => import('./pages/RentProjects'));
const RentCollection = lazy(() => import('./pages/RentCollection'));
const Faqs = lazy(() => import('./pages/Faqs'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));

const Layout: React.FC = () => {
  return (
    <PageTransitionProvider>
      <ScrollManager />
      <div className="relative w-full min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full flex-1">
          <Outlet />
        </main>
      </div>
      <BackToTop />
    </PageTransitionProvider>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="services"
          element={
            <Suspense fallback={null}>
              <Services />
            </Suspense>
          }
        />
        <Route
          path="buy"
          element={
            <Suspense fallback={null}>
              <Buy />
            </Suspense>
          }
        />
        <Route
          path="buy/:slug"
          element={
            <Suspense fallback={null}>
              <BuyCategory />
            </Suspense>
          }
        />
        <Route
          path="rent"
          element={
            <Suspense fallback={null}>
              <Rent />
            </Suspense>
          }
        />
        <Route
          path="rent/share-requirement"
          element={
            <Suspense fallback={null}>
              <RentShareRequirement />
            </Suspense>
          }
        />
        <Route
          path="rent/projects"
          element={
            <Suspense fallback={null}>
              <RentProjects />
            </Suspense>
          }
        />
        <Route
          path="rent/:slug"
          element={
            <Suspense fallback={null}>
              <RentCollection />
            </Suspense>
          }
        />
        <Route
          path="faqs"
          element={
            <Suspense fallback={null}>
              <Faqs />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="terms"
          element={
            <Suspense fallback={null}>
              <Terms />
            </Suspense>
          }
        />
        <Route
          path="privacy"
          element={
            <Suspense fallback={null}>
              <Privacy />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
