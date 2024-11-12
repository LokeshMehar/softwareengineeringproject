
import React from "react";

const Notice = ({ idx, notice, notFor }) => {
  return (
    notFor !== notice.noticeFor && (
      <div className="  flex flex-col sm:flex-row items-start sm:items-center shadow-md py-2 px-2 rounded-lg bg-black text-white hover:bg-slate-50 hover:text-black transition-all duration-200 cursor-pointer sm:h-10">
        ⚫
        <h1 className="font-bold ml-3 mt-1 sm:mt-0 sm:ml-3 overflow-hidden text-ellipsis sm:w-[12rem] md:w-[15rem] lg:w-[20rem]">
          {notice.topic}
        </h1>
        <p className="text-ellipsis mt-1 sm:mt-0 sm:ml-4 overflow-hidden sm:w-[15rem] md:w-[20rem] lg:w-[25rem]">
          {notice.content}
        </p>
      </div>
    )
  );
};

export default Notice;
