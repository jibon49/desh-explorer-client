import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Authproviders/AuthProviders";
import useMongoUser from "../../hooks/userMongoUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PostTour = () => {
  const { user } = useContext(AuthContext);
  const { mongoUser } = useMongoUser();
  const axiosSecure = useAxiosSecure();

  const [tourData, setTourData] = useState({
    title: '',
    ratings: 5,
    image: '',
    type: '',
    duration: '',
    date: '',
    price: '',
    overview: '',
    location: '',
    from: '',
    timing: '',
    inclusion: [''],
    exclusion: [''],
    description: '',
    additionalInfo: '',
    travelTips: [''],
    policy: {
      cancellation: '',
      reschedule: '',
      refund: ''
    }
  });

  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePolicyChange = (e) => {
    const { name, value } = e.target;
    setTourData(prev => ({
      ...prev,
      policy: {
        ...prev.policy,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (e, arrayName, index) => {
    const { value } = e.target;
    setTourData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const addArrayField = (arrayName) => {
    setTourData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayField = (arrayName, index) => {
    setTourData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  const resetForm = () => {
    setTourData({
      title: '',
      ratings: 5,
      image: '',
      type: '',
      duration: '',
      date: '',
      price: '',
      overview: '',
      location: '',
      from: '',
      timing: '',
      inclusion: [''],
      exclusion: [''],
      description: '',
      additionalInfo: '',
      travelTips: [''],
      policy: {
        cancellation: '',
        reschedule: '',
        refund: ''
      }
    });
    setPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageUrl = tourData.image;

    try {
      // Upload image if new photo is selected
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`,
          formData
        );

        if (imgRes.data.success) {
          imageUrl = imgRes.data.data.display_url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Prepare tour data
      const newTour = {
        ...tourData,
        image: imageUrl,
        createdBy: {
          name: mongoUser?.userName || "",
          email: mongoUser?.userMail || "",
          photo: mongoUser?.userPhoto || "",
          phone: mongoUser?.userPhone || "N/A",
          role: mongoUser?.userRole || "member",
        },
      };

      // Submit to backend
      const response = await axiosSecure.post('/api/tourPackages', newTour);

      if (response.data.insertedId) {
        // Show success alert
        await Swal.fire({
          title: 'Success!',
          text: 'Tour package created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          didClose: () => {
            resetForm();
          }
        });
      } else {
        throw new Error('Failed to create tour');
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      
      // Show error alert
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create tour package',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-3xl font-bold">Create New Tour Package</h1>
            <p className="opacity-90 mt-1">
              Fill in the details below to add a new tour
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Tour Title*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={tourData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Tour Type*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={tourData.type}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Duration*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={tourData.duration}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date*</span>
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={tourData.date}
                    onChange={handleChange}
                    className="input input-bordered w-full"
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
                      name="price"
                      value={tourData.price}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-8"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Location Details</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Overview*</span>
                  </label>
                  <textarea
                    name="overview"
                    value={tourData.overview}
                    onChange={handleChange}
                    rows="3"
                    className="textarea textarea-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Location*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={tourData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Departure From*</span>
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={tourData.from}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Timing*</span>
                  </label>
                  <input
                    type="text"
                    name="timing"
                    value={tourData.timing}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
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
                {!photo && tourData.image && (
                  <div className="avatar">
                    <div className="w-12 rounded">
                      <img src={tourData.image} alt="Current" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Inclusions
                  </h3>
                  {tourData.inclusion.map((item, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={item}
                        onChange={(e) => handleArrayChange(e, 'inclusion', idx)}
                        placeholder={`Inclusion ${idx + 1}`}
                      />
                      {tourData.inclusion.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('inclusion', idx)}
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
                    onClick={() => addArrayField('inclusion')}
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
                    Add Inclusion
                  </button>
                </div>
              </div>

              <div className="space-y-4">
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
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Exclusions
                  </h3>
                  {tourData.exclusion.map((item, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={item}
                        onChange={(e) => handleArrayChange(e, 'exclusion', idx)}
                        placeholder={`Exclusion ${idx + 1}`}
                      />
                      {tourData.exclusion.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('exclusion', idx)}
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
                    onClick={() => addArrayField('exclusion')}
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
                    Add Exclusion
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Additional Info */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description*</span>
              </label>
              <textarea
                name="description"
                value={tourData.description}
                onChange={handleChange}
                rows="4"
                className="textarea textarea-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Additional Information*</span>
              </label>
              <textarea
                name="additionalInfo"
                value={tourData.additionalInfo}
                onChange={handleChange}
                rows="3"
                className="textarea textarea-bordered"
                required
              />
            </div>

            {/* Travel Tips */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Travel Tips
                </h3>
                {tourData.travelTips.map((item, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      value={item}
                      onChange={(e) => handleArrayChange(e, 'travelTips', idx)}
                      placeholder={`Travel tip ${idx + 1}`}
                    />
                    {tourData.travelTips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('travelTips', idx)}
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
                  onClick={() => addArrayField('travelTips')}
                  className="btn btn-ghost btn-sm mt-2 text-yellow-600"
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
                  Add Travel Tip
                </button>
              </div>
            </div>

            {/* Policy */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Cancellation Policy</h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Cancellation Terms*</span>
                </label>
                <input
                  type="text"
                  name="cancellation"
                  value={tourData.policy.cancellation}
                  onChange={handlePolicyChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Reschedule Terms*</span>
                </label>
                <input
                  type="text"
                  name="reschedule"
                  value={tourData.policy.reschedule}
                  onChange={handlePolicyChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Refund Terms*</span>
                </label>
                <input
                  type="text"
                  name="refund"
                  value={tourData.policy.refund}
                  onChange={handlePolicyChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="btn btn-primary px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Tour Package
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
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostTour;