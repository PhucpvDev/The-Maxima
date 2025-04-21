import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";
import { motion } from "framer-motion";

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

export default function AppleOrchardSection() {
  return (
    <motion.section
      className="mb-16 bg-[#F4F8FB] relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background Decorations */}
      <div className="absolute z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Decorative Background 1"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 z-0 top-20">
        <Image
          src={IMAGES.BgFooter2}
          alt="Decorative Background 2"
          width={900}
          height={300}
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto z-10 relative p-6 md:p-12">
        <Row gutter={[32, 32]} className="items-center">
          <Col xs={24} lg={14}>
            <motion.p
              className="text-3xl font-bold text-[#002146] mb-4"
              variants={childVariants}
            >
              APPLE ORCHARD
            </motion.p>
            <motion.p
              className="text-xl text-[#335479] font-semibold mb-6"
              variants={childVariants}
            >
              Revolutionizing Decentralized Trading
            </motion.p>
            <motion.div
              className="space-y-5 text-base text-[#335479]"
              variants={childVariants}
            >
              <p>
                Apple Orchard is the world’s first decentralized trading DAO that
                combines cutting-edge technology with user-centric innovation.
                Featuring a unique dashboard and back-office system, it provides
                unparalleled transparency and control for traders and IBs.
              </p>
              <p>
                With a comprehensive, gamified IB incentive tracking system,
                Apple Orchard transforms statistics into an engaging Game-Fi
                experience, empowering users to thrive in a decentralized
                ecosystem.
              </p>
            </motion.div>
          </Col>

          <Col xs={24} lg={10}>
            <motion.div
              className="relative w-54 aspect-[8/16] ml-15 md:ml-20"
              variants={childVariants}
            >
              <Image
                src={IMAGES.Banner4}
                alt="Apple Orchard UI Preview"
                fill
                className="rounded-2xl object-cover shadow-lg"
                priority
              />
            </motion.div>
          </Col>
        </Row>
      </div>
    </motion.section>
  );
}