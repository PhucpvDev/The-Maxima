"use client";

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

interface Translation {
  id: number;
  about_1_id: number;
  languages_code: string;
  hero_title: string;
  hero_content: string;
}

interface ContentData {
  title: string;
  hero_content: string;
  video_url: string;
}

interface ApiResponse {
  id: number;
  status: string;
  hero_title: string;
  hero_content: string;
  video_url: string;
  translations: Translation[];
}

interface AboutSectionProps {
  data?: ContentData;
}

async function getAbout1(locale: string): Promise<ContentData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/about_1?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    const data: ApiResponse = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    return {
      title: translation?.hero_title || data.hero_title || "About the Maxima",
      hero_content: translation?.hero_content || data.hero_content || "",
      video_url: data.video_url || "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
    };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return {
      title: "About the Maxima",
      hero_content:
        "Maxima is a program based on AI technology combined with a team of top trading experts, helping to optimize your profits through futures trading.",
      video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
    };
  }
}

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<ContentData>(
    initialData || {
      title: "About the Maxima",
      hero_content:
        "Maxima is a program based on AI technology combined with a team of top trading experts, helping to optimize your profits through futures trading.",
      video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
    }
  );

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        const result = await getAbout1(locale);
        setData(result);
      };
      fetchData();
    }
  }, [initialData, locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const getCSSVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  const themeConfig = {
    token: {
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const highlightKeywords = (text: string) => {
    const keywords = ["Maxima", "AI technology", "trading experts", "futures trading", "Mr. Chen", "brokers"];
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="${mytheme === "light" ? "text-gray-800" : "text-yellow-600"} font-semibold">${keyword}</span>`
      );
    });
    return highlightedText;
  };

  const contentParagraphs = data.hero_content
    .split("\n")
    .filter((para) => para.trim() !== "")
    .map((para) => highlightKeywords(para));

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
        duration: 0.5,
      },
    }),
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.div
        className={`relative overflow-hidden py-16 ${mytheme === "light"
            ? "bg-gradient-to-b from-[#F4F8FB] to-[#EDF3F8]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
          }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className={`w-16 h-16 pl-2 pt-2 rounded-full hidden md:block flex items-center justify-center shadow-lg shadow-yellow-700/30 ${mytheme === "light"
                ? "bg-yellow-500"
                : "bg-gradient-to-r from-yellow-600 to-yellow-700"
              }`}
          >
            <Image
              src={IMAGES.Logo2}
              alt="Loading Logo"
              width={48}
              height={48}
              priority
              className="drop-shadow-md"
            />
          </div>
        </div>
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
                className={`text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md bg-clip-text text-transparent ${mytheme === "light"
                    ? "bg-gradient-to-r from-[#1a1a1a] to-[#555555]"
                    : "bg-gradient-to-r from-[#ffffff] text-yellow-600"
                  } mb-8`}
                variants={childVariants}
              >
                {data.title}
              </motion.h2>

              <motion.div
                className="space-y-6 leading-relaxed"
                variants={childVariants}
              >
                {contentParagraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    custom={index}
                    variants={textVariants}
                    className={`font-medium text-base md:text-lg ${mytheme === "light"
                        ? "text-gray-800 bg-white/50 border-l-gray-800"
                        : "text-gray-200 bg-black/50 border-l-yellow-600"
                      } backdrop-blur-sm p-4 rounded-lg shadow-sm border-l-4 hover:border-blue-600 transition-all duration-300`}
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
                    style={{ aspectRatio: "16/9" }}
                  ></iframe>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.div>
    </ConfigProvider>
  );
}