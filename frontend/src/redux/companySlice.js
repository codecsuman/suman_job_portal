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
    removeCompany: (state, action) => {
      state.companies = state.companies.filter((c) => c._id !== action.payload);
    },
    // 🔴 NEW: this was the actual bug — after editing a company (name, logo,
    // etc.) the update was never reflected in the `companies` list that
    // CompaniesTable reads from. It only "worked" if you happened to
    // navigate away and the list re-fetched from scratch.
    updateCompanyInList: (state, action) => {
      const updated = action.payload;
      const index = state.companies.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state.companies[index] = updated;
      }
      if (state.singleCompany._id === updated._id) {
        state.singleCompany = updated;
      }
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
  updateCompanyInList,
  setSearchCompanyByText,
} = companySlice.actions;

export default companySlice.reducer;
