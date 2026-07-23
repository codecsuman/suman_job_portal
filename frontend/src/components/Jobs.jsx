import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";

import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { Activity } from "lucide-react";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);

  // 🔴 REAL-TIME: initialize socket connection
  useSocket();

  useEffect(() => {
    if (!searchedQuery) {
      setFilterJobs(allJobs);
      return;
    }

    const query = searchedQuery.toLowerCase();
    const filteredJobs = allJobs.filter((job) => {
      return (
        job?.title?.toLowerCase().includes(query) ||
        job?.description?.toLowerCase().includes(query) ||
        job?.location?.toLowerCase().includes(query) ||
        job?.company?.name?.toLowerCase().includes(query)
      );
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div
      className="min-h-screen font-body antialiased"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Activity
            className="w-4 h-4 animate-pulse"
            style={{ color: "var(--teal)" }}
          />
          <span
            className="font-mono-ui text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--teal)" }}
          >
            Live Job Feed — New jobs appear instantly
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4 shrink-0">
            <FilterCard />
          </aside>

          <div className="flex-1">
            {filterJobs?.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="text-4xl mb-3">🔍</span>
                <h2
                  className="font-display font-semibold text-xl tracking-tight"
                  style={{ color: "var(--ink)" }}
                >
                  No Matching Jobs Found
                </h2>
                <p
                  className="text-sm font-medium mt-1 max-w-xs text-center"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Try tweaking your selected criteria pills or check another
                  keyword location.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                <AnimatePresence mode="popLayout">
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-full"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
