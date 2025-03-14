import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Review = () => {
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [loading, setLoading] = useState(true); // State to manage loading
  useEffect(()=>{
    fetch('reviews.json')
  .then(res => res.json())
  .then(data => {
    setReviews(data);
    setLoading(false);
  })
  .catch(error => {
    console.error("Error fetching reviews:", error);
    setLoading(false);
  });

  },[])

  return (
    <div className="my-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>

      {loading ? (
        <p className="text-center">Loading reviews...</p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id} className="flex justify-center">
              <div className="bg-white p-6 shadow-lg rounded-2xl text-center w-80 flex flex-col h-full">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 mx-auto rounded-full border-4 border-gray-300"
                />
                <h3 className="text-xl font-semibold mt-4">{review.name}</h3>
                <p className="text-gray-600 mt-2 flex-grow">{review.review}</p>
                <div className="mt-auto pt-4">
                  <span className="text-yellow-500 text-lg">★★★★★</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Review;
