import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { MoreHorizontal, Edit2, Trash2, Building2 } from "lucide-react";

import { COMPANY_API_END_POINT } from "@/utils/constant";
import { removeCompany } from "@/redux/companySlice";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredCompanies =
    companies?.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    }) || [];

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${deleteTarget._id}`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(removeCompany(deleteTarget._id));
        toast.success("Company deleted successfully.");
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete company.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <Table>
        <TableCaption className="py-4 text-slate-400">
          A list of your recently registered companies.
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-14">
                <div className="flex flex-col items-center">
                  <Building2 className="w-10 h-10 text-slate-200 mb-2" />
                  <p className="text-sm font-semibold text-slate-400">
                    No companies found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar className="rounded-xl border border-slate-100">
                    <AvatarImage src={company?.logo} alt={company?.name} />
                    <AvatarFallback className="rounded-xl bg-blue-50 text-blue-600 font-bold">
                      {company?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-bold text-slate-800">
                  {company?.name}
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {company?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-slate-100 transition">
                        <MoreHorizontal className="w-5 h-5 text-slate-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 rounded-xl p-2 shadow-xl">
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium text-slate-600 hover:bg-slate-50 transition"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </div>
                      <div
                        onClick={() => setDeleteTarget(company)}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold">Delete company?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            This will permanently remove{" "}
            <span className="font-bold text-slate-700">
              {deleteTarget?.name}
            </span>{" "}
            and cannot be undone. Jobs linked to this company may also be
            affected.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-rose-600 hover:bg-rose-700"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesTable;
