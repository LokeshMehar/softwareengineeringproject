



import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getNotice } from "../../redux/actions/adminActions";
import {
  getAttendance,
  getSubject,
  getTestResult,
} from "../../redux/actions/studentActions";

import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";

const StudentHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubject(user.result.department, user.result.year));
    dispatch(
      getTestResult(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(
      getAttendance(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(getNotice());
  }, [dispatch]);

  return (
    <div className="bg-[#000000] text-white min-h-screen flex items-center justify-center">
      <div className="  border-2 border-orange-300 flex flex-col text-white bg-[#000000] w-[95%] h-full md:h-5/6 rounded-2xl shadow-2xl space-y-6 overflow-y-auto scrollbar-track-stone-900">
        <Header />
        <div className="flex flex-[0.95] overflow-y-auto">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
