import React from "react";
import { Badge } from "./ui/badge";
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
                if (e.key === "Enter") {
                    openJob();
                }
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
        >
            {/* Organization Identity Header */}
            <div>
                <h2 className="font-extrabold text-slate-800 tracking-tight text-base truncate">
                    {job?.company?.name}
                </h2>

                <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
                    📍 {job?.location || "India"}
                </p>
            </div>

            {/* Core Job Profile Information */}
            <div className="mt-4">
                <h1 className="text-lg font-black text-slate-800 tracking-tight leading-snug line-clamp-1">
                    {job?.title}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">
                    {job?.description}
                </p>
            </div>

            {/* Premium Theme Tag Group */}
            <div className="mt-5 flex flex-wrap gap-2">

                <Badge
                    variant="ghost"
                    className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-blue-50 text-blue-700 border border-blue-100"
                >
                    {job?.position} Positions
                </Badge>

                <Badge
                    variant="ghost"
                    className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                    {job?.jobType}
                </Badge>

                <Badge
                    variant="ghost"
                    className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-amber-50/80 text-amber-700 border border-amber-100"
                >
                    ₹ {job?.salary} LPA
                </Badge>

            </div>
        </div>
    );
};

export default LatestJobCards;