import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
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

  return (
    <>
      <motion.div
        className="bg-[#F4F8FB] relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute z-0">
          <Image
            src={IMAGES.BgFooter1.src}
            alt="Logo Maxima"
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="absolute right-0 z-0 top-20">
          <Image
            src={IMAGES.BgFooter2.src}
            alt="Logo Maxima"
            width={900}
            height={300}
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto z-10 relative p-6 md:pt-16">
          <Row gutter={[32, 32]} className="items-center">
            <Col xs={24} lg={12}>
              <motion.p
                className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight drop-shadow-md"
                variants={childVariants}
              >
                About the Maxima
              </motion.p>
              <motion.div
                className="space-y-6 text-lg text-gray-800 leading-relaxed"
                variants={childVariants}
              >
                <p className="font-medium">
                  The 1% Better Club is more than just a community; it is a
                  mindset. We believe in the power of small, consistent
                  improvements. By being 1% better every day, in just one year,
                  the growth is monumental. Our focus is on investment,
                  knowledge, and finding the tools and strategies that make us
                  all better, together.
                </p>
                <p className="font-medium">
                  Recently, our journey led us to a groundbreaking project
                  called Maxima, founded by Mr. Chen, a veteran with over 15
                  years of experience in the broker industry. Despite his
                  success, Mr. Chen observed a recurring issue — most traders
                  were losing money.
                  active.
                </p>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                className="relative w-full aspect-video"
                variants={childVariants}
              >
                <iframe
                  width="350"
                  height="315"
                  className="rounded-xl md:w-[560px]"
                  src="https://www.youtube.com/embed/Ycys1QsnoV0?si=v2iZucmSiTsqLjoz"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </motion.div>
            </Col>
          </Row>
        </div>
      </motion.div>
    </>
  );
}