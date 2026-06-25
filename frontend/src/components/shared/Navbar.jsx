import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, LayoutDashboard, Compass, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ===========================
    // Logout
    // ===========================
    const logoutHandler = async () => {
        try {
            const res = await axios.get(
                `${USER_API_END_POINT}/logout`,
                {
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setUser(null));

                toast.success(res.data.message);

                navigate("/");
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                    "Logout failed."
            );
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between max-w-7xl mx-auto h-20 px-6">
                
                {/* Logo */}
                <Link to="/" className="hover:opacity-90 active:scale-95 transition-all duration-200">
                    <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1.5">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Job
                        </span>
                        <span className="text-slate-800 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600 after:rounded-full">
                            Portal
                        </span>
                    </h1>
                </Link>

                {/* Navigation Links & User Actions Container */}
                <div className="flex items-center gap-10">
                    <ul className="flex items-center gap-8 text-sm font-bold text-slate-500">
                        {user?.role === "recruiter" ? (
                            <>
                                <li>
                                    <Link to="/admin/companies" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2 relative group">
                                        <LayoutDashboard size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        Companies
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/jobs" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2 group">
                                        <Briefcase size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/" className="hover:text-blue-600 transition-colors py-2">
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobs" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2 group">
                                        <Briefcase size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        Jobs
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/browse" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2 group">
                                        <Compass size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        Browse
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Authentication Logic Shell */}
                    {!user ? (
                        <div className="flex items-center gap-3.5">
                            <Link to="/login">
                                <Button variant="outline" className="h-11 rounded-xl px-6 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95">
                                    Login
                                </Button>
                            </Link>

                            <Link to="/signup">
                                <Button className="h-11 rounded-xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-[0_4px_14px_rgba(37,99,235,0.25)] font-bold text-white active:scale-95">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full cursor-pointer hover:shadow-lg transition duration-300 active:scale-95">
                                    <Avatar className="h-11 w-11 ring-2 ring-white rounded-full">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto}
                                            alt={user?.fullname}
                                            className="object-cover"
                                        />
                                    </Avatar>
                                </div>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-5 rounded-3xl shadow-2xl border border-slate-100 bg-white/95 backdrop-blur-xl mt-3 mr-4 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                <div>
                                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100/80">
                                        <Avatar className="h-14 w-14 border border-slate-100 shadow-inner rounded-2xl">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto}
                                                alt={user?.fullname}
                                                className="object-cover"
                                            />
                                        </Avatar>

                                        <div className="overflow-hidden">
                                            <h4 className="font-extrabold text-slate-800 tracking-tight truncate">
                                                {user?.fullname}
                                            </h4>

                                            <p className="text-xs text-slate-400 font-semibold truncate mt-1 bg-slate-50 px-2 py-0.5 rounded-md inline-block max-w-full">
                                                {user?.profile?.bio || "✨ No bio added"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-4 gap-1.5">
                                        {user?.role === "student" && (
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-sm font-bold group"
                                            >
                                                <User2 size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                                <span>View Profile</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={logoutHandler}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-red-600 hover:bg-red-50/70 transition-all text-sm font-bold group text-left"
                                        >
                                            <LogOut size={18} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                                            <span>Logout Account</span>
                                        </button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;