import React from "react";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";
import PersonalDetails from "../../Components/PersonalDetails/PersonalDetails";
import TravelPreferenceForm from "../../Components/TravelPreferenceForm/TravelPreferenceForm";
import GroupTravelPostForm from "../../Components/GroupTravelPostForm/GroupTravelPostForm";
import AdminPanel from "../../Components/AdminPanel/AdminPanel";
import useRole from "../../hooks/useRole";
import HostPanel from "../../Components/hostPanel/hostPanel";
import UserPanel from "../../Components/userPanel/userPanel";

const userDashboard = () => {
  const { role } = useRole();
  console.log(role);
  return (
    <>
      <Banner
        bgImage={backImage}
        heading="User Profile"
        text="Manage your profile and preferences."
      />
      <div>
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-box items-center justify-center my-16">
          <input
            type="radio"
            name="my_tabs_6"
            className="tab"
            aria-label="Personal Details"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <PersonalDetails></PersonalDetails>
          </div>

          <input
            type="radio"
            name="my_tabs_6"
            className="tab"
            aria-label="Travel Preferences"
            defaultChecked
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <TravelPreferenceForm></TravelPreferenceForm>
          </div>

          {role !== "member" && (
            <>
              <input
                type="radio"
                name="my_tabs_6"
                className="tab"
                aria-label="Group Travel Post"
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <GroupTravelPostForm></GroupTravelPostForm>
              </div>
            </>
          )}
          <input
            type="radio"
            name="my_tabs_6"
            className="tab"
            aria-label={
              role === "admin"
                ? "Admin Panel"
                : role === "host"
                ? "Host Panel"
                : "User Panel"
            }
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {role === "admin" && <AdminPanel />}
            {role === "host" && <HostPanel></HostPanel>}
            {role === "member" && <UserPanel></UserPanel>}
            {role === null && (
              <div className="text-center text-lg font-semibold text-gray-700">
                Please Login first to access the dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default userDashboard;
