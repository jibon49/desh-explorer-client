import React, { useState, useEffect } from "react";
import { FaPlane, FaHotel, FaCar, FaEye, FaTrash, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";

const CustomTourBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from MongoDB
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load bookings',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }

        setBookings(bookings.filter((booking) => booking._id !== id));
        Swal.fire(
          'Deleted!',
          'Your booking has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting booking:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete booking',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          Travel Bookings
        </h2>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Journey
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Dates
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUsers className="mr-2" />
                      Guests
                    </div>
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
                            <FaPlane className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.fromLocation} → {booking.toLocation}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.transport?.type} • {booking.transport?.provider}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.travelDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {formatDate(booking.returnDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}
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
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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
                {/* Travel Information */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaPlane className="mr-2 text-blue-600" />
                    Travel Information
                  </h4>
                  <div className="space-y-2">
                    <p><strong>From:</strong> {selectedBooking.fromLocation}</p>
                    <p><strong>To:</strong> {selectedBooking.toLocation}</p>
                    <p><strong>Travel Date:</strong> {formatDate(selectedBooking.travelDate)}</p>
                    <p><strong>Return Date:</strong> {formatDate(selectedBooking.returnDate)}</p>
                    <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                  </div>
                </div>

                {/* Transportation */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaPlane className="mr-2 text-green-600" />
                    Transportation
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {selectedBooking.transport?.type}</p>
                    <p><strong>Provider:</strong> {selectedBooking.transport?.provider}</p>
                    <p><strong>Class:</strong> {selectedBooking.transport?.class}</p>
                    <p><strong>Cost:</strong> ${selectedBooking.transport?.cost}</p>
                  </div>
                </div>

                {/* Accommodation */}
                <div className="bg-purple-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaHotel className="mr-2 text-purple-600" />
                    Accommodation
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Hotel:</strong> {selectedBooking.accommodation?.name}</p>
                    <p><strong>Rate:</strong> ${selectedBooking.accommodation?.rate}/night</p>
                    <p><strong>Rooms:</strong> {selectedBooking.accommodation?.rooms}</p>
                  </div>
                </div>

                {/* Vehicle Rental */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FaCar className="mr-2 text-yellow-600" />
                    Vehicle Rental
                  </h4>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {selectedBooking.rental?.vehicleType}</p>
                    <p><strong>Seats:</strong> {selectedBooking.rental?.seats}</p>
                    <p><strong>Cost:</strong> ${selectedBooking.rental?.cost}</p>
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