import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import tourPackages from "../../../../public/tourPackages.json";

const PackageCards = () => {
  const navigate = useNavigate();
  const [displayedPackages] = useState(tourPackages.slice(0, 6));

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

  return (
    <div className="my-28 px-4">
      <motion.h1 
        className="font-extrabold text-3xl md:text-4xl text-center p-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Tour Packages
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {displayedPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="card w-full max-w-sm shadow-lg rounded-2xl bg-white overflow-hidden mx-auto"
            variants={cardItem}
            whileHover={hoverEffect}
            whileTap={tapEffect}
          >
            <div className="p-4">
              <motion.h1 
                className="font-bold text-center text-xl mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {pkg.title}
              </motion.h1>
              
              <motion.figure 
                className="px-5 pt-2 overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="rounded-xl w-full h-[219px] object-cover"
                />
              </motion.figure>
              
              <div className="card-body grid grid-cols-3 gap-3 text-center p-4">
                <motion.div 
                  className="bg-site-main text-white rounded-2xl py-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {pkg.type}
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-gray-700">{pkg.duration}</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-gray-700">{pkg.date}</span>
                </motion.div>
                
                <div className="col-span-3 flex items-center justify-between mt-4">
                  <motion.p 
                    className="font-bold text-xl text-gray-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    ${pkg.price}/person
                  </motion.p>
                  
                  <motion.button 
                    className="btn bg-site-main text-white rounded-2xl px-6 py-2"
                    onClick={() => navigate("/tour")}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "#3a86ff" // Darker shade of site-main
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book now
                  </motion.button>
                </div>
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
        transition={{ delay: 0.5 }}
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
    </div>
  );
};

export default PackageCards;