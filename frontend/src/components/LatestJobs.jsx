import React from "react";
import { useSelector } from "react-redux";

import LatestJobCards from "./LatestJobCards";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto px-6 my-24 font-body">
      <h1
        className="font-display font-semibold text-3xl md:text-4xl tracking-tight mb-10"
        style={{ color: "var(--ink)" }}
      >
        Latest &amp; Top{" "}
        <span style={{ color: "var(--marigold-deep)" }}>Job Openings</span>
      </h1>

      {allJobs?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border max-w-xl mx-auto"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="text-3xl mb-3">💼</span>
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            No Openings Available Right Now
          </h2>
          <p
            className="text-xs font-mono-ui mt-1 tracking-wide text-center max-w-xs px-4"
            style={{ color: "var(--ink-soft)" }}
          >
            New professional assignments hit our system daily. Please revisit
            this segment shortly!
          </p>
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
