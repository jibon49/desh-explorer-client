import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import tourPackages from "../../../../public/tourPackages.json";

const PackageCards = () => {
  const navigate = useNavigate();
  const [displayedPackages] = useState(tourPackages.slice(0, 6));

  return (
    <div className="my-28 px-4">
      <h1 className="font-extrabold text-3xl text-center p-16">Tour Packages</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {displayedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="card w-full max-w-sm shadow-md rounded-2xl bg-white p-2 mx-auto"
          >
            <h1 className="font-bold text-center">{pkg.title}</h1>
            <figure className="px-5 pt-5">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="rounded-xl w-[293px] h-[219px]"
              />
            </figure>
            <div className="card-body grid grid-cols-3 gap-2 text-center">
              <div className="bg-site-main text-white rounded-2xl">{pkg.type}</div>
              <div>{pkg.duration}</div>
              <div>{pkg.date}</div>
              <div className="flex flex-row items-center mt-2 justify-around">
                <p className="font-bold text-xl">${pkg.price}/person</p>
                <button className="btn bg-site-main text-white ml-20 rounded-2xl"
                        onClick={() => navigate("/tour")}>
                  Book now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/tour")}
          className="px-6 py-3 bg-site-main text-white rounded-lg text-lg hover:bg-site-main-dark transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default PackageCards;
