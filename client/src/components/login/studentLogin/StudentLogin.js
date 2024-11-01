// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import Spinner from "../../../utils/Spinner";
// import { studentSignIn } from "../../../redux/actions/studentActions";

// const StudentLogin = () => {
//   const [translate, setTranslate] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const store = useSelector((state) => state);
//   const [error, setError] = useState({});
//   useEffect(() => {
//     setTimeout(() => {
//       setTranslate(true);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (store.errors) {
//       setError(store.errors);
//     }
//   }, [store.errors]);

//   const login = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     dispatch(
//       studentSignIn({ username: username, password: password }, navigate)
//     );
//   };

//   useEffect(() => {
//     if (store.errors) {
//       setLoading(false);
//       setUsername("");
//       setPassword("");
//     }
//   }, [store.errors]);
//   return (
//     <div className="bg-[#d65158] h-screen w-screen flex items-center justify-center">
//       <div className="grid grid-cols-2">
//         <div
//           className={`h-96 w-96 bg-white flex items-center justify-center ${
//             translate ? " md:translate-x-[12rem] sm:translate-y-[12rem]" : ""
//           }  duration-1000 transition-all rounded-3xl shadow-2xl`}>
//           <h1 className="md:text-[3rem]  font-bold text-center sm:text-left sm: text-[2rem]">
//             Student
//             <br />
//             Login
//           </h1>
//         </div>
//         <form
//           onSubmit={login}
//           className={`${
//             loading ? "h-[27rem]" : "h-96"
//           } w-96 bg-[#2c2f35] flex flex-col items-center justify-center ${
//             translate ? "-translate-x-[12rem]" : ""
//           }  duration-1000 transition-all space-y-6 rounded-3xl shadow-2xl`}>
//           <h1 className="text-white text-3xl font-semibold">Student</h1>
//           <div className="space-y-1">
//             <p className="text-[#515966] font-bold text-sm">Username</p>
//             <div className="bg-[#515966] rounded-lg w-[14rem] flex  items-center">
//               <input
//                 onChange={(e) => setUsername(e.target.value)}
//                 value={username}
//                 type="text"
//                 required
//                 className="bg-[#515966] text-white px-2 outline-none py-2 rounded-lg placeholder:text-sm"
//                 placeholder="Username"
//               />
//             </div>
//           </div>
//           <div className="space-y-1">
//             <p className="text-[#515966] font-bold text-sm">Password</p>
//             <div className="bg-[#515966] rounded-lg px-2 flex  items-center">
//               <input
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//                 required
//                 type={showPassword ? "text" : "password"}
//                 className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
//                 placeholder="Password"
//               />
//               {showPassword ? (
//                 <VisibilityIcon
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="cursor-pointer"
//                 />
//               ) : (
//                 <VisibilityOffIcon
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="cursor-pointer"
//                 />
//               )}
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-32 hover:scale-105 transition-all duration-150 rounded-lg flex items-center justify-center text-white text-base py-1 bg-[#04bd7d]">
//             Login
//           </button>
//           {loading && (
//             <Spinner
//               message="Logging In"
//               height={30}
//               width={150}
//               color="#ffffff"
//               messageColor="#fff"
//             />
//           )}
//           {(error.usernameError || error.passwordError) && (
//             <p className="text-red-500">
//               {error.usernameError || error.passwordError}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentLogin;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import { studentSignIn } from "../../../redux/actions/studentActions";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import PersonIcon from "@mui/icons-material/Person";
// import Spinner from "../../../utils/Spinner";

// const StudentLogin = () => {
//   const [translate, setTranslate] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const store = useSelector((state) => state);
//   const [error, setError] = useState({});

//   useEffect(() => {
//     setTimeout(() => {
//       setTranslate(true);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (store.errors) {
//       setError(store.errors);
//       setLoading(false);
//       setUsername("");
//       setPassword("");
//     }
//   }, [store.errors]);

//   const login = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     dispatch(studentSignIn({ username, password }, navigate));
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse"></div>
//         <div className="absolute w-[400px] h-[400px] bg-green-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700"></div>
//         <div className="absolute w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse delay-500"></div>
//       </div>

//       <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
//         {/* Left Card - Title */}
//         <div
//           className={`hidden md:flex h-[500px] w-[400px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl items-center justify-center 
//                      rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] 
//                      ${translate ? "translate-x-48" : ""} duration-1000 transition-all
//                      border border-white/20 group
//                      before:absolute before:inset-0 before:bg-white/5 before:rounded-3xl before:transition-all before:duration-700
//                      hover:before:scale-105 hover:before:bg-white/10
//                      relative z-0`}>
//           <div className="relative z-10 text-center space-y-4">
//             <div className="text-6xl font-bold relative">
//               <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">
//                 Student
//               </span>
//               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 blur-xl rounded-lg"></div>
//             </div>
//             <p className="text-5xl font-light text-white/80">Portal</p>
//             <div className="h-2 w-32 mx-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full"></div>
//           </div>
//         </div>

//         {/* Right Card - Login Form */}
//         <form
//           onSubmit={login}
//           className={`relative h-[500px] w-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl flex flex-col items-center justify-center 
//                      ${translate ? "md:-translate-x-48" : ""} duration-1000 transition-all 
//                      rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
//                      border border-white/20 space-y-8
//                      relative z-10`}>
          
//           {/* Form Content */}
//           <div className="relative z-10 w-full px-12 space-y-8">
//             <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent mb-12">
//               Welcome Back
//             </h2>

//             {/* Username Input */}
//             <div className="space-y-2">
//               <label className="text-white/80 font-medium text-sm ml-1">Username</label>
//               <div className="relative group">
//                 <input
//                   onChange={(e) => setUsername(e.target.value)}
//                   value={username}
//                   type="text"
//                   required
//                   className="w-full bg-white/10 text-white px-4 py-3 rounded-xl outline-none 
//                            border border-white/10 focus:border-emerald-400/50 transition-all duration-300
//                            placeholder:text-white/30 focus:bg-white/20"
//                   placeholder="Enter your username"
//                 />
//                 <PersonIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="space-y-2">
//               <label className="text-white/80 font-medium text-sm ml-1">Password</label>
//               <div className="relative group">
//                 <input
//                   onChange={(e) => setPassword(e.target.value)}
//                   value={password}
//                   required
//                   type={showPassword ? "text" : "password"}
//                   className="w-full bg-white/10 text-white px-4 py-3 rounded-xl outline-none 
//                            border border-white/10 focus:border-emerald-400/50 transition-all duration-300
//                            placeholder:text-white/30 focus:bg-white/20"
//                   placeholder="Enter your password"
//                 />
//                 <div 
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 group-focus-within:text-emerald-400 transition-colors">
//                   {showPassword ? 
//                     <VisibilityIcon className="h-5 w-5" /> : 
//                     <VisibilityOffIcon className="h-5 w-5" />
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-3 rounded-xl
//                        font-medium text-lg shadow-lg shadow-emerald-500/30
//                        hover:shadow-emerald-500/50 transform hover:scale-[1.02] transition-all duration-300
//                        disabled:opacity-70 disabled:cursor-not-allowed
//                        relative group overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <span className="relative">{loading ? "Logging in..." : "Login"}</span>
//             </button>

//             {/* Error Message */}
//             {(error.usernameError || error.passwordError) && (
//               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center backdrop-blur-sm">
//                 <p className="text-red-400 text-sm">
//                   {error.usernameError || error.passwordError}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Loading Spinner */}
//           {loading && (
//             <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
//               <Spinner
//                 message="Authenticating..."
//                 height={30}
//                 width={150}
//                 color="#ffffff"
//                 messageColor="#fff"
//               />
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentLogin;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { studentSignIn } from "../../../redux/actions/studentActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import Spinner from "../../../utils/Spinner";

const StudentLogin = () => {
  const [translate, setTranslate] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const [error, setError] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setTranslate(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (store.errors) {
      setError(store.errors);
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  }, [store.errors]);

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(studentSignIn({ username, password }, navigate));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-300 to-orange-200 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-3xl -top-48 -left-24 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-gray-200/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700"></div>
        <div className="absolute w-[300px] h-[300px] bg-orange-100/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse delay-500"></div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
        {/* Left Card - Title */}
        <div
          className={`hidden md:flex h-[500px] w-[400px] bg-gradient-to-br from-orange-600/5 to-orange-700/5 backdrop-blur-xl items-center justify-center 
                      rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] 
                      ${translate ? "translate-x-48" : ""} duration-1000 transition-all
                      border border-gray-200/20 group
                      before:absolute before:inset-0 before:bg-gray-200/5 before:rounded-3xl before:transition-all before:duration-700
                      hover:before:scale-105 hover:before:bg-gray-200/10
                      relative z-0`}>
          <div className="relative z-10 text-center space-y-4">
            <div className="text-6xl font-bold relative">
              <span className="bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Student
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 blur-xl rounded-lg"></div>
            </div>
            <p className="text-5xl font-light text-orange-800">Portal</p>
            <div className="h-2 w-32 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </div>

        {/* Right Card - Login Form */}
        <form
          onSubmit={login}
          className={`relative h-[500px] w-[400px] bg-gradient-to-br from-gray-200/20 to-orange-100/10 backdrop-blur-xl flex flex-col items-center justify-center 
                      ${translate ? "md:-translate-x-48" : ""} duration-1000 transition-all 
                      rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
                      border border-gray-200/30 space-y-8
                      relative z-10`}>
          
          {/* Form Content */}
          <div className="relative z-10 w-full px-12 space-y-8">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent mb-12">
              Welcome Back
            </h2>

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-orange-900 font-medium text-sm ml-1">Username</label>
              <div className="relative group">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  required
                  className="w-full bg-gray-200/30 text-orange-900 px-4 py-3 rounded-xl outline-none 
                           border border-orange-100 focus:border-orange-300 transition-all duration-300
                           placeholder:text-orange-400/50 focus:bg-gray-200/40"
                  placeholder="Enter your username"
                />
                <PersonIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400/50 group-focus-within:text-orange-600 transition-colors" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-orange-900 font-medium text-sm ml-1">Password</label>
              <div className="relative group">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-gray-200/30 text-orange-900 px-4 py-3 rounded-xl outline-none 
                           border border-orange-100 focus:border-orange-300 transition-all duration-300
                           placeholder:text-orange-400/50 focus:bg-gray-200/40"
                  placeholder="Enter your password"
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-orange-400/50 group-focus-within:text-orange-600 transition-colors">
                  {showPassword ? 
                    <VisibilityIcon className="h-5 w-5" /> : 
                    <VisibilityOffIcon className="h-5 w-5" />
                  }
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white py-3 rounded-xl
                       font-medium text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50">
              {loading ? <Spinner height={20} width={20} color="#ffffff" messageColor="#ffffff" /> : "Login"}
            </button>

            {/* Error Message */}
            {(error.usernameError || error.passwordError) && (
              <p className="text-red-500">
                {error.usernameError || error.passwordError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;



