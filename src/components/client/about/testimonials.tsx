"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { IMAGES } from "@/constants/client/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/testimonials_section?lang=${lang}&fields=*,translations.*`,
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
        avatar:
          ("image_user" in source ? source.image_user : source.images_user) ||
          "d07ebb08-07a2-4237-b8f1-7191a44196ab",
      },
      {
        text: source.content_2 || "The Maxima feels like a family in the best sense...",
        name: (source.author_2 || "Mohd Hafiz").trim(),
        position: source.role_2 || "Crypto Analyst",
        avatar:
          ("image_user_2" in source ? source.image_user_2 : source.images_user_2) ||
          "c0f0ddec-3634-4386-8b41-352ae6e39bee",
      },
      {
        text: source.content_3 || "After more than a decade at The Maxima, I still feel the same excitement...",
        name: (source.author_3 || "Zulkifli Bin Ismail").trim(),
        position: source.role_3 || "Community Manager",
        avatar:
          ("image_user_3" in source ? source.image_user_3 : source.images_user_3) ||
          "7c859322-8dab-41b7-8f95-b29e044531d2",
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
          text: "The fast-paced environment at The Maxima requires constant adaptation, which makes every workday exciting. It's a place where each day brings new joy, new connections, and new challenges.",
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

const testimonialCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};

const MaximaTestimonials: React.FC = () => {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [testimonialData, setTestimonialData] = useState<TransformedTestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dataFetchedRef = useRef(false);
  const slideShowInitializedRef = useRef(false);

  // Memoize nextSlide and prevSlide to avoid recreating on each render
  const nextSlide = useCallback(() => {
    if (testimonialData) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialData.testimonials.length);
    }
  }, [testimonialData]);

  const prevSlide = useCallback(() => {
    if (testimonialData) {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? testimonialData.testimonials.length - 1 : prevIndex - 1
      );
    }
  }, [testimonialData]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Setup and cleanup slide show
  const setupSlideShow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Only check document.hidden if document is defined (client-side)
      if (typeof document !== "undefined" && !document.hidden) {
        nextSlide();
      } else {
        nextSlide(); // Fallback for server or when document.hidden is unavailable
      }
    }, 6000);

    slideShowInitializedRef.current = true;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [nextSlide]);

  // Manage data fetching
  if (!dataFetchedRef.current) {
    dataFetchedRef.current = true;
    getTestimonials(locale)
      .then((result) => {
        setTestimonialData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      });
  }

  // Manage theme and auto slideshow in useEffect to ensure client-side execution
  useEffect(() => {
    // Set theme
    if (typeof document !== "undefined" && mytheme) {
      document.documentElement.setAttribute("data-theme", mytheme);
    }

    // Setup slideshow
    if (testimonialData && !loading && !slideShowInitializedRef.current) {
      setupSlideShow();
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mytheme, testimonialData, loading, setupSlideShow]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center py-20 ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const testimonials = testimonialData?.testimonials || [];
  const title = testimonialData?.title || "Share from \"The Maxima\"";
  const description =
    testimonialData?.description ||
    "The dynamic environment at The Maxima always has good values that bring joyful and happy working days to Maxima people.";

  return (
    <section
      className={`py-24 relative overflow-hidden font-inter ${
        mytheme === "light"
          ? "bg-gradient-to-br from-blue-50 to-white"
          : "bg-gradient-to-br from-gray-900 to-gray-950"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {mytheme === "light" && (
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src={IMAGES.Banner5}
              alt="Background Pattern"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 to-white/90"></div>
          </div>
        )}

        <div
          className={`absolute inset-0 opacity-5 ${
            mytheme === "light" ? "bg-gray-900" : "bg-white"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, ${
              mytheme === "light" ? "#1a202c" : "#ffffff"
            } 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
              }`}
            >
              <span className="material-symbols-outlined text-3xl text-yellow-600">forum</span>
            </div>

            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                mytheme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {title}
            </h2>

            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>

            <p
              className={`text-lg max-w-3xl mx-auto ${
                mytheme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {description}
            </p>
          </div>
        </motion.div>

        <div className="hidden md:block">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                className={`rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 flex flex-col min-h-[300px] ${
                  mytheme === "light"
                    ? "bg-white hover:shadow-xl"
                    : "bg-gray-800 hover:shadow-xl hover:shadow-black/30"
                }`}
                variants={testimonialCardVariants}
                whileHover="hover"
              >
                <div
                  className={`absolute top-4 right-4 ${
                    mytheme === "light" ? "text-yellow-200" : "text-gray-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-5xl">format_quote</span>
                </div>

                <div className="p-8 pt-12 pb-6 flex-grow">
                  <p
                    className={`text-lg leading-relaxed mb-6 ${
                      mytheme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>

                <div
                  className={`px-8 py-5 flex items-center mt-auto ${
                    mytheme === "light" ? "bg-gray-50" : "bg-gray-900/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shadow-md">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${item.avatar}`}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        mytheme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        mytheme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {item.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      slidesRef.current[index] = el;
                    }}
                    className="min-w-full"
                  >
                    <div
                      className={`rounded-xl overflow-hidden shadow-lg m-2 flex flex-col h-full ${
                        mytheme === "light" ? "bg-white" : "bg-gray-800"
                      }`}
                    >
                      <div
                        className={`absolute top-4 right-4 ${
                          mytheme === "light" ? "text-yellow-200" : "text-gray-700"
                        }`}
                      >
                        <span className="material-symbols-outlined text-4xl">format_quote</span>
                      </div>

                      <div className="p-6 pt-10 pb-4 flex-grow">
                        <p
                          className={`text-base leading-relaxed mb-6 ${
                            mytheme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>

                      <div
                        className={`px-6 py-4 flex items-center mt-auto ${
                          mytheme === "light" ? "bg-gray-50" : "bg-gray-900/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shadow-md">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${item.avatar}`}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-sm ${
                              mytheme === "light" ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={`text-xs ${
                              mytheme === "light" ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {item.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 md:px-0 px-2">
              <div className="flex space-x-2 md:gap-0 gap-4 text-white">
                <button
                  onClick={prevSlide}
                  className={`p-2 rounded-lg ${
                    mytheme === "light"
                      ? "bg-white text-gray-800 hover:bg-gray-100"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  } shadow-md transition-colors`}
                  aria-label="Previous testimonial"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button
                  onClick={nextSlide}
                  className={`p-2 rounded-lg ${
                    mytheme === "light"
                      ? "bg-white text-gray-800 hover:bg-gray-100"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  } shadow-md transition-colors`}
                  aria-label="Next testimonial"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeIndex === index
                        ? mytheme === "light"
                          ? "bg-yellow-500 w-6"
                          : "bg-yellow-600 w-6"
                        : mytheme === "light"
                        ? "bg-gray-300"
                        : "bg-gray-700"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

        .font-inter {
          font-family: "Inter", Arial, sans-serif;
        }

        /* Animation for the loader */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MaximaTestimonials;