import React, { useState } from "react";
import tourPackages from "../../../public/groupTourPackages.json";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";
import { FormControl, MenuItem, Select } from "@mui/material";
import { FaStar, FaMapMarkerAlt, FaUserAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

const GroupTour = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);

  const itemsPerPage = 3;
  const locations = Array.from(new Set(tourPackages.map(tour => tour.from)));
  const filteredPackages = fromLocation
    ? tourPackages.filter(tour => tour.from === fromLocation)
    : tourPackages;

  const handleLocationChange = (e) => {
    setFromLocation(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPackages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Group Tour Packages"
        text="Explore unforgettable group tours with full flexibility and fun."
      />

      <div className="my-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl text-gray-800 mb-2">Group Tour Packages</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing group adventures with expert guides and unforgettable experiences
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
                  <MenuItem key={index} value={location} className="hover:bg-blue-50">
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
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img
                  src={tour.profileImage}
                  alt={tour.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="font-semibold text-gray-800">{tour.rating}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{tour.title}</h2>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1 text-sm text-blue-500" />
                      {tour.from} → {tour.to}
                    </p>
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-outline"
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`join-item btn ${currentPage === i + 1 ? "btn-active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        <input type="checkbox" id="quote-modal" className="modal-toggle" checked readOnly />
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
              <div className="lg:w-2/5 bg-gray-100 p-6">
                <div className="sticky top-0 space-y-6">
                  <div className="text-center">
                    <img 
                      src={selectedTour.profileImage} 
                      className="rounded-full w-32 h-32 object-cover mx-auto border-4 border-white shadow-md" 
                      alt="profile" 
                    />
                    <h3 className="text-xl font-bold mt-4">{selectedTour.organizer}</h3>
                    <div className="flex justify-center mt-2 text-yellow-500">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar key={i} className={i < selectedTour.rating ? "" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {selectedTour.images?.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                        alt={`img-${idx}`} 
                      />
                    ))}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg mb-3">Tour Highlights</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-500 mr-2" />
                        <span>{selectedTour.from} → {selectedTour.to}</span>
                      </li>
                      <li className="flex items-center">
                        <FaMoneyBillWave className="text-green-500 mr-2" />
                        <span>Starting from ৳ {selectedTour.price}</span>
                      </li>
                      <li className="flex items-center">
                        <FaCalendarAlt className="text-purple-500 mr-2" />
                        <span>Flexible dates available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div className="lg:w-3/5 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTour.title}</h2>
                <p className="text-gray-600 mb-6">{selectedTour.details}</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Itinerary</h3>
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
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Rules & Requirements</h3>
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
                        defaultValue={2} 
                        min="1" 
                        className="input input-bordered w-20 text-center" 
                      />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ৳ {selectedTour.price}
                    </div>
                    <button className="btn btn-primary px-8">
                      Book Now
                    </button>
                  </div>
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