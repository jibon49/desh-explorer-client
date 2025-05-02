import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentSuccess = () => {
  const { tran_id } = useParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/payment/verify', { tran_id });
        
        if (response.data.success) {
          Swal.fire({
            title: 'Payment Successful!',
            text: 'Your tour has been booked successfully',
            icon: 'success',
            confirmButtonText: 'View Booking'
          }).then(() => {
            window.location.href = '/my-bookings';
          });
        } else {
          Swal.fire('Error', 'Payment verification failed', 'error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        Swal.fire('Error', 'Failed to verify payment', 'error');
      }
    };

    verifyPayment();
  }, [tran_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we verify your payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;