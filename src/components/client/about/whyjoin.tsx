"use client";

import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import Cookies from "js-cookie"; 

const fontStyle = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  </style>
`;

interface Translation {
  id: number;
  why_join_maxima_id: number;
  languages_code: string;
  title: string;
  subtitle: string;
  conclusion_title: string;
  conclusion_description: string;
  conclusion_button?: string;
  conclusion_image: string;
  conclusion_title_2: string;
  conclusion_description_2: string;
  conclusion_button_2?: string;
  conclusion_image_2: string;
  conclusion_title_3: string;
  conclusion_description_3: string;
  conclusion_image_3: string;
  conclusion_title_4: string;
  conclusion_description_4: string;
  conclusion_image_4: string;
}

interface Section {
  section_title: string;
  description: string;
  button_text?: string;
  image: string;
}

interface WhyJoinMaximaData {
  title: string;
  subtitle: string;
  sections: Section[];
}

interface RawWhyJoinMaximaData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  conclusion_title: string;
  conclusion_description: string;
  conclusion_button?: string;
  conclusion_image: string;
  conclusion_title_2: string;
  conclusion_description_2: string;
  conclusion_button_2?: string;
  conclusion_image_2: string;
  conclusion_title_3: string;
  conclusion_description_3: string;
  conclusion_image_3: string;
  conclusion_title_4: string;
  conclusion_description_4: string;
  conclusion_image_4: string;
  translations: Translation[];
}

async function getWhyJoin(locale: string): Promise<WhyJoinMaximaData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/why_join_maxima?lang=${lang}&fields=*,translations.*`,
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
    const data: RawWhyJoinMaximaData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    return {
      title: source.title || "Benefits of Joining Maxima Trading",
      subtitle: source.subtitle || "“WIN-WIN-WIN Strategy”",
      sections: [
        {
          section_title: source.conclusion_title || "TRADER's WIN",
          description:
            source.conclusion_description ||
            "Regardless of market directions, traders earn using a proven strategy that guarantees consistent profits",
          button_text: source.conclusion_button || "Register",
          image: source.conclusion_image || "",
        },
        {
          section_title: source.conclusion_title_2 || "IB's WIN",
          description:
            source.conclusion_description_2 ||
            "Traders' profits are secure and there is no risk of trading loss – resulting in increased customer retention, generating long term IB commissions",
          button_text: source.conclusion_button_2 || "Explore IB",
          image: source.conclusion_image_2 || "",
        },
        {
          section_title: source.conclusion_title_3 || "MAXIMA WIN",
          description:
            source.conclusion_description_3 ||
            "With the proven strategy, Maxima achieves consistent profits, ensuring a stable growth removing the need of constantly acquiring new clients",
          button_text: undefined,
          image: source.conclusion_image_3 || "",
        },
        {
          section_title: source.conclusion_title_4 || "So you should choose Maxima",
          description:
            source.conclusion_description_4 ||
            "We value our words. Our words are backed up by concrete actions.",
          button_text: undefined,
          image: source.conclusion_image_4 || "",
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching Why Join Maxima data:", error);
    return {
      title: "Benefits of Joining Maxima Trading",
      subtitle: "“WIN-WIN-WIN Strategy”",
      sections: [
        {
          section_title: "TRADER's WIN",
          description:
            "Regardless of market directions, traders earn using a proven strategy that guarantees consistent profits",
          button_text: "Register",
          image: "",
        },
        {
          section_title: "IB's WIN",
          description:
            "Traders' profits are secure and there is no risk of trading loss – resulting in increased customer retention, generating long term IB commissions",
          button_text: "Explore IB",
          image: "",
        },
        {
          section_title: "MAXIMA WIN",
          description:
            "With the proven strategy, Maxima achieves consistent profits, ensuring a stable growth removing the need of constantly acquiring new clients",
          button_text: undefined,
          image: "",
        },
        {
          section_title: "So you should choose Maxima",
          description:
            "We value our words. Our words are backed up by concrete actions.",
          button_text: undefined,
          image: "",
        },
      ],
    };
  }
}

export default function WhyJoinMaxima() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<WhyJoinMaximaData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWhyJoin(locale);
      setData(result);
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const affCodeFromCookie = Cookies.get("aff_code");
  const registrationUrl = affCodeFromCookie
    ? `https://agreement.maximadao.com/#/register?code=${encodeURIComponent(affCodeFromCookie)}`
    : `https://agreement.maximadao.com/#/register`;

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

  if (!data) {
    return null;
  }

  const { title, subtitle, sections } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <div dangerouslySetInnerHTML={{ __html: fontStyle }} />
      <div id="how"
        className={`relative overflow-hidden py-10 md:py-18 ${mytheme === "light"
            ? "bg-gradient-to-b from-slate-50 to-gray-100"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
          }`}
      >
        <motion.div
          className="text-center mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            className={`text-2xl md:text-4xl font-bold uppercase ${mytheme === "light" ? "text-gray-800" : "text-white"
              }`}
            variants={childVariants}
          >
            {title}
          </motion.p>
          <motion.p
            className={`text-2xl md:text-3xl font-semibold mt-3 italic ${mytheme === "light" ? "text-gray-700" : "text-gray-400"
              }`}
            variants={childVariants}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-12">
          {sections.map((section, index) => {
            const isReverse = index % 2 === 1;
            const fallbackImage =
              index === 0
                ? IMAGES.Whyjoin1
                : index === 1
                  ? IMAGES.Whyjoin2
                  : index === 2
                    ? IMAGES.Whyjoin3
                    : IMAGES.Whyjoin4;

            return (
              <motion.div
                key={index}
                className={`flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"
                  } items-center gap-8`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div className="md:w-1/2" variants={childVariants}>
                  <p
                    className={`md:text-3xl text-2xl font-bold mb-3 ${mytheme === "light" ? "text-gray-700" : "text-gray-200"
                      }`}
                  >
                    {section.section_title}
                  </p>
                  <p
                    className={`text-lg ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                      } mb-4`}
                  >
                    {section.description}
                  </p>
                  {section.button_text && (
                    <div className="font-medium text-white pt-2">
                      <motion.a
                        href={registrationUrl}
                        className={`px-8 sm:px-16 py-1.5 rounded-full text-lg font-semibold transition-all duration-300 inline-block ${mytheme === "light"
                            ? "bg-orange-400 hover:bg-orange-500 text-white"
                            : "bg-orange-400 hover:bg-orange-500 text-white"
                          }`}
                        variants={childVariants}
                      >
                        {section.button_text}
                      </motion.a>
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className="md:w-1/2 relative"
                  variants={childVariants}
                >
                  <div
                    className={`absolute inset-0 rounded-lg`}
                  ></div>
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${section.image}` || fallbackImage.src
                    }
                    alt={section.section_title}
                    width={280}
                    height={300}
                    className="mx-auto"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ConfigProvider>
  );
}