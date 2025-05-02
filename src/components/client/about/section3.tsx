"use client";

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

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
      `http://the-maxima.directus.app/items/maxima_super_wallet?lang=${lang}&fields=*,translations.*`,
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

export default function MaximaSuperWalletSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<MaximaSuperWalletData | null>(null);

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

  const { title, description, additional_description, cta_title, cta_button_text, image_1, image_2, image_3 } = data;

  const images = [image_1, image_2, image_3].filter((img) => img !== null) as string[];

  return (
    <ConfigProvider theme={themeConfig}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
      `}</style>
      <motion.div
        className={`md:py-24 py-12 relative overflow-hidden font-poppins ${
          mytheme === "light"
            ? "bg-gradient-to-b from-[#F4F8FB] to-[#E5E7EB]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute z-0 opacity-50">
          <Image
            src={IMAGES.BgFooter1.src}
            alt="Decoration 1"
            width={300}
            height={300}
            priority
            className="filter hue-rotate-60"
          />
        </div>
        <div className="absolute right-0 top-20 z-0 opacity-60">
          <Image
            src={IMAGES.BgFooter2.src}
            alt="Decoration 2"
            width={900}
            height={300}
            priority
            className="filter hue-rotate-60"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <motion.p
                className={`text-3xl md:text-4xl font-bold uppercase ${
                  mytheme === "light" ? "text-gray-900" : "text-yellow-600"
                } mb-3`}
                variants={childVariants}
              >
                {title}
              </motion.p>
              <motion.p
                className={`text-lg leading-relaxed mb-8 ${
                  mytheme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
                variants={childVariants}
              >
                {description}
              </motion.p>
              <motion.div variants={childVariants}>
                <Link
                  href="#"
                  className={`text-lg font-semibold underline ${
                    mytheme === "light" ? "text-blue-900" : "text-yellow-600"
                  } block mb-6`}
                >
                  {cta_title}
                </Link>
              </motion.div>
              {cta_button_text && (
                <motion.div
                  className="font-medium text-base text-white"
                  variants={childVariants}
                >
                  <button
                    className={`px-8 sm:px-16 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                      mytheme === "light"
                        ? "bg-orange-400 hover:bg-orange-500 text-white"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  >
                    {cta_button_text}
                  </button>
                </motion.div>
              )}
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                className="grid xs:grid-cols-1 grid-cols-3 gap-4 sm:gap-6 mb-6"
                variants={childVariants}
              >
                {images.map((imageId, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl h-[370px] overflow-hidden shadow-lg ${
                      mytheme === "light"
                        ? "border border-gray-200"
                        : "border border-yellow-700 shadow-yellow-700/30"
                    }`}
                    style={{ paddingTop: "75%" }} 
                  >
                    <Image
                      src={`https://the-maxima.directus.app/assets/${imageId}`}
                      alt={`${title} Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ))}
                {images.length < 3 &&
                  Array.from({ length: 3 - images.length }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className={`relative rounded-xl overflow-hidden shadow-lg ${
                        mytheme === "light"
                          ? "border border-gray-200 bg-gray-100"
                          : "border border-yellow-700 bg-[#1a1a1a] shadow-yellow-700/30"
                      }`}
                      style={{ paddingTop: "75%" }} 
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-sm ${
                            mytheme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          No Image
                        </span>
                      </div>
                    </div>
                  ))}
              </motion.div>
              <motion.p
                className={`text-lg leading-relaxed ${
                  mytheme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
                variants={childVariants}
              >
                {additional_description}
              </motion.p>
            </Col>
          </Row>
        </div>
      </motion.div>
    </ConfigProvider>
  );
}