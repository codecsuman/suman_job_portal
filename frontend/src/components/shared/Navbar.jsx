import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import NotificationBell from "./NotificationBell";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { disconnectSocket } from "@/utils/socket";
import { LogOut, User2 } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        disconnectSocket();
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-slate-800"
        >
          Job<span className="text-blue-600">Portal</span>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex font-semibold text-sm items-center gap-6 text-slate-600">
            {user?.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-xl font-bold text-sm"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell />

              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer h-9 w-9 border border-slate-100">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-blue-50 font-bold text-blue-600 text-sm">
                      {user?.fullname?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-64 rounded-2xl p-4 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback className="bg-blue-50 font-bold text-blue-600">
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {user?.fullname}
                      </p>
                      <p className="text-xs font-medium text-slate-400 truncate capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col mt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg px-2 py-2 transition-colors"
                    >
                      <User2 className="w-4 h-4" /> View Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg px-2 py-2 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
