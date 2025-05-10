"use client";

import React, { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme } from "antd"
import { motion, AnimatePresence } from "framer-motion"
import { getFaqs, FaqItem } from "@/lib/directus/faqs"

interface FAQSectionProps {
  id?: string; 
}


export default function FAQSection ({ id }: FAQSectionProps)  {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFaqs(locale);
        if (result && result.length > 0) {
          if (result[0].faqs && result[0].faqs.length > 0) {
            setFaqData(result[0].faqs);
            setFilteredFaqs(result[0].faqs);
          }
          if (result[0].title) {
            setTitle(result[0].title);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = faqData.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
      setFilteredFaqs(filtered);
    }
  }, [searchQuery, faqData]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className={`py-20 ${
        mytheme === "light" ? "bg-gray-50" : "bg-gray-950"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <section id={id}  className={`py-24 relative font-inter ${
        mytheme === "light" 
          ? "bg-gradient-to-b from-blue-50 to-gray-50" 
          : "bg-gradient-to-b from-gray-900 to-gray-950"
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 opacity-5 ${
            mytheme === "light" ? "bg-gray-900" : "bg-white"
          }`} style={{
            backgroundImage: `radial-gradient(circle, ${mytheme === "light" ? "#1a202c" : "#ffffff"} 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
          }}></div>
          
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${
                      mytheme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {title}
                    </h2>
                  </div>

                  <div className={`relative mb-8 ${
                    mytheme === "light" 
                      ? "text-gray-600" 
                      : "text-gray-300"
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      type="text"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg text-base ${
                        mytheme === "light"
                          ? "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      } focus:outline-none transition-colors`}
                      placeholder={`${locale === "en" ? "Search FAQs..." : locale === "zh" ? "搜索常见问题解答..." : "Tìm kiếm câu hỏi thường gặp..."}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {filteredFaqs.length === 0 ? (
                <div className={`text-center py-12 rounded-xl ${
                  mytheme === "light" 
                    ? "bg-white shadow-md" 
                    : "bg-gray-800 shadow-lg shadow-black/10"
                }`}>
                  <h3 className={`text-xl font-medium mb-2 ${
                    mytheme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    No matches found
                  </h3>
                  <p className={`${
                    mytheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Try different search terms or browse all FAQs
                  </p>
                  <button 
                    className={`mt-4 px-4 py-2 rounded-lg font-medium ${
                      mytheme === "light" 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors`}
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredFaqs.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`rounded-xl overflow-hidden ${
                        mytheme === "light" 
                          ? "bg-white shadow-md hover:shadow-lg" 
                          : "bg-gray-800 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"
                      } transition-all duration-200`}
                    >
                      <button
                        className={`w-full text-left px-6 py-5 flex items-center justify-between ${
                          expandedIndex === index 
                            ? mytheme === "light"
                              ? "border-b border-gray-200"
                              : "border-b border-gray-700"
                            : ""
                        }`}
                        onClick={() => toggleFaq(index)}
                        aria-expanded={expandedIndex === index}
                      >
                        <span className={`font-semibold text-lg ${
                          mytheme === "light" ? "text-gray-900" : "text-white"
                        }`}>
                          {item.question}
                        </span>
                        <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          expandedIndex === index
                            ? mytheme === "light" 
                              ? "bg-blue-100 text-blue-600"
                              : "bg-blue-900/30 text-blue-400"
                            : mytheme === "light"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gray-700 text-gray-400"
                        }`}>
                          <span className="material-symbols-outlined">
                            {expandedIndex === index ? "remove" : "add"}
                          </span>
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={`px-6 py-5 ${
                              mytheme === "light" ? "text-gray-600" : "text-gray-300"
                            }`}
                          >
                            <p className="text-base leading-relaxed">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
            </div>
          </div>
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
    </ConfigProvider>
  );
};
