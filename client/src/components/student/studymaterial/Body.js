import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Select, TextField, Card, CardContent, Typography, Button } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { getStudyMaterial } from "../../../redux/actions/studentActions";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [search, setSearch] = useState(false);
  
  const [value, setValue] = useState({
    year: "",
    section: "",
    subjectCode: "",
    department: user.result.department 
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
    setLoading(true);
    setSearch(true);
    setError({});
    dispatch(getStudyMaterial(value));
  };

  const studyMaterials = useSelector((state) => state.faculty.studymaterial);

  useEffect(() => {
    if (studyMaterials) setLoading(false);
  }, [studyMaterials]);

  return (
    <div className="flex-[0.8] mt-3 px-4 md:px-6 lg:px-8">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <h1 className="text-xl md:text-2xl">Study Materials</h1>
        </div>
        
        <div className="bg-black text-white rounded-xl p-4 md:p-6 min-h-[29.5rem]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <form
              className="w-full lg:w-1/4 flex flex-col space-y-4"
              onSubmit={handleSubmit}
            >
              <label htmlFor="year" className="text-sm md:text-base">Year</label>
              <Select
                required
                displayEmpty
                sx={{ 
                  height: 36, 
                  width: "100%",
                  backgroundColor: 'white',
                  color: 'black',
                  '& .MuiSelect-select': {
                    padding: '8px 12px',
                  }
                }}
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

              <label htmlFor="section" className="text-sm md:text-base">Section</label>
              <Select
                required
                displayEmpty
                sx={{ 
                  height: 36, 
                  width: "100%",
                  backgroundColor: 'white',
                  color: 'black',
                  '& .MuiSelect-select': {
                    padding: '8px 12px',
                  }
                }}
                inputProps={{ "aria-label": "Without label" }}
                value={value.section}
                onChange={(e) => setValue({ ...value, section: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>

              <label htmlFor="subjectCode" className="text-sm md:text-base">Subject Code</label>
              <TextField
                required
                placeholder="Enter Subject Code"
                value={value.subjectCode}
                onChange={(e) =>
                  setValue({ ...value, subjectCode: e.target.value })
                }
                sx={{ 
                  width: "100%",
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '8px 12px',
                  }
                }}
              />

              <button
                className={`${classes.adminFormSubmitButton} w-full mt-4`}
                type="submit"
              >
                Search
              </button>
            </form>

            {/* Results Section */}
            <div className="w-full lg:w-3/4">
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
                {error.backendError && (
                  <p className="text-red-500 text-lg md:text-2xl font-bold">
                    {error.backendError}
                  </p>
                )}
              </div>

              {!loading && studyMaterials?.result?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyMaterials.result.map((material) => (
                    <Card 
                      key={material._id} 
                      sx={{ 
                        width: "100%",
                        height: "100%",
                        minHeight: '150px',
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <CardContent className="flex flex-col flex-grow">
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{
                            fontSize: {
                              xs: '1rem',
                              sm: '1.1rem',
                              md: '1.25rem'
                            },
                            fontWeight: '500'
                          }}
                        >
                          {material.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            fontSize: {
                              xs: '0.875rem',
                              sm: '0.9rem'
                            }
                          }}
                        >
                          Department: {material.department}
                        </Typography>
                        <Button
                          href={material.material}
                          download
                          variant="outlined"
                          color="primary"
                          sx={{
                            mt: 'auto',
                            width: '100%',
                            textTransform: 'none',
                            fontSize: {
                              xs: '0.875rem',
                              sm: '0.9rem'
                            }
                          }}
                        >
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;