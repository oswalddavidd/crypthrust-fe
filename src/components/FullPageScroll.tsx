import React, { 
  ReactNode, 
  useEffect, 
  useRef, 
  useState, 
  useCallback, 
  useMemo, 
  ReactElement, 
  ReactNodeArray, 
  cloneElement,
  useLayoutEffect,
  isValidElement,
  Children,
  KeyboardEvent as ReactKeyboardEvent,
  WheelEvent as ReactWheelEvent,
  TouchEvent as ReactTouchEvent
} from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import TextHighlight from './TextHighlight';
import type { TextHighlightProps } from './TextHighlight';

interface FullPageScrollProps {
  children: ReactNodeArray;
}

const FullPageScroll: React.FC<FullPageScrollProps> = ({ children }) => {
  // Memoize children count to prevent unnecessary re-renders
  const childrenCount = useMemo(() => Children.count(children), [children]);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSection = useRef(0);
  const touchStartY = useRef(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [activeHighlightProgress, setActiveHighlightProgress] = useState(1);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelDelta = useRef(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update window height on resize
  const updateHeight = useCallback(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [updateHeight]);

  // Track if we're currently in a highlight section
  const isInHighlightSection = useCallback(() => {
    const sections = containerRef.current?.children;
    if (!sections) return false;
    const currentSectionEl = sections[currentSection.current];
    return currentSectionEl?.id === 'about-section';
  }, []);

  // Handle highlight updates from TextHighlight
  const handleHighlightUpdate = useCallback((progress: number, isAtBoundary: boolean) => {
    setActiveHighlightProgress(progress);
    
    // If we're at a boundary, we can allow section navigation on the next scroll
    if (isAtBoundary) {
      // Small delay to ensure the next scroll is a new event
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    }
  }, []);

  const scrollToSection = useCallback((targetIndex: number, force = false): boolean => {
    if (!containerRef.current || isScrollingRef.current) return false;
    
    const sections = containerRef.current.children;
    if (targetIndex < 0 || targetIndex >= sections.length) return false;
    
    // If we're trying to scroll away from the about section
    if (targetIndex !== currentSection.current) {
      const currentSectionEl = sections[currentSection.current];
      
      // If current section is the about section and text isn't fully highlighted
      if (currentSectionEl?.id === 'about-section' && activeHighlightProgress < 0.99 && !force) {
        return false;
      }
    }
    
    isScrollingRef.current = true;
    currentSection.current = targetIndex;
    
    // Update URL hash
    const section = sections[targetIndex] as HTMLElement;
    const sectionId = section.id || `section-${targetIndex}`;
    window.history.pushState({}, '', `#${sectionId}`);
    
    // Scroll to section
    containerRef.current.scrollTo({
      top: windowHeight * targetIndex,
      behavior: 'smooth',
    });
    
    // Reset scrolling flag after animation
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
    
    return true;
  }, [windowHeight, activeHighlightProgress]);

  const handleWheel = useCallback((e: WheelEvent | ReactWheelEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    
    const currentSectionEl = containerRef.current?.children[currentSection.current];
    const isAboutSection = currentSectionEl?.id === 'about-section';
    
    // If we're in the about section, let TextHighlight handle the scroll
    if (isAboutSection) {
      return;
    }
    
    // For trackpad, accumulate deltaY until it reaches a threshold
    wheelDelta.current += Math.abs(e.deltaY);
    
    // Clear any existing timeout
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }
    
    // Set a new timeout
    wheelTimeout.current = setTimeout(() => {
      // Only proceed if we've scrolled enough
      if (wheelDelta.current > 5) {
        const delta = Math.sign(e.deltaY);
        const newIndex = Math.min(
          Math.max(0, currentSection.current + delta),
          React.Children.count(children) - 1
        );
        
        if (newIndex !== currentSection.current) {
          e.preventDefault();
          scrollToSection(newIndex, true);
        }
      }
      wheelDelta.current = 0;
    }, 50);
  }, [children, scrollToSection, activeHighlightProgress]);

  const handleKeyDown = useCallback((e: KeyboardEvent | ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey) ? 1 : -1;
      scrollToSection(currentSection.current + direction);
    }
  }, [scrollToSection]);

  const handleTouchStart = useCallback((e: TouchEvent | ReactTouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent | ReactTouchEvent<HTMLDivElement>) => {
    preventPullToRefresh(e);
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent | ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartY.current) return;

    const touchEndY = 'changedTouches' in e ? e.changedTouches[0].clientY : 0;
    const diff = touchStartY.current - touchEndY;
    const direction = diff > 0 ? 1 : -1;
    
    const newSection = Math.min(
      Math.max(0, currentSection.current + direction),
      React.Children.count(children) - 1
    );
    
    if (newSection !== currentSection.current) {
      scrollToSection(newSection, true);
    }
    
    touchStartY.current = 0;
  }, [children, scrollToSection]);

  const preventPullToRefresh = useCallback((e: TouchEvent | ReactTouchEvent<HTMLDivElement>) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      e.preventDefault();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
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
    };
  }, [handleWheel, windowHeight, handleKeyDown, handleTouchStart, handleTouchEnd]);

  // Clone children and pass necessary props to TextHighlight components
  const childrenWithProps = useMemo(() => 
    Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;
      
      const isAboutSection = child.props.id === 'about-section';
      
      // If this is the about section, enhance it with TextHighlight props
      if (isAboutSection) {
        const enhancedProps: Record<string, any> = {
          key: child.key || index,
          onHighlightUpdate: handleHighlightUpdate,
          onScroll: (direction: 'up' | 'down') => {
            const newIndex = direction === 'down' 
              ? Math.min(currentSection.current + 1, childrenCount - 1)
              : Math.max(0, currentSection.current - 1);
            scrollToSection(newIndex, true);
          }
        };
        
        // Only add isScrolling if it's a TextHighlight component
        if (child.type === TextHighlight) {
          enhancedProps.isScrolling = isScrollingRef.current;
        }
        
        return cloneElement(child, enhancedProps);
      }
      
      // For other sections, just pass the basic props if they're TextHighlight components
      if (isValidElement<TextHighlightProps>(child) && child.type === TextHighlight) {
        return cloneElement(child, {
          key: child.key || index,
          sectionIndex: index,
          currentSection: currentSection.current,
          isScrolling: isScrollingRef.current
        } as Partial<TextHighlightProps>);
      }
      
      return child;
    }),
    [children, childrenCount, currentSection, handleHighlightUpdate, scrollToSection]
  );

  return (
    <div
      ref={containerRef}
      className="snap-y snap-mandatory h-screen overflow-y-auto"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
      onWheel={handleWheel as unknown as React.WheelEventHandler<HTMLDivElement>}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {childrenWithProps}
    </div>
  );
};

export default FullPageScroll;
