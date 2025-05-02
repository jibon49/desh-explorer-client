import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const PaymentFailure = () => {
  const { tran_id } = useParams();

  useEffect(() => {
    Swal.fire({
      title: 'Payment Failed',
      text: 'Your payment could not be processed. Please try again.',
      icon: 'error',
      confirmButtonText: 'Try Again'
    }).then(() => {
      window.location.href = '/tours';
    });
  }, [tran_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600">Transaction ID: {tran_id}</p>
      </div>
    </div>
  );
};

export default PaymentFailure;