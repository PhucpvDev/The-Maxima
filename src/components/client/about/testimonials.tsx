"use client";

import React, { useRef, useState, useEffect } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { IMAGES } from "@/constants/client/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

interface TestimonialItem {
  text: string;
  name: string;
  position: string;
  avatar: string;
}

interface TransformedTestimonialData {
  title: string;
  description: string;
  testimonials: TestimonialItem[];
}

interface Translation {
  id: number;
  testimonials_section_id: number;
  languages_code: string;
  title: string;
  description: string;
  content: string;
  image_user: string;
  author: string;
  role: string;
  content_2: string;
  image_user_2: string;
  author_2: string;
  role_2: string;
  content_3: string;
  image_user_3: string;
  author_3: string;
  role_3: string;
}

interface RawTestimonialData {
  id: number;
  status: string;
  title: string;
  description: string;
  content: string;
  images_user: string;
  author: string;
  role: string;
  content_2: string;
  images_user_2: string;
  author_2: string;
  role_2: string;
  content_3: string;
  images_user_3: string;
  author_3: string;
  role_3: string;
  translations: Translation[];
}

async function getTestimonials(locale: string): Promise<TransformedTestimonialData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/testimonials_section?lang=${lang}&fields=*,translations.*`,
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
    const data: RawTestimonialData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const testimonials: TestimonialItem[] = [
      {
        text: source.content || "The fast-paced environment at The Maxima requires constant adaptation...",
        name: (source.author || "Ahmad Faizal").trim(),
        position: source.role || "Blockchain Developer",
        avatar: (source.image_user || source.images_user) || "d07ebb08-07a2-4237-b8f1-7191a44196ab",
      },
      {
        text: source.content_2 || "The Maxima feels like a family in the best sense...",
        name: (source.author_2 || "Mohd Hafiz").trim(),
        position: source.role_2 || "Crypto Analyst",
        avatar: (source.image_user_2 || source.images_user_2) || "c0f0ddec-3634-4386-8b41-352ae6e39bee",
      },
      {
        text: source.content_3 || "After more than a decade at The Maxima, I still feel the same excitement...",
        name: (source.author_3 || "Zulkifli Bin Ismail").trim(),
        position: source.role_3 || "Community Manager",
        avatar: (source.image_user_3 || source.images_user_3) || "7c859322-8dab-41b7-8f95-b29e044531d2",
      },
    ];

    return {
      title: source.title || "Share from \"The Maxima\"",
      description:
        source.description ||
        "The dynamic environment at The Maxima always has good values that bring joyful and happy working days to Maxima people.",
      testimonials,
    };
  } catch (error) {
    console.error("Error fetching Testimonials data:", error);
    return {
      title: "Share from \"The Maxima\"",
      description:
        "The dynamic environment at The Maxima always has good values that bring joyful and happy working days to Maxima people.",
      testimonials: [
        {
          text: "The fast-paced environment at The Maxima requires constant adaptation, which makes every workday exciting. It’s a place where each day brings new joy, new connections, and new challenges.",
          name: "Ahmad Faizal",
          position: "Blockchain Developer",
          avatar: "d07ebb08-07a2-4237-b8f1-7191a44196ab",
        },
        {
          text: "The Maxima feels like a family in the best sense. Colleagues support and uplift one another, sharing knowledge and overcoming challenges together. This sense of community makes me love what I do.",
          name: "Mohd Hafiz",
          position: "Crypto Analyst",
          avatar: "c0f0ddec-3634-4386-8b41-352ae6e39bee",
        },
        {
          text: "After more than a decade at The Maxima, I still feel the same excitement as my first day. The work here is uniquely fulfilling, bringing daily joy to everyone, whether in tech or beyond.",
          name: "Zulkifli Bin Ismail",
          position: "Community Manager",
          avatar: "7c859322-8dab-41b7-8f95-b29e044531d2",
        },
      ],
    };
  }
}

const MaximaTestimonials: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const carouselRef = useRef<any>(null);
  const [testimonialData, setTestimonialData] = useState<TransformedTestimonialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTestimonials(locale);
        setTestimonialData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  if (loading) {
    return (
      <div
        className={`w-full h-80 flex items-center justify-center text-2xl ${
          mytheme === "light" ? "text-gray-700" : "text-white"
        }`}
      >
        {locale === "vi" ? "Đang tải..." : locale === "zh" ? "加载中..." : "Loading..."}
      </div>
    );
  }

  const testimonials = testimonialData?.testimonials;
  const title = testimonialData?.title || "Share from \"The Maxima\"";
  const description =
    testimonialData?.description ||
    "The dynamic environment at The Maxima always has good values that bring joyful and happy working days to Maxima people.";

  return (
    <motion.div
      className={`relative w-full overflow-hidden ${
        mytheme === "light"
          ? "bg-gradient-to-r"
          : "bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] pt-90"
      }`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {mytheme === "light" && (
        <Image
          src={IMAGES.Banner5}
          alt="Banner Background"
          priority
          className="w-full md:h-full h-80"
        />
      )}

      <div className="max-w-4xl mx-auto text-center mb-12 -mt-70">
        <motion.h2
          className={`text-5xl font-bold mb-4 ${
            mytheme === "light" ? "text-white" : "text-yellow-600"
          }`}
          variants={childVariants}
        >
          {title}
        </motion.h2>
        <motion.p
          className={`text-xl text-center mx-auto max-w-2xl md:p-0 p-2 ${
            mytheme === "light" ? "text-white" : "text-white"
          }`}
          variants={childVariants}
        >
          {description}
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto relative pb-12">
        <button
          onClick={handlePrev}
          className={`absolute left-0 top-1/4 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg -ml-5 ${
            mytheme === "light" ? "bg-white" : "bg-[#1a1a1a]"
          }`}
        >
          <LeftOutlined
            style={{ color: mytheme === "light" ? "#1e3a8a" : "#FFC800" }}
          />
        </button>

        <button
          onClick={handleNext}
          className={`absolute right-0 top-1/4 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg -mr-5 ${
            mytheme === "light" ? "bg-white" : "bg-[#1a1a1a]"
          }`}
        >
          <RightOutlined
            style={{ color: mytheme === "light" ? "#1e3a8a" : "#FFC800" }}
          />
        </button>

        <Carousel
          ref={carouselRef}
          arrows={false}
          dots={false}
          slidesToShow={3}
          responsive={[
            {
              breakpoint: 1024,
              settings: { slidesToShow: 2 },
            },
            {
              breakpoint: 640,
              settings: { slidesToShow: 1 },
            },
          ]}
        >
          {testimonials?.map((item, index) => (
            <div key={index} className="px-4">
              <motion.div
                className="relative group overflow-visible"
                variants={childVariants}
              >
                {/* Testimonial card */}
                <div
                  className={`rounded-lg shadow-lg p-6 min-h-[250px] group-hover:rounded-b-none transition-all duration-300 ${
                    mytheme === "light"
                      ? "bg-white"
                      : "bg-[#1a1a1a] border border-yellow-800"
                  }`}
                >
                  <div
                    className={`min-h-36 text-lg leading-relaxed ${
                      mytheme === "light" ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {item.text}
                  </div>
                </div>

                {/* Avatar and Hover Info */}
                <div className="flex flex-col items-center mt-4 relative pb-10 ">
                  <div className="relative w-full flex flex-col items-center group-hover:-translate-y-12 transition-all duration-300 ease-out">
                    <div
                      className={`w-20 h-20 z-10 rounded-full overflow-hidden border-4 shadow-md mb-15 group-hover:mb-0 ${
                        mytheme === "light"
                          ? "border-white"
                          : "border-yellow-800"
                      }`}
                    >
                      <Image
                        src={`https://the-maxima.directus.app/assets/${item.avatar}`}
                        alt={item.name || "Testimonial avatar"}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    {item.name && (
                      <div
                        className={`absolute top-5 group-hover:rounded-t-none opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-lg shadow-md px-4 py-6 text-center w-full ${
                          mytheme === "light" ? "bg-white" : "bg-[#1a1a1a] border border border-yellow-800"
                        }`}
                      >
                        <p
                          className={`font-medium text-xl pt-11 ${
                            mytheme === "light"
                              ? "text-gray-800"
                              : "text-white"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-lg ${
                            mytheme === "light"
                              ? "text-blue-500"
                              : "text-white"
                          }`}
                        >
                          {item.position}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </Carousel>
      </div>
    </motion.div>
  );
};

export default MaximaTestimonials;