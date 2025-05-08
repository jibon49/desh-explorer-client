import React, { useEffect, useState } from 'react';
import Blogs from '../../../public/Blogs.json';
import {
  FaStar,
  FaPenAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaPaperPlane,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Banner from "../Home/Banner/Banner";
import backImage from '../../assets/banner3.jpg';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useMongoUser from '../../hooks/userMongoUser';

const Reviews = () => {

  const {mongoUser}=useMongoUser()
  const [activeTab, setActiveTab] = useState('reviews');
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
    title: '',
    location: '',
    date: '',
    rating: 0,
    image: null,
    content: ''
  });
  const [imagePreview, setImagePreview] = useState('');

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
        const res = await axiosSecure.get(
          `/payments/${mongoUser.userMail}`
        );
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
          className={`text-lg ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const renderStoryStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-xl cursor-pointer ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
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
      image: imagePreview || 'https://placehold.co/600x400'
    };
    setStories((prev) => [submittedStory, ...prev]);
    setShowStoryModal(false);
    setNewStory({
      title: '',
      location: '',
      date: '',
      rating: 0,
      image: null,
      content: ''
    });
    setImagePreview('');
    alert('Your travel story has been shared!');
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
              className={`tab rounded-full px-6 ${activeTab === 'reviews' ? 'tab-active bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : ''}`}
              onClick={() => {
                setActiveTab('reviews');
                setCurrentReviewPage(1);
              }}
            >
              <FaPenAlt className="mr-2" /> Traveler Reviews
            </button>
            <button
              className={`tab rounded-full px-6 ${activeTab === 'stories' ? 'tab-active bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : ''}`}
              onClick={() => {
                setActiveTab('stories');
                setCurrentStoryPage(1);
              }}
            >
              <FaPaperPlane className="mr-2" /> Travel Stories
            </button>
          </div>
        </div>
   
        {/* Reviews Section */}
        {activeTab === 'reviews' && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {currentReviews.map((review,index) => (
                <div
                  key={review.id}
                  className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-1"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={review.avatar} alt={review.user} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{review.user}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" /> {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {renderReviewStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-xs" /> {review.package}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                </div>
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
                    className={`join-item btn ${currentReviewPage === i + 1 ? 'btn-active bg-blue-500 text-white' : 'bg-white'}`}
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
        {activeTab === 'stories' && (
          <div className="max-w-7xl mx-auto">
            {/* Stories Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Traveler Stories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto my-4">
                Share your adventures and inspire fellow travelers with your experiences
              </p>
              <button
                onClick={() => setShowStoryModal(true)}
                className="btn btn-primary gap-2 hover:scale-105 transition-transform"
              >
                <FaPaperPlane /> Share Your Story
              </button>
            </div>
   
            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {currentStories.map((story) => (
                <div
                  key={story.id}
                  className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group hover:-translate-y-1"
                >
                  <figure className="relative h-48 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <span className="badge badge-accent">
                        <FaMapMarkerAlt className="mr-1" /> {story.location}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="card-title text-gray-800">{story.title}</h2>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < story.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <FaCalendarAlt className="mr-2" /> {story.date}
                    </div>
                    <p className="text-gray-600 line-clamp-3">{story.content}</p>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-sm btn-primary hover:bg-blue-600">
                        Read Full Story
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stories Pagination */}
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  onClick={prevStoryPage}
                  disabled={currentStoryPage === 1}
                  className="join-item btn btn-outline hover:bg-blue-50"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalStoryPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginateStories(i + 1)}
                    className={`join-item btn ${currentStoryPage === i + 1 ? 'btn-active bg-blue-500 text-white' : 'bg-white'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={nextStoryPage}
                  disabled={currentStoryPage === totalStoryPages}
                  className="join-item btn btn-outline hover:bg-blue-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
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
              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Package Name</span>
                  </label>
                  <select className="select select-bordered w-full focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select a Package</option>
                    {bookings.map((pack, i) => (
                      <option key={i} value={pack.title}>
                        {pack.title}
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
                        className="mask mask-star-2 bg-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Experience</span>
                  </label>
                  <textarea
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
                  <button type="submit" className="btn btn-primary hover:bg-blue-600">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
   
        {/* Story Modal */}
        {showStoryModal && (
          <div className="modal modal-open">
            <div className="modal-box relative max-w-2xl p-8 rounded-xl">
              <button
                onClick={() => setShowStoryModal(false)}
                className="btn btn-sm btn-circle absolute right-4 top-4 hover:bg-gray-100"
              >
                <IoClose className="text-gray-500" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Share Your Travel Story
              </h3>
              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Story Title*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newStory.title}
                      onChange={handleInputChange}
                      placeholder="My Amazing Adventure in..."
                      className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Package Name*</span>
                    </label>
                    <select
                      name="location"
                      value={newStory.location}
                      onChange={handleInputChange}
                      className="select select-bordered w-full focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a Package</option>
                      {bookings.map((pack, i) => (
                        <option key={i} value={pack.title}>
                          {pack.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Date*</span>
                    </label>
                    <input
                      type="text"
                      name="date"
                      value={newStory.date}
                      onChange={handleInputChange}
                      placeholder="When was your trip?"
                      className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Your Rating*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {renderStoryStars(newStory.rating)}
                      <span className="text-gray-600">{newStory.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Featured Image</span>
                  </label>
                  {imagePreview ? (
                    <div className="relative mb-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewStory((prev) => ({ ...prev, image: null }));
                          setImagePreview('');
                        }}
                        className="btn btn-circle btn-sm absolute top-2 right-2 hover:bg-gray-100"
                      >
                        <IoClose className="text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <FaImage className="text-3xl text-gray-400 mb-2" />
                      <span className="text-gray-500">
                        Upload a photo from your trip
                      </span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Story*</span>
                  </label>
                  <textarea
                    name="content"
                    value={newStory.content}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-40 focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your experience..."
                    required
                  ></textarea>
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-outline hover:bg-gray-50"
                    onClick={() => setShowStoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary hover:bg-blue-600">
                    Publish Story
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