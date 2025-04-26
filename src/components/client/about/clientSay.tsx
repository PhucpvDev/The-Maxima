"use client";

import React, { useRef, useEffect, useState } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "antd/dist/reset.css";
import { getClientSay } from "@/lib/directus/client_say";

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

const Testimonials: React.FC = () => {
  const carouselRef = useRef<any>(null);
  const [title, setTitle] = useState("OUR CLIENTS SAY");
  const [testimonials, setTestimonials] = useState<{ video_url: string; description: string; location_name: string }[] | undefined>(undefined);
  const [featuredVideo, setFeaturedVideo] = useState("https://www.youtube.com/embed/p23vKxuslNA?si=8jkY3iPILbTu0VBM");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getClientSay();
        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
          // Handle both array response and direct object response
          const data = Array.isArray(result) ? result[0] : result;
          
          if (data) {
            // Set the title if available
            if (data.title) {
              setTitle(data.title);
            }
            
            // Set featured video to video_url_2 as in the original component
            if (data.video_url_2) {
              setFeaturedVideo(data.video_url_2);
            }
            
            // Create testimonials array from the API data
            const apiTestimonials = [];
            
            for (let i = 1; i <= 4; i++) {
              const videoUrlKey = `video_url_${i}`;
              const descriptionKey = `description_${i}`;
              const locationNameKey = `location_name_${i}`;
              
              if (data[videoUrlKey] && data[descriptionKey] && data[locationNameKey]) {
                apiTestimonials.push({
                  video_url: data[videoUrlKey],
                  description: data[descriptionKey],
                  location_name: data[locationNameKey],
                });
              }
            }
            
            // Only update state if we have testimonials from the API
            if (apiTestimonials.length > 0) {
              setTestimonials(apiTestimonials);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching client testimonials:", error);
        // Will use default data if fetch fails
      }
    };
    
    fetchData();
  }, []);

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

  if (!testimonials) {
    return <div className="text-center py-16 text-2xl font-poppins">Đang tải...</div>;
  }

  return (
    <motion.div
      className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-4xl font-bold text-gray-800 mb-12 font-poppins"
          variants={childVariants}
        >
          {title}
        </motion.p>

        {/* Main Video Section */}
        <motion.div
          className="relative w-full md:h-[500px] h-[350px] aspect-video mb-12 rounded-xl overflow-hidden shadow-xl"
          variants={childVariants}
        >
          <iframe
            width="100%"
            height="500px"
            src={featuredVideo}
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
            <LeftOutlined className="text-xl" />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleNext}
            className="flex items-center justify-center w-10 h-10 border border-blue-700 text-white rounded-full shadow-md hover:bg-blue-800 transition-colors"
          >
            <RightOutlined className="text-xl" />
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
            {testimonials?.map((testimonial, index) => (
              <div key={index} className="px-2">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col rounded-xl h-full transition-shadow"
                >
                  <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={testimonial.video_url}
                      title="YouTube video player"
                      className="rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                  <p className="text-lg text-gray-700 mb-2 font-poppins">
                    {testimonial.description}
                  </p>
                  <p className="text-base text-gray-800 font-semibold font-poppins">
                    {testimonial.location_name}
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