import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../utils/Spinner";
import { getSubject } from "../../../redux/actions/adminActions";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true); // Start loading as true
  const store = useSelector((state) => state);
  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    // Check for errors and update loading state accordingly
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    // Set loading to false if subjects are populated
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    // Clear errors on component mount
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-1 mt-3 px-3 md:px-6">
      <div className="space-y-5">
        <div className="flex items-center space-x-2 text-gray-400">
          <MenuBookIcon />
          <h1 className="text-lg md:text-xl">All Subjects</h1>
        </div>
        <div className="bg-black text-white rounded-xl pt-6 pl-4 pr-4 h-auto md:h-full md:overflow-hidden">
          <div className="mr-4 md:mr-6">
            <div className={classes.loadingAndError}>
              {/* Display error message if there's an error related to subjects */}
              {error.noSubjectError && (
                <p className="text-red-500 text-lg md:text-2xl font-bold">
                  {error.noSubjectError}
                </p>
              )}
            </div>

            {/* Render a message if there are no subjects and loading is false */}
            {!loading && Object.keys(error).length === 0 && subjects?.length === 0 && (
              <h1 className="text-lg md:text-xl mb-2">No subjects created for you</h1>
            )}

            {/* Only render subjects if loading is false and no error exists */}
            {!loading && Object.keys(error).length === 0 && subjects?.length > 0 && (
              <>
                {/* Mobile Layout */}
                <div className="block md:hidden space-y-4">
                  {subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 text-white p-4 rounded-lg shadow-md grid gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold">Sr no:</span> {idx + 1}
                      </div>
                      <div>
                        <span className="font-semibold">Subject Code:</span> {sub.subjectCode}
                      </div>
                      <div>
                        <span className="font-semibold">Subject Name:</span> {sub.subjectName}
                      </div>
                      <div>
                        <span className="font-semibold">Total Lectures:</span> {sub.totalLectures}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block overflow-auto">
                  <div className={classes.adminData}>
                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Sr no.</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-2`}>Subject Code</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-3`}>Subject Name</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Total Lectures</h1>
                    </div>
                    {subjects.map((sub, idx) => (
                      <div
                        key={sub.subjectCode}
                        className={`${classes.adminDataBody} grid grid-cols-1 sm:grid-cols-7 gap-2`}
                      >
                        <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>{idx + 1}</h1>
                        <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>{sub.subjectCode}</h1>
                        <h1 className={`col-span-3 ${classes.adminDataBodyFields}`}>{sub.subjectName}</h1>
                        <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>{sub.totalLectures}</h1>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
