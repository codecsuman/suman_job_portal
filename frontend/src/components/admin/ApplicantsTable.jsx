import React from "react";
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

import { MoreHorizontal, FileText } from "lucide-react";

import { useSelector } from "react-redux";

import { toast } from "sonner";

import axios from "axios";

import { APPLICATION_API_END_POINT } from "@/utils/constant";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(
        (store) => store.application
    );

    // ===========================
    // Update Application Status
    // ===========================
    const statusHandler = async (status, id) => {
        try {
            const res = await axios.put(
                `${APPLICATION_API_END_POINT}/status/${id}`,
                { status },
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to update application status."
            );
        }
    };

    return (
        <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">

            <div className="overflow-x-auto">

                <Table>

                    <TableCaption className="py-5 text-gray-500">
                        Manage all applicants for this job posting.
                    </TableCaption>

                    <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">

                        <TableRow className="hover:bg-transparent">

                            <TableHead className="text-white font-semibold">
                                Full Name
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Email
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Contact
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Resume
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Applied On
                            </TableHead>

                            <TableHead className="text-right text-white font-semibold">
                                Action
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {applicants?.applications?.length > 0 ? (

                            applicants.applications.map((item) => (

                                <TableRow
                                    key={item._id}
                                    className="hover:bg-blue-50 transition-all duration-200"
                                >

                                    <TableCell className="font-semibold text-gray-800">
                                        {item?.applicant?.fullname}
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {item?.applicant?.email}
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {item?.applicant?.phoneNumber}
                                    </TableCell>

                                    <TableCell>

                                        {item?.applicant?.profile?.resume ? (

                                            <a
                                                href={
                                                    item.applicant.profile.resume
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition"
                                            >
                                                <FileText className="w-4 h-4" />
                                                {
                                                    item.applicant.profile
                                                        .resumeOriginalName
                                                }
                                            </a>

                                        ) : (

                                            <span className="text-gray-400">
                                                No Resume
                                            </span>

                                        )}

                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {item?.createdAt?.split("T")[0]}
                                    </TableCell>

                                    <TableCell className="text-right">

                                        <Popover>

                                            <PopoverTrigger asChild>

                                                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                                </button>

                                            </PopoverTrigger>

                                            <PopoverContent className="w-40 rounded-xl p-2 shadow-xl">

                                                {shortlistingStatus.map(
                                                    (status) => (

                                                        <div
                                                            key={status}
                                                            onClick={() =>
                                                                statusHandler(
                                                                    status,
                                                                    item._id
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-lg px-3 py-2 my-1 transition font-medium ${
                                                                status ===
                                                                "Accepted"
                                                                    ? "hover:bg-green-100 hover:text-green-700"
                                                                    : "hover:bg-red-100 hover:text-red-700"
                                                            }`}
                                                        >
                                                            {status}
                                                        </div>

                                                    )
                                                )}

                                            </PopoverContent>

                                        </Popover>

                                    </TableCell>

                                </TableRow>

                            ))

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    className="text-center py-16"
                                >

                                    <div className="flex flex-col items-center">

                                        <FileText className="w-12 h-12 text-gray-300 mb-3" />

                                        <h2 className="text-xl font-semibold text-gray-700">
                                            No Applicants Found
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Applicants will appear here once
                                            users apply for this job.
                                        </p>

                                    </div>

                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>

            </div>

        </div>
    );
};

export default ApplicantsTable;