import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, Banknote, Shield, CheckCircle, User, Mail, Phone, IndianRupee } from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import toast from 'react-hot-toast';
import type { DonationFormData, Event } from '../types/components';

interface DonationProps {
  selectedEvent?: Event | null;
}

const Donation: React.FC<DonationProps> = ({ selectedEvent = null }) => {
  const { processPayment, loading } = useDonation();
  
  const [formData, setFormData] = useState<DonationFormData>({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    donationType: selectedEvent ? 'event' : 'general',
    eventId: selectedEvent?._id || '',
    isAnonymous: false
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const predefinedAmounts = [501, 1001, 2101, 5001, 11000, 21000];

  const donationTypes = [
    { value: 'general', label: 'General Donation', description: 'Support overall temple activities' },
    { value: 'event', label: 'Event Sponsorship', description: 'Support specific events and festivals' },
    { value: 'seva', label: 'Seva Programs', description: 'Community service and food distribution' },
    { value: 'infrastructure', label: 'Infrastructure', description: 'Temple development and maintenance' }
  ];

  const paymentMethods = [
    { icon: CreditCard, name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay' },
    { icon: Smartphone, name: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
    { icon: Banknote, name: 'Net Banking', description: 'All major banks supported' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await processPayment({
        ...formData,
        amount: parseInt(formData.amount)
      });
      
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          donorName: '',
          email: '',
          phone: '',
          amount: '',
          donationType: selectedEvent ? 'event' : 'general',
          eventId: selectedEvent?._id || '',
          isAnonymous: false
        });
      }, 3000);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const isFormValid = formData.donorName && formData.email && formData.phone && formData.amount && parseInt(formData.amount) >= 1;

  // Auto-fill event data if selectedEvent is provided
  React.useEffect(() => {
    if (selectedEvent) {
      setFormData(prev => ({
        ...prev,
        donationType: 'event',
        eventId: selectedEvent._id
      }));
    }
  }, [selectedEvent]);

  return (
    <section id="donation" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
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
            {selectedEvent ? `Donate to ${selectedEvent.title}` : 'Make a Donation'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {selectedEvent 
              ? `Support ${selectedEvent.title} and help us reach our goal of ₹${selectedEvent.targetAmount.toLocaleString('en-IN')}.`
              : 'Your generous contribution helps us serve the community, organize festivals, and maintain our sacred temple for future generations.'
            }
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Show selected event info */}
                  {selectedEvent && (
                    <div className="bg-primary/10 rounded-xl p-4 mb-6">
                      <h3 className="font-bold text-primary mb-2">Donating to:</h3>
                      <p className="text-gray-700">{selectedEvent.title}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        Target: ₹{selectedEvent.targetAmount.toLocaleString('en-IN')} | 
                        Raised: ₹{selectedEvent.raisedAmount.toLocaleString('en-IN')} | 
                        Progress: {Math.round((selectedEvent.raisedAmount / selectedEvent.targetAmount) * 100)}%
                      </div>
                    </div>
                  )}

                  {/* Donation Type - only show if no event selected */}
                  {!selectedEvent && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Donation Purpose
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {donationTypes.map((type) => (
                          <motion.div
                            key={type.value}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                              formData.donationType === type.value
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData(prev => ({ ...prev, donationType: type.value }))}
                          >
                            <input
                              type="radio"
                              name="donationType"
                              value={type.value}
                              checked={formData.donationType === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="text-sm font-semibold text-gray-800 mb-1">
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {type.description}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Donation Amount
                    </label>
                    
                    {/* Predefined Amounts */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <motion.button
                          key={amount}
                          type="button"
                          className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                            formData.amount === amount.toString()
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ₹{amount.toLocaleString('en-IN')}
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <IndianRupee className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter custom amount"
                        min="1"
                        max="500000"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="donorName"
                          value={formData.donorName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          pattern="[6-9]\d{9}"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Anonymous Donation */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary"
                    />
                    <label className="text-gray-700">
                      Make this donation anonymous (your name won't be displayed publicly)
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all ${
                      isFormValid && !loading
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={isFormValid && !loading ? { y: -2 } : {}}
                    whileTap={isFormValid && !loading ? { y: 0 } : {}}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Donate ₹${formData.amount ? parseInt(formData.amount).toLocaleString('en-IN') : '0'}`
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar Information */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-primary" />
                  Payment Methods
                </h3>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <method.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Secure & Safe
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>256-bit SSL encryption for all transactions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>PCI DSS compliant payment processing</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Instant email receipt and tax exemption certificate</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>24/7 customer support for donations</span>
                  </div>
                </div>
              </div>

              {/* Impact Statement */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-primary" fill="currentColor" />
                  Your Impact
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>₹501</strong> - Provides prasadam for 25 devotees
                  </div>
                  <div>
                    <strong>₹1,001</strong> - Sponsors daily temple maintenance
                  </div>
                  <div>
                    <strong>₹5,001</strong> - Supports community seva programs
                  </div>
                  <div>
                    <strong>₹11,000</strong> - Funds festival celebrations
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
                Thank You for Your Donation!
              </h3>
              <p className="text-gray-600 mb-6">
                Your generous contribution of ₹{parseInt(formData.amount || '0').toLocaleString('en-IN')} has been received. 
                You will receive a confirmation email shortly.
              </p>
              <p className="text-sm text-gray-500">
                May Thakur Ji bless you and your family with happiness and prosperity.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Donation;