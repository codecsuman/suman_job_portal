import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
  allAdminJobs: [],
  singleJob: {},
  allAppliedJobs: [],
  searchJobByText: "",
  searchedQuery: "",
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    // ===========================
    // Jobs
    // ===========================

    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },

    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },

    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },

    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },

    // ===========================
    // Search
    // ===========================

    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },

    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    // ===========================
    // Reset Actions
    // ===========================

    resetSingleJob: (state) => {
      state.singleJob = {};
    },

    resetAdminJobs: (state) => {
      state.allAdminJobs = [];
    },

    resetAppliedJobs: (state) => {
      state.allAppliedJobs = [];
    },

    resetJobs: (state) => {
      state.allJobs = [];
    },

    resetJobState: (state) => {
      state.allJobs = [];
      state.allAdminJobs = [];
      state.singleJob = {};
      state.allAppliedJobs = [];
      state.searchJobByText = "";
      state.searchedQuery = "";
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  resetSingleJob,
  resetAdminJobs,
  resetAppliedJobs,
  resetJobs,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;