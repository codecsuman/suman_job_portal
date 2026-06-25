import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";

import useGetAllJobs from "@/hooks/useGetAllJobs";

const Home = () => {
    // Fetch latest jobs
    useGetAllJobs();

    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    // Redirect recruiters
    useEffect(() => {
        if (user?.role === "recruiter") {
            navigate("/admin/companies", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/30 antialiased">
            <Navbar />

            <main className="flex-1">
                {/* Section blocks organized with consistent visual flow */}
                <div className="space-y-4">
                    <HeroSection />
                    <CategoryCarousel />
                    <LatestJobs />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;