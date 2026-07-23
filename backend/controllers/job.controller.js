import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { getIO, emitToJob, broadcast } from "../utils/socket.js";
import { sendNotification } from "../utils/notify.js";

// ===========================
// Normalize whatever the frontend sends into the schema's
// exact enum values: ["Full-Time","Part-Time","Internship","Contract","Remote","Hybrid"]
// ===========================
const normalizeJobType = (value) => {
  if (!value) return value;
  const map = {
    "full time": "Full-Time",
    "full-time": "Full-Time",
    fulltime: "Full-Time",
    "part time": "Part-Time",
    "part-time": "Part-Time",
    parttime: "Part-Time",
    internship: "Internship",
    contract: "Contract",
    remote: "Remote",
    hybrid: "Hybrid",
  };
  return map[value.trim().toLowerCase()] || value;
};

// ===========================
// Notify every applicant of a job whenever it's meaningfully
// changed or removed, so students aren't caught off guard.
// ===========================
const notifyApplicantsOfJob = async (jobId, { title, message }) => {
  const applications = await Application.find({ job: jobId }).select(
    "applicant",
  );
  const uniqueApplicantIds = [
    ...new Set(applications.map((a) => a.applicant.toString())),
  ];

  await Promise.all(
    uniqueApplicantIds.map((applicantId) =>
      sendNotification({
        recipientId: applicantId,
        type: "job",
        title,
        message,
        relatedJob: jobId,
      }),
    ),
  );
};

// ===========================
// Create Job
// ===========================
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      salary: Number(salary),
      experienceLevel: Number(experience),
      location,
      jobType: normalizeJobType(jobType),
      position: Number(position),
      company: companyId,
      created_by: userId,
    });

    const populatedJob = await Job.findById(job._id).populate("company");

    // 🔴 REAL-TIME: Broadcast new job to ALL connected clients
    broadcast("newJob", {
      job: populatedJob,
      message: "New job posted!",
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job: populatedJob,
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
// Update Job
// ===========================
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
    } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only update your own jobs.",
        success: false,
      });
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) {
      job.requirements = requirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (salary) job.salary = Number(salary);
    if (location) job.location = location;
    if (jobType) job.jobType = normalizeJobType(jobType);
    if (experience) job.experienceLevel = Number(experience);
    if (position) job.position = Number(position);

    await job.save();

    const updatedJob = await Job.findById(id).populate("company");

    // 🔴 REAL-TIME: Emit update to all viewers of this job
    emitToJob(id, "jobUpdated", {
      job: updatedJob,
      message: "Job details updated",
    });

    broadcast("jobListUpdated", {
      job: updatedJob,
      type: "updated",
    });

    // 🔴 PERSISTED: let every applicant know the posting they applied to changed
    await notifyApplicantsOfJob(id, {
      title: "Job updated",
      message: `A job you applied to — "${updatedJob.title}" at ${updatedJob.company?.name} — was updated.`,
    });

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob,
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
// Delete Job
// ===========================
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only delete your own jobs.",
        success: false,
      });
    }

    // 🔴 PERSISTED: notify applicants BEFORE the job disappears (need the title)
    await notifyApplicantsOfJob(id, {
      title: "Job removed",
      message: `A job you applied to — "${job.title}" — has been taken down by the recruiter.`,
    });

    await Job.findByIdAndDelete(id);

    // 🔴 REAL-TIME: Notify all viewers
    emitToJob(id, "jobDeleted", { jobId: id });
    broadcast("jobListUpdated", { jobId: id, type: "deleted" });

    return res.status(200).json({
      message: "Job deleted successfully.",
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
// Get All Jobs
// GET /api/v1/job/get?keyword=&jobType=&location=&salaryMin=&salaryMax=&page=1&limit=12
// ===========================
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const { jobType, location, salaryMin, salaryMax } = req.query;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 12),
    );
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    if (jobType) query.jobType = jobType;
    if (location) query.location = { $regex: location, $options: "i" };

    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
// Get Job By ID
// ===========================
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("company")
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
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
// Get Admin Jobs
// ===========================
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({
      created_by: adminId,
    })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
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
