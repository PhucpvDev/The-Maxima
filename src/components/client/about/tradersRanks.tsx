"use client";

import React, { useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Ranking {
  key: string;
  rank: string;
  capital: string;
  trades: string;
  profits: string;
  referral: string;
}

interface Translation {
  id: number;
  traders_ranks_id: number;
  languages_code: string;
  title: string;
  description: string;
  rank: string;
  capital: string;
  trade_per_day: string;
  monthly_profits: string;
  referral_earning: string;
  rank_2: string;
  capital_2: string;
  trade_per_day_2: string;
  monthly_profits_2: string;
  referral_earning_2: string;
  rank_3: string;
  capital_3: string;
  trade_per_day_3: string;
  monthly_profits_3: string;
  referral_earning_3: string;
  rank_4: string;
  capital_4: string;
  trade_per_day_4: string;
  monthly_profits_4: string;
  referral_earning_4: string;
  rank_5: string;
  capital_5: string;
  trade_per_day_5: string;
  monthly_profits_5: string;
  referral_earning_5: string;
}

interface TradersRanksData {
  title: string;
  description: string;
  rankings: Ranking[];
}

interface RawTradersRanksData {
  id: number;
  status: string;
  title: string;
  description: string;
  rank: string;
  capital: string;
  trade_per_day: number | string;
  monthly_profits: string;
  referral_earning: string;
  rank_2: string;
  capital_2: string;
  trade_per_day_2: number | string;
  monthly_profits_2: string;
  referral_earning_2: string;
  rank_3: string;
  capital_3: string;
  trade_per_day_3: number | string;
  monthly_profits_3: string;
  referral_earning_3: string;
  rank_4: string;
  capital_4: string;
  trade_per_day_4: number | string;
  monthly_profits_4: string;
  referral_earning_4: string;
  rank_5: string;
  capital_5: string;
  trade_per_day_5: number | string;
  monthly_profits_5: string;
  referral_earning_5: string;
  translations: Translation[];
}

async function getTradersRanks(locale: string): Promise<TradersRanksData> {
  try {
    const lang =
      locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/traders_ranks?lang=${lang}&fields=*,translations.*`,
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
    const data: RawTradersRanksData = Array.isArray(result.data)
      ? result.data[0]
      : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const rankings: Ranking[] = [
      {
        key: "1",
        rank: source.rank || "Elite Trader",
        capital: source.capital || "$50,000",
        trades:
          typeof source.trade_per_day === "number"
            ? source.trade_per_day.toString()
            : source.trade_per_day || "15",
        profits: source.monthly_profits || "$5,000",
        referral: source.referral_earning || "$1,000",
      },
      {
        key: "2",
        rank: source.rank_2 || "Pro Trader",
        capital: source.capital_2 || "$25,000",
        trades:
          typeof source.trade_per_day_2 === "number"
            ? source.trade_per_day_2.toString()
            : source.trade_per_day_2 || "12",
        profits: source.monthly_profits_2 || "$3,000",
        referral: source.referral_earning_2 || "$500",
      },
      {
        key: "3",
        rank: source.rank_3 || "Median Trader",
        capital: source.capital_3 || "$10,000",
        trades:
          typeof source.trade_per_day_3 === "number"
            ? source.trade_per_day_3.toString()
            : source.trade_per_day_3 || "10",
        profits: source.monthly_profits_3 || "$1,500",
        referral: source.referral_earning_3 || "$300",
      },
      {
        key: "4",
        rank: source.rank_4 || "Rookie Trader",
        capital: source.capital_4 || "$5,000",
        trades:
          typeof source.trade_per_day_4 === "number"
            ? source.trade_per_day_4.toString()
            : source.trade_per_day_4 || "8",
        profits: source.monthly_profits_4 || "$800",
        referral: source.referral_earning_4 || "$150",
      },
      {
        key: "5",
        rank: source.rank_5 || "Newbie Trader",
        capital: source.capital_5 || "$2,500",
        trades:
          typeof source.trade_per_day_5 === "number"
            ? source.trade_per_day_5.toString()
            : source.trade_per_day_5 || "6",
        profits: source.monthly_profits_5 || "$300",
        referral: source.referral_earning_5 || "$100",
      },
    ];

    return {
      title: source.title || "TRADERS RANKS",
      description:
        source.description ||
        "Here are five rankings for traders based on their approximate monthly income.",
      rankings,
    };
  } catch (error) {
    console.error("Error fetching Traders Ranks data:", error);
    return {
      title: "TRADERS RANKS",
      description:
        "Here are five rankings for traders based on their approximate monthly income.",
      rankings: [
        {
          key: "1",
          rank: "Elite Trader",
          capital: "$50,000",
          trades: "15",
          profits: "$5,000",
          referral: "$1,000",
        },
        {
          key: "2",
          rank: "Pro Trader",
          capital: "$25,000",
          trades: "12",
          profits: "$3,000",
          referral: "$500",
        },
        {
          key: "3",
          rank: "Median Trader",
          capital: "$10,000",
          trades: "10",
          profits: "$1,500",
          referral: "$300",
        },
        {
          key: "4",
          rank: "Rookie Trader",
          capital: "$5,000",
          trades: "8",
          profits: "$800",
          referral: "$150",
        },
        {
          key: "5",
          rank: "Newbie Trader",
          capital: "$2,500",
          trades: "6",
          profits: "$300",
          referral: "$100",
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function TradersRanksSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TradersRanksData | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ranking;
    direction: "ascending" | "descending";
  } | null>(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollIndicator = () => {
      const tableContainer = document.getElementById("table-container");
      if (tableContainer) {
        setShowScroll(tableContainer.scrollWidth > tableContainer.clientWidth);
      }
    };

    window.addEventListener("resize", checkScrollIndicator);
    if (data) {
      setTimeout(checkScrollIndicator, 100);
    }

    return () => {
      window.removeEventListener("resize", checkScrollIndicator);
    };
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getTradersRanks(locale);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching Traders Ranks data:", error);
      }
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm:
      mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return (
      <div
        className={`flex items-center justify-center py-14 md:py-20 ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}>
        <div className="loader w-12 h-12 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { title, description, rankings } = data;

  const requestSort = (key: keyof Ranking) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedRankings = [...rankings];
  if (sortConfig !== null) {
    sortedRankings.sort((a, b) => {
      if (
        sortConfig.key === "profits" ||
        sortConfig.key === "capital" ||
        sortConfig.key === "referral"
      ) {
        const valueA = parseFloat(a[sortConfig.key].replace(/[^0-9.-]+/g, ""));
        const valueB = parseFloat(b[sortConfig.key].replace(/[^0-9.-]+/g, ""));

        if (valueA < valueB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <section
        className={`py-14 md:py-20 relative overflow-hidden font-inter ${
          mytheme === "light" ? "bg-gray-50" : "bg-gray-950"
        }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-5 ${
              mytheme === "light" ? "bg-gray-900" : "bg-white"
            }`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                mytheme === "light" ? "#1a202c" : "#ffffff"
              } 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
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
            variants={fadeInUp}>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                mytheme === "light" ? "text-gray-900" : "text-white"
              }`}>
              {title}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-yellow-500"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div className="h-px w-16 bg-yellow-500"></div>
            </div>
            <p
              className={`text-lg max-w-3xl mx-auto ${
                mytheme === "light" ? "text-gray-600" : "text-gray-300"
              }`}>
              {description}
            </p>
          </motion.div>

          <div
            className={`md:hidden text-center mb-4 ${
              showScroll ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300 ${
              mytheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse">
                swipe
              </span>
              <p className="text-sm">Swipe horizontally to view all columns</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-xl">
            <div className="overflow-x-auto" id="table-container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="min-w-max">
                <div
                  className={`grid grid-cols-5 gap-4 p-6 ${
                    mytheme === "light"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                      : "bg-gradient-to-r from-yellow-600 to-amber-700 text-white"
                  }`}
                  style={{ minWidth: "800px" }}>
                  <button
                    onClick={() => requestSort("rank")}
                    className="flex items-center cursor-pointer justify-start gap-2 font-semibold">
                    <span>Rank</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === "rank"
                        ? sortConfig.direction === "ascending"
                          ? "arrow_downward"
                          : "arrow_upward"
                        : "sort"}
                    </span>
                  </button>
                  <button
                    onClick={() => requestSort("capital")}
                    className="flex items-center cursor-pointer justify-start gap-2 font-semibold">
                    <span>Capital</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === "capital"
                        ? sortConfig.direction === "ascending"
                          ? "arrow_downward"
                          : "arrow_upward"
                        : "sort"}
                    </span>
                  </button>
                  <button
                    onClick={() => requestSort("trades")}
                    className="flex items-center cursor-pointer justify-start gap-2 font-semibold">
                    <span>Trades Per Day</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === "trades"
                        ? sortConfig.direction === "ascending"
                          ? "arrow_downward"
                          : "arrow_upward"
                        : "sort"}
                    </span>
                  </button>
                  <button
                    onClick={() => requestSort("profits")}
                    className="flex items-center cursor-pointer justify-start gap-2 font-semibold">
                    <span>Monthly Profits</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === "profits"
                        ? sortConfig.direction === "ascending"
                          ? "arrow_downward"
                          : "arrow_upward"
                        : "sort"}
                    </span>
                  </button>
                  <button
                    onClick={() => requestSort("referral")}
                    className="flex items-center cursor-pointer justify-start gap-2 font-semibold">
                    <span>Referral Earning</span>
                    <span className="material-symbols-outlined text-sm">
                      {sortConfig?.key === "referral"
                        ? sortConfig.direction === "ascending"
                          ? "arrow_downward"
                          : "arrow_upward"
                        : "sort"}
                    </span>
                  </button>
                </div>

                <div
                  className={`${
                    mytheme === "light" ? "bg-white" : "bg-gray-900"
                  }`}
                  style={{ minWidth: "800px" }}>
                  {sortedRankings.map((rank, index) => (
                    <motion.div
                      key={rank.key}
                      custom={index}
                      variants={tableRowVariants}
                      className={`grid grid-cols-5 gap-4 p-6 border-b ${
                        mytheme === "light"
                          ? index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
                          : index % 2 === 0
                          ? "bg-gray-900"
                          : "bg-gray-800/50"
                      } ${
                        hoveredRow === rank.key
                          ? mytheme === "light"
                            ? "bg-yellow-50"
                            : "bg-yellow-900/10"
                          : ""
                      } transition-colors duration-200 border-gray-100 dark:border-gray-800`}
                      onMouseEnter={() => setHoveredRow(rank.key)}
                      onMouseLeave={() => setHoveredRow(null)}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-300"
                              : index === 1
                              ? "bg-gray-100 text-gray-700 dark:bg-gray-700/70 dark:text-gray-300"
                              : index === 2
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300"
                          }`}>
                          {index + 1}
                        </div>
                        <span
                          className={`font-semibold ${
                            mytheme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                          {rank.rank}
                        </span>
                      </div>
                      <div
                        className={`${
                          mytheme === "light"
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}>
                        {rank.capital}
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          mytheme === "light"
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}>
                        <span>{rank.trades}</span>
                        <span className="text-xs text-gray-500">trades</span>
                      </div>
                      <div
                        className={`font-medium ${
                          mytheme === "light"
                            ? "text-green-600"
                            : "text-green-400"
                        }`}>
                        {rank.profits}
                      </div>
                      <div
                        className={`${
                          mytheme === "light"
                            ? "text-blue-600"
                            : "text-blue-400"
                        }`}>
                        {rank.referral}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

          .font-inter {
            font-family: "Inter", Arial, sans-serif;
          }

          /* Animation for the loader */
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          /* Horizontal scroll indicator animation */
          @keyframes pulse {
            0% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.5;
            }
          }
          .animate-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }

          /* Hide scrollbar for Chrome, Safari and Opera */
          #table-container::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          #table-container {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}</style>
      </section>
    </ConfigProvider>
  );
}
