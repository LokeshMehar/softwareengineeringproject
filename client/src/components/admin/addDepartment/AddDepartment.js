import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import * as classes from "../../../utils/styles";
const AddDepartment = () => {
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
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

export default AddDepartment;
