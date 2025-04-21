import React, { useEffect, useState } from "react";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";
import { FormControl, MenuItem, Select } from "@mui/material";
import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiImage,
  FiZap,
  FiAlertTriangle,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";

import {
  FaStar,
  FaMapMarkerAlt,
  FaUserAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserAltSlash,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import useMongoUser from "../../hooks/userMongoUser";

const GroupTour = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mongoUser, load, error } = useMongoUser();
  const [person, setPerson] = useState(1);

  const itemsPerPage = 3;
  const locations = Array.from(new Set(tourPackages.map((tour) => tour.from)));
  const filteredPackages = fromLocation
    ? tourPackages.filter((tour) => tour.from === fromLocation)
    : tourPackages;

  const handleLocationChange = (e) => {
    setFromLocation(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPackages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/group-tours")
      .then((res) => {
        setTourPackages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch group tours:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10">
        <span class="loading loading-spinner text-info"></span>
      </p>
    );
  console.log(mongoUser);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBookTour = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/group-tours/${selectedTour._id}/book`,
        {
          slots: parseInt(person),
        }
      );

      if (res.data.modifiedCount > 0) {
        alert("Booking confirmed!");
        setSelectedTour({
          ...selectedTour,
          availableSlots: selectedTour.availableSlots - person,
        });
      }
    } catch (err) {
      alert("Booking failed.");
      console.error(err);
    }
  };

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Group Tour Packages"
        text="Explore unforgettable group tours with full flexibility and fun."
      />

      <div className="my-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl text-gray-800 mb-2">
            Group Tour Packages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing group adventures with expert guides and
            unforgettable experiences
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm mb-12">
          <div className="max-w-2xl mx-auto">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
              Filter by departure location
            </label>
            <FormControl fullWidth>
              <Select
                value={fromLocation}
                onChange={handleLocationChange}
                displayEmpty
                className="bg-white rounded-lg"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                  },
                }}
              >
                <MenuItem value="">
                  <em className="text-gray-500">All Locations</em>
                </MenuItem>
                {locations.map((location, index) => (
                  <MenuItem
                    key={index}
                    value={location}
                    className="hover:bg-blue-50"
                  >
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8">
          {paginatedData.map((tour, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative">
                <img
                  src={tour.profileImage}
                  alt={tour.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="font-semibold text-gray-800">
                      {tour.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {tour.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-500" />
                      {formatDate(tour.departureDate)} →{" "}
                      {formatDate(tour.returnDate)}
                    </p>

                    {new Date(tour.departureDate) < new Date() && (
                      <p className="text-xs text-red-600 mt-1 font-semibold">
                        Departure date has passed
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ৳ {tour.price}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUserAlt className="mr-1" />
                    <span>{tour.organizer}</span>
                  </div>
                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="btn btn-primary btn-sm rounded-full px-6"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-outline"
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`join-item btn ${
                    currentPage === i + 1 ? "btn-active" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="join-item btn btn-outline"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTour && (
        <input
          type="checkbox"
          id="quote-modal"
          className="modal-toggle"
          checked
          readOnly
        />
      )}
      <div className={`modal ${selectedTour ? "modal-open" : ""}`}>
        <div className="modal-box relative w-full max-w-5xl overflow-y-auto max-h-[90vh] p-0">
          <label
            htmlFor="quote-modal"
            className="btn btn-sm btn-circle absolute right-4 top-4 z-10"
            onClick={() => setSelectedTour(null)}
          >
            ✕
          </label>

          {selectedTour && (
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Images */}
              <div className="lg:w-2/5 bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-xl shadow-inner">
                <div className="sticky top-6 space-y-8">
                  {/* Organizer Profile */}
                  <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative mx-auto w-32 h-32">
                      <img
                        src={
                          selectedTour.createdBy.photo ||
                          "https://via.placeholder.com/150"
                        }
                        className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
                        alt="Organizer"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        Organizer{" "}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-row gap-2 justify-center items-center text-center">
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedTour.createdBy.name}
                      </h3>
                      {selectedTour.role == "admin" ||
                        ("host" && (
                          <HiCheckBadge className="text-blue-500 text-lg" />
                        ))}
                    </div>

                    <div className="flex justify-center mt-2 space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          className={`text-${
                            i < selectedTour.rating ? "yellow-400" : "gray-300"
                          } text-lg`}
                        />
                      ))}
                      <span className="text-gray-500 ml-1 text-sm">
                        ({selectedTour.rating})
                      </span>
                    </div>

                    {/* Organizer Contact Info */}
                    <div className="mt-4 space-y-2 text-left bg-blue-50 p-4 rounded-lg">
                      {/* <div className="flex items-center text-gray-700">
                        <FiMail className="text-blue-500 mr-2" />
                        <span className="truncate">
                          {selectedTour.createdBy.email}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiPhone className="text-blue-500 mr-2" />
                        <span>
                          {selectedTour.createdBy.phone || "Not provided"}
                        </span>
                      </div> */}
                      <button className="mt-3 w-full bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                        <FiMessageSquare className="mr-2" />
                        Contact Organizer
                      </button>
                    </div>
                  </div>

                  {/* Tour Gallery */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                      <FiImage className="text-blue-500 mr-2" />
                      Tour Gallery
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTour.images?.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group overflow-hidden rounded-lg aspect-square"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt={`Tour preview ${idx + 1}`}
                          />
                          {idx === 3 && selectedTour.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                              +{selectedTour.images.length - 4} more
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-64 rounded overflow-hidden">
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        selectedTour.map
                      )}&output=embed`}
                    ></iframe>
                  </div>

                  {/* Tour Highlights */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                      <FiZap className="text-blue-500 mr-2" />
                      Tour Highlights
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start p-3 bg-blue-50 rounded-lg">
                        <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-gray-800">Route</h5>
                          <p className="text-gray-600">
                            {selectedTour.from} → {selectedTour.to}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start p-3 bg-green-50 rounded-lg">
                        <FaMoneyBillWave className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-gray-800">Price</h5>
                          <p className="text-gray-600">
                            Starts from ৳{selectedTour.price.toLocaleString()}
                          </p>
                        </div>
                      </li>
                      <p className="text-gray-600">
                        {formatDate(selectedTour.departureDate)} →{" "}
                        {formatDate(selectedTour.returnDate)}
                      </p>
                      {new Date(selectedTour.departureDate) < new Date() && (
                        <p className="text-sm text-red-600 font-semibold mt-1">
                          This tour has already departed
                        </p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:w-3/5 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedTour.title}
                </h2>
                <p className="text-gray-600 mb-6">{selectedTour.details}</p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    Itinerary
                  </h3>
                  <div className="space-y-4">
                    {selectedTour.itinerary?.map((item, idx) => (
                      <div key={idx} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          {idx < selectedTour.itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300"></div>
                          )}
                        </div>
                        <div className="pb-4 flex-1">
                          <p className="text-gray-700">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    Rules & Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedTour.rules?.map((rule, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                      <label className="mr-3 font-medium">Persons</label>
                      <input
                        type="number"
                        defaultValue={1}
                        min="1"
                        onChange={(e) => setPerson(e.target.value)}
                        max={selectedTour.availableSlots}
                        className="input input-bordered w-20 text-center"
                      />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ৳ {selectedTour.price * person}
                    </div>
                    <button
                      className="btn btn-primary px-8"
                      onClick={handleBookTour}
                      disabled={
                        new Date(selectedTour.departureDate) < new Date()
                      }
                    >
                      {new Date(selectedTour.departureDate) < new Date()
                        ? "Date Passed"
                        : "Book Now"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center text-sm">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FaUserAltSlash className="text-blue-600" />
                    </div>
                    <div>
                      <span className="text-gray-600">Available Slots:</span>
                      <span className="ml-2 font-semibold text-blue-700">
                        {selectedTour.availableSlots}
                      </span>
                    </div>
                  </div>

                  {selectedTour.availableSlots < 5 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <FiAlertTriangle className="mr-1" />
                      Selling Fast!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupTour;
