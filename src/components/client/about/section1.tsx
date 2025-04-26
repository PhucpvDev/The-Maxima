"use client";

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAbout1 } from "@/lib/directus/about_1";

interface ContentData {
  title: string;
  hero_content: string;
  video_url: string;
}

interface AboutSectionProps {
  data?: ContentData;
}

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const [data, setData] = useState<ContentData>(
    initialData || {
      title: "About the Maxima",
      hero_content: "Maxima is a program based on AI technology combined with a team of top trading experts, helping to optimize your profits through futures trading. It leverages advanced algorithms and expert strategies to ensure consistent returns, making it an ideal choice for traders seeking financial success in the futures market.\n\nRecently, our journey led us to a groundbreaking project called Maxima, founded by Mr. Chen, a veteran with over 15 years of experience in the broker industry. Despite his success, Mr. Chen observed a recurring issue — most traders were losing money. As new forex brokers flooded the market, competition increased, operational costs rose, and high churn rates meant constantly chasing new users. Even introducing brokers (IBs) faced difficulties keeping their networks active.",
      video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz"
    }
  );

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const result = await getAbout1();
          const fetchedData = Array.isArray(result) ? result[0] : result;
          setData({
            title: fetchedData.title || "About the Maxima",
            hero_content: fetchedData.hero_content || "",
            video_url: fetchedData.video_url || "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz"
          });
        } catch (error) {
          console.error("Error fetching about data:", error);
        }
      };
      fetchData();
    }
  }, [initialData]);

  // Split hero_content by line breaks and highlight specific keywords
  const highlightKeywords = (text: string) => {
    const keywords = ["Maxima", "AI technology", "trading experts", "futures trading", "Mr. Chen", "brokers"];
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(regex, `<span class="text-gray-800 font-semibold">${keyword}</span>`);
    });
    return highlightedText;
  };

  const contentParagraphs = data.hero_content
    .split('\n')
    .filter(para => para.trim() !== '')
    .map(para => highlightKeywords(para));

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

  const textVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: custom * 0.15,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div
      className="bg-gradient-to-b from-[#F4F8FB] to-[#EDF3F8] relative overflow-hidden py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute z-0 left-0 top-0 opacity-50">
        <Image
          src={IMAGES.BgFooter1.src}
          alt="Background Element"
          width={300}
          height={300}
          priority
          className="w-48 md:w-72"
        />
      </div>
      <div className="absolute right-0 z-0 top-20 opacity-60">
        <Image
          src={IMAGES.BgFooter2.src}
          alt="Background Element"
          width={900}
          height={300}
          priority
          className="w-64 md:w-96"
        />
      </div>

      <div className="max-w-7xl mx-auto z-10 relative p-6 md:p-8 lg:p-8">
        <Row gutter={[{ xs: 16, sm: 24, md: 32, lg: 48 }, { xs: 24, sm: 32, md: 48 }]} className="items-center">
          <Col xs={24} lg={12}>
            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a1a] to-[#555555]"
              variants={childVariants}
            >
              {data.title}
            </motion.h2>
            
            <motion.div
              className="space-y-6 text-gray-800 leading-relaxed"
              variants={childVariants}
            >
              {contentParagraphs.map((paragraph, index) => (
                <motion.p 
                  key={index}
                  custom={index}
                  variants={textVariants}
                  className="font-medium text-base md:text-lg bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border-l-4 border-gray-800 hover:border-blue-600 transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </motion.div>
          </Col>

          <Col xs={24} lg={12}>
            <motion.div
              className="relative w-full rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
              variants={childVariants}
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  className="rounded-xl"
                  src={data.video_url}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style={{ aspectRatio: '16/9' }}
                ></iframe>
              </div>
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
}