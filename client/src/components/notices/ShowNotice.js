// import React from "react";

// const ShowNotice = ({ notice }) => {
//   return (
//     <div className="flex flex-col space-y-3 ">
//       <div className="flex justify-between">
//         <h1>
//           <span className="font-bold">From: </span>
//           {notice.from}
//         </h1>
//         <h1>{notice.date}</h1>
//       </div>
//       <h1 className="self-center font-semibold text-lg">{notice.topic}</h1>
//       <p className="max-w-[50rem] overflow-x-hidden overflow-y-auto h-[7rem]">
//         {notice.content}
//       </p>
//     </div>
//   );
// };

// export default ShowNotice;




import React from "react";

const ShowNotice = ({ notice }) => {
  return (
    <div className="flex flex-col space-y-3 p-3 md:p-5">
      <div className="flex flex-col sm:flex-row justify-between">
        <h1 className="text-sm md:text-base">
          <span className="font-bold">From: </span>
          {notice.from}
        </h1>
        <h1 className="text-sm md:text-base">{notice.date}</h1>
      </div>
      <h1 className="self-center font-semibold text-base md:text-lg">{notice.topic}</h1>
      <p className="max-w-full sm:max-w-[40rem] md:max-w-[50rem] overflow-y-auto h-[10rem] sm:h-[12rem] md:h-[14rem] lg:h-[15rem] p-2 text-sm md:text-base">
        {notice.content}
      </p>
    </div>
  );
};

export default ShowNotice;
