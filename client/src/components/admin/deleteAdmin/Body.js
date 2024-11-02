import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, deleteAdmin } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { DELETE_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";

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
    dispatch(getAdmin(value));
  };
  const students = useSelector((state) => state.admin.students.result);

  const dltAdmin = (e) => {
    setError({});
    setLoading(true);
    dispatch(deleteAdmin(checkedValue));
  };

  useEffect(() => {
    if (store.admin.adminDeleted) {
      setValue({ department: "", year: "" });
      setLoading(false);
      setSearch(false);
      dispatch({ type: DELETE_ADMIN, payload: false });
    }
  }, [store.admin.adminDeleted]);

  useEffect(() => {
    if (students?.length !== 0) setLoading(false);
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
<div className="flex-1 mt-3 p-4">
  <div className="space-y-5">
    <div className="flex text-gray-400 items-center space-x-2">
      <DeleteIcon />
      <h1 className="text-lg md:text-xl">All Students</h1>
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
          sx={{ height: 36, width: 224 }} // Same width for Select
          inputProps={{ 'aria-label': 'Without label' }}
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
          className={classes.adminFormSubmitButton} // Same width as Select
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="col-span-3 mr-6 px-4">
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
          {(error.noAdminError || error.backendError) && (
            <p className="text-red-500 text-lg md:text-2xl font-bold">
              {error.noAdminError || error.backendError}
            </p>
          )}
        </div>
        
        {search && !loading && Object.keys(error).length === 0 && students?.length !== 0 && (
          <div className={`${classes.adminData} h-auto md:h-[20rem] overflow-x-auto`}>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              <h1 className={`col-span-1 ${classes.adminDataHeading}`}>Select</h1>
              <h1 className={`col-span-1 ${classes.adminDataHeading}`}>Sr no.</h1>
              <h1 className={`col-span-2 ${classes.adminDataHeading}`}>Name</h1>
              <h1 className={`col-span-2 ${classes.adminDataHeading}`}>Username</h1>
              <h1 className={`col-span-2 ${classes.adminDataHeading}`}>Email</h1>
            </div>
            {students?.map((adm, idx) => (
              <div
                key={idx}
                className={`${classes.adminDataBody} grid grid-cols-4 md:grid-cols-8 gap-2`}
              >
                <input
                  onChange={handleInputChange}
                  value={adm._id}
                  className="col-span-1 border-2 w-5 h-5 mt-3"
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
              onClick={dltAdmin}
              className={`${classes.adminFormSubmitButton} bg-blue-500 w-56`} // Fixed width for Delete button
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
