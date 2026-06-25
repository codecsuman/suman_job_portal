import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useSelector } from "react-redux";

import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
    const { id } = useParams();

    useGetCompanyById(id);

    const navigate = useNavigate();

    const { singleCompany } = useSelector(
        (store) => store.company
    );

    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
    });

    // ===========================
    // Input Change
    // ===========================
    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    // ===========================
    // File Upload
    // ===========================
    const changeFileHandler = (e) => {
        setInput({
            ...input,
            file: e.target.files?.[0] || null,
        });
    };

    // ===========================
    // Update Company
    // ===========================
    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);

            const res = await axios.put(
                `${COMPANY_API_END_POINT}/update/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                navigate("/admin/companies");
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to update company."
            );
        } finally {
            setLoading(false);
        }
    };

    // ===========================
    // Load Company Data
    // ===========================
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany?.name || "",
                description:
                    singleCompany?.description || "",
                website: singleCompany?.website || "",
                location: singleCompany?.location || "",
                file: null,
            });
        }
    }, [singleCompany]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl mb-10">

                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center gap-6 px-8 py-10">

                        <div className="bg-white/20 backdrop-blur-lg p-5 rounded-2xl">
                            <img
                                src={
                                    singleCompany?.logo ||
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="logo"
                                className="w-14 h-14 rounded-xl object-cover"
                            />
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                Company Setup
                            </h1>

                            <p className="text-blue-100 mt-2">
                                Update your company profile, website, logo and
                                company information.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Form */}
                <form
                    onSubmit={submitHandler}
                    className="bg-white rounded-3xl shadow-2xl border p-8"
                >

                    <div className="flex items-center justify-between mb-8">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                navigate("/admin/companies")
                            }
                            className="rounded-xl"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Company Details
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <Label className="mb-2 block">
                                Company Name
                            </Label>

                            <Input
                                required
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block">
                                Description
                            </Label>

                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block">
                                Website
                            </Label>

                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block">
                                Location
                            </Label>

                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="md:col-span-2">

                            <Label className="mb-2 block">
                                Company Logo
                            </Label>

                            <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 bg-blue-50">

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />

                                <p className="text-sm text-gray-500 mt-3">
                                    Upload JPG, PNG or WEBP image.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-10">

                        {loading ? (
                            <Button
                                disabled
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Updating Company...
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                            >
                                Update Company
                            </Button>
                        )}

                    </div>

                </form>

            </div>
        </div>
    );
};

export default CompanySetup;