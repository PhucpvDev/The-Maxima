"use client";

import React, { useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";

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

// Animation variants for carousel cards (similar to table rows in previous examples)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Animation variants for buttons (reused from the original code)
const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
  tap: { scale: 0.9 },
};

const testimonials = [
  {
    link: (
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/NVzcKBNjn38?si=ZCQt1mzFff1z0VBL"
        title="YouTube video player"
        className="rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
    quote: "“Invested 50,000 USDT, Profits reached more than 200%”",
    author: "Tung Hua, Malaysia",
  },
  {
    link: (
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM"
        title="YouTube video player"
        className="rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
    quote:
      "“I invested 10,000 USDT, 4 months I earn about 12,000 USDT, started in...”",
    author: "Iskandar, Singapore",
  },
  {
    link: (
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/mwmUk9Fxmuc?si=XP4d0A24slYoOcuZ"
        title="YouTube video player"
        className="rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
    quote: "“Join on 8th May 2024. Now monthly earning around 6 figures”",
    author: "Jimmy, Malaysia",
  },
  {
    link: (
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/49Vwgi4KQ9M?si=Y8dc6EApPlgjfsgH"
        title="YouTube video player"
        className="rounded-xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
    quote: "“I’ll introduce to my friends, because the ROI is awesome”",
    author: "Erica, Malaysia",
  },
];

const Testimonials: React.FC = () => {
  const carouselRef = useRef<any>(null);

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

  return (
    <motion.div
      className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
     

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.p
          className="text-4xl font-bold text-blue-900 mb-12"
          variants={childVariants}
        >
          OUR CLIENTS SAY
        </motion.p>

        {/* Main Video Section */}
        <motion.div
          className="relative w-full md:h-[500px] h-[350px] aspect-video mb-12 rounded-xl overflow-hidden shadow-xl"
          variants={childVariants}
        >
          <iframe
            width="100%"
            height="500px"
            src="https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM"
            title="YouTube video player"
            className="absolute top-0 left-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </motion.div>

        <motion.div
          className="relative mb-8 flex justify-end gap-4"
          variants={childVariants}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handlePrev}
            className="flex items-center justify-center w-10 h-10 border border-blue-700 text-white rounded-full shadow-md hover:bg-blue-800 transition-colors"
          >
            <LeftOutlined className="text-lg" />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleNext}
            className="flex items-center justify-center w-10 h-10 border border-blue-700 text-white rounded-full shadow-md hover:bg-blue-800 transition-colors"
          >
            <RightOutlined className="text-lg" />
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
                  className="flex flex-col rounded-xl h-full transition-shadow"
                >
                  <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                    {testimonial.link}
                  </div>
                  <p className="text-base text-gray-700 mb-2">
                    {testimonial.quote}
                  </p>
                  <p className="text-sm text-blue-900 font-semibold">
                    {testimonial.author}
                  </p>
                </motion.div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;