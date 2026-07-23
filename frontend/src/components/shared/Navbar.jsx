import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
    <div className="sticky top-4 z-40 px-4 font-body">
      <div
        className="max-w-6xl mx-auto flex items-center justify-between h-16 px-3 sm:px-5 rounded-full border backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(18,23,43,0.18)]"
        style={{
          borderColor: "var(--line)",
          background: "rgba(252,251,248,0.85)",
        }}
      >
        <Link to="/" className="flex items-center gap-1.5 pl-2">
          <span
            className="font-display font-bold text-xl tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Job<span style={{ color: "var(--marigold-deep)" }}>Folio</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul
            className="hidden md:flex items-center gap-1 text-sm font-semibold"
            style={{ color: "var(--ink-soft)" }}
          >
            {user?.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors"
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
                    className="px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="px-3.5 py-2 rounded-full hover:bg-black/5 transition-colors"
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
                <button
                  className="h-10 px-5 rounded-full font-bold text-sm border transition-colors"
                  style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className="h-10 px-5 rounded-full font-bold text-sm transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: "var(--marigold)", color: "var(--ink)" }}
                >
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <NotificationBell />

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-1 rounded-full">
                    <Avatar
                      className="cursor-pointer h-9 w-9 border-2 transition-colors"
                      style={{ borderColor: "var(--marigold)" }}
                    >
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback
                        className="font-bold text-sm"
                        style={{
                          background: "var(--paper-dim)",
                          color: "var(--ink)",
                        }}
                      >
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-64 rounded-2xl p-4 shadow-xl border"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div
                    className="flex items-center gap-3 pb-3 border-b"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                      <AvatarFallback
                        className="font-bold"
                        style={{
                          background: "var(--paper-dim)",
                          color: "var(--ink)",
                        }}
                      >
                        {user?.fullname?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p
                        className="font-bold text-sm truncate"
                        style={{ color: "var(--ink)" }}
                      >
                        {user?.fullname}
                      </p>
                      <p
                        className="text-xs font-mono-ui uppercase tracking-wider truncate"
                        style={{ color: "var(--teal)" }}
                      >
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col mt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm font-semibold rounded-lg px-2 py-2 hover:bg-black/5 transition-colors"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      <User2 className="w-4 h-4" /> View Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-2 text-sm font-semibold rounded-lg px-2 py-2 hover:bg-rose-50 text-rose-600 transition-colors text-left"
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
