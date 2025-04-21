"use client";

import React from "react";
import { Steps } from "antd";
import type { StepsProps } from "antd";
import { Popover } from "antd";
import { motion } from "framer-motion";
import "antd/dist/reset.css";

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

// Animation variants for individual steps
const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const customDot: StepsProps["progressDot"] = (dot, { title, index }) => (
  <Popover
    content={
      <span className="font-poppins text-[#6B7280]">
        Step {index + 1}: {title}
      </span>
    }
  >
    {dot}
  </Popover>
);

const steps = [
  {
    title: "DEPOSIT USDT",
    description: "Deposit 10,000 USDT into MAXIMA wallet",
  },
  {
    title: "SPLIT CAPITAL",
    description:
      "Deposit your fund into FX 2.0. 50% into Account A & 50% into Account B",
  },
  {
    title: "START TRADE",
    description:
      "Choose 0.35 lot size. Choose Buy / Sell on XAUUSD. Auto pay 400 USDT subscription fees",
  },
  {
    title: "WIN IN A",
    description:
      "Account A 0.40 lot = $240, Account B 0.35 lot = $222++\nWin A deduction = -$8.7\nTotal Win = $6+-",
  },
  {
    title: "WIN IN B",
    description:
      "Account B 0.35 lot = $260+-, Account A 0.40 lot = $300\nSubsidy = +22% from A loss = $18+-",
  },
  {
    title: "SYSTEM AUTOMATED",
    description:
      "Account B - TP75 & SL60 pips\nAccount A - TP60 & SL75 pips\nHedging Trade Strategy",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-[#F7FAFC] md:py-16 py-10 px-4 text-center">
      {/* Header Section */}
      <motion.div
        className="mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-4xl font-bold text-[#001737] font-poppins"
          variants={childVariants}
        >
          HOW IT WORKS?
        </motion.h2>
        <motion.p
          className="text-2xl text-[#001737] font-semibold font-poppins pt-5"
          variants={childVariants}
        >
          Trade Smarter, Not Harder
        </motion.p>
      </motion.div>

      {/* Steps Section */}
      <motion.div
        className="max-w-7xl mx-auto mt-16"
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
          className="[&_.ant-steps-item-title]:font-bold [&_.ant-steps-item-title]:text-sm [&_.ant-steps-item-title]:text-[#001737] [&_.ant-steps-item-title]:font-poppins [&_.ant-steps-item-description]:text-xs [&_.ant-steps-item-description]:text-[#6B7280] [&_.ant-steps-item-description]:whitespace-pre-line [&_.ant-steps-item-description]:font-poppins"
          items={steps.map((step, index) => ({
            title: (
              <motion.div
                key={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
              >
                {step.description}
              </motion.div>
            ),
          }))}
        />
      </motion.div>

      {/* Bottom Text Section */}
      <motion.div
        className="max-w-7xl mx-auto mb-12 mt-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="border-2 border-[#3B82F6] rounded-lg py-4"
          variants={childVariants}
        >
          <p className="text-base font-bold text-[#001737] uppercase font-poppins">
            Regardless of how the market moves, you earn profits!
          </p>
          <p className="text-base font-bold text-[#001737] uppercase mt-2 font-poppins">
            The world's 1st unique quantitative hedging trading model
          </p>
        </motion.div>
      </motion.div>

      {/* Global styles for Poppins font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
        .ant-steps .ant-steps-item-icon .ant-steps-icon {
          background: #3b82f6 !important;
          color: #ffffff !important;
        }
        .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
          border-color: #3b82f6 !important;
        }
        .ant-steps .ant-steps-item-process .ant-steps-item-icon {
          border-color: #3b82f6 !important;
        }
        .ant-steps .ant-steps-item-tail::after {
          background: #3b82f6 !important;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;