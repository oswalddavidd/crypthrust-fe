import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "about", title: "About Us", content: "Crypthrust is a cutting-edge platform revolutionizing the digital asset space with innovative solutions." },
  { id: "vision", title: "Vision", content: "To create a seamless and secure ecosystem for digital asset management and trading." },
  { id: "who-we-are", title: "Who Are We", content: "A team of blockchain enthusiasts and financial experts dedicated to building the future of finance." },
  { id: "q2-2025", title: "Q2 2025 Milestone", content: "Initial platform development and private beta testing." },
  { id: "q3-2025", title: "Q3 2025 Milestone", content: "Public beta launch with core features and community building." },
  { id: "q4-2025", title: "Q4 2025 Milestone", content: "Full platform launch with advanced trading features." },
  { id: "q1-2026", title: "Q1 2026 Milestone", content: "Expansion to new markets and additional asset classes." },
  { id: "coming-soon", title: "Coming Soon", content: "Stay tuned for exciting updates and new features." },
];

const About: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const SCROLL_COOLDOWN = 800; // kasih delay lebih panjang biar smooth
  const lastScrollTime = useRef(0);

  // Handle Wheel Scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
      lastScrollTime.current = now;

      const direction = e.deltaY > 0 ? 1 : -1; // hanya +1 / -1
      setActiveIndex((prev) =>
        Math.min(Math.max(0, prev + direction), sections.length - 1)
      );
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Handle Touch (mobile)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
      lastScrollTime.current = now;

      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1; // hanya sekali naik/turun
        setActiveIndex((prev) =>
          Math.min(Math.max(0, prev + direction), sections.length - 1)
        );
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden relative bg-black">
      <motion.div
        className="h-full w-full"
        animate={{ y: `-${activeIndex * 100}vh` }}
        transition={{
          duration: 1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {sections.map((section, index) => (
          <div key={section.id} className="h-screen flex flex-col items-center justify-center text-center px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-extrabold text-[#FF5C02] mb-6"
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                y: activeIndex === index ? 0 : 20,
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {section.title}
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-300"
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                y: activeIndex === index ? 0 : 20,
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {section.content}
            </motion.p>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const now = Date.now();
                if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
                lastScrollTime.current = now;
                setActiveIndex(i);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === activeIndex ? "bg-white w-8" : "bg-gray-600"
              }`}
              aria-label={`Go to section ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
