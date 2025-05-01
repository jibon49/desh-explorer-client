import React, { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaCheck, FaClock, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaUsers, FaMoneyBillWave, FaComment, FaSave } from 'react-icons/fa';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/booking.json')
            .then((response) => response.json())
            .then((data) => {
                setBookings(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching booking data:', error);
                setLoading(false);
            });
    }, []);

    const updateBookingStatus = (bookingId, newStatus) => {
        setBookings(bookings.map(booking => 
            booking.transactionId === bookingId 
                ? { ...booking, status: newStatus } 
                : booking
        ));
    };

    

    const getStatusBadge = (status) => {
        switch(status.toLowerCase()) {
            case 'confirmed':
                return <span className="badge badge-success gap-2"><FaCheck /> Confirmed</span>;
            case 'pending':
                return <span className="badge badge-warning gap-2"><FaClock /> Pending</span>;
            case 'cancelled':
                return <span className="badge badge-error gap-2"><FaTimes /> Cancelled</span>;
            default:
                return <span className="badge badge-info gap-2">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p>Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <FaCalendarAlt className="text-xl" />
                        Booking Management
                    </h2>
                    <p className="text-blue-100 mt-1">View and manage all tour bookings</p>
                </div>

                {/* Booking Table */}
                <div className="overflow-x-auto p-4">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="font-semibold text-gray-700">Transaction ID</th>
                                <th className="font-semibold text-gray-700">Tour</th>
                                <th className="font-semibold text-gray-700">Customer</th>
                                <th className="font-semibold text-gray-700">Travel Date</th>
                                <th className="font-semibold text-gray-700">Status</th>
                                <th className="font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.transactionId} className="hover:bg-gray-50">
                                        <td className="font-medium text-gray-800">{booking.transactionId}</td>
                                        <td className="text-gray-600">{booking.tourTitle}</td>
                                        <td className="text-gray-600">
                                            {booking.customer.firstName} {booking.customer.lastName}
                                        </td>
                                        <td className="text-gray-600">{booking.travelDate}</td>
                                        <td>
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="btn btn-sm btn-outline btn-primary gap-2"
                                                >
                                                    <FaEye /> Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>
                            Showing <span className="font-medium">{bookings.length}</span> bookings
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FaCalendarAlt />
                                Booking Details
                            </h3>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="btn btn-circle btn-sm"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Tour Image */}
                            <img
                                src={selectedBooking.tourImage}
                                alt={selectedBooking.tourTitle}
                                className="w-full h-48 object-cover rounded-lg mb-6"
                            />
                            
                            {/* Booking Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaCalendarAlt /> Booking Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Transaction ID:</span> {selectedBooking.transactionId}</p>
                                            <p><span className="font-medium">Tour:</span> {selectedBooking.tourTitle}</p>
                                            <p><span className="font-medium">Travel Date:</span> {selectedBooking.travelDate}</p>
                                            <p><span className="font-medium">Booking Date:</span> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium">Status:</span> 
                                                {getStatusBadge(selectedBooking.status)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUser /> Customer Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}</p>
                                            <p className="flex items-center gap-2"><FaEnvelope /> <span className="font-medium">Email:</span> {selectedBooking.customer.email}</p>
                                            <p className="flex items-center gap-2"><FaPhone /> <span className="font-medium">Phone:</span> {selectedBooking.customer.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUsers /> Travel Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Number of Travelers:</span> {selectedBooking.numberOfTravelers}</p>
                                            <p className="flex items-center gap-2"><FaMoneyBillWave /> <span className="font-medium">Price per Person:</span> ${selectedBooking.pricePerPerson}</p>
                                            <p className="flex items-center gap-2"><FaMoneyBillWave /> <span className="font-medium">Total Price:</span> ${selectedBooking.totalPrice}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedBooking.specialRequests && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaComment /> Special Requests
                                            </h4>
                                            <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                                {selectedBooking.specialRequests}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>                           
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;