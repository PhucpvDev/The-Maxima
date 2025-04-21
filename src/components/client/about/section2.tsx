import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutSection() {
  const [showMore, setShowMore] = useState(false);

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

  // Variants for the expandable content (unchanged)
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

  return (
    <>
      <motion.div
        className="mb-16 bg-[#F4F8FB] relative overflow-hidden md:py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background elements with responsive positioning */}
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
                  src={IMAGES.Banner3}
                  alt="Maxima Platform"
                  width={600}
                  height={500}
                  priority
                  className="object-cover w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#002146] to-transparent"></div>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div variants={childVariants}>
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-[#002146] mb-6 -mt-20 relative"
                  variants={childVariants}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#002146] to-[#0059b3]">
                    MAXIMA DAO
                  </span>
                </motion.h2>
                <motion.div
                  className="space-y-4 text-base md:text-base text-[#335479] leading-relaxed"
                  variants={childVariants}
                >
                  <p>
                    A new vision three years ago, the founder of Maxima, Mr.
                    Chen, realized the need for a change. Instead of the usual
                    "broker vs. trader" model, he envisioned a system where
                    everyone wins:
                  </p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li className="transition-all duration-300 hover:translate-x-1">
                      Users (traders) earn consistent profits
                    </li>
                    <li className="transition-all duration-300 hover:translate-x-1">
                      IBs earn stable commissions
                    </li>
                    <li className="transition-all duration-300 hover:translate-x-1">
                      The company maintains sustainable revenue
                    </li>
                  </ul>
                  <p>
                    The Birth of Maxima After years of testing and analysis, Mr.
                    Chen launched Maxima, a platform built on the revolutionary
                    idea of a dual-account trading system. Instead of forcing
                    users to win or lose, Maxima aligns the goals of users, IBs,
                    and the company. Here's how it works:
                  </p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li className="transition-all duration-300 hover:translate-x-1">
                      Traders open two accounts (Account A and Account B) with
                      opposite positions in the market, ensuring profits even
                      during losses.
                    </li>
                  </ul>

                  {/* Expanded content with existing animation */}
                  <AnimatePresence>
                    {showMore && (
                      <motion.div
                        key="expanded-content"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={contentVariants}
                        className="overflow-hidden"
                      >
                        <ul className="list-disc pl-6 space-y-3">
                          <li className="transition-all duration-300 hover:translate-x-1">
                            <span className="font-semibold text-[#003366]">
                              IBs earn continuous commissions
                            </span>{" "}
                            because traders stay engaged in the system longer.
                          </li>
                          <li className="transition-all duration-300 hover:translate-x-1">
                            <span className="font-semibold text-[#003366]">
                              The company benefits from stable cash flow
                            </span>{" "}
                            through broker rebates, subscription fees, and
                            controlled payouts.
                          </li>
                        </ul>
                        <div className="mt-6 mb-1 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-blue-50">
                          <h3 className="font-bold text-[#002146] mb-2">
                            A Shared Goal for All
                          </h3>
                          <p>
                            <span className="font-semibold text-[#003366]">
                              Maxima's ultimate goal
                            </span>{" "}
                            is simple — to align the interests of{" "}
                            <span className="font-semibold text-[#003366]">
                              traders, IBs, and the company in one direction
                            </span>
                            : profit. No longer bound by the "broker vs. trader"
                            system, Maxima is a platform where everyone wins
                            together.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  className="mt-8 text-center text-white sm:text-left"
                  variants={childVariants}
                >
                  <motion.button
                    className="px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ease-in-out
                      bg-gradient-to-r from-[#002146] to-[#003b7a] text-white hover:shadow-lg
                      hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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
    </>
  );
}