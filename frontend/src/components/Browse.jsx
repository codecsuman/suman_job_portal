import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";

import { useDispatch, useSelector } from "react-redux";

import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.job);

  const dispatch = useDispatch();

  // ===========================
  // Clear Search Query
  // ===========================
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto my-12 px-6">
        {/* Search Header Info */}
        <div className="flex items-center gap-3 mb-10">
          <h1
            className="font-display font-semibold text-2xl tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Search Results
          </h1>
          <span
            className="font-mono-ui font-bold text-xs px-3 py-1.5 rounded-full border"
            style={{
              background: "rgba(0,184,153,0.1)",
              color: "var(--teal)",
              borderColor: "rgba(0,184,153,0.25)",
            }}
          >
            {allJobs?.length || 0} Positions
          </span>
        </div>

        {/* Job Grid Logic Shell */}
        {allJobs?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allJobs.map((job) => (
              <div
                key={job._id}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)] rounded-3xl"
              >
                <Job job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col justify-center items-center py-28 bg-white border rounded-3xl shadow-sm max-w-2xl mx-auto"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 border shadow-inner"
              style={{
                background: "var(--paper-dim)",
                borderColor: "var(--line)",
              }}
            >
              🔍
            </div>
            <h3
              className="font-display font-semibold text-lg tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              No positions discovered
            </h3>
            <p
              className="text-sm font-medium mt-1 text-center max-w-sm px-4"
              style={{ color: "var(--ink-soft)" }}
            >
              We couldn't find any job opportunities matching your criteria. Try
              adjustments or check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
