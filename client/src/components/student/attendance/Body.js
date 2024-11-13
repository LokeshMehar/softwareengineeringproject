import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const attendance = useSelector((state) => state.student.attendance.result);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3 px-3 md:px-6 bg-black text-white">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1 className="text-lg md:text-xl">Attadance</h1>
        </div>
        <div className="mr-10 bg-black text-white rounded-xl pt-6 pl-6 h-auto md:h-[29.5rem] overflow-y-auto">
          <div className="col-span-3 mr-6">
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
              {error.noSubjectError && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError}
                </p>
              )}
            </div>
            {!loading &&
              Object.keys(error).length === 0 &&
              attendance?.length !== 0 && (
                <div className={classes.adminData}>
                  {/* Responsive Design */}
                  <div className="hidden md:block">
                    {/* Desktop view - Full Screen and White Background */}
                    <div className="grid grid-cols-8 gap-2">
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Sr no.</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Subject Code</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-2`}>Subject Name</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-2`}>Attended</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Total</h1>
                      <h1 className={`${classes.adminDataHeading} col-span-1`}>Percentage</h1>
                    </div>
                    {attendance?.map((res, idx) => (
                      <div key={idx} className="grid grid-cols-8 gap-2 mb-4">
                        <h1 className="col-span-1">{idx + 1}</h1>
                        <h1 className="col-span-1">{res.subjectCode}</h1>
                        <h1 className="col-span-2">{res.subjectName}</h1>
                        <h1 className="col-span-2">{res.attended}</h1>
                        <h1 className="col-span-1">{res.total}</h1>
                        <h1 className="col-span-1">{res.percentage}</h1>
                      </div>
                    ))}
                  </div>

                  {/* Mobile view - Stacked Compact Layout */}
                  <div className="block md:hidden">
                    {attendance?.map((res, idx) => (
                      <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow-md grid grid-cols-1 gap-2 text-xs md:text-sm lg:text-base mb-4">
                        <div><strong>Sr No:</strong> {idx + 1}</div>
                        <div><strong>Subject Code:</strong> {res.subjectCode}</div>
                        <div><strong>Subject Name:</strong> {res.subjectName}</div>
                        <div><strong>Attended:</strong> {res.attended}</div>
                        <div><strong>Total:</strong> {res.total}</div>
                        <div><strong>Percentage:</strong> {res.percentage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

