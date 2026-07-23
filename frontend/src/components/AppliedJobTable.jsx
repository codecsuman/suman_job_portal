import React from "react";
import { useSelector } from "react-redux";
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
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  Video,
  MapPin,
  Phone,
} from "lucide-react";

const modeIcon = {
  online: Video,
  offline: MapPin,
  phone: Phone,
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div
      className="font-body rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <Table>
        <TableCaption className="py-4" style={{ color: "var(--ink-soft)" }}>
          Live view of every job you've applied to — statuses and interviews
          update instantly.
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead
              className="font-mono-ui uppercase tracking-wider text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Date
            </TableHead>
            <TableHead
              className="font-mono-ui uppercase tracking-wider text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Job Role
            </TableHead>
            <TableHead
              className="font-mono-ui uppercase tracking-wider text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Company
            </TableHead>
            <TableHead
              className="font-mono-ui uppercase tracking-wider text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Status
            </TableHead>
            <TableHead
              className="font-mono-ui uppercase tracking-wider text-xs"
              style={{ color: "var(--ink-soft)" }}
            >
              Interview
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs?.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Clock
                    className="w-10 h-10 mb-2"
                    style={{ color: "var(--line)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    You haven't applied to any jobs yet.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((app) => {
              const ModeIcon = modeIcon[app?.interview?.mode] || CalendarClock;
              return (
                <TableRow key={app._id}>
                  <TableCell
                    className="font-medium"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {app?.createdAt?.split("T")[0]}
                  </TableCell>
                  <TableCell
                    className="font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    {app?.job?.title}
                  </TableCell>
                  <TableCell
                    className="font-medium"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {app?.job?.company?.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`font-bold text-xs pointer-events-none flex items-center gap-1 w-fit ${
                        app.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {app.status === "accepted" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {app.status === "rejected" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {app.status === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {app?.status?.toUpperCase() || "PENDING"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app?.interview?.date ? (
                      <div className="flex items-start gap-2">
                        <ModeIcon
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "var(--teal)" }}
                        />
                        <div className="text-xs">
                          <p
                            className="font-bold"
                            style={{ color: "var(--ink)" }}
                          >
                            {app.interview.date?.split("T")[0]} ·{" "}
                            {app.interview.time}
                          </p>
                          {app.interview.mode === "offline" ? (
                            <p style={{ color: "var(--ink-soft)" }}>
                              {app.interview.location}
                            </p>
                          ) : app.interview.location ? (
                            <a
                              href={app.interview.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                              style={{ color: "var(--teal)" }}
                            >
                              Join link
                            </a>
                          ) : null}
                          {app.interview.notes && (
                            <p
                              className="italic mt-0.5"
                              style={{ color: "var(--ink-soft)" }}
                            >
                              {app.interview.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="text-xs"
                        style={{ color: "var(--line)" }}
                      >
                        —
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
