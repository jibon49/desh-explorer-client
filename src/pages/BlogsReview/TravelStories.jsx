import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaPaperPlane,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaTimes,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useMongoUser from "../../hooks/userMongoUser";

const TravelStories = () => {
  const { mongoUser } = useMongoUser();
  const axiosSecure = useAxiosSecure();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryPage, setCurrentStoryPage] = useState(1);
  const storiesPerPage = 6;
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [newStory, setNewStory] = useState({
    title: "",
    location: "",
    date: "",
    rating: 0,
    image: null,
    content: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [activeCommentStory, setActiveCommentStory] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Fetch stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axiosSecure.get("/stories");
        setStories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };
    fetchStories();
  }, [axiosSecure]);

  // Calculate pagination for stories
  const indexOfLastStory = currentStoryPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);
  const totalStoryPages = Math.ceil(stories.length / storiesPerPage);

  const renderStoryStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-xl ${i < count ? "text-yellow-400" : "text-gray-300"}`}
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

  const handleLike = async (storyId) => {
    if (!mongoUser?._id) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to like stories",
      });
      return;
    }

    try {
      await axiosSecure.patch(`/stories/${storyId}/like`, {
        userId: mongoUser._id,
      });
      setStories(
        stories.map((story) => {
          if (story._id === storyId) {
            const isLiked = story.likes?.includes(mongoUser._id);
            return {
              ...story,
              likes: isLiked
                ? story.likes.filter((id) => id !== mongoUser._id)
                : [...(story.likes || []), mongoUser._id],
            };
          }
          return story;
        })
      );

      // Update selected story if it's the one being liked
      if (selectedStory?._id === storyId) {
        setSelectedStory((prev) => {
          const isLiked = prev.likes?.includes(mongoUser._id);
          return {
            ...prev,
            likes: isLiked
              ? prev.likes.filter((id) => id !== mongoUser._id)
              : [...(prev.likes || []), mongoUser._id],
          };
        });
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleCommentSubmit = async (storyId) => {
    if (!commentText.trim()) return;
    if (!mongoUser?._id) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to add comments",
      });
      return;
    }

    try {
      const response = await axiosSecure.post(`/stories/${storyId}/comments`, {
        userId: mongoUser._id,
        text: commentText,
        userName: mongoUser.userName,
        userPhoto: mongoUser.userPhoto,
      });

      setStories(
        stories.map((story) => {
          if (story._id === storyId) {
            return {
              ...story,
              comments: [
                ...(story.comments || []),
                {
                  userId: mongoUser._id,
                  text: commentText,
                  userName: mongoUser.userName,
                  userPhoto: mongoUser.userPhoto,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
          return story;
        })
      );

      // Update selected story if it's the one being commented on
      if (selectedStory?._id === storyId) {
        setSelectedStory((prev) => ({
          ...prev,
          comments: [
            ...(prev.comments || []),
            {
              userId: mongoUser._id,
              text: commentText,
              userName: mongoUser.userName,
              userPhoto: mongoUser.userPhoto,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      }

      setCommentText("");
      setActiveCommentStory(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();

    if (!mongoUser?._id) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to share stories",
      });
      return;
    }

    let imageUrl = "";

    // Upload image if exists
    if (newStory.image) {
      const formData = new FormData();
      formData.append("image", newStory.image);

      try {
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGE_HOSTING_KEY
          }`,
          formData
        );

        if (imgRes.data.success) {
          imageUrl = imgRes.data.data.display_url;
        } else {
          Swal.fire({
            icon: "error",
            title: "Image Upload Failed",
            text: "Please try again.",
          });
          return;
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "Please try again.",
        });
        return;
      }
    }

    const storyData = {
      title: newStory.title,
      location: newStory.location,
      date: newStory.date,
      rating: newStory.rating,
      content: newStory.content,
      image: imageUrl || "https://placehold.co/600x400",
      author: {
        id: mongoUser._id,
        name: mongoUser.userName,
        photo: mongoUser.userPhoto,
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.post("/stories", storyData);
      if (response.data.insertedId) {
        setStories([
          { ...storyData, _id: response.data.insertedId },
          ...stories,
        ]);
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
        Swal.fire({
          icon: "success",
          title: "Story Published!",
          text: "Your travel story has been shared successfully.",
        });
        setCurrentStoryPage(1);
      }
    } catch (error) {
      console.error("Error submitting story:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to publish your story. Please try again.",
      });
    }
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setShowDetailModal(true);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stories Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Traveler Stories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto my-4">
          Share your adventures and inspire fellow travelers with your
          experiences
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
            key={story._id}
            className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group hover:-translate-y-1 cursor-pointer"
            onClick={() => handleStoryClick(story)}
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
                <div className="flex">{renderStoryStars(story.rating)}</div>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <FaCalendarAlt className="mr-2" />{" "}
                {new Date(story.date).toLocaleDateString()}
              </div>
              <p className="text-gray-600 line-clamp-3">{story.content}</p>

              {/* Author Info */}
              <div className="flex items-center mt-4 gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={story.author?.photo || "https://placehold.co/50"}
                      alt={story.author?.name}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {story.author?.name}
                </span>
              </div>

              {/* Like and Comment Section */}
              <div className="flex justify-between items-center mt-4 border-t pt-3">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(story._id);
                  }}
                >
                  {story.likes?.includes(mongoUser?._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{story.likes?.length || 0}</span>
                </button>

                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentStory(
                      activeCommentStory === story._id ? null : story._id
                    );
                  }}
                >
                  {activeCommentStory === story._id ? (
                    <FaComment />
                  ) : (
                    <FaRegComment />
                  )}
                  <span>{story.comments?.length || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentStory === story._id && (
                <div
                  className="mt-4 border-t pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-40 overflow-y-auto mb-2">
                    {story.comments?.map((comment, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <div className="flex items-start gap-2">
                          <div className="avatar">
                            <div className="w-6 rounded-full">
                              <img
                                src={
                                  comment.userPhoto || "https://placehold.co/30"
                                }
                                alt={comment.userName}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {comment.userName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="input input-bordered input-sm flex-1"
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleCommentSubmit(story._id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
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

      {/* Story Creation Modal */}
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
                    <span className="label-text font-medium">Location*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newStory.location}
                    onChange={handleInputChange}
                    placeholder="Where did you go?"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newStory.date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Your Rating*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xl cursor-pointer ${
                          i < newStory.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleStoryRating(i + 1)}
                      />
                    ))}
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

      {/* Story Detail Modal */}
      {showDetailModal && selectedStory && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-4xl p-0 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDetailModal(false)}
              className="btn btn-sm btn-circle absolute right-4 top-4 z-10 hover:bg-gray-100"
            >
              <FaTimes className="text-gray-500" />
            </button>

            {/* Story Image */}
            <figure className="relative h-96 w-full">
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedStory.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> {selectedStory.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />{" "}
                      {new Date(selectedStory.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      {renderStoryStars(selectedStory.rating)}
                    </span>
                  </div>
                </div>
              </div>
            </figure>

            {/* Story Content */}
            <div className="p-6">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={
                        selectedStory.author?.photo || "https://placehold.co/50"
                      }
                      alt={selectedStory.author?.name}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{selectedStory.author?.name}</h3>
                  <p className="text-sm text-gray-500">
                    Posted on{" "}
                    {new Date(selectedStory.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Story Text */}
              <div className="prose max-w-none mb-8">
                {selectedStory.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Like and Comment Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="flex items-center gap-2 btn btn-ghost"
                    onClick={() => handleLike(selectedStory._id)}
                  >
                    {selectedStory.likes?.includes(mongoUser?._id) ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                    <span>{selectedStory.likes?.length || 0} Likes</span>
                  </button>

                  <button
                    className="flex items-center gap-2 btn btn-ghost"
                    onClick={() =>
                      setActiveCommentStory(
                        activeCommentStory === selectedStory._id
                          ? null
                          : selectedStory._id
                      )
                    }
                  >
                    <FaRegComment className="text-xl" />
                    <span>{selectedStory.comments?.length || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentStory === selectedStory._id && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-3">Comments</h3>

                    
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto p-2">
                      {selectedStory.comments?.length > 0 ? (
                        selectedStory.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            {" "}
                            
                            <div className="avatar flex-none">
                              {" "}
                              
                              <div className="w-10 rounded-full">
                                <img
                                  src={
                                    comment.userPhoto ||
                                    "https://placehold.co/40"
                                  }
                                  alt={comment.userName}
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              {" "}
                              
                              <div className="bg-gray-100 rounded-lg p-3">
                                <h4 className="font-medium">
                                  {comment.userName}
                                </h4>
                                <p className="text-gray-700 break-words">
                                  {" "}
                                 
                                  {comment.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No comments yet
                        </p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={
                              mongoUser?.userPhoto || "https://placehold.co/40"
                            }
                            alt={mongoUser?.userName}
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="input input-bordered flex-1"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCommentSubmit(selectedStory._id)}
                        disabled={!commentText.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelStories;
