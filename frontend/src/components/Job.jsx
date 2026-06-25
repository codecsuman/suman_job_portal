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

        const diff =
            today.getTime() - createdAt.getTime();

        return Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );
    };

    const daysAgo = getDaysAgo(job?.createdAt);

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-between h-full">
            <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold tracking-wide text-slate-400">
                        {daysAgo === 0
                            ? "🔥 TODAY"
                            : `${daysAgo} DAY${daysAgo > 1 ? "S" : ""} AGO`}
                    </p>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8 text-slate-400 border-slate-200/80 cursor-not-allowed opacity-50"
                        aria-label="Save Job"
                        disabled
                    >
                        <Bookmark className="h-4 w-4" />
                    </Button>
                </div>

                {/* Company Banner Row */}
                <div className="my-5 flex items-center gap-3.5">
                    <Avatar className="h-12 w-12 rounded-2xl border border-slate-100 shadow-inner">
                        <AvatarImage
                            src={job?.company?.logo}
                            alt={job?.company?.name}
                            className="object-cover"
                        />
                    </Avatar>

                    <div className="overflow-hidden">
                        <h2 className="font-extrabold text-slate-800 tracking-tight text-base truncate">
                            {job?.company?.name}
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
                            📍 {job?.location || "India"}
                        </p>
                    </div>
                </div>

                {/* Job Info Section */}
                <div className="space-y-2">
                    <h1 className="text-xl font-black text-slate-800 tracking-tight leading-snug line-clamp-1">
                        {job?.title}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">
                        {job?.description}
                    </p>
                </div>

                {/* Structural Glass Toned Badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-blue-50 text-blue-700 border border-blue-100">
                        {job?.position} Positions
                    </Badge>

                    <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {job?.jobType}
                    </Badge>

                    <Badge variant="ghost" className="font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none bg-amber-50/80 text-amber-700 border border-amber-100">
                        ₹ {job?.salary} LPA
                    </Badge>
                </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col gap-3 sm:flex-row">
                <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl text-xs font-bold tracking-wide text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 active:scale-95"
                    onClick={() =>
                        navigate(`/description/${job?._id}`)
                    }
                >
                    View Details
                </Button>

                <Button
                    className="w-full h-11 rounded-xl text-xs font-bold tracking-wide bg-slate-900 text-white cursor-not-allowed opacity-40 hover:bg-slate-900"
                    disabled
                >
                    Save for Later
                </Button>
            </div>
        </div>
    );
};

export default Job;