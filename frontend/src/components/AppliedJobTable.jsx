import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";

import { useSelector } from "react-redux";

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(
        (store) => store.job
    );

    const getBadgeColor = (status) => {
        switch (status) {
            case "accepted":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide pointer-events-none";

            case "rejected":
                return "bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide pointer-events-none";

            default:
                return "bg-slate-50 text-slate-600 border border-slate-200 shadow-sm px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide pointer-events-none";
        }
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableCaption className="py-5 text-slate-400 font-medium text-xs border-t bg-slate-50/50">
                    A comprehensive log of your submitted applications
                </TableCaption>

                <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold text-slate-600 h-12 px-6">Date</TableHead>
                        <TableHead className="font-bold text-slate-600 h-12 px-6">Job Role</TableHead>
                        <TableHead className="font-bold text-slate-600 h-12 px-6">Company</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 h-12 px-6">
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {allAppliedJobs?.length > 0 ? (
                        allAppliedJobs.map((appliedJob) => (
                            <TableRow 
                                key={appliedJob._id}
                                className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-0"
                            >
                                <TableCell className="text-slate-500 font-medium text-sm px-6 py-4">
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </TableCell>

                                <TableCell className="text-slate-800 font-semibold px-6 py-4">
                                    {appliedJob?.job?.title}
                                </TableCell>

                                <TableCell className="px-6 py-4">
                                    <span className="inline-flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200/60">
                                        {appliedJob?.job?.company?.name}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right px-6 py-4">
                                    <Badge
                                        className={getBadgeColor(
                                            appliedJob?.status
                                        )}
                                    >
                                        {appliedJob?.status?.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={4}
                                className="text-center text-slate-400 font-medium text-sm py-16"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className="text-2xl">💼</span>
                                    <span>You haven't applied for any jobs yet.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;