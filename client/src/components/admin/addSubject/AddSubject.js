import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllDepartment } from "../../../redux/actions/adminActions";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import * as classes from "../../../utils/styles";  // Import centralized styles

const AddSubject = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDepartment());
  }, [dispatch]);

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

export default AddSubject;
