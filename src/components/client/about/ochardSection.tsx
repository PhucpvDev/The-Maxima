"use client";

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme } from "antd"

interface Translation {
  id: number;
  apple_orchard_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  image_title: string;
  image_description: string;
  step_title_1: string;
  step_title_2: string;
  step_title_3: string;
  step_description_1: string;
  step_description_2: string;
  step_description_3: string;
}

interface AppleOrchardData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  image_title: string;
  image_description: string;
  step_title_1: string;
  step_title_2: string;
  step_title_3: string;
  step_description_1: string;
  step_description_2: string;
  step_description_3: string;
}

interface RawAppleOrchardData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  image_title: string;
  image_description: string;
  step_title_1: string;
  step_title_2: string;
  step_title_3: string;
  step_description_1: string;
  step_description_2: string;
  step_description_3: string;
  translations: Translation[];
}

async function getAppleOrchard(locale: string): Promise<AppleOrchardData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://maximagoldhedging.com/items/apple_orchard?lang=${lang}&fields=*,translations.*`,
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
    const data: RawAppleOrchardData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    return {
      title: source.title || "APPLE ORCHARD",
      subtitle: source.subtitle || "Revolutionizing Decentralized Trading",
      description:
        source.description ||
        "Apple Orchard is the world's first decentralized trading DAO that combines cutting-edge technology with user-centric innovation. Featuring a unique dashboard and back-office system, it provides unparalleled transparency and control for traders and IBs.\n\nWith a comprehensive, gamified IB incentive tracking system, Apple Orchard transforms statistics into an engaging Game-Fi experience, empowering users to thrive in a decentralized ecosystem.",
      image: source.image || "",
      image_title: source.image_title || "",
      image_description: source.image_description || "",
      step_title_1: source.step_title_1 || "",
      step_title_2: source.step_title_2 || "",
      step_title_3: source.step_title_3 || "",
      step_description_1: source.step_description_1 || "",
      step_description_2: source.step_description_2 || "",
      step_description_3: source.step_description_3 || "",  
    };
  } catch (error) {
    console.error("Error fetching Apple Orchard data:", error);
    return {
      title: "APPLE ORCHARD",
      subtitle: "Revolutionizing Decentralized Trading",
      description:
        "Apple Orchard is the world's first decentralized trading DAO that combines cutting-edge technology with user-centric innovation. Featuring a unique dashboard and back-office system, it provides unparalleled transparency and control for traders and IBs.\n\nWith a comprehensive, gamified IB incentive tracking system, Apple Orchard transforms statistics into an engaging Game-Fi experience, empowering users to thrive in a decentralized ecosystem.",
      image: "",
      image_title: "",
      image_description: "",
      step_title_1: "",
      step_title_2: "",
      step_title_3: "",
      step_description_1: "",
      step_description_2: "",
      step_description_3: "",   
    };
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
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
      delayChildren: 0.1
    }
  }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

export default function AppleOrchardSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<AppleOrchardData | null>(null);
  const [highlightedFeature, setHighlightedFeature] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getAppleOrchard(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Apple Orchard data:", error);
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

  const { title, subtitle, description, image } = data;
  const descriptionParagraphs = description.split("\n\n");

  const features = [
    {
      icon: "dashboard",
      title: data.step_title_1,
      description: data.step_description_1
    },
    {
      icon: "auto_awesome",
      title: data.step_title_2,
      description: data.step_description_2
    },
    {
      icon: "hub",
      title: data.step_title_3,
      description: data.step_description_3
    }
  ];

  return (
    <ConfigProvider theme={themeConfig}>
      <section className={`py-20 relative overflow-hidden font-inter ${
        mytheme === "light" 
          ? "bg-gradient-to-b from-gray-50 to-white" 
          : "bg-gradient-to-b from-gray-900 to-gray-950"
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 opacity-5 ${
            mytheme === "light" ? "bg-gray-900" : "bg-white"
          }`} style={{
            backgroundImage: `radial-gradient(circle, ${mytheme === "light" ? "#1a202c" : "#ffffff"} 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
          }}></div>
          
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-1 w-12 bg-yellow-500 rounded"></div>
                  <span className={`text-sm font-semibold tracking-wider ${
                    mytheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>INNOVATION</span>
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${
                  mytheme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  {title}
                </h2>
                <p className={`text-xl font-medium mb-6 ${
                  mytheme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  {subtitle}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6 mb-10">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className={`text-base md:text-lg leading-relaxed ${
                    mytheme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}>
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-5 rounded-xl transition-all duration-300 ${
                      highlightedFeature === index
                        ? mytheme === "light"
                          ? "bg-yellow-50 shadow-lg"
                          : "bg-yellow-900/10 shadow-lg"
                        : mytheme === "light"
                          ? "bg-white shadow"
                          : "bg-gray-800/50 shadow"
                    }`}
                    onMouseEnter={() => setHighlightedFeature(index)}
                    onMouseLeave={() => setHighlightedFeature(null)}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
                    }`}>
                      <span className="material-symbols-outlined text-yellow-600">{feature.icon}</span>
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}>{feature.title}</h3>
                    <p className={`text-sm ${
                      mytheme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}>{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={imageReveal}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md">
                <div className={`relative h-[700px] w-[380px] rounded-3xl overflow-hidden shadow-2xl ${
                  mytheme === "light" ? "shadow-gray-200/80" : "shadow-black/50"
                } aspect-[3/4]`}>
                  {image ? (
                    <Image
                      src={`https://maximagoldhedging.com/assets/${image}`}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
                    }`}>
                      <div className="text-center p-6">
                        <span className="material-symbols-outlined text-6xl opacity-40 mb-4">
                          image
                        </span>
                        <p className={`text-lg ${
                          mytheme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}>
                          Image Not Available
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className={`p-4 rounded-xl backdrop-blur-md ${
                      mytheme === "light"
                        ? "bg-white/70"
                        : "bg-gray-900/70"
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
                        }`}>
                          <span className="material-symbols-outlined text-sm text-yellow-600">
                            verified
                          </span>
                        </div>
                        <h4 className={`font-semibold ${
                          mytheme === "light" ? "text-gray-900" : "text-white"
                        }`}>
                          {data.image_title || "Security & Trust"}
                        </h4>
                      </div>
                      <p className={`text-sm ${
                        mytheme === "light" ? "text-gray-700" : "text-gray-200"
                      }`}>
                        {data.image_description || "Your data is safe with us."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-yellow-500 opacity-20 blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-xl"></div>
              
              </div>
            </motion.div>
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
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
}