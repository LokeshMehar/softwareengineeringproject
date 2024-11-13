import React from "react";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

const GetAllStudyMaterial = () => {
  return (
    <div className="bg-[#000000] h-screen flex items-center justify-center overflow-hidden">
      <div className="flex flex-col bg-[#000000] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-auto">
        <Header />
        <div className="flex flex-[0.95] overflow-auto text-white">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default GetAllStudyMaterial;
