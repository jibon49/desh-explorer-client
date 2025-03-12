import React from "react";
import bgImage from "../../../assets/banner.jpeg";

const Banner = () => {
  return (
    <div>
      <div
        className="hero relative w-full min-h-screen md:min-h-[60vh] lg:min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* 🔥 Dark Overlay - Stays Inside the Image 🔥 */}
        <div className="absolute top-0 left-0 w-full h-full hero-overlay bg-opacity-40"></div>

        {/* Centered Content */}
        <div className="hero-content flex flex-col justify-center items-center text-center z-10">
          <div className="max-w-full lg:max-w-2xl">
            <h1 className="mb-5 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Simplify Travel, Amplify Adventure
            </h1>
            <p className="mb-5 text-sm md:text-base lg:text-lg text-white">
              Plan your trips effortlessly with our seamless booking system. Explore new destinations and make unforgettable memories.
            </p>
            <button className="btn btn-primary btn-md md:btn-lg">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
