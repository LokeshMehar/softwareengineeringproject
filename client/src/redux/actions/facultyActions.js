import {
  SET_ERRORS,
  FACULTY_LOGIN,
  UPDATE_PASSWORD,
  UPDATE_FACULTY,
  ADD_TEST,
  GET_TEST,
  GET_STUDENT,
  MARKS_UPLOADED,
  ATTENDANCE_MARKED,
  GET_STUDYMATERIAL,
  ADD_STUDYMATERIAL,
} from "../actionTypes";
import * as api from "../api";

export const facultySignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.facultySignIn(formData);
    dispatch({ type: FACULTY_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/faculty/home");
    else navigate("/faculty/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const facultyUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.facultyUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/faculty/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateFaculty(formData);
    dispatch({ type: UPDATE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const createTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createTest(formData);
    alert("Test Created Successfully");

    dispatch({ type: ADD_TEST, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getTest(formData);
    dispatch({ type: GET_TEST, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getMarksStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const uploadMark =
  (marks, department, section, year, test) => async (dispatch) => {
    try {
      const formData = {
        marks,
        department,
        section,
        year,
        test,
      };
      const { data } = await api.uploadMarks(formData);
      alert("Marks Uploaded Successfully");
      dispatch({ type: MARKS_UPLOADED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const markAttendance =
  (checkedValue, subjectName, department, year, section) =>
  async (dispatch) => {
    try {
      const formData = {
        selectedStudents: checkedValue,
        subjectName,
        department,
        year,
        section,
      };
      const { data } = await api.markAttendance(formData);
      alert("Attendance Marked Successfully");
      dispatch({ type: ATTENDANCE_MARKED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };


  //Adding features
  export const addStudyMaterial = (formData) => async (dispatch) => {
    try {
      console.log(formData);
      const { data } = await api.addStudyMaterial(formData);
      alert("Study Material Added Successfully");
      console.log(data);
      dispatch({ type: ADD_STUDYMATERIAL , payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data.result });
    }
  };
  
  export const getstudymaterial = (formData1) => async (dispatch) => {
    try {
      console.log('in getstudy material')
      console.log(formData1);
      console.log('in getstudy material')
      const { data } = await api.getStudyMaterial(formData1);
      console.log(data);
      dispatch({ type: GET_STUDYMATERIAL, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };