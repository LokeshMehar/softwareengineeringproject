import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addAdmin } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { useForm } from "react-hook-form";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [response, setResponse] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await dispatch(addAdmin(data));
      setResponse(result);
      console.log(result);
    } catch (err) {
      console.error("Error from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue("email", ""); // Reset email if there's an error
    }
  }, [store.errors, setValue]);

  useEffect(() => {
    if (store.admin.adminAdded) {
      reset(); // Reset form values
      dispatch({ type: SET_ERRORS, payload: {} });
      dispatch({ type: ADD_ADMIN, payload: false });
    }
  }, [store.admin.adminAdded, dispatch, reset]);

  const handleUpdatePassword = () => {
    navigate("/admin/update/password"); // Use navigate to go to the update password page
  };

  return (
    <div className="flex-1 mt-6 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1 className="text-lg md:text-xl">Add Admin</h1>
        </div>
        <div className="mr-0 md:mr-20 bg-white flex flex-col rounded-xl p-4 md:flex-row overflow-hidden shadow-md">
          <div className="overflow-y-auto max-h-[75vh] md:max-h-[80vh] space-y-6 p-4 flex-1">
            <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
              {/* Form Fields */}
              <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
                <div className="flex flex-col space-y-6 md:w-1/2">
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Name:</h1>
                    <input
                      placeholder="Full Name"
                      required
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="text"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>DOB:</h1>
                    <input
                      placeholder="DD/MM/YYYY"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      required
                      type="date"
                      {...register("dob", { required: "Date of birth is required" })}
                    />
                    {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                  </div>
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Email:</h1>
                    <input
                      placeholder="Email"
                      required
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="email"
                      {...register("email", { 
                        required: "Email is required", 
                        pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Email is not valid" } 
                      })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="flex flex-col space-y-6 md:w-1/2">
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Department:</h1>
                    <Select
                      required
                      displayEmpty
                      sx={{ height: 36, minWidth: "100%", maxWidth: "400px" }}
                      inputProps={{ "aria-label": "Without label" }}
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
                    <h1 className={`${classes.adminLabel} text-base`}>Contact Number:</h1>
                    <input
                      required
                      placeholder="Contact Number"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="tel"
                      {...register("contactNumber", { 
                        required: "Contact number is required", 
                        pattern: { value: /^[0-9]{10}$/, message: "Contact number must be 10 digits" } 
                      })}
                    />
                    {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
                  </div>
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Avatar:</h1>
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => setValue("avatar", base64)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit and Clear Buttons */}
              <div className={`${classes.adminFormButton} flex justify-center items-center`}>
                <button className={`${classes.adminFormSubmitButton} px-6 py-1`} type="submit">
                  Submit
                </button>
                <button
                  onClick={() => {
                    reset(); // Reset form values
                    setError({});
                  }}
                  className={`${classes.adminFormClearButton} px-6 py-1`}
                  type="button"
                >
                  Clear
                </button>
              </div>

              {/* Loading and Error Message */}
              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner message="Adding Admin" height={30} width={150} color="#111111" messageColor="blue" />
                )}
                {(error.emailError || error.backendError) && (
                  <p className="text-red-500">
                    {error.emailError || error.backendError}
                  </p>
                )}
              </div>

              {/* Displaying Backend Response */}
              {response && (
                <div className="bg-green-100 p-4 mt-4 rounded">
                  <h2 className="text-green-800 font-bold">Admin Created Successfully!</h2>
                  <div className="bg-white p-2 rounded shadow-md mt-2">
                    <h3 className="font-semibold">Account Details:</h3>
                    <p><strong>Username:</strong> {response.response.username}</p>
                    <p>
                      <strong>Password:</strong> 
                      <span> Your default password is Your DOB "DD-MM-YYYY" </span>
                    </p>
                    <button
                      onClick={handleUpdatePassword}
                      className="mt-2 text-blue-600 underline"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
