"use client";

import React, { useState, useEffect } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useLocale } from "next-intl"
import { motion } from "framer-motion"
import "antd/dist/reset.css"

interface Translation {
  id: number;
  how_it_works_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  conclusion?: string;
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

interface HowItWorksProps {
  id?: string; 
}

interface Step {
  title: string;
  description: string;
  icon: string;
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
  conclusion?: string;
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

const stepIcons = [
  "account_circle",
  "account_balance_wallet",
  "power_settings_new", 
  "settings",
  "trending_up", 
  "monitoring", 
];

async function getHowItWorks(locale: string): Promise<HowItWorksData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/how_it_works?lang=${lang}&fields=*,translations.*`,
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

    const conclusion = source.conclusion || "Earn profits consistently with Maxima's decentralized system!\n\nThe world's leading decentralized AI trading platform";

    return {
      title: source.title || "Maxima Trading Model",
      subtitle: source.subtitle || "Maximize Profits with Ease",
      conclusion,
      steps: [
        {
          title: source.step_title_1 || "REGISTER ACCOUNT",
          description: source.description_1 || "Register with Maxima platform.",
          icon: stepIcons[0],
        },
        {
          title: source.step_title_2 || "CONNECT WALLET",
          description: source.description_2 || "Link your wallet to Maxima for secure trading access.",
          icon: stepIcons[1],
        },
        {
          title: source.step_title_3 || "ACTIVATE MAXIMA",
          description: source.description_3 || "Enable Maxima to begin your trading journey.",
          icon: stepIcons[2],
        },
        {
          title: source.step_title_4 || "SET STRATEGY",
          description: source.description_4 || "Configure your trading strategy with Maxima's AI for optimal performance.",
          icon: stepIcons[3],
        },
        {
          title: source.step_title_5 || "START TRADING",
          description: source.description_5 || "Launch trades using Maxima's automated system for profits.",
          icon: stepIcons[4],
        },
        {
          title: source.step_title_6 || "MONITOR PROFITS",
          description: source.description_6 || "Track your earnings in real time.",
          icon: stepIcons[5],
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching How It Works data:", error);
    return {
      title: "Maxima Trading Model",
      subtitle: "Maximize Profits with Ease",
      conclusion: "Earn profits consistently with Maxima's decentralized system!\n\nThe world's leading decentralized AI trading platform",
      steps: [
        {
          title: "REGISTER ACCOUNT",
          description: "Register with Maxima platform.",
          icon: stepIcons[0],
        },
        {
          title: "CONNECT WALLET",
          description: "Link your wallet to Maxima for secure trading access.",
          icon: stepIcons[1],
        },
        {
          title: "ACTIVATE MAXIMA",
          description: "Enable Maxima to begin your trading journey.",
          icon: stepIcons[2],
        },
        {
          title: "SET STRATEGY",
          description: "Configure your trading strategy with Maxima's AI for optimal performance.",
          icon: stepIcons[3],
        },
        {
          title: "START TRADING",
          description: "Launch trades using Maxima's automated system for profits.",
          icon: stepIcons[4],
        },
        {
          title: "MONITOR PROFITS",
          description: "Track your earnings in real time.",
          icon: stepIcons[5],
        },
      ],
    };
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

export default function HowItWorks ({ id }: HowItWorksProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<HowItWorksData | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    
  const themeConfig = {
    token: {
      colorPrimary:"#FFC800",
      borderRadius: 8,
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { title, subtitle, steps, conclusion } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <div  id={id} className={`py-12 md:py-24 px-4 md:px-8 font-inter ${
        mytheme === "light"
          ? "bg-gradient-to-b from-slate-50 to-gray-100"
          : "bg-gradient-to-b from-gray-900 to-gray-950"
      }`}>
        <motion.div 
          className="max-w-6xl mx-auto text-center mb-12 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.h2 
            className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight ${
              mytheme === "light" ? "text-gray-900" : "text-white"
            }`}
            variants={fadeInUp}
          >
            {title}
          </motion.h2>
          
          <motion.div 
            className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6"
            variants={scaleIn}
          >
            <div className="h-px w-12 md:w-16 bg-yellow-500"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-px w-12 md:w-16 bg-yellow-500"></div>
          </motion.div>
          
          <motion.p 
            className={`text-lg md:text-2xl max-w-3xl mx-auto ${
              mytheme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {isMobile && (
          <motion.div 
            className="max-w-lg mx-auto mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  variants={fadeInUp}
                  onTouchStart={() => setActiveStep(index)}
                  onTouchEnd={() => setActiveStep(null)}
                >
                  <div className={`p-5 rounded-xl shadow-md ${
                    activeStep === index ? "border-2 border-yellow-500" : ""
                  } ${
                    mytheme === "light" 
                      ? "bg-white" 
                      : "bg-gray-800"
                  }`}>
                    <div className="flex items-center mb-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                        activeStep === index 
                          ? "bg-yellow-500 text-white" 
                          : mytheme === "light" 
                            ? "bg-white text-gray-900 border-2 border-yellow-500"
                            : "bg-gray-900 text-white border-2 border-yellow-500"
                      }`}>
                        <span className="font-bold text-sm">{index + 1}</span>
                      </div>
                      
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${
                        mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900"
                      }`}>
                        <span className="material-symbols-outlined text-yellow-600 text-sm">{step.icon}</span>
                      </div>
                      
                      <h3 className={`text-base font-bold flex-1 ${
                        mytheme === "light" ? "text-gray-900" : "text-white"
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className={`text-sm ${
                      mytheme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="h-6 w-0.5 bg-yellow-500 mx-auto my-1"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!isMobile && (
          <motion.div 
            className="max-w-7xl mx-auto md:px-4 mb-24 hidden md:block"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full ${
                mytheme === "light" ? "bg-gray-200" : "bg-gray-800"
              }`}></div>
              
              <div className="space-y-24">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                    variants={fadeInUp}
                    onMouseEnter={() => setActiveStep(index)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        activeStep === index 
                          ? "bg-yellow-500 text-white" 
                          : mytheme === "light" 
                            ? "bg-white text-gray-900 border-2 border-yellow-500"
                            : "bg-gray-900 text-white border-2 border-yellow-500"
                      } transition-colors duration-300 shadow-lg`}>
                        <span className="font-bold">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className={`w-5/12 ${
                      index % 2 === 0 ? "pr-16 text-right" : "pl-16 text-left"
                    }`}>
                      <div className={`p-6 rounded-xl shadow-xl transform transition-transform duration-300 ${
                        activeStep === index ? "scale-105" : "scale-100"
                      } ${
                        mytheme === "light" 
                          ? "bg-white border border-gray-100" 
                          : "bg-gray-800 border border-gray-700"
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                            mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900"
                          }`}>
                            <span className={`material-symbols-outlined ${mytheme === "dark" ? "text-white" : "text-yellow-600"}`}>{step.icon}</span>
                          </div>
                          <h3 className={`text-xl font-bold ${
                            mytheme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {step.title}
                          </h3>
                        </div>
                        <p className={`${
                          mytheme === "light" ? "text-gray-600" : "text-gray-300"
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="max-w-4xl mx-auto mt-12 md:mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div 
            className={`p-6 md:p-8  text-white rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ${
              mytheme === "light"
                ? "bg-gradient-to-br from-white to-gray-50 border border-yellow-100"
                : "bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-900"
            }`}
            variants={scaleIn}
          >
            <div className="flex justify-center mb-4 md:mb-6">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900"
              }`}>
                <span className={`material-symbols-outlined text-2xl md:text-3xl ${mytheme === "dark" ? "text-white" : "text-yellow-600"}`}>rocket_launch</span>
              </div>
            </div>
            
            {conclusion.split("\n\n").map((line, index) => (
              <p
                key={index}
                className={`text-lg md:text-2xl font-bold mb-3 md:mb-4 last:mb-0 ${
                  mytheme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
          
          .font-inter {
            font-family: 'Inter', Arial, sans-serif;
          }
          
          /* Animation for the loader */
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Mobile-specific styles */
          @media (max-width: 767px) {
            .material-symbols-outlined {
              font-size: 18px;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};
