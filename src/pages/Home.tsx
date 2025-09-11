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
              <span className="font-normal">The Most</span> <span className="text-primary font-bold">All in One</span> <span className="font-normal">Powerful <span className="bg-clip-text text-transparent bg-gradient-to-t from-primary via-primary/60 via-30% to-text-light to-60%">Web3 Growth Engine</span></span>
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
                Contact Us
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
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-normal text-center mb-12 
text-transparent bg-clip-text bg-gradient-to-r from-primary from-1% to-white to-100%"
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
                title: 'Growth Hacking',
                description: 'Accelerate business growth with innovative strategies for rapid results.',
                icon: '📈',
              },
              {
                title: 'KOL Marketing',
                description: 'Utilize KOLs to amplify your brand\'s message and influence in the industry.',
                icon: '👥',
              },
              {
                title: 'Media Outreach & Publications',
                description: 'Boost your brand with targeted outreach and key industry publications.',
                icon: '📰',
              },
              {
                title: 'Listing Services',
                description: 'Provide listing in major tier 1 & tier 2 global exchanges or local Indonesian exchanges.',
                icon: '📊',
              },
              {
                title: 'Community Building',
                description: 'Build a vibrant brand community with effective engagement.',
                icon: '🌐',
              },
              {
                title: 'OTC Services',
                description: 'Access secure and efficient over-the-counter trading solutions.',
                icon: '💱',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-4 text-primary">{feature.icon}</div>
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
