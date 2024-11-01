import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import { createNotice } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { CREATE_NOTICE, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    date: "",
    noticeFor: "",
    topic: "",
    content: "",
    from: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({ date: "", noticeFor: "", topic: "", content: "", from: "" });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createNotice(value));
  };

  useEffect(() => {
    if (store.errors || store.admin.noticeCreated) {
      setLoading(false);
      if (store.admin.noticeCreated) {
        setValue({
          date: "",
          noticeFor: "",
          topic: "",
          content: "",
          from: "",
        });
        dispatch({ type: CREATE_NOTICE, payload: false });
        dispatch({ type: SET_ERRORS, payload: {} });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.noticeCreated]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-6 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1 className="text-lg md:text-xl">Create Notice</h1>
        </div>
        <div className="mr-0 md:mr-20 bg-white flex flex-col rounded-xl p-4 md:flex-row overflow-hidden shadow-md">
          {/* Scrollable container */}
          <div className="overflow-y-auto max-h-[75vh] md:max-h-[80vh] space-y-6 p-4 flex-1">
            <form className="space-y-6 w-full" onSubmit={handleSubmit}>
              {/* Fields Container */}
              <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
                {/* Left Side Form Fields */}
                <div className="flex flex-col space-y-6 md:w-1/2">
                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Date :</h1>
                    <input
                      placeholder="Date"
                      required
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="date"
                      value={value.date}
                      onChange={(e) => setValue({ ...value, date: e.target.value })}
                    />
                  </div>

                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>Topic :</h1>
                    <input
                      required
                      placeholder="Topic"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="text"
                      value={value.topic}
                      onChange={(e) => setValue({ ...value, topic: e.target.value })}
                    />
                  </div>

                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>To :</h1>
                    <Select
                      required
                      displayEmpty
                      sx={{ height: 36, minWidth: "100%", maxWidth: "400px" }}
                      inputProps={{ "aria-label": "Without label" }}
                      value={value.noticeFor}
                      onChange={(e) => setValue({ ...value, noticeFor: e.target.value })}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="faculty">Faculty</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </div>

                  <div className={classes.adminForm3}>
                    <h1 className={`${classes.adminLabel} text-base`}>From :</h1>
                    <input
                      required
                      placeholder="From"
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      type="text"
                      value={value.from}
                      onChange={(e) => setValue({ ...value, from: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right Side Form Fields */}
                <div className="flex flex-col space-y-6 md:w-1/2">
                  <div className={classes.adminForm3}>
                    <h1 className={`self-start ${classes.adminLabel}`}>Content :</h1>
                    <textarea
                      rows={10}
                      cols={40}
                      required
                      placeholder="Content...."
                      className={`${classes.adminInput} w-full max-w-xs md:max-w-[400px]`}
                      value={value.content}
                      onChange={(e) => setValue({ ...value, content: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Button Container */}
              <div className={`${classes.adminFormButton} flex justify-center items-center`}>
                <button className={`${classes.adminFormSubmitButton} px-6 py-1`} type="submit">
                  Submit
                </button>
                <button
                  onClick={() => {
                    setValue({
                      date: "",
                      noticeFor: "",
                      topic: "",
                      content: "",
                      from: "",
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
              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner
                    message="Creating Notice"
                    height={30}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                )}
                {(error.noticeError || error.backendError) && (
                  <p className="text-red-500">
                    {error.noticeError || error.backendError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
