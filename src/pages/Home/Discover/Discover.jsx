import React from "react";
import discoverImg from "./../../../assets/banner.jpeg";

const Discover = () => {
  return (
    <div className="hero bg-base-200 p-6 my-5">
      <div className="hero-content flex-col lg:flex-row gap-6">
        {/* Left - Image */}
        <img
          src={discoverImg}
          className="lg:w-1/2 w-full rounded-lg shadow-lg object-cover"
          alt="Discover Image"
        />

        {/* Right - Text & Button */}
        <div className="lg:w-1/2 w-full text-justify">
          <h1 className="text-3xl font-bold mb-4">
            Discover the world with us
          </h1>
          <p className="text-lg leading-relaxed">
            Explore amazing places and cultures. Join us in our adventures! Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Architecto esse necessitatibus deserunt libero quis
            repudiandae voluptas, odio nulla officia praesentium, et fugit nihil eveniet voluptatibus
            amet assumenda ut quibusdam quam.
          </p>

          <button className="btn mt-5 px-6 py-3 bg-site-main text-white rounded-full text-lg">
            Download Guide Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
