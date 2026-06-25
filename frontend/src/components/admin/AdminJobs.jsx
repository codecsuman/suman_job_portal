import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
    // ===========================
    // Fetch Admin Jobs
    // ===========================
    useGetAllAdminJobs();

    const [input, setInput] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ===========================
    // Search Filter
    // ===========================
    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Hero / Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl mb-10">
                    
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-6 px-8 py-10">
                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                Manage Jobs
                            </h1>
                            <p className="text-blue-100 mt-2">
                                Create, search, and manage your active job listings and review incoming configurations.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Control Panel: Search & Actions */}
                <div className="bg-white rounded-3xl shadow-2xl border p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full md:w-96 h-11 rounded-xl"
                            placeholder="🔍 Search by job title..."
                        />

                        <Button
                            className="w-full md:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] shadow-lg text-white"
                            onClick={() => navigate("/admin/jobs/create")}
                        >
                            + New Job
                        </Button>

                    </div>
                </div>

                {/* Table Data Wrapper */}
                <div className="bg-white rounded-3xl shadow-2xl border p-8">
                    <AdminJobsTable />
                </div>

            </div>
        </div>
    );
};

export default AdminJobs;