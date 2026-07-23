import React from "react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const openJob = () => {
    navigate(`/description/${job?._id}`);
  };

  return (
    <div
      onClick={openJob}
      onKeyDown={(e) => {
        if (e.key === "Enter") openJob();
      }}
      role="button"
      tabIndex={0}
      className="font-body cursor-pointer rounded-3xl border bg-white p-6 shadow-[0_4px_20px_-4px_rgba(18,23,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(18,23,43,0.12)] outline-none focus-visible:ring-2"
      style={{ borderColor: "var(--line)" }}
    >
      <div>
        <h2
          className="font-display font-semibold tracking-tight text-lg truncate"
          style={{ color: "var(--ink)" }}
        >
          {job?.company?.name}
        </h2>

        <p
          className="text-xs font-mono-ui tracking-wide mt-1"
          style={{ color: "var(--ink-soft)" }}
        >
          📍 {job?.location || "India"}
        </p>
      </div>

      <div className="mt-4">
        <h1
          className="text-base font-bold tracking-tight leading-snug line-clamp-1"
          style={{ color: "var(--ink)" }}
        >
          {job?.title}
        </h1>

        <p
          className="mt-2 text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--ink-soft)" }}
        >
          {job?.description}
        </p>
      </div>

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
  );
};

export default LatestJobCards;
