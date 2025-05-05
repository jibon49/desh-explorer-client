import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSearch, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const PackageCards = () => {
  const navigate = useNavigate();
  const [tourPackages, setTourPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/tourPackages")
      .then((res) => {
        setTourPackages(res.data);
        setFilteredPackages(res.data.slice(0, 6)); // Only show first 6 tours
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tours:", err);
        setLoading(false);
      });
  }, []);

  // Filter tours based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPackages(tourPackages.slice(0, 6));
    } else {
      const filtered = tourPackages.filter(pkg => 
        pkg._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6); // Still only show max 6 tours even when searching
      setFilteredPackages(filtered);
    }
  }, [searchTerm, tourPackages]);

  const handleBookNow = (id) => {
    navigate(`/tourDetails/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const hoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  };

  const tapEffect = {
    scale: 0.98,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="card bg-base-100 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-28 px-4 max-w-7xl mx-auto">
      <motion.h1 
        className="font-extrabold text-3xl md:text-4xl text-center p-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Tour Packages
      </motion.h1>

      {/* Search Section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <motion.p className="text-gray-600">
            Featured tours
          </motion.p>
        </div>
        
        <motion.div 
          className="relative w-full md:w-80"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tours..."
            className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </motion.div>
      </motion.div>

      {filteredPackages.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
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
              <motion.button
                onClick={() => setSearchTerm("")}
                className="mt-4 btn btn-outline btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear search
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden"
                variants={cardItem}
                whileHover={hoverEffect}
                whileTap={tapEffect}
              >
                {/* Badge for tour type */}
                <motion.div 
                  className="absolute top-4 right-4 z-10 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                  whileHover={{ scale: 1.1 }}
                >
                  {pkg.type}
                </motion.div>
                
                {/* Tour image */}
                <figure className="relative h-56 overflow-hidden">
                  <motion.img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </figure>
                
                {/* Tour content */}
                <div className="p-6">
                  <div className="flex items-center mb-1">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{pkg.ratings}</span>
                  </div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-2 line-clamp-2"
                    whileHover={{ color: "#3a86ff" }}
                  >
                    {pkg.title}
                  </motion.h3>
                  
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
                      <motion.p 
                        className="text-xl font-bold text-blue-600"
                        whileHover={{ scale: 1.05 }}
                      >
                        ${pkg.price}
                        <span className="text-sm font-normal text-gray-500"> /person</span>
                      </motion.p>
                    </div>
                    <motion.button
                      onClick={() => handleBookNow(pkg._id)}
                      className="btn btn-primary rounded-lg px-6"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "#3a86ff"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* See More Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => navigate("/tour")}
              className="px-8 py-3 bg-site-main text-white rounded-lg text-lg font-semibold shadow-md"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#3a86ff",
                boxShadow: "0 5px 15px rgba(58, 134, 255, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              See More Packages
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default PackageCards;