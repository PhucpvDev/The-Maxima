"use client";

import React, { useRef, useState, useEffect } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { IMAGES } from "@/constants/client/theme";
import { motion } from "framer-motion";
import { getTestimonials, TransformedTestimonialData, TestimonialItem } from "@/lib/directus/testimonials";

const MaximaTestimonials: React.FC = () => {
  const carouselRef = useRef<any>(null);
  const [testimonialData, setTestimonialData] = useState<TransformedTestimonialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTestimonials();
        setTestimonialData(result[0]); // Get the first item
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

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

  // Use data from API or fallback to hardcoded data
  const testimonials = testimonialData?.testimonials;
  const title = testimonialData?.title || "Share from \"The Maxima\"";
  const description = testimonialData?.description || "The dynamic environment at The Maxima always has good values that bring joyful and happy working days to Maxima people.";

  if (loading) {
    return <div className="w-full h-80 flex items-center justify-center">Loading testimonials...</div>;
  }

  return (
    <motion.div
      className="relative w-full bg-gradient-to-r overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Image
        src={IMAGES.Banner5}
        alt="Banner Background"
        priority
        className="w-full md:h-full h-80"
      />

      <div className="max-w-4xl mx-auto text-center mb-12 -mt-70">
        <motion.h2
          className="text-white text-4xl font-bold mb-4"
          variants={childVariants}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-white text-center mx-auto max-w-2xl md:p-0 p-2"
          variants={childVariants}
        >
          {description}
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto relative pb-12">
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/4 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg -ml-5"
        >
          <LeftOutlined style={{ color: "#1e3a8a" }} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/4 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg -mr-5"
        >
          <RightOutlined style={{ color: "#1e3a8a" }} />
        </button>

        <Carousel
          ref={carouselRef}
          arrows={false}
          dots={false}
          slidesToShow={3}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {testimonials?.map((item, index) => (
            <div key={index} className="px-4">
              <motion.div
                className="relative group overflow-visible"
                variants={childVariants}
              >
                {/* Quote mark */}
                <div className="absolute -top-2 left-6 z-10 text-5xl text-orange-400">
                  <Image
                    src={IMAGES.Note}
                    alt="Maxima Platform"
                    width={40}
                    height={500}
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Testimonial card */}
                <div className="bg-white rounded-lg shadow-lg p-6 min-h-[250px] group-hover:rounded-b-none transition-all duration-300">
                  <div className="min-h-36 text-gray-800 text-base leading-relaxed">
                    {item.text}
                  </div>
                </div>

                {/* Avatar and Hover Info */}
                <div className="flex flex-col items-center mt-4 relative">
                  <div className="relative w-full flex flex-col items-center group-hover:-translate-y-12 transition-all duration-300 ease-out">
                    <div className="w-20 h-20 z-10 rounded-full overflow-hidden border-4 border-white shadow-md mb-15 group-hover:mb-0">
                      <Image
                        src={`https://the-maxima.directus.app/assets/${item.avatar}`}
                        alt={item.name || "Testimonial avatar"}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    {item.name && (
                      <div className="absolute top-5 group-hover:rounded-t-none opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-white rounded-lg shadow-md px-4 py-6 text-center w-full">
                        <p className="font-medium text-gray-800 pt-11">
                          {item.name}
                        </p>
                        <p className="text-blue-500">{item.position}</p>
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