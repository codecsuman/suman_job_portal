import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(
        (store) => store.job
    );

    const [filterJobs, setFilterJobs] = useState([]);

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
        <div className="min-h-screen bg-slate-50/50 antialiased">
            <Navbar />

            {/* Core Layout Main Section container */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Hand Sidebar Filter Section */}
                    <aside className="w-full lg:w-1/4 shrink-0">
                        <FilterCard />
                    </aside>

                    {/* Right Hand Live Grid Marketplace Jobs Section */}
                    <div className="flex-1">

                        {filterJobs?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                                <span className="text-4xl mb-3">🔍</span>
                                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                    No Matching Jobs Found
                                </h2>
                                <p className="text-sm font-medium text-slate-400 mt-1 max-w-xs text-center">
                                    Try tweaking your selected criteria pills or check another keyword location.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">

                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.95
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut"
                                        }}
                                        className="h-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Jobs;