import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { emitToJob, emitToAdmin, broadcast } from "../utils/socket.js";
import { sendNotification } from "../utils/notify.js";

// ===========================
// Apply Job
// ===========================
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Create application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Populate the application for real-time emit
    const populatedApplication = await Application.findById(
      newApplication._id,
    ).populate({
      path: "applicant",
      select: "-password",
    });

    // 🔴 REAL-TIME: Update applicant count on job detail page
    emitToJob(jobId, "newApplication", {
      application: populatedApplication,
      totalApplications: job.applications.length,
      jobId,
    });

    // 🔴 REAL-TIME (transient, room-based): Notify the job creator (recruiter)
    emitToAdmin(job.created_by.toString(), "newApplicantNotification", {
      message: `New applicant for ${job.title} at ${job.company?.name}`,
      jobId: job._id,
      applicantName: populatedApplication.applicant.fullname,
      totalApplicants: job.applications.length,
    });

    // 🔴 PERSISTED: also save this as a real notification for the recruiter
    // so it's still there even if they were offline or refresh the page.
    await sendNotification({
      recipientId: job.created_by,
      type: "application",
      title: "New applicant",
      message: `${populatedApplication.applicant.fullname} applied for ${job.title} at ${job.company?.name}`,
      relatedJob: job._id,
      relatedApplication: newApplication._id,
    });

    // 🔴 REAL-TIME: Update the jobs list with new applicant count
    broadcast("jobListUpdated", {
      jobId: job._id,
      type: "application",
      totalApplications: job.applications.length,
    });

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Get Applied Jobs
// ===========================
export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Get Applicants
// ===========================
export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: "applications",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Update Application Status
// ===========================
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    const validStatus = ["pending", "accepted", "rejected"];

    if (!validStatus.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid status.",
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate({
      path: "job",
      populate: { path: "company" },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    const message = `Your application for ${application.job?.title} is now ${status.toLowerCase()}`;

    // 🔴 PERSISTED + REAL-TIME: notify the applicant directly.
    // sendNotification saves it to Mongo AND pushes it live over the socket
    // if the applicant happens to be online right now.
    await sendNotification({
      recipientId: application.applicant,
      type: "status",
      title: `Application ${status.toLowerCase()}`,
      message,
      relatedJob: application.job?._id,
      relatedApplication: application._id,
    });

    // Keep the existing lightweight event too, since the frontend's
    // applicationStatusUpdated handler already expects this exact shape
    // for updating the applied-jobs table without a refetch.
    const { getIO, getOnlineUsers } = await import("../utils/socket.js");
    const onlineUsers = getOnlineUsers();
    const applicantSocketId = onlineUsers.get(application.applicant.toString());
    if (applicantSocketId) {
      getIO().to(applicantSocketId).emit("applicationStatusUpdated", {
        applicationId: application._id,
        status: application.status,
        jobTitle: application.job?.title,
        companyName: application.job?.company?.name,
        message,
      });
    }

    // 🔴 REAL-TIME: Update applicants table for recruiters viewing this job
    emitToJob(application.job._id.toString(), "applicantStatusUpdated", {
      applicationId: application._id,
      status: application.status,
    });

    return res.status(200).json({
      message: "Application status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Withdraw a pending application (student only)
// DELETE /api/v1/application/withdraw/:id
// ===========================
export const withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application =
      await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    if (application.applicant.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only withdraw your own applications.",
        success: false,
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: `You can't withdraw an application that's already ${application.status}.`,
        success: false,
      });
    }

    const jobId = application.job._id;

    await Application.findByIdAndDelete(applicationId);
    await Job.findByIdAndUpdate(jobId, {
      $pull: { applications: applicationId },
    });

    const updatedJob = await Job.findById(jobId);

    // 🔴 REAL-TIME: keep the applicant count and recruiter's table in sync
    emitToJob(jobId.toString(), "applicantWithdrawn", {
      applicationId,
      totalApplications: updatedJob.applications.length,
    });

    broadcast("jobListUpdated", {
      jobId,
      type: "application",
      totalApplications: updatedJob.applications.length,
    });

    return res.status(200).json({
      message: "Application withdrawn successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// POST /api/v1/application/schedule-interview/:id
// body: { date, time, mode, location, notes }
// ===========================
export const scheduleInterview = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { date, time, mode, location, notes } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required.",
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate({
      path: "job",
      populate: { path: "company" },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Only the recruiter who owns the job can schedule
    if (application.job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only schedule interviews for your own job postings.",
        success: false,
      });
    }

    const interview = { date, time, mode: mode || "online", location, notes };
    application.interview = interview;
    await application.save();

    const message = `Interview scheduled for "${application.job.title}" on ${date} at ${time}`;

    // 🔴 PERSISTED + REAL-TIME: notify the applicant
    await sendNotification({
      recipientId: application.applicant,
      type: "interview",
      title: "Interview scheduled",
      message,
      relatedJob: application.job._id,
      relatedApplication: application._id,
    });

    // Keep the existing event shape the ApplicantsTable / AppliedJobTable
    // already listen for, so the interview details update live without a refetch.
    const { getIO, getOnlineUsers } = await import("../utils/socket.js");
    const onlineUsers = getOnlineUsers();
    const applicantSocketId = onlineUsers.get(application.applicant.toString());
    if (applicantSocketId) {
      getIO().to(applicantSocketId).emit("interviewScheduled", {
        applicationId: application._id,
        interview,
        message,
      });
    }

    // 🔴 REAL-TIME: notify anyone viewing this job's applicants table
    emitToJob(application.job._id.toString(), "interviewScheduled", {
      applicationId: application._id,
      interview,
      message,
    });

    return res.status(200).json({
      message: "Interview scheduled successfully.",
      interview,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
