import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Loader2, FilePlus2 } from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "sonner";

import { JOB_API_END_POINT } from "@/utils/constant";
import { LOCATIONS, INDUSTRIES, JOB_TYPES } from "@/utils/filterOptions";

const PostJob = () => {
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    category: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const setField = (key) => (value) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value,
    );

    setInput({
      ...input,
      companyId: selectedCompany?._id || "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.jobType) return toast.error("Please select a job type.");
    if (!input.location) return toast.error("Please select a location.");
    if (!input.category)
      return toast.error("Please select an industry/category.");

    try {
      setLoading(true);

      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to post job.");
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

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div
            className="p-5 rounded-2xl border"
            style={{
              borderColor: "var(--marigold)",
              background: "rgba(255,178,56,0.1)",
            }}
          >
            <FilePlus2
              className="w-9 h-9"
              style={{ color: "var(--marigold-deep)" }}
            />
          </div>

          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-0.5 font-mono-ui text-[10px] tracking-widest uppercase mb-1.5"
              style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
            >
              Recruiter Dashboard
            </span>
            <h1
              className="font-display font-semibold text-2xl md:text-3xl tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Post a New Job
            </h1>
            <p
              className="mt-1 text-sm md:text-base"
              style={{ color: "var(--ink-soft)" }}
            >
              Fill out the details below to publish a new job opening for job
              seekers.
            </p>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="rounded-3xl border bg-white p-8 shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="mb-8 pb-6 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "var(--ink)" }}
            >
              Job Specifications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Title
              </Label>
              <Input
                required
                name="title"
                value={input.title}
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
                required
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
                Requirements
              </Label>
              <Input
                required
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                placeholder="React, Node.js, MongoDB (comma-separated)"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Salary (LPA)
              </Label>
              <Input
                required
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                placeholder="e.g. 6 for ₹6 LPA"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            {/* 🔧 FIXED: was a free-text Input — now the exact same list students filter by */}
            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Location
              </Label>
              <Select
                onValueChange={setField("location")}
                value={input.location}
              >
                <SelectTrigger
                  className="w-full h-11 rounded-xl"
                  style={{ borderColor: "var(--line)" }}
                >
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 🔧 NEW: Industry — didn't exist before at all */}
            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Industry / Role Category
              </Label>
              <Select
                onValueChange={setField("category")}
                value={input.category}
              >
                <SelectTrigger
                  className="w-full h-11 rounded-xl"
                  style={{ borderColor: "var(--line)" }}
                >
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INDUSTRIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Job Type
              </Label>
              <Select onValueChange={setField("jobType")} value={input.jobType}>
                <SelectTrigger
                  className="w-full h-11 rounded-xl"
                  style={{ borderColor: "var(--line)" }}
                >
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Experience (years)
              </Label>
              <Input
                required
                type="number"
                name="experience"
                value={input.experience}
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
                No. of Positions
              </Label>
              <Input
                required
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            {companies.length > 0 && (
              <div className="md:col-span-2">
                <Label
                  className="mb-2 block font-mono-ui text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Select Company
                </Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger
                    className="w-full h-11 rounded-xl"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-10">
            {loading ? (
              <Button
                disabled
                className="w-full h-12 rounded-xl"
                style={{ background: "var(--ink-soft)" }}
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting Job...
              </Button>
            ) : (
              <button
                type="submit"
                className="w-full h-12 rounded-xl font-bold transition-transform hover:scale-[1.01] active:scale-95"
                style={{ background: "var(--ink)", color: "var(--marigold)" }}
              >
                Post New Job
              </button>
            )}

            {companies.length === 0 && (
              <div
                className="rounded-xl p-4 mt-4 text-center border"
                style={{
                  background: "rgba(225,29,72,0.06)",
                  borderColor: "rgba(225,29,72,0.2)",
                }}
              >
                <p className="text-sm font-semibold text-rose-600">
                  Please register a company before posting a job.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
