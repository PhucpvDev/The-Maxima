"use client";

import React, { useState, useEffect } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface CommissionRank {
  key: string;
  rank: string;
  commission: string;
  profits: string;
  apple: string;
}

interface Translation {
  id: number;
  commission_id: number;
  languages_code: string;
  title: string;
  description: string;
  rank: string;
  commission_per_lot: string;
  profits_sharing: string;
  apple_orchard: string;
  rank_2: string;
  commission_per_lot_2: string;
  profits_sharing_2: string;
  apple_orchard_2: string;
  rank_3: string;
  commission_per_lot_3: string;
  profits_sharing_3: string;
  apple_orchard_3: string;
}

interface TransformedCommissionData {
  title: string;
  description: string;
  commissions: CommissionRank[];
}

interface RawCommissionData {
  id: number;
  status: string;
  title: string;
  description: string;
  rank: string;
  commission_per_lot: string;
  profits_sharing: string;
  apple_orchard: string;
  rank_2: string;
  commission_per_lot_2: string;
  profits_sharing_2: string;
  apple_orchard_2: string;
  rank_3: string;
  commission_per_lot_3: string;
  profits_sharing_3: string;
  apple_orchard_3: string;
  translations: Translation[];
}

async function getCommission(locale: string): Promise<TransformedCommissionData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://maximagoldhedging.com/items/commission?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    const data: RawCommissionData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const profits_sharing_3 = lang === "en-US" ? data.profits_sharing_3 : source.profits_sharing_3;

    const commissions: CommissionRank[] = [
      {
        key: "1",
        rank: source.rank || "Direct Referral",
        commission: source.commission_per_lot || "$3",
        profits: source.profits_sharing || "12%",
        apple: source.apple_orchard || "$1 per lot",
      },
      {
        key: "2",
        rank: source.rank_2 || "I.B",
        commission: source.commission_per_lot_2 || "$2",
        profits: source.profits_sharing_2 || "14%",
        apple: source.apple_orchard_2 || "$1 per lot",
      },
      {
        key: "3",
        rank: source.rank_3 || "M.I.B",
        commission: source.commission_per_lot_3 || "$1",
        profits: profits_sharing_3 || "16%",
        apple: source.apple_orchard_3 || "$1 per lot",
      },
    ];

    return {
      title: source.title || "IB, MIB Commission",
      description:
        source.description ||
        "You earn USDT based on the trading volume you contribute to the community.",
      commissions,
    };
  } catch (error) {
    console.error("Error fetching Commission data:", error);
    return {
      title: "IB, MIB Commission",
      description: "You earn USDT based on the trading volume you contribute to the community.",
      commissions: [
        {
          key: "1",
          rank: "Direct Referral",
          commission: "$3",
          profits: "12%",
          apple: "$1 per lot",
        },
        {
          key: "2",
          rank: "I.B",
          commission: "$2",
          profits: "14%",
          apple: "$1 per lot",
        },
        {
          key: "3",
          rank: "M.I.B",
          commission: "$1",
          profits: "16%",
          apple: "$1 per lot",
        },
      ],
    };
  }
}

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
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    x: 0, 
    transition: { 
      delay: i * 0.1,
      duration: 0.5, 
      ease: "easeOut" 
    } 
  })
};

export default function CommissionSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TransformedCommissionData | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof CommissionRank, direction: 'ascending' | 'descending'} | null>(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollIndicator = () => {
      const tableContainer = document.getElementById('commission-table-container');
      if (tableContainer) {
        setShowScroll(tableContainer.scrollWidth > tableContainer.clientWidth);
      }
    };

    window.addEventListener('resize', checkScrollIndicator);
    // Check after data is loaded
    if (data) {
      setTimeout(checkScrollIndicator, 100);
    }

    return () => {
      window.removeEventListener('resize', checkScrollIndicator);
    };
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getCommission(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Commission data:", error);
      }
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const getCSSVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  
  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return (
      <div className={`flex items-center justify-center py-20 ${
        mytheme === "light" ? "text-gray-800" : "text-gray-200"
      }`}>
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { title, description, commissions } = data;

  const requestSort = (key: keyof CommissionRank) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCommissions = [...commissions];
  if (sortConfig !== null) {
    sortedCommissions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <section className={`py-20 relative overflow-hidden font-inter ${
        mytheme === "light" 
          ? "bg-gray-50" 
          : "bg-gray-950"
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 opacity-5 ${
            mytheme === "light" ? "bg-gray-900" : "bg-white"
          }`} style={{
            backgroundImage: `radial-gradient(circle, ${mytheme === "light" ? "#1a202c" : "#ffffff"} 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
          }}></div>
          
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-yellow-500/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              mytheme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-yellow-500"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="h-px w-16 bg-yellow-500"></div>
            </div>
            <p className={`text-lg max-w-3xl mx-auto ${
              mytheme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              {description}
            </p>
          </motion.div>

          <div className={`md:hidden text-center mb-4 ${showScroll ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${
            mytheme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse">swipe</span>
              <p className="text-sm">Swipe horizontally to view all columns</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-xl">
            <div className="overflow-x-auto" id="commission-table-container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="min-w-max"
              >
                <div className={`grid grid-cols-4 gap-4 p-6 ${
                  mytheme === "light" 
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white" 
                    : "bg-gradient-to-r from-yellow-600 to-amber-700 text-white"
                }`} style={{ minWidth: "700px" }}>
                  <button 
                    onClick={() => requestSort('rank')}
                    className="flex items-center justify-start gap-2 font-semibold"
                  >
                    <span>Rank</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === 'rank' 
                        ? sortConfig.direction === 'ascending' ? 'arrow_downward' : 'arrow_upward'
                        : 'sort'
                      }
                    </span>
                  </button>
                  <button 
                    onClick={() => requestSort('commission')}
                    className="flex items-center justify-start gap-2 font-semibold"
                  >
                    <span>Commission Per Lot</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === 'commission' 
                        ? sortConfig.direction === 'ascending' ? 'arrow_downward' : 'arrow_upward'
                        : 'sort'
                      }
                    </span>
                  </button>
                  <button 
                    onClick={() => requestSort('profits')}
                    className="flex items-center justify-start gap-2 font-semibold"
                  >
                    <span>Profits Sharing</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === 'profits' 
                        ? sortConfig.direction === 'ascending' ? 'arrow_downward' : 'arrow_upward'
                        : 'sort'
                      }
                    </span>
                  </button>
                  <button 
                    onClick={() => requestSort('apple')}
                    className="flex items-center justify-start gap-2 font-semibold"
                  >
                    <span>Apple Orchard</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === 'apple' 
                        ? sortConfig.direction === 'ascending' ? 'arrow_downward' : 'arrow_upward'
                        : 'sort'
                      }
                    </span>
                  </button>
                </div>

                <div className={`${
                  mytheme === "light" ? "bg-white" : "bg-gray-900"
                }`} style={{ minWidth: "700px" }}>
                  {sortedCommissions.map((commission, index) => (
                    <motion.div
                      key={commission.key}
                      custom={index}
                      variants={tableRowVariants}
                      className={`grid grid-cols-4 gap-4 p-6 border-b ${
                        mytheme === "light" 
                          ? index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          : index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"
                      } ${
                        hoveredRow === commission.key
                          ? mytheme === "light" 
                            ? "bg-yellow-50"
                            : "bg-yellow-900/10"
                          : ""
                      } transition-colors duration-200 border-gray-100 dark:border-gray-800`}
                      onMouseEnter={() => setHoveredRow(commission.key)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-300"
                            : index === 1 
                              ? "bg-gray-100 text-gray-700 dark:bg-gray-700/70 dark:text-gray-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-300"
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`font-semibold ${
                          mytheme === "light" ? "text-gray-900" : "text-white"
                        }`}>{commission.rank}</span>
                      </div>
                      <div className={`${
                        mytheme === "light" ? "text-gray-600" : "text-gray-300"
                      }`}>{commission.commission}</div>
                      <div className={`font-medium ${
                        mytheme === "light" ? "text-green-600" : "text-green-400"
                      }`}>{commission.profits}</div>
                      <div className={`${
                        mytheme === "light" ? "text-blue-600" : "text-blue-400"
                      }`}>{commission.apple}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
          
          /* Horizontal scroll indicator animation */
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          .animate-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          #commission-table-container::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          #commission-table-container {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
}