import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";

import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setAllApplicants,
  addNewApplicant,
  setApplicantInterview,
} from "@/redux/applicationSlice";

import { toast } from "sonner";

// Hook lives in hooks/, plain functions live in utils/
import { useSocket } from "@/hooks/useSocket";
import {
  joinJobRoom,
  leaveJobRoom,
  subscribeToEvent,
  unsubscribeFromEvent,
} from "@/utils/socket";

import { Users, Zap } from "lucide-react";

const Applicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { applicants } = useSelector((store) => store.application);

  // Global socket connection (job feed, notifications, etc.)
  useSocket();

  useEffect(() => {
    if (!id) return;

    // Join this specific job's room so we get its live application/interview events
    joinJobRoom(id);

    const handleNewApplication = (data) => {
      dispatch(addNewApplicant(data.application));
      toast.info("New applicant!", {
        description: `${data.application.applicant?.fullname} just applied`,
      });
    };

    const handleInterviewScheduled = (data) => {
      dispatch(
        setApplicantInterview({
          applicationId: data.applicationId,
          interview: data.interview,
        }),
      );
    };

    subscribeToEvent("newApplication", handleNewApplication);
    subscribeToEvent("interviewScheduled", handleInterviewScheduled);

    return () => {
      leaveJobRoom(id);
      unsubscribeFromEvent("newApplication", handleNewApplication);
      unsubscribeFromEvent("interviewScheduled", handleInterviewScheduled);
    };
  }, [id, dispatch]);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${id}/applicants`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Failed to load applicants.",
        );
      }
    };

    fetchAllApplicants();
  }, [dispatch, id]);

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono-ui text-[11px] tracking-widest uppercase mb-3"
              style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
            >
              <Users className="w-3 h-3" style={{ color: "var(--teal)" }} />
              Recruiter Dashboard
            </span>
            <h1
              className="font-display font-semibold text-3xl md:text-4xl tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Applicants
            </h1>
            <p
              className="mt-2 text-sm md:text-base max-w-xl"
              style={{ color: "var(--ink-soft)" }}
            >
              Review applicants, update statuses, and schedule interviews from
              one place.
            </p>
          </div>

          <div
            className="rounded-3xl border px-10 py-6 text-center shrink-0"
            style={{
              borderColor: "var(--line)",
              background: "var(--paper-dim)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap
                className="w-5 h-5 animate-pulse"
                style={{ color: "var(--marigold-deep)" }}
              />
              <h2
                className="font-display font-semibold text-4xl"
                style={{ color: "var(--ink)" }}
              >
                {applicants?.applications?.length || 0}
              </h2>
            </div>
            <p
              className="mt-1 font-mono-ui text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Total Applicants
            </p>
          </div>
        </div>

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
            Live — new applicants and interview updates appear instantly
          </span>
        </div>

        <div
          className="rounded-3xl border bg-white overflow-hidden shadow-[0_8px_30px_-12px_rgba(18,23,43,0.08)]"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6 border-b"
            style={{
              borderColor: "var(--line)",
              background: "var(--paper-dim)",
            }}
          >
            <div>
              <h2
                className="font-display font-semibold text-xl"
                style={{ color: "var(--ink)" }}
              >
                Applicants List
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                View resumes, update application status, and schedule
                interviews.
              </p>
            </div>

            <div
              className="font-mono-ui font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                background: "rgba(0,184,153,0.1)",
                color: "var(--teal)",
              }}
            >
              <Users className="w-3.5 h-3.5" />
              {applicants?.applications?.length || 0} Candidates
            </div>
          </div>

          <div className="p-6">
            <ApplicantsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
