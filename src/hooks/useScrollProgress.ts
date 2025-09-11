import { useEffect, useState } from 'react';

export const useScrollProgress = (sectionId: string) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSections, setTotalSections] = useState(5); // Number of scroll steps
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate if section is in view
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
        setIsActive(true);
        
        // Calculate scroll progress within the section
        const scrollProgress = Math.min(1, Math.max(0, (viewportHeight - sectionTop) / viewportHeight));
        
        // Calculate which section we're in (0 to totalSections-1)
        const newSection = Math.min(
          totalSections - 1,
          Math.floor(scrollProgress * totalSections)
        );
        
        setCurrentSection(newSection);
        
        // Calculate progress for the current section (0 to 1)
        const sectionProgress = (scrollProgress * totalSections) % 1;
        setProgress(sectionProgress);
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = `${(newSection / (totalSections - 1)) * 100}%`;
        }
      } else {
        setIsActive(false);
      }
    };

    // Add scroll and resize listeners
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    
    // Initial update
    updateProgress();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [sectionId, totalSections]);

  return { progress, isActive, currentSection, totalSections };
};
