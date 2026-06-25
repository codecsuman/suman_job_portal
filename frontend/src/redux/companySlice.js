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

    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },

    resetSingleCompany: (state) => {
      state.singleCompany = {};
    },

    resetCompanies: (state) => {
      state.companies = [];
    },

    resetCompanyState: (state) => {
      state.singleCompany = {};
      state.companies = [];
      state.searchCompanyByText = "";
    },
  },
});

export const {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
  resetSingleCompany,
  resetCompanies,
  resetCompanyState,
} = companySlice.actions;

export default companySlice.reducer;