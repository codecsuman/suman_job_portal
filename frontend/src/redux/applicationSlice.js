import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applicants: {
    applications: [],
  },
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },

    // 🔴 REAL-TIME: someone applied while recruiter is viewing this job
    addNewApplicant: (state, action) => {
      const exists = state.applicants.applications.find(
        (a) => a._id === action.payload._id,
      );
      if (!exists) {
        state.applicants.applications.unshift(action.payload);
      }
    },

    // 🔴 REAL-TIME / optimistic: accept / reject
    updateApplicantStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const app = state.applicants.applications.find(
        (a) => a._id === applicationId,
      );
      if (app) app.status = status;
    },

    // 🔴 REAL-TIME / optimistic: interview scheduled or edited
    setApplicantInterview: (state, action) => {
      const { applicationId, interview } = action.payload;
      const app = state.applicants.applications.find(
        (a) => a._id === applicationId,
      );
      if (app) app.interview = interview;
    },

    resetApplicants: (state) => {
      state.applicants = { applications: [] };
    },
  },
});

export const {
  setAllApplicants,
  addNewApplicant,
  updateApplicantStatus,
  setApplicantInterview,
  resetApplicants,
} = applicationSlice.actions;

export default applicationSlice.reducer;
