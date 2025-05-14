"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useLocale } from "next-intl";
import Image from "next/image";

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

interface ClientSayData {
  title: string;
  featuredVideo: string;
  testimonials: Testimonial[];
}

async function getClientSay(locale: string): Promise<ClientSayData> {
  try {
    const lang =
      locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/client_say?lang=${lang}&fields=*,translations.*`,
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
    const data: RawClientSayData = Array.isArray(result.data)
      ? result.data[0]
      : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const indices = lang === "vi-VN" ? [4, 1, 2, 3] : [1, 2, 3, 4];

    const testimonials: Testimonial[] = indices.map((index, i) => {
      const videoKey = `video_url_${i + 1}` as keyof (
        | Translation
        | RawClientSayData
      );
      const descriptionKey = `description_${index}` as keyof (
        | Translation
        | RawClientSayData
      );
      const locationKey = `location_name_${index}` as keyof (
        | Translation
        | RawClientSayData
      );
      const fallbackDescriptionKey = `description_${
        i + 1
      }` as keyof RawClientSayData;
      const fallbackLocationKey = `location_name_${
        i + 1
      }` as keyof RawClientSayData;

      return {
        video_url:
          (source[videoKey] as string) || (data[videoKey] as string) || "",
        description:
          (source[descriptionKey] as string) ||
          (data[fallbackDescriptionKey] as string) ||
          "",
        location_name:
          (source[locationKey] as string) ||
          (data[fallbackLocationKey] as string) ||
          "",
      };
    });

    return {
      title: source.title || "OUR CLIENTS SAY",
      featuredVideo:
        source.video_url_2 ||
        data.video_url_2 ||
        "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
      testimonials,
    };
  } catch (error: unknown) {
    console.error("Error fetching Client Say data:", error);
    return {
      title: "OUR CLIENTS SAY",
      featuredVideo:
        "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
      testimonials: [
        {
          video_url:
            "https://www.youtube.com/embed/NVzcKBNjn38?si=ZCQt1mzFff1z0VBL",
          description: "Invested 50,000 USDT, Profits reached more than 200%",
          location_name: "Tung Hua, Malaysia",
        },
        {
          video_url:
            "https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM",
          description:
            "I invested 10,000 USDT, 4 months I earn about 12,000 USDT, started in...",
          location_name: "Iskandar, Singapore",
        },
        {
          video_url:
            "https://www.youtube.com/embed/mwmUk9Fxmuc?si=XP4d0A24slYoOcuZ",
          description:
            "Join on 8th May 2024. Now monthly earning around 6 figures",
          location_name: "Jimmy, Malaysia",
        },
        {
          video_url:
            "https://www.youtube.com/embed/49Vwgi4KQ9M?si=Y8dc6EApPlgjfsgH",
          description:
            "I'll introduce to my friends, because the ROI is awesome",
          location_name: "Erica, Malaysia",
        },
      ],
    };
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const TestimonialsSection: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<ClientSayData | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<number | null>(null);
  const videosRef = useRef<(HTMLIFrameElement | null)[]>([]);
  const mainVideoRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getClientSay(locale);
        setData(fetchedData);
      } catch (error: unknown) {
        console.error("Error fetching client testimonials:", error);
      }
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  useEffect(() => {
    if (data && data.testimonials[activeSlide]) {
      setIsVideoLoaded(false);
      setVideoError(null);

      if (mainVideoRef.current) {
        const currentSrc = mainVideoRef.current.src;
        mainVideoRef.current.src = "";
        setTimeout(() => {
          if (mainVideoRef.current) {
            mainVideoRef.current.src = currentSrc;
          }
        }, 100);
      }
    }
  }, [activeSlide, data]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm:
      mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return (
      <div
        className={`flex items-center justify-center py-20 ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}>
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { title, testimonials } = data;

  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : "";
  };

  const getVideoThumbnail = (url: string): string => {
    const videoId = extractVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = (index: number) => {
    setVideoError(index);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const formatVideoUrl = (url: string): string => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`;
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <section
        className={`py-24 relative overflow-hidden font-inter ${
          mytheme === "light"
            ? "bg-gradient-to-b from-gray-50 to-white"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
        }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-5 ${
              mytheme === "light" ? "bg-gray-900" : "bg-white"
            }`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                mytheme === "light" ? "#1a202c" : "#ffffff"
              } 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                mytheme === "light" ? "text-gray-900" : "text-white"
              }`}>
              {title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-yellow-500"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="h-px w-16 bg-yellow-500"></div>
            </div>
          </motion.div>

          <motion.div
            className="md:mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}>
            <div className="relative">
              <div
                className={`relative w-full md:h-full h-[350px] aspect-video rounded-2xl overflow-hidden shadow-2xl ${
                  mytheme === "light" ? "shadow-gray-200/80" : "shadow-black/50"
                }`}>
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                )}

                {videoError === activeSlide ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Image
                      src={getVideoThumbnail(
                        testimonials[activeSlide].video_url
                      )}
                      alt="Video thumbnail"
                      fill
                      className="w-full h-full object-cover"
                      onError={() => {
                        const target = event?.target as HTMLImageElement;
                        if (target) {
                          target.style.display = "none";
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        setVideoError(null);
                        setIsVideoLoaded(false);
                      }}
                      className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl">
                          play_arrow
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <iframe
                    ref={mainVideoRef}
                    src={formatVideoUrl(testimonials[activeSlide].video_url)}
                    title="Featured Testimonial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    onLoad={handleVideoLoad}
                    onError={() => handleVideoError(activeSlide)}></iframe>
                )}

                <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center transform -translate-y-1/2 z-20">
                  <button
                    onClick={prevSlide}
                    className={`px-2.5 py-2 md:w-[55px] md:h-[55px] cursor-pointer rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transform transition-all ${
                      mytheme === "light"
                        ? "hover:shadow-lg"
                        : "hover:shadow-black/30"
                    }`}
                    aria-label="Previous testimonial">
                    <span className="material-symbols-outlined text-white">
                      arrow_back
                    </span>
                  </button>
                  <button
                    onClick={nextSlide}
                    className={`px-2.5 py-2 md:w-[55px] md:h-[55px] cursor-pointer rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transform transition-all ${
                      mytheme === "light"
                        ? "hover:shadow-lg"
                        : "hover:shadow-black/30"
                    }`}
                    aria-label="Next testimonial">
                    <span className="material-symbols-outlined text-white">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                      activeSlide === index
                        ? "w-12 bg-yellow-500"
                        : "w-8 bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}></button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid hidden md:block grid-cols-1 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 ${
                  activeSlide === index
                    ? mytheme === "light"
                      ? "ring-2 ring-yellow-500 scale-105 shadow-xl"
                      : "ring-2 ring-yellow-500 scale-105 shadow-xl shadow-black/30"
                    : mytheme === "light"
                    ? "hover:shadow-lg"
                    : "hover:shadow-lg hover:shadow-black/20"
                }`}
                onClick={() => goToSlide(index)}>
                <div className="relative aspect-video">
                  <div
                    className={`absolute inset-0 ${
                      activeSlide === index
                        ? "bg-black/0"
                        : "bg-black/40 pointer-events-none"
                    } transition-colors duration-300`}></div>

                  {activeSlide !== index ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={getVideoThumbnail(testimonial.video_url)}
                        alt={`Testimonial ${index + 1} thumbnail`}
                        className="w-full h-full object-cover"
                        fill
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const iframe =
                            target.nextSibling as HTMLIFrameElement;
                          if (iframe) {
                            iframe.style.display = "block";
                          }
                        }}
                      />
                      <iframe
                        style={{ display: "none" }}
                        src={formatVideoUrl(testimonial.video_url)}
                        title={`Testimonial video ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">
                            play_arrow
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      ref={(el: HTMLIFrameElement | null) => {
                        videosRef.current[index] = el;
                      }}
                      src={formatVideoUrl(testimonial.video_url)}
                      title={`Testimonial video ${index + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen></iframe>
                  )}
                </div>
                <div
                  className={`p-4 ${
                    activeSlide === index
                      ? mytheme === "light"
                        ? "bg-yellow-50"
                        : "bg-yellow-900/20"
                      : mytheme === "light"
                      ? "bg-white"
                      : "bg-gray-900"
                  }`}>
                  <p
                    className={`text-sm line-clamp-2 ${
                      mytheme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                    {testimonial.description}
                  </p>
                  <p
                    className={`text-xs font-medium mt-2 ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                    {testimonial.location_name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

          .font-inter {
            font-family: "Inter", Arial, sans-serif;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
};

export default TestimonialsSection;
