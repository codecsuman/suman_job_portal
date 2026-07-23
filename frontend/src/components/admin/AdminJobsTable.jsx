import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { MoreHorizontal, Users, Edit2, Trash2, Briefcase } from "lucide-react";

import { JOB_API_END_POINT } from "@/utils/constant";
import { removeJobFromList } from "@/redux/jobSlice";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredJobs =
    allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase());
    }) || [];

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${JOB_API_END_POINT}/delete/${deleteTarget._id}`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(removeJobFromList(deleteTarget._id));
        toast.success("Job deleted successfully.");
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete job.");
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
          Every job you've posted — edit, view applicants, or take one down.
        </TableCaption>

        <TableHeader>
          <TableRow style={{ borderColor: "var(--line)" }}>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Title
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Company
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Type
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Applicants
            </TableHead>
            <TableHead
              className="font-mono-ui text-[11px] uppercase tracking-wider"
              style={{ color: "var(--ink-soft)" }}
            >
              Posted On
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
          {filteredJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-14">
                <div className="flex flex-col items-center">
                  <Briefcase
                    className="w-10 h-10 mb-2"
                    style={{ color: "var(--line)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    You haven't posted any jobs yet.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-black/[0.02] transition-colors"
                style={{ borderColor: "var(--line)" }}
              >
                <TableCell
                  className="font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {job?.title}
                </TableCell>
                <TableCell
                  className="font-medium"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {job?.company?.name}
                </TableCell>
                <TableCell>
                  <span
                    className="font-mono-ui font-bold text-xs px-2.5 py-1 rounded-lg pointer-events-none"
                    style={{
                      background: "rgba(0,184,153,0.1)",
                      color: "var(--teal)",
                    }}
                  >
                    {job?.jobType}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      navigate(`/admin/jobs/${job._id}/applicants`)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                    style={{ color: "var(--marigold-deep)" }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {job?.applications?.length || 0} applicants
                  </button>
                </TableCell>
                <TableCell
                  className="font-mono-ui text-xs"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {job?.createdAt?.split("T")[0]}
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
                      className="w-48 rounded-xl p-2 shadow-xl border"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium hover:bg-black/5 transition"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        <Users className="w-4 h-4" /> View Applicants
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium hover:bg-black/5 transition"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        <Edit2 className="w-4 h-4" /> Edit Job
                      </div>
                      <div
                        onClick={() => setDeleteTarget(job)}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Job
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
              Delete this job?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            <span className="font-bold" style={{ color: "var(--ink)" }}>
              {deleteTarget?.title}
            </span>{" "}
            will be permanently removed, along with its applicant records. This
            can't be undone.
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

export default AdminJobsTable;
