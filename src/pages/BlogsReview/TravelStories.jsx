import React, { useState } from "react";
import { FaStar, FaPaperPlane, FaCalendarAlt, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Blogs from "../../../public/Blogs.json";

const TravelStories = ({ bookings, onAddStory }) => {
  const [stories, setStories] = useState(Blogs);
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
  const [imagePreview, setImagePreview] = useState("");

  // Calculate pagination for stories
  const indexOfLastStory = currentStoryPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);
  const totalStoryPages = Math.ceil(stories.length / storiesPerPage);

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
    <div className="max-w-7xl mx-auto">
      {/* Stories Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Traveler Stories</h2>
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
                      className={`text-sm ${
                        i < story.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
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
              onClick={() => setCurrentStoryPage(i + 1)}
              className={`join-item btn ${
                currentStoryPage === i + 1
                  ? "btn-active bg-blue-500 text-white"
                  : "bg-white"
              }`}
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
                        setImagePreview("");
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
                <button
                  type="submit"
                  className="btn btn-primary hover:bg-blue-600"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelStories;