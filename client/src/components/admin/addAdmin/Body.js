import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FileBase from "react-file-base64";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { addAdmin } from "../../../redux/actions/adminActions";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import Select from '@mui/material/Select';

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const onSubmit = (data) => {
    setLoading(true);
    setResponse(null);
    dispatch(addAdmin(data))
      .then((res) => {
        setLoading(false);
        setResponse(res);
        reset();
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    if (store.errors && Object.keys(store.errors).length > 0) {
      setLoading(false);
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [dispatch, store.errors]);

  return (
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1 className="text-lg md:text-xl">Add Admin</h1>
        </div>
        <div className= {classes.bodyp}>
          <div className="overflow-y-auto max-h-[75vh] md:max-h-[80vh] space-y-6 p-4 flex-1">
            <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
                <div className="flex flex-col space-y-6 md:w-1/2">
                  {/* Name Field */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>Name :</label>
                    <input
                      placeholder="Full Name"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      {...register("name", {
                        required: "Name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Name must contain only letters and spaces",
                        }
                      })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* DOB Field */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>DOB :</label>
                    <input
                      placeholder="DD/MM/YYYY"
                      type="date"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      {...register("dob", { required: "Date of birth is required" })}
                    />
                    {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                  </div>

                  {/* Email Field */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>Email :</label>
                    <input
                      placeholder="Email"
                      type="email"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Enter a valid email address",
                        }
                      })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col space-y-6 md:w-1/2">
                  {/* Department Field */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>Department :</label>
                    <Select
                      defaultValue=""
                      displayEmpty
                      sx={{ height: 36, minWidth: "100%", maxWidth: "400px" ,backgroundColor: "white" }}
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

                  {/* Contact Number Field */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>Contact Number :</label>
                    <input
                      placeholder="Contact Number"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      {...register("contactNumber", {
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Contact number must be 10 digits",
                        }
                      })}
                    />
                    {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
                  </div>

                  {/* Avatar Upload */}
                  <div className={classes.adminForm3}>
                    <label className={`${classes.adminLabel} text-base`}>Avatar :</label>
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => setValue("avatar", base64)}
                    />
                  </div>
                </div>
              </div>

              <div className={`${classes.adminFormButton} flex justify-center items-center`}>
                <button className={`${classes.adminFormSubmitButton} px-6 py-1`} type="submit">
                  Submit
                </button>
                <button
                  onClick={() => reset()}
                  className={`${classes.adminFormClearButton} px-6 py-1`}
                  type="button"
                >
                  Clear
                </button>
              </div>

              {loading && (
                <Spinner message="Adding Admin" height={30} width={150} color="#111111" messageColor="blue" />
              )}
            </form>

            {response && (
              <div className="mt-4 p-4 border rounded shadow-md txt-white">
                <h3 className=" text-white font-semibold">Admin Created Successfully!</h3>
                <p className=" text-white font-semibold">Username: {response.response.username}</p>
                <p className=" text-white font-semibold">Default Password: "DD-MM-YYYY"</p>
                <a href="/admin/update/password" className="text-blue-500">Update Password</a>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default Body;
