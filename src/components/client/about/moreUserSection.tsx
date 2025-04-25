"use client"; // Đánh dấu là Client Component

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getStatistics, StatisticsData } from "@/lib/directus/statistics";

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
  const [data, setData] = useState<StatisticsData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStatistics();
        const fetchedData: StatisticsData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Statistics:", error);
      }
    };
    fetchData();
  }, []);

  // Nếu không có dữ liệu, không hiển thị gì cả
  if (!data) {
    return null;
  }

  const { line_1, line_2, line_3, button_text } = data;

  return (
    <motion.div
      className="bg-[#F0F8FF] py-16 flex flex-col items-center justify-center text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        className="text-4xl font-bold text-gray-800 mb-4"
        variants={childVariants}
      >
        {line_1}
      </motion.p>
      <motion.p
        className="text-lg text-gray-800 font-bold mb-2"
        variants={childVariants}
      >
        {line_2}
      </motion.p>
      <motion.p
        className="text-lg text-gray-800 mb-6 font-bold"
        variants={childVariants}
      >
        {line_3}
      </motion.p>
      <motion.div className="text-white" variants={childVariants}>
        <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto">
          {button_text}
        </button>
      </motion.div>
    </motion.div>
  );
}