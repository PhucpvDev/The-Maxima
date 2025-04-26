"use client";

import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import type { StepsProps } from "antd";
import { Popover } from "antd";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import { getHowItWorks, HowItWorksData } from "@/lib/directus/how_it_works";

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

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const customDot: StepsProps["progressDot"] = (dot, { title, index }) => (
  <Popover
    content={
      <span className="font-poppins text-lg text-gray-700">
        Step {index + 1}: {title}
      </span>
    }
  >
    {dot}
  </Popover>
);

const HowItWorks: React.FC = () => {
  const [data, setData] = useState<HowItWorksData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHowItWorks();
        const fetchedData: HowItWorksData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu How It Works:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center py-12 text-xl font-poppins text-gray-700">Đang tải...</div>;
  }

  const { title, subtitle, steps, conclusion } = data;

  return (
    <div className="bg-gradient-to-b from-[#F7FAFC] to-[#E5E7EB] md:py-20 py-12 px-6 text-center font-poppins">
      <motion.div
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-gray-900"
          variants={childVariants}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-2xl md:text-3xl font-semibold text-gray-700 mt-6 italic"
          variants={childVariants}
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto mt-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Steps
          progressDot={customDot}
          current={-1}
          direction="horizontal"
          responsive
          className="[&_.ant-steps-item-title]:font-bold [&_.ant-steps-item-title]:text-lg [&_.ant-steps-item-title]:text-gray-900 [&_.ant-steps-item-title]:font-poppins [&_.ant-steps-item-description]:text-base [&_.ant-steps-item-description]:text-gray-600 [&_.ant-steps-item-description]:whitespace-pre-line [&_.ant-steps-item-description]:font-poppins"
          items={steps.map((step, index) => ({
            title: (
              <motion.div
                key={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-gray-800 font-poppins text-lg"
              >
                {step.title}
              </motion.div>
            ),
            description: (
              <motion.div
                key={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-gray-500 font-poppins text-base"
              >
                {step.description}
              </motion.div>
            ),
          }))}
        />
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto mb-16 mt-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="border-3 border-gray-600 bg-white rounded-xl py-8 shadow-xl"
          variants={childVariants}
        >
          {conclusion.split("\n\n").map((line, index) => (
            <p
              key={index}
              className="text-xl font-bold text-gray-900 uppercase font-poppins mt-4 first:mt-0"
            >
              {line}
            </p>
          ))}
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
        .ant-steps .ant-steps-item-icon .ant-steps-icon {
          background: #1E40AF !important;
          color: #ffffff !important;
          font-size: 18px !important;
        }
        .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
          border-color: #1E40AF !important;
        }
        .ant-steps .ant-steps-item-process .ant-steps-item-icon {
          border-color: #1E40AF !important;
        }
        .ant-steps .ant-steps-item-tail::after {
          background: #1E40AF !important;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;