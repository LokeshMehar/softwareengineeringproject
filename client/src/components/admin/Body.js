import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import ReplyIcon from "@mui/icons-material/Reply";

const Body = () => {
  const [open, setOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState({});
  const notices = useSelector((state) => state.admin.notices.result);
  const [value, onChange] = useState(new Date());
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);
  const admins = useSelector((state) => state.admin.allAdmin);
  const departments = useSelector((state) => state.admin.allDepartment);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <HomeIcon />
          <h1>Dashboard</h1>
        </div>

        {/* Card Section - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-5">
          <div className="bg-white h-[8rem] rounded-xl shadow-lg flex items-center space-x-4 px-8">
            <EngineeringIcon className="rounded-full py-2 bg-orange-300" sx={{ fontSize: 40 }} />
            <div className="flex flex-col">
              <h1>Faculty</h1>
              <h2 className="text-2xl font-bold">{faculties?.length}</h2>
            </div>
          </div>

          <div className="bg-white h-[8rem] rounded-xl shadow-lg flex items-center space-x-4 px-8">
            <BoyIcon className="rounded-full py-2 bg-orange-300" sx={{ fontSize: 40 }} />
            <div className="flex flex-col">
              <h1>Student</h1>
              <h2 className="text-2xl font-bold">{students?.length}</h2>
            </div>
          </div>

          <div className="bg-white h-[8rem] rounded-xl shadow-lg flex items-center space-x-4 px-8">
            <SupervisorAccountIcon className="rounded-full py-2 bg-orange-300" sx={{ fontSize: 40 }} />
            <div className="flex flex-col">
              <h1>Admin</h1>
              <h2 className="text-2xl font-bold">{admins?.length}</h2>
            </div>
          </div>

          <div className="bg-white h-[8rem] rounded-xl shadow-lg flex items-center space-x-4 px-8">
            <MenuBookIcon className="rounded-full py-2 bg-orange-300" sx={{ fontSize: 40 }} />
            <div className="flex flex-col">
              <h1>Department</h1>
              <h2 className="text-2xl font-bold">{departments?.length}</h2>
            </div>
          </div>
        </div>

        {/* Calendar and Notices Section */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Calendar */}
          <div className="bg-white h-[17rem] rounded-xl shadow-lg w-full md:w-1/3">
            <Calendar onChange={onChange} value={value} />
          </div>

          {/* Notices */}
          <div className="bg-white h-[17rem] rounded-xl shadow-lg w-full md:w-2/3 flex flex-col pt-3">
            <div className="flex px-3">
              {open && (
                <ReplyIcon
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                />
              )}
              <h1 className="font-bold text-xl w-full text-center">Notices</h1>
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
                    <Notice idx={idx} notice={notice} notFor="" />
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
  );
};

export default Body;
