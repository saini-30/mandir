import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';
import type { ImageType } from '../types/components';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'festivals', name: 'Festivals' },
    { id: 'mandir', name: 'Temple' },
    { id: 'events', name: 'Events' },
    { id: 'daily', name: 'Daily Activities' }
  ];

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/7945776/pexels-photo-7945776.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'festivals',
      title: 'Janmashtami Celebration',
      description: 'Grand celebration of Lord Krishna\'s birth with traditional decorations and ceremonies',
      date: '2024-08-26',
      location: 'Main Temple Hall'
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/8633095/pexels-photo-8633095.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'mandir',
      title: 'Temple Interior',
      description: 'Beautiful interior architecture with traditional Indian design elements',
      date: '2024-07-15',
      location: 'Main Sanctum'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/7945769/pexels-photo-7945769.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'festivals',
      title: 'Diwali Decorations',
      description: 'Temple adorned with beautiful diyas and rangoli for Diwali celebrations',
      date: '2023-11-12',
      location: 'Temple Courtyard'
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/8633094/pexels-photo-8633094.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'daily',
      title: 'Morning Aarti',
      description: 'Daily morning prayers and aarti ceremony with devotees',
      date: '2024-08-20',
      location: 'Main Temple'
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/7945775/pexels-photo-7945775.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'events',
      title: 'Community Seva',
      description: 'Food distribution and community service activities',
      date: '2024-08-10',
      location: 'Community Hall'
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/8633096/pexels-photo-8633096.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'festivals',
      title: 'Holi Celebration',
      description: 'Colorful Holi festival celebrations with community participation',
      date: '2024-03-25',
      location: 'Temple Grounds'
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/6208516/pexels-photo-6208516.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'mandir',
      title: 'Temple Architecture',
      description: 'Intricate architectural details and traditional craftsmanship',
      date: '2024-06-30',
      location: 'Exterior View'
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/12419603/pexels-photo-12419603.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'daily',
      title: 'Evening Prayers',
      description: 'Peaceful evening prayer session with devotional singing',
      date: '2024-08-18',
      location: 'Prayer Hall'
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/8633097/pexels-photo-8633097.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'events',
      title: 'Cultural Program',
      description: 'Traditional dance and music performances during festivals',
      date: '2024-07-20',
      location: 'Main Stage'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-warm-50 to-orange-50">
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
            Temple Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Glimpses of our spiritual journey, festivals, daily activities, and the divine 
            atmosphere that makes our temple a sacred home for all devotees.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary/10 hover:text-primary shadow-md'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Image Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedImage(image)}
                layout
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-white/80 mb-2 line-clamp-2">{image.description}</p>
                    <div className="flex items-center text-xs text-white/70 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(image.date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {image.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-white hover:bg-primary hover:text-white text-gray-700 border-2 border-gray-200 hover:border-primary px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Photos
          </motion.button>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-4xl w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden bg-white">
                  <img 
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                  
                  {/* Image Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {selectedImage.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {selectedImage.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(selectedImage.date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedImage.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;