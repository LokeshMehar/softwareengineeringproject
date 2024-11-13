import React, { useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import * as classes from "../../../utils/styles"; 
const FeedbackA = () => {
  return (
    <div className="bg-[#000000] h-screen flex items-center justify-center">
      <div className={classes.rootPage}>
        <Header />
        <div className={classes.barAndBody}>
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default FeedbackA;