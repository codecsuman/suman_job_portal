import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";

import {
    Edit2,
    Eye,
    MoreHorizontal,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
    const {
        allAdminJobs,
        searchJobByText,
    } = useSelector((store) => store.job);

    const [filterJobs, setFilterJobs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) return true;

            return (
                job?.title
                    ?.toLowerCase()
                    .includes(searchJobByText.toLowerCase()) ||
                job?.company?.name
                    ?.toLowerCase()
                    .includes(searchJobByText.toLowerCase())
            );
        });

        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableCaption className="py-5 text-slate-400 font-medium text-xs border-t bg-slate-50/50">
                    Showing {filterJobs.length} active job listings
                </TableCaption>

                <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-600 h-12 px-6">
                            Company Name
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600 h-12 px-6">
                            Role
                        </TableHead>

                        <TableHead className="font-semibold text-slate-600 h-12 px-6">
                            Date
                        </TableHead>

                        <TableHead className="text-right font-semibold text-slate-600 h-12 px-6">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filterJobs.length > 0 ? (
                        filterJobs.map((job) => (
                            <TableRow
                                key={job._id}
                                className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
                            >
                                <TableCell className="font-semibold text-slate-800 px-6 py-4">
                                    <div className="inline-flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                                        {job?.company?.name}
                                    </div>
                                </TableCell>

                                <TableCell className="text-slate-700 font-medium px-6 py-4">
                                    {job?.title}
                                </TableCell>

                                <TableCell className="text-slate-500 text-sm px-6 py-4">
                                    {job?.createdAt?.split("T")[0]}
                                </TableCell>

                                <TableCell className="text-right px-6 py-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 active:bg-slate-100 transition duration-200">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-44 p-1.5 rounded-2xl shadow-xl border border-slate-100/80 bg-white z-50 animate-in fade-in-50 slide-in-from-top-1">

                                            <div
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/companies/${job?.company?._id}`
                                                    )
                                                }
                                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 cursor-pointer transition text-sm font-medium"
                                            >
                                                <Edit2 className="w-4 h-4 text-blue-500" />
                                                <span>Edit Listing</span>
                                            </div>

                                            <div
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/jobs/${job._id}/applicants`
                                                    )
                                                }
                                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 cursor-pointer transition text-sm font-medium mt-0.5"
                                            >
                                                <Eye className="w-4 h-4 text-indigo-500" />
                                                <span>Applicants</span>
                                            </div>

                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={4}
                                className="text-center py-16 text-slate-400 font-medium text-sm"
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className="text-2xl">📋</span>
                                    <span>No jobs matched your query.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;