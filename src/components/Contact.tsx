import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [
        'Shree Thakur Ji Seva Sang',
        'Main Temple Complex',
        'Temple Road, Sacred City',
        'PIN: 123456'
      ]
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+91 98765 43210',
        '+91 98765 43211',
        'WhatsApp: +91 98765 43210'
      ]
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'contact@shreethakurjiseva.com',
        'donations@shreethakurjiseva.com',
        'events@shreethakurjiseva.com'
      ]
    },
    {
      icon: Clock,
      title: 'Temple Timings',
      details: [
        'Morning: 5:00 AM - 12:00 PM',
        'Evening: 4:00 PM - 9:00 PM',
        'Aarti: 6:00 AM, 12:00 PM, 7:00 PM'
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-warm-50">
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
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to help and answer any questions you might have. 
            Connect with us to learn more about our activities and how you can participate.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div 
              className="lg:col-span-1 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="donation">Donation Inquiry</option>
                        <option value="events">Event Information</option>
                        <option value="volunteer">Volunteer Opportunities</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all ${
                      isFormValid && !isSubmitting
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={isFormValid && !isSubmitting ? { y: -2 } : {}}
                    whileTap={isFormValid && !isSubmitting ? { y: 0 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Find Us Here
                </h3>
                <p className="text-gray-600 mb-6">
                  Visit our beautiful temple complex and experience the divine atmosphere
                </p>
              </div>
              
              {/* Placeholder Map */}
              <div className="h-96 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Interactive Map
                  </h4>
                  <p className="text-gray-600">
                    Embedded Google Maps would appear here in production
                  </p>
                  <button className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-all">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for reaching out to us. We'll get back to you within 24 hours.
              </p>
              <p className="text-sm text-gray-500">
                May Thakur Ji bless you with peace and happiness.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Contact;