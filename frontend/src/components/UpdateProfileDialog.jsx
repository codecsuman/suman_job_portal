import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });

  // Sync form whenever user changes
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fileChangeHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0] || null,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl border border-slate-100 p-6 bg-white shadow-2xl gap-0">
        
        <DialogHeader className="pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="mt-5">
          <div className="space-y-4 pb-6">

            {/* Name Field Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Enter your name"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3 h-10 rounded-xl border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Email Field Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3 h-10 rounded-xl border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Phone Field Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Enter phone number"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3 h-10 rounded-xl border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Bio Field Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                type="text"
                placeholder="Tell something about yourself"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3 h-10 rounded-xl border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Skills Field Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Skills
              </Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={input.skills}
                onChange={changeEventHandler}
                className="col-span-3 h-10 rounded-xl border-slate-200 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* File Upload Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resume
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={fileChangeHandler}
                className="col-span-3 rounded-xl border-slate-200 text-xs font-medium text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            {loading ? (
              <Button
                disabled
                className="w-full h-11 font-bold rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center gap-2 pointer-events-none"
              >
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                Updating Records...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-sm tracking-wide hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md shadow-slate-900/10"
              >
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;