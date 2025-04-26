"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTutorial } from "@/lib/directus/tutorial";

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
  interface TutorialData {
    title?: string;
    step_1?: string;
    description_1?: string;
    video_url_1?: string;
    step_2?: string;
    description_2?: string;
    video_url_2?: string;
    step_3?: string;
    description_3?: string;
    video_url_3?: string;
  }

  const [tutorialData, setTutorialData] = useState<TutorialData | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTutorial();
        if (Array.isArray(result) && result.length > 0) {
          setTutorialData(result[0]);
        } else if (result && !Array.isArray(result)) {
          setTutorialData(result);
        }
      } catch (error) {
        console.error("Error fetching tutorial data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#F7FAFC] md:py-16 py-8 px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        className=""
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p
          className="text-4xl sm:text-4xl font-bold text-gray-800 font-poppins"
          variants={childVariants}
        >
          {tutorialData?.title}
        </motion.p>
      </motion.div>

      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-xl font-semibold text-gray-800 font-poppins" // Increased from lg to xl
            variants={childVariants}
          >
            {tutorialData?.step_1}
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 font-medium pb-3 font-poppins" // Increased from base to lg
            variants={childVariants}
          >
            {tutorialData?.description_1}
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src={tutorialData?.video_url_1}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-xl font-semibold text-gray-800 font-poppins" // Increased from lg to xl
            variants={childVariants}
          >
            {tutorialData?.step_2}
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 font-medium pb-3 font-poppins" // Increased from base to lg
            variants={childVariants}
          >
            {tutorialData?.description_2}
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src={tutorialData?.video_url_2}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 flex flex-col"
        >
          <motion.p
            className="text-xl font-semibold text-gray-800 font-poppins" // Increased from lg to xl
            variants={childVariants}
          >
            {tutorialData?.step_3}
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 font-medium pb-3 font-poppins" // Increased from base to lg
            variants={childVariants}
          >
            {tutorialData?.description_3}
          </motion.p>
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden"
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              src={tutorialData?.video_url_3}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </motion.div>
        </motion.div>
      </motion.div>

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