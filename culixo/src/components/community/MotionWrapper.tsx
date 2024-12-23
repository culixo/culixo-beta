// src/components/community/MotionWrapper.tsx
"use client"

import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function MotionWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container max-w-6xl py-6 lg:py-8"
    >
      {children}
    </motion.div>
  );
}