import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage, FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';

const EditTourPackages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  const [tourData, setTourData] = useState({
    title: '',
    image: '',
    type: '',
    duration: '',
    date: '',
    price: 0,
    overview: '',
    location: '',
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

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setIsLoading(true);
        // Fetch tour data from your API
        const response = await fetch(`/api/tours/${id}`);
        if (!response.ok) throw new Error('Failed to fetch tour data');
        
        const data = await response.json();
        setTourData(data);
        setImagePreview(data.image);
      } catch (error) {
        console.error('Error fetching tour:', error);
        alert('Error loading tour data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTourData();
  }, [id]);

  const handleInputChange = (e) => {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTourData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleListChange = (index, value, field) => {
    setTourData(prev => {
      const updatedList = [...prev[field]];
      updatedList[index] = value;
      return { ...prev, [field]: updatedList };
    });
  };

  const addListItem = (field) => {
    setTourData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (index, field) => {
    if (tourData[field].length > 1) {
      setTourData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', tourData.title);
      formData.append('type', tourData.type);
      formData.append('duration', tourData.duration);
      formData.append('date', tourData.date);
      formData.append('price', tourData.price);
      formData.append('overview', tourData.overview);
      formData.append('location', tourData.location);
      formData.append('timing', tourData.timing);
      formData.append('description', tourData.description);
      formData.append('additionalInfo', tourData.additionalInfo);
      
      // Append policy
      formData.append('policy[cancellation]', tourData.policy.cancellation);
      formData.append('policy[reschedule]', tourData.policy.reschedule);
      formData.append('policy[refund]', tourData.policy.refund);

      // Append arrays
      tourData.inclusion.forEach((item, index) => formData.append(`inclusion[${index}]`, item));
      tourData.exclusion.forEach((item, index) => formData.append(`exclusion[${index}]`, item));
      tourData.travelTips.forEach((item, index) => formData.append(`travelTips[${index}]`, item));

      // Append image if it's a new file
      if (typeof tourData.image !== 'string') {
        formData.append('image', tourData.image);
      } else {
        formData.append('imageUrl', tourData.image);
      }

      const endpoint = id ? `/api/tours/${id}` : '/api/tours';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        body: formData
      });

      if (!response.ok) throw new Error('Failed to save tour');

      const result = await response.json();
      alert(id ? 'Tour updated successfully!' : 'Tour created successfully!');
      navigate(`/admin/manage-tours`);
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error saving tour: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tour package?')) return;

    try {
      const response = await fetch(`/api/tours/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete tour');

      alert('Tour deleted successfully!');
      navigate('/admin/manage-tours');
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error deleting tour: ' + error.message);
    }
  };

  if (isLoading && id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {id ? 'Edit Tour Package' : 'Create New Tour Package'}
          </h1>
          {id && (
            <button
              onClick={handleDelete}
              className="btn btn-error text-white"
            >
              <FaTrash className="mr-2" />
              Delete Tour
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tour Title*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={tourData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Saint Martin Tour"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tour Type*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  value={tourData.type}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Chill, Adventure, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Duration*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={tourData.duration}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="2 Night 3 Day"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date*</span>
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={tourData.date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="20.5.23"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price*</span>
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={tourData.price}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="850"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Overview*</span>
                </label>
                <textarea
                  name="overview"
                  value={tourData.overview}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Brief description of the tour"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Location*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={tourData.location}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="Saint Martin, Bangladesh"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Timing*</span>
                </label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="timing"
                    value={tourData.timing}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="08:00 AM - 06:00 PM Daily"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Images and Additional Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Image & Additional Information
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tour Image</span>
                </label>
                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Tour Preview"
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                  </div>
                )}
                <label className="btn btn-outline w-full">
                  <FaImage className="mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description*</span>
                </label>
                <textarea
                  name="description"
                  value={tourData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32"
                  placeholder="Detailed description of the tour"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Additional Information</span>
                </label>
                <textarea
                  name="additionalInfo"
                  value={tourData.additionalInfo}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Important notes for travelers"
                />
              </div>
            </div>
          </div>

          {/* Inclusion Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              What's Included
            </h2>
            {tourData.inclusion.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(index, e.target.value, 'inclusion')}
                  className="input input-bordered flex-1"
                  placeholder={`Included item ${index + 1}`}
                />
                {tourData.inclusion.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'inclusion')}
                    className="btn btn-ghost btn-sm ml-2 text-red-500"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('inclusion')}
              className="btn btn-ghost btn-sm mt-2 text-green-600"
            >
              <FaPlus className="mr-1" />
              Add Inclusion
            </button>
          </div>

          {/* Exclusion Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              What's Not Included
            </h2>
            {tourData.exclusion.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange(index, e.target.value, 'exclusion')}
                  className="input input-bordered flex-1"
                  placeholder={`Excluded item ${index + 1}`}
                />
                {tourData.exclusion.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'exclusion')}
                    className="btn btn-ghost btn-sm ml-2 text-red-500"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('exclusion')}
              className="btn btn-ghost btn-sm mt-2 text-red-600"
            >
              <FaPlus className="mr-1" />
              Add Exclusion
            </button>
          </div>

          {/* Travel Tips Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Travel Tips
            </h2>
            {tourData.travelTips.map((tip, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => handleListChange(index, e.target.value, 'travelTips')}
                  className="input input-bordered flex-1"
                  placeholder={`Travel tip ${index + 1}`}
                />
                {tourData.travelTips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, 'travelTips')}
                    className="btn btn-ghost btn-sm ml-2 text-red-500"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('travelTips')}
              className="btn btn-ghost btn-sm mt-2 text-blue-600"
            >
              <FaPlus className="mr-1" />
              Add Travel Tip
            </button>
          </div>

          {/* Policy Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Tour Policies
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Cancellation Policy</span>
                </label>
                <div className="relative">
                  <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="cancellation"
                    value={tourData.policy.cancellation}
                    onChange={handlePolicyChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="Free cancellation up to 7 days before departure"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Reschedule Policy</span>
                </label>
                <div className="relative">
                  <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="reschedule"
                    value={tourData.policy.reschedule}
                    onChange={handlePolicyChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="One-time reschedule allowed up to 3 days prior"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Refund Policy</span>
                </label>
                <div className="relative">
                  <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="refund"
                    value={tourData.policy.refund}
                    onChange={handlePolicyChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="Full refund if canceled within the allowed period"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : id ? (
                'Update Tour'
              ) : (
                'Create Tour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTourPackages;