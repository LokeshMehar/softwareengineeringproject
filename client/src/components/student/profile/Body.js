// import React from "react";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
// import { Avatar } from "@mui/material";
// import Data from "./Data";
// import { useNavigate } from "react-router-dom";

// const Body = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   return (
//     <div className="flex-1 mt-3 px-3 md:px-6">
//       <div className="space-y-5">
//         <div className="flex items-center justify-between mr-4 md:mr-8">
//           <div className="flex space-x-2 text-gray-400">
//             <AssignmentIndIcon />
//             <h1 className="text-lg md:text-xl">Profile</h1>
//           </div>
//           <div
//             onClick={() => navigate("/student/update")}
//             className="flex space-x-2 cursor-pointer items-center"
//           >
//             <SecurityUpdateIcon />
//             <h1 className="font-bold text-sm md:text-base">Update</h1>
//           </div>
//         </div>

//         <div className="relative w-full bg-white rounded-xl p-4 md:p-6 shadow-md overflow-hidden max-w-full">
//           <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
//             <Avatar src={user.result.avatar} sx={{ width: 70, height: 70 }} />
//           </div>

//           <div className="flex flex-col md:flex-row md:space-x-10 overflow-y-auto max-h-[27rem]">
//             <div className="flex flex-col space-y-8 md:w-1/2">
//               <Data label="Name" value={user.result.name} />
//               <Data label="Email" value={user.result.email} />
//               <Data label="Username" value={user.result.username} />
//               <Data label="Department" value={user.result.department} />
//               <Data label="Father's Name" value={user.result.fatherName} />
//               <Data label="Mother's Name" value={user.result.motherName} />
//             </div>

//             <div className="flex flex-col space-y-8 md:w-1/2">
//               <Data label="DOB" value={user.result.dob} />
//               <Data label="Year" value={user.result.year} />
//               <Data label="Contact Number" value={user.result.contactNumber} />
//               <Data label="Section" value={user.result.section} />
//               <Data label="Father's Contact Number" value={user.result.fatherContactNumber} />
//               <Data label="Batch" value={user.result.batch} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Body;

import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import { Avatar } from "@mui/material";
import Data from "./Data";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="flex-1 mt-3 px-3 md:px-6 bg-black text-white">
      <div className="space-y-5">
        <div className="flex items-center justify-between mr-4 md:mr-8">
          <div className="flex space-x-2 text-gray-400">
            <AssignmentIndIcon />
            <h1 className="text-lg md:text-xl">Profile</h1>
          </div>
          <div
            onClick={() => navigate("/student/update")}
            className="flex space-x-2 cursor-pointer items-center"
          >
            <SecurityUpdateIcon />
            <h1 className="font-bold text-sm md:text-base">Update</h1>
          </div>
        </div>

        {/* Form container with black background and white text */}
        <div className="relative w-full bg-black text-white rounded-xl p-4 md:p-6 shadow-md overflow-hidden max-w-full">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
            <Avatar src={user.result.avatar} sx={{ width: 70, height: 70 }} />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-10 overflow-y-auto max-h-[27rem]">
            <div className="flex flex-col space-y-8 md:w-1/2">
              <Data label="Name" value={user.result.name} />
              <Data label="Email" value={user.result.email} />
              <Data label="Username" value={user.result.username} />
              <Data label="Department" value={user.result.department} />
              <Data label="Father's Name" value={user.result.fatherName} />
              <Data label="Mother's Name" value={user.result.motherName} />
            </div>

            <div className="flex flex-col space-y-8 md:w-1/2">
              <Data label="DOB" value={user.result.dob} />
              <Data label="Year" value={user.result.year} />
              <Data label="Contact Number" value={user.result.contactNumber} />
              <Data label="Section" value={user.result.section} />
              <Data label="Father's Contact Number" value={user.result.fatherContactNumber} />
              <Data label="Batch" value={user.result.batch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
