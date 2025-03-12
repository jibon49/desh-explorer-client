import React from "react";
import bgImage from "../../../assets/banner.jpeg"; // Ensure the correct path to your image

const Banner = ({ heading, text }) => {
  return (
    <div>
      <div
        className="hero relative w-full min-h-[60vh] lg:min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* 🔥 Dark Overlay for Better Text Visibility */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

        {/* 🔥 Dynamic Heading & Text */}
        <div className="hero-content flex flex-col justify-center items-center text-center z-10">
          <div className="max-w-full lg:max-w-2xl">
            <h1 className="mb-5 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {heading}
            </h1>
            <p className="mb-5 text-sm md:text-base lg:text-lg text-white">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
