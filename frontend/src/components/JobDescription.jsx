import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);

  // =============================
  // Apply Job
  // =============================
  const applyJobHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsApplied(true);

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob?.applications || []),
              {
                applicant: {
                  _id: user._id,
                },
              },
            ],
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to apply for this job."
      );
    }
  };

  // =============================
  // Fetch Single Job
  // =============================
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const alreadyApplied = res.data.job?.applications?.some(
            (application) =>
              application?.applicant?._id === user?._id ||
              application?.applicant === user?._id
          );

          setIsApplied(alreadyApplied);
        }
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
            <p className="text-sm font-semibold text-slate-500 tracking-wide">Loading job spec details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto my-10 px-6">
        {/* Main Content Wrapper Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          {/* Top Job Summary Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {singleJob?.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-blue-50 text-blue-700 border border-blue-100">
                  {singleJob?.position} Positions
                </Badge>

                <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {singleJob?.jobType}
                </Badge>

                <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-amber-50 text-amber-700 border border-amber-100">
                  ₹ {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>

            <Button
              disabled={isApplied}
              onClick={applyJobHandler}
              className={`h-11 px-6 font-bold text-sm tracking-wide rounded-xl transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0 ${
                isApplied
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-not-allowed border border-emerald-200"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>

          {/* Core Descriptive Text Segment */}
          <div className="mt-8">
            <h2 className="font-extrabold text-slate-800 text-lg tracking-tight mb-3">
              Job Requirements & Description
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {singleJob?.description}
            </p>
          </div>

          {/* Job Specifications Grid Matrix */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h2 className="font-extrabold text-slate-800 text-lg tracking-tight mb-4">
              Position Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                { label: "Role Profile", value: singleJob?.title },
                { label: "Workplace Location", value: singleJob?.location },
                { label: "Experience Level", value: `${singleJob?.experienceLevel} Years` },
                { label: "Financial Package", value: `₹ ${singleJob?.salary} LPA` },
                { label: "Total Applications", value: singleJob?.applications?.length },
                { label: "Hiring Organization", value: singleJob?.company?.name },
                { label: "Date Published", value: singleJob?.createdAt?.split("T")[0] },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 max-w-[200px] sm:max-w-[240px] truncate text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default JobDescription;