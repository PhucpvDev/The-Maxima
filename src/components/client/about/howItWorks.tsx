"use client";

import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import type { StepsProps } from "antd";
import { Popover } from "antd";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import "antd/dist/reset.css";

interface Translation {
  id: number;
  how_it_works_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  conclusion?: string; // Use 'conclusion' as the standard field
  step_title_1: string;
  description_1: string;
  step_title_2: string;
  description_2: string;
  step_title_3: string;
  description_3: string;
  step_title_4: string;
  description_4: string;
  step_title_5: string;
  description_5: string;
  step_title_6: string;
  description_6: string;
}

interface Step {
  title: string;
  description: string;
}

interface HowItWorksData {
  title: string;
  subtitle: string;
  conclusion: string;
  steps: Step[];
}

interface RawHowItWorksData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  conclusion?: string; // Main data uses 'conclusion'
  step_title_1: string;
  description_1: string;
  step_title_2: string;
  description_2: string;
  step_title_3: string;
  description_3: string;
  step_title_4: string;
  description_4: string;
  step_title_5: string;
  description_5: string;
  step_title_6: string;
  description_6: string;
  translations: Translation[];
}

async function getHowItWorks(locale: string): Promise<HowItWorksData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `http://the-maxima.directus.app/items/how_it_works?lang=${lang}&fields=*,translations.*`,
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
    const data: RawHowItWorksData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    // Handle the typo in the API response: check for both 'conclusion' and 'conclution'
    const conclusion =
      // @ts-ignore: Handle the typo in the API response
      source.conclusion || source.conclution || "Earn profits consistently with Maxima’s decentralized system!\n\nThe world’s leading decentralized AI trading platform";

    return {
      title: source.title || "Maxima Trading Model",
      subtitle: source.subtitle || "Maximize Profits with Ease",
      conclusion,
      steps: [
        {
          title: source.step_title_1 || "REGISTER ACCOUNT",
          description: source.description_1 || "Register with Maxima platform.",
        },
        {
          title: source.step_title_2 || "CONNECT WALLET",
          description: source.description_2 || "Link your wallet to Maxima for secure trading access.",
        },
        {
          title: source.step_title_3 || "ACTIVATE MAXIMA",
          description: source.description_3 || "Enable Maxima to begin your trading journey.",
        },
        {
          title: source.step_title_4 || "SET STRATEGY",
          description: source.description_4 || "Configure your trading strategy with Maxima’s AI for optimal performance.",
        },
        {
          title: source.step_title_5 || "START TRADING",
          description: source.description_5 || "Launch trades using Maxima’s automated system for profits.",
        },
        {
          title: source.step_title_6 || "MONITOR PROFITS",
          description: source.description_6 || "Track your earnings in real time.",
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching How It Works data:", error);
    return {
      title: "Maxima Trading Model",
      subtitle: "Maximize Profits with Ease",
      conclusion: "Earn profits consistently with Maxima’s decentralized system!\n\nThe world’s leading decentralized AI trading platform",
      steps: [
        {
          title: "REGISTER ACCOUNT",
          description: "Register with Maxima platform.",
        },
        {
          title: "CONNECT WALLET",
          description: "Link your wallet to Maxima for secure trading access.",
        },
        {
          title: "ACTIVATE MAXIMA",
          description: "Enable Maxima to begin your trading journey.",
        },
        {
          title: "SET STRATEGY",
          description: "Configure your trading strategy with Maxima’s AI for optimal performance.",
        },
        {
          title: "START TRADING",
          description: "Launch trades using Maxima’s automated system for profits.",
        },
        {
          title: "MONITOR PROFITS",
          description: "Track your earnings in real time.",
        },
      ],
    };
  }
}

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

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const customDot: StepsProps["progressDot"] = (dot, { title, index }) => (
  <Popover
    content={
      <span className="font-poppins text-lg">
        Step {index + 1}: {title}
      </span>
    }
  >
    {dot}
  </Popover>
);

const HowItWorks: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<HowItWorksData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getHowItWorks(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching How It Works data:", error);
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

  if (!data) {
    return (
      <div
        className={`text-center py-12 text-xl font-poppins ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        Loading...
      </div>
    );
  }

  const { title, subtitle, steps, conclusion } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`md:py-20 py-12 px-6 text-center font-poppins ${
          mytheme === "light"
            ? "bg-gradient-to-b from-[#F7FAFC] to-[#E5E7EB]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className={`text-3xl md:text-5xl font-bold ${
              mytheme === "light" ? "text-gray-900" : "text-yellow-600"
            }`}
            variants={childVariants}
          >
            {title}
          </motion.h2>
          <motion.p
            className={`text-2xl md:text-3xl font-semibold mt-6 italic ${
              mytheme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
            variants={childVariants}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Steps
            progressDot={customDot}
            current={-1}
            direction="horizontal"
            responsive
            className={`${
              mytheme === "light"
                ? "[&_.ant-steps-item-title]:text-gray-900 [&_.ant-steps-item-description]:text-gray-600"
                : "[&_.ant-steps-item-title]:text-gray-200 [&_.ant-steps-item-description]:text-gray-400"
            } [&_.ant-steps-item-title]:font-bold [&_.ant-steps-item-title]:text-lg [&_.ant-steps-item-title]:font-poppins [&_.ant-steps-item-description]:text-base [&_.ant-steps-item-description]:whitespace-pre-line [&_.ant-steps-item-description]:font-poppins`}
            items={steps.map((step, index) => ({
              title: (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`font-poppins text-lg ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  {step.title}
                </motion.div>
              ),
              description: (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`font-poppins text-base ${
                    mytheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </motion.div>
              ),
            }))}
          />
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto mb-16 mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className={`border-2 rounded-xl p-3 shadow-xl ${
              mytheme === "light"
                ? "border-yellow-900 bg-white"
                : "border-yellow-800 bg-black/50"
            }`}
            variants={childVariants}
          >
            {conclusion.split("\n\n").map((line, index) => (
              <p
                key={index}
                className={`text-xl font-bold uppercase font-poppins mt-4 first:mt-0 ${
                  mytheme === "light" ? "text-yellow-800" : "text-white"
                }`}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', Arial, Helvetica, sans-serif;
          }
          .ant-steps .ant-steps-item-icon .ant-steps-icon {
            background: ${mytheme === "light" ? "#1E40AF" : "#FFC800"} !important;
            color: #ffffff !important;
            font-size: 18px !important;
          }
          .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
            border-color: ${mytheme === "light" ? "#1E40AF" : "#FFC800"} !important;
          }
          .ant-steps .ant-steps-item-process .ant-steps-item-icon {
            border-color: ${mytheme === "light" ? "#1E40AF" : "#FFC800"} !important;
          }
          .ant-steps .ant-steps-item-tail::after {
            background: ${mytheme === "light" ? "#1E40AF" : "#FFC800"} !important;
            opacity: 0.5;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default HowItWorks;