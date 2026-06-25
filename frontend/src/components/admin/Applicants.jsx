import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";

import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setAllApplicants } from "@/redux/applicationSlice";

import { toast } from "sonner";

const Applicants = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const { applicants } = useSelector(
        (store) => store.application
    );

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(
                    `${APPLICATION_API_END_POINT}/${id}/applicants`,
                    {
                        withCredentials: true,
                    }
                );

                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.error(error);

                toast.error(
                    error?.response?.data?.message ||
                        "Failed to load applicants."
                );
            }
        };

        fetchAllApplicants();
    }, [dispatch, id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 shadow-2xl mb-10">

                    {/* Background Decorations */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10">

                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                                Applicants Dashboard
                            </h1>

                            <p className="mt-3 text-blue-100 text-lg max-w-2xl">
                                Review applicants, manage applications, and
                                track hiring progress from one place.
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl px-10 py-6 text-center shadow-xl">

                            <h2 className="text-5xl font-bold text-white">
                                {applicants?.applications?.length || 0}
                            </h2>

                            <p className="mt-2 text-blue-100 font-medium tracking-wide">
                                Total Applicants
                            </p>

                        </div>

                    </div>

                </div>

                {/* Table Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Applicants List
                            </h2>

                            <p className="text-gray-500 mt-1">
                                View all applicants and manage their application
                                status.
                            </p>
                        </div>

                        <div className="bg-blue-100 text-blue-700 font-semibold px-5 py-2 rounded-full shadow">
                            {applicants?.applications?.length || 0} Candidates
                        </div>

                    </div>

                    {/* Table */}
                    <div className="p-6">
                        <ApplicantsTable />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Applicants;