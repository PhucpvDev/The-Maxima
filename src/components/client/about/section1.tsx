
"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { IMAGES } from "@/constants/client/theme"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme } from "antd"

interface Translation {
  id: number;
  about_1_id: number;
  languages_code: string;
  hero_section_title: string;
  hero_title: string;
  hero_content: string;
}

interface ContentData {
  hero_section_title: string;
  title: string;
  hero_content: string;
  video_url: string;
}

interface ApiResponse {
  id: number;
  status: string;
  hero_section_title: string;
  hero_title: string;
  hero_content: string;
  video_url: string;
  translations: Translation[];
}

interface AboutSectionProps {
  data?: ContentData;
}

const translationFallbacks: Record<string, ContentData> = {
  "en-US": {
    hero_section_title: "DISCOVER",
    title: "About the Maxima",
    hero_content:
      "Maxima is a program based on AI technology combined with a team of top trading experts, helping to optimize your profits through futures trading.",
    video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
  },
  "vi-VN": {
    hero_section_title: "KHÁM PHÁ",
    title: "Về Maxima",
    hero_content:
      "Maxima là một chương trình dựa trên công nghệ AI kết hợp với đội ngũ chuyên gia giao dịch hàng đầu, giúp tối ưu hóa lợi nhuận của bạn thông qua giao dịch hợp đồng tương lai.",
    video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
  },
  "zh-CN": {
    hero_section_title: "发现",
    title: "关于Maxima",
    hero_content:
      "Maxima 是一个基于人工智能技术的程序，结合顶级交易专家团队，帮助您通过期货交易优化利润。",
    video_url: "https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz",
  },
};

async function getAbout1(locale: string): Promise<ContentData> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const fallback = translationFallbacks[lang] || translationFallbacks["en-US"];

  try {
    const response = await fetch(
      `https://maximagoldhedging.com/items/about_1?lang=${lang}&fields=*,translations.*`,
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

    const translation = data.translations.find((t: Translation) => t.languages_code === lang);

    return {
      hero_section_title: translation?.hero_section_title || data.hero_section_title || fallback.hero_section_title,
      title: translation?.hero_title || data.hero_title || fallback.title,
      hero_content: translation?.hero_content || data.hero_content || fallback.hero_content,
      video_url: data.video_url || fallback.video_url,
    };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return fallback;
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const videoReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<ContentData>(
    initialData || translationFallbacks[locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US"]
  );
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    const applyTheme = () => {
      const theme = mytheme || "light"; 
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    };

    applyTheme();
  }, [mytheme]);

  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await getAbout1(locale);
          setData(result);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [initialData, locale]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
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
        `<span class="${mytheme === "dark" ? "text-yellow-400 font-semibold" : "text-yellow-600 font-semibold"}">${keyword}</span>`
      );
    });
    return highlightedText;
  };

  const contentParagraphs = data.hero_content
    .split("\n")
    .filter((para) => para.trim() !== "")
    .map((para) => highlightKeywords(para));

  if (isLoading) {
    return (
      <section className="py-24 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </section>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <section
        id="about"
        className={`py-24 relative overflow-hidden font-inter ${
          mytheme === "dark"
            ? "bg-gradient-to-b from-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 to-white"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-5 ${mytheme === "dark" ? "bg-white" : "bg-gray-900"}`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                mytheme === "dark" ? "#ffffff" : "#1a202c"
              } 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>

          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>

          <div className="absolute top-0 left-0 z-0 opacity-5">
            <Image src={IMAGES.BgFooter1.src} alt="Background Pattern" width={300} height={300} priority />
          </div>
          <div className="absolute right-0 top-20 z-0 opacity-5">
            <Image src={IMAGES.BgFooter2.src} alt="Background Pattern" width={900} height={300} priority />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="inline-block"
            >
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="h-1 w-6 bg-yellow-500 rounded"></div>
                <span
                  className={`text-sm font-semibold tracking-wider uppercase ${
                    mytheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {data.hero_section_title}
                </span>
                <div className="h-1 w-6 bg-yellow-500 rounded"></div>
              </div>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  mytheme === "dark" ? "text-white" : "text-gray-900"
                } relative inline-block`}
              >
                {data.title}
                <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </h2>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {contentParagraphs.map((paragraph, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`mb-6 p-6 rounded-xl ${
                    mytheme === "dark"
                      ? "bg-gray-800/50 shadow-lg hover:shadow-xl shadow-black/10 hover:shadow-black/20"
                      : "bg-white shadow-md hover:shadow-lg"
                  } transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        mytheme === "dark"
                          ? index % 3 === 0
                            ? "bg-blue-900/30 text-white"
                            : index % 3 === 1
                            ? "bg-green-900/30 text-white"
                            : "bg-amber-900/30 text-white"
                          : index % 3 === 0
                          ? "bg-blue-100"
                          : index % 3 === 1
                          ? "bg-green-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {index % 3 === 0 ? "auto_awesome" : index % 3 === 1 ? "trending_up" : "security"}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`${
                          mytheme === "dark" ? "text-gray-300" : "text-gray-700"
                        } tracking-wide leading-relaxed text-base`}
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={videoReveal}
            >
              <div className="relative">
                <div
                  className={`overflow-hidden rounded-2xl shadow-2xl ${
                    mytheme === "dark" ? "shadow-black/50" : "shadow-blue-200/60"
                  }`}
                >
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      src={`${data.video_url}${isVideoPlaying ? "&autoplay=1" : ""}`}
                      title="Maxima Introduction Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="absolute top-0 left-0 w-full h-full border-0"
                    ></iframe>
                  </div>
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      mytheme === "dark" ? "from-black/50 to-transparent" : "from-blue-900/30 to-transparent"
                    }`}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

          .font-inter {
            font-family: "Inter", Arial, sans-serif;
          }

          /* Improved text readability with better line-height */
          .leading-relaxed {
            line-height: 1.75 !important;
          }

          /* Paragraph styling for better readability */
          p {
            margin-bottom: 0.5rem;
          }

          /* Animation for the loader */
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          /* Ensure theme-specific background */
          [data-theme="dark"] {
            background-color: #1a202c;
          }
          [data-theme="light"] {
            background-color: #f7fafc;
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
}
