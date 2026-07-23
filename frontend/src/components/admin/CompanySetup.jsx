import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Building2, Upload } from "lucide-react";
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

  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] || null;
    setInput({ ...input, file });

    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

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
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update company.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany?.name || "",
        description: singleCompany?.description || "",
        website: singleCompany?.website || "",
        location: singleCompany?.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  const displayedLogo = logoPreview || singleCompany?.logo;

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <label
            htmlFor="logo-upload"
            className="relative cursor-pointer group shrink-0"
          >
            <div
              className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center overflow-hidden"
              style={{
                borderColor: "var(--marigold)",
                background: "var(--paper-dim)",
              }}
            >
              {displayedLogo ? (
                <img
                  src={displayedLogo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2
                  className="w-7 h-7"
                  style={{ color: "var(--ink-soft)" }}
                />
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </label>

          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-0.5 font-mono-ui text-[10px] tracking-widest uppercase mb-1.5"
              style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
            >
              Company Setup
            </span>
            <h1
              className="font-display font-semibold text-2xl md:text-3xl tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Edit Company Details
            </h1>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="rounded-3xl border bg-white p-8 shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center justify-between mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="rounded-xl"
              style={{ borderColor: "var(--line)" }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Company Name
              </Label>
              <Input
                required
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Description
              </Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Website
              </Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Location
              </Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            <div className="md:col-span-2">
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Company Logo
              </Label>

              <div
                className="border-2 border-dashed rounded-2xl p-6"
                style={{
                  borderColor: "var(--marigold)",
                  background: "rgba(255,178,56,0.06)",
                }}
              >
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer"
                />
                <p
                  className="text-sm mt-3"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Upload JPG, PNG or WEBP — or click the logo above.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <Button
                disabled
                className="w-full h-12 rounded-xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating Company...
              </Button>
            ) : (
              <button
                type="submit"
                className="w-full h-12 rounded-xl font-bold transition-transform hover:scale-[1.01] active:scale-95"
                style={{ background: "var(--ink)", color: "var(--marigold)" }}
              >
                Update Company
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
