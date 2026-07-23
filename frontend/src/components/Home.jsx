import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";

import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSocket } from "@/hooks/useSocket";

const TICKER_ITEMS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "UI / UX Designer",
  "Product Manager",
  "QA Engineer",
];

// Signature ambient element: a slow, continuous scroll of role categories
// in ink-navy — decorative, not interactive, sits between the hero and the
// rest of the page like a runway strip.
const CategoryTicker = () => (
  <div
    className="overflow-hidden py-3 border-y font-mono-ui"
    style={{ background: "var(--ink)", borderColor: "var(--ink)" }}
    aria-hidden="true"
  >
    <div className="flex w-max animate-marquee">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-3 px-6 text-xs tracking-widest uppercase whitespace-nowrap"
          style={{ color: "var(--marigold)" }}
        >
          {item}
          <span style={{ color: "var(--teal)" }}>•</span>
        </span>
      ))}
    </div>
  </div>
);

const Home = () => {
  useGetAllJobs();
  useSocket();

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col antialiased"
      style={{ background: "var(--paper)" }}
    >
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryTicker />
        <div className="space-y-4">
          <CategoryCarousel />
          <LatestJobs />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
