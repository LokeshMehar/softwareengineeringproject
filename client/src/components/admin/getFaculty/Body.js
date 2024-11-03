import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import { getFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select, useMediaQuery } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const [department, setDepartment] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkedValue, setCheckedValue] = useState([]);
  const [search, setSearch] = useState(false);
  const departments = useSelector((state) => state.admin.allDepartment);
  const store = useSelector((state) => state);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleInputChange = (e) => {
    const updatedCheckedValue = [...checkedValue];
    if (e.target.checked) {
      updatedCheckedValue.push(e.target.value);
    } else {
      const index = updatedCheckedValue.indexOf(e.target.value);
      updatedCheckedValue.splice(index, 1);
    }
    setCheckedValue(updatedCheckedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getFaculty({ department }));
  };

  const faculties = useSelector((state) => state.admin.faculties?.result || []);

  useEffect(() => {
    if (faculties.length > 0) {
      setLoading(false);
    }
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-3 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1 className="text-lg md:text-xl">All Faculty</h1>
        </div>
        <div className={`${classes.deletePar} flex flex-col`} style={{ height: isMobile ? '90vh' : 'auto' }}>
          <form
            className="flex flex-col items-center space-y-3 md:items-start"
            onSubmit={handleSubmit}
          >
            <label htmlFor="department" className="text-sm md:text-base">
              Department
            </label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: '100%', maxWidth: 224 }}
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
              className={`${classes.adminFormSubmitButton} w-full mt-5`}
              type="submit"
            >
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
              {(error.noFacultyError || error.backendError) && (
                <p className="text-red-500 text-lg md:text-2xl font-bold">
                  {error.noFacultyError || error.backendError}
                </p>
              )}
            </div>

            {search && !loading && Object.keys(error).length === 0 && faculties.length > 0 && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {faculties.map((fac, idx) => (
                  <div key={idx} className="p-4 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center">
                      <p className="font-bold text-lg">Sr No: {idx + 1}</p>
                    </div>
                    <p><strong>Name:</strong> {fac.name}</p>
                    <p><strong>Username:</strong> {fac.username}</p>
                    <p><strong>Email:</strong> {fac.email}</p>
                    <p><strong>Designation:</strong> {fac.designation}</p>
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
