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
    <div className="min-h-screen bg-slate-50/50 antialiased pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] mt-10 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 rounded-2xl border border-slate-100 shadow-inner">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt={user?.fullname}
                className="object-cover"
              />
              <AvatarFallback className="rounded-2xl bg-indigo-50 font-black text-xl text-indigo-600">
                {user?.fullname?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {user?.fullname}
                </h1>
                <Badge className="bg-blue-50 text-blue-700 border border-blue-100 text-xs capitalize">
                  {user?.role}
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1 max-w-md leading-relaxed">
                {user?.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="h-10 rounded-xl text-xs font-bold tracking-wide text-slate-700 border-slate-200 hover:bg-slate-50 transition-all duration-200 shrink-0 self-end sm:self-auto"
          >
            <Pen className="w-3.5 h-3.5 mr-2 text-slate-400" />
            Edit Profile
          </Button>
        </div>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100/80 p-3.5 rounded-xl">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-600 truncate">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100/80 p-3.5 rounded-xl">
            <Contact className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-600 truncate">
              {user?.phoneNumber || "No phone linked"}
            </span>
          </div>
        </div>

        {/* Skills only meaningful for students; recruiters skip this block */}
        {isStudent && (
          <div className="my-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3.5">
              Skills Inventory
            </h2>
            <div className="flex flex-wrap gap-2">
              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="ghost"
                    className="font-bold text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100/60 pointer-events-none"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm font-medium text-slate-400 italic">
                  No technical skill markers cataloged
                </span>
              )}
            </div>
          </div>
        )}

        {/* Resume only relevant for students */}
        {isStudent && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <Label className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Official Curriculum Vitae
            </Label>
            {isResume ? (
              <a
                href={user?.profile?.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-blue-50/40 border border-blue-100/50 px-4 py-2.5 rounded-xl transition-all"
              >
                📎 {user?.profile?.resumeOriginalName || "Download Resume"}
              </a>
            ) : (
              <span className="text-sm font-medium text-slate-400 italic block mt-1">
                No resume upload instance found
              </span>
            )}
          </div>
        )}
      </main>

      {/* Only show applied jobs table for students */}
      {isStudent && (
        <section className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 mt-8">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight mb-6">
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
