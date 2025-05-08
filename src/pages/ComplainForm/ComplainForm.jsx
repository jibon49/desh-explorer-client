import { useEffect, useState, useContext } from "react";
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
import useMongoUser from "../../hooks/userMongoUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { AuthContext } from "../../Authproviders/AuthProviders";
import axios from "axios";

const ComplainForm = () => {
  const { user } = useContext(AuthContext);
  const [tourId, setTourId] = useState("");
  const [complainText, setComplainText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const { mongoUser } = useMongoUser();
  const axiosSecure = useAxiosSecure();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File too large",
          text: "Maximum file size is 5MB",
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Only JPG, PNG, and PDF files are allowed",
        });
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSearch = async () => {
    if (!tourId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Tour ID required",
        text: "Please enter a Tour ID to search",
      });
      return;
    }

    setSearching(true);
    try {
      // Search in both collections 
      const [groupTourRes, packageRes] = await Promise.all([
        axiosSecure.get(`/group-tours/${tourId}`).catch(() => ({ data: null })),
        axiosSecure.get(`/tourDetails/${tourId}`).catch(() => ({ data: null })),
      ]);

      if (groupTourRes?.data) {
        setSearchResult({
          ...groupTourRes.data,
          type: "Group Tour",
          collection: "group-tours",
        });
      } else if (packageRes?.data) {
        setSearchResult({
          ...packageRes.data,
          type: "Tour Package",
          collection: "tourPackages",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Not found",
          text: "No tour found with that ID",
        });
        setSearchResult(null);
      }
    } catch (err) {
      console.error("Tour fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "Search failed",
        text: "Error searching for tour. Please check the ID format.",
      });
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!tourId || !complainText) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill in all required fields",
      });
      return;
    }

    if (complainText.length < 20) {
      Swal.fire({
        icon: "warning",
        title: "Description too short",
        text: "Please provide more details about your complaint (minimum 20 characters)",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First upload the image if one was selected
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

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

      const complaintData = {
        tourId,
        tourType: searchResult?.collection || "unknown",
        complaint: complainText,
        fileName: imageUrl || "",
        date: new Date().toISOString(),
        user: {
          name: mongoUser?.userName,
          email: mongoUser?.userMail,
          photo: mongoUser?.userPhoto,
        },
      };

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Submit complaint?",
        text: "Are you sure you want to submit this complaint?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit it!",
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.post("/complains", complaintData);
        if (res.data.insertedId) {
          await Swal.fire({
            icon: "success",
            title: "Complaint submitted!",
            text: "Your complaint has been received. We'll get back to you soon.",
            showConfirmButton: false,
            timer: 2000,
          });

          // Reset form
          setTourId("");
          setComplainText("");
          setFile(null);
          setFileName("");
          setSearchResult(null);
        } else {
          throw new Error(res.data.message || "Failed to submit complaint");
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: err.message || "An error occurred while submitting your complaint",
      });
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
              Enter your Tour ID to locate your booking (search in both Group
              Tours and Tour Packages)
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="relative">
                <input
                  className="input input-bordered w-full pl-12 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Tour ID"
                  type="text"
                  value={tourId}
                  onChange={(e) => setTourId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-lg" />
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary min-w-[180px]"
              onClick={handleSearch}
              disabled={!tourId.trim() || searching}
            >
              {searching ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Search Tour"
              )}
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
                        searchResult.profileImage ||
                        searchResult.image ||
                        "https://placehold.co/200"
                      }
                      alt={searchResult.title}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200";
                      }}
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
                    <div className="flex items-center gap-2">
                      <p className="text-blue-600 font-medium">
                        {searchResult.type}
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {searchResult.collection === "group-tours"
                          ? "Group Tour"
                          : "Tour Package"}
                      </span>
                    </div>
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
                      ${searchResult.price || "N/A"}
                    </span>
                  </div>

                  {searchResult.from && (
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">
                        From:
                      </span>
                      <span>{searchResult.from}</span>
                    </div>
                  )}

                  {searchResult.to && (
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">
                        To:
                      </span>
                      <span>{searchResult.to}</span>
                    </div>
                  )}

                  {searchResult.duration && (
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">
                        Duration:
                      </span>
                      <span>{searchResult.duration}</span>
                    </div>
                  )}

                  {searchResult.location && (
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">
                        Location:
                      </span>
                      <span>{searchResult.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Form */}
        {searchResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-red-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <IoIosAlert className="text-red-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                File Your Complaint
              </h2>
              <p className="text-gray-600">
                Please describe your issue with {searchResult.title}
              </p>
            </div>

            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Complaint Details
                  </span>
                  <span className="label-text-alt text-red-500">
                    * Required
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-48 w-full focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the issue you encountered during your tour..."
                  value={complainText}
                  onChange={(e) => setComplainText(e.target.value)}
                  required
                  minLength={20}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Minimum 20 characters
                  </span>
                  <span className="label-text-alt">
                    {complainText.length}/1000
                  </span>
                </label>
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
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {file && (
                  <div className="mt-2">
                    <div className="avatar">
                      <div className="w-16 rounded">
                        <img src={URL.createObjectURL(file)} alt="Preview" />
                      </div>
                    </div>
                  </div>
                )}
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    <FaInfoCircle className="inline mr-1" />
                    Max 5MB (PDF, JPG, PNG)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Section */}
        {searchResult && (
          <div className="text-center">
            <button
              className={`btn btn-primary px-12 ${
                isSubmitting ? "loading" : ""
              }`}
              onClick={handleSubmit}
              disabled={!tourId || !complainText || isSubmitting || complainText.length < 20}
            >
              {!isSubmitting && <FaPaperPlane className="mr-2" />}
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>

            <div className="mt-6 text-sm text-gray-500">
              <p>We typically respond to complaints within 24-48 hours</p>
              <p>Your information will be kept confidential</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplainForm;