import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Brain, Users, Rocket, Award, Clock, Globe } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Home() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Grades 1-12',
      description: 'Comprehensive curriculum covering all school grades with expert-designed content'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Interactive Lessons',
      description: 'Engaging multimedia content with interactive exercises and real-world examples'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Smart Exams',
      description: 'Adaptive testing system that adjusts to your learning pace and knowledge level'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Learning',
      description: 'Connect with peers and teachers in a collaborative learning environment'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Personalized Path',
      description: 'Custom learning paths adapted to your unique educational needs'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Earn badges and certificates as you progress through your studies'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Study Tracking',
      description: 'Monitor your progress and study time with detailed analytics'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Bilingual Support',
      description: 'Full support for both Arabic and English languages'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('eduPlatform')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Embark on a transformative educational journey with our innovative learning platform
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {t('login')}
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium border-2 border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700"
              >
                {t('signup')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <div className="bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of students already learning on our platform
            </p>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
