import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Banner from "../Home/Banner/Banner";

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tourDetails/${id}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  console.log(tour)
  if (!tour) return <p className="text-center mt-20">Loading...</p>;

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
            <p className="font-semibold mt-2">Requirements</p>
            <p className="text-sm">Copy of NID card</p>
            <button className="btn btn-neutral btn-sm mt-4">Book Now</button>
          </div>
        </div>

        {/* Accordion and Contact Section */}
        <div className="mt-10 grid md:grid-cols-3 gap-6 bg-base-200 p-4 rounded">
          <div className="md:col-span-2 space-y-2">
            {[
              { title: "Overview", content: tour.overview },
              { title: "Location", content: tour.location },
              { title: "Timing", content: tour.date },
              {
                title: "Inclusion & Exclusion",
                content: `Inclusion: ${tour.inclusion} | Exclusion: ${tour.exclusion}`,
              },
              { title: "Description", content: tour.description },
              { title: "Additional Information", content: tour.additionalInfo },
              { title: "Travel Tips", content: tour.travelTips },
              {
                title: "Policy",
                content: `Cancellation: ${tour.policy?.cancellation}, Reschedule: ${tour.policy?.reschedule}, Refund: ${tour.policy?.refund}`,
              },
            ].map((item, idx) => (
              <div className="collapse collapse-arrow bg-white" key={idx}>
                <input type="checkbox" />
                <div className="collapse-title font-medium">{item.title}</div>
                <div className="collapse-content text-sm">{item.content}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Surname"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Message"
            ></textarea>
            <button className="btn btn-neutral w-full">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetails;
