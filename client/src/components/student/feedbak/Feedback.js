import React, { useEffect } from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
  
const Feedback = () => {
  return (
    <div className="bg-[#000000] h-screen flex items-center justify-center ">
      <div className="flex flex-col  bg-[#000000] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-auto scrollbar-thin ">
        <Header />
        <div className="flex flex-[0.95] text-white">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Feedback;