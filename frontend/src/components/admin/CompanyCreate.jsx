import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";
import { toast } from "sonner";
import { Loader2, Building2, ArrowLeft } from "lucide-react";

import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);

    // ===========================
    // Register Company
    // ===========================
    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            return toast.error("Company name is required.");
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company));

                toast.success(res.data.message);

                navigate(
                    `/admin/companies/${res.data.company._id}`
                );
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to create company."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl mb-10">

                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-5 p-8">

                        <div className="bg-white/20 backdrop-blur-lg p-5 rounded-2xl">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                Create Company
                            </h1>

                            <p className="text-blue-100 mt-2">
                                Register your company and start posting jobs in
                                just a few seconds.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl border p-8">

                    <div className="mb-8">

                        <Label className="text-base font-semibold">
                            Company Name
                        </Label>

                        <Input
                            type="text"
                            value={companyName}
                            onChange={(e) =>
                                setCompanyName(e.target.value)
                            }
                            placeholder="Microsoft, Google, Amazon..."
                            className="mt-3 h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="text-gray-500 mt-3 text-sm">
                            Enter the official company name. You can update it
                            later from the company profile.
                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-end">

                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate("/admin/companies")
                            }
                            className="h-11 rounded-xl"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>

                        {loading ? (
                            <Button
                                disabled
                                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </Button>
                        ) : (
                            <Button
                                onClick={registerNewCompany}
                                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
                            >
                                Continue
                            </Button>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default CompanyCreate;