import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Search, Filter } from 'lucide-react';
import { galleryAPI } from '../services/api';

const AllGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'festivals', label: 'Festivals' },
    { value: 'mandir', label: 'Temple' },
    { value: 'events', label: 'Events' },
    { value: 'daily', label: 'Daily Activities' }
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, [filters]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getPublic(filters);
      const newImages = response.data.data;
      
      if (filters.page === 1) {
        setGalleryImages(newImages);
      } else {
        setGalleryImages(prev => [...prev, ...newImages]);
      }
      
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="py-20 bg-gradient-to-br from-warm-50 to-orange-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-6">
            Temple Gallery
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our extensive collection of photographs capturing the divine moments, 
            festivals, ceremonies, and daily activities at our temple.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {galleryImages.map((image, index) => (
              <motion.div
                key={image._id}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => {
                  setSelectedImage(image);
                  setCurrentImageIndex(0);
                }}
                layout
              >
                <div className="aspect-square overflow-hidden">
                  <div className="relative w-full h-full">
                    <img 
                      src={image.images && image.images.length > 0 ? image.images[0].url : ''}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {image.images && image.images.length > 1 && (
                      <div className="absolute inset-0 p-2">
                        <div className="grid grid-cols-2 gap-1 w-full h-full">
                          {image.images.slice(1, 4).map((img, idx) => (
                            <div key={idx} className="relative overflow-hidden rounded">
                              <img 
                                src={img.url} 
                                alt={`${image.title} - Image ${idx + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {image.images.length > 4 && (
                            <div className="relative overflow-hidden rounded bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                +{image.images.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
        {pagination.currentPage < pagination.totalPages && !loading && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={loadMore}
              className="bg-white hover:bg-primary hover:text-white text-gray-700 border-2 border-gray-200 hover:border-primary px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Load More Photos
            </button>
          </motion.div>
        )}

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
                
                {/* Image Gallery */}
                <div className="relative rounded-2xl overflow-hidden bg-white">
                  <div className="relative">
                    {selectedImage.images && selectedImage.images.length > 0 ? (
                      <>
                        <img 
                          src={selectedImage.images[currentImageIndex].url}
                          alt={`${selectedImage.title} - Image ${currentImageIndex + 1}`}
                          className="w-full max-h-[70vh] object-contain mx-auto"
                        />
                        
                        {selectedImage.images.length > 1 && (
                          <>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                              {selectedImage.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    currentImageIndex === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                  }}
                                />
                              ))}
                            </div>
                            <button
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(prev => 
                                  prev === 0 ? selectedImage.images.length - 1 : prev - 1
                                );
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(prev => 
                                  prev === selectedImage.images.length - 1 ? 0 : prev + 1
                                );
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <img 
                        src={selectedImage.url}
                        alt={selectedImage.title}
                        className="w-full max-h-[70vh] object-contain"
                      />
                    )}
                  </div>
                  
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

        {/* Loading State */}
        {loading && galleryImages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse">
                <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && galleryImages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Photos Found</h3>
            <p className="text-gray-600">
              {filters.search 
                ? 'No photos match your search criteria. Try different keywords.'
                : filters.category !== 'all'
                  ? 'There are no photos in this category yet.'
                  : 'The gallery is empty. Check back soon for new photos.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllGallery;
