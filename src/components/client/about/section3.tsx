import { Row, Col } from "antd";
import { IMAGES } from "@/constants/client/theme";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MaximaSuperWalletSection() {
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

  return (
    <motion.div
      className="bg-[#F4F8FB] md:py-20 py-10 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background decor */}
      <div className="absolute z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Decoration 1"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 top-20 z-0">
        <Image
          src={IMAGES.BgFooter2}
          alt="Decoration 2"
          width={900}
          height={300}
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Row gutter={[32, 32]} align="middle">
          {/* Left Column - Text */}
          <Col xs={24} lg={12}>
            <motion.p
              className="text-2xl font-bold text-blue-900 mb-2 uppercase"
              variants={childVariants}
            >
              MAXIMA SUPER WALLET
            </motion.p>
            <motion.p
              className="text-[#335479] text-base leading-relaxed mb-6"
              variants={childVariants}
            >
              Maxima is a cutting-edge Web 3.0 decentralized trading DAO that
              seamlessly integrates two wallets—centralized and
              decentralized—alongside a revolutionary forex trading model.
              Designed for users with minimal or no prior experience in forex
              trading, Maxima provides a game-based learning approach into the
              forex market, mitigating high risks and avoiding inevitable
              pitfalls such as liquidation for users. Through its innovative
              quantitative hedging trading model, Maxima empowers rapid and
              sustainable growth within its community.
            </motion.p>
            <motion.div variants={childVariants}>
              <Link
                href="#"
                className="text-blue-900 font-bold underline block mb-4"
              >
                MAKE PROFITS WITH JUST 4 CLICKS
              </Link>
            </motion.div>
            <motion.div
              className="text-white font-medium"
              variants={childVariants}
            >
              <button className="bg-orange-400 hover:bg-orange-500 px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto">
                Find Out More
              </button>
            </motion.div>
          </Col>

          {/* Right Column - Blue Box + Small Text */}
          <Col xs={24} lg={12}>
            <motion.div
              className="bg-[#003D8F] rounded-xl h-52 w-full mb-4"
              variants={childVariants}
            ></motion.div>
            <motion.p
              className="text-[#335479] text-base leading-relaxed"
              variants={childVariants}
            >
              In trading, you have two options: go long or short, with two
              possible outcomes—your prediction is either right or wrong. When
              you're right, your profit can be up to 3 times greater than your
              loss if you're wrong.
            </motion.p>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
}