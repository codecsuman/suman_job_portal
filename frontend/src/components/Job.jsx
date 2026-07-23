import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

import { Bookmark } from "lucide-react";

const Job = ({ job }) => {
  const navigate = useNavigate();

  // ===========================
  // Days Ago
  // ===========================
  const getDaysAgo = (date) => {
    if (!date) return "";

    const createdAt = new Date(date);
    const today = new Date();

    const diff = today.getTime() - createdAt.getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const daysAgo = getDaysAgo(job?.createdAt);

  return (
    <div
      className="font-body rounded-3xl border bg-white p-6 shadow-[0_4px_20px_-4px_rgba(18,23,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(18,23,43,0.12)] flex flex-col justify-between h-full"
      style={{ borderColor: "var(--line)" }}
    >
      <div>
        {/* Meta Header */}
        <div className="flex items-center justify-between">
          <p
            className="font-mono-ui text-[11px] font-bold tracking-widest uppercase"
            style={{ color: "var(--ink-soft)" }}
          >
            {daysAgo === 0
              ? "🔥 Today"
              : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
          </p>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 cursor-not-allowed opacity-50 bg-transparent"
            style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}
            aria-label="Save Job"
            disabled
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {/* Company Banner Row */}
        <div className="my-5 flex items-center gap-3.5">
          <Avatar
            className="h-12 w-12 rounded-2xl border shadow-inner"
            style={{ borderColor: "var(--line)" }}
          >
            <AvatarImage
              src={job?.company?.logo}
              alt={job?.company?.name}
              className="object-cover"
            />
          </Avatar>

          <div className="overflow-hidden">
            <h2
              className="font-display font-semibold tracking-tight text-base truncate"
              style={{ color: "var(--ink)" }}
            >
              {job?.company?.name}
            </h2>
            <p
              className="font-mono-ui text-xs tracking-wide mt-0.5"
              style={{ color: "var(--ink-soft)" }}
            >
              📍 {job?.location || "India"}
            </p>
          </div>
        </div>

        {/* Job Info Section */}
        <div className="space-y-2">
          <h1
            className="font-display font-semibold tracking-tight text-xl leading-snug line-clamp-1"
            style={{ color: "var(--ink)" }}
          >
            {job?.title}
          </h1>
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: "var(--ink-soft)" }}
          >
            {job?.description}
          </p>
        </div>

        {/* Signature marigold/teal badge row, matches LatestJobCards */}
        <div className="mt-5 flex flex-wrap gap-2 font-mono-ui text-[11px]">
          <span
            className="px-2.5 py-1 rounded-lg font-bold"
            style={{ background: "var(--paper-dim)", color: "var(--ink-soft)" }}
          >
            {job?.position} Positions
          </span>

          <span
            className="px-2.5 py-1 rounded-lg font-bold"
            style={{ background: "rgba(0,184,153,0.1)", color: "var(--teal)" }}
          >
            {job?.jobType}
          </span>

          <span
            className="px-2.5 py-1 rounded-lg font-bold"
            style={{
              background: "rgba(255,178,56,0.16)",
              color: "var(--marigold-deep)",
            }}
          >
            ₹ {job?.salary} LPA
          </span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div
        className="mt-6 pt-4 border-t flex flex-col gap-3 sm:flex-row"
        style={{ borderColor: "var(--line)" }}
      >
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 active:scale-95 bg-transparent hover:text-white"
          style={{ color: "var(--ink)", borderColor: "var(--line)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--ink)")
          }
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          View Details
        </Button>

        <Button
          className="w-full h-11 rounded-xl text-xs font-bold tracking-wide cursor-not-allowed opacity-40"
          style={{ background: "var(--ink)", color: "white" }}
          disabled
        >
          Save for Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
