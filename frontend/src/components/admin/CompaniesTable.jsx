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
    <div
      className="rounded-2xl border overflow-hidden font-body"
      style={{ borderColor: "var(--line)" }}
    >
      <Table>
        <TableCaption
          className="py-4 font-mono-ui text-xs"
          style={{ color: "var(--ink-soft)" }}
        >
          A list of your recently registered companies.
        </TableCaption>

        <TableHeader>
          <TableRow style={{ borderColor: "var(--line)" }}>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Logo
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Name
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Registered On
            </TableHead>
            <TableHead
              className="text-right font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-14">
                <div className="flex flex-col items-center">
                  <Building2
                    className="w-10 h-10 mb-2"
                    style={{ color: "var(--line)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    No companies found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-black/[0.02] transition-colors"
                style={{ borderColor: "var(--line)" }}
              >
                <TableCell>
                  <Avatar
                    className="rounded-xl border"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <AvatarImage src={company?.logo} alt={company?.name} />
                    <AvatarFallback
                      className="rounded-xl font-bold"
                      style={{
                        background: "var(--paper-dim)",
                        color: "var(--ink)",
                      }}
                    >
                      {company?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell
                  className="font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {company?.name}
                </TableCell>
                <TableCell
                  className="font-mono-ui text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {company?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-black/5 transition">
                        <MoreHorizontal
                          className="w-5 h-5"
                          style={{ color: "var(--ink-soft)" }}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-40 rounded-xl p-2 shadow-xl border"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium hover:bg-black/5 transition"
                        style={{ color: "var(--ink-soft)" }}
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

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm rounded-2xl font-body">
          <DialogHeader>
            <DialogTitle
              className="font-display font-semibold"
              style={{ color: "var(--ink)" }}
            >
              Delete company?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            This will permanently remove{" "}
            <span className="font-bold" style={{ color: "var(--ink)" }}>
              {deleteTarget?.name}
            </span>{" "}
            and cannot be undone. Jobs linked to this company may also be
            affected.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: "var(--line)" }}
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
