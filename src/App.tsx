import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Events from './components/Events.jsx';
import Donation from './components/Donation.jsx';
import Gallery from './components/Gallery.jsx';
import AllGallery from './components/AllGallery.jsx';
import Contact from './components/Contact'; // Remove .jsx extension
import Footer from './components/Footer.jsx';

const AdminPanel = lazy(() => import('./admin/AdminPanel'));

// Main Website
const MainWebsite = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <Hero />
    <About />
    <Events />
    <Donation />
    <Gallery />
    <Contact />
    <Footer />
  </div>
);

// Full Gallery Page
const GalleryPage = () => (
  <div className="min-h-screen bg-white">
   
    <AllGallery />
    <Footer />
  </div>
);

function App() {    return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainWebsite />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminPanel />
            </Suspense>
          } />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;