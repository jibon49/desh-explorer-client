import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";

const Tour = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/tourPackages")
      .then((res) => setTourPackages(res.data))
      .catch((err) => console.error("Error fetching tours:", err));
  }, []);

  const totalPages = Math.ceil(tourPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tourPackages.slice(startIndex, startIndex + itemsPerPage);

  const handleBookNow = (id) => {
    navigate(`/tourDetails/${id}`);
  };

  if (!tourPackages.length)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
            <figure className="px-4 pt-4">
              <div className="skeleton h-48 w-full rounded-xl"></div>
            </figure>
            <div className="card-body p-4">
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2 mb-4"></div>
              
              <div className="flex justify-between items-center mb-3">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-4 w-16"></div>
              </div>
              
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-5/6 mb-2"></div>
              <div className="skeleton h-4 w-2/3 mb-4"></div>
              
              <div className="flex justify-between items-center">
                <div className="skeleton h-10 w-24 rounded-full"></div>
                <div className="skeleton h-10 w-24 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Tour Packages"
        text="Explore amazing destinations with our curated tour plans."
      />

      <div className="my-16 px-4">
        <h1 className="font-extrabold text-3xl text-center p-16">Tour Packages</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {paginatedData.map((pkg) => (
            <div key={pkg._id} className="card w-full max-w-sm shadow-md rounded-2xl bg-white p-2 mx-auto">
              <h1 className="font-bold text-center">{pkg.title}</h1>
              <figure className="px-5 pt-5">
                <img src={pkg.image} alt={pkg.title} className="rounded-xl w-[293px] h-[219px]" />
              </figure>
              <div className="card-body grid grid-cols-3 gap-2 text-center">
                <div className="bg-site-main text-white rounded-2xl">{pkg.type}</div>
                <div>{pkg.duration}</div>
                <div>{pkg.date}</div>
                <div className="flex flex-row items-center mt-2 justify-around col-span-3">
                  <p className="font-bold text-xl">${pkg.price}/person</p>
                  <button onClick={() => handleBookNow(pkg._id)} className="btn bg-site-main text-white rounded-2xl">
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
