import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  variant?: 'sanctuary' | 'neon' | 'standard';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  pageKey,
  variant = 'standard',
}) => {
  const isNeon = variant === 'neon';

  return (
    <motion.div
      key={pageKey}
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.98,
        filter: 'blur(4px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        y: -14,
        scale: 0.985,
        filter: 'blur(3px)',
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1], // Custom smooth cubic bezier
      }}
      className="w-full flex-1 flex flex-col relative overflow-hidden"
    >
      {/* Cool ambient energy flash wave during transition */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0.8 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`absolute top-0 left-0 right-0 h-1 z-50 origin-left pointer-events-none ${
          isNeon
            ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
            : 'bg-gradient-to-r from-[#b7f397] via-[#386a20] to-[#2e7d32] shadow-[0_0_12px_rgba(46,125,50,0.4)]'
        }`}
      />

      {/* Subtle radial ambient bloom on screen entrance */}
      <motion.div
        initial={{ opacity: 0.35, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`absolute top-8 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isNeon ? 'bg-cyan-400/20' : 'bg-emerald-400/15'
        }`}
      />

      {children}
    </motion.div>
  );
};
