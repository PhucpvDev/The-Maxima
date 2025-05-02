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

interface Translation {
  id: number;
  apple_orchard_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface AppleOrchardData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface RawAppleOrchardData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  translations: Translation[];
}

async function getAppleOrchard(locale: string): Promise<AppleOrchardData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/apple_orchard?lang=${lang}&fields=*,translations.*`,
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
        "Apple Orchard is the world’s first decentralized trading DAO that combines cutting-edge technology with user-centric innovation. Featuring a unique dashboard and back-office system, it provides unparalleled transparency and control for traders and IBs.\n\nWith a comprehensive, gamified IB incentive tracking system, Apple Orchard transforms statistics into an engaging Game-Fi experience, empowering users to thrive in a decentralized ecosystem.",
      image: source.image || "",
    };
  } catch (error) {
    console.error("Error fetching Apple Orchard data:", error);
    return {
      title: "APPLE ORCHARD",
      subtitle: "Revolutionizing Decentralized Trading",
      description:
        "Apple Orchard is the world’s first decentralized trading DAO that combines cutting-edge technology with user-centric innovation. Featuring a unique dashboard and back-office system, it provides unparalleled transparency and control for traders and IBs.\n\nWith a comprehensive, gamified IB incentive tracking system, Apple Orchard transforms statistics into an engaging Game-Fi experience, empowering users to thrive in a decentralized ecosystem.",
      image: "",
    };
  }
}

export default function AppleOrchardSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<AppleOrchardData | null>(null);

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
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return <div className="text-center py-16 text-2xl font-poppins">Loading...</div>;
  }

  const { title, subtitle, description, image } = data;

  const descriptionParagraphs = description.split("\n\n");

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.section
        className={`relative overflow-hidden ${
          mytheme === "light"
            ? "bg-[#F4F8FB]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute z-0 opacity-60">
          <Image
            src={IMAGES.BgFooter1}
            alt="Decorative Background Left"
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="absolute right-0 z-0 top-20 opacity-70">
          <Image
            src={IMAGES.BgFooter2}
            alt="Decorative Background Right"
            width={900}
            height={300}
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto z-10 relative p-6 md:p-12">
          <Row gutter={[32, 32]} className="items-center">
            <Col xs={24} lg={14}>
              <motion.p
                className={`text-4xl font-bold mb-4 font-poppins ${
                  mytheme === "light" ? "text-gray-800" : "text-yellow-600"
                }`}
                variants={childVariants}
              >
                {title}
              </motion.p>
              <motion.p
                className={`text-2xl font-semibold mb-6 font-poppins ${
                  mytheme === "light" ? "text-gray-800" : "text-yellow-600"
                }`}
                variants={childVariants}
              >
                {subtitle}
              </motion.p>
              <motion.div
                className={`space-y-5 text-lg font-poppins ${
                  mytheme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
                variants={childVariants}
              >
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </motion.div>
            </Col>

            <Col xs={24} lg={10}>
              <motion.div
                className="relative w-54 aspect-[8/16] ml-15 md:ml-20"
                variants={childVariants}
              >
                {image ? (
                  <Image
                    src={`https://the-maxima.directus.app/assets/${image}`}
                    alt={title}
                    fill
                    className="rounded-2xl object-cover shadow-lg"
                    priority
                  />
                ) : (
                  <div
                    className={`rounded-2xl h-full flex items-center justify-center ${
                      mytheme === "light" ? "bg-gray-200" : "bg-gray-700"
                    }`}
                  >
                    <p
                      className={`text-lg ${
                        mytheme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Không có hình ảnh
                    </p>
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', Arial, Helvetica, sans-serif;
          }
        `}</style>
      </motion.section>
    </ConfigProvider>
  );
}