"use client";

import React, { useRef, useEffect, useState } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import "antd/dist/reset.css";
import { useLocale } from "next-intl";

// Animation variants for the container
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

// Animation variants for child elements
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

// Animation variants for carousel cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Animation variants for buttons
const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
  tap: { scale: 0.9 },
};

interface Testimonial {
  video_url: string;
  description: string;
  location_name: string;
}

interface Translation {
  id: number;
  client_say_id: number;
  languages_code: string;
  title: string;
  description_1: string;
  location_name_1: string;
  video_url_1: string;
  description_2: string;
  location_name_2: string;
  video_url_2: string;
  description_3: string;
  location_name_3: string;
  video_url_3: string;
  description_4: string;
  location_name_4: string;
  video_url_4: string;
}

interface ClientSayData {
  title: string;
  featuredVideo: string;
  testimonials: Testimonial[];
}

interface RawClientSayData {
  id: number;
  status: string;
  title: string;
  video_url_1: string;
  description_1: string;
  location_name_1: string;
  video_url_2: string;
  description_2: string;
  location_name_2: string;
  video_url_3: string;
  description_3: string;
  location_name_3: string;
  video_url_4: string;
  description_4: string;
  location_name_4: string;
  translations: Translation[];
}

async function getClientSay(locale: string): Promise<ClientSayData> {
  try {
    // Map locale to language code
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/client_say?lang=${lang}&fields=*,translations.*`,
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
    const data: RawClientSayData = Array.isArray(result.data) ? result.data[0] : result.data;

    // Find the translation matching the locale
    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    // Use translation if found, otherwise fall back to default fields
    const source = translation || data;

    // Correct vi-VN misalignment by remapping indices
    const indices = lang === "vi-VN" ? [4, 1, 2, 3] : [1, 2, 3, 4];

    const testimonials: Testimonial[] = indices.map((index, i) => ({
      video_url: (source as any)[`video_url_${i + 1}`] || (data as any)[`video_url_${i + 1}`],
      description: (source as any)[`description_${index}`] || (data as any)[`description_${i + 1}`],
      location_name: (source as any)[`location_name_${index}`] || (data as any)[`location_name_${i + 1}`],
    }));

    return {
      title: source.title || "OUR CLIENTS SAY",
      featuredVideo: source.video_url_2 || data.video_url_2 || "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
      testimonials,
    };
  } catch (error) {
    console.error("Error fetching Client Say data:", error);
    // Return fallback data
    return {
      title: "OUR CLIENTS SAY",
      featuredVideo: "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
      testimonials: [
        {
          video_url: "https://www.youtube.com/embed/NVzcKBNjn38?si=ZCQt1mzFff1z0VBL",
          description: "Invested 50,000 USDT, Profits reached more than 200%",
          location_name: "Tung Hua, Malaysia",
        },
        {
          video_url: "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
          description: "I invested 10,000 USDT, 4 months I earn about 12,000 USDT, started in...",
          location_name: "Iskandar, Singapore",
        },
        {
          video_url: "https://www.youtube.com/embed/mwmUk9Fxmuc?si=XP4d0A24slYoOcuZ",
          description: "Join on 8th May 2024. Now monthly earning around 6 figures",
          location_name: "Jimmy, Malaysia",
        },
        {
          video_url: "https://www.youtube.com/embed/49Vwgi4KQ9M?si=Y8dc6EApPlgjfsgH",
          description: "I’ll introduce to my friends, because the ROI is awesome",
          location_name: "Erica, Malaysia",
        },
      ],
    };
  }
}

const Testimonials: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const carouselRef = useRef<any>(null);
  const [data, setData] = useState<ClientSayData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getClientSay(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching client testimonials:", error);
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

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  if (!data) {
    return (
      <div
        className={`text-center py-16 text-2xl font-poppins ${
          mytheme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        Loading...
      </div>
    );
  }

  const { title, featuredVideo, testimonials } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.div
        className={`py-16 px-4 sm:px-6 lg:px-8 ${
          mytheme === "light"
            ? "bg-gray-50"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            className={`text-4xl font-bold mb-12 font-poppins ${
              mytheme === "light" ? "text-gray-800" : "text-yellow-600"
            }`}
            variants={childVariants}
          >
            {title}
          </motion.p>

          {/* Main Video Section */}
          <motion.div
            className={`relative w-full md:h-[500px] h-[350px] aspect-video mb-12 rounded-xl overflow-hidden shadow-xl ${
              mytheme === "light" ? "bg-white" : "bg-black/50"
            }`}
            variants={childVariants}
          >
            <iframe
              width="100%"
              height="100%"
              src={featuredVideo}
              title="Featured Testimonial Video"
              className="absolute top-0 left-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>

          <motion.div
            className={`relative mb-8 flex justify-end gap-4 ${
              mytheme === "light"
                  ? "text-gray-600"
                  : "text-white"
              }
            }`}
            variants={childVariants}
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handlePrev}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-colors ${
                mytheme === "light"
                  ? "border border-blue-700 text-blue-700 hover:bg-blue-800 hover:text-white"
                  : "border border-gray-300 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
              aria-label="Previous testimonial"
            >
              <LeftOutlined className="text-xl" />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleNext}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-colors ${
                mytheme === "light"
                  ? "border border-blue-700 text-blue-700 hover:bg-blue-800 hover:text-white"
                  : "border border-gray-300 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
              aria-label="Next testimonial"
            >
              <RightOutlined className="text-xl " />
            </motion.button>
          </motion.div>

          <div className="relative">
            <Carousel
              ref={carouselRef}
              arrows={false}
              dots={true}
              infinite={true}
              slidesToShow={3}
              slidesToScroll={3}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: { slidesToShow: 2, slidesToScroll: 2 },
                },
                {
                  breakpoint: 640,
                  settings: { slidesToShow: 1, slidesToScroll: 1 },
                },
              ]}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-2">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
               
                  >
                    <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={testimonial.video_url}
                        title={`Testimonial Video ${index + 1}`}
                        className="rounded-xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p
                      className={`text-lg mb-2 font-poppins ${
                        mytheme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {testimonial.description}
                    </p>
                    <p
                      className={`text-base font-semibold font-poppins ${
                        mytheme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      {testimonial.location_name}
                    </p>
                  </motion.div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', Arial, Helvetica, sans-serif;
          }
          .ant-carousel .slick-dots li button {
            background: #d1d5db !important;
          }
          .ant-carousel .slick-dots li.slick-active button {
            background: #FFC800 !important;
          }
        `}</style>
      </motion.div>
    </ConfigProvider>
  );
};

export default Testimonials;