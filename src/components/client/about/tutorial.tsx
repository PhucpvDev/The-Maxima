"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme } from "antd"

interface Translation {
  id: number;
  tutorial_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
  help_title: string;
  help_description: string;
  help_button_text: string;
}

interface TutorialData {
  title: string;
  subtitle: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
  help_title: string;
  help_description: string;
  help_button_text: string;
}

interface RawTutorialData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
  help_title: string;
  help_description: string;
  help_button_text: string;
  translations: Translation[];
}

interface TutorialProps {
  id?: string;
}

async function getTutorial(locale: string): Promise<TutorialData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/tutorial?lang=${lang}&fields=*,translations.*`,
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
    const data: RawTutorialData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const step_1 = lang === "en-US" ? data.step_1 : source.step_1;
    const step_2 = lang === "en-US" ? data.step_2 : source.step_2;
    const step_3 = lang === "en-US" ? data.step_3 : source.step_3;

    const defaultTranslations = {
      en: {
        title: "TUTORIAL",
        subtitle: "Follow these simple steps to start your journey with Maxima",
        step_1: "STEP 1",
        description_1: "Register & Download",
        step_2: "STEP 2",
        description_2: "Deposit USDT",
        step_3: "STEP 3",
        description_3: "Set Up & Start Trade",
        help_title: "Need Help?",
        help_description: "Our support team is available 24/7 to assist you with any questions",
        help_button_text: "Contact Support",
      },
      vi: {
        title: "HƯỚNG DẪN",
        subtitle: "Thực hiện các bước đơn giản này để bắt đầu hành trình với Maxima",
        step_1: "BƯỚC 1",
        description_1: "Đăng Ký & Tải Xuống",
        step_2: "BƯỚC 2",
        description_2: "Nạp USDT",
        step_3: "BƯỚC 3",
        description_3: "Thiết Lập & Bắt Đầu Giao Dịch",
        help_title: "Cần Hỗ Trợ?",
        help_description: "Đội ngũ hỗ trợ của chúng tôi sẵn sàng 24/7 để giải đáp mọi thắc mắc của bạn",
        help_button_text: "Liên Hệ Hỗ Trợ",
      },
      zh: {
        title: "教程",
        subtitle: "按照这些简单步骤开始您的Maxima之旅",
        step_1: "步骤 1",
        description_1: "注册并下载",
        step_2: "步骤 2",
        description_2: "存入USDT",
        step_3: "步骤 3",
        description_3: "设置并开始交易",
        help_title: "需要帮助？",
        help_description: "我们的支持团队全天候为您解答任何疑问",
        help_button_text: "联系支持",
      },
    };

    const defaults = defaultTranslations[locale as keyof typeof defaultTranslations] || defaultTranslations.en;

    return {
      title: source.title || defaults.title,
      subtitle: source.subtitle || defaults.subtitle,
      step_1: step_1 || defaults.step_1,
      description_1: source.description_1 || defaults.description_1,
      video_url_1: source.video_url_1 || "https://www.youtube.com/embed/29oOROTFF4o?si=XBPqFN88iDLBuIZ5",
      step_2: step_2 || defaults.step_2,
      description_2: source.description_2 || defaults.description_2,
      video_url_2: source.video_url_2 || "https://www.youtube.com/embed/2v0vxLcpICE?si=i-18Y9nNeg9hvHh8",
      step_3: step_3 || defaults.step_3,
      description_3: source.description_3 || defaults.description_3,
      video_url_3: source.video_url_3 || "https://www.youtube.com/embed/m77ktn2aE0U?si=LK1DMeGJPDWUpxqE",
      help_title: source.help_title || defaults.help_title,
      help_description: source.help_description || defaults.help_description,
      help_button_text: source.help_button_text || defaults.help_button_text,
    };
  } catch (error) {
    console.error("Error fetching tutorial data:", error);

    const defaultTranslations = {
      en: {
        title: "TUTORIAL",
        subtitle: "Follow these simple steps to start your journey with Maxima",
        step_1: "STEP 1",
        description_1: "Register & Download",
        step_2: "STEP 2",
        description_2: "Deposit USDT",
        step_3: "STEP 3",
        description_3: "Set Up & Start Trade",
        help_title: "Need Help?",
        help_description: "Our support team is available 24/7 to assist you with any questions",
        help_button_text: "Contact Support",
      },
      vi: {
        title: "HƯỚNG DẪN",
        subtitle: "Thực hiện các bước đơn giản này để bắt đầu hành trình với Maxima",
        step_1: "BƯỚC 1",
        description_1: "Đăng Ký & Tải Xuống",
        step_2: "BƯỚC 2",
        description_2: "Nạp USDT",
        step_3: "BƯỚC 3",
        description_3: "Thiết Lập & Bắt Đầu Giao Dịch",
        help_title: "Cần Hỗ Trợ?",
        help_description: "Đội ngũ hỗ trợ của chúng tôi sẵn sàng 24/7 để giải đáp mọi thắc mắc của bạn",
        help_button_text: "Liên Hệ Hỗ Trợ",
      },
      zh: {
        title: "教程",
        subtitle: "按照这些简单步骤开始您的Maxima之旅",
        step_1: "步骤 1",
        description_1: "注册并下载",
        step_2: "步骤 2",
        description_2: "存入USDT",
        step_3: "步骤 3",
        description_3: "设置并开始交易",
        help_title: "需要帮助？",
        help_description: "我们的支持团队全天候为您解答任何疑问",
        help_button_text: "联系支持",
      },
    };

    const defaults = defaultTranslations[locale as keyof typeof defaultTranslations] || defaultTranslations.en;

    return {
      title: defaults.title,
      subtitle: defaults.subtitle,
      step_1: defaults.step_1,
      description_1: defaults.description_1,
      video_url_1: "https://www.youtube.com/embed/29oOROTFF4o?si=XBPqFN88iDLBuIZ5",
      step_2: defaults.step_2,
      description_2: defaults.description_2,
      video_url_2: "https://www.youtube.com/embed/2v0vxLcpICE?si=i-18Y9nNeg9hvHh8",
      step_3: defaults.step_3,
      description_3: defaults.description_3,
      video_url_3: "https://www.youtube.com/embed/m77ktn2aE0U?si=LK1DMeGJPDWUpxqE",
      help_title: defaults.help_title,
      help_description: defaults.help_description,
      help_button_text: defaults.help_button_text,
    };
  }
}

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

export default function Tutorial({ id }: TutorialProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [tutorialData, setTutorialData] = useState<TutorialData | undefined>(undefined);
  const [activeVideo, setActiveVideo] = useState<number>(0);

  const translations = {
    en: {
      currently_viewing: "Currently viewing",
      click_to_view: "Click to view",
      previous: "Previous",
      next: "Next",
      video_tutorial: "Video Tutorial",
      of: "of",
      go_to_step: "Go to step",
    },
    vi: {
      currently_viewing: "Đang xem",
      click_to_view: "Nhấn để xem",
      previous: "Trước",
      next: "Tiếp",
      video_tutorial: "Hướng Dẫn Video",
      of: "trong",
      go_to_step: "Đi đến bước",
    },
    zh: {
      currently_viewing: "正在查看",
      click_to_view: "点击查看",
      previous: "上一页",
      next: "下一页",
      video_tutorial: "视频教程",
      of: "共",
      go_to_step: "前往步骤",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTutorial(locale);
        setTutorialData(result);
      } catch (error) {
        console.error("Error fetching tutorial data:", error);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const steps = tutorialData
    ? [
      {
        step: tutorialData.step_1,
        description: tutorialData.description_1,
        video_url: tutorialData.video_url_1,
        icon: "app_registration",
      },
      {
        step: tutorialData.step_2,
        description: tutorialData.description_2,
        video_url: tutorialData.video_url_2,
        icon: "account_balance_wallet",
      },
      {
        step: tutorialData.step_3,
        description: tutorialData.description_3,
        video_url: tutorialData.video_url_3,
        icon: "trending_up",
      },
    ]
    : [];

  if (!tutorialData) {
    return (
      <div className="flex items-center justify-center py-20 font-inter">
        <div className="loader w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <section id={id}
        className={`py-12 md:py-18 relative overflow-hidden font-inter ${mytheme === "light" ? "bg-gradient-to-b from-gray-50 to-white" : "bg-gradient-to-b from-gray-900 to-gray-950"
          }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-5 ${mytheme === "light" ? "bg-gray-900" : "bg-white"}`}
            style={{
              backgroundImage: `radial-gradient(circle, ${mytheme === "light" ? "#1a202c" : "#ffffff"
                } 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${mytheme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                  }`}
              >
                <span className="material-symbols-outlined text-3xl text-blue-600">school</span>
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${mytheme === "light" ? "text-gray-900" : "text-white"
                  }`}
              >
                {tutorialData.title}
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p
                className={`text-lg max-w-3xl mx-auto ${mytheme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
              >
                {tutorialData.subtitle}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-6"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeVideo === index
                        ? mytheme === "light"
                          ? "bg-blue-50 border-l-4 border-blue-500 shadow-md"
                          : "bg-blue-900/20 border-l-4 border-blue-500 shadow-md shadow-black/10"
                        : mytheme === "light"
                          ? "bg-white border-l-4 border-transparent shadow-sm hover:shadow-md hover:bg-gray-50"
                          : "bg-gray-800 border-l-4 border-transparent shadow-sm shadow-black/5 hover:shadow-md hover:bg-gray-800/80"
                      }`}
                    onClick={() => setActiveVideo(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${activeVideo === index
                            ? mytheme === "light"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-600 text-white"
                            : mytheme === "light"
                              ? "bg-gray-100 text-gray-500"
                              : "bg-gray-700 text-gray-300"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-semibold mb-1 ${mytheme === "light" ? "text-gray-900" : "text-white"
                            }`}
                        >
                          {step.step}
                        </h3>
                        <p
                          className={`${mytheme === "light" ? "text-gray-600" : "text-gray-300"}`}
                        >
                          {step.description}
                        </p>
                        <div
                          className={`flex items-center gap-2 mt-3 ${activeVideo === index
                              ? mytheme === "light"
                                ? "text-blue-600"
                                : "text-blue-400"
                              : mytheme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                        >
                          <span className="material-symbols-outlined">{step.icon}</span>
                          <span className="text-sm font-medium">
                            {activeVideo === index ? t.currently_viewing : t.click_to_view}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  variants={fadeInUp}
                  className={`p-6 rounded-xl ${mytheme === "light"
                      ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100"
                      : "bg-gradient-to-br from-blue-900/10 to-blue-800/5 border border-blue-900/30"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${mytheme === "light" ? "bg-green-100" : "bg-green-900/30"
                        }`}
                    >
                      <span className="material-symbols-outlined text-green-600">support_agent</span>
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-1 ${mytheme === "light" ? "text-gray-900" : "text-white"
                          }`}
                      >
                        {tutorialData.help_title}
                      </h3>
                      <p
                        className={`text-sm ${mytheme === "light" ? "text-gray-600" : "text-gray-300"}`}
                      >
                        {tutorialData.help_description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            <div className="lg:col-span-3">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <motion.div
                  key={activeVideo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`overflow-hidden rounded-2xl shadow-xl ${mytheme === "light" ? "shadow-blue-200/60" : "shadow-black/50"
                    }`}
                >
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <iframe
                      src={steps[activeVideo].video_url}
                      title={`${t.video_tutorial} - ${steps[activeVideo].step}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="absolute top-0 left-0 w-full h-full border-0"
                    ></iframe>
                  </div>
                </motion.div>
                <div
                  className={`mt-6 p-4 sm:p-6 rounded-xl ${mytheme === "light" ? "bg-white shadow-md" : "bg-gray-800 shadow-lg shadow-black/10"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${mytheme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                        }`}
                    >
                      <span className="material-symbols-outlined text-blue-600">videocam</span>
                    </div>
                    <div>
                      <h3
                        className={`text-lg sm:text-xl font-semibold ${mytheme === "light" ? "text-gray-900" : "text-white"
                          }`}
                      >
                        {steps[activeVideo].step}: {steps[activeVideo].description}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm ${mytheme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                      >
                        {activeVideo + 1} {t.of} {steps.length} - {t.video_tutorial}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t ${mytheme === "light" ? "border-gray-100" : "border-gray-700 text-white"
                      }`}
                  >
                    <button
                      onClick={() => setActiveVideo((prev) => Math.max(0, prev - 1))}
                      disabled={activeVideo === 0}
                      aria-disabled={activeVideo === 0}
                      className={`min-w-[100px] sm:min-w-[120px] flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${activeVideo === 0
                          ? mytheme === "light"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : mytheme === "light"
                            ? "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
                            : "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                        } transition-colors`}
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      {t.previous}
                    </button>
                    <div className="flex gap-1 my-2 sm:my-0">
                      {steps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveVideo(index)}
                          className={`w-6 h-1 sm:w-8 sm:h-2 rounded-full cursor-pointer transition-all ${activeVideo === index
                              ? mytheme === "light"
                                ? "bg-blue-500"
                                : "bg-blue-600"
                              : mytheme === "light"
                                ? "bg-gray-200 hover:bg-gray-300"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          aria-label={`${t.go_to_step} ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveVideo((prev) => Math.min(steps.length - 1, prev + 1))}
                      disabled={activeVideo === steps.length - 1}
                      aria-disabled={activeVideo === steps.length - 1}
                      className={`min-w-[100px] sm:min-w-[120px] flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${activeVideo === steps.length - 1
                          ? mytheme === "light"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : mytheme === "light"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } transition-colors`}
                    >
                      <span className="text-white">{t.next}</span>
                      <span className="material-symbols-outlined text-white">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

          .font-inter {
            font-family: 'Inter', Arial, sans-serif;
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
        `}</style>
      </section>
    </ConfigProvider>
  );
};
