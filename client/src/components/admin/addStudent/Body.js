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
import { useForm } from "react-hook-form";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [userCurr, setUserCurr] = useState(null); 

  const errorRef = useRef();

  const onSubmit = (data) => {
    setLoading(true);
    setUserCurr(null);  
    dispatch(addStudent(data)).then((res) => {
      setLoading(false);
      if (res && res.username) { 
        setUserCurr(res.username);  
      }
      reset();
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (store.errors && Object.keys(store.errors).length > 0) {
      setLoading(false);
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [dispatch, store.errors]);
 
  return (
    <div className="flex-0.9 mt-1 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Add Student</h1>
        </div>
        <div className= {classes.bodyp}>
          <form
            className={`${classes.adminForm0} scrollbar-thin scrollbar-track-white scrollbar-thumb-black overflow-y-scroll h-[27rem]`}
            onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
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
                <div className={classes.adminForm3}>
                <label className={`${classes.adminLabel} text-base`}>DOB :</label>
                    <input
                      placeholder="DD/MM/YYYY"
                      type="date"
                      className={`${classes.adminInput} w-full`}
                      {...register("dob", { required: "Date of birth is required" })}
                    />
                    {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                </div>
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
                <div className={classes.adminForm3}>
                  <label className={classes.adminLabel}>Batch :</label>
                  <input
                    placeholder="yyyy-yyyy"
                    className={classes.adminInput}
                    type="text"
                    {...register("batch",{
                      required:"Batch Is Requried",
                      pattern: {
                        value: /^\d{4}-\d{4}$/,
                        message: "Batch must be in the format yyyy-yyyy",
                      }
                    })}
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Father's Name :</h1>
                  <input
                    required
                    placeholder="Father's Name"
                    className={classes.adminInput}
                    type="text"
                    {...register("fatherName", {
                      required: "Father's name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Father's name must contain only letters and spaces",
                      }
                    })}
                  />
                  {errors.fatherName && <p className="text-red-500">{errors.fatherName.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Mother's Name :</h1>
                  <input
                    required
                    placeholder="Mother's Name"
                    className={classes.adminInput}
                    type="text"
                    {...register("motherName", {
                      required: "Father's name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Father's name must contain only letters and spaces",
                      }
                    })}
                  />
                  {errors.fatherName && <p className="text-red-500">{errors.fatherName.message}</p>}
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Year :</h1>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{ height: 36  ,backgroundColor: "white"}}
                    {...register("year", { required: "Year is required" })}
                    >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{ height: 36  ,backgroundColor: "white"}}
                    {...register("department", { required: "Department is required" })}
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
                    displayEmpty
                    defaultValue=""
                    sx={{ height: 36  ,backgroundColor: "white"}}
                    {...register("gender", { required: "Gender is required" })}
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
                    placeholder="Contact Number"
                    className={classes.adminInput}
                    type="tel"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be 10 digits",
                      }
                    })}
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>
                    Father's Contact Number :
                  </h1>

                  <input
                    placeholder="Father's Contact Number"
                    className={classes.adminInput}
                    type="tel"
                    {...register("fatherContactNumber", {
                      required: "Father's contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Father's contact number must be 10 digits",
                      }
                    })}
                  />
                  {errors.fatherContactNumber && <p className="text-red-500">{errors.fatherContactNumber.message}</p>}
                
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>
                    Mother's Contact Number :
                  </h1>

                  <input
                    placeholder="Mother's Contact Number"
                    className={classes.adminInput}
                    type="tel"
                    {...register("motherContactNumber", {
                      required: "Father's contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Mother's contact number must be 10 digits",
                      }
                    })}
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Section :</h1>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{ height: 36  ,backgroundColor: "white"}}
                    {...register("section", { required: "Section is required" })}
                    >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
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
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
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
                className={classes.adminFormClearButton}
                type="button">
                Clear
              </button>
            </div>
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


