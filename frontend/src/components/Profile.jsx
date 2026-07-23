import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

import { Contact, Mail, Pen } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  // Only students need their applied-jobs list; recruiters don't have one.
  const { user } = useSelector((store) => store.auth);
  const isStudent = user?.role === "student";

  // Hook is safe to call unconditionally (it internally no-ops with an empty result for recruiters,
  // since useGetAppliedJobs simply won't be useful for them — the table below is hidden anyway).
  useGetAppliedJobs();

  const [open, setOpen] = useState(false);
  const isResume = !!user?.profile?.resume;

  return (
    <div
      className="min-h-screen antialiased pb-12 font-body"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />

      <main
        className="max-w-4xl mx-auto bg-white border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] mt-10 p-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-5">
            <Avatar
              className="h-24 w-24 rounded-2xl border shadow-inner"
              style={{ borderColor: "var(--line)" }}
            >
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt={user?.fullname}
                className="object-cover"
              />
              <AvatarFallback
                className="rounded-2xl font-black text-xl"
                style={{
                  background: "rgba(255,178,56,0.16)",
                  color: "var(--marigold-deep)",
                }}
              >
                {user?.fullname?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="font-display font-semibold text-2xl tracking-tight"
                  style={{ color: "var(--ink)" }}
                >
                  {user?.fullname}
                </h1>
                <span
                  className="font-mono-ui text-xs capitalize font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(0,184,153,0.1)",
                    color: "var(--teal)",
                  }}
                >
                  {user?.role}
                </span>
              </div>
              <p
                className="text-sm font-medium mt-1 max-w-md leading-relaxed"
                style={{ color: "var(--ink-soft)" }}
              >
                {user?.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="h-10 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shrink-0 self-end sm:self-auto bg-transparent"
            style={{ color: "var(--ink)", borderColor: "var(--line)" }}
          >
            <Pen
              className="w-3.5 h-3.5 mr-2"
              style={{ color: "var(--ink-soft)" }}
            />
            Edit Profile
          </Button>
        </div>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="flex items-center gap-3 p-3.5 rounded-xl border"
            style={{
              background: "var(--paper-dim)",
              borderColor: "var(--line)",
            }}
          >
            <Mail
              className="w-4 h-4 shrink-0"
              style={{ color: "var(--ink-soft)" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--ink)" }}
            >
              {user?.email}
            </span>
          </div>
          <div
            className="flex items-center gap-3 p-3.5 rounded-xl border"
            style={{
              background: "var(--paper-dim)",
              borderColor: "var(--line)",
            }}
          >
            <Contact
              className="w-4 h-4 shrink-0"
              style={{ color: "var(--ink-soft)" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--ink)" }}
            >
              {user?.phoneNumber || "No phone linked"}
            </span>
          </div>
        </div>

        {/* Skills only meaningful for students; recruiters skip this block */}
        {isStudent && (
          <div className="my-8">
            <h2
              className="font-mono-ui text-sm font-bold uppercase tracking-wider mb-3.5"
              style={{ color: "var(--ink-soft)" }}
            >
              Skills Inventory
            </h2>
            <div className="flex flex-wrap gap-2">
              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="font-mono-ui font-bold text-xs px-3 py-1 rounded-lg pointer-events-none"
                    style={{
                      background: "rgba(0,184,153,0.1)",
                      color: "var(--teal)",
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span
                  className="text-sm font-medium italic"
                  style={{ color: "var(--ink-soft)" }}
                >
                  No technical skill markers cataloged
                </span>
              )}
            </div>
          </div>
        )}

        {/* Resume only relevant for students */}
        {isStudent && (
          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            <Label
              className="font-mono-ui text-sm font-bold uppercase tracking-wider block mb-2"
              style={{ color: "var(--ink-soft)" }}
            >
              Official Curriculum Vitae
            </Label>
            {isResume ? (
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold hover:underline px-4 py-2.5 rounded-xl transition-all border"
                style={{
                  color: "var(--teal)",
                  background: "rgba(0,184,153,0.08)",
                  borderColor: "rgba(0,184,153,0.2)",
                }}
              >
                📎 {user?.profile?.resumeOriginalName || "Download Resume"}
              </a>
            ) : (
              <span
                className="text-sm font-medium italic block mt-1"
                style={{ color: "var(--ink-soft)" }}
              >
                No resume upload instance found
              </span>
            )}
          </div>
        )}
      </main>

      {/* Only show applied jobs table for students */}
      {isStudent && (
        <section
          className="max-w-4xl mx-auto bg-white border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 mt-8"
          style={{ borderColor: "var(--line)" }}
        >
          <h1
            className="font-display font-semibold text-lg tracking-tight mb-6"
            style={{ color: "var(--ink)" }}
          >
            Applied Jobs Log
          </h1>
          <AppliedJobTable />
        </section>
      )}

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
