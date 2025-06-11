import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Zap, Award, Globe, Smile } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Devotion',
      description: 'Deep spiritual connection and unwavering faith in Thakur Ji guides everything we do.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong bonds among devotees and serving the wider community with love.'
    },
    {
      icon: Zap,
      title: 'Service',
      description: 'Selfless service (seva) to humanity as a path to spiritual growth and fulfillment.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Maintaining the highest standards in all our spiritual and community activities.'
    },
    {
      icon: Globe,
      title: 'Unity',
      description: 'Embracing diversity while fostering unity through shared spiritual values.'
    },
    {
      icon: Smile,
      title: 'Joy',
      description: 'Spreading happiness and positive energy through festivals and celebrations.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-warm-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-6">
            About Our Sacred Mission
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For over 25 years, Shree Thakur Ji Seva Sang has been a beacon of devotion, 
            service, and community spirit, bringing together hearts in divine love and service.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/8633095/pexels-photo-8633095.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Temple interior with devotees"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">25+</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold font-display text-gray-800 mb-6">
              A Journey of Faith and Service
            </h3>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Founded with a vision to serve Thakur Ji and the community, our organization has grown 
                into a vibrant spiritual family. We believe that true devotion manifests through 
                selfless service and community upliftment.
              </p>
              
              <p>
                Our temple serves as a spiritual haven where devotees gather for daily prayers, 
                festival celebrations, and community events. Through various seva programs, we strive 
                to make a positive impact in the lives of those around us.
              </p>
              
              <p>
                From organizing grand festivals to supporting local initiatives, every activity is 
                infused with love, dedication, and the blessings of Thakur Ji. Join us in this 
                beautiful journey of devotion and service.
              </p>
            </div>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Our Events
              </button>
              <button 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full font-semibold transition-all"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold font-display text-center text-gray-800 mb-12">
            Our Core Values
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;