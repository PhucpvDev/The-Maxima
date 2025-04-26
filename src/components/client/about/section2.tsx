"use client"; // Mark as Client Component

import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getAbout2 } from "@/lib/directus/about_2";

interface ContentData {
  hero_title: string;
  hero_cover: string;
  hero_content2: string;
}

interface AboutSectionProps {
  data?: ContentData; // Data passed as prop from parent
}

export default function AboutSection({ data: initialData }: AboutSectionProps) {
  const [data, setData] = useState<ContentData>(
    initialData || {
      hero_title: "",
      hero_cover: "",
      hero_content2: "",
    }
  );
  const [showMore, setShowMore] = useState(false);

  // Fetch data client-side if not provided
  useEffect(() => {
    if (!initialData) {
      const fetchData = async () => {
        try {
          const result = await getAbout2();
          const fetchedData = Array.isArray(result) ? result[0] : result;
          setData({
            hero_title: fetchedData.hero_title || "",
            hero_cover: fetchedData.hero_cover || "",
            hero_content2: fetchedData.hero_content2 || `Maxima introduces a decentralized platform, empowering users to join a community where profits are shared, moving beyond traditional trading models to ensure mutual success for all.

• Traders achieve optimized profits
• IBs gain steady profits
• Maxima ensures sustainable growth

Maxima was launched as an AI-driven platform with expert traders, built on a decentralized system. It aligns the goals of traders, IBs, and the platform by optimizing profits through innovative strategies, ensuring everyone benefits together.

Here's how it operates:

• Traders use advanced strategies to optimize profits, ensuring consistent returns even in challenging market conditions.
• IBs earn steady profits as traders remain active in the Maxima community.
• Maxima benefits from stable growth through its decentralized platform and community-driven model.

Profit Sharing for Everyone
Maxima's goal is clear — to unite traders, IBs, and the platform in a shared mission: sustainable profits. Through a decentralized community, Maxima ensures everyone thrives together with optimized returns.`,
          });
        } catch (error) {
          console.error("Error fetching home data:", error);
        }
      };
      fetchData();
    }
  }, [initialData]);

  const { hero_title, hero_cover, hero_content2 } = data;

  // Split hero_content2 into main content and additional content for "Show More"
  const contentParts = hero_content2.split("Profit Sharing for Everyone");
  const mainContent = contentParts[0]?.trim() || "";
  const additionalContent = contentParts[1]
    ? `Profit Sharing for Everyone\n${contentParts[1].trim()}`
    : "";

  // Parse content into lines
  const mainContentLines = mainContent.split("\n").filter((line) => line.trim());
  const additionalContentLines = additionalContent
    .split("\n")
    .filter((line) => line.trim());

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

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: "1rem",
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.25, delay: 0.15 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  // Determine the image source for hero_cover
  const imageSrc = hero_cover
    ? `https://the-maxima.directus.app/assets/${hero_cover}`
    : IMAGES.Banner3; // Fallback to a default image from IMAGES

  return (
    <motion.div
      className="bg-[#F4F8FB] relative overflow-hidden md:py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute z-0 left-0 top-0 opacity-60 md:opacity-80">
        <Image
          src={IMAGES.BgFooter1}
          alt="Background Element"
          width={900}
          height={300}
          priority
          className="w-48 md:w-72 lg:w-auto"
        />
      </div>
      <div className="absolute right-0 z-0 top-20 opacity-70 md:opacity-90">
        <Image
          src={IMAGES.BgFooter2}
          alt="Background Element"
          width={900}
          height={300}
          priority
          className="w-64 md:w-96 lg:w-auto"
        />
      </div>

      <div className="max-w-7xl mx-auto z-10 relative p-4 sm:p-6 md:p-8 lg:p-12">
        <Row
          gutter={[{ xs: 16, sm: 24, md: 32 }, { xs: 24, sm: 32, md: 48 }]}
          className="items-center"
        >
          <Col xs={24} lg={12}>
            <motion.div
              className="relative w-full rounded-2xl md:-mt-20 overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
              variants={childVariants}
            >
              <div className="bg-gradient-to-br h-full w-full absolute top-0 left-0 opacity-90"></div>
              <Image
                src={imageSrc}
                alt="Maxima Platform"
                width={600}
                height={500}
                priority
                className="object-cover w-full h-auto"
                onError={(e) => {
                  console.error("Failed to load image:", imageSrc);
                  e.currentTarget.src = IMAGES.Banner3.src; // Fallback on error
                }}
              />
              <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div variants={childVariants}>
              <motion.h2
                className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 -mt-20 relative"
                variants={childVariants}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 drop-shadow-md">
                  {hero_title || "MAXIMA DAO"}
                </span>
              </motion.h2>
              <motion.div
                className="space-y-4 text-base md:text-lg text-gray-800 leading-relaxed"
                variants={childVariants}
              >
                {mainContentLines.length > 0 ? (
                  mainContentLines.map((line, index) => {
                    if (line.startsWith("• ")) {
                      return (
                        <ul key={index} className="list-disc pl-6 space-y-3">
                          <li className="transition-all duration-300 hover:translate-x-1">
                            {line.replace("• ", "")}
                          </li>
                        </ul>
                      );
                    }
                    return <p key={index}>{line}</p>;
                  })
                ) : (
                  <p>No content available.</p>
                )}

                <AnimatePresence>
                  {showMore && additionalContentLines.length > 0 && (
                    <motion.div
                      key="expanded-content"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 mb-1 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-blue-50">
                        <h3 className="font-bold text-gray-800 mb-2">
                          {additionalContentLines[0]}
                        </h3>
                        {additionalContentLines.length > 1 && (
                          <p>{additionalContentLines[1]}</p>
                        )}
                      </div>
                      {additionalContentLines.slice(2).map((line, index) => {
                        if (line.startsWith("• ")) {
                          return (
                            <ul
                              key={index}
                              className="list-disc pl-6 space-y-3"
                            >
                              <li className="transition-all duration-300 hover:translate-x-1">
                                {line.replace("• ", "")}
                              </li>
                            </ul>
                          );
                        }
                        return <p key={index}>{line}</p>;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="mt-8 text-center text-white sm:text-left"
                variants={childVariants}
              >
                <motion.button
                  className="px-8 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ease-in-out bg-gradient-to-r from-[#1a1a1a] to-[#333333] text-white hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={() => setShowMore(!showMore)}
                  whileTap={{ scale: 0.97 }}
                >
                  {showMore ? "Show Less" : "See More"}
                </motion.button>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
}