"use client";

import { Table } from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

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

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (text: string, record: any, index: number) => (
      <span
        className={`font-poppins font-semibold text-sm sm:text-base md:text-lg ${
          index % 2 === 1
            ? "text-gray-800 dark:text-gray-200"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Capital",
    dataIndex: "capital",
    key: "capital",
    render: (text: string, record: any, index: number) => (
      <span
        className={`font-poppins text-sm sm:text-base md:text-lg ${
          index % 2 === 1
            ? "text-[#6B7280] dark:text-gray-200"
            : "text-[#6B7280] dark:text-gray-300"
        }`}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Trade Per Day",
    dataIndex: "trades",
    key: "trades",
    render: (text: string, record: any, index: number) => (
      <span
        className={`font-poppins text-sm sm:text-base md:text-lg ${
          index % 2 === 1
            ? "text-[#6B7280] dark:text-gray-200"
            : "text-[#6B7280] dark:text-gray-300"
        }`}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Monthly Profits",
    dataIndex: "profits",
    key: "profits",
    render: (text: string, record: any, index: number) => (
      <span
        className={`font-poppins text-sm sm:text-base md:text-lg ${
          index % 2 === 1
            ? "text-[#6B7280] dark:text-gray-200"
            : "text-[#6B7280] dark:text-gray-300"
        }`}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Referral Earning",
    dataIndex: "referral",
    key: "referral",
    render: (text: string, record: any, index: number) => (
      <span
        className={`font-poppins text-sm sm:text-base md:text-lg ${
          index % 2 === 1
            ? "text-[#6B7280] dark:text-gray-200"
            : "text-[#6B7280] dark:text-gray-300"
        }`}
      >
        {text}
      </span>
    ),
  },
];

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
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/traders_ranks?lang=${lang}&fields=*,translations.*`,
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
    const data: RawTradersRanksData = Array.isArray(result.data) ? result.data[0] : result.data;

    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    const source = translation || data;

    const rankings: Ranking[] = [
      {
        key: "1",
        rank: source.rank || "Elite Trader",
        capital: source.capital || "$50,000",
        trades: source.trade_per_day.toString() || "15",
        profits: source.monthly_profits || "$5,000",
        referral: source.referral_earning || "$1,000",
      },
      {
        key: "2",
        rank: source.rank_2 || "Pro Trader",
        capital: source.capital_2 || "$25,000",
        trades: source.trade_per_day_2.toString() || "12",
        profits: source.monthly_profits_2 || "$3,000",
        referral: source.referral_earning_2 || "$500",
      },
      {
        key: "3",
        rank: source.rank_3 || "Median Trader",
        capital: source.capital_3 || "$10,000",
        trades: source.trade_per_day_3.toString() || "10",
        profits: source.monthly_profits_3 || "$1,500",
        referral: source.referral_earning_3 || "$300",
      },
      {
        key: "4",
        rank: source.rank_4 || "Rookie Trader",
        capital: source.capital_4 || "$5,000",
        trades: source.trade_per_day_4.toString() || "8",
        profits: source.monthly_profits_4 || "$800",
        referral: source.referral_earning_4 || "$150",
      },
      {
        key: "5",
        rank: source.rank_5 || "Newbie Trader",
        capital: source.capital_5 || "$2,500",
        trades: source.trade_per_day_5.toString() || "6",
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
      description: "Here are five rankings for traders based on their approximate monthly income.",
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

export default function TradersRanksSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TradersRanksData | null>(null);

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

  const getCSSVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  const themeConfig = {
    token: {
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return <div className="text-center py-10 text-2xl font-poppins">Loading...</div>;
  }

  const { title, description, rankings } = data;

  return (
    <ConfigProvider theme={themeConfig}>
     <motion.div className={`${
          mytheme === "light" ? "bg-[#F7FAFC]" : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}>
     <motion.div
        className={`py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p
          className={`text-2xl sm:text-3xl md:text-3xl font-bold font-poppins ${
            mytheme === "light" ? "text-gray-800" : "text-yellow-600"
          }`}
          variants={childVariants}
        >
          {title}
        </motion.p>

        <motion.p
          className={`text-base sm:text-lg font-poppins mb-8 ${
            mytheme === "light" ? "text-[#6B7280]" : "text-gray-300"
          }`}
          variants={childVariants}
        >
          {description}
        </motion.p>

        <motion.div
          className={`rounded-xl pt-2 shadow-md overflow-x-auto ${
            mytheme === "light" ? "bg-white" : "bg-black/50 border border-yellow-800"
          }`}
          variants={childVariants}
        >
          <Table
            dataSource={rankings}
            columns={columns}
            pagination={false}
            bordered={false}
            rowClassName={(record, index) =>
              index % 2 === 1
                ? mytheme === "light"
                  ? "bg-[#F7FAFC]"
                  : "bg-gray-800/50"
                : ""
            }
            className={`[&_.ant-table-thead_th]:font-poppins [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-sm [&_.ant-table-thead_th]:sm:text-base [&_.ant-table-thead_th]:md:text-lg [&_.ant-table-cell]:px-2 [&_.ant-table-cell]:sm:px-4 [&_.ant-table-cell]:py-2 [&_.ant-table-cell]:sm:py-3 ${
              mytheme === "light"
                ? "[&_.ant-table-thead_th]:bg-[#F7FAFC] [&_.ant-table-thead_th]:text-gray-800"
                : "[&_.ant-table-thead_th]:bg-gray-800 [&_.ant-table-thead_th]:text-gray-200"
            }`}
            components={{
              body: {
                row: ({ children, ...props }) => (
                  <motion.tr
                    variants={rowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    {...props}
                  >
                    {children}
                  </motion.tr>
                ),
              },
            }}
          />
        </motion.div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', Arial, Helvetica, sans-serif;
          }
        `}</style>
      </motion.div>
     </motion.div>
    </ConfigProvider>
  );
}