
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import "antd/dist/reset.css";

interface Translation {
  id: number;
  about_2_id: number;
  languages_code: string;
  hero_section_title: string;
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
  tabs_name_1: string;
  tabs_name_2: string;
  section_title_1: string;
  section_title_2: string;
  description_1: string;
  description_2: string;
}

interface ContentData {
  hero_section_title: string;
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
  tabs_name_1: string;
  tabs_name_2: string;
  section_title_1: string;
  section_title_2: string;
  description_1: string;
  description_2: string;
}

interface ApiResponse {
  id: number;
  status: string;
  hero_section_title: string;
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
  tabs_name_1: string;
  tabs_name_2: string;
  section_title_1: string;
  section_title_2: string;
  description_1: string;
  description_2: string;
  translations: Translation[];
}

interface AboutSectionProps {
  data?: ContentData;
}

const translationFallbacks: Record<string, ContentData> = {
  "en-US": {
    hero_section_title: "About Us",
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
    tabs_name_1: "Key Benefits",
    tabs_name_2: "Our Mission",
    section_title_1: "Decentralized",
    section_title_2: "AI-Powered",
    description_1:
      "Maxima introduces a decentralized platform, empowering users to join a community where profits are shared, moving beyond traditional trading models to ensure mutual success for all.",
    description_2:
      "Maxima was launched as an AI-driven platform with expert traders, built on a decentralized system. It aligns the goals of traders, IBs, and the platform by optimizing profits through innovative strategies, ensuring everyone benefits together.",
  },
  "vi-VN": {
    hero_section_title: "Về Chúng Tôi",
    hero_title: "MAXIMA DAO",
    hero_cover: "",
    hero_content2: `Maxima giới thiệu một nền tảng phi tập trung, trao quyền cho người dùng tham gia vào một cộng đồng nơi lợi nhuận được chia sẻ, vượt qua các mô hình giao dịch truyền thống để đảm bảo thành công chung cho tất cả.

• Nhà giao dịch đạt được lợi nhuận tối ưu
• IBs thu được lợi nhuận ổn định
• Maxima đảm bảo tăng trưởng bền vững

Maxima được ra mắt như một nền tảng dựa trên AI với các nhà giao dịch chuyên gia, được xây dựng trên một hệ thống phi tập trung. Nó đồng bộ hóa mục tiêu của các nhà giao dịch, IBs và nền tảng bằng cách tối ưu hóa lợi nhuận thông qua các chiến lược đổi mới, đảm bảo mọi người cùng có lợi.

Cách thức hoạt động:

• Nhà giao dịch sử dụng các chiến lược tiên tiến để tối ưu hóa lợi nhuận, đảm bảo lợi nhuận ổn định ngay cả trong điều kiện thị trường khó khăn.
• IBs kiếm được lợi nhuận ổn định khi các nhà giao dịch vẫn hoạt động trong cộng đồng Maxima.
• Maxima hưởng lợi từ sự tăng trưởng ổn định thông qua nền tảng phi tập trung và mô hình dựa trên cộng đồng.

Chia sẻ lợi nhuận cho mọi người
Mục tiêu của Maxima rất rõ ràng — đoàn kết các nhà giao dịch, IBs và nền tảng trong một sứ mệnh chung: lợi nhuận bền vững. Thông qua cộng đồng phi tập trung, Maxima đảm bảo mọi người cùng phát triển với lợi nhuận tối ưu.`,
    tabs_name_1: "Lợi Ích Chính",
    tabs_name_2: "Sứ Mệnh Của Chúng Tôi",
    section_title_1: "Phi Tập Trung",
    section_title_2: "Hỗ Trợ AI",
    description_1:
      "Maxima giới thiệu một nền tảng phi tập trung, trao quyền cho người dùng tham gia vào một cộng đồng nơi lợi nhuận được chia sẻ, vượt qua các mô hình giao dịch truyền thống để đảm bảo thành công chung cho tất cả.",
    description_2:
      "Maxima được ra mắt như một nền tảng dựa trên AI với các nhà giao dịch chuyên gia, được xây dựng trên một hệ thống phi tập trung. Nó đồng bộ hóa mục tiêu của các nhà giao dịch, IBs và nền tảng bằng cách tối ưu hóa lợi nhuận thông qua các chiến lược đổi mới, đảm bảo mọi người cùng có lợi.",
  },
  "zh-CN": {
    hero_section_title: "关于我们",
    hero_title: "MAXIMA DAO",
    hero_cover: "",
    hero_content2: `Maxima 推出一个去中心化平台，赋予用户加入一个共享利润的社区，超越传统交易模型，确保所有人的共同成功。

• 交易者实现优化的利润
• IBs 获得稳定的利润
• Maxima 确保可持续增长

Maxima 作为一个人工智能驱动的平台推出，结合专家交易者，构建在去中心化系统上。它通过创新策略优化利润，协调交易者、IBs 和平台的目标，确保所有人共同受益。

运作方式如下：

• 交易者使用先进策略优化利润，即使在具有挑战性的市场条件下也能确保稳定回报。
• IBs 在 Maxima 社区中交易者保持活跃时获得稳定利润。
• Maxima 通过其去中心化平台和社区驱动模型实现稳定增长。

为所有人分享利润
Maxima 的目标很明确——将交易者、IBs 和平台团结在一个共同使命中：可持续利润。通过去中心化社区，Maxima 确保所有人以优化的回报共同繁荣。`,
    tabs_name_1: "主要优势",
    tabs_name_2: "我们的使命",
    section_title_1: "去中心化",
    section_title_2: "人工智能驱动",
    description_1:
      "Maxima 推出一个去中心化平台，赋予用户加入一个共享利润的社区，超越传统交易模型，确保所有人的共同成功。",
    description_2:
      "Maxima 作为一个人工智能驱动的平台推出，结合专家交易者，构建在去中心化系统上。它通过创新策略优化利润，协调交易者、IBs 和平台的目标，确保所有人共同受益。",
  },
};

async function getAbout2(locale: string): Promise<ContentData> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const fallback = translationFallbacks[lang] || translationFallbacks["en-US"];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/about_2?lang=${lang}&fields=*,translations.*`,
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
      hero_title: translation?.hero_title || data.hero_title || fallback.hero_title,
      hero_cover: translation?.hero_cover || data.hero_cover || fallback.hero_cover,
      hero_content2: translation?.hero_content2 || data.hero_content2 || fallback.hero_content2,
      tabs_name_1: translation?.tabs_name_1 || data.tabs_name_1 || fallback.tabs_name_1,
      tabs_name_2: translation?.tabs_name_2 || data.tabs_name_2 || fallback.tabs_name_2,
      section_title_1: translation?.section_title_1 || data.section_title_1 || fallback.section_title_1,
      section_title_2: translation?.section_title_2 || data.section_title_2 || fallback.section_title_2,
      description_1: translation?.description_1 || data.description_1 || fallback.description_1,
      description_2: translation?.description_2 || data.description_2 || fallback.description_2,
    };
  } catch (error) {
    console.error("Error fetching about_2 data:", error);
    return fallback;
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.2 },
  },
};

const renderBenefitIcon = (index: number) => {
  if (index === 0) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 7H21M21 7V15M21 7L13 15L9 11L3 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else if (index === 1) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 8C10.343 8 9 8.895 9 10C9 11.105 10.343 12 12 12C13.657 12 15 12.895 15 14C15 15.105 13.657 16 12 16M12 8V7M12 8C13.11 8 14.08 8.402 14.599 9M12 16V17M12 16C10.89 16 9.92 15.598 9.401 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  } else {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
};

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<ContentData>(
    initialData || translationFallbacks[locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US"]
  );
  const [activeTab, setActiveTab] = useState<string>("benefits");
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
          const result = await getAbout2(locale);
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
    const keywords = ["Maxima", "AI-driven", "traders", "IBs", "decentralized", "profit"];
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="${mytheme === "dark" ? "text-yellow-400 font-medium" : "text-yellow-600 font-medium"}">${keyword}</span>`
      );
    });
    return highlightedText;
  };

  const { hero_title, hero_cover } = data;

  const paragraphs = data.hero_content2.split(/\n\s*\n/).filter((para) => para.trim());
  const mainContent = paragraphs.slice(0, 5).join("\n\n").trim() || "";
  const additionalContent = paragraphs.length > 5 ? paragraphs.slice(5).join("\n\n").trim() : "";

  const mainContentLines = mainContent.split("\n").filter((line) => line.trim());
  const additionalContentLines = additionalContent.split("\n").filter((line) => line.trim());

  const benefitPoints = mainContentLines.filter((line) => line.startsWith("• "));

  const introText = mainContentLines
    .slice(0, mainContentLines.findIndex((line) => line.startsWith("• ")))
    .filter((line) => line.length > 0);

  const imageSrc = hero_cover
    ? `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${hero_cover}`
    : IMAGES.Banner3.src;

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
        className={`py-24 relative overflow-hidden ${
          mytheme === "dark"
            ? "bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200"
            : "bg-gradient-to-b from-white to-gray-50 text-gray-800"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-5 ${mytheme === "dark" ? "bg-white" : "bg-gray-900"}`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                mytheme === "dark" ? "#ffffff" : "#1a202c"
              } 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="order-2 md:order-1">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-1 w-12 bg-yellow-500 rounded"></div>
                  <span
                    className={`text-sm font-semibold tracking-wider ${
                      mytheme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {data.hero_section_title}
                  </span>
                </div>
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight mb-3 ${
                    mytheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {hero_title || "MAXIMA DAO"}
                </h2>

                {introText.map((line, index) => (
                  <p
                    key={index}
                    className={`text-lg mb-4 ${
                      mytheme === "dark" ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"
                    }`}
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(line) }}
                  />
                ))}
              </div>

              <div className="mb-8">
                <div className={`flex border-b ${mytheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <button
                    onClick={() => setActiveTab("benefits")}
                    className={`px-4 py-2 font-medium text-base transition-all relative ${
                      activeTab === "benefits"
                        ? mytheme === "dark"
                          ? "text-white font-semibold"
                          : "text-gray-900 font-semibold"
                        : mytheme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {data.tabs_name_1 || "Key Benefits"}
                    {activeTab === "benefits" && (
                      <motion.div
                        className={`absolute bottom-0 left-0 w-full h-0.5 ${
                          mytheme === "dark" ? "bg-white" : "bg-gray-900"
                        }`}
                        layoutId="activeTab"
                      />
                    )}
                  </button>

                  {additionalContentLines.length > 0 && (
                    <button
                      onClick={() => setActiveTab("mission")}
                      className={`px-4 py-2 font-medium text-base transition-all relative ${
                        activeTab === "mission"
                          ? mytheme === "dark"
                            ? "text-white font-semibold"
                            : "text-gray-900 font-semibold"
                          : mytheme === "dark"
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {data.tabs_name_2 || "Our Mission"}
                      {activeTab === "mission" && (
                        <motion.div
                          className={`absolute bottom-0 left-0 w-full h-0.5 ${
                            mytheme === "dark" ? "bg-white" : "bg-gray-900"
                          }`}
                          layoutId="activeTab"
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === "benefits" && (
                    <motion.div
                      key="benefits"
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="space-y-4">
                        {benefitPoints.map((point, index) => (
                          <motion.div
                            key={index}
                            className={`p-4 rounded-lg ${
                              mytheme === "dark"
                                ? "bg-gray-800/50 border border-gray-700/50"
                                : "bg-gray-50 border border-gray-100"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start">
                              <span
                                className={`flex-shrink-0 mr-4 rounded-md ${
                                  mytheme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {renderBenefitIcon(index)}
                              </span>
                              <span
                                className={`${mytheme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                                dangerouslySetInnerHTML={{ __html: highlightKeywords(point.replace("• ", "")) }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "mission" && additionalContentLines.length > 0 && (
                    <motion.div
                      key="mission"
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div
                        className={`p-6 rounded-lg ${
                          mytheme === "dark"
                            ? "bg-gray-800/50 border border-gray-700/50"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <h3
                          className={`text-xl font-bold mb-4 ${
                            mytheme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                          dangerouslySetInnerHTML={{ __html: highlightKeywords(additionalContentLines[0]) }}
                        />

                        {additionalContentLines.slice(1).map((line, index) => (
                          <div key={index}>
                            {line.startsWith("• ") ? (
                              <div className="flex items-start mt-4">
                                <div
                                  className={`flex-shrink-0 mr-3 w-1.5 h-1.5 rounded-full mt-2 ${
                                    mytheme === "dark" ? "bg-gray-300" : "bg-gray-700"
                                  }`}
                                ></div>
                                <p
                                  className={`${mytheme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                                  dangerouslySetInnerHTML={{ __html: highlightKeywords(line.replace("• ", "")) }}
                                />
                              </div>
                            ) : (
                              <p
                                className={`mt-3 ${mytheme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                                dangerouslySetInnerHTML={{ __html: highlightKeywords(line) }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden shadow-md h-[585px]">
                <Image
                  src={imageSrc}
                  alt={hero_title || "Maxima Platform"}
                  fill
                  priority
                  className="object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", imageSrc);
                    e.currentTarget.src = IMAGES.Banner3.src;
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    mytheme === "dark" ? "from-black/80 to-transparent/40" : "from-black/60 to-transparent"
                  }`}
                ></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="w-16 h-0.5 bg-white rounded-full mb-3"></div>
                  <h2 className="text-white text-2xl font-bold">{hero_title || "MAXIMA DAO"}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <motion.div
                  className={`p-5 rounded-lg ${
                    mytheme === "dark"
                      ? "bg-gray-800/50 border border-gray-700/50"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  variants={fadeInUp}
                >
                  <div className={`mb-4 ${mytheme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13 10V3L4 14H11V21L20 10H13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg font-medium mb-1 ${mytheme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {data.section_title_1 || "Decentralized"}
                  </h3>
                  <p className={`text-sm ${mytheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {data.description_1}
                  </p>
                </motion.div>

                <motion.div
                  className={`p-5 rounded-lg ${
                    mytheme === "dark"
                      ? "bg-gray-800/50 border border-gray-700/50"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  variants={fadeInUp}
                >
                  <div className={`mb-4 ${mytheme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 3V4M19.0355 5.03553L18.3284 5.74264M21 12H20M4 12H3M5.67157 5.74264L4.96447 5.03553M12 20V19M9.66284 19.0784C8.50834 18.5388 7.58126 17.642 7.02133 16.5239M14.3345 19.0789C15.4902 18.5395 16.4182 17.6423 16.9786 16.5237M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg font-medium mb-1 ${mytheme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {data.section_title_2 || "AI-Powered"}
                  </h3>
                  <p className={`text-sm ${mytheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {data.description_2}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <style jsx global>{`
          .font-inter {
            font-family: "Inter", Arial, sans-serif;
          }

          /* Improved text readability with better line-height */
          .leading-relaxed {
            line-height: 1.75 !important;
          }

          /* Ensure theme-specific background */
          [data-theme="dark"] {
            background-color: #1a202c;
          }
          [data-theme="light"] {
            background-color: #ffffff;
          }

          /* Fallback styles for Ant Design components */
          .ant-config-provider {
            --antd-color-primary: #ffc800;
            --antd-border-radius: 8px;
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
}

