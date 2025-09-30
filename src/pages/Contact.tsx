import React, { useState, useEffect } from 'react';
import StarryBackground from '../components/StarryBackground';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import rickyImage from '../assets/images/ricky.jpg';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    projectDescription: '',
    businessGoal: '',
    websiteOrSocials: '',
    name: '',
    email: '',
    phone: '',
    telegram: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      projectDescription: '',
      businessGoal: '',
      websiteOrSocials: '',
      name: '',
      email: '',
      phone: '',
      telegram: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Get EmailJS credentials from environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';
      
      console.log('EmailJS Config:', { serviceId, templateId, publicKey });
      
      // Validate that all required environment variables are set
      if (!serviceId || !templateId || !publicKey) {
        const errorMsg = 'EmailJS configuration is incomplete. Please check your environment variables.';
        console.error(errorMsg, { serviceId, templateId, publicKey });
        throw new Error(errorMsg);
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        project_description: formData.projectDescription,
        business_goal: formData.businessGoal,
        website_socials: formData.websiteOrSocials,
        phone: formData.phone,
        telegram: formData.telegram || 'Not provided',
        reply_to: formData.email,
        to_email: 'david.oswald.tob@gmail.com' // Hardcoded for testing
      };

      console.log('Sending email with params:', templateParams);
      
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('Email sent successfully:', response);
      
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully! We\'ll get back to you soon.'
      });
      resetForm();
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      
      setSubmitStatus({
        type: 'error',
        message: `Failed to send message: ${errorMessage}. Please try again later or contact us directly.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <StarryBackground />
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-16 text-center">
            <div className="group">
              <h1 className="text-5xl md:text-6xl font-bold text-primary drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(255,92,2,0.7)] transition-all duration-500">
                Contact Us
              </h1>
              <div className="mt-6 w-24 h-0.5 bg-primary/50 mx-auto transition-all duration-500 group-hover:w-32 group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(255,92,2,0.7)]"></div>
            </div>
          </div>
          
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={container}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Left Side - Contact Form */}
            <motion.div 
              variants={item}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-8">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Describe Project
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your project..."
                    value={formData.projectDescription}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="businessGoal" className="block text-sm font-medium text-gray-300 mb-2">
                    Describe Business Goal
                  </label>
                  <textarea
                    id="businessGoal"
                    name="businessGoal"
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="What are you trying to achieve?"
                    value={formData.businessGoal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="websiteOrSocials" className="block text-sm font-medium text-gray-300 mb-2">
                    Website or Socials
                  </label>
                  <input
                    type="text"
                    id="websiteOrSocials"
                    name="websiteOrSocials"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://"
                    value={formData.websiteOrSocials}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+62 "
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="telegram" className="block text-sm font-medium text-gray-300 mb-2">
                      Telegram Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">@</span>
                      </div>
                      <input
                        type="text"
                        id="telegram"
                        name="telegram"
                        className="w-full pl-8 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="username"
                        value={formData.telegram}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <motion.div 
                  className="pt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-primary to-[#FF7A33] text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  {submitStatus.type && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}
                </motion.div>
              </form>
            </motion.div>

            {/* Right Side - Profile Card */}
            <motion.div 
              variants={item}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col items-center"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 p-1 mb-6 overflow-hidden">
                <div className="w-full h-full rounded-full bg-black p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={rickyImage} 
                      alt="Ricky Crypthrust" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOCAxLjk5IDAgNS45NyAxLjA5IDYgMy4wOC0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPjwvc3ZnPg==';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Ricky Crypthrust</h3>
              <p className="text-gray-300 mb-6">Head of BD</p>
              
              <div className="w-full max-w-xs bg-black/30 border border-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Telegram</p>
                    <a 
                      href="https://t.me/rickycrypthrust" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-primary transition-colors"
                    >
                      @rickycrypthrust
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Average response time:</p>
                  <p className="text-white font-medium">Less than 1 hour</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
