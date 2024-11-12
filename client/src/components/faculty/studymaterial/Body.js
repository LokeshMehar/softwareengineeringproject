import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";



import { addStudyMaterial } from "../../../redux/actions/facultyActions";
import { ADD_STUDYMATERIAL, SET_ERRORS } from "../../../redux/actionTypes";


import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [file, setFile] = useState(null);
  const [value, setValue] = useState({
    subjectCode: "",
    section: "",
    year: "",
    title: "",
    department: user.result.department,
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
      });
    }
  }, [store.errors]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectCode", value.subjectCode);
    formData.append("section", value.section);
    formData.append("year", value.year);
    formData.append("title", value.title);
    formData.append("department", user.result.department);

    dispatch(addStudyMaterial(formData));
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
        <div className="mr-10 bg-white flex flex-col rounded-xl">
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
                    sx={{ height: 36 }}
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
                    sx={{ height: 36 }}
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
                  <input
                    required
                    className={classes.adminInput}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
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
                    department: "",
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
              {(error.materialError || error.backendError) && (
                <p className="text-red-500">
                  {error.materialError || error.backendError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
