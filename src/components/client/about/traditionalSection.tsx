"use client";

import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
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
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function MaximaVsTraditionalSection() {
  return (
    <div className="bg-[#F4F8FB] py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Logo Maxima"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 z-0 top-20">
        <Image
          src={IMAGES.BgFooter2}
          alt="Logo Maxima"
          width={900}
          height={300}
          priority
        />
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Row gutter={[32, 48]}>
          {/* Traditional I.B */}
          <Col xs={24} lg={12}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <motion.h3
                className="text-2xl sm:text-3xl font-bold text-[#001737] mb-4 font-poppins"
                variants={childVariants}
              >
                TRADITIONAL I.B
              </motion.h3>
              <motion.p
                className="text-[#6B7280] mb-6 text-lg font-poppins font-medium"
                variants={childVariants}
              >
                Problems of Traditional Independent Broker Houses
              </motion.p>
              <ul className="space-y-6 text-[#6B7280] list-none ml-0 pb-12">
                {[
                  {
                    title: "Income Solely Dependent on Trading Volume",
                    desc: "Traditional brokers earn only from client trading activities, making income highly variable.",
                  },
                  {
                    title: "Clients Lack Long-Term Profitability",
                    desc: "Most brokers cannot ensure client profitability, leading to dissatisfaction and loss of trust.",
                  },
                  {
                    title: "High Churn Rates",
                    desc: "Clients often leave due to losses, forcing brokers to constantly acquire new customers to maintain income.",
                  },
                  {
                    title: "Unsustainable Business Model",
                    desc: "Constantly finding new clients increases costs, while the lack of recurring revenue makes income unpredictable.",
                  },
                  {
                    title: "Unstable Income",
                    desc: "Without a system to retain clients, income remains inconsistent and dependent on external factors.",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={childVariants}
                    className="motion-item"
                  >
                    <div className="flex items-baseline mb-2">
                      <span className="text-[#3B82F6] mr-3 text-lg">•</span>
                      <span className="font-semibold text-lg text-[#001737] font-poppins">
                        {item.title}
                      </span>
                    </div>
                    <ul className="ml-8 mt-2 list-none">
                      <li className="flex items-baseline">
                        <span className="text-[#3B82F6] mr-3">•</span>
                        <span className="text-[#6B7280] font-poppins">
                          {item.desc}
                        </span>
                      </li>
                    </ul>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Maxima I.B */}
          <Col xs={24} lg={12}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <motion.h3
                className="text-2xl sm:text-3xl font-bold text-[#001737] mb-4 font-poppins"
                variants={childVariants}
              >
                MAXIMA I.B
              </motion.h3>
              <motion.p
                className="text-[#6B7280] mb-6 text-lg font-poppins font-medium"
                variants={childVariants}
              >
                Revolutionizing Introducer Broker Concept
              </motion.p>
              <ul className="space-y-6 text-[#6B7280] list-none ml-0">
                {[
                  {
                    title: "Stable, Lifetime Commissions",
                    desc: "Maxima's innovative system ensures IBs earn lifetime commissions as traders stay profitable and loyal.",
                  },
                  {
                    title: "Lower Client Churn Rate",
                    desc: "The hedging trading model keeps clients profitable, reducing the need to chase new clients constantly.",
                  },
                  {
                    title: "Profitable Clients = Profitable IBs",
                    desc: "Maxima ensures traders earn consistent profits, building trust and long-term relationships between IBs and their networks.",
                  },
                  {
                    title: "Sustainable Income",
                    desc: "With Maxima's unique revenue-sharing model, IBs enjoy steady, predictable income, even during market fluctuations.",
                  },
                  {
                    title: "Comprehensive Support System",
                    desc: "Training resources, tools, and community guidance provided by Maxima empower IBs to grow and maintain their networks efficiently.",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={childVariants}
                    className="motion-item"
                  >
                    <div className="flex items-baseline mb-2">
                      <span className="text-[#3B82F6] mr-3 text-lg">•</span>
                      <span className="font-semibold text-lg text-[#001737] font-poppins">
                        {item.title}
                      </span>
                    </div>
                    <ul className="ml-8 mt-2 list-none">
                      <li className="flex items-baseline">
                        <span className="text-[#3B82F6] mr-3">•</span>
                        <span className="text-[#6B7280] font-poppins">
                          {item.desc}
                        </span>
                      </li>
                    </ul>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Global styles for Poppins font */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
        .font-poppins {
          font-family: "Poppins", Arial, Helvetica, sans-serif;
        }
      `}</style>
    </div>
  );
}