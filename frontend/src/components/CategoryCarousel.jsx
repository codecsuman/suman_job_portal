import React, { useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

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
    [dispatch, navigate],
  );

  return (
    <div className="my-16 px-12 font-body">
      <Carousel className="w-full max-w-2xl mx-auto relative group">
        <CarouselContent className="-ml-3">
          {CATEGORIES.map((category) => (
            <CarouselItem
              key={category}
              className="pl-3 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1 flex justify-center">
                <button
                  onClick={() => searchJobHandler(category)}
                  className="w-full rounded-full h-11 px-6 text-sm font-bold tracking-tight border transition-all duration-300 hover:text-white active:scale-95"
                  style={{
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                    background: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--ink)")
                  }
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "var(--ink)";
                  }}
                >
                  {category}
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="absolute -left-12 h-10 w-10 border bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        />
        <CarouselNext
          className="absolute -right-12 h-10 w-10 border bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
