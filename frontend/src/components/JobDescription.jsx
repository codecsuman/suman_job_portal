import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob, updateJobApplicantCount } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { useJobSocket } from "@/hooks/useSocket";
import { Zap, Users } from "lucide-react";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  // 🔴 REAL-TIME: connect to this job's room
  useJobSocket(jobId);

  const applyJobHandler = async () => {
    if (isApplied) return;
    setApplying(true);

    // Optimistic UI
    setIsApplied(true);
    dispatch(
      updateJobApplicantCount({
        jobId,
        totalApplications: (singleJob?.applications?.length || 0) + 1,
      }),
    );

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      // Rollback
      setIsApplied(false);
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Unable to apply for this job.",
      );
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const alreadyApplied = res.data.job?.applications?.some(
            (application) =>
              application?.applicant?._id === user?._id ||
              application?.applicant === user?._id,
          );

          setIsApplied(alreadyApplied);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--paper)" }}
      >
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
              style={{
                borderColor: "var(--line)",
                borderTopColor: "var(--teal)",
              }}
            />
            <p
              className="font-mono-ui text-sm font-semibold tracking-wide"
              style={{ color: "var(--ink-soft)" }}
            >
              Loading job spec details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col antialiased font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto my-10 px-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--teal)" }}
            ></span>
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ background: "var(--teal)" }}
            ></span>
          </span>
          <span
            className="font-mono-ui text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--teal)" }}
          >
            Live Updates Active
          </span>
        </div>

        <div
          className="bg-white rounded-3xl border p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="space-y-3">
              <h1
                className="font-display font-semibold text-2xl md:text-3xl tracking-tight leading-tight"
                style={{ color: "var(--ink)" }}
              >
                {singleJob?.title}
              </h1>
              <div className="flex flex-wrap gap-2 font-mono-ui text-xs">
                <span
                  className="font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "var(--paper-dim)",
                    color: "var(--ink-soft)",
                  }}
                >
                  {singleJob?.position} Positions
                </span>
                <span
                  className="font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(0,184,153,0.1)",
                    color: "var(--teal)",
                  }}
                >
                  {singleJob?.jobType}
                </span>
                <span
                  className="font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,178,56,0.16)",
                    color: "var(--marigold-deep)",
                  }}
                >
                  ₹ {singleJob?.salary} LPA
                </span>
                <Badge
                  variant="ghost"
                  className="font-bold px-2.5 py-1 rounded-lg pointer-events-none flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100"
                >
                  <Users className="w-3 h-3" />
                  {singleJob?.applications?.length || 0} Applied
                </Badge>
              </div>
            </div>

            <Button
              disabled={isApplied || applying}
              onClick={applyJobHandler}
              className="h-11 px-6 font-bold text-sm tracking-wide rounded-xl transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
              style={
                isApplied
                  ? {
                      background: "rgba(0,184,153,0.12)",
                      color: "var(--teal)",
                      border: "1px solid rgba(0,184,153,0.3)",
                    }
                  : { background: "var(--ink)", color: "white" }
              }
            >
              {applying ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  Applying...
                </span>
              ) : isApplied ? (
                "Already Applied"
              ) : (
                "Apply Now"
              )}
            </Button>
          </div>

          <div className="mt-8">
            <h2
              className="font-display font-semibold text-lg tracking-tight mb-3"
              style={{ color: "var(--ink)" }}
            >
              Job Requirements &amp; Description
            </h2>
            <p
              className="font-medium text-sm leading-relaxed p-4 rounded-2xl border"
              style={{
                color: "var(--ink-soft)",
                background: "var(--paper-dim)",
                borderColor: "var(--line)",
              }}
            >
              {singleJob?.description}
            </p>
          </div>

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            <h2
              className="font-display font-semibold text-lg tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              Position Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                { label: "Role Profile", value: singleJob?.title },
                { label: "Workplace Location", value: singleJob?.location },
                {
                  label: "Experience Level",
                  value: `${singleJob?.experienceLevel} Years`,
                },
                {
                  label: "Financial Package",
                  value: `₹ ${singleJob?.salary} LPA`,
                },
                {
                  label: "Total Applications",
                  value: singleJob?.applications?.length || 0,
                },
                {
                  label: "Hiring Organization",
                  value: singleJob?.company?.name,
                },
                {
                  label: "Date Published",
                  value: singleJob?.createdAt?.split("T")[0],
                },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2.5 border-b"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span
                    className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {spec.label}
                  </span>
                  <span
                    className="text-sm font-semibold max-w-[200px] sm:max-w-[240px] truncate text-right"
                    style={{ color: "var(--ink)" }}
                  >
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
