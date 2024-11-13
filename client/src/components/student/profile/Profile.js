import React from "react";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Profile = () => {
  return (
    <div className="bg-[#000000] text-white h-screen flex items-center justify-center">
      <div className="flex flex-col  text-white bg-[#000000] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 ">
        <Header />
        <div className="flex flex-[0.95] text-white">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Profile;
