import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
  allAdminJobs: [],
  singleJob: {},
  allAppliedJobs: [],
  searchJobByText: "",
  searchedQuery: "",

  // 🔴 Notification center — backed by the real Notification model on the server.
  // Shape per item: { _id, type, title, message, relatedJob, relatedApplication, isRead, createdAt }
  notifications: [],
  unreadCount: 0,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    // ===========================
    // Jobs list
    // ===========================
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },

    addNewJob: (state, action) => {
      const exists = state.allJobs.find((j) => j._id === action.payload._id);
      if (!exists) state.allJobs.unshift(action.payload);
    },

    updateJobInList: (state, action) => {
      const index = state.allJobs.findIndex(
        (j) => j._id === action.payload._id,
      );
      if (index !== -1) state.allJobs[index] = action.payload;
      if (state.singleJob._id === action.payload._id) {
        state.singleJob = { ...state.singleJob, ...action.payload };
      }
    },

    removeJobFromList: (state, action) => {
      state.allJobs = state.allJobs.filter((j) => j._id !== action.payload);
      state.allAdminJobs = state.allAdminJobs.filter(
        (j) => j._id !== action.payload,
      );
    },

    updateJobApplicantCount: (state, action) => {
      const { jobId, totalApplications } = action.payload;
      const job = state.allJobs.find((j) => j._id === jobId);
      if (job) job.applications = Array(totalApplications).fill(null);

      const adminJob = state.allAdminJobs.find((j) => j._id === jobId);
      if (adminJob) adminJob.applications = Array(totalApplications).fill(null);

      if (state.singleJob._id === jobId) {
        state.singleJob.applications = Array(totalApplications).fill(null);
      }
    },

    setSingleJob: (state, action) => {
      state.singleJob =
        typeof action.payload === "function"
          ? action.payload(state.singleJob)
          : action.payload;
    },

    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },

    addNewAdminJob: (state, action) => {
      const exists = state.allAdminJobs.find(
        (j) => j._id === action.payload._id,
      );
      if (!exists) state.allAdminJobs.unshift(action.payload);
    },

    // ===========================
    // Applied jobs (student side)
    // ===========================
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },

    removeAppliedJob: (state, action) => {
      state.allAppliedJobs = state.allAppliedJobs.filter(
        (a) => a._id !== action.payload,
      );
    },

    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const app = state.allAppliedJobs.find((a) => a._id === applicationId);
      if (app) app.status = status;
    },

    updateApplicationInterview: (state, action) => {
      const { applicationId, interview } = action.payload;
      const app = state.allAppliedJobs.find((a) => a._id === applicationId);
      if (app) app.interview = interview;
    },

    // ===========================
    // Search
    // ===========================
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    // ===========================
    // Notification center (server-persisted)
    // ===========================

    // Bulk-load from GET /api/v1/notification on mount
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications || [];
      state.unreadCount = action.payload.unreadCount ?? 0;
    },

    // A single live notification arrived over the socket ("notification" event)
    addNotification: (state, action) => {
      const notification = action.payload;
      const exists = state.notifications.find(
        (n) => n._id === notification._id,
      );
      if (exists) return;

      state.notifications.unshift(notification);
      if (!notification.isRead) state.unreadCount += 1;
      if (state.notifications.length > 30) state.notifications.pop();
    },

    // Local-only mark-as-read (call the API separately, then dispatch this)
    markNotificationReadLocal: (state, action) => {
      const n = state.notifications.find((n) => n._id === action.payload);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllNotificationsReadLocal: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },

    removeNotificationLocal: (state, action) => {
      const n = state.notifications.find((n) => n._id === action.payload);
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload,
      );
      if (n && !n.isRead)
        state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    clearNotificationsLocal: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // ===========================
    // Reset actions
    // ===========================
    resetSingleJob: (state) => {
      state.singleJob = {};
    },
    resetAdminJobs: (state) => {
      state.allAdminJobs = [];
    },
    resetAppliedJobs: (state) => {
      state.allAppliedJobs = [];
    },
    resetJobs: (state) => {
      state.allJobs = [];
    },
    resetJobState: (state) => {
      state.allJobs = [];
      state.allAdminJobs = [];
      state.singleJob = {};
      state.allAppliedJobs = [];
      state.searchJobByText = "";
      state.searchedQuery = "";
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setAllJobs,
  addNewJob,
  updateJobInList,
  removeJobFromList,
  updateJobApplicantCount,
  setSingleJob,
  setAllAdminJobs,
  addNewAdminJob,
  setAllAppliedJobs,
  removeAppliedJob,
  updateApplicationStatus,
  updateApplicationInterview,
  setSearchJobByText,
  setSearchedQuery,
  setNotifications,
  addNotification,
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
  removeNotificationLocal,
  clearNotificationsLocal,
  resetSingleJob,
  resetAdminJobs,
  resetAppliedJobs,
  resetJobs,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;
