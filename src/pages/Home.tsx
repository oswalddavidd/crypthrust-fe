import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-light">
            Welcome to <span className="text-primary">Crypthrust</span>
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The Most All In One Powerful Web3 Growth Engine
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link 
              to="/about" 
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Learn More
            </Link>
            <Link 
              to="/wallet" 
              className="px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors"
            >
              Connect Wallet
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              title: 'Secure',
              description: 'Enterprise-grade security protocols to keep your assets safe',
              icon: '🔒',
            },
            {
              title: 'Fast',
              description: 'Lightning-fast transactions with minimal fees',
              icon: '⚡',
            },
            {
              title: 'Decentralized',
              description: 'True ownership with non-custodial solutions',
              icon: '🌐',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-text-light">{feature.title}</h3>
              <p className="text-text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
