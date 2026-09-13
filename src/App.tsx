import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Projects from './pages/Projects';
import ProjectsListing from './pages/ProjectsListing';
import ProjectDetails from './pages/ProjectDetails';
import Residential from './pages/Residential';
import Commercial from './pages/Commercial';
import Plots from './pages/Plots';
import Investment from './pages/Investment';
import Contact from './pages/Contact';
import PropertyFinder from './pages/PropertyFinder';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/projects" element={<ProjectsListing />} />
          <Route path="/projects/gallery" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/residential" element={<Residential />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/plots" element={<Plots />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/property-finder" element={<PropertyFinder />} />
        </Routes>
      </Layout>
    </Router>
  );
}
