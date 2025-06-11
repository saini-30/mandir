import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import Donation from './Donation';

const Events = () => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateProgress = (raised, target) => {
    return Math.min(Math.round((raised / target) * 100), 100);
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleDonateClick = (event) => {
    setSelectedEvent(event);
    setShowDonationModal(true);
  };

  if (loading) {
    return (
      <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-warm-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-warm-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading events: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-warm-50">
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
              Upcoming Events & Seva
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join us in celebrating festivals, participating in seva activities, and supporting 
              our community development initiatives.
            </p>
          </motion.div>

          {/* Main Featured Event */}
          {events.mainEvent && (
            <motion.div
              className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <div className="relative h-64 lg:h-full">
                    <img 
                      src={events.mainEvent.images?.[0]?.url || 'https://images.pexels.com/photos/7945776/pexels-photo-7945776.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={events.mainEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Featured Event
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30"></div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {events.mainEvent.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(events.mainEvent.eventDate)}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold font-display text-gray-800 mb-4">
                    {events.mainEvent.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {events.mainEvent.description}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Progress: {formatAmount(events.mainEvent.raisedAmount)} of {formatAmount(events.mainEvent.targetAmount)}</span>
                      <span>{Math.round(calculateProgress(events.mainEvent.raisedAmount, events.mainEvent.targetAmount))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${calculateProgress(events.mainEvent.raisedAmount, events.mainEvent.targetAmount)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {events.mainEvent.donationCount} supporters
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {events.mainEvent.location}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDonateClick(events.mainEvent)}
                  >
                    Support This Event
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other Events Grid */}
          {events.otherEvents && events.otherEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.otherEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.images?.[0]?.url || 'https://images.pexels.com/photos/8633094/pexels-photo-8633094.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(event.eventDate)}
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {event.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-semibold text-primary">
                          {formatAmount(event.raisedAmount)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(event.raisedAmount, event.targetAmount)}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{event.donationCount} supporters</span>
                        <span>{Math.round(calculateProgress(event.raisedAmount, event.targetAmount))}% funded</span>
                      </div>

                      <motion.button
                        className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all mt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDonateClick(event);
                        }}
                      >
                        Donate Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Event Detail Modal */}
          <AnimatePresence>
            {selectedEvent && !showDonationModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
              >
                <motion.div
                  className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative h-64">
                    <img 
                      src={selectedEvent.images?.[0]?.url || 'https://images.pexels.com/photos/7945776/pexels-photo-7945776.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover rounded-t-3xl"
                    />
                    <button
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center"
                      onClick={() => setSelectedEvent(null)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {selectedEvent.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(selectedEvent.eventDate)}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold font-display text-gray-800 mb-4">
                      {selectedEvent.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Progress: {formatAmount(selectedEvent.raisedAmount)} of {formatAmount(selectedEvent.targetAmount)}</span>
                        <span>{Math.round(calculateProgress(selectedEvent.raisedAmount, selectedEvent.targetAmount))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all"
                          style={{ width: `${calculateProgress(selectedEvent.raisedAmount, selectedEvent.targetAmount)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {selectedEvent.donationCount} supporters
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedEvent.location}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                      onClick={() => {
                        setShowDonationModal(true);
                      }}
                    >
                      Support This Event
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button
                  className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center z-10"
                  onClick={() => {
                    setShowDonationModal(false);
                    setSelectedEvent(null);
                  }}
                >
                  ✕
                </button>
                <Donation selectedEvent={selectedEvent} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Events;