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
    <div
      className="font-body w-full bg-white rounded-3xl border p-6 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-center justify-between mb-6 pb-2">
        <h1
          className="font-display font-semibold text-lg tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Filter Jobs
        </h1>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(clearJobFilters())}
            className="font-mono-ui text-xs font-bold rounded-xl px-3 h-8 transition-all hover:bg-transparent"
            style={{ color: "var(--ink-soft)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--marigold-deep)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-soft)")
            }
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.key} className="group">
            <div className="flex items-center justify-between mb-3">
              <h2
                className="font-mono-ui font-bold text-xs uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                {section.title}
              </h2>
              {section.value && (
                <button
                  onClick={() => section.onChange("")}
                  className="font-mono-ui text-[10px] font-bold"
                  style={{ color: "var(--teal)" }}
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
                    className="flex items-center space-x-3 px-2 py-1.5 rounded-xl transition-all duration-200"
                    style={
                      isChecked
                        ? {
                            background: "rgba(255,178,56,0.14)",
                            color: "var(--marigold-deep)",
                            fontWeight: 600,
                          }
                        : { color: "var(--ink-soft)" }
                    }
                  >
                    <RadioGroupItem
                      id={itemId}
                      value={item}
                      className="h-4 w-4"
                      style={{ borderColor: "var(--line)" }}
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
              <hr className="mt-5" style={{ borderColor: "var(--line)" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
