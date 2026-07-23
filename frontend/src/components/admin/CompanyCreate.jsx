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
        },
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));

        toast.success(res.data.message);

        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to create company.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="p-5 rounded-2xl border"
            style={{
              borderColor: "var(--marigold)",
              background: "rgba(255,178,56,0.1)",
            }}
          >
            <Building2
              className="w-9 h-9"
              style={{ color: "var(--marigold-deep)" }}
            />
          </div>

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
              Create Company
            </h1>
            <p
              className="mt-1 text-sm md:text-base"
              style={{ color: "var(--ink-soft)" }}
            >
              Register your company and start posting jobs in just a few
              seconds.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div
          className="rounded-3xl border bg-white p-8 shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="mb-8">
            <Label
              className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Company Name
            </Label>

            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Microsoft, Google, Amazon..."
              className="h-12 rounded-xl"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            />

            <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
              Enter the official company name. You can update it later from the
              company profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="h-11 rounded-xl"
              style={{ borderColor: "var(--line)" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            {loading ? (
              <Button
                disabled
                className="h-11 rounded-xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </Button>
            ) : (
              <button
                onClick={registerNewCompany}
                className="h-11 px-6 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-95"
                style={{ background: "var(--ink)", color: "var(--marigold)" }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
