import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Partners from '../components/Partners';
import StarryBackground from '../components/StarryBackground';

const Home: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 text-center overflow-hidden">
        <StarryBackground />
        <div className="max-w-4xl mx-auto">
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
              <span className="font-normal">The Most</span> <span className="text-primary font-bold">All in One</span> <span className="font-normal">Powerful Web3 Growth Engine</span>
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
                to="/wallet" 
                className="px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors"
              >
                Connect Wallet
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <Partners />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            className="text-xl font-reguler text-center mb-12 text-text-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Crypthrust?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Top Media Access',
                description: 'Direct exposure through tier 1 finance media in Indonesia',
                icon: '📰',
              },
              {
                title: 'All-in-One Platform',
                description: 'Seamlessly integrate media, wallet, and OTC in one place',
                icon: '🛠️',
              },
              {
                title: 'Trusted Network',
                description: 'Backed by leading partners, founders, and investors',
                icon: '🤝',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-text-light">{feature.title}</h3>
                <p className="text-text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default Home;
