import { useState } from 'react';
import { FaPlus, FaMapMarkerAlt, FaCamera, FaPaperPlane } from 'react-icons/fa';

const GroupTravelPostForm = () => {
  const [postText, setPostText] = useState('');
  const [fields, setFields] = useState([{ activity: '', label: 'Value' }]);
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePhotoUpload = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    const formData = new FormData();
    formData.append('postText', postText);
    fields.forEach((field, index) => {
      formData.append(`activity_${index}`, field.activity);
      formData.append(`label_${index}`, field.label);
    });
    formData.append('location', location);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('/api/group-post', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setPostText('');
        setFields([{ activity: '', label: 'Value' }]);
        setLocation('');
        setPhoto(null);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addField = () => {
    setFields([...fields, { activity: '', label: 'Value' }]);
  };

  const removeField = (index) => {
    if (fields.length > 1) {
      const updated = [...fields];
      updated.splice(index, 1);
      setFields(updated);
    }
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Group Travel Post</h1>
            <p className="text-blue-100 mt-2">Invite others to join your adventure!</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
              <p>Post submitted successfully!</p>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Post Content */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                      <FaPaperPlane className="mr-2 text-blue-500" />
                      Your Travel Story
                    </label>
                    <textarea
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Share your travel plans, experiences, and why others should join you..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Activities Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-4">Trip Activities</h3>
                    
                    {fields.map((field, index) => (
                      <div key={index} className="mb-4 relative group">
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="Activity (e.g., Beach visit)"
                          value={field.activity}
                          onChange={(e) => updateField(index, 'activity', e.target.value)}
                          required
                        />
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addField}
                      className="w-full mt-2 p-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition"
                    >
                      <FaPlus className="mr-2" />
                      Add Activity
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <FaCamera className="mr-2 text-blue-500" />
                  Upload Photo
                </label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {photo ? (
                        <>
                          <span className="text-sm text-gray-500">{photo.name}</span>
                          <span className="text-xs text-gray-500">Click to change</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter location or Google Maps URL"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition flex items-center ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Post Adventure
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTravelPostForm;