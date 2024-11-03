import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteFaculty, getFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select, useMediaQuery } from "@mui/material";
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
  const [value, setValue] = useState({ department: "" });
  const [search, setSearch] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleInputChange = (e) => {
    const tempCheck = [...checkedValue];
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      tempCheck.splice(tempCheck.indexOf(e.target.value), 1);
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

  const dltFaculty = () => {
    setError({});
    setLoading(true);
    dispatch(deleteFaculty(checkedValue));
  };

  useEffect(() => {
    if (store.admin.facultyDeleted) {
      setValue({ department: "" });
      setLoading(false);
      setSearch(false);
      dispatch({ type: DELETE_FACULTY, payload: false });
    }
  }, [store.admin.facultyDeleted]);

  useEffect(() => {
    if (faculties?.length !== 0) setLoading(false);
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-1 mt-3 p-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <DeleteIcon />
          <h1 className="text-lg md:text-xl">Delete Faculty</h1>
        </div>
        <div className={`${classes.deletePar} flex flex-col`} style={{ height: isMobile ? '90vh' : 'auto' }}>
          <form className={classes.deleteChild} onSubmit={handleSubmit}>
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
            <button className={`${classes.adminFormSubmitButton} w-56`} type="submit">
              Search
            </button>
          </form>

          <div className="flex-1 overflow-y-auto" style={{ height: '90%' }}>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner message="Loading" height={50} width={150} color="#111111" messageColor="blue" />
              )}
              {(error.noFacultyError || error.backendError) && (
                <p className="text-red-500 text-lg md:text-2xl font-bold">
                  {error.noFacultyError || error.backendError}
                </p>
              )}
            </div>

            {search && !loading && Object.keys(error).length === 0 && faculties?.length !== 0 && (
              <div className="max-h-96 md:max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4" style={{ height: '90%' }}>
                  {faculties.map((adm, idx) => (
                    <div key={idx} className="p-4 bg-white shadow rounded-lg space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={handleInputChange}
                          value={adm._id}
                          className="w-5 h-5 mr-2"
                        />
                        <p className="font-bold text-lg">Sr No.: {idx + 1}</p>
                      </div>
                      <p><strong>Name:</strong> {adm.name}</p>
                      <p><strong>Username:</strong> {adm.username}</p>
                      <p><strong>Email:</strong> {adm.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {search && Object.keys(error).length === 0 && (
              <div className="space-x-3 flex items-center justify-center mt-5">
                <button onClick={dltFaculty} className={`${classes.adminFormSubmitButton} bg-blue-500 w-56`}>
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
