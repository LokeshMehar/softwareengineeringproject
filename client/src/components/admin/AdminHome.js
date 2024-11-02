import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getNotice,
} from "../../redux/actions/adminActions";
import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";
import * as classes from "../../utils/styles";
const AdminHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudent());
    dispatch(getAllFaculty());
    dispatch(getAllAdmin());
    dispatch(getAllDepartment());
    dispatch(getNotice());
  }, [dispatch]);
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
    <div className={classes.rootPage}>
      <Header />
      {/* Add overflow-y-auto to enable vertical scrolling */}
      <div className={classes.barAndBody}>
        <Sidebar />
        <Body />
      </div>
    </div>
  </div>
  
  );
};

export default AdminHome;
