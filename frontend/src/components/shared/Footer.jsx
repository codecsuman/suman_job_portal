import React from "react";
import {
    Facebook,
    Twitter,
    Linkedin,
    Github,
    Mail,
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">

            {/* Background Blur */}
            <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-14">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Logo */}
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight">
                            Job
                            <span className="text-[#F83002]">
                                Portal
                            </span>
                        </h2>

                        <p className="mt-4 text-slate-300 leading-7">
                            Your trusted platform to discover
                            jobs, hire talented professionals,
                            and grow your career.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-slate-300">

                            <li className="hover:text-white cursor-pointer transition">
                                Home
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                Browse Jobs
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                Companies
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                Contact
                            </li>

                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-5">
                            Support
                        </h3>

                        <ul className="space-y-3 text-slate-300">

                            <li className="hover:text-white cursor-pointer transition">
                                Help Center
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                Privacy Policy
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                Terms & Conditions
                            </li>

                            <li className="hover:text-white cursor-pointer transition">
                                FAQs
                            </li>

                        </ul>
                    </div>

                    {/* Social */}
                    <div>

                        <h3 className="font-bold text-lg mb-5">
                            Connect With Us
                        </h3>

                        <div className="flex gap-4">

                            <a
                                href="#"
                                className="bg-slate-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <Facebook size={20} />
                            </a>

                            <a
                                href="#"
                                className="bg-slate-800 hover:bg-sky-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <Twitter size={20} />
                            </a>

                            <a
                                href="#"
                                className="bg-slate-800 hover:bg-blue-700 p-3 rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <Linkedin size={20} />
                            </a>

                            <a
                                href="#"
                                className="bg-slate-800 hover:bg-gray-700 p-3 rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <Github size={20} />
                            </a>

                            <a
                                href="#"
                                className="bg-slate-800 hover:bg-red-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <Mail size={20} />
                            </a>

                        </div>

                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center">

                    <p className="text-slate-400 text-sm">
                        © {currentYear} JobPortal. All rights reserved.
                    </p>

                    <p className="text-slate-400 text-sm mt-3 md:mt-0">
                        Made with ❤️ using React, Tailwind CSS &
                        Node.js
                    </p>

                </div>

            </div>

        </footer>
    );
};

export default Footer;