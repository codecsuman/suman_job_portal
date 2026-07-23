import React, { useState } from "react";
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

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

import {
  MoreHorizontal,
  FileText,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Eye,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import {
  updateApplicantStatus,
  setApplicantInterview,
} from "@/redux/applicationSlice";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();

  // Resume preview dialog
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeResume, setActiveResume] = useState(null);

  // Interview scheduling dialog
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [activeApplicant, setActiveApplicant] = useState(null);
  const [scheduling, setScheduling] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    mode: "online",
    location: "",
    notes: "",
  });

  // ===========================
  // Accept / Reject status
  // ===========================
  const statusHandler = async (status, id) => {
    // Optimistic update
    dispatch(
      updateApplicantStatus({
        applicationId: id,
        status: status.toLowerCase(),
      }),
    );

    try {
      const res = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${id}`,
        { status },
        { withCredentials: true },
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update application status.",
      );
    }
  };

  // ===========================
  // Resume viewer
  // ===========================
  const openResume = (applicant) => {
    if (!applicant?.profile?.resume) {
      toast.error("This applicant has not uploaded a resume.");
      return;
    }
    setActiveResume(applicant.profile);
    setResumeOpen(true);
  };

  // ===========================
  // Interview scheduling
  // ===========================
  const openInterviewDialog = (item) => {
    setActiveApplicant(item);
    setInterviewForm({
      date: item?.interview?.date?.split("T")[0] || "",
      time: item?.interview?.time || "",
      mode: item?.interview?.mode || "online",
      location: item?.interview?.location || "",
      notes: item?.interview?.notes || "",
    });
    setInterviewOpen(true);
  };

  const submitInterview = async () => {
    if (!interviewForm.date || !interviewForm.time) {
      toast.error("Please pick both a date and a time.");
      return;
    }

    setScheduling(true);

    const interview = { ...interviewForm };

    // Optimistic update
    dispatch(
      setApplicantInterview({ applicationId: activeApplicant._id, interview }),
    );

    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/schedule-interview/${activeApplicant._id}`,
        interview,
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success("Interview scheduled and applicant notified.");
        setInterviewOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to schedule interview.",
      );
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div
      className="rounded-3xl border bg-white overflow-hidden font-body"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableCaption
            className="py-5 font-mono-ui text-xs"
            style={{ color: "var(--ink-soft)" }}
          >
            Manage all applicants for this job posting.
          </TableCaption>

          <TableHeader style={{ background: "var(--ink)" }}>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Full Name
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Email
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Contact
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Resume
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Applied On
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Status
              </TableHead>
              <TableHead className="font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Interview
              </TableHead>
              <TableHead className="text-right font-mono-ui text-[11px] uppercase tracking-wider text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applicants?.applications?.length > 0 ? (
              applicants.applications.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-black/[0.02] transition-all duration-200"
                  style={{ borderColor: "var(--line)" }}
                >
                  <TableCell
                    className="font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    {item?.applicant?.fullname}
                  </TableCell>

                  <TableCell
                    className="font-medium"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {item?.applicant?.email}
                  </TableCell>

                  <TableCell
                    className="font-medium"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {item?.applicant?.phoneNumber}
                  </TableCell>

                  {/* Resume: quick download link + preview button */}
                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openResume(item.applicant)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition text-xs font-bold"
                          style={{
                            background: "rgba(0,184,153,0.1)",
                            color: "var(--teal)",
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <a
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="transition"
                          style={{ color: "var(--ink-soft)" }}
                          title="Download resume"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <span style={{ color: "var(--line)" }}>No Resume</span>
                    )}
                  </TableCell>

                  <TableCell
                    className="font-mono-ui text-xs"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {item?.createdAt?.split("T")[0]}
                  </TableCell>

                  {/* 🔴 REAL-TIME status */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        item?.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item?.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item?.status === "accepted" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {item?.status === "rejected" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {item?.status?.toUpperCase() || "PENDING"}
                    </span>
                  </TableCell>

                  {/* Interview schedule column */}
                  <TableCell>
                    {item?.interview?.date ? (
                      <div className="text-xs">
                        <p
                          className="font-bold"
                          style={{ color: "var(--ink)" }}
                        >
                          {item.interview.date?.split("T")[0]} ·{" "}
                          {item.interview.time}
                        </p>
                        <p
                          className="font-mono-ui uppercase tracking-wide font-semibold"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          {item.interview.mode}
                        </p>
                      </div>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        Not scheduled
                      </span>
                    )}
                    <button
                      onClick={() => openInterviewDialog(item)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-bold hover:underline"
                      style={{ color: "var(--marigold-deep)" }}
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      {item?.interview?.date ? "Reschedule" : "Schedule"}
                    </button>
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
                        {shortlistingStatus.map((status) => (
                          <div
                            key={status}
                            onClick={() => statusHandler(status, item._id)}
                            className={`cursor-pointer rounded-lg px-3 py-2 my-1 transition font-medium ${
                              status === "Accepted"
                                ? "hover:bg-emerald-50 hover:text-emerald-700"
                                : "hover:bg-rose-50 hover:text-rose-700"
                            }`}
                            style={{ color: "var(--ink-soft)" }}
                          >
                            {status}
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center">
                    <FileText
                      className="w-12 h-12 mb-3"
                      style={{ color: "var(--line)" }}
                    />
                    <h2
                      className="font-display font-semibold text-xl"
                      style={{ color: "var(--ink)" }}
                    >
                      No Applicants Found
                    </h2>
                    <p className="mt-1" style={{ color: "var(--ink-soft)" }}>
                      Applicants will appear here once users apply for this job.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ===================== Resume Preview Dialog ===================== */}
      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogContent className="max-w-3xl h-[80vh] rounded-2xl p-0 overflow-hidden font-body">
          <DialogHeader
            className="px-6 pt-5 pb-3 border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <DialogTitle
              className="font-display font-semibold"
              style={{ color: "var(--ink)" }}
            >
              {activeResume?.resumeOriginalName || "Resume Preview"}
            </DialogTitle>
          </DialogHeader>
          {activeResume?.resume && (
            <iframe
              title="resume-preview"
              src={activeResume.resume}
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ===================== Interview Scheduling Dialog ===================== */}
      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent className="max-w-md rounded-2xl font-body">
          <DialogHeader>
            <DialogTitle
              className="font-display font-semibold"
              style={{ color: "var(--ink)" }}
            >
              Schedule Interview — {activeApplicant?.applicant?.fullname}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-1">
              <Label
                className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Date
              </Label>
              <Input
                type="date"
                value={interviewForm.date}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, date: e.target.value })
                }
                style={{ borderColor: "var(--line)" }}
              />
            </div>
            <div className="col-span-1">
              <Label
                className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Time
              </Label>
              <Input
                type="time"
                value={interviewForm.time}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, time: e.target.value })
                }
                style={{ borderColor: "var(--line)" }}
              />
            </div>
            <div className="col-span-2">
              <Label
                className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Mode
              </Label>
              <select
                className="w-full h-10 rounded-md border px-3 text-sm font-medium"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                value={interviewForm.mode}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, mode: e.target.value })
                }
              >
                <option value="online">Online (video call)</option>
                <option value="offline">In-person</option>
                <option value="phone">Phone call</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label
                className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                {interviewForm.mode === "offline" ? "Location" : "Meeting Link"}
              </Label>
              <Input
                placeholder={
                  interviewForm.mode === "offline"
                    ? "Office address"
                    : "https://meet.google.com/..."
                }
                value={interviewForm.location}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    location: e.target.value,
                  })
                }
                style={{ borderColor: "var(--line)" }}
              />
            </div>
            <div className="col-span-2">
              <Label
                className="font-mono-ui text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--ink-soft)" }}
              >
                Notes (optional)
              </Label>
              <Textarea
                placeholder="Bring your portfolio, focus on system design, etc."
                value={interviewForm.notes}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, notes: e.target.value })
                }
                style={{ borderColor: "var(--line)" }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInterviewOpen(false)}
              className="rounded-xl"
              style={{ borderColor: "var(--line)" }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitInterview}
              disabled={scheduling}
              className="rounded-xl"
              style={{ background: "var(--ink)", color: "white" }}
            >
              {scheduling ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsTable;
