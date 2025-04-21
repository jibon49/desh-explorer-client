import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Banner from "../Home/Banner/Banner";
import { FiAlertCircle, FiArrowRight, FiBookOpen, FiCalendar, FiCheck, FiCheckCircle, FiClock, FiFileText, FiInfo, FiMapPin, FiSun, FiX } from "react-icons/fi";

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tourDetails/${id}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  console.log(tour);
  if (!tour)
    return (
      <div className="flex w-full flex-col gap-4 items-center justify-center mx-auto my-16">
        <div className="skeleton h-64 w-full"></div>

        <div className="skeleton h-10 w-3/4"></div>

        <div className="flex flex-col w-3/4 gap-4">
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
        </div>

        <div className="flex flex-col w-3/4 gap-4">
          <div className="skeleton h-10 w-1/2"></div>
          <div className="skeleton h-10 w-1/2"></div>
          <div className="skeleton h-10 w-1/2"></div>
          <div className="skeleton h-10 w-1/2"></div>
          <div className="skeleton h-10 w-1/4"></div>
        </div>
      </div>
    );

  return (
    <>
      <Banner
        bgImage={tour.image}
        heading={tour.title}
        text={tour.description}
      />
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="md:col-span-2">
            <img
              src={tour.image}
              alt={tour.title}
              className="rounded-lg w-full h-[400px] object-cover"
            />
            {/* <div className="flex flex-col gap-2 mt-4">
            {[tour.image, tour.image, tour.image, tour.image].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className="w-24 h-16 object-cover rounded"
              />
            ))}
          </div> */}
          </div>

          {/* Details Section */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{tour.title}</h2>
            <p className="text-gray-600 flex items-center">
              📍 {tour.location}
            </p>

            <div className="w-full h-64 rounded overflow-hidden">
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  tour.location
                )}&output=embed`}
              ></iframe>
            </div>

            <div className="flex items-center gap-4 text-sm mt-2">
              <span>🕒 {tour.duration}</span>
              <span>👥 From 2 to 6 people</span>
            </div>
            <p className="text-sm text-gray-700">📝 {tour.policy?.refund}</p>
            {/* <p className="font-semibold mt-2 text-xl">The ID of this tour package is:</p>
            <p className="text-base text-red-500">{tour._id}</p> */}
            {/* <button className="btn btn-neutral btn-sm mt-4">Book Now</button> */}
          </div>
        </div>

        {/* Accordion and Contact Section */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {/* Tour Information Accordion */}
          <div className="md:col-span-2 space-y-4">
            {/* Overview */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" defaultChecked />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiInfo className="mr-3 text-blue-500" />
                Overview
              </div>
              <div className="collapse-content">
                <p className="text-gray-700 leading-relaxed">{tour.overview}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiCalendar className="mr-3 text-blue-500" />
                Schedule & Timing
              </div>
              <div className="collapse-content">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span> {tour.date}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    {tour.duration}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Daily Timing:</span>{" "}
                    {tour.timing}
                  </p>
                </div>
              </div>
            </div>

            {/* Inclusion & Exclusion */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiCheckCircle className="mr-3 text-blue-500" />
                What's Included & Excluded
              </div>
              <div className="collapse-content">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">
                      Included:
                    </h4>
                    <ul className="space-y-2">
                      {tour.inclusion.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-500 mb-3">Excluded:</h4>
                    <ul className="space-y-2">
                      {tour.exclusion.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiBookOpen className="mr-3 text-blue-500" />
                Detailed Description
              </div>
              <div className="collapse-content">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiAlertCircle className="mr-3 text-blue-500" />
                Additional Information
              </div>
              <div className="collapse-content">
                <ul className="space-y-2 text-gray-700">
                  {tour.additionalInfo.split(",").map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FiInfo className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiSun className="mr-3 text-blue-500" />
                Travel Tips
              </div>
              <div className="collapse-content">
                <ul className="space-y-3">
                  {tour.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3">
                        <FiArrowRight className="text-blue-500" />
                      </div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Policy */}
            <div className="collapse collapse-plus bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
              <input type="radio" name="tour-accordion" />
              <div className="collapse-title text-lg font-semibold text-gray-800 flex items-center">
                <FiFileText className="mr-3 text-blue-500" />
                Booking Policy
              </div>
              <div className="collapse-content">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Cancellation Policy:
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {tour.policy.cancellation
                        .split(",")
                        .map((item, index) => (
                          <li key={index} className="flex items-start">
                            <FiClock className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Reschedule Policy:
                    </h4>
                    <p className="text-gray-700">{tour.policy.reschedule}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Refund Policy:
                    </h4>
                    <p className="text-gray-700">{tour.policy.refund}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Book This Tour
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span className="text-gray-700">Price per person</span>
                <span className="text-xl font-bold text-blue-600">
                  ${tour.price}
                </span>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your surname"
                      className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1XXX XXXXXX"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Travelers
                  </label>
                  <select className="select select-bordered w-full focus:ring-2 focus:ring-blue-500">
                    <option>1 person</option>
                    <option>2 people</option>
                    <option>3 people</option>
                    <option>4 people</option>
                    <option>5 people</option>
                    <option>6 people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements?"
                    rows="3"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Book Now
                </button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>
                  Need help? Call us at{" "}
                  <a href="tel:+8801234567890" className="text-blue-600">
                    +880 1234 567890
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetails;
