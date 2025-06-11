import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Donation from './components/Donation';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './admin/AdminPanel';

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

function App() {
  return (
    <Router>
      <div className="App">
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
        
        <Routes>
          <Route path="/" element={<MainWebsite />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;