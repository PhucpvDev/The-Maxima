"use client"; // Đánh dấu là Client Component

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getMaximaSuperWallet, MaximaSuperWalletData } from "@/lib/directus/maxima_super_wallet";

// Animation variants cho container
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

// Animation variants cho các phần tử con
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

export default function MaximaSuperWalletSection() {
  const [data, setData] = useState<MaximaSuperWalletData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMaximaSuperWallet();
        const fetchedData: MaximaSuperWalletData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Maxima Super Wallet:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  const { title, description, additional_description, cta_title, cta_button_text } = data;

  return (
    <motion.div
      className="bg-[#F4F8FB] md:py-20 py-10 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Decoration 1"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 top-20 z-0">
        <Image
          src={IMAGES.BgFooter2}
          alt="Decoration 2"
          width={900}
          height={300}
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <motion.p
              className="text-2xl font-bold text-gray-800 mb-2 uppercase"
              variants={childVariants}
            >
              {title}
            </motion.p>
            <motion.p
              className="text-gray-700 text-base leading-relaxed mb-6"
              variants={childVariants}
            >
              {description}
            </motion.p>
            <motion.div variants={childVariants}>
              <Link
                href="#"
                className="text-blue-900 font-bold underline block mb-4"
              >
                {cta_title}
              </Link>
            </motion.div>
            <motion.div
              className="text-white font-medium"
              variants={childVariants}
            >
              <button className="bg-orange-400 hover:bg-orange-500 px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto">
                {cta_button_text}
              </button>
            </motion.div>
          </Col>

          <Col xs={24} lg={12}>
            <motion.div
              className="bg-[#003D8F] rounded-xl h-52 w-full mb-4"
              variants={childVariants}
            ></motion.div>
            <motion.p
              className="text-gray-700 text-base leading-relaxed"
              variants={childVariants}
            >
              {additional_description}
            </motion.p>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
}