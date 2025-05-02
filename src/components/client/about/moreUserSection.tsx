"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

interface StatisticsData {
  line_1: string;
  line_2: string;
  line_3: string;
  button_text: string;
}

interface Translation {
  id: number;
  statistics_id: number;
  languages_code: string;
  line_1: string;
  line_2: string;
  line_3: string;
  button_text: string;
}

interface RawStatisticsData {
  id: number;
  status: string;
  line_1: string;
  line_2: string;
  line_3: string;
  button_text: string;
  translations: Translation[];
}

async function getStatistics(locale: string): Promise<StatisticsData> {
  try {
    // Map locale to language code
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/statistics?lang=${lang}&fields=*,translations.*`,
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

    // Find the translation matching the locale
    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    // Use translation if found, otherwise fall back to default fields
    const source = translation || data;

    // Override line_3 for en-US due to typo in translation
    const line_3 = lang === "en-US" ? data.line_3 : source.line_3;

    return {
      line_1: source.line_1 || "MORE THAN 800 USERS",
      line_2: source.line_2 || "NO ONE LOST A SINGLE CENT",
      line_3: line_3 || "AVERAGE 10% ~ 20% PROFITS A MONTH",
      button_text: source.button_text || "Start Now",
    };
  } catch (error) {
    console.error("Error fetching Statistics data:", error);
    // Return fallback data
    return {
      line_1: "MORE THAN 800 USERS",
      line_2: "NO ONE LOST A SINGLE CENT",
      line_3: "AVERAGE 10% ~ 20% PROFITS A MONTH",
      button_text: "Start Now",
    };
  }
}

export default function BannerSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<StatisticsData | null>(null);

  // Fetch data when component mounts or locale changes
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

  if (!data) {
    return (
      <div
        className={`text-center py-16 text-2xl font-poppins ${
          mytheme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        Loading...
      </div>
    );
  }

  const { line_1, line_2, line_3, button_text } = data;

  return (
    <motion.div
      className={`py-16 flex flex-col items-center justify-center text-center ${
        mytheme === "light"
          ? "bg-[#F0F8FF]"
          : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
      }`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        className={`text-4xl font-bold mb-4 font-poppins ${
          mytheme === "light" ? "text-gray-800" : "text-yellow-600"
        }`}
        variants={childVariants}
      >
        {line_1}
      </motion.p>
      <motion.p
        className={`text-lg font-bold mb-2 font-poppins ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
        variants={childVariants}
      >
        {line_2}
      </motion.p>
      <motion.p
        className={`text-lg font-bold mb-6 font-poppins ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
        variants={childVariants}
      >
        {line_3}
      </motion.p>
      <motion.div className="text-white" variants={childVariants}>
        <button
          className={`font-medium px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto text-white ${
            mytheme === "light"
              ? "bg-orange-400 hover:bg-orange-500"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          aria-label={button_text}
        >
          {button_text}
        </button>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
      `}</style>
    </motion.div>
  );
}