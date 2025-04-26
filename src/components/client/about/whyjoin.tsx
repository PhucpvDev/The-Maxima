"use client"; // Mark as Client Component

import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getWhyJoin, RawWhyJoinMaximaData } from "@/lib/directus/whyjoin";

// Import Google Fonts for a modern, attractive font
const fontStyle = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  </style>
`;

// Define TypeScript interfaces for the transformed data
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

export default function WhyJoinMaxima() {
  const [data, setData] = useState<WhyJoinMaximaData | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWhyJoin(); // result is now guaranteed to be RawWhyJoinMaximaData[]
        const rawData: RawWhyJoinMaximaData = result[0]; // Take the first item

        // Transform the raw data into the sections array
        const transformedData: WhyJoinMaximaData = {
          title: rawData.title || "WHY JOIN MAXIMA?",
          subtitle: rawData.subtitle || "“WIN-WIN-WIN Strategy”",
          sections: [
            {
              section_title: rawData.conclusion_title || "TRADER's WIN",
              description:
                rawData.conclusion_description ||
                "Regardless of market directions, traders earn using a proven strategy that guarantees consistent profits",
              button_text: rawData.conclusion_button || "Register",
              image: rawData.conclusion_image || "",
            },
            {
              section_title: rawData.conclusion_title_2 || "IB's WIN",
              description:
                rawData.conclusion_description_2 ||
                "Traders' profits are secure and there is no risk of trading loss – resulting in increased customer retention, generating long term IB commissions",
              button_text: rawData.conclusion_button_2 || "Explore IB",
              image: rawData.conclusion_image_2 || "",
            },
            {
              section_title: rawData.conclusion_title_3 || "MAXIMA WIN",
              description:
                rawData.conclusion_description_3 ||
                "With the proven strategy, Maxima achieves consistent profits, ensuring a stable growth removing the need of constantly acquiring new clients",
              button_text: undefined, // No button for this section
              image: rawData.conclusion_image_3 || "",
            },
            {
              section_title:
                rawData.conclusion_title_4 || "So you should choose Maxima",
              description:
                rawData.conclusion_description_4 ||
                "We value our words. Our words are backed up by concrete actions.",
              button_text: undefined, // No button for this section
              image: rawData.conclusion_image_4 || "",
            },
          ],
        };
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching Why Join Maxima data:", error);
      }
    };
    fetchData();
  }, []);

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

  if (!data) {
    return null; // Optionally, you can add a loading placeholder here
  }

  const { title, subtitle, sections } = data;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: fontStyle }} />
      <div className="bg-[#f0f8ff] py-12 font-poppins"> {/* Added font-poppins */}
        {/* Tiêu đề */}
        <motion.div
          className="text-center mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            className="text-2xl md:text-4xl font-bold text-gray-800 uppercase"
            variants={childVariants}
          >
            {title}
          </motion.p>
          <motion.p
            className="text-2xl md:text-3xl font-semibold text-gray-700 mt-3 italic" // Thêm italic
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
                  <p className="md:text-3xl text-2xl font-bold text-gray-700 mb-3">
                    {section.section_title}
                  </p>
                  <p className="text-lg text-gray-700 mb-4">
                    {section.description}
                  </p>
                  {section.button_text && (
                    <div className="text-white font-medium">
                      <motion.button
                        className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 sm:px-16 py-3 rounded-full w-full sm:w-auto text-lg" // Increased font size and padding
                        variants={childVariants}
                      >
                        {section.button_text}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
                <motion.div className="md:w-1/2" variants={childVariants}>
                  <Image
                    src={
                      section.image
                        ? `https://the-maxima.directus.app/assets/${section.image}`
                        : fallbackImage.src
                    }
                    alt={section.section_title}
                    width={280}
                    height={300}
                    className="mx-auto"
                    onError={(e) => {
                      console.error(
                        "Failed to load image:",
                        section.image
                          ? `https://the-maxima.directus.app/assets/${section.image}`
                          : fallbackImage.src
                      );
                      e.currentTarget.src = fallbackImage.src; // Fallback on error
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}