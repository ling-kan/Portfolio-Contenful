import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../loader';

const RevealPreloader = ({ isLoading = true, progress = 0, children }) => {
  const [isComplete, setIsComplete] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setIsComplete(true);
    }
  }, [isLoading]);

  const revealVariants = {
    hidden: {
      clipPath: 'inset(0 50% 0 50%)',
      opacity: 0,
    },
    visible: {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
    exit: {
      clipPath: 'inset(0 50% 0 50%)',
      opacity: 0,
      transition: {
        duration: 0.9,
        ease: 'easeInOut',
      },
    },
  };

  const progressBarVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: progress / 100,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  return (
    <>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-col items-center justify-center gap-8 w-full px-6">
          
        <Loader/>

            {/* Progress Text */}
            <motion.p
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-widest"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default RevealPreloader;
