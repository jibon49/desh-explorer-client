import React from 'react';
import cardImg from "../../../assets/banner.jpeg"

const ReadBefore = () => {
  return (
    <div className="my-16">
      <h1 className="text-center text-2xl md:text-4xl font-bold text-gray-800 mb-10">
        Read Before Travel
      </h1>
      
      {/* First Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 p-6 bg-gray-100 rounded-xl rounded-b-none">
        <img
          src={cardImg}
          alt="Travel"
          className="w-full lg:w-[50%] rounded-xl shadow-lg object-cover"
        />
        <div className="w-full lg:w-[50%]">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            Discover the world with us
          </h2>
          <p className="text-gray-700 text-sm md:text-lg mb-6">
            Explore amazing places and cultures. Join us in our adventures! 
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            esse necessitatibus deserunt libero quis repudiandae voluptas.
          </p>
          <a className="text-blue-600 font-bold flex items-center hover:underline" href="#">
            <span>Learn More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Second Section */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-10 p-6 bg-gray-100 rounded-xl rounded-t-none shadow-md">
        <img
          src={cardImg}
          alt="Travel"
          className="w-full lg:w-[50%] rounded-xl shadow-lg object-cover"
        />
        <div className="w-full lg:w-[50%]">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            Plan your trip wisely
          </h2>
          <p className="text-gray-700 text-sm md:text-lg mb-6">
            Make sure you have everything sorted before traveling. Know your
            itinerary, pack smart, and be ready for an amazing journey!
          </p>
          <a className="text-blue-600 font-bold flex items-center hover:underline" href="#">
            <span>Learn More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReadBefore;
