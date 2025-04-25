"use client";

import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getTraditionalVsMaximaIb, TraditionalVsMaximaIBData } from "@/lib/directus/traditional_vs_maxima_ib";

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
  const [data, setData] = useState<TraditionalVsMaximaIBData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTraditionalVsMaximaIb();
        const fetchedData: TraditionalVsMaximaIBData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Traditional vs Maxima I.B:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  const {
    traditional_title,
    traditional_subtitle,
    traditional_points,
    maxima_title,
    maxima_subtitle,
    maxima_points,
  } = data;

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
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-poppins"
                variants={childVariants}
              >
                {traditional_title}
              </motion.h3>
              <motion.p
                className="text-gray-800 mb-6 text-lg font-poppins font-medium"
                variants={childVariants}
              >
                {traditional_subtitle}
              </motion.p>
              <ul className="space-y-6 text-gray-800 list-none ml-0 pb-12">
                {traditional_points.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={childVariants}
                    className="motion-item"
                  >
                    <div className="flex items-baseline mb-2">
                      <span className="text-[#3B82F6] mr-3 text-lg">•</span>
                      <span className="font-semibold text-lg text-gray-800 font-poppins">
                        {item.title}
                      </span>
                    </div>
                    <ul className="ml-8 mt-2 list-none">
                      <li className="flex items-baseline">
                        <span className="text-[#3B82F6] mr-3">•</span>
                        <span className="text-gray-800 font-poppins">
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
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-poppins"
                variants={childVariants}
              >
                {maxima_title}
              </motion.h3>
              <motion.p
                className="text-gray-800 mb-6 text-lg font-poppins font-medium"
                variants={childVariants}
              >
                {maxima_subtitle}
              </motion.p>
              <ul className="space-y-6 text-gray-800 list-none ml-0">
                {maxima_points.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={childVariants}
                    className="motion-item"
                  >
                    <div className="flex items-baseline mb-2">
                      <span className="text-[#3B82F6] mr-3 text-lg">•</span>
                      <span className="font-semibold text-lg text-gray-800 font-poppins">
                        {item.title}
                      </span>
                    </div>
                    <ul className="ml-8 mt-2 list-none">
                      <li className="flex items-baseline">
                        <span className="text-[#3B82F6] mr-3">•</span>
                        <span className="text-gray-800 font-poppins">
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
    </div>
  );
}