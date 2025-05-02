"use client";

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

interface Translation {
  id: number;
  about_2_id: number;
  languages_code: string;
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
}

interface ContentData {
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
}

interface ApiResponse {
  id: number;
  status: string;
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
  translations: Translation[];
}

interface AboutSectionProps {
  data?: ContentData;
}

async function getAbout2(locale: string): Promise<ContentData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/about_2?lang=${lang}&fields=*,translations.*`,
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
      hero_title: translation?.hero_title || data.hero_title || "MAXIMA DAO",
      hero_cover: translation?.hero_cover || data.hero_cover || "",
      hero_content2: translation?.hero_content2 || data.hero_content2 || "",
    };
  } catch (error) {
    console.error("Error fetching about_2 data:", error);
    return {
      hero_title: "MAXIMA DAO",
      hero_cover: "",
      hero_content2: `Maxima introduces a decentralized platform, empowering users to join a community where profits are shared, moving beyond traditional trading models to ensure mutual success for all.

• Traders achieve optimized profits
• IBs gain steady profits
• Maxima ensures sustainable growth

Maxima was launched as an AI-driven platform with expert traders, built on a decentralized system. It aligns the goals of traders, IBs, and the platform by optimizing profits through innovative strategies, ensuring everyone benefits together.

Here's how it operates:

• Traders use advanced strategies to optimize profits, ensuring consistent returns even in challenging market conditions.
• IBs earn steady profits as traders remain active in the Maxima community.
• Maxima benefits from stable growth through its decentralized platform and community-driven model.

Profit Sharing for Everyone
Maxima's goal is clear — to unite traders, IBs, and the platform in a shared mission: sustainable profits. Through a decentralized community, Maxima ensures everyone thrives together with optimized returns.`,
    };
  }
}

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<ContentData>(
    initialData || {
      hero_title: "MAXIMA DAO",
      hero_cover: "",
      hero_content2: `Maxima introduces a decentralized platform, empowering users to join a community where profits are shared, moving beyond traditional trading models to ensure mutual success for all.

• Traders achieve optimized profits
• IBs gain steady profits
• Maxima ensures sustainable growth

Maxima was launched as an AI-driven platform with expert traders, built on a decentralized system. It aligns the goals of traders, IBs, and the platform by optimizing profits through innovative strategies, ensuring everyone benefits together.

Here's how it operates:

• Traders use advanced strategies to optimize profits, ensuring consistent returns even in challenging market conditions.
• IBs earn steady profits as traders remain active in the Maxima community.
• Maxima benefits from stable growth through its decentralized platform and community-driven model.

Profit Sharing for Everyone
Maxima's goal is clear — to unite traders, IBs, and the platform in a shared mission: sustainable profits. Through a decentralized community, Maxima ensures everyone thrives together with optimized returns.`,
    }
  );
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        const result = await getAbout2(locale);
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
    const keywords = ["Maxima", "AI-driven", "traders", "IBs", "decentralized", "profit"];
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="${mytheme === "light" ? "text-gray-800" : "text-yellow-400"} font-semibold">${keyword}</span>`
      );
    });
    return highlightedText;
  };

  const { hero_title, hero_cover, hero_content2 } = data;

  // Split content into paragraphs based on double newlines for better paragraph detection
  const paragraphs = hero_content2.split(/\n\s*\n/).filter((para) => para.trim());
  // Take the first 5 paragraphs for mainContent, and the rest for additionalContent
  const mainContent = paragraphs.slice(0, 5).join("\n\n").trim() || "";
  const additionalContent = paragraphs.length > 5 ? paragraphs.slice(5).join("\n\n").trim() : "";

  const mainContentLines = mainContent.split("\n").filter((line) => line.trim());
  const additionalContentLines = additionalContent
    .split("\n")
    .filter((line) => line.trim());

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

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: "1rem",
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.25, delay: 0.15 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const imageSrc = hero_cover
    ? `https://the-maxima.directus.app/assets/${hero_cover}`
    : IMAGES.Banner3.src;

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.div
        className={`relative overflow-hidden md:py-16 ${
          mytheme === "light"
            ? "bg-[#F4F8FB]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute z-0 left-0 top-0 opacity-60 md:opacity-80">
          <Image
            src={IMAGES.BgFooter1.src}
            alt="Background Element"
            width={900}
            height={300}
            priority
            className="w-48 md:w-72 lg:w-auto"
          />
        </div>
        <div className="absolute right-0 z-0 top-20 opacity-70 md:opacity-90">
          <Image
            src={IMAGES.BgFooter2.src}
            alt="Background Element"
            width={900}
            height={300}
            priority
            className="w-64 md:w-96 lg:w-auto"
          />
        </div>

        <div className="max-w-7xl mx-auto z-10 relative p-4 sm:p-6 md:p-8 lg:p-12">
          <Row
            gutter={[{ xs: 16, sm: 24, md: 32 }, { xs: 24, sm: 32, md: 48 }]}
            className="items-center"
          >
            <Col xs={24} lg={12}>
              <motion.div
                className="relative w-full rounded-2xl md:-mt-20 overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
                variants={childVariants}
              >
                <div
                  className={`bg-gradient-to-br h-full w-full absolute top-0 left-0 opacity-90 ${
                    mytheme === "light"
                      ? "from-gray-200/50 to-transparent"
                      : "from-black/50 to-transparent"
                  }`}
                ></div>
                <Image
                  src={imageSrc}
                  alt="Maxima Platform"
                  width={600}
                  height={500}
                  priority
                  className="object-cover w-full h-auto"
                  onError={(e) => {
                    console.error("Failed to load image:", imageSrc);
                    e.currentTarget.src = IMAGES.Banner3.src;
                  }}
                />
                <div
                  className={`absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t ${
                    mytheme === "light" ? "from-[#1a1a1a]" : "from-[#333333]"
                  } to-transparent`}
                ></div>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div variants={childVariants}>
                <motion.h2
                  className={`text-2xl md:text-4xl font-bold mb-6 -mt-20 relative bg-clip-text text-transparent ${
                    mytheme === "light"
                      ? "bg-gradient-to-r from-gray-900 to-blue-600 text-gray-800"
                      : "bg-gradient-to-r from-white to-gray-400 text-yellow-600"
                  }`}
                  variants={childVariants}
                >
                  {hero_title || "MAXIMA DAO"}
                </motion.h2>
                <motion.div
                  className={`space-y-4 text-base md:text-lg leading-relaxed ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                  variants={childVariants}
                >
                  {mainContentLines.length > 0 ? (
                    mainContentLines.map((line, index) => {
                      if (line.startsWith("• ")) {
                        return (
                          <ul key={index} className="list-disc pl-6 space-y-3">
                            <li
                              className="transition-all duration-300 hover:translate-x-1"
                              dangerouslySetInnerHTML={{ __html: highlightKeywords(line.replace("• ", "")) }}
                            />
                          </ul>
                        );
                      }
                      return (
                        <p
                          key={index}
                          dangerouslySetInnerHTML={{ __html: highlightKeywords(line) }}
                        />
                      );
                    })
                  ) : (
                    <p>No content available.</p>
                  )}

                  <AnimatePresence>
                    {showMore && additionalContentLines.length > 0 && (
                      <motion.div
                        key="expanded-content"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={contentVariants}
                        className="overflow-hidden"
                      >
                        <div
                          className={`mt-6 mb-1 p-4 rounded-xl shadow-sm border ${
                            mytheme === "light"
                              ? "bg-white/50 border-blue-50"
                              : "bg-black/50 border-yellow-800"
                          } backdrop-blur-sm`}
                        >
                          <h3
                            className={`font-bold mb-2 ${
                              mytheme === "light" ? "text-gray-800" : "text-white"
                            }`}
                          >
                            {highlightKeywords(additionalContentLines[0])}
                          </h3>
                          {additionalContentLines.length > 1 && (
                            <p
                              dangerouslySetInnerHTML={{
                                __html: highlightKeywords(additionalContentLines[1]),
                              }}
                            />
                          )}
                        </div>
                        {additionalContentLines.slice(2).map((line, index) => {
                          if (line.startsWith("• ")) {
                            return (
                              <ul
                                key={index}
                                className="list-disc pl-6 space-y-3"
                              >
                                <li
                                  className="transition-all duration-300 hover:translate-x-1"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line.replace("• ", "")),
                                  }}
                                />
                              </ul>
                            );
                          }
                          return (
                            <p
                              key={index}
                              dangerouslySetInnerHTML={{ __html: highlightKeywords(line) }}
                            />
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  className="mt-8 text-center text-white sm:text-left"
                  variants={childVariants}
                >
                  <motion.button
                    className={`px-8 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ease-in-out ${
                      mytheme === "light"
                        ? "bg-gradient-to-r from-[#1a1a1a] to-[#333333] text-white"
                        : "bg-gradient-to-r from-[#333333] to-[#555555] text-yellow-400"
                    } hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                    onClick={() => setShowMore(!showMore)}
                    whileTap={{ scale: 0.97 }}
                  >
                    {locale === "vi"
                      ? showMore
                        ? "Thu gọn"
                        : "Xem thêm"
                      : locale === "zh"
                      ? showMore
                        ? "收起"
                        : "查看更多"
                      : showMore
                      ? "Show Less"
                      : "See More"}
                  </motion.button>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.div>
    </ConfigProvider>
  );
}