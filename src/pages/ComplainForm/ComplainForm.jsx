import { useEffect, useState } from "react";
import {
  FaSearch,
  FaStar,
  FaPaperclip,
  FaPaperPlane,
  FaInfoCircle,
} from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { BiCheckShield } from "react-icons/bi";
import Banner from "../Home/Banner/Banner";
import axios from "axios";
import useMongoUser from "../../hooks/userMongoUser";

const ComplainForm = () => {
  const [hostId, setHostId] = useState("");
  const [complainText, setComplainText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {mongoUser} = useMongoUser();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSearch = async () => {
    if (!hostId.trim()) {
      alert("Please enter a Tour ID");
      return;
    }
  
    try {
      const res = await axios.get(`http://localhost:5000/group-tours/${hostId}`);
      setSearchResult(res.data);
    } catch (err) {
      console.error("Tour fetch error:", err);
      alert("No tour package found with that ID");
      setSearchResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!hostId || !complainText) {
      alert("Please fill in all required fields");
      return;
    }

    const complaintData = {
        tourId: hostId,
        complaint: complainText,
        fileName: fileName,
        date: new Date().toISOString(),
        user: {
          name: mongoUser?.userName,
          email: mongoUser?.userMail,
          photo: mongoUser?.userPhoto
        }
      };
      

    try {
        const res = await fetch("http://localhost:5000/complain", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(complaintData),
          });

      if (res.ok) {
        alert("Complaint submitted successfully!");
        // Reset form
        setHostId("");
        setComplainText("");
        setFile(null);
        setFileName("");
        setSearchResult(null);
      } else {
        throw new Error(res.statusText || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Banner
        bgImage="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        heading="We are here to help"
        text="Faced any issue while on tour? Let us know and we're here to help"
      />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20 max-w-4xl">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 hover:shadow-2xl border border-blue-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaSearch className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Find Your Tour Package
            </h2>
            <p className="text-gray-600">
              Enter your Tour ID to locate your booking
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="relative">
                <input
                  className="input input-bordered w-full pl-12 focus:ring-2 focus:ring-blue-500"
                  placeholder="123456"
                  type="text"
                  value={hostId}
                  onChange={(e) => setHostId(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-lg" />
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary min-w-[180px]"
              onClick={handleSearch}
              disabled={!hostId.trim()}
            >
              Search Package
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in border border-green-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-green-500 ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        searchResult.profileImage || "https://placehold.co/200"
                      }
                      alt={searchResult.organizer}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {searchResult.title || "Tour Package"}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {searchResult.type}
                    </p>
                  </div>
                  <div className="badge badge-success gap-1">
                    <BiCheckShield /> Verified
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="flex mr-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < (searchResult.rating || 0)
                              ? ""
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-700">
                      {searchResult.rating || 0} Stars
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-2">
                      Price:
                    </span>
                    <span className="text-green-600 font-bold">
                      {searchResult.price || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-2">
                      From:
                    </span>
                    <span>{searchResult.from || "N/A"}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-2">To:</span>
                    <span>{searchResult.to || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100 ">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <IoIosAlert className="text-red-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              File Your Complaint
            </h2>
            <p className="text-gray-600">
              Please describe your issue in detail
            </p>
          </div>

          <div className="space-y-6">
            <div className="form-control grid grid-rows-1 gap-4">
              <label className="label">
                <span className="label-text font-medium">
                  Complaint Details
                </span>
                <span className="label-text-alt text-red-500">* Required</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-48 w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the issue you encountered during your tour..."
                value={complainText}
                onChange={(e) => setComplainText(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Supporting Documents
                </span>
                <span className="label-text-alt">Optional</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="btn btn-outline border-gray-300 hover:border-gray-400">
                  <FaPaperclip className="mr-2" />
                  {fileName ? "Change File" : "Attach File"}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
                {fileName && (
                  <div className="flex-1 flex items-center">
                    <span className="text-gray-700 truncate max-w-xs">
                      {fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileName("");
                      }}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      Ã—
                    </button>
                  </div>
                )}
              </div>
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  <FaInfoCircle className="inline mr-1" />
                  Max 5MB (PDF, JPG, PNG)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="text-center">
          <button
            className={`btn btn-primary px-12 ${isSubmitting ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={!hostId || !complainText || isSubmitting}
          >
            {!isSubmitting && <FaPaperPlane className="mr-2" />}
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>

          <div className="mt-6 text-sm text-gray-500">
            <p>We typically respond to complaints within 24-48 hours</p>
            <p>Your information will be kept confidential</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplainForm;
