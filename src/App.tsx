import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectsListing = lazy(() => import('./pages/ProjectsListing'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Residential = lazy(() => import('./pages/Residential'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Plots = lazy(() => import('./pages/Plots'));
const Investment = lazy(() => import('./pages/Investment'));
const Contact = lazy(() => import('./pages/Contact'));
const SeoLandingPage = lazy(() => import('./pages/SeoLandingPage'));
const PropertyFinder = lazy(() => import('./pages/PropertyFinder'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogRouteResolver = lazy(() => import('./pages/Blog').then((module) => ({ default: module.BlogRouteResolver })));
const BlogAuthor = lazy(() => import('./pages/BlogAuthor'));
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'));
const CommunityBlogs = lazy(() => import('./pages/CommunityBlogs'));
const Admin = lazy(() => import('./pages/Admin'));
const EmployeePortal = lazy(() => import('./pages/EmployeePortal'));
const IvoryCountyMicrosite = lazy(() => import('./pages/IvoryCountyMicrosite'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <LoadingScreen />
      <Router>
        <Suspense fallback={<div role="status" className="min-h-screen bg-bg px-6 pt-32 text-center text-muted">Loading property information...</div>}>
          <Routes>
            <Route path="/7742143317" element={<Admin />} />
            <Route path="/9654322224" element={<EmployeePortal />} />
            <Route path="/admin/blogs" element={<BlogAdmin />} />
            <Route path="/admin/blog" element={<BlogAdmin />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/3bhk-flat" element={<IvoryCountyMicrosite />} />
            <Route path="/projects/ivory-county" element={<IvoryCountyMicrosite />} />
            <Route path="/projects/ivory-county-sector-115-noida" element={<IvoryCountyMicrosite />} />
            <Route path="/ivory-county" element={<IvoryCountyMicrosite />} />
            <Route path="/ivory-county-sector-115-noida" element={<IvoryCountyMicrosite />} />
            <Route path="*" element={<Layout><Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetails />} />
              <Route path="/projects" element={<ProjectsListing />} />
              <Route path="/projects/gallery" element={<Projects />} />
              <Route path="/projects/county-150" element={<SeoLandingPage path="/projects/county-150" />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogRouteResolver />} />
              <Route path="/community-blogs" element={<CommunityBlogs />} />
              <Route path="/community-blogs/:slug" element={<CommunityBlogs />} />
              <Route path="/author/:slug" element={<BlogAuthor />} />
              <Route path="/residential" element={<Residential />} />
              <Route path="/commercial" element={<Commercial />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/investment" element={<Investment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/property-in-noida" element={<SeoLandingPage path="/property-in-noida" />} />
              <Route path="/property-in-greater-noida" element={<SeoLandingPage path="/property-in-greater-noida" />} />
              <Route path="/property-investment-noida" element={<SeoLandingPage path="/property-investment-noida" />} />
              <Route path="/luxury-properties-noida" element={<SeoLandingPage path="/luxury-properties-noida" />} />
              <Route path="/property-near-noida-airport" element={<SeoLandingPage path="/property-near-noida-airport" />} />
              <Route path="/property-finder" element={<PropertyFinder />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes></Layout>} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}
