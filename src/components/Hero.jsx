import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Gift, Star, MapPin } from 'lucide-react';

const Hero = () => {

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-temple-pattern opacity-5" />
      
      {/* Om Symbol */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
        <div className="w-[800px] h-[800px] bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-[600px] text-primary/30 font-serif">ॐ</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🙏 Welcome to Divine Service
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-gray-900 mt-6 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Shree Thakur Ji
              <span className="block text-primary mt-2">Seva Sang</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join us in serving the divine through donations, prayers, and
              community service. Your contribution helps maintain our sacred
              mandir and supports countless devotees in their spiritual journey.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button 
                onClick={() => document.getElementById('donation')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Donate Now
              </button>              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all border-2 border-gray-200"
              >
                Learn More
              </button>              <button                onClick={() => document.getElementById('temple-address')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all border-2 border-gray-200 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Temple Location
              </button>
            </motion.div>
          </div>

          {/* Right Content - Temple Image */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="./image/pandit.jpg"
                alt="Temple Priest"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats Card */}
          
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;