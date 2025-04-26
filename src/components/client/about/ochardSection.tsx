"use client";

import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAppleOrchard, AppleOrchardData } from "@/lib/directus/apple_orchard";

// Animation variants for the container
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

export default function AppleOrchardSection() {
  const [data, setData] = useState<AppleOrchardData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAppleOrchard();
        const fetchedData: AppleOrchardData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Apple Orchard:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center py-16 text-2xl">Đang tải...</div>;
  }

  const { title, subtitle, description, image } = data;

  // Tách description thành các đoạn nếu có ký tự xuống dòng (\n\n)
  const descriptionParagraphs = description.split('\n\n');

  return (
    <motion.section
      className="mb-16 bg-[#F4F8FB] relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background Decorations */}
      <div className="absolute z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Decorative Background 1"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 z-0 top-20">
        <Image
          src={IMAGES.BgFooter2.src}
          alt="Decorative Background 2"
          width={900}
          height={300}
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto z-10 relative p-6 md:p-12">
        <Row gutter={[32, 32]} className="items-center">
          <Col xs={24} lg={14}>
            <motion.p
              className="text-4xl font-bold text-gray-800 mb-4 font-poppins"
              variants={childVariants}
            >
              {title}
            </motion.p>
            <motion.p
              className="text-2xl text-gray-800 font-semibold mb-6 font-poppins"
              variants={childVariants}
            >
              {subtitle}
            </motion.p>
            <motion.div
              className="space-y-5 text-lg text-gray-800 font-poppins"
              variants={childVariants}
            >
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>
          </Col>

          <Col xs={24} lg={10}>
            <motion.div
              className="relative w-54 aspect-[8/16] ml-15 md:ml-20"
              variants={childVariants}
            >
              {image ? (
                <Image
                  src={`https://the-maxima.directus.app/assets/${image}`}
                  alt={title}
                  fill
                  className="rounded-2xl object-cover shadow-lg"
                  priority
                />
              ) : (
                <div className="bg-gray-200 rounded-2xl h-full flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Không có hình ảnh</p>
                </div>
              )}
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.section>
  );
}