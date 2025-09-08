import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StarProps {
  id: number;
  size: number;
  left: string;
  top: string;
  opacity: number;
  delay: number;
  duration: number;
  speed: number;
  direction: number;
  mouseX: number;
  mouseY: number;
}

const Star: React.FC<StarProps> = ({ 
  id, size, left, top, opacity, delay, duration, speed, direction, mouseX, mouseY 
}) => {
  return (
    <motion.div
      key={id}
      className="absolute rounded-full bg-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        opacity,
        x: mouseX * speed * 0.2,
        y: mouseY * speed * 0.2,
      }}
      animate={{
        opacity: [
          opacity, 
          opacity * (1.2 + Math.random() * 0.5), 
          opacity
        ],
        x: [
          0, 
          Math.random() * 20 * direction - 10, 
          0
        ],
        y: [
          0, 
          Math.random() * 20 * direction - 10, 
          0
        ]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: 'easeInOut',
      }}
    />
  );
};

const StarryBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random stars with varying sizes, positions, and movement speeds
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: Math.random() * 1.5 + 0.5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      speed: Math.random() * 0.5 + 0.5,
      direction: Math.random() > 0.5 ? 1 : -1
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <Star
          key={star.id}
          {...star}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
