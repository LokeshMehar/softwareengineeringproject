import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addStudent } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_STUDENT, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const errorRef = useRef();

  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    batch: "",
    gender: "",
    year: "",
    fatherName: "",
    motherName: "",
    section: "",
    fatherContactNumber: "",
    motherContactNumber: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
      setValue({ ...value, email: "" });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addStudent(value));
    setError({});
    setLoading(true);
  };

  useEffect(() => {
    if (store.errors || store.admin.studentAdded) {
      setLoading(false);
      if (store.admin.studentAdded) {
        setValue({
          name: "",
          dob: "",
          email: "",
          department: "",
          contactNumber: "",
          avatar: "",
          batch: "",
          gender: "",
          year: "",
          fatherName: "",
          motherName: "",
          section: "",
          fatherContactNumber: "",
          motherContactNumber: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_STUDENT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.studentAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-1 p-4">
    <div className="space-y-5">
      {/* Header */}
      <div className="flex text-gray-400 items-center space-x-2">
        <AddIcon />
        <h1 className="text-lg md:text-xl">Add Student</h1>
      </div>
  
      {/* Form Container */}
      <div className="bg-white flex flex-col rounded-xl shadow-lg p-6">
        <form
          className={`${
            classes.adminForm0
          } scrollbar-thin scrollbar-track-white scrollbar-thumb-black overflow-y-scroll h-[30rem]`}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Name:</h1>
                <input
                  placeholder="Full Name"
                  required
                  className={`${classes.adminInput} w-full`}
                  type="text"
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>DOB:</h1>
                <input
                  required
                  placeholder="DD/MM/YYYY"
                  className={`${classes.adminInput} w-full`}
                  type="date"
                  value={value.dob}
                  onChange={(e) => setValue({ ...value, dob: e.target.value })}
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Email:</h1>
                <input
                  required
                  placeholder="Email"
                  className={`${classes.adminInput} w-full`}
                  type="email"
                  value={value.email}
                  onChange={(e) => setValue({ ...value, email: e.target.value })}
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Batch:</h1>
                <input
                  required
                  placeholder="yyyy-yyyy"
                  className={`${classes.adminInput} w-full`}
                  type="text"
                  value={value.batch}
                  onChange={(e) => setValue({ ...value, batch: e.target.value })}
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Father's Name:</h1>
                <input
                  required
                  placeholder="Father's Name"
                  className={`${classes.adminInput} w-full`}
                  type="text"
                  value={value.fatherName}
                  onChange={(e) =>
                    setValue({ ...value, fatherName: e.target.value })
                  }
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Mother's Name:</h1>
                <input
                  required
                  placeholder="Mother's Name"
                  className={`${classes.adminInput} w-full`}
                  type="text"
                  value={value.motherName}
                  onChange={(e) =>
                    setValue({ ...value, motherName: e.target.value })
                  }
                />
              </div>
            </div>
  
            {/* Right Column */}
            <div className="flex-1 space-y-6">
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Year:</h1>
                <Select
                  required
                  displayEmpty
                  className="w-full"
                  sx={{ height: 36 }}
                  value={value.year}
                  onChange={(e) => setValue({ ...value, year: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </Select>
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Department:</h1>
                <Select
                  required
                  displayEmpty
                  className="w-full"
                  sx={{ height: 36 }}
                  value={value.department}
                  onChange={(e) =>
                    setValue({ ...value, department: e.target.value })
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {departments?.map((dp, idx) => (
                    <MenuItem key={idx} value={dp.department}>
                      {dp.department}
                    </MenuItem>
                  ))}
                </Select>
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Gender:</h1>
                <Select
                  required
                  displayEmpty
                  className="w-full"
                  sx={{ height: 36 }}
                  value={value.gender}
                  onChange={(e) => setValue({ ...value, gender: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Contact Number:</h1>
                <input
                  required
                  placeholder="Contact Number"
                  className={`${classes.adminInput} w-full`}
                  type="number"
                  value={value.contactNumber}
                  onChange={(e) =>
                    setValue({ ...value, contactNumber: e.target.value })
                  }
                />
              </div>
  
              <div className={classes.adminForm3}>
                <h1 className={classes.adminLabel}>Avatar:</h1>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) =>
                    setValue({ ...value, avatar: base64 })
                  }
                />
              </div>
            </div>
          </div>
  
          {/* Button Section */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              className={`${classes.adminFormSubmitButton} px-6 py-1`}
              type="submit"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setValue({
                  name: "",
                  dob: "",
                  email: "",
                  department: "",
                  contactNumber: "",
                  avatar: "",
                  batch: "",
                  gender: "",
                  year: "",
                  fatherName: "",
                  motherName: "",
                  section: "",
                  fatherContactNumber: "",
                  motherContactNumber: "",
                });
                setError({});
              }}
              className={`${classes.adminFormClearButton} px-6 py-1`}
              type="button"
            >
              Clear
            </button>
          </div>
  
          {/* Loading and Error Message */}
          <div ref={errorRef} className={classes.loadingAndError}>
            {loading && (
              <Spinner
                message="Adding Student"
                height={30}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
            {(error.emailError || error.backendError) && (
              <p className="text-red-500">
                {error.emailError || error.backendError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default Body;