import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ComplaintsList = () => {
  const axiosSecure = useAxiosSecure();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosSecure.get("/complains");
        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [axiosSecure]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    document.getElementById("complaint_modal").showModal();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">User Complaints</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((c) => (
            <div key={c._id} className="card bg-base-200 shadow-xl text-white">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <img
                    src={c.user.photo}
                    alt="User"
                    className="w-12 h-12 rounded-full border border-primary"
                  />
                  <div>
                    <h3 className="font-semibold">{c.user.name}</h3>
                    <p className="text-sm text-gray-400">{c.user.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 line-clamp-2">"{c.complaint}"</p>
                <p className="text-sm text-gray-400">Date: {new Date(c.date).toLocaleDateString()}</p>
                <div className="card-actions justify-end mt-3">
                  <button onClick={() => openModal(c)} className="btn btn-outline btn-primary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DaisyUI Modal */}
      <dialog id="complaint_modal" className="modal">
        <div className="modal-box bg-base-200 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white">✕</button>
          </form>

          {selectedComplaint && (
            <>
              <h3 className="font-bold text-lg mb-2">Complaint from {selectedComplaint.user.name}</h3>
              <p><strong>Email:</strong> {selectedComplaint.user.email}</p>
              <p className="mt-2"><strong>Tour ID:</strong> {selectedComplaint.tourId}</p>
              <p className="mt-2"><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleString()}</p>
              <p className="mt-2"><strong>Complaint:</strong> {selectedComplaint.complaint}</p>

              <div className="mt-4">
                <img
                  src={selectedComplaint.fileName}
                  alt="Attached"
                  className="w-full rounded-md border border-primary"
                />
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default ComplaintsList;
