import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Plus, Briefcase, Search } from "lucide-react";

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
    <div
      className="min-h-screen font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono-ui text-[11px] tracking-widest uppercase mb-3"
              style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
            >
              <Briefcase className="w-3 h-3" style={{ color: "var(--teal)" }} />
              Recruiter Dashboard
            </span>
            <h1
              className="font-display font-semibold text-3xl md:text-4xl tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Manage Jobs
            </h1>
            <p
              className="mt-2 text-sm md:text-base"
              style={{ color: "var(--ink-soft)" }}
            >
              Create, search, and manage your active job listings and review
              incoming applications.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="h-12 px-6 rounded-full font-bold text-sm flex items-center gap-2 shrink-0 transition-transform hover:scale-[1.03] active:scale-95 shadow-[0_10px_24px_-8px_rgba(255,178,56,0.5)]"
            style={{ background: "var(--marigold)", color: "var(--ink)" }}
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>

        {/* Search */}
        <div
          className="rounded-2xl border bg-white p-4 mb-6 flex items-center gap-3"
          style={{ borderColor: "var(--line)" }}
        >
          <Search
            className="w-4 h-4 shrink-0"
            style={{ color: "var(--ink-soft)" }}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by job title..."
            className="h-9 border-none shadow-none focus-visible:ring-0 px-0 font-medium"
            style={{ color: "var(--ink)" }}
          />
        </div>

        {/* Table Card */}
        <div
          className="rounded-3xl border bg-white overflow-hidden shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="px-8 py-6 border-b"
            style={{
              borderColor: "var(--line)",
              background: "var(--paper-dim)",
            }}
          >
            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "var(--ink)" }}
            >
              Posted Jobs
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
              Edit listings, view applicants, or take one down.
            </p>
          </div>

          <div className="p-6">
            <AdminJobsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
