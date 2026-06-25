import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
    // ===========================
    // Fetch Companies
    // ===========================
    useGetAllCompanies();

    const [input, setInput] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ===========================
    // Search Company
    // ===========================
    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 shadow-2xl mb-10">

                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-10 py-10">

                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                                Companies Dashboard
                            </h1>

                            <p className="mt-3 text-blue-100 text-lg">
                                Manage all registered companies, update their
                                details, and create new company profiles.
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-8 py-5 shadow-xl">

                            <h2 className="text-4xl font-bold text-white text-center">
                                🏢
                            </h2>

                            <p className="text-blue-100 mt-2 text-center font-medium">
                                Company Management
                            </p>

                        </div>

                    </div>

                </div>

                {/* Search Section */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6 mb-8">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-5">

                        <div className="w-full md:w-[420px]">

                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="🔍 Search company by name..."
                                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <Button
                            onClick={() =>
                                navigate("/admin/companies/create")
                            }
                            className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            + New Company
                        </Button>

                    </div>

                </div>

                {/* Table Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

                    <div className="border-b bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Registered Companies
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Browse, edit and manage all companies from one
                            dashboard.
                        </p>

                    </div>

                    <div className="p-6">
                        <CompaniesTable />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Companies;