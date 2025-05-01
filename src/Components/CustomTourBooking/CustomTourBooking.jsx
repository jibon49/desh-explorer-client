import React, { useState, useEffect } from "react";
import { FaPlane, FaHotel, FaCar, FaEye, FaTrash, FaCalendarAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CustomTourBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
          confirmButtonText: 'OK'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [axiosSecure]);

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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/custom-bookings/${id}`);
        setBookings(bookings.filter((booking) => booking._id !== id));
        Swal.fire(
          'Deleted!',
          'Booking has been deleted successfully.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete booking',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
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
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Custom Tour Bookings
        </h2>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaPlane className="mr-2" />
                      Journey
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Dates
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-2" />
                      Total
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {booking.creatorName?.charAt(0) || 'U'}
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
                        <div className="text-sm font-medium text-gray-900">
                          {booking.fromLocation} → {booking.toLocation}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.transport?.type} • {booking.transport?.provider}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.travelDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.duration} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(booking.totalPrice)}
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
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-3 text-blue-600" />
                  Booking Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaUsers className="mr-2 text-blue-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedBooking.creatorName}</p>
                    <p><strong>Email:</strong> {selectedBooking.creatorEmail}</p>
                    <p><strong>Booking Date:</strong> {formatDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>

                {/* Travel Information */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaPlane className="mr-2 text-green-600" />
                    Travel Information
                  </h4>
                  <div className="space-y-2">
                    <p><strong>From:</strong> {selectedBooking.fromLocation}</p>
                    <p><strong>To:</strong> {selectedBooking.toLocation}</p>
                    <p><strong>Departure:</strong> {formatDate(selectedBooking.travelDate)}</p>
                    <p><strong>Return:</strong> {formatDate(selectedBooking.returnDate)}</p>
                    <p><strong>Duration:</strong> {selectedBooking.duration} days</p>
                  </div>
                </div>

                {/* Transport Details */}
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaPlane className="mr-2 text-purple-600" />
                    Transport Details
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {selectedBooking.transport?.type}</p>
                    <p><strong>Provider:</strong> {selectedBooking.transport?.provider}</p>
                    <p><strong>Class:</strong> {selectedBooking.transport?.class}</p>
                    <p><strong>Guests:</strong> {selectedBooking.transport?.guests}</p>
                    <p><strong>Price:</strong> {formatPrice(selectedBooking.transport?.price)}</p>
                  </div>
                </div>

                {/* Accommodation Details */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaHotel className="mr-2 text-yellow-600" />
                    Accommodation Details
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Hotel:</strong> {selectedBooking.hotel?.name}</p>
                    <p><strong>Rooms:</strong> {selectedBooking.hotel?.rooms}</p>
                    <p><strong>Price per night:</strong> {formatPrice(selectedBooking.hotel?.price)}</p>
                    <p><strong>Total:</strong> {formatPrice(selectedBooking.hotel?.total)}</p>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="bg-red-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaCar className="mr-2 text-red-600" />
                    Vehicle Rental
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {selectedBooking.rental?.type}</p>
                    <p><strong>Seats:</strong> {selectedBooking.rental?.seats}</p>
                    <p><strong>Price:</strong> {formatPrice(selectedBooking.rental?.price)}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-indigo-50 p-5 rounded-lg md:col-span-2">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-indigo-600" />
                    Booking Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p><strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs 
                          ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
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
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTourBooking;