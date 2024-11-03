import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import { useMediaQuery } from "@mui/material";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    dispatch(getSubject(value));
  };

  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-3 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1 className="text-lg md:text-xl">All Subjects</h1>
        </div>
        <div className={`${classes.deletePar} flex flex-col`}>
          <form className="flex flex-col items-center space-y-3 md:items-start" onSubmit={handleSubmit}>
            <label htmlFor="department" className="text-sm md:text-base">Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: '100%', maxWidth: 224 }}
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

            <label htmlFor="year" className="text-sm md:text-base mt-4">Year</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: '100%', maxWidth: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.year}
              onChange={(e) => setValue({ ...value, year: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </Select>

            <button className={`${classes.adminFormSubmitButton} w-full mt-5`} type="submit">
              Search
            </button>
          </form>

          <div className="flex-1 overflow-y-auto mt-5">
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
              {(error.noSubjectError || error.backendError) && (
                <p className="text-red-500 text-lg md:text-2xl font-bold">
                  {error.noSubjectError || error.backendError}
                </p>
              )}
            </div>

            {search && !loading && Object.keys(error).length === 0 && subjects?.length !== 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {isMobile ? (
                  subjects.map((sub, idx) => (
                    <div key={idx} className="p-4 bg-white shadow-lg rounded-lg">
                      <h1 className="font-bold text-lg">Sr No: {idx + 1}</h1>
                      <p><strong>Subject Code:</strong> {sub.subjectCode}</p>
                      <p><strong>Subject Name:</strong> {sub.subjectName}</p>
                      <p><strong>Total Lectures:</strong> {sub.totalLectures}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-x-2">
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Sr no.</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-2`}>Subject Code</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-3`}>Subject Name</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Total Lectures</h1>
                    </div>
                    {subjects.map((sub, idx) => (
                      <div key={idx} className={`${classes.adminDataBody} grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-x-2`}>
                        <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>{idx + 1}</h1>
                        <h1 className={`col-span-2 truncate ${classes.adminDataBodyFields}`}>{sub.subjectCode}</h1>
                        <h1 className={`col-span-3 truncate ${classes.adminDataBodyFields}`}>{sub.subjectName}</h1>
                        <h1 className={`col-span-1 truncate ${classes.adminDataBodyFields}`}>{sub.totalLectures}</h1>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
