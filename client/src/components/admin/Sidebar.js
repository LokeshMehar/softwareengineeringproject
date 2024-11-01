import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";
const isActiveStyle =
  "flex items-center px-5 gap-3 text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("admin")));
  }, [navigate]);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on click outside for mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavLinkClick = () => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="relative" ref={sidebarRef}>
      {/* Hamburger Icon */}
      <div className="md:hidden p-2 cursor-pointer" onClick={handleSidebarToggle}>
        <MenuIcon />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:flex-[0.2]`}
      >
        <div className="space-y-8 overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-300 h-[33rem]">
          <div>
            <NavLink
              to="/admin/home"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <HomeIcon />
              <h1 className="font-normal">Dashboard</h1>
            </NavLink>
            <NavLink
              to="/admin/profile"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AssignmentIndIcon />
              <h1 className="font-normal">Profile</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/createNotice"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Create Notice</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/addadmin"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Add Admin</h1>
            </NavLink>
            <NavLink
              to="/admin/deleteadmin"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <DeleteIcon />
              <h1 className="font-normal">Delete Admin</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/adddepartment"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Add Department</h1>
            </NavLink>
            <NavLink
              to="/admin/deletedepartment"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <DeleteIcon />
              <h1 className="font-normal">Delete Department</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/allfaculty"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <EngineeringIcon />
              <h1 className="font-normal">Our Faculty</h1>
            </NavLink>
            <NavLink
              to="/admin/addfaculty"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Add Faculty</h1>
            </NavLink>
            <NavLink
              to="/admin/deletefaculty"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <DeleteIcon />
              <h1 className="font-normal">Delete Faculty</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/allstudent"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <BoyIcon />
              <h1 className="font-normal">Our Students</h1>
            </NavLink>
            <NavLink
              to="/admin/addstudent"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Add Students</h1>
            </NavLink>
            <NavLink
              to="/admin/deletestudent"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <DeleteIcon />
              <h1 className="font-normal">Delete Student</h1>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/admin/allsubject"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <MenuBookIcon />
              <h1 className="font-normal">Subjects</h1>
            </NavLink>
            <NavLink
              to="/admin/addsubject"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <AddIcon />
              <h1 className="font-normal">Add Subject</h1>
            </NavLink>
            <NavLink
              to="/admin/deletesubject"
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleNavLinkClick}
            >
              <DeleteIcon />
              <h1 className="font-normal">Delete Subject</h1>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
