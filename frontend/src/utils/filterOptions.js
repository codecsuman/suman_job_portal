// Single source of truth for anything filterable.
// FilterCard.jsx (student search) and PostJob.jsx (recruiter posting)
// BOTH import from here, so a recruiter's selection always matches
// what a student can filter by — no more free-text drift.

export const LOCATIONS = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Delhi NCR",
  "Noida",
  "Gurgaon",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Bhubaneswar",
  "Patna",
  "Ranchi",
  "Raipur",
  "Bhopal",
  "Nagpur",
  "Kochi",
  "Coimbatore",
  "Visakhapatnam",
  "Surat",
  "Chandigarh",
  "Mysore",
  "Remote",
  "Work From Home",
];

export const INDUSTRIES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Angular Developer",
  "Vue Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "PHP Developer",
  "Android Developer",
  "iOS Developer",
  "Flutter Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Software Engineer",
  "Data Analyst",
  "Data Scientist",
  "AI / ML Engineer",
  "Cyber Security",
  "QA Engineer",
  "UI / UX Designer",
  "Graphic Designer",
  "Business Analyst",
  "Product Manager",
  "Digital Marketing",
  "HR Executive",
];

export const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Remote",
  "Hybrid",
];

// min/max are in YEARS — matches Job.experienceLevel (a plain Number of years)
export const EXPERIENCE_RANGES = [
  { label: "Fresher", min: 0, max: 0 },
  { label: "0-1 Years", min: 0, max: 1 },
  { label: "1-2 Years", min: 1, max: 2 },
  { label: "2-3 Years", min: 2, max: 3 },
  { label: "3-5 Years", min: 3, max: 5 },
  { label: "5-8 Years", min: 5, max: 8 },
  { label: "8-10 Years", min: 8, max: 10 },
  { label: "10+ Years", min: 10, max: 999 },
];

// min/max are in LPA — matches Job.salary (a plain Number, displayed as "₹ {salary} LPA"
// everywhere in Job.jsx / JobDescription.jsx / LatestJobCards.jsx)
export const SALARY_RANGES = [
  { label: "0 - 3 LPA", min: 0, max: 3 },
  { label: "3 - 6 LPA", min: 3, max: 6 },
  { label: "6 - 10 LPA", min: 6, max: 10 },
  { label: "10 - 15 LPA", min: 10, max: 15 },
  { label: "15 - 25 LPA", min: 15, max: 25 },
  { label: "25+ LPA", min: 25, max: 9999 },
];
