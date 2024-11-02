import React, { useEffect, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import { useDispatch, useSelector } from "react-redux";
import { getStudent } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";
const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    year: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getStudent(value));
  };
  const students = useSelector((state) => state.admin.students.result);

  useEffect(() => {
    if (students?.length !== 0) setLoading(false);
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.98] mt-3 ml-5">
  <div className="space-y-5">
    <div className="flex text-gray-400 items-center space-x-2">
      <BoyIcon />
      <h1>All Students</h1>
    </div>
    <div className={classes.deletePar}>
      <form
        className={classes.deleteChild}
        onSubmit={handleSubmit}>
        <label htmlFor="department">Department</label>
        <Select
          required
          displayEmpty
          sx={{ height: 36, width: 224 }}
          inputProps={{ "aria-label": "Without label" }}
          value={value.department}
          onChange={(e) => setValue({ ...value, department: e.target.value })}
          className="w-full md:w-56">
          <MenuItem value="">None</MenuItem>
          {departments?.map((dp, idx) => (
            <MenuItem key={idx} value={dp.department}>
              {dp.department}
            </MenuItem>
          ))}
        </Select>
        <label htmlFor="year">Year</label>
        <Select
          required
          displayEmpty
          sx={{ height: 36, width: 224 }}
          inputProps={{ "aria-label": "Without label" }}
          value={value.year}
          onChange={(e) => setValue({ ...value, year: e.target.value })}
          className="w-full md:w-56">
          <MenuItem value="">None</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
        </Select>
        <button
          className={`${classes.adminFormSubmitButton} w-full md:w-56 mt-2`}
          type="submit">
          Search
        </button>
      </form>

      <div className="col-span-1 lg:col-span-3 mr-6">
        <div className={classes.loadingAndError}>
          {loading && (
            <Spinner
              message="Loading"
              height={50}
              width={150}
              color="#111111"
              messageColor="blue"
            />
          )}
          {(error.noStudentError || error.backendError) && (
            <p className="text-red-500 text-2xl font-bold">
              {error.noStudentError || error.backendError}
            </p>
          )}
        </div>
        {search &&
          !loading &&
          Object.keys(error).length === 0 &&
          students?.length !== 0 && (
            <div className={`${classes.adminData} overflow-auto`}>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-x-2">
                <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                  Sr no.
                </h1>
                <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                  Name
                </h1>
                <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                  Username
                </h1>
                <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                  Email
                </h1>
                <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                  Section
                </h1>
                <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                  Batch
                </h1>
              </div>
              {students?.map((stu, idx) => (
                <div
                  key={idx}
                  className={`${classes.adminDataBody} grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-x-2`}>
                  <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                    {idx + 1}
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                    {stu.name}
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                    {stu.username}
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                    {stu.email}
                  </h1>
                  <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                    {stu.section}
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                    {stu.batch}
                  </h1>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  </div>
</div>
  );
};

export default Body;
