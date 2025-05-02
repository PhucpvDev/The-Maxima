"use client";

import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  hover: { 
    scale: 1.02, 
    boxShadow: "0 0 20px rgba(161, 98, 7, 0.5)", // Muted yellow glow on hover (yellow-700)
    transition: { duration: 0.3 }
  },
};

interface Point {
  title: string;
  desc: string;
}

interface Translation {
  id: number;
  traditional_vs_maxima_ib_id: number;
  languages_code: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: string;
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: string;
}

interface TraditionalVsMaximaIBData {
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: Point[];
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: Point[];
}

interface RawTraditionalVsMaximaIBData {
  id: number;
  status: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: string;
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: string;
  translations: Translation[];
}

function parsePoints(pointsString: string): Point[] {
  const points = pointsString.trim().split("•\n").filter((item) => item);
  const result: Point[] = [];
  for (let i = 0; i < points.length; i += 2) {
    if (points[i] && points[i + 1]) {
      result.push({
        title: points[i].trim(),
        desc: points[i + 1].trim(),
      });
    }
  }
  return result;
}

async function getTraditionalVsMaximaIb(locale: string): Promise<TraditionalVsMaximaIBData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `http://the-maxima.directus.app/items/traditional_vs_maxima_ib?lang=${lang}&fields=*,translations.*`,
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
    const data: RawTraditionalVsMaximaIBData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    return {
      traditional_title: source.traditional_title || "TRADITIONAL I.B",
      traditional_subtitle: source.traditional_subtitle || "Problems of Traditional Independent Broker Houses",
      traditional_points: parsePoints(
        source.traditional_points ||
        "•\nIncome Solely Dependent on Trading Volume\n•\nTraditional brokers earn only from client trading activities, making income highly variable.\n•\nClients Lack Long-Term Profitability\n•\nMost brokers cannot ensure client profitability, leading to dissatisfaction and loss of trust.\n•\nHigh Churn Rates\n•\nClients often leave due to losses, forcing brokers to constantly acquire new customers to maintain income.\n•\nUnsustainable Business Model\n•\nConstantly finding new clients increases costs, while the lack of recurring revenue makes income unpredictable.\n•\nUnstable Income\n•\nWithout a system to retain clients, income remains inconsistent and dependent on external factors."
      ),
      maxima_title: source.maxima_title || "MAXIMA I.B 2.0",
      maxima_subtitle: source.maxima_subtitle || "Revolutionizing Introducing Broker Concept",
      maxima_points: parsePoints(
        source.maxima_points ||
        "•\nStable, Lifetime Commissions\n•\nMaxima I.B 2.0’s innovative system ensures IBs earn lifetime commissions as traders stay profitable and loyal.\n•\nLower Client Churn Rate\n•\nThe hedging trading model keeps clients profitable, reducing the need to chase new clients constantly.\n•\nProfitable Clients = Profitable IBs\n•\nMaxima I.B 2.0 ensures traders earn consistent profits, building trust and long-term relationships between IBs and their clients.\n•\nSustainable Income\n•\nWith Maxima I.B 2.0’s unique revenue-sharing model, IBs enjoy steady, predictable income, even during market fluctuations.\n•\nComprehensive Support System\n•\nTraining resources, tools, and community guidance provided by Maxima I.B 2.0 empower IBs to grow and maintain their networks efficiently."
      ),
    };
  } catch (error) {
    console.error("Error fetching Traditional vs Maxima I.B data:", error);
    return {
      traditional_title: "TRADITIONAL I.B",
      traditional_subtitle: "Problems of Traditional Independent Broker Houses",
      traditional_points: parsePoints(
        "•\nIncome Solely Dependent on Trading Volume\n•\nTraditional brokers earn only from client trading activities, making income highly variable.\n•\nClients Lack Long-Term Profitability\n•\nMost brokers cannot ensure client profitability, leading to dissatisfaction and loss of trust.\n•\nHigh Churn Rates\n•\nClients often leave due to losses, forcing brokers to constantly acquire new customers to maintain income.\n•\nUnsustainable Business Model\n•\nConstantly finding new clients increases costs, while the lack of recurring revenue makes income unpredictable.\n•\nUnstable Income\n•\nWithout a system to retain clients, income remains inconsistent and dependent on external factors."
      ),
      maxima_title: "MAXIMA I.B 2.0",
      maxima_subtitle: "Revolutionizing Introducing Broker Concept",
      maxima_points: parsePoints(
        "•\nStable, Lifetime Commissions\n•\nMaxima I.B 2.0’s innovative system ensures IBs earn lifetime commissions as traders stay profitable and loyal.\n•\nLower Client Churn Rate\n•\nThe hedging trading model keeps clients profitable, reducing the need to chase new clients constantly.\n•\nProfitable Clients = Profitable IBs\n•\nMaxima I.B 2.0 ensures traders earn consistent profits, building trust and long-term relationships between IBs and their clients.\n•\nSustainable Income\n•\nWith Maxima I.B 2.0’s unique revenue-sharing model, IBs enjoy steady, predictable income, even during market fluctuations.\n•\nComprehensive Support System\n•\nTraining resources, tools, and community guidance provided by Maxima I.B 2.0 empower IBs to grow and maintain their networks efficiently."
      ),
    };
  }
}

export default function MaximaVsTraditionalSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TraditionalVsMaximaIBData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getTraditionalVsMaximaIb(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Traditional vs Maxima I.B data:", error);
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
        className={`text-center py-16 text-2xl font-poppins ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        Loading...
      </div>
    );
  }

  const {
    traditional_title,
    traditional_subtitle,
    traditional_points,
    maxima_title,
    maxima_subtitle,
    maxima_points,
  } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`py-16 sm:py-24 relative overflow-hidden ${
          mytheme === "light"
            ? "bg-[#F4F8FB]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className={`w-16 h-16 pl-2 pt-2 rounded-full hidden md:block flex items-center justify-center shadow-lg shadow-yellow-700/30 ${
              mytheme === "light"
                ? "bg-yellow-500"
                : "bg-gradient-to-r from-yellow-600 to-yellow-700"
            }`}
          >
            <Image
              src={IMAGES.Logo3}
              alt="Loading Logo"
              width={48}
              height={48}
              priority
              className="drop-shadow-md"
            />
          </div>
        </div>
        <div className="absolute z-0 opacity-50">
          <Image
            src={IMAGES.BgFooter1}
            alt="Background decoration left"
            width={300}
            height={300}
            priority
            className="filter hue-rotate-60"
          />
        </div>
        <div className="absolute right-0 z-0 top-20 opacity-60">
          <Image
            src={IMAGES.BgFooter2}
            alt="Background decoration right"
            width={900}
            height={300}
            priority
            className="filter hue-rotate-60"
          />
        </div>

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Row gutter={[32, 48]}>
            {/* Traditional I.B */}
            <Col xs={24} lg={12}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className={`rounded-xl shadow-lg p-8 ${
                  mytheme === "light"
                    ? "bg-white"
                    : "bg-[#1a1a1a] border border-yellow-700 shadow-yellow-700/30"
                }`}
              >
                <motion.h3
                  className={`text-3xl sm:text-4xl font-bold mb-4 font-poppins ${
                    mytheme === "light" ? "text-gray-800" : "text-yellow-600"
                  }`}
                  variants={childVariants}
                >
                  {traditional_title}
                </motion.h3>
                <motion.p
                  className={`mb-6 text-xl font-poppins font-medium ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                  variants={childVariants}
                >
                  {traditional_subtitle}
                </motion.p>
                <ul className={`space-y-6 list-none ml-0`}>
                  {traditional_points.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={childVariants}
                      className="motion-item"
                    >
                      <div className="flex items-baseline mb-2">
                        <span
                          className={`mr-3 text-xl ${
                            mytheme === "light" ? "text-[#3B82F6]" : "text-yellow-700"
                          }`}
                        >
                          •
                        </span>
                        <span
                          className={`font-semibold text-xl font-poppins ${
                            mytheme === "light" ? "text-gray-800" : "text-yellow-500"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <ul className="ml-8 mt-2 list-none">
                        <li className="flex items-baseline">
                          <span
                            className={`mr-3 text-lg ${
                              mytheme === "light" ? "text-[#3B82F6]" : "text-yellow-700"
                            }`}
                          >
                            •
                          </span>
                          <span
                            className={`font-poppins text-lg ${
                              mytheme === "light" ? "text-gray-800" : "text-gray-200"
                            }`}
                          >
                            {item.desc}
                          </span>
                        </li>
                      </ul>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Col>

            {/* Maxima I.B */}
            <Col xs={24} lg={12}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className={`rounded-xl shadow-lg p-8 ${
                  mytheme === "light"
                    ? "bg-white"
                    : "bg-[#1a1a1a] border border-yellow-700 shadow-yellow-700/30"
                }`}
              >
                <motion.h3
                  className={`text-3xl sm:text-4xl font-bold mb-4 font-poppins ${
                    mytheme === "light" ? "text-gray-800" : "text-yellow-600"
                  }`}
                  variants={childVariants}
                >
                  {maxima_title}
                </motion.h3>
                <motion.p
                  className={`mb-6 text-xl font-poppins font-medium ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                  variants={childVariants}
                >
                  {maxima_subtitle}
                </motion.p>
                <ul className={`space-y-6 list-none ml-0`}>
                  {maxima_points.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={childVariants}
                      className="motion-item"
                    >
                      <div className="flex items-baseline mb-2">
                        <span
                          className={`mr-3 text-xl ${
                            mytheme === "light" ? "text-[#3B82F6]" : "text-yellow-700"
                          }`}
                        >
                          •
                        </span>
                        <span
                          className={`font-semibold text-xl font-poppins ${
                            mytheme === "light" ? "text-gray-800" : "text-yellow-500"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <ul className="ml-8 mt-2 list-none">
                        <li className="flex items-baseline">
                          <span
                            className={`mr-3 text-lg ${
                              mytheme === "light" ? "text-[#3B82F6]" : "text-yellow-700"
                            }`}
                          >
                            •
                          </span>
                          <span
                            className={`font-poppins text-lg ${
                              mytheme === "light" ? "text-gray-800" : "text-gray-200"
                            }`}
                          >
                            {item.desc}
                          </span>
                        </li>
                      </ul>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Col>
          </Row>
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
}