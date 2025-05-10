"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { IMAGES } from "@/constants/client/theme"
import { useLocale } from "next-intl"
import { getContact, TransformedContactData } from "@/lib/directus/contact_section"
import { motion } from "framer-motion"
import Cookies from "js-cookie"

interface ContactProps {
  id?: string; 
}


export default function ContactSection ({ id }: ContactProps){
  const locale = useLocale();
  const [contactData, setContactData] = useState<TransformedContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContact(locale);
        setContactData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handleEmailChange = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })
    }
    catch (error) {
      console.error("Error changing email:", error);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    setSubmitted(true);
    setFormError("");
    setEmail("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const affCodeFromCookie = Cookies.get("aff_code");
  const registrationUrl = affCodeFromCookie
    ? `https://agreement.maximadao.com/#/register?code=${encodeURIComponent(affCodeFromCookie)}`
    : `https://agreement.maximadao.com/#/register`;

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <section id={id} className="relative py-20 font-inter overflow-hidden bg-gradient-to-b from-gray-900 via-blue-950 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-blue-950/40 z-0"></div>

        <div className="absolute inset-0 opacity-5 z-0" style={{
          backgroundImage: `radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px"
        }}></div>

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl z-0"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl z-0"></div>

        <div className="absolute top-0 left-0 z-0 opacity-30">
          <Image
            src={IMAGES.BgFooter1}
            alt="Background Pattern"
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="absolute right-0 top-20 z-0 opacity-20">
          <Image
            src={IMAGES.BgFooter2}
            alt="Background Pattern"
            width={900}
            height={300}
            priority
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="relative">
            <motion.div
              className="flex items-center mb-8"
              variants={fadeIn}
            >
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl shadow-lg mr-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${contactData?.logo}`}
                  alt="Maxima Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Maxima</h2>
            </motion.div>

            <motion.div
              className="mb-12"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-bold text-white mb-6">{contactData?.title}</h3>

              <div className="space-y-6">
                {/* Office info */}
                <div className="flex items-start">
                  <div className="bg-blue-500/20 backdrop-blur-sm p-2 rounded-lg mr-4">
                    <span className="material-symbols-outlined text-blue-400">location_on</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Head Office</p>
                    <p className="text-white">{contactData?.head_office}</p>
                  </div>
                </div>

                {/* Phone info */}
                <div className="flex items-start">
                  <div className="bg-yellow-500/20 backdrop-blur-sm p-2 rounded-lg mr-4">
                    <span className="material-symbols-outlined text-yellow-400">call</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Phone Support</p>
                    <p className="text-white">{contactData?.hotline}</p>
                  </div>
                </div>

                {/* Email info */}
                <div className="flex items-start">
                  <div className="bg-green-500/20 backdrop-blur-sm p-2 rounded-lg mr-4">
                    <span className="material-symbols-outlined text-green-400">email</span>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Email</p>
                    <p className="text-white">{contactData?.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <p className="text-white font-medium mb-4">Follow us on:</p>
              <div className="flex space-x-4">
                <a
                  href={contactData?.social_fb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-blue-600/20 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600/30 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                  </svg>
                </a>
                <a
                  href={contactData?.social_ytb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-red-600/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-600/30 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.65598C23.498 6.65598 23.2481 4.87318 22.4824 4.10043C21.519 3.09837 20.4438 3.09491 19.9365 3.0347C16.5678 2.78235 11.9999 2.78235 11.9999 2.78235H11.9904C11.9904 2.78235 7.42253 2.78235 4.05383 3.0347C3.54654 3.09491 2.47135 3.09837 1.50793 4.10043C0.74223 4.87318 0.492235 6.65598 0.492235 6.65598C0.492235 6.65598 0.232422 8.7293 0.232422 10.8026V12.747C0.232422 14.8203 0.492235 16.8936 0.492235 16.8936C0.492235 16.8936 0.74223 18.6764 1.50793 19.4492C2.47135 20.4512 3.73198 20.4166 4.32245 20.5278C6.42176 20.7302 12 20.7913 12 20.7913C12 20.7913 16.5678 20.7836 19.9365 20.5312C20.4438 20.471 21.519 20.4676 22.4824 19.4655C23.2481 18.6928 23.498 16.91 23.498 16.91C23.498 16.91 23.7578 14.8367 23.7578 12.7634V10.819C23.7578 8.7457 23.498 6.65598 23.498 6.65598ZM9.73354 15.5171V7.5581L16.0015 11.5472L9.73354 15.5171Z"></path>
                  </svg>
                </a>
                <a
                  href={contactData?.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-purple-600/20 backdrop-blur-sm flex items-center justify-center hover:bg-purple-600/30 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.2 7.35v2.229a7.1 7.1 0 01-3.744-.894v5.84a5.602 5.602 0 11-5.602-5.602h.374v2.25h-.374a3.35 3.35 0 103.35 3.35V2.25h2.25a4.842 4.842 0 003.746 4.767z" />
                  </svg>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-sky-600/20 backdrop-blur-sm flex items-center justify-center hover:bg-sky-600/30 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-2">{contactData?.get_in_touch_title}</h3>
              <p className="text-lg text-gray-300 mb-2">{contactData?.training_center}</p>
              <p className="mb-6 text-gray-400">{contactData?.feedback_note}</p>

              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-6 mt-7">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className={`w-full py-3 pl-4 pr-12 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border ${formError ? "border-red-500" : "border-gray-600"
                        } focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="material-symbols-outlined text-gray-400">mail</span>
                    </div>
                  </div>
                  {formError && <p className="mt-1 text-sm text-red-500">{formError}</p>}
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-900/50 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailChange}
                >
                  {submitted ? (
                    <>
                      <span className="material-symbols-outlined mr-2 text-white">check</span>
                      <span className="text-white ">Thank you!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2 text-white ">send</span>
                      <span className="text-white ">Send</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
            <motion.div variants={fadeInUp}>
            <div className="bg-white/5 backdrop-blur-md mt-10 rounded-2xl p-5 shadow-xl">
              <div className="border-gray-700">
                <motion.a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-medium shadow-lg shadow-amber-900/50 hover:from-yellow-700 hover:to-amber-700 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="material-symbols-outlined mr-2">download</span>
                  {contactData?.download_button_text}
                </motion.a>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
        
        .font-inter {
          font-family: 'Inter', Arial, sans-serif;
        }
        
        /* Animation for the loader */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};
