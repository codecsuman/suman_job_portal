import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSearchedQuery } from "@/redux/jobSlice";

const ROTATING_WORDS = [
  "Dream Job",
  "Next Big Break",
  "Remote Gig",
  "First Internship",
  "Growth Story",
];

const QUICK_CHIPS = [
  "Frontend Developer",
  "Backend Developer",
  "Remote",
  "Internship",
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const searchJobHandler = (presetQuery) => {
    const trimmedQuery = (presetQuery ?? query).trim();
    dispatch(setSearchedQuery(trimmedQuery));
    navigate("/browse");
  };

  return (
    <section
      className="relative overflow-hidden py-20 px-4 font-body"
      style={{ background: "var(--paper)" }}
    >
      {/* Ambient accent shapes */}
      <div
        className="absolute -top-24 -right-16 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "var(--marigold)" }}
      />
      <div
        className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "var(--teal)" }}
      />

      <div className="relative max-w-3xl mx-auto text-center flex flex-col gap-7">
        <span
          className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono-ui text-[11px] tracking-widest uppercase"
          style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--teal)" }}
          />
          Kolkata's Career Launchpad
        </span>

        <h1
          className="font-display font-semibold leading-[1.08] text-4xl sm:text-5xl md:text-6xl"
          style={{ color: "var(--ink)" }}
        >
          Find Your
          <br />
          <span className="relative inline-block min-w-[1px]">
            <span
              key={wordIndex}
              className="animate-fade-slide inline-block"
              style={{ color: "var(--marigold-deep)" }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
            <svg
              className="absolute left-0 -bottom-1.5 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7 Q 50 2, 100 6 T 198 5"
                fill="none"
                stroke="var(--marigold)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p
          className="mx-auto max-w-xl text-base md:text-lg"
          style={{ color: "var(--ink-soft)" }}
        >
          Search thousands of jobs from top companies, apply with one click, and
          take the next step in your career — today.
        </p>

        <div
          className="mx-auto flex w-full max-w-2xl items-center rounded-full border pl-5 pr-1.5 py-1.5 bg-white shadow-[0_12px_30px_-12px_rgba(18,23,43,0.25)] focus-within:shadow-[0_16px_36px_-12px_rgba(255,178,56,0.35)] transition-shadow"
          style={{ borderColor: "var(--line)" }}
        >
          <input
            type="text"
            aria-label="Search Jobs"
            value={query}
            placeholder="Search by job title, company, or keyword..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchJobHandler();
            }}
            className="h-12 w-full border-none bg-transparent outline-none placeholder:text-slate-400 font-medium"
            style={{ color: "var(--ink)" }}
          />

          <button
            type="button"
            onClick={() => searchJobHandler()}
            className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--ink)" }}
            aria-label="Search"
          >
            <Search className="h-5 w-5" style={{ color: "var(--marigold)" }} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => searchJobHandler(chip)}
              className="font-mono-ui text-xs px-3.5 py-1.5 rounded-full border transition-colors hover:text-white"
              style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--ink)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
