import { useState } from "react";
import { FaTree, FaBuilding, FaUsers, FaCalendarAlt } from "react-icons/fa";

const Tour = () => {
  const [selectedTab, setSelectedTab] = useState("tour");

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-[-100px] glass z-10 opacity-80 rounded-2xl">
      <div className="bg-white p-6 rounded-lg shadow-lg backdrop-blur-md bg-opacity-80">
        <div className="flex space-x-4 bg-gray-100 p-2 rounded-full w-fit mx-auto">
          <button 
            className={`px-4 py-2 flex items-center rounded-full ${selectedTab === "tour" ? "bg-site-main text-white" : "text-gray-500"}`} 
            onClick={() => setSelectedTab("tour")}>
            <FaTree className="mr-2" /> Tour
          </button>
          <button 
            className={`px-4 py-2 flex items-center rounded-full ${selectedTab === "custom" ? "bg-site-main text-white" : "text-gray-500"}`} 
            onClick={() => setSelectedTab("custom")}>
            <FaBuilding className="mr-2" /> Custom Tour
          </button>
          <button 
            className={`px-4 py-2 flex items-center rounded-full ${selectedTab === "group" ? "bg-site-main text-white" : "text-gray-500"}`} 
            onClick={() => setSelectedTab("group")}>
            <FaUsers className="mr-2" /> Group Tour
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-gray-100">
            <label className="text-gray-500 block">Where</label>
            <input type="text" placeholder="Cox’s Bazar" className="mt-1 w-full p-2 bg-transparent focus:outline-none" />
          </div>
          <div className="p-4 rounded-lg bg-gray-100">
            <label className="text-gray-500 block">Leave</label>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <p className="bg-transparent focus:outline-none">20 Jun 2025</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-100">
            <label className="text-gray-500 block">Return</label>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <p className="bg-transparent focus:outline-none">25 Jun 2025</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-site-main text-white px-6 py-2 rounded-full">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Tour;