import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../Authproviders/AuthProviders";
import useMongoUser from "../../hooks/userMongoUser";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";

const GroupTravelPostForm = () => {
  const { user } = useContext(AuthContext);
  const { mongoUser } = useMongoUser(); // Assuming you have a custom hook to fetch MongoDB user data

  const [postText, setPostText] = useState("");
  const [itinerary, setItinerary] = useState([""]);
  const [rules, setRules] = useState([""]);
  const [title, setTitle] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [price, setPrice] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [photo, setPhoto] = useState(null);
  const [slots, setSlots] = useState(""); // Added slots state
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const handlePhotoUpload = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (photo) {
      const formData = new FormData();
      formData.append("image", photo);

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
          alert("Failed to upload image");
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Image upload failed.");
        return;
      }
    }

    const newTour = {
      title,
      from: fromLocation,
      to: toLocation,
      organizer,
      details: postText,
      price: parseFloat(price),
      map: mapLink,
      departureDate,
      returnDate,
      itinerary,
      rules,
      profileImage: imageUrl,
      availableSlots: parseInt(slots) || 10, // Default to 10 if not provided
      rating: 5,
      images: [imageUrl],
      createdBy: {
        name: mongoUser?.userName || "",
        email: mongoUser?.userMail || "",
        photo: mongoUser?.userPhoto || "",
        phone: mongoUser?.userPhone || "N/A",
        role: mongoUser?.userRole || "member",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/group-tours",
        newTour
      );
      if (response.data.insertedId) {
        alert("Tour post created successfully!");
        // Reset all form fields
        setTitle("");
        setFromLocation("");
        setToLocation("");
        setOrganizer("");
        setPostText("");
        setPrice("");
        setMapLink("");
        setItinerary([""]);
        setRules([""]);
        setPhoto(null);
        setSlots(""); // Reset slots to default value
      } else {
        throw new Error("Post failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting post.");
    }
  };

  const updateList = (index, value, type) => {
    const updated = type === "itinerary" ? [...itinerary] : [...rules];
    updated[index] = value;
    type === "itinerary" ? setItinerary(updated) : setRules(updated);
  };

  const addListItem = (type) => {
    type === "itinerary"
      ? setItinerary([...itinerary, ""])
      : setRules([...rules, ""]);
  };

  const removeListItem = (index, type) => {
    if (type === "itinerary" && itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index));
    } else if (type === "rules" && rules.length > 1) {
      setRules(rules.filter((_, i) => i !== index));
    }
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  console.log(mongoUser);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-3xl font-bold">Create Group Tour Post</h1>
            <p className="opacity-90 mt-1">
              Share your travel plans with others
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Amazing Mountain Trek"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Organizer</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Your name or company"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">From*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Starting location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">To*</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Destination"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Price*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    className="input input-bordered w-full pl-8"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

           
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departure Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <FiCalendar className="mr-2 text-blue-500" />
                      Departure Date*
                    </span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={departureDate}
                      onChange={(date) => setDepartureDate(date)}
                      selectsStart
                      startDate={departureDate}
                      endDate={returnDate}
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholderText="Select departure date"
                      minDate={new Date()}
                      required
                      dateFormat="MMMM d, yyyy"
                    />
                    <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Return Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center">
                      <FiCalendar className="mr-2 text-blue-500" />
                      Return Date*
                    </span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      selectsEnd
                      startDate={departureDate}
                      endDate={returnDate}
                      minDate={departureDate || new Date()}
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholderText="Select return date"
                      required
                      dateFormat="MMMM d, yyyy"
                      disabled={!departureDate}
                    />
                    <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {departureDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {calculateDuration(departureDate, returnDate)}{" "}
                      days
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tour Details*</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32"
                placeholder="Describe your tour in detail..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Available Slots*
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="10"
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Itinerary
                </h3>
                {itinerary.map((step, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={step}
                      onChange={(e) =>
                        updateList(idx, e.target.value, "itinerary")
                      }
                      placeholder={`Itinerary step ${idx + 1}`}
                    />
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem(idx, "itinerary")}
                        className="btn btn-ghost btn-sm ml-2 text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("itinerary")}
                  className="btn btn-ghost btn-sm mt-2 text-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Step
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Rules & Requirements
                </h3>
                {rules.map((rule, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={rule}
                      onChange={(e) => updateList(idx, e.target.value, "rules")}
                      placeholder={`Rule ${idx + 1}`}
                    />
                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem(idx, "rules")}
                        className="btn btn-ghost btn-sm ml-2 text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("rules")}
                  className="btn btn-ghost btn-sm mt-2 text-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Rule
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cover Photo</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
                {photo && (
                  <div className="avatar">
                    <div className="w-12 rounded">
                      <img src={URL.createObjectURL(photo)} alt="Preview" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary px-8">
                Create Tour Post
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupTravelPostForm;
