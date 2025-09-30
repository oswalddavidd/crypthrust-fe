import React, { useEffect } from 'react';
import StarryBackground from '../components/StarryBackground';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Array of different card height classes
const cardHeights = [
  'min-h-[280px]', 'min-h-[320px]', 'min-h-[300px]', 
  'min-h-[340px]', 'min-h-[280px]', 'min-h-[300px]'
];

// Array of different card width classes for larger screens
const cardWidths = [
  'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-1',
  'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-1'
];

const ServiceCard: React.FC<{ children: React.ReactNode, index: number }> = ({ children, index }) => {
  const heightClass = cardHeights[index % cardHeights.length];
  const widthClass = cardWidths[index % cardWidths.length];
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.1 }
      });
    }
  }, [controls, inView, index]);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      className={`${heightClass} ${widthClass} flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-xl 
      transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 
      group relative overflow-hidden`}
    >
      {/* Highlight bar that appears on hover */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-primary transition-all duration-300 group-hover:h-full"></div>
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

const services = [
  {
    title: 'Growth Marketing',
    description: 'A growth hacking strategy designed to boost users, engagement, and adoption through multi-platform campaigns.',
    icon: '📊'
  },
  {
    title: 'PR Service',
    description: 'Managed by our seasoned PR team, we publish your story in top-tier crypto media to build credibility, awareness, and long-term trust.',
    icon: '💼'
  },
  {
    title: 'Listing Service (Inc. IDO/IEO, MM )',
    description: 'A full-stack listing service managed by a professional team with strong exchange relationships, covering IDO/IEO prep, market making, and technical coordination.',
    icon: '🔍'
  },
  {
    title: 'OTC (Over-The-Counter)',
    description: 'Our specialized OTC team facilitates large token transactions privately and securely, including legal guidance and custom vesting structures.',
    icon: '🛡️'
  },
  {
    title: 'Brand Building',
    description: 'Our creative and strategy team helps shape your project’s brand—from founder presence and visual identity to messaging and long-term positioning.',
    icon: '💧'
  },
  {
    title: 'Advertisements',
    description: 'Our media buying team runs targeted ad campaigns across major platforms like Google, Twitter, Facebook/Instagram, and top crypto networks. Each campaign follows a structured and data-driven approach.',
    icon: '🎯'
  }
];

const Services: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <StarryBackground />
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8 }
          }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary">Our Services</h1>
          <div className="mt-6 w-24 h-0.5 bg-primary mx-auto"></div>
        </motion.div>
        
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index}>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-3xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-gray-300 text-sm flex-grow">{service.description}</p>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10">
                <button className="text-sm font-medium text-primary hover:underline">
                  Learn more →
                </button>
              </div>
            </ServiceCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
