import { useState } from 'react';
import { donationsAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useDonation = () => {
  const [loading, setLoading] = useState(false);

  const createDonation = async (donationData) => {
    try {
      setLoading(true);
      
      // Create donation record
      const donationResponse = await donationsAPI.create(donationData);
      const donation = donationResponse.data.data;

      // Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder(donation._id);
      const orderData = orderResponse.data.data;

      return {
        donation,
        orderData
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create donation';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await paymentsAPI.verify(paymentData);
      toast.success('Payment successful! Thank you for your donation.');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
      throw error;
    }
  };

  const processPayment = async (donationData) => {
    try {
      const { donation, orderData } = await createDonation(donationData);

      return new Promise((resolve, reject) => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Shree Thakur Ji Seva Sang',
          description: 'Temple Donation',
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId: donation._id
              };
              
              const verifiedDonation = await verifyPayment(verificationData);
              resolve(verifiedDonation);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: donationData.donorName,
            email: donationData.email,
            contact: donationData.phone
          },
          theme: {
            color: '#FF6B35'
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          reject(new Error('Razorpay not loaded'));
        }
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    createDonation,
    verifyPayment,
    processPayment
  };
};