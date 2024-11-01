import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteFaculty, getFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { DELETE_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [checkedValue, setCheckedValue] = useState([]);

  const [value, setValue] = useState({
    department: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleInputChange = (e) => {
    const tempCheck = checkedValue;
    let index;
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      index = tempCheck.indexOf(e.target.value);
      tempCheck.splice(index, 1);
    }
    setCheckedValue(tempCheck);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getFaculty(value));
  };
  const faculties = useSelector((state) => state.admin.faculties.result);

  const dltFaculty = (e) => {
    setError({});
    setLoading(true);
    dispatch(deleteFaculty(checkedValue));
  };

  useEffect(() => {
    if (store.admin.facultyDeleted) {
      setLoading(false);
      setValue({ department: "" });
      dispatch({ type: DELETE_FACULTY, payload: false });
      setSearch(false);
    }
  }, [store.admin.facultyDeleted]);

  useEffect(() => {
    if (faculties?.length !== 0) setLoading(false);
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.97] mt-3 p-4">
    <div className="space-y-8">
      <div className="flex text-gray-400 items-center space-x-2">
        <DeleteIcon />
        <h1 className="text-lg md:text-xl">Delete Faculty</h1>
      </div>
      <div className={classes.deletePar}>
        <form
          className={classes.deleteChild}
          onSubmit={handleSubmit}
        >
          <label htmlFor="department" className="text-sm md:text-base">
            Department
          </label>
          <Select
            required
            displayEmpty
            sx={{ height: 36, width: 224 }}
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
          <button
            className={classes.adminFormSubmitButton} // Reduced width for Search button
            type="submit"
          >
            Search
          </button>
        </form>
        <div className="col-span-3 mr-6 mt-6 md:mt-0">
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
            {(error.noFacultyError || error.backendError) && (
              <p className="text-red-500 text-lg md:text-2xl font-bold">
                {error.noFacultyError || error.backendError}
              </p>
            )}
          </div>
          {search &&
            !loading &&
            Object.keys(error).length === 0 &&
            faculties?.length !== 0 && (
              <div
                className={`${classes.adminData} h-[20rem] overflow-x-auto`} // Enabled horizontal scroll
              >
                <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2"> {/* Reduced gap between columns */}
                  <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                    Select
                  </h1>
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
                </div>
                {faculties?.map((adm, idx) => (
                  <div
                    key={idx}
                    className={`${classes.adminDataBody} grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2`} // Reduced gap between columns
                  >
                    <input
                      onChange={handleInputChange}
                      value={adm._id}
                      className="col-span-1 border-2 w-6 h-6 mt-3 px-2"
                      type="checkbox"
                    />
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {idx + 1}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {adm.name}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {adm.username}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {adm.email}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          {search && Object.keys(error).length === 0 && (
            <div className="space-x-3 flex items-center justify-center mt-5">
              <button
                onClick={dltFaculty}
                className={classes.adminFormSubmitButton} // Larger Delete button
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Body;
