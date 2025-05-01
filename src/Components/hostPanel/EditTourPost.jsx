import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const EditTourPost = () => {
  const axiosSecure = useAxiosSecure();
  const [tours, setTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axiosSecure.get('/group-tours');
        setTours(res.data);
      } catch (err) {
        console.error('Failed to fetch tours', err);
        Swal.fire('Error', 'Failed to load tours', 'error');
      }
    };
    fetchTours();
  }, [axiosSecure]);

  const handleEditClick = (tour) => {
    setEditingTour(tour);
    setFormData(tour);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    try {
      const { _id, createdBy, ...cleanData } = formData;
      const res = await axiosSecure.patch(`/group-tours/update/${editingTour._id}`, cleanData);

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        Swal.fire('Success', 'Tour updated successfully', 'success');
        setShowModal(false);
        const updatedRes = await axiosSecure.get('/group-tours');
        setTours(updatedRes.data);
      }
    } catch (err) {
      console.error('Failed to update tour', err);
      Swal.fire('Error', err.response?.data?.error || 'Failed to update tour', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Group Tours</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-gray-700">Title</th>
              <th className="text-gray-700">Route</th>
              <th className="text-gray-700">Price</th>
              <th className="text-gray-700">Duration</th>
              <th className="text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id} className="hover:bg-gray-50">
                <td className="font-medium">{tour.title}</td>
                <td>{tour.from} → {tour.to}</td>
                <td>${tour.price}</td>
                <td>
                  {new Date(tour.departureDate).toLocaleDateString()} - 
                  {new Date(tour.returnDate).toLocaleDateString()}
                </td>
                <td>
                  <button 
                    onClick={() => handleEditClick(tour)}
                    className="btn btn-sm btn-primary gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Group Tour</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-circle"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered"
                  value={formData.title || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  name="price"
                  className="input input-bordered"
                  value={formData.price || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">From</span>
                </label>
                <input
                  type="text"
                  name="from"
                  className="input input-bordered"
                  value={formData.from || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">To</span>
                </label>
                <input
                  type="text"
                  name="to"
                  className="input input-bordered"
                  value={formData.to || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Departure Date</span>
                </label>
                <input
                  type="date"
                  name="departureDate"
                  className="input input-bordered"
                  value={formData.departureDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Return Date</span>
                </label>
                <input
                  type="date"
                  name="returnDate"
                  className="input input-bordered"
                  value={formData.returnDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2 space-y-4">
                {['itinerary', 'rules'].map((field) => (
                  <div key={field} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium capitalize">{field}</h4>
                      <button
                        onClick={() => addArrayItem(field)}
                        className="btn btn-sm btn-primary"
                      >
                        <FaPlus /> Add Item
                      </button>
                    </div>
                    {formData[field]?.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={item}
                          onChange={(e) => handleArrayChange(index, e.target.value, field)}
                        />
                        <button
                          onClick={() => removeArrayItem(index, field)}
                          className="btn btn-error btn-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-action mt-6">
              <button onClick={handleSave} className="btn btn-primary gap-2">
                <FaSave /> Save Changes
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTourPost;
