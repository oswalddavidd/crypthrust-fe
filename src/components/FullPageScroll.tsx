import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface FullPageScrollProps {
  children: ReactNode[];
}

const FullPageScroll: React.FC<FullPageScrollProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSection = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const touchStartY = useRef(0);
  const [windowHeight, setWindowHeight] = useState(0);

  // Update window height on resize
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const scrollToSection = (targetIndex: number) => {
    if (!containerRef.current || isScrolling.current) return;

    const maxSections = React.Children.count(children) - 1;
    const newSection = Math.max(0, Math.min(targetIndex, maxSections));

    if (newSection === currentSection.current) return;

    currentSection.current = newSection;
    isScrolling.current = true;

    containerRef.current.scrollTo({
      top: windowHeight * currentSection.current,
      behavior: 'smooth',
    });

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToSection(currentSection.current + direction);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        const direction =
          e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey) ? 1 : -1;
        scrollToSection(currentSection.current + direction);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartY.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        scrollToSection(currentSection.current + direction);
      }

      touchStartY.current = 0;
    };

    const preventPullToRefresh = (e: TouchEvent) => {
      if (container && container.scrollTop === 0) {
        e.preventDefault();
      }
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchmove', preventPullToRefresh, { passive: false });

    // Initial scroll
    container.scrollTo({
      top: windowHeight * currentSection.current,
      behavior: 'auto',
    });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', preventPullToRefresh);
      clearTimeout(scrollTimeout.current);
    };
  }, [children, windowHeight]);

  return (
    <div
      ref={containerRef}
      className="snap-y snap-mandatory h-screen overflow-y-auto"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <section 
          key={index}
          className="snap-start min-h-screen w-full relative"
        >
          {child}
        </section>
      ))}
    </div>
  );
};

export default FullPageScroll;
