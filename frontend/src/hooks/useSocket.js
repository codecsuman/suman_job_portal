import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  subscribeToEvent,
  unsubscribeFromEvent,
  joinAdminRoom,
  joinJobRoom,
  leaveJobRoom,
} from "@/utils/socket";
import {
  addNewJob,
  updateJobInList,
  removeJobFromList,
  updateJobApplicantCount,
  setSingleJob,
  updateApplicationStatus,
  updateApplicationInterview,
  removeAppliedJob,
  addNotification,
} from "@/redux/jobSlice";
import {
  addNewApplicant,
  updateApplicantStatus,
  setApplicantInterview,
} from "@/redux/applicationSlice";
import { toast } from "sonner";

// ===========================
// useSocket — mount ONCE per authenticated session (top level of App.jsx)
// ===========================
export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const isConnected = useRef(false);

  useEffect(() => {
    if (!user || isConnected.current) return;

    connectSocket(user._id);
    isConnected.current = true;

    if (user.role === "recruiter") {
      joinAdminRoom(user._id);
    }

    // ---------- Job feed (UI list updates) ----------
    const handleNewJob = (data) => {
      dispatch(addNewJob(data.job));
      toast.success("New job posted!", {
        description: `${data.job.title} at ${data.job.company?.name}`,
      });
    };

    const handleJobUpdated = (data) => {
      dispatch(updateJobInList(data.job));
    };

    const handleJobDeleted = (data) => {
      dispatch(removeJobFromList(data.jobId));
    };

    const handleJobListUpdated = (data) => {
      if (data.type === "updated") dispatch(updateJobInList(data.job));
      else if (data.type === "deleted") dispatch(removeJobFromList(data.jobId));
      else if (data.type === "application") {
        dispatch(
          updateJobApplicantCount({
            jobId: data.jobId,
            totalApplications: data.totalApplications,
          }),
        );
      }
    };

    // ---------- Applications (recruiter's live job-detail counter) ----------
    const handleNewApplication = (data) => {
      dispatch(
        updateJobApplicantCount({
          jobId: data.jobId,
          totalApplications: data.totalApplications,
        }),
      );
    };

    // Withdrawn application (student cancelled a pending one)
    const handleApplicantWithdrawn = (data) => {
      dispatch(
        updateJobApplicantCount({
          jobId: data.jobId,
          totalApplications: data.totalApplications,
        }),
      );
    };

    // ---------- Status change (student's applied-jobs table) ----------
    const handleApplicationStatusUpdated = (data) => {
      dispatch(updateApplicationStatus(data));
      const isAccepted = data.status === "accepted";
      toast[isAccepted ? "success" : "info"](
        data.message || `Your application is now ${data.status}`,
        { description: isAccepted ? "🎉 Congratulations!" : "Keep applying!" },
      );
    };

    // Recruiter-side mirror (keeps their applicants table synced)
    const handleApplicantStatusUpdated = (data) => {
      dispatch(updateApplicantStatus(data));
    };

    // ---------- Interview scheduling (both sides) ----------
    const handleInterviewScheduled = (data) => {
      dispatch(
        updateApplicationInterview({
          applicationId: data.applicationId,
          interview: data.interview,
        }),
      );
      dispatch(
        setApplicantInterview({
          applicationId: data.applicationId,
          interview: data.interview,
        }),
      );
      toast.success("Interview scheduled", { description: data.message });
    };

    // ---------- 🔧 FIXED: single unified notification handler ----------
    // The backend's sendNotification() util emits ONE "notification" event
    // carrying the exact persisted DB document — no more re-building a
    // fake notification object per event type on the frontend.
    const handleNotification = (data) => {
      dispatch(addNotification(data.notification));
    };

    subscribeToEvent("newJob", handleNewJob);
    subscribeToEvent("jobUpdated", handleJobUpdated);
    subscribeToEvent("jobDeleted", handleJobDeleted);
    subscribeToEvent("jobListUpdated", handleJobListUpdated);
    subscribeToEvent("newApplication", handleNewApplication);
    subscribeToEvent("applicantWithdrawn", handleApplicantWithdrawn);
    subscribeToEvent(
      "applicationStatusUpdated",
      handleApplicationStatusUpdated,
    );
    subscribeToEvent("applicantStatusUpdated", handleApplicantStatusUpdated);
    subscribeToEvent("interviewScheduled", handleInterviewScheduled);
    subscribeToEvent("notification", handleNotification);

    return () => {
      unsubscribeFromEvent("newJob", handleNewJob);
      unsubscribeFromEvent("jobUpdated", handleJobUpdated);
      unsubscribeFromEvent("jobDeleted", handleJobDeleted);
      unsubscribeFromEvent("jobListUpdated", handleJobListUpdated);
      unsubscribeFromEvent("newApplication", handleNewApplication);
      unsubscribeFromEvent("applicantWithdrawn", handleApplicantWithdrawn);
      unsubscribeFromEvent(
        "applicationStatusUpdated",
        handleApplicationStatusUpdated,
      );
      unsubscribeFromEvent(
        "applicantStatusUpdated",
        handleApplicantStatusUpdated,
      );
      unsubscribeFromEvent("interviewScheduled", handleInterviewScheduled);
      unsubscribeFromEvent("notification", handleNotification);
    };
  }, [user, dispatch]);

  return { isConnected: isConnected.current };
};

// ===========================
// useJobSocket — mount on a SINGLE job detail page
// ===========================
export const useJobSocket = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jobId) return;

    joinJobRoom(jobId);

    const handleJobUpdated = (data) => {
      dispatch(setSingleJob(data.job));
      toast.info("This job was just updated!", {
        description: "Salary or details may have changed.",
      });
    };

    const handleNewApplication = (data) => {
      dispatch(
        setSingleJob((prev) => ({
          ...prev,
          applications: [...(prev.applications || []), data.application],
        })),
      );
      toast.info("Someone just applied!", {
        description: `Total applicants: ${data.totalApplications}`,
      });
    };

    subscribeToEvent("jobUpdated", handleJobUpdated);
    subscribeToEvent("newApplication", handleNewApplication);

    return () => {
      leaveJobRoom(jobId);
      unsubscribeFromEvent("jobUpdated", handleJobUpdated);
      unsubscribeFromEvent("newApplication", handleNewApplication);
    };
  }, [jobId, dispatch]);
};
