import React, { useEffect, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import { useDispatch, useSelector } from "react-redux";
import { getStudent, uploadMark } from "../../../redux/actions/facultyActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { MARKS_UPLOADED, SET_ERRORS } from "../../../redux/actionTypes";
import { getTest } from "../../../redux/actions/facultyActions";

const Body = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const tests = store.faculty.tests.result;
  const [marks, setMarks] = useState([]);

  const [value, setValue] = useState({
    department: "",
    year: "",
    section: "",
    test: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
      setValue({ department: "", year: "", section: "", test: "" });
    }
  }, [store.errors]);

  const handleInputChange = (value, _id) => {
    const newMarks = [...marks];
    let index = newMarks.findIndex((m) => m._id === _id);
    if (index === -1) {
      newMarks.push({ _id, value });
    } else {
      newMarks[index].value = value;
    }
    setMarks(newMarks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getStudent(value));
  };
  const students = useSelector((state) => state.admin.students.result);

  const uploadMarks = (e) => {
    setError({});
    dispatch(
      uploadMark(marks, value.department, value.section, value.year, value.test)
    );
  };

  useEffect(() => {
    if (students?.length !== 0) setLoading(false);
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    setValue({ ...value, department: user.result.department });
  }, []);

  useEffect(() => {
    if (store.errors || store.faculty.marksUploaded) {
      setLoading(false);
      if (store.faculty.marksUploaded) {
        setValue({ department: "", year: "", test: "", section: "" });
        setSearch(false);
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: MARKS_UPLOADED, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.faculty.marksUploaded]);

  useEffect(() => {
    if (value.year !== "" && value.section !== "") {
      dispatch(getTest(value));
    }
  }, [value.year, value.section]);

  return (
    <div className="flex flex-col flex-[0.8] mt-3 px-4">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <BoyIcon />
          <h1 className="text-lg font-semibold">All Students</h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
            <label htmlFor="year" className="text-sm font-medium">Year</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: "100%" }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.year}
              onChange={(e) => setValue({ ...value, year: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </Select>

            <label htmlFor="section" className="text-sm font-medium">Section</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: "100%" }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.section}
              onChange={(e) => setValue({ ...value, section: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>

            <label htmlFor="year" className="text-sm font-medium">Test</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: "100%" }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.test}
              onChange={(e) => setValue({ ...value, test: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {tests?.map((test, idx) => (
                <MenuItem value={test.test} key={idx}>
                  {test.test}
                </MenuItem>
              ))}
            </Select>
            <button className={`${classes.adminFormSubmitButton} w-full`} type="submit">
              Search
            </button>
          </form>
        </div>

        {search && !loading && students?.length !== 0 && (
          <div className="bg-white rounded-xl p-4 mt-5 shadow-md space-y-5">
            <div className="overflow-auto">
              <div className="grid grid-cols-8 gap-2">
                <h1 className="col-span-1 font-semibold">Sr no.</h1>
                <h1 className="col-span-2 font-semibold">Name</h1>
                <h1 className="col-span-2 font-semibold">Username</h1>
                <h1 className="col-span-1 font-semibold">Section</h1>
                <h1 className="col-span-2 font-semibold">Marks</h1>
              </div>
              {students?.map((stu, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-2 py-2">
                  <h1 className="col-span-1">{idx + 1}</h1>
                  <h1 className="col-span-2">{stu.name}</h1>
                  <h1 className="col-span-2">{stu.username}</h1>
                  <h1 className="col-span-1">{stu.section}</h1>
                  <input
                    onChange={(e) => handleInputChange(e.target.value, stu._id)}
                    value={stu.marks}
                    className="col-span-2 border rounded px-2"
                    type="text"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={uploadMarks}
              className={`${classes.adminFormSubmitButton} bg-blue-500 mt-2 w-full`}>
              Upload
            </button>
          </div>
        )}
        {(error.examError || error.backendError) && (
          <p className="text-red-500 text-xl font-bold mt-4">{error.examError || error.backendError}</p>
        )}
      </div>
    </div>
  );
};

export default Body;
