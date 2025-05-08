import React, { useEffect, useState } from "react";
import Blogs from "../../../public/Blogs.json";
import { motion } from "framer-motion";
import {
  FaStar,
  FaPenAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaPaperPlane,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/banner3.jpg";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useMongoUser from "../../hooks/userMongoUser";
import Swal from "sweetalert2";
import TravelStories from "./TravelStories";

const Reviews = () => {
  const { mongoUser } = useMongoUser();
  const [activeTab, setActiveTab] = useState("reviews");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import stories from Blogs.json file
  const [stories, setStories] = useState(Blogs);

  // Pagination state for reviews
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 6;

  // Pagination state for stories
  const [currentStoryPage, setCurrentStoryPage] = useState(1);
  const storiesPerPage = 6;

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [newStory, setNewStory] = useState({
    title: "",
    location: "",
    date: "",
    rating: 0,
    image: null,
    content: "",
  });

  const [reviewForm, setReviewForm] = useState({
    user: mongoUser?.userName || "",
    package: "",
    tourId: "",
    rating: 0,
    text: "",
    avatar: mongoUser?.userImage || "",
    date: new Date().toISOString().split("T")[0],
  });
  const [imagePreview, setImagePreview] = useState("");

  // Calculate pagination for reviews
  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  // Calculate pagination for stories
  const indexOfLastStory = currentStoryPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);
  const totalStoryPages = Math.ceil(stories.length / storiesPerPage);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosSecure.get("/reviews");
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };
    console.log(reviews);

    fetchReviews();
  }, [axiosSecure]);

  useEffect(() => {
    if (mongoUser?.userMail) {
      fetchUserBookings();
    }
  }, [mongoUser]);

  const fetchUserBookings = async () => {
    try {
      const res = await axiosSecure.get(`/payments/${mongoUser.userMail}`);
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setLoading(false);
    }
  };

  // Helpers for reviews
  const renderReviewStars = (count) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`text-lg ${
            i < count ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const renderStoryStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-xl cursor-pointer ${
          i < count ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => handleStoryRating(i + 1)}
      />
    ));
  };

  // Story form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewStory((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStoryRating = (rating) => {
    setNewStory((prev) => ({ ...prev, rating }));
  };

  const handleStorySubmit = (e) => {
    e.preventDefault();
    const submittedStory = {
      ...newStory,
      id: stories.length + 1,
      image: imagePreview || "https://placehold.co/600x400",
    };
    setStories((prev) => [submittedStory, ...prev]);
    setShowStoryModal(false);
    setNewStory({
      title: "",
      location: "",
      date: "",
      rating: 0,
      image: null,
      content: "",
    });
    setImagePreview("");
    alert("Your travel story has been shared!");
    setCurrentStoryPage(1);
  };

  // Pagination handlers
  const paginateReviews = (pageNumber) => setCurrentReviewPage(pageNumber);
  const paginateStories = (pageNumber) => setCurrentStoryPage(pageNumber);

  const nextReviewPage = () => {
    if (currentReviewPage < totalReviewPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  const prevReviewPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const nextStoryPage = () => {
    if (currentStoryPage < totalStoryPages) {
      setCurrentStoryPage(currentStoryPage + 1);
    }
  };

  const prevStoryPage = () => {
    if (currentStoryPage > 1) {
      setCurrentStoryPage(currentStoryPage - 1);
    }
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        ...reviewForm,
        userMail: mongoUser?.userMail,
        userName: mongoUser?.userName || "",
        userPhoto: mongoUser?.userPhoto || "",
        tourId: reviewForm.tourId,
        tourTitle: reviewForm.package,
        text: reviewForm.text,
        date: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/reviews", reviewData);

      setReviews((prev) => [response.data, ...prev]);

      setShowReviewModal(false);
      setReviewForm({
        user: mongoUser?.userName || "",
        rating: 0,
        text: "",
        date: new Date().toISOString().split("T")[0],
      });

      if (response.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Review submitted!",
          text: "Your review has been submitted.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Not found",
        text: "No tour found with that ID",
      });
    }
  };

  console.log(mongoUser);
  console.log(reviews);

  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Traveler Reviews & Stories"
        text="Discover authentic experiences shared by our community"
      />

      <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="tabs tabs-boxed bg-white shadow-md rounded-full">
            <button
              className={`tab rounded-full px-6 ${
                activeTab === "reviews"
                  ? "tab-active bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : ""
              }`}
              onClick={() => {
                setActiveTab("reviews");
                setCurrentReviewPage(1);
              }}
            >
              <FaPenAlt className="mr-2" /> Traveler Reviews
            </button>
            <button
              className={`tab rounded-full px-6 ${
                activeTab === "stories"
                  ? "tab-active bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : ""
              }`}
              onClick={() => {
                setActiveTab("stories");
                setCurrentStoryPage(1);
              }}
            >
              <FaPaperPlane className="mr-2" /> Travel Stories
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        {activeTab === "reviews" && (
          <div className="max-w-7xl mx-auto">
            {/* Reviews Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Traveler Experiences
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Read what our travelers say about their adventures with us
              </p>
              <button
                className="btn btn-primary mt-6 gap-2 hover:scale-105 transition-transform"
                onClick={() => setShowReviewModal(true)}
              >
                <FaPenAlt /> Share Your Experience
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentReviews.map((review, index) => (
                <motion.div
                  key={review._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                        <img
                          src={review.userPhoto || review.avatar}
                          alt={review.user}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {review.userName || review.user}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Rating and Tour Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {renderReviewStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-xs" />
                        {review.tourTitle || review.package}
                      </p>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reviews Pagination */}
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  onClick={prevReviewPage}
                  disabled={currentReviewPage === 1}
                  className="join-item btn btn-outline hover:bg-blue-50"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalReviewPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginateReviews(i + 1)}
                    className={`join-item btn ${
                      currentReviewPage === i + 1
                        ? "btn-active bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={nextReviewPage}
                  disabled={currentReviewPage === totalReviewPages}
                  className="join-item btn btn-outline hover:bg-blue-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories Section */}
        {activeTab === "stories" && (
          <TravelStories bookings={bookings} />
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="modal modal-open">
            <div className="modal-box relative max-w-md p-8 rounded-xl">
              <button
                onClick={() => setShowReviewModal(false)}
                className="btn btn-sm btn-circle absolute right-4 top-4 hover:bg-gray-100"
              >
                <IoClose className="text-gray-500" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Share Your Experience
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Name</span>
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={reviewForm.user}
                    onChange={handleReviewInputChange}
                    placeholder="John Doe"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Package Name</span>
                  </label>
                  <select
                    name="package"
                    value={reviewForm.package}
                    onChange={(e) => {
                      const selectedIndex = e.target.selectedIndex;
                      const selectedOption = e.target.options[selectedIndex];
                      const tourId = selectedOption.getAttribute("data-id");
                      const tourTitle = e.target.value;
                      setReviewForm((prev) => ({
                        ...prev,
                        package: e.target.value,
                        tourId: tourId,
                      }));
                    }}
                    className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a Package</option>
                    {bookings.map((pack, i) => (
                      <option
                        key={i}
                        value={pack.tourTitle}
                        data-id={pack.tourId}
                      >
                        {pack.tourTitle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Rating</span>
                  </label>
                  <div className="rating rating-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="rating"
                        checked={reviewForm.rating === star}
                        onChange={() => handleRatingChange(star)}
                        className="mask mask-star-2 bg-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Your Experience
                    </span>
                  </label>
                  <textarea
                    name="text"
                    value={reviewForm.text}
                    onChange={handleReviewInputChange}
                    className="textarea textarea-bordered h-32 focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your trip..."
                    required
                  />
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-outline hover:bg-gray-50"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary hover:bg-blue-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
