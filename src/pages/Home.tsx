import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FullPageScroll from '../components/FullPageScroll';
import Partners from '../components/Partners';
import StarryBackground from '../components/StarryBackground';
import TextHighlight from '../components/TextHighlight';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <FullPageScroll>
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-screen px-4 text-center">
        <StarryBackground />
        <div className="max-w-4xl mx-auto w-full py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-text-light"
              variants={fadeIn}
            >
              <span className="font-normal">The Most</span>{' '}
              <span className="text-primary font-bold">All in One</span>{' '}
              <span className="font-normal">
                Powerful{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-t from-primary via-primary/60 via-30% to-text-light to-60%">
                  Web3 Growth Engine
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-lg text-text-muted mb-12 max-w-3xl mx-auto"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              Helping Web3 projects scale smarter and faster with an all-in-one hub
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/about" 
                className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Learn More
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-6xl mx-auto">
          <Partners />
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-24" id="about-section">
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <TextHighlight 
            text={`At Crypthrust, we're revolutionizing the way Web3 projects grow and scale. Our comprehensive suite of tools and services provides everything you need to succeed in the decentralized world. We combine cutting-edge technology with deep industry expertise to deliver results that matter.`}
            className="text-3xl md:text-5xl lg:text-6xl leading-tight font-light tracking-tight"
            id="about-text"
          />
        </div>
      </div>

      {/* Why Choose Crypthrust Section with Footer */}
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <motion.h2 
              className="text-3xl md:text-5xl font-normal text-center mb-12 text-text-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Crypthrust?
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Top Media Access',
                  description: 'Direct exposure through tier 1 finance media in Indonesia',
                  icon: '📰',
                },
                {
                  title: 'Comprehensive Services',
                  description: 'End-to-end solutions from strategy to execution',
                  icon: '🚀',
                },
                {
                  title: 'Expert Team',
                  description: 'Seasoned professionals with deep Web3 expertise',
                  icon: '👥',
                },
                {
                  title: 'Global Network',
                  description: 'Access to a vast network of partners and investors',
                  icon: '🌐',
                },
                {
                  title: 'Data-Driven',
                  description: 'Actionable insights powered by advanced analytics',
                  icon: '📊',
                },
                {
                  title: 'Community Focused',
                  description: 'Building and engaging with strong communities',
                  icon: '🤝',
                },
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium text-text-light mb-2">{feature.title}</h3>
                  <p className="text-text-muted">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-gray-800">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </FullPageScroll>
  );
};

export default Home;
