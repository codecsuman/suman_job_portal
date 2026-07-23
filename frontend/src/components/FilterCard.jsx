import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setJobFilter, clearJobFilters } from "@/redux/jobSlice";
import {
  LOCATIONS,
  INDUSTRIES,
  JOB_TYPES,
  EXPERIENCE_RANGES,
  SALARY_RANGES,
} from "@/utils/filterOptions";

// 🔧 FIXED: previously every section (Location, Industry, Experience, Job
// Type, Salary) fed into ONE shared `searchedQuery` value — selecting a
// location would just overwrite whatever job-type you'd picked before it,
// and none of it matched real fields on the Job model. Now each section
// dispatches its own key into `jobFilters`, and those exact keys map 1:1
// to query params the backend's getAllJobs already understands.
const FilterCard = () => {
  const dispatch = useDispatch();
  const { jobFilters } = useSelector((store) => store.job);

  const selectExperience = (label) => {
    const range = EXPERIENCE_RANGES.find((r) => r.label === label);
    dispatch(setJobFilter({ key: "experienceLabel", value: label }));
    dispatch(setJobFilter({ key: "experienceMin", value: range?.min ?? null }));
    dispatch(setJobFilter({ key: "experienceMax", value: range?.max ?? null }));
  };

  const selectSalary = (label) => {
    const range = SALARY_RANGES.find((r) => r.label === label);
    dispatch(setJobFilter({ key: "salaryLabel", value: label }));
    dispatch(setJobFilter({ key: "salaryMin", value: range?.min ?? null }));
    dispatch(setJobFilter({ key: "salaryMax", value: range?.max ?? null }));
  };

  const sections = [
    {
      title: "Location",
      key: "location",
      value: jobFilters.location,
      onChange: (v) => dispatch(setJobFilter({ key: "location", value: v })),
      options: LOCATIONS,
    },
    {
      title: "Industry",
      key: "category",
      value: jobFilters.category,
      onChange: (v) => dispatch(setJobFilter({ key: "category", value: v })),
      options: INDUSTRIES,
    },
    {
      title: "Experience",
      key: "experienceLabel",
      value: jobFilters.experienceLabel,
      onChange: selectExperience,
      options: EXPERIENCE_RANGES.map((r) => r.label),
    },
    {
      title: "Job Type",
      key: "jobType",
      value: jobFilters.jobType,
      onChange: (v) => dispatch(setJobFilter({ key: "jobType", value: v })),
      options: JOB_TYPES,
    },
    {
      title: "Salary",
      key: "salaryLabel",
      value: jobFilters.salaryLabel,
      onChange: selectSalary,
      options: SALARY_RANGES.map((r) => r.label),
    },
  ];

  const hasActiveFilters = Object.values(jobFilters).some((v) => v);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6 pb-2">
        <h1 className="font-extrabold text-lg text-slate-800 tracking-tight">
          Filter Jobs
        </h1>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(clearJobFilters())}
            className="text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl px-3 h-8 transition-all"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.key} className="group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {section.title}
              </h2>
              {section.value && (
                <button
                  onClick={() => section.onChange("")}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-700"
                >
                  Clear
                </button>
              )}
            </div>

            <RadioGroup
              value={section.value}
              onValueChange={section.onChange}
              className="max-h-48 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
            >
              {section.options.map((item, idx) => {
                const itemId = `${section.key}-${idx}`;
                const isChecked = section.value === item;

                return (
                  <div
                    key={itemId}
                    className={`flex items-center space-x-3 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                      isChecked
                        ? "bg-blue-50/60 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <RadioGroupItem
                      id={itemId}
                      value={item}
                      className="border-slate-300 text-blue-600 focus:ring-blue-500/30 h-4 w-4"
                    />
                    <Label
                      htmlFor={itemId}
                      className="cursor-pointer text-sm font-medium w-full select-none"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            {index < sections.length - 1 && (
              <hr className="mt-5 border-slate-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
