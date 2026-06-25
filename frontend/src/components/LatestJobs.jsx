import React from "react";
import { useSelector } from "react-redux";

import LatestJobCards from "./LatestJobCards";

const LatestJobs = () => {
    const { allJobs } = useSelector(
        (store) => store.job
    );

    return (
        <section className="max-w-7xl mx-auto px-6 my-28">

            {/* Section Header */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-10">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Latest & Top
                </span>{" "}
                Job Openings
            </h1>

            {allJobs?.length > 0 ? (
                /* Dynamic Responsive Cards Grid Setup */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

                    {allJobs
                        .slice(0, 6)
                        .map((job) => (
                            <LatestJobCards
                                key={job._id}
                                job={job}
                            />
                        ))}

                </div>
            ) : (
                /* Modern Minimalistic Fallback State Container Box */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] max-w-xl mx-auto">
                    <span className="text-3xl mb-3">💼</span>
                    <h2 className="text-lg font-extrabold text-slate-700 tracking-tight">
                        No Openings Available Right Now
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1 tracking-wide text-center max-w-xs px-4">
                        New professional assignments hit our system daily. Please revisit this segment shortly!
                    </p>
                </div>
            )}

        </section>
    );
};

export default LatestJobs;