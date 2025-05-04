import { useState, useEffect } from "react";
import { FaTree, FaBuilding, FaUsers, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

const Tour = () => {
  const [selectedTab, setSelectedTab] = useState("tour");
  const [where, setWhere] = useState("");
  const [leaveDate, setLeaveDate] = useState("20 Jun 2025");
  const [returnDate, setReturnDate] = useState("25 Jun 2025");
  const [showDatePicker, setShowDatePicker] = useState(null);

  // Date picker functionality
  const handleDateChange = (dateType, daysToAdd) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    const formattedDate = baseDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (dateType === 'leave') {
      setLeaveDate(formattedDate);
    } else {
      setReturnDate(formattedDate);
    }
    setShowDatePicker(null);
  };

 
      

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="relative w-full max-w-3xl mx-auto mt-[-100px] glass z-10 rounded-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 0.9, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ opacity: 1 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg backdrop-blur-md bg-opacity-80">
        {/* Tab Selector */}
        <motion.div 
          className="flex space-x-2 bg-gray-100 p-1 rounded-full w-fit mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {["tour", "custom", "group"].map((tab) => (
            <motion.button
              key={tab}
              className={`px-4 py-2 flex items-center rounded-full text-sm sm:text-base ${
                selectedTab === tab ? "bg-site-main text-white" : "text-gray-500"
              }`}
              onClick={() => setSelectedTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "tour" && <FaTree className="mr-2" />}
              {tab === "custom" && <FaBuilding className="mr-2" />}
              {tab === "group" && <FaUsers className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Where Input */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-100"
                whileHover={{ y: -2 }}
              >
                <label className="text-gray-500 block text-sm">Where</label>
                <input
                  type="text"
                  placeholder="Cox's Bazar"
                  className="mt-1 w-full p-2 bg-transparent focus:outline-none font-medium"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                />
              </motion.div>

              {/* Leave Date */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-100 relative"
                whileHover={{ y: -2 }}
                onClick={() => setShowDatePicker(showDatePicker === 'leave' ? null : 'leave')}
              >
                <label className="text-gray-500 block text-sm">Leave</label>
                <div className="flex items-center cursor-pointer">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <p className="bg-transparent focus:outline-none font-medium">{leaveDate}</p>
                </div>
                {showDatePicker === 'leave' && (
                  <motion.div 
                    className="absolute z-10 mt-2 w-full bg-white p-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('leave', 7)}
                    >
                      Next Week
                    </button>
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('leave', 14)}
                    >
                      In 2 Weeks
                    </button>
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('leave', 30)}
                    >
                      Next Month
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Return Date */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-100 relative"
                whileHover={{ y: -2 }}
                onClick={() => setShowDatePicker(showDatePicker === 'return' ? null : 'return')}
              >
                <label className="text-gray-500 block text-sm">Return</label>
                <div className="flex items-center cursor-pointer">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <p className="bg-transparent focus:outline-none font-medium">{returnDate}</p>
                </div>
                {showDatePicker === 'return' && (
                  <motion.div 
                    className="absolute z-10 mt-2 w-full bg-white p-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('return', 10)}
                    >
                      10 Days Trip
                    </button>
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('return', 14)}
                    >
                      2 Weeks Trip
                    </button>
                    <button 
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleDateChange('return', 21)}
                    >
                      3 Weeks Trip
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Search Button */}
            <motion.div 
              className="flex justify-end mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="bg-site-main text-white px-6 py-3 rounded-full flex items-center"
                onClick={() => Navigate("/tour")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"

              >
                <FaSearch className="mr-2" />
                Search {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Tour;