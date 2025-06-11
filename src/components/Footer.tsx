import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Donate', href: '#donation' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Daily Aarti',
    'Festival Celebrations',
    'Community Seva',
    'Spiritual Classes',
    'Marriage Ceremonies',
    'Religious Counseling'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Youtube, href: '#', color: 'hover:text-red-600' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-secondary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Shree Thakur Ji</h3>
                <p className="text-sm text-gray-300">Seva Sang</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              For over 25 years, we have been serving Thakur Ji and the community through 
              devotion, service, and spiritual growth. Join us in this sacred journey.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 flex items-center">
                  <span className="w-1 h-1 bg-accent rounded-full mr-3"></span>
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Shree Thakur Ji Seva Sang</p>
                  <p>Main Temple Complex</p>
                  <p>Temple Road, Sacred City</p>
                  <p>PIN: 123456</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>contact@shreethakurjiseva.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Morning: 5:00 AM - 12:00 PM</p>
                  <p>Evening: 4:00 PM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <motion.div 
        className="border-t border-white/10 py-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-bold mb-2">Stay Connected</h4>
              <p className="text-gray-300 text-sm">
                Subscribe to receive updates about events, festivals, and spiritual programs
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary focus:outline-none w-full sm:w-64"
              />
              <motion.button
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <p>© 2024 Shree Thakur Ji Seva Sang. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 font-display">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              May all beings be happy, may all beings be healthy, may all beings experience prosperity, may none suffer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;