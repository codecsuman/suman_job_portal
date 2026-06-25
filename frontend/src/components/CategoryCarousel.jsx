import React, { useCallback } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "./ui/carousel";

import { Button } from "./ui/button";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setSearchedQuery } from "@/redux/jobSlice";

const CATEGORIES = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "Full Stack Developer",
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = useCallback(
        (query) => {
            dispatch(setSearchedQuery(query));
            navigate("/browse");
        },
        [dispatch, navigate]
    );

    return (
        <div className="my-24 px-12">
            <Carousel className="w-full max-w-2xl mx-auto relative group">
                <CarouselContent className="-ml-3">
                    {CATEGORIES.map((category) => (
                        <CarouselItem
                            key={category}
                            className="pl-3 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="p-1 flex justify-center">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full h-11 px-6 text-sm font-bold tracking-tight text-slate-600 bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 hover:border-transparent active:scale-95"
                                    onClick={() =>
                                        searchJobHandler(category)
                                    }
                                >
                                    {category}
                                </Button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Enhanced Navigation Buttons with sleek background offsets */}
                <CarouselPrevious className="absolute -left-12 h-10 w-10 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm opacity-0 group-hover:opacity-100 duration-200" />
                <CarouselNext className="absolute -right-12 h-10 w-10 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm opacity-0 group-hover:opacity-100 duration-200" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;