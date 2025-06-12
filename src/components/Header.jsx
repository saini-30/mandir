import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-secondary text-white py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>contact@shreethakurjiseva.com</span>
            </div>
          </div>
          <div className="text-xs">
            "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
          </div>
        </div>
      </div>      {/* Main Header */}      <motion.header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/60 backdrop-blur-sm shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isScrolled ? 'bg-primary shadow-lg' : 'bg-primary'
              }`}>
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>                <h1 className="text-xl font-bold font-display text-gray-800 transition-colors duration-500">
                  Shree Thakur Ji
                </h1>
                <p className="text-sm text-gray-600 transition-colors duration-500">
                  Seva Sang
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}            <nav className="hidden lg:flex space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="font-medium text-lg text-gray-800 transition-colors duration-500 hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* Donate Button */}
            <motion.button
              className="hidden md:block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('donation')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Donate Now
            </motion.button>

            {/* Mobile Menu Button */}            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-800 transition-colors duration-500" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800 transition-colors duration-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-white shadow-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-primary font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold mt-4"
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById('donation')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Donate Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;