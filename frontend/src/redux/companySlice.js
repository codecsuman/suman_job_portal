import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  singleCompany: {},
  companies: [],
  searchCompanyByText: "",
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    // 🔴 NEW: remove a company after successful delete
    removeCompany: (state, action) => {
      state.companies = state.companies.filter((c) => c._id !== action.payload);
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
  },
});

export const {
  setSingleCompany,
  setCompanies,
  removeCompany,
  setSearchCompanyByText,
} = companySlice.actions;

export default companySlice.reducer;
