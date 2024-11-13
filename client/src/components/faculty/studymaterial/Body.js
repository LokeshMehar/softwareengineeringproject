import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addStudyMaterial } from "../../../redux/actions/facultyActions";
import { ADD_STUDYMATERIAL, SET_ERRORS } from "../../../redux/actionTypes";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import FileBase from "react-file-base64"; // Importing FileBase

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const departments = useSelector((state) => state.admin.allDepartment); // Predefined department list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [file, setFile] = useState(null);
  const [value, setValue] = useState({
    subjectCode: "",
    section: "",
    year: "",
    title: "",
    department: user.result.department, // Predefined department value
    date: "", // Initialize date field
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({
        subjectCode: "",
        section: "",
        year: "",
        title: "",
        department: user.result.department,
        date: "", 
      });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const materialData = {
      material: file,
      subjectCode: value.subjectCode,
      section: value.section,
      year: value.year,
      title: value.title,
      department: user.result.department,
      date: value.date, // Send the date field to backend
    };

    console.log(materialData); // For debugging purpose
    dispatch(addStudyMaterial(materialData)); // Dispatching action with the material data
  };

  useEffect(() => {
    if (store.errors || store.faculty.materialAdded) {
      setLoading(false);
      if (store.faculty.materialAdded) {
        setValue({
          subjectCode: "",
          section: "",
          year: "",
          title: "",
          department: user.result.department,
          date: "", // Reset date field after successful addition
        });
        setFile(null);
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_STUDYMATERIAL, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.faculty.materialAdded]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Add Study Material</h1>
        </div>
        <div className="mr-10 bg-black text-white flex flex-col rounded-xl">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Title :</h1>
                  <input
                    placeholder="Material Title"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.title}
                    onChange={(e) =>
                      setValue({ ...value, title: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Code :</h1>
                  <input
                    required
                    placeholder="Subject Code"
                    className={classes.adminInput}
                    type="text"
                    value={value.subjectCode}
                    onChange={(e) =>
                      setValue({ ...value, subjectCode: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <input
                    required
                    placeholder={user.result.department}
                    disabled
                    className={classes.adminInput}
                    type="text"
                    value={user.result.department}
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Year :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 , backgroundColor:'white', color:'black'}}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.year}
                    onChange={(e) =>
                      setValue({ ...value, year: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </div>
              </div>

              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Section :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 ,backgroundColor:'white', color:'black'}}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.section}
                    onChange={(e) =>
                      setValue({ ...value, section: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                  </Select>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>File Upload :</h1>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setFile(base64)} // Handle file selection with base64 encoding
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Date :</h1>
                  <input
                    required
                    type="date"
                    className={classes.adminInput}
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className={`${classes.adminFormButton} flex justify-center space-x-4`}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({
                    subjectCode: "",
                    section: "",
                    year: "",
                    title: "",
                    department: user.result.department,
                    date: "", // Reset date on clear
                  });
                  setFile(null);
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button"
              >
                Clear
              </button>
            </div>

            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Study Material"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;