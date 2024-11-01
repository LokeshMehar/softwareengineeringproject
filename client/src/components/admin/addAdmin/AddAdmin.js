import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllDepartment } from "../../../redux/actions/adminActions";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import * as classes from "../../../utils/styles";
const AddAdmin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartment());
  }, [dispatch]);
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
    {/* Adjust height to 97% for small screens and 5/6 for larger ones */}
    <div className={classes.rootPage}>
      <Header />
      {/* Enable both vertical and horizontal scrolling */}
      <div className={classes.barAndBody}>
        <Sidebar />
        <Body />
      </div>
    </div>
  </div>
  
  );
};

export default AddAdmin;
