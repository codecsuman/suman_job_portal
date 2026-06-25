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

    resetApplicants: (state) => {
      state.applicants = {
        applications: [],
      };
    },
  },
});

export const { setAllApplicants, resetApplicants } = applicationSlice.actions;

export default applicationSlice.reducer;