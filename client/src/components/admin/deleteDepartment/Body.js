import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  getAllDepartment,
} from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import MenuItem from "@mui/material/MenuItem";
import { DELETE_DEPARTMENT, SET_ERRORS } from "../../../redux/actionTypes";
const Body = () => {
  const dispatch = useDispatch();
  const [department, setDepartment] = useState("");
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError({});
    dispatch(deleteDepartment({ department }));
  };
  const faculties = useSelector((state) => state.admin.faculties.result);

  useEffect(() => {
    if (store.admin.departmentDeleted) {
      setLoading(false);
      setDepartment("");
      dispatch(getAllDepartment());
      dispatch({ type: DELETE_DEPARTMENT, payload: false });
    }
  }, [store.admin.departmentDeleted]);
  useEffect(() => {
    if (faculties?.length !== 0) {
      setLoading(false);
    }
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3 p-4">
    <div className="space-y-5">
      <div className="flex text-gray-400 items-center space-x-2">
        <EngineeringIcon />
        <h1 className="text-lg md:text-xl">Delete Department</h1>
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
            sx={{ height: 36, width: 224 }} // Matching width with Select input
            inputProps={{ "aria-label": "Without label" }}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {departments?.map((dp, idx) => (
              <MenuItem key={idx} value={dp.department}>
                {dp.department}
              </MenuItem>
            ))}
          </Select>
  
          <button
            className={`${classes.adminFormSubmitButton} w-56 md:w-[224px]`} // Same width as Select
            type="submit"
          >
            Delete
          </button>
        </form>
  
        <div className="col-span-3 mr-6 px-4">
          <div className={classes.loadingAndError}>
            {loading && (
              <Spinner
                message="Deleting"
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
        </div>
      </div>
    </div>
  </div>
  );
};

export default Body;
