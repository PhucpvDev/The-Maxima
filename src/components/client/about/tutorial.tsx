"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants for containers
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, 0.01, 0.05, 0.95],
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
};

// Animation variants for child elements
const childVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 120,
      damping: 18,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// Animation variants for cards (includes hover)
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const Tutorial: React.FC = () => {
  return (
    <div className="bg-[#F7FAFC] md:py-16 py-8 px-4 sm:px-6 lg:px-8 text-center">
      {/* Header */}
      <motion.div
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-[#001737] font-poppins"
          variants={childVariants}
        >
          TUTORIAL
        </motion.h2>
      </motion.div>

      {/* Card Grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Step 1 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-lg font-semibold text-[#001737] font-poppins"
            variants={childVariants}
          >
            STEP 1
          </motion.p>
          <motion.p
            className="text-base text-[#6B7280] font-medium pb-3 font-poppins"
            variants={childVariants}
          >
            Register & Download
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src="https://www.youtube.com/embed/29oOROTFF4o?si=XBPqFN88iDLBuIZ5"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-lg font-semibold text-[#001737] font-poppins"
            variants={childVariants}
          >
            STEP 2
          </motion.p>
          <motion.p
            className="text-base text-[#6B7280] font-medium pb-3 font-poppins"
            variants={childVariants}
          >
            Deposit USDT
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src="https://www.youtube.com/embed/2v0vxLcpICE?si=i-18Y9nNeg9hvHh8"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-lg font-semibold text-[#001737] font-poppins"
            variants={childVariants}
          >
            STEP 3
          </motion.p>
          <motion.p
            className="text-base text-[#6B7280] font-medium pb-3 font-poppins"
            variants={childVariants}
          >
            Set Up & Start Trade
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src="https://www.youtube.com/embed/m77ktn2aE0U?si=LK1DMeGJPDWUpxqE"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Global styles for Poppins font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Tutorial;