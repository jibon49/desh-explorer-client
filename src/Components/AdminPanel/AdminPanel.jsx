import React, { useState } from "react";
import { FiUsers, FiPackage, FiMenu, FiX, FiCalendar } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import EditTourPackages from "../EditTourPackages/EditTourPackages";
import ManageUsers from "../ManageUsers/ManageUsers";
import PostTour from "./PostTour";
import BookingList from "../BookingList/BookingList";
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlineTour } from "react-icons/md";
import CustomTourManage from "../CustomTourManage/CustomTourManage";
import CustomTourBooking from "../CustomTourBooking/CustomTourBooking";
import MyBookings from "../userPanel/MyBookings";
import ComplaintsList from "./Complain/ComplaintsList";
const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState("manageUsers");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (selectedOption) {
      case "manageUsers":
        return <ManageUsers />;
      case "editTours":
        return <EditTourPackages />;
      case "postTours":
        return <PostTour/>;
      case "bookingList":
        return <BookingList/>;
      case "customToursManage":
        return <CustomTourManage />;
      case "CustomTourBooking":
        return <CustomTourBooking />;
      case "myBookings":
        return <MyBookings/>;
      case "complain":
        return <ComplaintsList />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-500">
                Select an option from the sidebar to get started
              </p>
            </div>
          </div>
        );
    }
  };

  const menuItems = [
    {
      id: "manageUsers",
      label: "Manage Users",
      icon: <FiUsers className="mr-3" />,
    },
    {
      id: "postTours",
      label: " Add Tour Package",
      icon: <IoAddOutline className="mr-3" />,
    },
    {
      id: "editTours",
      label: "Edit Tour Packages",
      icon: <FiPackage className="mr-3" />,
    },
    {
      id: "bookingList",
      label: "Booking List",
      icon: <TbBrandBooking className="mr-3" />,
    },
    {
      id: "customToursManage",
      label: "Add Hotel",
      icon: <MdOutlineTour className="mr-3" />,
    },
    {
      id: "CustomTourBooking",
      label: "Custom Tour Booking",
      icon: <TbBrandBooking className="mr-3" />,
    },
    {
      id: "myBookings",
      label: "My Bookings",
      icon: <FiCalendar className="mr-3" />,
    },
    {
      id: "complain",
      label: "Complain",
      icon: <FiCalendar className="mr-3" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 bg-white shadow-md transform transition-all duration-300 ease-in-out`}
        >
          <div className="p-6 hidden lg:block">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage your application content
            </p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSelectedOption(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                      selectedOption === item.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 min-h-[calc(100vh-32px)] lg:min-h-[calc(100vh-64px)]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;