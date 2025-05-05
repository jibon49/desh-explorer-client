import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Tour = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/tourPackages")
      .then((res) => {
        setTourPackages(res.data);
        setFilteredPackages(res.data);
      })
      .catch((err) => console.error("Error fetching tours:", err));
  }, []);

  // Filter tours based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPackages(tourPackages);
      setCurrentPage(1);
    } else {
      const filtered = tourPackages.filter(pkg => 
        pkg._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, tourPackages]);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPackages.slice(startIndex, startIndex + itemsPerPage);

  const handleBookNow = (id) => {
    navigate(`/tourDetails/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!tourPackages.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
              <figure className="px-4 pt-4">
                <div className="skeleton h-48 w-full rounded-xl"></div>
              </figure>
              <div className="card-body p-4">
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2 mb-4"></div>
                <div className="flex justify-between items-center mb-3">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-4 w-16"></div>
                </div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5/6 mb-2"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="skeleton h-10 w-24 rounded-full"></div>
                  <div className="skeleton h-10 w-24 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Discover Amazing Tours"
        text="Explore our handpicked collection of unforgettable travel experiences"
      />

      <div className="my-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Our Tour Packages</h1>
            <p className="text-gray-600 mt-2">
              {filteredPackages.length} {filteredPackages.length === 1 ? "tour" : "tours"} available
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Tour ID, name or location..."
              className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-xl font-medium text-gray-800">
                No tours found
              </h3>
              <p className="mt-2 text-gray-600">
                {searchTerm 
                  ? `We couldn't find any tours matching "${searchTerm}"`
                  : "There are currently no tours available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 btn btn-outline btn-primary"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedData.map((pkg) => (
                <div key={pkg._id} className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Badge for tour type */}
                  <div className="absolute top-4 right-4 z-10 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {pkg.type}
                  </div>
                  
                  {/* Tour image */}
                  <figure className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </figure>
                  
                  {/* Tour content */}
                  <div className="p-6">
                    <div className="flex items-center mb-1">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {pkg.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 mt-4 mb-5">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="mr-1.5 text-blue-500" />
                        {pkg.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-1.5 text-blue-500" />
                        {pkg.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-1.5 text-blue-500" />
                        {pkg.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-500">From</span>
                        <p className="text-xl font-bold text-blue-600">
                          ${pkg.price}
                          <span className="text-sm font-normal text-gray-500"> /person</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookNow(pkg._id)}
                        className="btn btn-primary rounded-lg px-6 transition-all duration-300 hover:shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &larr;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentPage === i + 1 
                          ? "bg-blue-600 text-white" 
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &rarr;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Tour;