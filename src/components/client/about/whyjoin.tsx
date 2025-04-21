import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyJoinMaxima() {
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
    <div className="bg-[#f0f8ff] py-10">
      {/* Tiêu đề */}
      <motion.div
        className="text-center mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-[#002146] uppercase"
          variants={childVariants}
        >
          WHY JOIN MAXIMA?
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-bold text-green-500 mt-2"
          variants={childVariants}
        >
          “WIN-WIN-WIN Strategy”
        </motion.p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-10">
        {/* Trader's Win */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="md:w-1/2" variants={childVariants}>
            <h3 className="text-2xl font-bold text-[#002146] mb-3">
              TRADER's WIN
            </h3>
            <p className="text-[#335479] text-base mb-6">
              Regardless of market directions, traders earn using a proven
              strategy that guarantees consistent profits
            </p>
            <div className="text-white font-medium">
              <motion.button
                className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto"
                variants={childVariants}
              >
                Register
              </motion.button>
            </div>
          </motion.div>
          <motion.div className="md:w-1/2" variants={childVariants}>
            <Image
              src={IMAGES.Whyjoin1}
              alt="Trader's Win"
              width={280}
              height={300}
              className="mx-auto"
            />
          </motion.div>
        </motion.div>

        {/* IB's Win */}
        <motion.div
          className="flex flex-col md:flex-row-reverse items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="md:w-1/2" variants={childVariants}>
            <h3 className="text-2xl font-bold text-[#002146] mb-2">IB's WIN</h3>
            <p className="text-[#335479] text-base mb-6">
              Traders' profits are secure and there is no risk of trading loss –
              resulting in increased customer retention, generating long term IB
              commissions
            </p>
            <div className="text-white font-medium">
              <motion.button
                className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-2 rounded-full w-full sm:w-auto"
                variants={childVariants}
              >
                Explore IB
              </motion.button>
            </div>
          </motion.div>
          <motion.div className="md:w-1/2" variants={childVariants}>
            <Image
              src={IMAGES.Whyjoin2}
              alt="IB's Win"
              width={280}
              height={300}
              className="mx-auto"
            />
          </motion.div>
        </motion.div>

        {/* Maxima Win */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="md:w-1/2" variants={childVariants}>
            <h3 className="text-2xl font-bold text-[#002146] mb-2">
              MAXIMA WIN
            </h3>
            <p className="text-[#335479] text-base mb-3">
              With the proven strategy, Maxima achieves consistent profits,
              ensuring a stable growth removing the need of constantly acquiring
              new clients
            </p>
          </motion.div>
          <motion.div className="md:w-1/2" variants={childVariants}>
            <Image
              src={IMAGES.Whyjoin3}
              alt="Maxima Win"
              width={280}
              height={300}
              className="mx-auto"
            />
          </motion.div>
        </motion.div>

        {/* So you should choose Maxima */}
        <motion.div
          className="flex flex-col md:flex-row-reverse items-center gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="md:w-1/2" variants={childVariants}>
            <h3 className="text-2xl font-bold text-[#002146] mb-2">
              So you should choose Maxima
            </h3>
            <p className="text-[#335479] text-base">
              We value our words. Our words are backed up by concrete actions.
            </p>
          </motion.div>
          <motion.div className="md:w-1/2" variants={childVariants}>
            <Image
              src={IMAGES.Whyjoin4}
              alt="Choose Maxima"
              width={280}
              height={300}
              className="mx-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}