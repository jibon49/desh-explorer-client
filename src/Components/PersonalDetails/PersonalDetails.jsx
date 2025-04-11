import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Authproviders/Authproviders";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCrown,
  FaUserShield,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
const PersonalDetails = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    userPhone: "",
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.email) return;

        setLoading(true);
        const token = localStorage.getItem("access-token");
        const response = await axios.get(
          `http://localhost:5000/users/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const matchedUser = response.data[0];

        if (matchedUser) {
          setUserInfo(matchedUser);
          setFormData({
            userName: matchedUser.userName,
            userMail: matchedUser.userMail,
            userPhone: matchedUser.userPhone,
          });
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/users/${userInfo.userMail}`,
        {
          userName: formData.userName,
          userPhone: formData.userPhone,
        }
      );
      console.log("✅ User updated:", res.data);
      setUserInfo((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
      if (res.data.modifiedCount) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Profile Updated",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Updated korsi");
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
      setError("❌ Failed to update user information.");
    }
  };

  const handleCancel = () => {
    setFormData({
      userName: userInfo.userName,
      userMail: userInfo.userMail,
      userPhone: userInfo.userPhone,
    });
    setEditMode(false);
    setError(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          {error}
        </div>
      </div>
    );

  if (!userInfo)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded max-w-md">
          No user data available
        </div>
      </div>
    );
  console.log(userInfo);

  return (
    <div className="font-roboto bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      {/* Header */}
      <header className="relative">
        <div className="w-full h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute top-0 left-0 w-full h-full bg-color-site-main bg-opacity-30 flex flex-col items-center justify-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wide">
              DESHEXPLORER
            </h1>
            <div className="mt-6 flex flex-col md:flex-row items-center">
              <div className="relative">
                <img
                  src={userInfo.userPhoto || "https://via.placeholder.com/150"}
                  alt="User avatar"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg"
                />
                {editMode && (
                  <button className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition">
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  {userInfo.userName}
                </h2>
                <p className="text-gray-200 text-sm md:text-base">
                  {userInfo.userMail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 mt-12 md:mt-16">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl md:text-2xl font-bold">
              Personal Details
            </h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  <FaSave className="mr-2" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUser className="text-blue-500 mr-2" />
                <label className="text-gray-700 font-semibold">
                  Name:{userInfo.userName}
                </label>
              </div>
              {editMode ? (
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{userInfo.userName}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-blue-500 mr-2" />
                <label className="text-gray-700 font-semibold">Email</label>
              </div>
              <p className="text-gray-900">{userInfo.userMail}</p>
            </div>

            {/* Phone Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaPhone className="text-blue-500 mr-2" />
                <label className="text-gray-700 font-semibold">Phone</label>
              </div>
              {editMode ? (
                <input
                  type="tel"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">
                  {userInfo.userPhone || "Not provided"}
                </p>
              )}
            </div>

            {/* Joined Date (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <label className="text-gray-700 font-semibold">Joined</label>
              </div>
              <p className="text-gray-900">{userInfo.userJoined}</p>
            </div>

            {/* Membership (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCrown className="text-yellow-500 mr-2" />
                <label className="text-gray-700 font-semibold">
                  Membership
                </label>
              </div>
              <div className="flex items-center">
                <p className="text-gray-900 capitalize">
                  {userInfo.membership}
                </p>
                {userInfo.membership === "premium" && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUserShield className="text-blue-500 mr-2" />
                <label className="text-gray-700 font-semibold">Role</label>
              </div>
              <div className="flex items-center">
                <p className="text-gray-900 capitalize">{userInfo.userRole}</p>
                {userInfo.userRole === "admin" && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalDetails;
