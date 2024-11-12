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
import { useForm } from "react-hook-form";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [response, setResponse] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      dob: "",
      email: "",
      department: "",
      contactNumber: "",
      avatar: "",
      joiningYear: Date().split(" ")[3],
      gender: "",
      designation: "",
    }
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue("email", "");
    }
  }, [store.errors, setValue]);

  const onSubmit = (data) => {
    setResponse(null);
    setError({});
    setLoading(true);
    dispatch(addFaculty(data))
      .then((res) => {
        setLoading(false);
        setResponse(res);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (store.errors || store.admin.facultyAdded) {
      setLoading(false);
      if (store.admin.facultyAdded) {
        reset();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_FACULTY, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.facultyAdded, dispatch, reset]);

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
        <div className= {classes.bodyp}>
          <form className={classes.adminForm0} onSubmit={handleSubmit(onSubmit)}>
            {/* Form Fields Section */}
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
              
              {/* Left Column */}
              <div className="flex flex-col space-y-6 md:w-1/2">
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>
                  <input
                    placeholder="Full Name"
                    className={classes.adminInput}
                    {...register("name", {
                      required: "Name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Name must contain only letters and spaces"
                      }
                    })}
                  />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>
                  <input
                    placeholder="DD/MM/YYYY"
                    type="date"
                    className={classes.adminInput}
                    {...register("dob", { required: "Date of birth is required" })}
                  />
                  {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>
                  <input
                    placeholder="Email"
                    type="email"
                    className={classes.adminInput}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Enter a valid email address"
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Designation :</h1>
                  <input
                    placeholder="Designation"
                    className={classes.adminInput}
                    {...register("designation", { required: "Designation is required" })}
                  />
                  {errors.designation && <p className="text-red-500">{errors.designation.message}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col space-y-6 md:w-1/2">
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    displayEmpty
                    sx={{ height: 36, width: "100%" ,backgroundColor: "white" }}
                    {...register("department", { required: "Department is required" })}
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department && <p className="text-red-500">{errors.department.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Gender :</h1>
                  <Select
                    displayEmpty
                    sx={{ height: 36, width: "100%"  ,backgroundColor: "white"}}
                    {...register("gender", { required: "Gender is required" })}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>
                  <input
                    placeholder="Contact Number"
                    className={classes.adminInput}
                    {...register("contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be 10 digits"
                      }
                    })}
                  />
                  {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Avatar :</h1>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setValue("avatar", base64)}
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
                onClick={() => reset()}
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
          {response && (
            <div className="mt-4 p-4 border rounded shadow-md">
              <h3 className="text-white font-semibold">Faculty Created Successfully!</h3>
              <p className="text-white font-semibold">Username: {response.response.username}</p>
              <p className="text-white font-semibold">Default Password: "DD-MM-YYYY"</p>
              <a href="/faculty/update/password" className="text-blue-500 underline">Update Password</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
