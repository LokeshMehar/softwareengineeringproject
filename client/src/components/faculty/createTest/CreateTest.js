

import React from "react";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

const CreateTest = () => {
  return (
    <div className="bg-black h-screen flex items-center justify-center overflow-hidden"> 
      <div className="flex flex-col bg-[#000000] border-white  h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-auto">
        <Header />
        <div className="flex flex-[0.95] overflow-auto text-white">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default CreateTest;



// import React from "react";
// import Body from "./Body";
// import Header from "../Header";
// import Sidebar from "../Sidebar";

// const CreateTest = () => {
//   return (
//     <div className="bg-[#d6d9e0] h-screen flex items-center justify-center overflow-hidden">
//       <div className="flex flex-col bg-[#f4f6fa] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-auto">
//         <Header />
//         <div className="flex flex-[0.95] overflow-auto">
//           <Sidebar />
//           <Body />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateTest;
