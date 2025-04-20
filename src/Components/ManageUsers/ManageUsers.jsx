import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaUser,
  FaUserShield,
  FaUserCog,
  FaSearch,
  FaCrown,
  FaMedal,
  FaAward,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("Error", "Failed to load users", "error");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewRole(user.userRole);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleSave = async () => {
    if (!editingUser || editingUser.userRole === newRole) {
      setEditingUser(null);
      return;
    }

    try {
      const res = await axiosSecure.patch(`/users/id/${editingUser._id}`, {
        userRole: newRole,
      });

      if (res.data.modifiedCount > 0) {
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? { ...user, userRole: newRole } : user
          )
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User role updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("No changes made");
      }

      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update user role",
      });
    }
  };

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/users/id/${id}`);

        if (res.data.deletedCount > 0) {
          setUsers(users.filter((user) => user._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been removed.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.error || "Failed to remove user",
        });
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userMail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.membership.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-blue-500" />;
      case "member":
        return <FaUser className="text-green-500" />;
      case "host":
        return <FaUserCog className="text-yellow-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getMembershipBadge = (membership) => {
    switch (membership) {
      case "gold":
        return (
          <span className="badge badge-warning gap-1">
            <FaCrown /> Gold
          </span>
        );
      case "silver":
        return (
          <span className="badge badge-secondary gap-1">
            <FaAward /> Silver
          </span>
        );
      case "bronze":
        return (
          <span className="badge badge-accent gap-1">
            <FaMedal /> Bronze
          </span>
        );
      default:
        return <span className="badge gap-1">{membership}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaUserCog className="text-xl" />
                User Management
              </h2>
              <p className="text-blue-100">Manage all registered users</p>
            </div>
            <div className="text-sm">
              Total Users: <span className="font-bold">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, role or membership..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="font-semibold text-gray-700">User</th>
                <th className="font-semibold text-gray-700">Email</th>
                <th className="font-semibold text-gray-700">Joined</th>
                <th className="font-semibold text-gray-700">Membership</th>
                <th className="font-semibold text-gray-700">Role</th>
                <th className="font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img
                              src={user.userPhoto || "/default-user.png"}
                              alt={user.userName}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{user.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600">{user.userMail}</td>
                    <td className="text-gray-500">
                      {formatDate(user.userJoined)}
                    </td>
                    <td>{getMembershipBadge(user.membership)}</td>
                    <td>
                      {editingUser && editingUser._id === user._id ? (
                        <select
                          value={newRole}
                          onChange={handleRoleChange}
                          className="select select-bordered select-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          <option value="host">Host</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.userRole)}
                          <span className="capitalize">{user.userRole}</span>
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingUser && editingUser._id === user._id ? (
                          <button
                            onClick={handleSave}
                            className="btn btn-sm btn-primary gap-2"
                          >
                            <FaSave /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(user)}
                            className="btn btn-sm btn-outline btn-primary gap-2"
                          >
                            <FaEdit /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(user._id)}
                          className="btn btn-sm btn-outline btn-error gap-2"
                          disabled={user.userRole === "admin"}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stats Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <FaUserShield className="text-blue-500" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUserCog className="text-yellow-500" />
                <span>Host</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUser className="text-green-500" />
                <span>Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
