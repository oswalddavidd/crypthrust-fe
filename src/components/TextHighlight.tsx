import React, { useEffect, useRef, useState, useCallback, WheelEvent as ReactWheelEvent, TouchEvent as ReactTouchEvent } from 'react';

export interface TextHighlightProps {
  text: string;
  className?: string;
  id?: string;
  active?: boolean;
  onScroll?: (direction: 'up' | 'down') => void; // Callback when highlight reaches 0% or 100% and needs to scroll
  onHighlightUpdate?: (progress: number, isAtBoundary: boolean) => void; // Callback when highlight updates
  sectionIndex?: number;
  currentSection?: number;
  isScrolling?: boolean; // Whether the parent is currently scrolling
}

type HighlightState = 'HIGHLIGHTING' | 'AT_TOP' | 'AT_BOTTOM';

const TextHighlight: React.FC<TextHighlightProps> = ({ 
  text, 
  className = '', 
  id, 
  active = false,
  onScroll,
  onHighlightUpdate,
  isScrolling = false,
  sectionIndex = 0,
  currentSection = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightProgress, setHighlightProgress] = useState(0);
  const [highlightState, setHighlightState] = useState<HighlightState>('AT_TOP');
  const words = text.split(' ');
  const totalWords = words.length;
  const lastScrollTime = useRef(0);
  const isScrollingRef = useRef(false);
  const isInitialMount = useRef(true);
  const hasScrolledSinceBoundary = useRef(false);

  // Reset state when section becomes active
  useEffect(() => {
    if (active) {
      setHighlightProgress(0);
      setHighlightState('AT_TOP');
      hasScrolledSinceBoundary.current = false;
    }
  }, [active]);
  
  // Notify parent when highlight updates
  useEffect(() => {
    const isAtBoundary = highlightProgress <= 0 || highlightProgress >= 1;
    onHighlightUpdate?.(highlightProgress, isAtBoundary);
  }, [highlightProgress, onHighlightUpdate]);
  
  // Reset on first mount if active changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (active) {
      setHighlightProgress(0.2);
    }
  }, [active]);

  const wheelTimeout = useRef<NodeJS.Timeout>();
  const wheelDelta = useRef(0);
  const isAboutSection = useRef(false);
  const isAtBoundary = useRef({ top: false, bottom: false });
  
  // Update the about section status when active 
  useEffect(() => {
    if (active) {
      const section = containerRef.current?.closest('section');
      isAboutSection.current = section?.id === 'about-section';
    }
  }, [active]);
  
  const updateHighlight = useCallback((direction: 'up' | 'down') => {
    const step = 0.1; // Adjust this value to control scroll sensitivity
    setHighlightProgress(prevProgress => {
      let newProgress = direction === 'down' 
        ? Math.min(prevProgress + step, 1) 
        : Math.max(prevProgress - step, 0);

      // Update highlight state based on progress
      if (newProgress <= 0) {
        setHighlightState('AT_TOP');
        hasScrolledSinceBoundary.current = false;
      } else if (newProgress >= 1) {
        setHighlightState('AT_BOTTOM');
        hasScrolledSinceBoundary.current = false;
      } else {
        setHighlightState('HIGHLIGHTING');
      }

      return newProgress;
    });
  }, []);

  const handleWheel = useCallback((e: ReactWheelEvent) => {
    if (!active || isScrolling) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < 100) return; // Throttle
    lastScrollTime.current = now;

    const delta = e.deltaY;
    const direction = delta > 0 ? 'down' : 'up';

    // If we're at a boundary and this is the first scroll, just update the state
    if ((highlightState === 'AT_TOP' || highlightState === 'AT_BOTTOM') && !hasScrolledSinceBoundary.current) {
      hasScrolledSinceBoundary.current = true;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // If we're at a boundary and have already scrolled once, let the parent handle it
    if ((highlightState === 'AT_TOP' && direction === 'up') || 
        (highlightState === 'AT_BOTTOM' && direction === 'down')) {
      if (onScroll) {
        onScroll(direction);
      }
      return;
    }

    // Otherwise, handle the highlight progress
    setHighlightProgress(prev => {
      const step = 0.2;
      let newProgress = prev;

      if (direction === 'down') {
        newProgress = Math.min(1, prev + step);
      } else if (direction === 'up') {
        newProgress = Math.max(0, prev - step);
      }

      // Update state based on progress
      if (newProgress === 0) {
        setHighlightState('AT_TOP');
        hasScrolledSinceBoundary.current = false;
      } else if (newProgress === 1) {
        setHighlightState('AT_BOTTOM');
        hasScrolledSinceBoundary.current = false;
      } else {
        setHighlightState('HIGHLIGHTING');
      }

      // Notify parent of progress update
      if (onHighlightUpdate) {
        onHighlightUpdate(newProgress, newProgress === 0 || newProgress === 1);
      }

      return newProgress;
    });

    // Prevent default to stop the page from scrolling
    e.preventDefault();
    e.stopPropagation();
    
    // Update highlight
    updateHighlight(direction);
    
    lastScrollTime.current = now;
  }, [active, isScrolling, updateHighlight, onScroll]);

  // Handle touch events for mobile
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const handleTouchStart = (e: TouchEvent | ReactTouchEvent) => {
    if (!active) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isScrollingRef.current = true;
  };

  const handleTouchMove = (e: TouchEvent | ReactTouchEvent) => {
    if (!active || !isScrollingRef.current) return;
    
    if (e.touches.length === 0) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY.current !== null ? touchStartY.current - touchY : 0;
    const timeDelta = touchStartTime.current !== null ? Date.now() - touchStartTime.current : 0;
    
    // Only process if it's a significant vertical swipe
    if (Math.abs(deltaY) < 10) return;
    
    // If we're already at 100%, allow default scroll behavior
    if (highlightProgress >= 1) {
      isScrollingRef.current = false;
      return;
    }
    
    // Prevent default to stop page scrolling while highlighting
    e.preventDefault();
    
    // Update highlight progress
    setHighlightProgress(prev => {
      // If we're already at 100%, don't go over
      if (prev >= 1) return 1;
      
      // Calculate progress based on touch distance and time
      const progressIncrement = Math.min(0.2, Math.abs(deltaY) / 100);
      return Math.min(1, prev + progressIncrement);
    });
    
    // Update touch start position for the next move
    touchStartY.current = touchY;
    touchStartTime.current = Date.now();
  };

  // Handle custom update event from FullPageScroll
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleUpdateHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setHighlightProgress(customEvent.detail);
    };
    
    containerRef.current.addEventListener('updateHighlight', handleUpdateHighlight as EventListener);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('updateHighlight', handleUpdateHighlight as EventListener);
      }
    };
  }, []);
  
  // Update data attribute when progress changes
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.dataset.progress = highlightProgress.toString();
  }, [highlightProgress]);
  
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Reset to 20% when becoming active
    setHighlightProgress(0.2);
    
    // Add event listeners
    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e as unknown as ReactWheelEvent);
    };
    
    container.addEventListener('wheel', wheelHandler, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    const touchEndHandler = () => {
      isScrollingRef.current = false;
    };
    container.addEventListener('touchend', touchEndHandler);
    
    return () => {
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', touchEndHandler);
      clearTimeout(wheelTimeout.current);
    };
  }, [active]);

  // Calculate how many words should be highlighted
  const highlightedWordCount = Math.ceil(totalWords * highlightProgress);

  return (
    <div 
      ref={containerRef}
      id={id}
      className={`${className} leading-relaxed`}
    >
      {words.map((word, index) => (
        <span 
          key={index} 
          className={`transition-colors duration-300 ${
            index < highlightedWordCount ? 'text-white' : 'text-gray-500'
          }`}
        >
          {word}{' '}
        </span>
      ))}
    </div>
  );
};

export default TextHighlight;
