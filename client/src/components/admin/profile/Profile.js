import React from "react";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";
import * as classes from "../../../utils/styles";
const Profile = () => {
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
    <div className={classes.rootPage}>
      <Header />
      {/* Enable vertical scrolling */}
      <div className={classes.barAndBody}>
        <Sidebar />
        <Body />
      </div>
    </div>
  </div>
  
  );
};

export default Profile;
