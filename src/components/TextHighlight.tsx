import React, { useEffect, useRef, useState } from 'react';

interface TextHighlightProps {
  text: string;
  className?: string;
  id?: string;
}

const TextHighlight: React.FC<TextHighlightProps> = ({ text, className = '', id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightProgress, setHighlightProgress] = useState(0);
  const words = text.split(' ');
  const totalWords = words.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress within the section (0 to 1)
      let progress = 0;
      if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
        // Calculate how much of the section is visible
        const visibleHeight = Math.min(viewportHeight - sectionTop, sectionHeight);
        progress = visibleHeight / viewportHeight;
      }
      
      setHighlightProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
