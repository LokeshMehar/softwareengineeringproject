

import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import ShowNotice from "../notices/ShowNotice";
import { useSelector } from "react-redux";
import ReplyIcon from "@mui/icons-material/Reply";
import Notice from "../notices/Notice";

const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const testResult = useSelector((state) => state.student.testResult.result);
  const attendance = useSelector((state) => state.student.attendance.result);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects.result);
  var totalAttendance = 0;

  attendance?.map((att) => (totalAttendance += att.attended));

  const [value, onChange] = useState(new Date());

  return (
    <div className=" scrollbar-track-black flex-[0.8] mt-3 px-4 md:px-8 overflow-hidden md:overflow-visible bg-black text-white">
      <div className="space-y-5">
        <div className=" scrollbar-track-black flex text-gray-400 items-center space-x-2  ">
          <HomeIcon />
          <h1>Dashboard</h1>
        </div>
        <div className="flex flex-col space-y-4 overflow-y-auto sm:overflow-y-scroll sm:overflow-x-hidden h-[calc(100vh-4rem)] md:h-auto">
          <div className="bg-black text-white rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 py-4 items-center">
            <div className="flex items-center space-x-4 border-b sm:border-r-2 sm:border-b-0 pb-4 sm:pb-0 border-gray-500">
              <EngineeringIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Subjects</h1>
                <h2 className="text-2xl font-bold">{subjects?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-b sm:border-r-2 sm:border-b-0 pb-4 sm:pb-0 border-gray-500">
              <BoyIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Test</h1>
                <h2 className="text-2xl font-bold">{testResult?.length}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 border-b sm:border-r-2 sm:border-b-0 pb-4 sm:pb-0 border-gray-500">
              <SupervisorAccountIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Attendance</h1>
                <h2 className="text-2xl font-bold">{totalAttendance}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 pb-4">
              <MenuBookIcon
                className="rounded-full py-2 bg-orange-300"
                sx={{ fontSize: 40 }}
              />
              <div className="flex flex-col">
                <h1>Year</h1>
                <h2 className="text-2xl font-bold">{user.result.year}</h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full md:w-2/6">
              <div className="bg-black text-white h-[17rem] rounded-xl shadow-lg">
                <Calendar onChange={onChange} value={value} className="custom-calendar" />
              </div>
            </div>
            <div className="bg-black  text-white h-[17rem] w-full rounded-xl shadow-lg flex flex-col pt-3">
              <div className="flex px-3 items-center">
                {open && (
                  <ReplyIcon
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  />
                )}
                <h1 className="  font-bold text-xl w-full text-center">
                  Notices
                </h1>
              </div>
              <div className="mx-5 mt-5 space-y-3 overflow-y-auto h-[12rem]">
                {!open ? (
                  notices?.map((notice, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setOpen(true);
                        setOpenNotice(notice);
                      }}
                      className="cursor-pointer"
                    >
                      <Notice idx={idx} notice={notice} notFor="faculty" />
                    </div>
                  ))
                ) : (
                  <ShowNotice notice={openNotice} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
