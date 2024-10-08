"use client";

import { fetchMovieFromTMDB } from "@/api/tmdb.service";
import { SMALL_IMG_BASE_URL } from "@/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiSolidMessageError,
} from "react-icons/bi";
import MovieSliderSkeleton from "./MovieSliderSkeleton";

type MovieType = {
  name: string;
  type: string;
};

interface Movie {
  title: string;
  backdrop_path: string;
  release_date: string;
}

const MovieSlider = ({ movieType }: { movieType: MovieType }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Fetch movies based on the selected category
  useEffect(() => {
    const getMovies = async () => {
      try {
        const allMovies = await fetchMovieFromTMDB(
          `/movie/${movieType.type}?language=en-US&page=1`
        );
        setMovies(allMovies.results);
        setError(null); // Clear previous errors
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Error fetching content. Please refresh.");
      }
    };

    getMovies();
  }, [movieType]);

  // Scroll slider to the left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  // Scroll slider to the right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  // Return error UI if there's an issue
  if (error) {
    return (
      <div className="relative md:px-20 px-5 text-center mt-64">
        <div className="mt-2 flex items-center justify-center gap-1 text-red-800 text-4xl">
          <BiSolidMessageError size={30} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return <div className="relative md:px-20 px-5 text-white">
      <MovieSliderSkeleton />
    </div>;
  }

  return (
    <div
      className="relative md:px-20 px-4 my-8 h-full"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Movie slider */}
      <div
        className="flex space-x-4 overflow-x-scroll scrollbar-hide my-10"
        ref={sliderRef}
      >
        {movies.map((movie) => (
          <div
            key={movie.title}
            className="flex flex-col gap-4 flex-shrink-0 w-full sm:w-[400px] h-full"
          >
            <div className="rounded-lg overflow-hidden h-[300px]">
              <Image
                src={SMALL_IMG_BASE_URL + movie.backdrop_path}
                alt={movie.title}
                width={400}
                height={230}
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                priority
              />
            </div>

            {/* TEXT */}
            <div className="text-center">
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <p className="text-gray-400 mt-2">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Arrows */}
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            w-20 h-20 rounded-full bg-dark-button bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollLeft}
          >
            <BiChevronLeft size={50} />
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            w-20 h-20 rounded-full bg-dark-button bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollRight}
          >
            <BiChevronRight size={50} />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieSlider;
