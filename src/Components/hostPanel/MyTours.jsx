import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaTimes,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaTrash,
  FaEdit,
  FaUserFriends,
  FaFileExport,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import useMongoUser from "../../hooks/userMongoUser";

const MyTours = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { mongoUser } = useMongoUser();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        if (!mongoUser?.userMail) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/group-tours/user/${mongoUser.userMail}`
        );

        if (response.data && Array.isArray(response.data)) {
          setTours(response.data);
        } else {
          setTours([]);
        }
      } catch (err) {
        console.error("Failed to fetch group tours:", err);
        setError("Failed to load tours. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [mongoUser?.userMail]);

  const deleteTour = async (tourId) => {
    try {
      await axios.delete(`http://localhost:5000/group-tours/${tourId}`);
      setTours((prev) => prev.filter((tour) => tour._id !== tourId));
      setSelectedTour(null);
    } catch (err) {
      console.error("Failed to delete tour:", err);
      setError("Failed to delete tour. Please try again.");
    }
  };

  const fetchBookings = async (tourId) => {
    setLoadingBookings(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/payments/tour/${tourId}`
      );
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleViewTour = async (tour) => {
    setSelectedTour(tour);
    await fetchBookings(tour._id);
  };

  const exportBookings = () => {
    const csvContent = [
      ["Email", "Amount", "Status", "Booking Date"],
      ...bookings.map((booking) => [
        booking.customer_email,
        `$${booking.amount}`,
        booking.status,
        new Date(booking.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedTour.title}_bookings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.customer_email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <span className="badge badge-success gap-2">
            <FaCheck /> Active
          </span>
        );
      case "completed":
        return (
          <span className="badge badge-info gap-2">
            <FaCheck /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="badge badge-error gap-2">
            <FaTimes /> Cancelled
          </span>
        );
      default:
        return (
          <span className="badge badge-warning gap-2">
            <FaClock /> Upcoming
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p>Loading your group tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
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
            <FaUsers className="text-xl" />
            My Organized Group Tours
          </h2>
          <p className="text-blue-100 mt-1">
            {tours.length} {tours.length === 1 ? "tour" : "tours"} created by
            you
          </p>
        </div>

        {/* Tours Table */}
        <div className="overflow-x-auto p-4">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th>Tour Title</th>
                <th>Route</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Slots</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-gray-50">
                    <td className="font-medium">{tour.title}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-xs text-blue-500" />
                        {tour.from} → {tour.to}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span>{formatDate(tour.departureDate)}</span>
                        <span className="text-xs text-gray-400">
                          to {formatDate(tour.returnDate)}
                        </span>
                      </div>
                    </td>
                    <td>${tour.price}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-blue-500" />
                        {tour.availableSlots}
                      </div>
                    </td>
                    <td>{getStatusBadge(tour.status)}</td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewTour(tour)}
                          className="btn btn-sm btn-outline btn-primary gap-1"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => deleteTour(tour._id)}
                          className="btn btn-sm btn-outline btn-error gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    You haven't created any group tours yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tour Details Modal */}
      {selectedTour && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaCalendarAlt />
                Tour Details: {selectedTour.title}
              </h3>
              <button
                onClick={() => {
                  setSelectedTour(null);
                  setBookings([]);
                  setSearchTerm("");
                }}
                className="btn btn-circle btn-sm"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              {/* Tour Image */}
              <div className="relative">
                <img
                  src={selectedTour.images[0]}
                  alt={selectedTour.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span>{selectedTour.rating || "New"}</span>
                </div>
              </div>

              {/* Tour Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt /> Tour Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Title:</span>{" "}
                        {selectedTour.title}
                      </p>
                      <p>
                        <span className="font-medium">Route:</span>
                        <span className="flex items-center gap-1 ml-1">
                          <FaMapMarkerAlt className="text-xs text-blue-500" />
                          {selectedTour.from} → {selectedTour.to}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Organizer:</span>{" "}
                        {selectedTour.organizer}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span> $
                        {selectedTour.price}
                      </p>
                      <p>
                        <span className="font-medium">Available Slots:</span>{" "}
                        {selectedTour.availableSlots}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser /> Organizer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedTour.createdBy?.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaEnvelope />
                        <span className="font-medium">Email:</span>{" "}
                        {selectedTour.createdBy?.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhone />
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedTour.createdBy?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt /> Schedule
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Departure:</span>{" "}
                        {formatDate(selectedTour.departureDate)}
                      </p>
                      <p>
                        <span className="font-medium">Return:</span>{" "}
                        {formatDate(selectedTour.returnDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        {getStatusBadge(selectedTour.status)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Tour Details
                    </h4>
                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedTour.details}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings Section */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <FaUserFriends /> Bookings ({bookings.length})
                  </h4>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="input input-bordered input-sm pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                    <button
                      onClick={exportBookings}
                      className="btn btn-sm btn-outline gap-2"
                    >
                      <FaFileExport /> Export
                    </button>
                  </div>
                </div>

                {loadingBookings ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner text-primary"></span>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th>Customer Email</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Booking Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="font-medium">
                              {booking.userEmail}
                            </td>
                            <td>${booking.price}</td>
                            <td>
                              <span
                                className={`badge ${
                                  booking.status === "paid"
                                    ? "badge-success"
                                    : booking.status === "initiated"
                                    ? "badge-warning"
                                    : "badge-error"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td>{formatDate(booking.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <span>
                      No bookings found{" "}
                      {searchTerm ? "matching your search" : "for this tour"}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  className="btn btn-outline btn-error gap-2"
                  onClick={() => {
                    deleteTour(selectedTour._id);
                    setSelectedTour(null);
                  }}
                >
                  <FaTrash /> Delete Tour
                </button>
                <button className="btn btn-primary gap-2">
                  <FaEdit /> Edit Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTours;
