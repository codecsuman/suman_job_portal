import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
    const [query, setQuery] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        const trimmedQuery = query.trim();

        dispatch(setSearchedQuery(trimmedQuery));
        navigate("/browse");
    };

    return (
        <section className="text-center py-10 px-4">
            <div className="flex flex-col gap-6">

                <span className="mx-auto rounded-full bg-blue-50 px-5 py-2 font-medium text-blue-600 border border-blue-100">
                    🚀 No. 1 Job Portal
                </span>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Find Your
                    <span className="text-indigo-600">
                        {" "}Dream Job
                    </span>
                    <br />
                    Build Your Future Today
                </h1>

                <p className="mx-auto max-w-2xl text-gray-600">
                    Search thousands of jobs from top companies,
                    apply with one click, and take the next step
                    in your career.
                </p>

                <div className="mx-auto flex w-full max-w-2xl items-center rounded-full border border-gray-200 bg-white pl-4 shadow-lg focus-within:border-blue-400 transition-colors">

                    <input
                        type="text"
                        aria-label="Search Jobs"
                        value={query}
                        placeholder="Search by job title, company, or keyword..."
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchJobHandler();
                            }
                        }}
                        className="h-12 w-full border-none bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />

                    <Button
                        type="button"
                        onClick={searchJobHandler}
                        className="rounded-r-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;