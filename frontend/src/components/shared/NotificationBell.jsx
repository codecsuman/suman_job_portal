import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  Users,
  CalendarClock,
  CheckCircle2,
  Trash2,
  Sparkles,
  Inbox,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import {
  setNotifications,
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
  clearNotificationsLocal,
} from "@/redux/jobSlice";

const CONFIG = {
  job: {
    icon: Briefcase,
    ring: "ring-blue-100",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  application: {
    icon: Users,
    ring: "ring-purple-100",
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
  },
  interview: {
    icon: CalendarClock,
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  status: {
    icon: CheckCircle2,
    ring: "ring-emerald-100",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString();
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all"); // "all" | "unread"

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(NOTIFICATION_API_END_POINT, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(
            setNotifications({
              notifications: res.data.notifications,
              unreadCount: res.data.unreadCount,
            }),
          );
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    fetchNotifications();
  }, [user, dispatch]);

  const visibleNotifications = useMemo(
    () =>
      tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications,
    [tab, notifications],
  );

  const handleMarkRead = async (notificationId) => {
    dispatch(markNotificationReadLocal(notificationId));
    try {
      await axios.put(
        `${NOTIFICATION_API_END_POINT}/mark-read/${notificationId}`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    dispatch(markAllNotificationsReadLocal());
    try {
      await axios.put(
        `${NOTIFICATION_API_END_POINT}/mark-all-read`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleClearAll = async () => {
    dispatch(clearNotificationsLocal());
    try {
      await axios.delete(`${NOTIFICATION_API_END_POINT}/clear`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors group">
          <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                /*
                  🔧 FIXED: this used to be `h-4.5` — NOT a real Tailwind
                  utility (the default spacing scale has 4 then jumps to 5,
                  there is no 4.5), so the class silently failed to generate
                  any CSS and the badge collapsed to zero height. Using an
                  explicit pixel size fixes it for good.
                */
                className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-rose-500/30 leading-none"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-96 rounded-3xl p-0 shadow-2xl shadow-slate-900/10 border border-slate-100/80 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Notifications
              </h3>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-white/50 hover:text-rose-300 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="relative flex items-center gap-1 mt-4 bg-white/10 rounded-xl p-1 w-fit">
            {[
              { key: "all", label: "All" },
              {
                key: "unread",
                label: `Unread${unreadCount ? ` · ${unreadCount}` : ""}`,
              },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  tab === t.key
                    ? "text-slate-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="notif-tab-pill"
                    className="absolute inset-0 bg-white rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mark all read row */}
        {unreadCount > 0 && (
          <div className="flex justify-end px-5 py-2 border-b border-slate-50 bg-slate-50/50">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* List */}
        <div className="max-h-[26rem] overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                <Inbox className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">
                {tab === "unread" ? "Nothing unread" : "All quiet here"}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1 text-center max-w-[220px]">
                {tab === "unread"
                  ? "You've read everything — nice."
                  : "Job updates, applications, and interviews will show up here."}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {visibleNotifications.map((n) => {
                const cfg = CONFIG[n.type] || CONFIG.job;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleMarkRead(n._id)}
                    className={`flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 cursor-pointer transition-colors ${
                      n.isRead
                        ? "bg-white hover:bg-slate-50/70"
                        : "bg-blue-50/30 hover:bg-blue-50/60"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg} ring-4 ${cfg.ring}`}
                    >
                      <Icon className={`w-4 h-4 ${cfg.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {timeAgo(n.createdAt)}
                          </span>
                          {!n.isRead && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
