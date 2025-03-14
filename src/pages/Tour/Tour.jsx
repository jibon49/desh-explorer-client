import React, { useState } from "react";
import tourPackages from "../../../public/tourPackages.json";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";

const Tour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination Logic
  const totalPages = Math.ceil(tourPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tourPackages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      
      <Banner
      bgImage={backImage}
      heading="Tour packages"
      text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt commodi reprehenderit voluptatibus doloremque, distinctio unde ab ipsum et vero placeat."
      ></Banner>

      <div className="my-16 px-4">
        <h1 className="font-extrabold text-3xl text-center p-16">
          Tour Packages
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {paginatedData.map((pkg) => (
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
                <button className="btn bg-site-main text-white ml-20 rounded-2xl">
                  Book now
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-4 py-2 rounded-lg ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tour;
