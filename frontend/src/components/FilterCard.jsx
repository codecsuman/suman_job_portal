import React, { useEffect, useState } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Bangalore",
      "Hyderabad",
      "Pune",
      "Mumbai",
      "Delhi NCR",
      "Noida",
      "Gurgaon",
      "Chennai",
      "Kolkata",
      "Ahmedabad",
      "Jaipur",
      "Lucknow",
      "Indore",
      "Bhubaneswar",
      "Patna",
      "Ranchi",
      "Raipur",
      "Bhopal",
      "Nagpur",
      "Kochi",
      "Coimbatore",
      "Visakhapatnam",
      "Surat",
      "Chandigarh",
      "Mysore",
      "Remote",
      "Work From Home",
    ],
  },

  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "MERN Stack Developer",
      "React Developer",
      "Angular Developer",
      "Vue Developer",
      "Node.js Developer",
      "Java Developer",
      "Python Developer",
      "PHP Developer",
      "Android Developer",
      "iOS Developer",
      "Flutter Developer",
      "DevOps Engineer",
      "Cloud Engineer",
      "Software Engineer",
      "Data Analyst",
      "Data Scientist",
      "AI / ML Engineer",
      "Cyber Security",
      "QA Engineer",
      "UI / UX Designer",
      "Graphic Designer",
      "Business Analyst",
      "Product Manager",
      "Digital Marketing",
      "HR Executive",
    ],
  },

  {
    filterType: "Experience",
    array: [
      "Fresher",
      "0-1 Years",
      "1-2 Years",
      "2-3 Years",
      "3-5 Years",
      "5-8 Years",
      "8-10 Years",
      "10+ Years",
    ],
  },

  {
    filterType: "Job Type",
    array: [
      "Full-Time",
      "Part-Time",
      "Internship",
      "Contract",
      "Remote",
      "Hybrid",
    ],
  },

  {
    filterType: "Salary",
    array: [
      "₹10,000 - ₹20,000",
      "₹20,000 - ₹40,000",
      "₹40,000 - ₹60,000",
      "₹60,000 - ₹80,000",
      "₹80,000 - ₹1 Lakh",
      "₹1 Lakh - ₹2 Lakh",
      "₹2 Lakh - ₹5 Lakh",
      "₹5 Lakh - ₹10 Lakh",
      "₹10 Lakh - ₹20 Lakh",
      "₹20 Lakh+",
    ],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();

  const [selectedValue, setSelectedValue] = useState("");

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  const clearFilter = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery(""));
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

      {/* Sidebar Header Section */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <h1 className="font-extrabold text-lg text-slate-800 tracking-tight">
          Filter Jobs
        </h1>

        <Button
          size="sm"
          variant="ghost"
          onClick={clearFilter}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl px-3 h-8 transition-all"
        >
          Clear All
        </Button>
      </div>

      {/* Form Interactive Group */}
      <RadioGroup
        value={selectedValue}
        onValueChange={changeHandler}
        className="space-y-6"
      >
        {filterData.map((data, index) => (
          <div
            key={index}
            className="group"
          >
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 block">
              {data.filterType}
            </h2>

            {/* Custom styled list wrapper with customized elegant modern scroll track bars */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

              {data.array.map((item, idx) => {
                const itemId = `${index}-${idx}`;
                const isChecked = selectedValue === item;

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

            </div>

            {/* Subtle row separation element */}
            {index < filterData.length - 1 && (
              <hr className="mt-5 border-slate-100" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;