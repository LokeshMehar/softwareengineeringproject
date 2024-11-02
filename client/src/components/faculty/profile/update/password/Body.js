// import React, { useEffect, useState } from "react";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import Spinner from "../../../../../utils/Spinner";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { adminUpdatePassword } from "../../../../../redux/actions/adminActions";
// import * as classes from "../../../../../utils/styles";
// import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";
// const Body = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState({});
//   const [loading, setLoading] = useState(false);
//   const store = useSelector((state) => state);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (Object.keys(store.errors).length !== 0) {
//       setError(store.errors);
//       setLoading(false);
//     }
//   }, [store.errors]);

//   const update = (e) => {
//     e.preventDefault();

//     setLoading(true);
//     dispatch(
//       facultyUpdatePassword(
//         {
//           newPassword: newPassword,
//           confirmPassword: confirmPassword,
//           email: user.result.email,
//         },
//         navigate
//       )
//     );
//   };

//   useEffect(() => {
//     if (store.errors) {
//       setLoading(false);
//       setNewPassword("");
//       setConfirmPassword("");
//     }
//   }, [store.errors]);

//   return (
//     <div className="flex-[0.8] mt-3">
//       <div className="space-y-5">
//         <div className="flex text-gray-400 items-center space-x-2">
//           <VisibilityOffIcon />
//           <h1>Password</h1>
//         </div>

//         <div className=" mr-10 bg-white flex flex-col rounded-xl ">
//           <form
//             onSubmit={update}
//             className="flex flex-col space-y-6 items-center my-8">
//             <h1 className="text-black text-3xl font-bold">Update Password</h1>
//             <div className="space-y-1">
//               <p className="text-[#515966] font-bold text-sm">New Password</p>
//               <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
//                 <input
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   value={newPassword}
//                   required
//                   type={showPassword ? "text" : "password"}
//                   className="rounded-lg outline-none py-2  placeholder:text-sm"
//                   placeholder="New Password"
//                 />
//                 {showPassword ? (
//                   <VisibilityIcon
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="cursor-pointer"
//                   />
//                 ) : (
//                   <VisibilityOffIcon
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="cursor-pointer"
//                   />
//                 )}
//               </div>
//             </div>
//             <div className="space-y-1">
//               <p className="text-[#515966] font-bold text-sm">
//                 Confirm Password
//               </p>
//               <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
//                 <input
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   value={confirmPassword}
//                   required
//                   type={showPassword ? "text" : "password"}
//                   className="rounded-lg outline-none py-2  placeholder:text-sm"
//                   placeholder="Confirm Password"
//                 />
//                 {showPassword ? (
//                   <VisibilityIcon
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="cursor-pointer"
//                   />
//                 ) : (
//                   <VisibilityOffIcon
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="cursor-pointer"
//                   />
//                 )}
//               </div>
//             </div>
//             <div className={classes.adminFormButton}>
//               <button className={classes.adminFormSubmitButton} type="submit">
//                 Update
//               </button>
//               <button
//                 onClick={() => navigate("/admin/profile")}
//                 className={classes.adminFormClearButton}
//                 type="button">
//                 Cancel
//               </button>
//             </div>
//             {loading && (
//               <Spinner
//                 message="Updating"
//                 height={30}
//                 width={150}
//                 color="#111111"
//                 messageColor="#blue"
//               />
//             )}
//             {(error.mismatchError || error.backendError) && (
//               <p className="text-red-500">
//                 {error.mismatchError || error.backendError}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Body;


import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";
import * as classes from "../../../../../utils/styles";

const Body = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const update = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(
      facultyUpdatePassword(
        {
          newPassword,
          confirmPassword,
          email: user.result.email,
        },
        navigate
      )
    );
  };

  useEffect(() => {
    if (store.errors) {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [store.errors]);

  return (
    <div className="flex-[0.8] mt-3 px-4 md:px-6">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <VisibilityOffIcon />
          <h1 className="text-lg md:text-xl">Password</h1>
        </div>

        <div className="bg-white flex flex-col rounded-xl w-full md:w-3/4 lg:w-1/2 mx-auto">
          <form
            onSubmit={update}
            className="flex flex-col space-y-6 items-center my-8 px-4 md:px-8"
          >
            <h1 className="text-black text-2xl md:text-3xl font-bold text-center">
              Update Password
            </h1>
            <div className="w-full space-y-1">
              <p className="text-[#515966] font-bold text-sm md:text-base">
                New Password
              </p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2 w-full placeholder:text-sm md:placeholder:text-base"
                  placeholder="New Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="w-full space-y-1">
              <p className="text-[#515966] font-bold text-sm md:text-base">
                Confirm Password
              </p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2 w-full placeholder:text-sm md:placeholder:text-base"
                  placeholder="Confirm Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 w-full justify-center items-center">
              <button
                className={`${classes.adminFormSubmitButton} w-full md:w-auto`}
                type="submit"
              >
                Update
              </button>
              <button
                onClick={() => navigate("/admin/profile")}
                className={`${classes.adminFormClearButton} w-full md:w-auto`}
                type="button"
              >
                Cancel
              </button>
            </div>
            {loading && (
              <Spinner
                message="Updating"
                height={30}
                width={150}
                color="#111111"
                messageColor="#blue"
              />
            )}
            {(error.mismatchError || error.backendError) && (
              <p className="text-red-500">
                {error.mismatchError || error.backendError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
