import React, { useEffect, useRef, useState } from "react";
import hero1 from "../assets/hero/7.jpg";
import hero2 from "../assets/hero/2.jpg";
import hero3 from "../assets/hero/3.jpg";
import hero4 from "../assets/hero/5.jpg";

const slides = [
  {
    title: "12 Deal Days of December",
    desc: "Today's deal: Courses start at just ₹399. Hurry, our deal days are almost over.",
    image: hero1,
  },
  {
    title: "Upgrade Your Career",
    desc: "Top instructors. Real-world projects. Learn at your pace.",
    image: hero2,
  },
  {
    title: "Learn AI & Future Skills",
    desc: "Build AI, automation & next-gen skills that companies need.",
    image: hero3,
  },
  {
    title: "Master In-Demand Skills",
    desc: "Learn from industry experts and grow faster.",
    image: hero4,
  },
];

const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

export default function HeroCarousel() {
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const intervalRef = useRef(null);

  const SLIDE_DURATION = 5000;
  const TRANSITION_DURATION = 800;

  // Auto-scroll
  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, SLIDE_DURATION);
  };
  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  // Infinite loop smooth reset
  useEffect(() => {
    if (index === extendedSlides.length - 1) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(1);
      }, TRANSITION_DURATION);
    }
    if (index === 0) {
      setTimeout(() => {
        setEnableTransition(false);
        setIndex(slides.length);
      }, TRANSITION_DURATION);
    }
  }, [index]);

  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
    }
  }, [enableTransition]);

  return (
    <section className="py-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className="relative rounded-2xl overflow-hidden group"
          onMouseEnter={stopAutoScroll}
          onMouseLeave={startAutoScroll}
        >
          {/* SLIDER */}
          <div
            className={`flex ${
              enableTransition ? "transition-transform duration-[800ms] ease-in-out" : ""
            }`}
            style={{
              transform: `translate3d(-${index * 100}%, 0, 0)`,
              willChange: "transform",
            }}
          >
            {extendedSlides.map((slide, i) => {
              const realIndex = (i - 1 + slides.length) % slides.length;
              const isLeft = realIndex % 2 === 0;

              return (
                <div key={i} className="min-w-full h-[540px] relative overflow-hidden">
                  {/* IMAGE */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    draggable={false}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 transition-opacity duration-700 group-hover:opacity-90" />

                  {/* TEXT */}
                  <div className="relative z-10 h-full flex items-center">
                    <div
                      className={`max-w-xl text-white px-6 md:px-10 ${
                        isLeft ? "mr-auto text-left" : "ml-auto text-right"
                      }`}
                    >
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 opacity-0 translate-y-5 animate-slideIn">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 mb-6 opacity-0 translate-y-3 animate-slideIn delay-200">
                        {slide.desc}
                      </p>
                      <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-opacity opacity-0 animate-slideIn delay-400">
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i + 1)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === i + 1 ? "bg-white scale-125 opacity-100" : "bg-white/50 scale-100 opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
