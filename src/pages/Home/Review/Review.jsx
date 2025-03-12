import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review: "This was an amazing experience! Highly recommended.",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "Absolutely loved the service. Would definitely book again!",
  },
  {
    id: 3,
    name: "Michael Johnson",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review: "A truly unforgettable trip. Thank you so much!",
  },
  {
    id: 4,
    name: "Emily Davis",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review: "Great experience! Everything was well-organized.",
  },
];

const Review = () => {
  return (
    <div className="my-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
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
          <SwiperSlide key={review.id} className="flex justify-center">
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
    </div>
  );
};

export default Review;
