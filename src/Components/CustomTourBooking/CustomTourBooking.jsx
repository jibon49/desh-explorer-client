import React, { useState, useEffect } from "react";
import { FaPlane, FaHotel, FaCar, FaEye, FaTrash, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CustomTourBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // new state for booking status update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch bookings from MongoDB
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosSecure.get('/api/custom-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load bookings',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#1f2937',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [axiosSecure]);

  // Set newStatus when booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setNewStatus(selectedBooking.status);
    }
  }, [selectedBooking]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      color: '#1f2937',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/custom-bookings/${id}`);
        setBookings(bookings.filter((booking) => booking._id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Booking has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#1f2937',
        });
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete booking',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#fff',
          color: '#1f2937',
        });
      }
    }
  };

  const handleChangeStatus = async () => {
    try {
      await axiosSecure.put(`/api/custom-bookings/${selectedBooking._id}/status`, { status: newStatus });
      Swal.fire({
        title: 'Success!',
        text: 'Booking status updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#fff',
        color: '#1f2937',
      });
      setSelectedBooking({ ...selectedBooking, status: newStatus });
      setBookings(bookings.map(b => b._id === selectedBooking._id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update status',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#fff',
        color: '#1f2937',
      });
    }
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
            <FaCalendarAlt className="mr-3 text-blue-600 text-4xl" />
            Custom Tour Bookings
          </h2>
          <p className="text-gray-600">Manage all your custom tour bookings in one place</p>
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
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Journey
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
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
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                      className="transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {booking.creatorName?.charAt(0) || <FaUserCircle className="text-blue-500" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.creatorName || 'Unknown Customer'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.creatorEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaPlane className="text-blue-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.fromLocation} → {booking.toLocation}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.transport?.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {formatDate(booking.travelDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.duration} days
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="text-green-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(booking.totalPrice)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(booking)}
                            className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-1 rounded-lg bg-blue-50"
                          >
                            <FaEye className="mr-1" /> View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-800 flex items-center px-3 py-1 rounded-lg bg-red-50"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaCalendarAlt className="text-4xl mb-4 text-gray-300" />
                        <p className="text-lg">No bookings found</p>
                        <p className="text-sm">Create your first custom tour booking</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
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
                    <FaCalendarAlt className="mr-3 text-blue-600" />
                    Booking Details
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
                  {/* Customer Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-blue-50 p-5 rounded-lg border border-blue-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaUsers className="mr-2 text-blue-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Name:</strong> {selectedBooking.creatorName || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedBooking.creatorEmail || 'N/A'}</p>
                      <p><strong>Booking Date:</strong> {formatDate(selectedBooking.createdAt)}</p>
                      <p><strong>Phone Number:</strong>{selectedBooking.creatorPhone || 'N/A'}</p>
                    </div>
                  </motion.div>

                  {/* Travel Information */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-green-50 p-5 rounded-lg border border-green-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaPlane className="mr-2 text-green-600" />
                      Travel Information
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>From:</strong> {selectedBooking.fromLocation || 'N/A'}</p>
                      <p><strong>To:</strong> {selectedBooking.toLocation || 'N/A'}</p>
                      <p><strong>Departure:</strong> {formatDate(selectedBooking.travelDate)}</p>
                      <p><strong>Return:</strong> {formatDate(selectedBooking.returnDate)}</p>
                      <p><strong>Duration:</strong> {selectedBooking.duration || '0'} days</p>
                    </div>
                  </motion.div>

                  {/* Transport Details */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-purple-50 p-5 rounded-lg border border-purple-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaPlane className="mr-2 text-purple-600" />
                      Transport Details
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Type:</strong> {selectedBooking.transport?.type || 'N/A'}</p>
                      <p><strong>Provider:</strong> {selectedBooking.transport?.provider || 'N/A'}</p>
                      <p><strong>Class:</strong> {selectedBooking.transport?.class || 'N/A'}</p>
                      <p><strong>Guests:</strong> {selectedBooking.transport?.guests || '0'}</p>
                      <p><strong>Price:</strong> {formatPrice(selectedBooking.transport?.price)}</p>
                    </div>
                  </motion.div>

                  {/* Accommodation Details */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-yellow-50 p-5 rounded-lg border border-yellow-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaHotel className="mr-2 text-yellow-600" />
                      Accommodation Details
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Hotel:</strong> {selectedBooking.hotel?.name || 'N/A'}</p>
                      <p><strong>Rooms:</strong> {selectedBooking.hotel?.rooms || '0'}</p>
                      <p><strong>Price per night:</strong> {formatPrice(selectedBooking.hotel?.price)}</p>
                      <p><strong>Total:</strong> {formatPrice(selectedBooking.hotel?.total)}</p>
                    </div>
                  </motion.div>

                  {/* Vehicle Rental */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-red-50 p-5 rounded-lg border border-red-100"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaCar className="mr-2 text-red-600" />
                      Vehicle Rental
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Type:</strong> {selectedBooking.rental?.type || 'N/A'}</p>
                      <p><strong>Seats:</strong> {selectedBooking.rental?.seats || '0'}</p>
                      <p><strong>Price:</strong> {formatPrice(selectedBooking.rental?.price)}</p>
                    </div>
                  </motion.div>

                  {/* Booking Summary */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-indigo-50 p-5 rounded-lg border border-indigo-100 md:col-span-2"
                  >
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaMoneyBillWave className="mr-2 text-indigo-600" />
                      Booking Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                      <div>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs 
                            ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p><strong>Total Price:</strong> {formatPrice(selectedBooking.totalPrice)}</p>
                      </div>
                      <div>
                        <p><strong>Booking ID:</strong> {selectedBooking._id}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Status Change Section */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-bold mb-2">Change Booking Status</h4>
                  <div className="flex items-center space-x-4">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="p-2 border border-gray-300 rounded"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="canceled">Canceled</option>
                      <option value="hold">Hold</option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChangeStatus}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      Update Status
                    </motion.button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
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

export default CustomTourBooking;