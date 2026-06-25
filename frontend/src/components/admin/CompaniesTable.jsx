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

import { Avatar, AvatarImage } from "../ui/avatar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";

import {
    Edit2,
    MoreHorizontal,
    Building2,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
    const {
        companies,
        searchCompanyByText,
    } = useSelector((store) => store.company);

    const [filterCompany, setFilterCompany] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.filter((company) => {
            if (!searchCompanyByText) return true;

            return company?.name
                ?.toLowerCase()
                .includes(searchCompanyByText.toLowerCase());
        });

        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    return (
        <div className="rounded-3xl overflow-hidden border bg-white shadow-xl">

            <div className="overflow-x-auto">

                <Table>

                    <TableCaption className="py-5 text-gray-500">
                        Registered companies in your job portal.
                    </TableCaption>

                    <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">

                        <TableRow className="hover:bg-transparent">

                            <TableHead className="text-white font-semibold">
                                Logo
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Company Name
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Created Date
                            </TableHead>

                            <TableHead className="text-right text-white font-semibold">
                                Action
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {filterCompany.length > 0 ? (

                            filterCompany.map((company) => (

                                <TableRow
                                    key={company._id}
                                    className="hover:bg-blue-50 transition-all duration-300"
                                >

                                    <TableCell>

                                        <Avatar className="h-12 w-12 border-2 border-blue-100 shadow">

                                            <AvatarImage
                                                src={company?.logo}
                                                alt={company?.name}
                                            />

                                        </Avatar>

                                    </TableCell>

                                    <TableCell>

                                        <div className="flex items-center gap-3">

                                            <Building2 className="w-5 h-5 text-blue-600" />

                                            <div>

                                                <h2 className="font-semibold text-gray-800">
                                                    {company?.name}
                                                </h2>

                                                <p className="text-xs text-gray-500">
                                                    Registered Company
                                                </p>

                                            </div>

                                        </div>

                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {company?.createdAt?.split("T")[0]}
                                    </TableCell>

                                    <TableCell className="text-right">

                                        <Popover>

                                            <PopoverTrigger asChild>

                                                <button className="p-2 rounded-full hover:bg-gray-100 transition">

                                                    <MoreHorizontal className="w-5 h-5 text-gray-600" />

                                                </button>

                                            </PopoverTrigger>

                                            <PopoverContent className="w-40 rounded-xl p-2 shadow-xl">

                                                <div
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/companies/${company._id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span>Edit Company</span>
                                                </div>

                                            </PopoverContent>

                                        </Popover>

                                    </TableCell>

                                </TableRow>

                            ))

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    className="py-16 text-center"
                                >

                                    <div className="flex flex-col items-center">

                                        <Building2 className="w-14 h-14 text-gray-300 mb-4" />

                                        <h2 className="text-xl font-semibold text-gray-700">
                                            No Companies Found
                                        </h2>

                                        <p className="text-gray-500 mt-2">
                                            Create your first company to start
                                            posting jobs.
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

export default CompaniesTable;