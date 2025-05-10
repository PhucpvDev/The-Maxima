"use client"

import React, { useState, useEffect } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface Point {
  title: string;
  desc: string;
}

interface Translation {
  id: number;
  traditional_vs_maxima_ib_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: string;
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: string;
  step_title_1: string;
  step_description_1: string;
  step_title_2: string;
  step_description_2: string;
  step_title_3: string;
  step_description_3: string;
}

interface TraditionalVsMaximaIBData {
  title: string;
  subtitle: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: Point[];
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: Point[];
  step_title_1: string;
  step_description_1: string;
  step_title_2: string;
  step_description_2: string;
  step_title_3: string;
  step_description_3: string;
}

interface RawTraditionalVsMaximaIBData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: string;
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: string;
  step_title_1: string;
  step_description_1: string;
  step_title_2: string;
  step_description_2: string;
  step_title_3: string;
  step_description_3: string;
  translations: Translation[];
}

function parsePoints(pointsString: string): Point[] {
  const normalizedString = pointsString
    .replace(/•\s*\n/g, '• ') 
    .replace(/^\s*-\s*/gm, '• ')
    .replace(/^\s*·\s*/gm, '• ') 
    .replace(/\n\s*•/g, '\n•') 
    .trim();

  const lines = normalizedString.split('\n').map(line => line.trim()).filter(line => line);


  const result: Point[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    const title = lines[i]?.replace(/^•\s*/, '').trim(); 
    const desc = lines[i + 1]?.replace(/^•\s*/, '').trim() || ''; 
    if (title) {
      result.push({
        title,
        desc,
      });
    }
  }

  return result;
}

async function getTraditionalVsMaximaIb(locale: string): Promise<TraditionalVsMaximaIBData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/traditional_vs_maxima_ib?lang=${lang}&fields=*,translations.*`,
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
      title: source.title || "Comparison",
      subtitle: source.subtitle || "Discover how Maxima IB 2.0 solves the inherent problems of traditional introducing broker models",
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
        "•\nStable, Lifetime Commissions\n•\nMaxima I.B 2.0's innovative system ensures IBs earn lifetime commissions as traders stay profitable and loyal.\n•\nLower Client Churn Rate\n•\nThe hedging trading model keeps clients profitable, reducing the need to chase new clients constantly.\n•\nProfitable Clients = Profitable IBs\n•\nMaxima I.B 2.0 ensures traders earn consistent profits, building trust and long-term relationships between IBs and their clients.\n•\nSustainable Income\n•\nWith Maxima I.B 2.0's unique revenue-sharing model, IBs enjoy steady, predictable income, even during market fluctuations.\n•\nComprehensive Support System\n•\nTraining resources, tools, and community guidance provided by Maxima I.B 2.0 empower IBs to grow and maintain their networks efficiently."
      ),
      step_title_1: source.step_title_1 || "Sustainable Business",
      step_description_1: source.step_description_1 || "Unlike traditional models that require constant client acquisition, Maxima IB 2.0 builds sustainable, long-term business relationships.",
      step_title_2: source.step_title_2 || "Revenue Model",
      step_description_2: source.step_description_2 || "Maxima's revenue-sharing model provides consistent income for IBs, even during market fluctuations, unlike traditional volume-dependent models.",
      step_title_3: source.step_title_3 || "Client Retention",
      step_description_3: source.step_description_3 || "With Maxima's AI-driven trading system, clients achieve consistent profitability, resulting in dramatically improved client retention rates.",
    };
  } catch (error) {
    console.error("Error fetching Traditional vs Maxima I.B data:", error);
    return {
      title: "Comparison",
      subtitle: "Discover how Maxima IB 2.0 solves the inherent problems of traditional introducing broker models",
      traditional_title: "TRADITIONAL I.B",
      traditional_subtitle: "Problems of Traditional Independent Broker Houses",
      traditional_points: parsePoints(
        "•\nIncome Solely Dependent on Trading Volume\n•\nTraditional brokers earn only from client trading activities, making income highly variable.\n•\nClients Lack Long-Term Profitability\n•\nMost brokers cannot ensure client profitability, leading to dissatisfaction and loss of trust.\n•\nHigh Churn Rates\n•\nClients often leave due to losses, forcing brokers to constantly acquire new customers to maintain income.\n•\nUnsustainable Business Model\n•\nConstantly finding new clients increases costs, while the lack of recurring revenue makes income unpredictable.\n•\nUnstable Income\n•\nWithout a system to retain clients, income remains inconsistent and dependent on external factors."
      ),
      maxima_title: "MAXIMA I.B 2.0",
      maxima_subtitle: "Revolutionizing Introducing Broker Concept",
      maxima_points: parsePoints(
        "•\nStable, Lifetime Commissions\n•\nMaxima I.B 2.0's innovative system ensures IBs earn lifetime commissions as traders stay profitable and loyal.\n•\nLower Client Churn Rate\n•\nThe hedging trading model keeps clients profitable, reducing the need to chase new clients constantly.\n•\nProfitable Clients = Profitable IBs\n•\nMaxima I.B 2.0 ensures traders earn consistent profits, building trust and long-term relationships between IBs and their clients.\n•\nSustainable Income\n•\nWith Maxima I.B 2.0's unique revenue-sharing model, IBs enjoy steady, predictable income, even during market fluctuations.\n•\nComprehensive Support System\n•\nTraining resources, tools, and community guidance provided by Maxima I.B 2.0 empower IBs to grow and maintain their networks efficiently."
      ),
      step_title_1: "Sustainable Business",
      step_description_1: "Unlike traditional models that require constant client acquisition, Maxima IB 2.0 builds sustainable, long-term business relationships.",
      step_title_2: "Revenue Model",
      step_description_2: "Maxima's revenue-sharing model provides consistent income for IBs, even during market fluctuations, unlike traditional volume-dependent models.",
      step_title_3: "Client Retention",
      step_description_3: "With Maxima's AI-driven trading system, clients achieve consistent profitability, resulting in dramatically improved client retention rates.",
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
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const pointVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const highlightVariants = {
  initial: { width: 0 },
  animate: { 
    width: "100%", 
    transition: { 
      duration: 0.5, 
      ease: "easeInOut" 
    } 
  }
};

export default function MaximaVsTraditionalSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TraditionalVsMaximaIBData | null>(null);
  const [activeTab, setActiveTab] = useState<'traditional' | 'maxima'>('maxima');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getTraditionalVsMaximaIb(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Traditional vs Maxima I.B data:", error);
        setData(null);
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

  if (!data) {
    return (
      <div className={`flex items-center justify-center py-20 ${
        mytheme === "light" ? "text-gray-800" : "text-gray-200"
      }`}>
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    title,
    subtitle,
    traditional_title,
    traditional_subtitle,
    traditional_points,
    maxima_title,
    maxima_subtitle,
    maxima_points,
    step_title_1,
    step_description_1,
    step_title_2,
    step_description_2,
    step_title_3,
    step_description_3,
  } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <div id="become-ib" className={`py-20 md:py-28 relative overflow-hidden font-inter ${
        mytheme === "light"
          ? "bg-gray-50"
          : "bg-gray-950"
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          {mytheme === "light" ? (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-yellow-50 to-transparent opacity-50"></div>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950/30 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-yellow-900/20 to-transparent"></div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-20">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              mytheme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {title}
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
            <p className={`text-lg max-w-3xl mx-auto ${
              mytheme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              {subtitle}
            </p>
          </motion.div>

          <div className="md:hidden mb-8 flex space-x-2 justify-center">
            <button
              onClick={() => setActiveTab('traditional')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'traditional' 
                  ? mytheme === "light"
                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                    : "bg-red-700 text-white shadow-lg shadow-red-900/30"
                  : mytheme === "light"
                    ? "bg-white text-gray-700"
                    : "bg-gray-800 text-gray-300"
              }`}
            >
              {traditional_title}
            </button>
            <button
              onClick={() => setActiveTab('maxima')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'maxima' 
                  ? mytheme === "light"
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : "bg-green-700 text-white shadow-lg shadow-green-900/30"
                  : mytheme === "light"
                    ? "bg-white text-gray-700"
                    : "bg-gray-800 text-gray-300"
              }`}
            >
              {maxima_title}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            <motion.div 
              className={`rounded-2xl shadow-xl overflow-hidden ${
                mytheme === "light"
                  ? "bg-white"
                  : "bg-gray-900"
              } ${activeTab === 'traditional' ? 'block' : 'hidden md:block'}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              <div className={`px-6 py-6 ${
                mytheme === "light" 
                  ? "bg-gradient-to-r from-red-500 to-red-600" 
                  : "bg-gradient-to-r from-red-700 to-red-800"
              }`}>
                <motion.h3 
                  className="text-2xl font-bold text-white mb-1"
                  variants={fadeInUp}
                >
                  {traditional_title}
                </motion.h3>
                <motion.p 
                  className="text-white text-lg"
                  variants={fadeInUp}
                >
                  {traditional_subtitle || "No subtitle available"}
                </motion.p>
              </div>
              
              <div className="p-6 space-y-6 h-full">
                {traditional_points.length > 0 ? (
                  traditional_points.map((point, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        mytheme === "light" 
                          ? "bg-red-50" 
                          : "bg-red-900/20"
                      }`}
                      variants={pointVariants}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                          mytheme === "light" 
                            ? "bg-red-100 text-red-600" 
                            : "bg-red-800 text-red-200"
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {index === 0 ? "trending_down" : 
                            index === 1 ? "person_cancel" : 
                            index === 2 ? "moving" : 
                            index === 3 ? "cycle" : 
                            "error"}
                          </span>
                        </div>
                        <h4 className={`font-semibold text-lg ${
                          mytheme === "light" 
                            ? "text-gray-900" 
                            : "text-white"
                        }`}>
                          {point.title}
                        </h4>
                      </div>
                      <p className={`pl-11 text-base ${
                        mytheme === "light" 
                          ? "text-gray-600" 
                          : "text-gray-300"
                      }`}>
                        {point.desc || "No description available"}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className={`text-base ${
                    mytheme === "light" 
                      ? "text-gray-600" 
                      : "text-gray-300"
                  }`}>
                    No points available
                  </p>
                )}
              </div>
              
              <div className={`px-6 py-4 ${
                mytheme === "light" 
                  ? "bg-red-50 border-t border-red-100" 
                  : "bg-red-900/10 border-t border-red-800/30"
              }`}>
                <p className={`text-sm ${
                  mytheme === "light" 
                    ? "text-red-600" 
                    : "text-red-300"
                }`}>
                  <span className="material-symbols-outlined text-sm align-middle mr-1">warning</span>
                  Traditional IB models lead to unstable income and high client turnover
                </p>
              </div>
            </motion.div>

            <motion.div 
              className={`rounded-2xl shadow-xl overflow-hidden ${
                mytheme === "light"
                  ? "bg-white"
                  : "bg-gray-900"
              } ${activeTab === 'maxima' ? 'block' : 'hidden md:block'}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              <div className={`px-6 py-6 ${
                mytheme === "light" 
                  ? "bg-gradient-to-r from-green-500 to-green-600" 
                  : "bg-gradient-to-r from-green-700 to-green-800"
              }`}>
                <motion.h3 
                  className="text-2xl font-bold text-white mb-1"
                  variants={fadeInUp}
                >
                  {maxima_title}
                </motion.h3>
                <motion.p 
                  className="text-white text-lg"
                  variants={fadeInUp}
                >
                  {maxima_subtitle || "No subtitle available"}
                </motion.p>
              </div>
              
              <div className="p-6 space-y-6 h-full">
                {maxima_points.length > 0 ? (
                  maxima_points.map((point, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        mytheme === "light" 
                          ? "bg-green-50" 
                          : "bg-green-900/20"
                      }`}
                      variants={pointVariants}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                          mytheme === "light" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-green-800 text-green-200"
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {index === 0 ? "payments" : 
                            index === 1 ? "group" : 
                            index === 2 ? "handshake" : 
                            index === 3 ? "trending_up" : 
                            "support"}
                          </span>
                        </div>
                        <h4 className={`font-semibold text-lg ${
                          mytheme === "light" 
                            ? "text-gray-900" 
                            : "text-white"
                        }`}>
                          {point.title}
                        </h4>
                      </div>
                      <p className={`pl-11 text-base ${
                        mytheme === "light" 
                          ? "text-gray-600" 
                          : "text-gray-300"
                      }`}>
                        {point.desc || "No description available"}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className={`text-base ${
                    mytheme === "light" 
                      ? "text-gray-600" 
                      : "text-gray-300"
                  }`}>
                    No points available
                  </p>
                )}
              </div>
              
              <div className={`px-6 py-4 ${
                mytheme === "light" 
                  ? "bg-green-50 border-t border-green-100" 
                  : "bg-green-900/10 border-t border-green-800/30"
              }`}>
                <p className={`text-sm ${
                  mytheme === "light" 
                    ? "text-green-600" 
                    : "text-green-300"
                }`}>
                  <span className="material-symbols-outlined text-sm align-middle mr-1">verified</span>
                  Maxima IB 2.0 ensures sustainable income and long-term client relationships
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div 
              className={`rounded-lg p-6 ${
                mytheme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-900 shadow-xl shadow-black/20"
              }`}
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mytheme === "light" 
                    ? "bg-blue-100" 
                    : "bg-blue-900/30"
                }`}>
                  <span className="material-symbols-outlined text-blue-600">
                    autorenew
                  </span>
                </div>
                <h4 className={`font-semibold text-lg ${
                  mytheme === "light" 
                    ? "text-gray-900" 
                    : "text-white"
                }`}>
                  {step_title_1}
                </h4>
              </div>
              <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={highlightVariants}
                />
              </div>
              <p className={`text-base ${
                mytheme === "light" 
                  ? "text-gray-600" 
                  : "text-gray-300"
              }`}>
                {step_description_1}
              </p>
            </motion.div>
            
            <motion.div 
              className={`rounded-lg p-6 ${
                mytheme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-900 shadow-xl shadow-black/20"
              }`}
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mytheme === "light" 
                    ? "bg-yellow-100" 
                    : "bg-yellow-900/30"
                }`}>
                  <span className="material-symbols-outlined text-yellow-600">
                    currency_exchange
                  </span>
                </div>
                <h4 className={`font-semibold text-lg ${
                  mytheme === "light" 
                    ? "text-gray-900" 
                    : "text-white"
                }`}>
                  {step_title_2}
                </h4>
              </div>
              <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={highlightVariants}
                />
              </div>
              <p className={`text-base ${
                mytheme === "light" 
                  ? "text-gray-600" 
                  : "text-gray-300"
              }`}>
                {step_description_2}
              </p>
            </motion.div>
            
            <motion.div 
              className={`rounded-lg p-6 ${
                mytheme === "light"
                  ? "bg-white shadow-lg"
                  : "bg-gray-900 shadow-xl shadow-black/20"
              }`}
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mytheme === "light" 
                    ? "bg-green-100" 
                    : "bg-green-900/30"
                }`}>
                  <span className="material-symbols-outlined text-green-600">
                    hub
                  </span>
                </div>
                <h4 className={`font-semibold text-lg ${
                  mytheme === "light" 
                    ? "text-gray-900" 
                    : "text-white"
                }`}>
                  {step_title_3}
                </h4>
              </div>
              <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={highlightVariants}
                />
              </div>
              <p className={`text-base ${
                mytheme === "light" 
                  ? "text-gray-600" 
                  : "text-gray-300"
              }`}>
                {step_description_3}
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
          
          .font-inter {
            font-family: 'Inter', Arial, sans-serif;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}