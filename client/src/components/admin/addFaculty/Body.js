import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addFaculty } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    joiningYear: Date().split(" ")[3],
    gender: "",
    designation: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({ ...value, email: "" });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addFaculty(value));
  };

  useEffect(() => {
    if (store.errors || store.admin.facultyAdded) {
      setLoading(false);
      if (store.admin.facultyAdded) {
        setValue({
          name: "",
          dob: "",
          email: "",
          department: "",
          contactNumber: "",
          avatar: "",
          joiningYear: Date().split(" ")[3],
          gender: "",
          designation: "",
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_FACULTY, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.facultyAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-3 p-2">
  <div className="space-y-5">
    {/* Header Section */}
    <div className="flex text-gray-400 items-center space-x-2">
      <AddIcon />
      <h1 className="text-lg md:text-xl">Add Faculty</h1>
    </div>
    {/* Form Container */}
    <div className="mr-0 md:mr-10 bg-white flex flex-col rounded-xl p-6 md:p-8 shadow-md">
      <form className={classes.adminForm0} onSubmit={handleSubmit}>
        {/* Form Fields Section */}
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
          
          {/* Left Column */}
          <div className="flex flex-col space-y-6 md:w-1/2">
            <div className={classes.adminForm3}>
              <h1 className={classes.adminLabel}>Name :</h1>
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
              <h1 className={classes.adminLabel}>DOB :</h1>
              <input
                placeholder="DD/MM/YYYY"
                required
                className={`${classes.adminInput} w-full`}
                type="date"
                value={value.dob}
                onChange={(e) => setValue({ ...value, dob: e.target.value })}
              />
            </div>

            <div className={classes.adminForm3}>
              <h1 className={classes.adminLabel}>Email :</h1>
              <input
                placeholder="Email"
                required
                className={`${classes.adminInput} w-full`}
                type="email"
                value={value.email}
                onChange={(e) => setValue({ ...value, email: e.target.value })}
              />
            </div>

            <div className={classes.adminForm3}>
              <h1 className={classes.adminLabel}>Designation :</h1>
              <input
                placeholder="Designation"
                required
                className={`${classes.adminInput} w-full`}
                type="text"
                value={value.designation}
                onChange={(e) => setValue({ ...value, designation: e.target.value })}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6 md:w-1/2">
            <div className={classes.adminForm3}>
              <h1 className={classes.adminLabel}>Department :</h1>
              <Select
                required
                displayEmpty
                sx={{ height: 36, width: "100%" }}
                inputProps={{ "aria-label": "Without label" }}
                value={value.department}
                onChange={(e) => setValue({ ...value, department: e.target.value })}
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
              <h1 className={classes.adminLabel}>Gender :</h1>
              <Select
                required
                displayEmpty
                sx={{ height: 36, width: "100%" }}
                inputProps={{ "aria-label": "Without label" }}
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
              <h1 className={classes.adminLabel}>Contact Number :</h1>
              <input
                required
                placeholder="Contact Number"
                className={`${classes.adminInput} w-full`}
                type="number"
                value={value.contactNumber}
                onChange={(e) => setValue({ ...value, contactNumber: e.target.value })}
              />
            </div>

            <div className={classes.adminForm3}>
              <h1 className={classes.adminLabel}>Avatar :</h1>
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) => setValue({ ...value, avatar: base64 })}
              />
            </div>
          </div>
        </div>

        {/* Button Container */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button className={`${classes.adminFormSubmitButton} px-6 py-1`} type="submit">
            Submit
          </button>
          <button
            onClick={() => {
              setValue({
                name: "",
                dob: "",
                email: "",
                designation: "",
                department: "",
                contactNumber: "",
                avatar: "",
                joiningYear: Date().split(" ")[3],
                password: "",
                username: "",
              });
              setError({});
            }}
            className={`${classes.adminFormClearButton} px-6 py-2`}
            type="button"
          >
            Clear
          </button>
        </div>

        {/* Loading and Error Message */}
        <div className={classes.loadingAndError}>
          {loading && (
            <Spinner
              message="Adding Faculty"
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
