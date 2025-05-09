"use client";

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface StatisticsData {
  line_title_1: string;
  line_1: string;
  line_title_2: string;
  line_2: string;
  line_title_3: string;
  line_3: string;
}

interface Translation {
  id: number;
  statistics_id: number;
  languages_code: string;
  line_title_1: string;
  line_1: string;
  line_title_2: string;
  line_2: string;
  line_title_3: string;
  line_3: string;
}

interface RawStatisticsData {
  id: number;
  status: string;
  line_title_1: string;
  line_1: string;
  line_title_2: string;
  line_2: string;
  line_title_3: string;
  line_3: string;
  translations: Translation[];
}

async function getStatistics(locale: string): Promise<StatisticsData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://maximagoldhedging.com/items/statistics?lang=${lang}&fields=*,translations.*`,
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
    const data: RawStatisticsData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    return {
      line_1: source.line_1 || "Users Trust Our Platform",
      line_2: source.line_2 || "NO ONE LOST A SINGLE CENT",
      line_3: source.line_3 || "AVERAGE 10% ~ 20% PROFITS A MONTH",
      line_title_1: source.line_title_1 || "800+",
      line_title_2: source.line_title_2 || "100% Capital Protection",
      line_title_3: source.line_title_3 || "Consistent Returns",
    };
  } catch (error) {
    console.error("Error fetching Statistics data:", error);
    return {
      line_1: "Users Trust Our Platform",
      line_2: "NO ONE LOST A SINGLE CENT",
      line_3: "AVERAGE 10% ~ 20% PROFITS A MONTH",
      line_title_1: "800+",
      line_title_2: "100% Capital Protection",
      line_title_3: "Consistent Returns",
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

const bannerHighlight = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function BannerSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [profitCount, setProfitCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getStatistics(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Statistics data:", error);
      }
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  useEffect(() => {
    if (isCountingUp) {
      const userInterval = setInterval(() => {
        setUserCount((prev) => {
          const next = prev + 10;
          if (next >= 800) {
            clearInterval(userInterval);
            return 800;
          }
          return next;
        });
      }, 20);

      const profitInterval = setInterval(() => {
        setProfitCount((prev) => {
          const next = prev + 1;
          if (next >= 20) {
            clearInterval(profitInterval);
            return 20;
          }
          return next;
        });
      }, 100);

      return () => {
        clearInterval(userInterval);
        clearInterval(profitInterval);
      };
    }
  }, [isCountingUp]);

  if (!data) {
    return (
      <div
        className={`flex items-center justify-center py-20 ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        <div className="loader w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { line_1, line_2, line_3, line_title_1, line_title_2, line_title_3 } = data;

  return (
    <section
      className={`py-24 relative overflow-hidden font-inter ${
        mytheme === "light"
          ? "bg-gradient-to-b from-blue-50 to-slate-50"
          : "bg-gradient-to-b from-gray-900 to-gray-950"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 opacity-5 ${
            mytheme === "light" ? "bg-gray-900" : "bg-white"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, ${
              mytheme === "light" ? "#1a202c" : "#ffffff"
            } 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-gradient-x"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          onViewportEnter={() => setIsCountingUp(true)}
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          <motion.div
            className={`mb-12 py-12 px-8 rounded-2xl shadow-xl ${
              mytheme === "light"
                ? "bg-white/80 backdrop-blur-md"
                : "bg-gray-900/80 backdrop-blur-md"
            }`}
            variants={fadeInUp}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div className="mb-10" variants={fadeInUp}>
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                      mytheme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl text-blue-600">
                      groups
                    </span>
                  </div>

                  <div
                    className={`text-5xl md:text-6xl font-bold mb-4 ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {userCount}+
                  </div>

                  <div className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    {line_1}
                  </div>
                </div>

                <div className="w-24 h-1 bg-blue-500 mx-auto my-8 rounded-full"></div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <motion.div className="flex flex-col items-center" variants={fadeInUp}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      mytheme === "light" ? "bg-green-100" : "bg-green-900/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-green-600">
                      security
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {line_title_2}
                  </h3>
                  <p
                    className={`text-center ${
                      mytheme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    {line_2}
                  </p>

                  <div className="mt-4 relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={bannerHighlight}
                    />
                  </div>
                </motion.div>

                <motion.div className="flex flex-col items-center" variants={fadeInUp}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-yellow-600">
                      trending_up
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {line_title_3}
                  </h3>
                  <p
                    className={`text-center ${
                      mytheme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    {line_3} 
                  </p>

                  <div className="mt-4 relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={bannerHighlight}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

        .font-inter {
          font-family: "Inter", Arial, sans-serif;
        }

        /* Animations */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes gradient-x {
          0%,
          100% {
            transform: translateX(-50%);
          }
          50% {
            transform: translateX(50%);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </section>
  );
}