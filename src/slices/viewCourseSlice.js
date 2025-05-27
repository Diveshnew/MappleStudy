// Importing createSlice from Redux Toolkit to create a slice of the state
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the viewCourse slice
const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,
};

// Creating a slice for managing course viewing state
const viewCourseSlice = createSlice({
  name: 'viewCourse',
  initialState,
  reducers: {
    // Action to set section data of the course
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    // Action to set the entire course data
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    // Action to set the total number of lectures
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload;
    },
    // Action to set the list of completed lectures
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload;
    },
    // Action to add a new lecture to the completed list
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload];
    },
  },
});

// Exporting actions to be used in components or middleware
export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewCourseSlice.actions;

// Exporting the reducer to be included in the store
export default viewCourseSlice.reducer;
