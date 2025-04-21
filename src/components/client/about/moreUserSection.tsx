import React from "react";
import { motion } from "framer-motion";

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

export default function BannerSection() {
  return (
    <motion.div
      className="bg-[#F0F8FF] py-16 mb-10 flex flex-col items-center justify-center text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        className="text-4xl font-bold text-[#002146] mb-4"
        variants={childVariants}
      >
        MORE THAN 800 USERS
      </motion.p>
      <motion.p
        className="text-lg text-[#335479] font-bold mb-2"
        variants={childVariants}
      >
        NO ONE LOST A SINGLE CENT
      </motion.p>
      <motion.p
        className="text-lg text-[#335479] mb-6 font-bold"
        variants={childVariants}
      >
        AVERAGE 10% ~ 20% PROFITS A MONTH
      </motion.p>
      <motion.div className="text-white" variants={childVariants}>
        <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto">
          Start Now
        </button>
      </motion.div>
    </motion.div>
  );
}
