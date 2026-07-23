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

import { Loader2 } from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "sonner";

import { JOB_API_END_POINT } from "@/utils/constant";

// 🔧 FIXED: exact enum values from backend/models/job.model.js — no more free-typed jobType
const JOB_TYPE_OPTIONS = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Remote",
  "Hybrid",
];

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

  const jobTypeChangeHandler = (value) => {
    setInput({ ...input, jobType: value });
  };

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

    if (!input.jobType) {
      return toast.error("Please select a job type.");
    }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl mb-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex items-center gap-6 px-8 py-10">
            <div>
              <h1 className="text-4xl font-bold text-white">Post a New Job</h1>
              <p className="text-blue-100 mt-2">
                Fill out the details below to publish a new job opening for job
                seekers.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="bg-white rounded-3xl shadow-2xl border p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Job Specifications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Title</Label>
              <Input
                required
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="mb-2 block">Description</Label>
              <Input
                required
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="mb-2 block">Requirements</Label>
              <Input
                required
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>

            <div>
              <Label className="mb-2 block">Salary</Label>
              <Input
                required
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="mb-2 block">Location</Label>
              <Input
                required
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            {/* 🔧 FIXED: was a free-text Input, now a Select restricted to the schema's enum */}
            <div>
              <Label className="mb-2 block">Job Type</Label>
              <Select
                onValueChange={jobTypeChangeHandler}
                value={input.jobType}
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {JOB_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Experience (years)</Label>
              <Input
                required
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="mb-2 block">No. of Positions</Label>
              <Input
                required
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="h-11 rounded-xl"
              />
            </div>

            {companies.length > 0 && (
              <div className="md:col-span-2">
                <Label className="mb-2 block">Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full h-11 rounded-xl">
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
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting Job...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                Post New Job
              </Button>
            )}

            {companies.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-center">
                <p className="text-red-600 text-sm font-semibold">
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
