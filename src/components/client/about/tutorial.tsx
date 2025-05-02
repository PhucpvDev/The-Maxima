"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

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

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95],
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

interface Translation {
  id: number;
  tutorial_id: number;
  languages_code: string;
  title: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
}

interface TutorialData {
  title: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
}

interface RawTutorialData {
  id: number;
  status: string;
  title: string;
  step_1: string;
  description_1: string;
  video_url_1: string;
  step_2: string;
  description_2: string;
  video_url_2: string;
  step_3: string;
  description_3: string;
  video_url_3: string;
  translations: Translation[];
}

async function getTutorial(locale: string): Promise<TutorialData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `http://the-maxima.directus.app/items/tutorial?lang=${lang}&fields=*,translations.*`,
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

    return {
      title: source.title || "TUTORIAL",
      step_1: step_1 || "STEP 1",
      description_1: source.description_1 || "Register & Download",
      video_url_1: source.video_url_1 || "https://www.youtube.com/embed/29oOROTFF4o?si=XBPqFN88iDLBuIZ5",
      step_2: step_2 || "STEP 2",
      description_2: source.description_2 || "Deposit USDT",
      video_url_2: source.video_url_2 || "https://www.youtube.com/embed/2v0vxLcpICE?si=i-18Y9nNeg9hvHh8",
      step_3: step_3 || "STEP 3",
      description_3: source.description_3 || "Set Up & Start Trade",
      video_url_3: source.video_url_3 || "https://www.youtube.com/embed/m77ktn2aE0U?si=LK1DMeGJPDWUpxqE",
    };
  } catch (error) {
    console.error("Error fetching tutorial data:", error);
    return {
      title: "TUTORIAL",
      step_1: "STEP 1",
      description_1: "Register & Download",
      video_url_1: "https://www.youtube.com/embed/29oOROTFF4o?si=XBPqFN88iDLBuIZ5",
      step_2: "STEP 2",
      description_2: "Deposit USDT",
      video_url_2: "https://www.youtube.com/embed/2v0vxLcpICE?si=i-18Y9nNeg9hvHh8",
      step_3: "STEP 3",
      description_3: "Set Up & Start Trade",
      video_url_3: "https://www.youtube.com/embed/m77ktn2aE0U?si=LK1DMeGJPDWUpxqE",
    };
  }
}

const Tutorial: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [tutorialData, setTutorialData] = useState<TutorialData | undefined>(undefined);

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

  const getCSSVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  const themeConfig = {
    token: {
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!tutorialData) {
    return <div className="text-center py-12 text-xl font-poppins">Loading...</div>;
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`md:py-16 py-8 px-4 sm:px-6 lg:px-8 text-center ${
          mytheme === "light" ? "bg-[#F7FAFC]" : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            className={`text-4xl sm:text-4xl font-bold font-poppins ${
              mytheme === "light" ? "text-gray-800" : "text-yellow-600"
            }`}
            variants={childVariants}
          >
            {tutorialData.title}
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.2 }}
            className={`p-6 flex flex-col rounded-xl shadow-lg ${
              mytheme === "light" ? "bg-white" : "bg-black/50 border border-yellow-800"
            }`}
          >
            <motion.p
              className={`text-xl font-semibold font-poppins ${
                mytheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
              variants={childVariants}
            >
              {tutorialData.step_1}
            </motion.p>
            <motion.p
              className={`text-lg font-medium pb-3 font-poppins ${
                mytheme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
              variants={childVariants}
            >
              {tutorialData.description_1}
            </motion.p>
            <motion.div
              className="relative w-full aspect-video rounded-xl overflow-hidden"
              variants={childVariants}
            >
              <iframe
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                src={tutorialData.video_url_1}
                title="YouTube video player - Step 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.2 }}
            className={`p-6 flex flex-col rounded-xl shadow-lg ${
              mytheme === "light" ? "bg-white" : "bg-black/50 border border-yellow-800"
            }`}
          >
            <motion.p
              className={`text-xl font-semibold font-poppins ${
                mytheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
              variants={childVariants}
            >
              {tutorialData.step_2}
            </motion.p>
            <motion.p
              className={`text-lg font-medium pb-3 font-poppins ${
                mytheme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
              variants={childVariants}
            >
              {tutorialData.description_2}
            </motion.p>
            <motion.div
              className="relative w-full aspect-video rounded-xl overflow-hidden"
              variants={childVariants}
            >
              <iframe
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                src={tutorialData.video_url_2}
                title="YouTube video player - Step 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </motion.div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.2 }}
            className={`p-6 flex flex-col rounded-xl shadow-lg ${
              mytheme === "light" ? "bg-white" : "bg-black/50 border border-yellow-800"
            }`}
          >
            <motion.p
              className={`text-xl font-semibold font-poppins ${
                mytheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
              variants={childVariants}
            >
              {tutorialData.step_3}
            </motion.p>
            <motion.p
              className={`text-lg font-medium pb-3 font-poppins ${
                mytheme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
              variants={childVariants}
            >
              {tutorialData.description_3}
            </motion.p>
            <motion.div
              className="relative w-full aspect-video rounded-xl overflow-hidden"
              variants={childVariants}
            >
              <iframe
                width="100%"
                height="100%"
                className="absolute top-0 left-0"
                src={tutorialData.video_url_3}
                title="YouTube video player - Step 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </motion.div>
          </motion.div>
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', Arial, Helvetica, sans-serif;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default Tutorial;