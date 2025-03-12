import React from "react";

const PackageCards = () => {
  return (
    <div className="my-28 px-4">
      <h1 className="font-extrabold text-3xl text-center p-16">Tour Packages</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mx-auto max-w-7xl">
        {/* Card Component */}
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="card w-full max-w-sm shadow-md rounded-2xl bg-white p-2 mx-auto">
            <h1 className="font-bold text-center">Saint’s Martin</h1>
            <figure className="px-5 pt-5">
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
                className="rounded-xl w-full"
              />
            </figure>
            <div className="card-body text-center px-2">
              <div className="flex gap-3 p-2 text-sm justify-center">
                <p className="bg-[#D6EDEB] text-[#2D8985] px-3 py-1 rounded-2xl">Chill</p>
                <p>2 Night 3 Day</p>
                <p>20.5.23</p>
              </div>
              <div className="card-actions flex items-center justify-between p-2">
                <p className="text-lg">
                  <span className="font-bold text-xl">$850</span>/person
                </p>
                <button className="btn text-white px-6 py-2 bg-site-main rounded-2xl text-sm">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCards;
