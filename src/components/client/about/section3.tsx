
"use client"

import React, { useState, useEffect } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import Cookies from "js-cookie"


interface Translation {
  id: number;
  maxima_super_wallet_id: number;
  languages_code: string;
  title: string;
  description: string;
  additional_description: string;
  cta_title: string;
  cta_button_text: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
}

interface MaximaSuperWalletData {
  title: string;
  description: string;
  additional_description: string;
  cta_title: string;
  cta_button_text: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
}

interface RawMaximaSuperWalletData {
  id: number;
  status: string;
  title: string;
  description: string;
  additional_description: string;
  cta_title: string;
  cta_button_text: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
  translations: Translation[];
}

async function getMaximaSuperWallet(locale: string): Promise<MaximaSuperWalletData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/maxima_super_wallet?lang=${lang}&fields=*,translations.*`,
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
    const data: RawMaximaSuperWalletData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    return {
      title: source.title || "MAXIMA DECENTRALIZED PLATFORM",
      description:
        source.description ||
        "Maxima is an AI-driven program supported by expert traders, designed to optimize your profits through futures trading. Built on a decentralized platform, it enables users to join the Maxima community and share profits. With advanced strategies and automation, Maxima ensures sustainable growth, empowering traders of all levels to achieve consistent returns while minimizing risks and enhancing trading efficiency.",
      additional_description:
        source.additional_description ||
        "Maxima ensures stable and sustainable profit growth through its decentralized platform, helping you achieve consistent returns. With its AI-driven system, your trading decisions are optimized, ensuring profits are maximized while risks are minimized, regardless of market conditions.",
      cta_title: source.cta_title || "MAKE PROFITS WITH JUST 4 CLICKS",
      cta_button_text: source.cta_button_text || "Find Out More",
      image_1: source.image_1 || null,
      image_2: source.image_2 || null,
      image_3: source.image_3 || null,
    };
  } catch (error) {
    console.error("Error fetching Maxima Super Wallet data:", error);
    return {
      title: "MAXIMA DECENTRALIZED PLATFORM",
      description:
        "Maxima is an AI-driven program supported by expert traders, designed to optimize your profits through futures trading. Built on a decentralized platform, it enables users to join the Maxima community and share profits. With advanced strategies and automation, Maxima ensures sustainable growth, empowering traders of all levels to achieve consistent returns while minimizing risks and enhancing trading efficiency.",
      additional_description:
        "Maxima ensures stable and sustainable profit growth through its decentralized platform, helping you achieve consistent returns. With its AI-driven system, your trading decisions are optimized, ensuring profits are maximized while risks are minimized, regardless of market conditions.",
      cta_title: "MAKE PROFITS WITH JUST 4 CLICKS",
      cta_button_text: "Find Out More",
      image_1: null,
      image_2: null,
      image_3: null,
    };
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const imageHoverVariants = {
  rest: { scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: "easeIn" } },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  tap: { scale: 0.98, transition: { duration: 0.2, ease: "easeInOut" } },
};

export default function MaximaSuperWalletSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<MaximaSuperWalletData | null>(null);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getMaximaSuperWallet(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Maxima Super Wallet data:", error);
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
      <div
        className={`flex items-center justify-center py-20 ${mytheme === "light" ? "text-gray-800" : "text-gray-200"
          }`}
      >
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { title, description, cta_title, cta_button_text, image_1, image_2, image_3 } = data;

  const images = [image_1, image_2, image_3].filter((img) => img !== null) as string[];

  const getKeyPoints = (text: string) => {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
    return sentences.slice(0, 4);
  };

  const keyPoints = getKeyPoints(description);


  const affCodeFromCookie = Cookies.get("aff_code");
  const registrationUrl = affCodeFromCookie
    ? `https://agreement.maximadao.com/#/register?code=${encodeURIComponent(affCodeFromCookie)}`
    : `https://agreement.maximadao.com/#/register`;

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`relative py-14 md:py-18 overflow-hidden font-inter ${mytheme === "light"
            ? "bg-gradient-to-b from-gray-50 to-white"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
          }`}
      >
        <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-40 bg-yellow-500 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div>
              <motion.div className="mb-8" variants={fadeInUp}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-1 w-12 bg-yellow-500 rounded"></div>
                  <span
                    className={`text-sm font-semibold tracking-wider ${mytheme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                  >
                    MAXIMA PLATFORM
                  </span>
                </div>

                <h2
                  className={`text-3xl md:text-4xl font-bold tracking-tight mb-6 ${mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                >
                  {title}
                </h2>

                <p
                  className={`text-base md:text-lg leading-relaxed mb-8 ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                >
                  {description}
                </p>
              </motion.div>

              <motion.div className="space-y-4 mb-7" variants={fadeInUp}>
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 px-2.5 py-2 rounded-full ${mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/40"
                        }`}
                    >
                      <span className={`material-symbols-outlined text-lg ${mytheme === "dark" ? "text-white" : "text-yellow-600"}`}>
                        {index === 0
                          ? "trending_up"
                          : index === 1
                            ? "verified"
                            : index === 2
                              ? "security"
                              : "payments"}
                      </span>
                    </div>
                    <p
                      className={`text-base ${mytheme === "light" ? "text-gray-600" : "text-gray-300"
                        }`}
                    >
                      {point.trim()}
                    </p>
                  </div>
                ))}

              </motion.div>

              <motion.div className="space-y-5" variants={fadeInUp}>


                {cta_button_text && (
                  <motion.div className="mt-6 flex flex-wrap gap-4 text-white" variants={fadeInUp}>
                    <motion.a
                      className={`px-8 py-2 rounded-lg text-white font-medium text-base shadow-lg ${mytheme === "light"
                          ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200"
                          : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-900/20"
                        } transition-all duration-300`}
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      href={registrationUrl}
                    >
                      {cta_button_text}
                    </motion.a>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.div className="relative" variants={fadeInUp}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative rounded-xl md:h-[400px] h-[630px] overflow-hidden shadow-lg ${mytheme === "light" ? "shadow-gray-200/80" : "shadow-black/50"
                      } h-64 transform transition-all duration-300`}
                    variants={imageHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    animate={activeImage === index ? "hover" : "rest"}
                    onMouseEnter={() => setActiveImage(index)}
                    onMouseLeave={() => setActiveImage(null)}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${img}`}
                      alt={`${title} Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index === 0}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${mytheme === "light" ? "from-black/40 to-transparent" : "from-black/60 to-transparent"
                        }`}
                    ></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-lg font-bold">
                        {index === 0 ? "Maxima Platform" : index === 1 ? "AI Trading" : "Trading Analysis"}
                      </p>
                      {index === 0 && <p className="text-lg text-bold opacity-80">Decentralized Trading</p>}
                    </div>
                  </motion.div>
                ))}
                {images.length < 2 &&
                  Array.from({ length: 2 - images.length }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className={`relative rounded-xl overflow-hidden h-64 ${mytheme === "light"
                          ? "bg-gradient-to-br from-gray-100 to-gray-200"
                          : "bg-gradient-to-br from-gray-800 to-gray-900"
                        }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div
                className={`inline-flex items-center mt-10 py-2 px-4 rounded-lg ${mytheme === "light" ? "bg-yellow-50" : "bg-yellow-900/20"
                  }`}
              >
                <span className="material-symbols-outlined text-yellow-600 mr-2">verified</span>
                <span
                  className={`text-lg font-semibold ${mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                >
                  {cta_title}
                </span>
              </div>
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
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          .transition-all {
            transition-property: all;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}