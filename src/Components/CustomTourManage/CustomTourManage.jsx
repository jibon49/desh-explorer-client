import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaUmbrellaBeach, FaDollarSign, FaMapMarkerAlt, FaImage, FaPaperPlane } from 'react-icons/fa';

const CustomTourManage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      Swal.fire({
        title: 'Success!',
        text: 'Tour added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6',
      });
      
      setFormData({
        name: '',
        price: '',
        location: '',
        image: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add tour. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="card-body p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUmbrellaBeach className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="card-title text-3xl font-bold text-gray-800">
                  Add New Hotel
                </h2>
                <p className="text-gray-600">
                  Create New Hotel for your custom tour packages.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center">
                    <FaUmbrellaBeach className="mr-2 text-blue-500" />
                    Hotel Name
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Tropical Paradise Resort"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <FaUmbrellaBeach className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center">
                    <FaDollarSign className="mr-2 text-green-500" />
                    Price
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g., 299"
                    value={formData.price}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                  />
                  <FaDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Location
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Bali, Indonesia"
                    value={formData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center">
                    <FaImage className="mr-2 text-purple-500" />
                    Image URL
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <FaImage className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {formData.image && (
                  <div className="mt-4 transition-all duration-300">
                    <div className="label">
                      <span className="label-text font-medium text-gray-700">Image Preview</span>
                    </div>
                    <div className="relative group">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="rounded-lg border-2 border-gray-200 object-cover h-48 w-full transition-all duration-300 group-hover:opacity-90"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && <FaPaperPlane className="mr-2" />}
                  {isSubmitting ? 'Adding New Hotel...' : 'Add Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTourManage;