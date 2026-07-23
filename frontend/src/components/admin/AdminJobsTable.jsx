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
import { Badge } from "../ui/badge";
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
    <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <Table>
        <TableCaption className="py-4 text-slate-400">
          Every job you've posted — edit, view applicants, or take one down.
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Posted On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-14">
                <div className="flex flex-col items-center">
                  <Briefcase className="w-10 h-10 text-slate-200 mb-2" />
                  <p className="text-sm font-semibold text-slate-400">
                    You haven't posted any jobs yet.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-blue-50/40 transition-colors"
              >
                <TableCell className="font-bold text-slate-800">
                  {job?.title}
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {job?.company?.name}
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-100 pointer-events-none font-semibold text-xs">
                    {job?.jobType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      navigate(`/admin/jobs/${job._id}/applicants`)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {job?.applications?.length || 0} applicants
                  </button>
                </TableCell>
                <TableCell className="text-slate-500 font-medium">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-slate-100 transition">
                        <MoreHorizontal className="w-5 h-5 text-slate-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 rounded-xl p-2 shadow-xl">
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium text-slate-600 hover:bg-slate-50 transition"
                      >
                        <Users className="w-4 h-4" /> View Applicants
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 my-1 font-medium text-slate-600 hover:bg-slate-50 transition"
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
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold">Delete this job?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-700">
              {deleteTarget?.title}
            </span>{" "}
            will be permanently removed, along with its applicant records. This
            can't be undone.
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

export default AdminJobsTable;
