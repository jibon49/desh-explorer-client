import React, { useState, useEffect } from "react";
import { FaPlane, FaHotel, FaCar, FaEye, FaTrash, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaUserCircle, FaReceipt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [tourDetails, setTourDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch payments from MongoDB
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosSecure.get('/payments');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load payment history',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#1f2937',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [axiosSecure]);

  // Fetch tour details when payment is selected
  const fetchTourDetails = async (tourId) => {
    try {
      const response = await axiosSecure.get(`/tourDetails/${tourId}`);
      setTourDetails(response.data);
    } catch (error) {
      console.error('Error fetching tour details:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to load tour details',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#fff',
        color: '#1f2937',
      });
    }
  };

  const handleViewDetails = async (payment) => {
    setSelectedPayment(payment);
    await fetchTourDetails(payment.tourId);
    setIsModalOpen(true);
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <FaReceipt className="mr-3 text-blue-600 text-4xl" />
            Payment History
          </h2>
          <p className="text-gray-600">View all payment transactions and details</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                      className="transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <FaReceipt className="text-blue-500 mr-2" />
                          {payment.transactionId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ID: {payment.tourId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {payment.userName?.charAt(0) || <FaUserCircle className="text-blue-500" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.userName || 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(payment.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(payment)}
                            className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-1 rounded-lg bg-blue-50"
                          >
                            <FaEye className="mr-1" /> Details
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaReceipt className="text-4xl mb-4 text-gray-300" />
                        <p className="text-lg">No payment records found</p>
                        <p className="text-sm">Payments will appear here after successful transactions</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && tourDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xl z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaReceipt className="mr-3 text-blue-600" />
                    Payment & Tour Details
                  </h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-blue-50 p-5 rounded-lg border border-blue-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaMoneyBillWave className="mr-2 text-blue-600" />
                      Payment Information
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
                      <p><strong>Date:</strong> {formatDate(selectedPayment.date)}</p>
                      <p><strong>Amount:</strong> {formatPrice(selectedPayment.price)}</p>
                      <p><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs 
                          ${selectedPayment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            selectedPayment.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {selectedPayment.status?.charAt(0).toUpperCase() + selectedPayment.status?.slice(1)}
                        </span>
                      </p>
                    </div>
                  </motion.div>

                  {/* Customer Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-green-50 p-5 rounded-lg border border-green-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaUsers className="mr-2 text-green-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Name:</strong> {selectedPayment.userName || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedPayment.userEmail || 'N/A'}</p>
                    </div>
                  </motion.div>

                  {/* Tour Overview */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-purple-50 p-5 rounded-lg border border-purple-100 md:col-span-2"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaPlane className="mr-2 text-purple-600" />
                      Tour Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                      <div>
                        <p><strong>Tour Name:</strong> {tourDetails.title}</p>
                        <p><strong>Location:</strong> {tourDetails.location}</p>
                      </div>
                      <div>
                        <p><strong>Duration:</strong> {tourDetails.duration}</p>
                        <p><strong>Date:</strong> {formatDate(tourDetails.date)}</p>
                      </div>
                      <div>
                        <p><strong>Tour ID:</strong> {selectedPayment.tourId}</p>
                        <button 
                          onClick={() => navigate(`/tourDetails/${selectedPayment.tourId}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Full Tour Details →
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tour Highlights */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-yellow-50 p-5 rounded-lg border border-yellow-100 md:col-span-2"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaCalendarAlt className="mr-2 text-yellow-600" />
                      Tour Highlights
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Description:</strong> {tourDetails.description}</p>
                      <div className="mt-2">
                        <strong>Included:</strong>
                        <ul className="list-disc pl-5 mt-1">
                          {tourDetails.inclusion?.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingList;