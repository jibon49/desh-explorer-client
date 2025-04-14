import React from "react";
import Banner from "../Home/Banner/Banner";
import backImage from "../../assets/tourbg.jpg";
import PersonalDetails from "../../Components/PersonalDetails/PersonalDetails";
import TravelPreferenceForm from "../../Components/TravelPreferenceForm/TravelPreferenceForm";
import GroupTravelPostForm from "../../Components/GroupTravelPostForm/GroupTravelPostForm";
import AdminPanel from "../../Components/AdminPanel/AdminPanel";

const userDashboard = () => {
  return (
    <>
      <Banner
        bgImage={backImage}
        heading="Tour Packages"
        text="Explore amazing destinations with our curated tour plans."
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

          <input
            type="radio"
            name="my_tabs_6"
            className="tab"
            aria-label="Group Travel Post"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <GroupTravelPostForm></GroupTravelPostForm>
          </div>
          <input
            type="radio"
            name="my_tabs_6"
            className="tab"
            aria-label="Admin pannel"
          />
          <div className="tab-content bg-base-100 border-base-300 p-6">
            <AdminPanel></AdminPanel>
          </div>
        </div>
      </div>
    </>
  );
};

export default userDashboard;
