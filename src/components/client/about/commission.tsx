"use client";

import { Table } from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";

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

// Animation variants for table rows
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
            ? "text-[#001737] dark:text-gray-200"
            : "text-[#001737] dark:text-gray-200"
        }`}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Commission Per Lot",
    dataIndex: "commission",
    key: "commission",
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
    title: "Profits Sharing",
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
    title: "Apple Orchard",
    dataIndex: "apple",
    key: "apple",
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
    // Map locale to language code
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://the-maxima.directus.app/items/commission?lang=${lang}&fields=*,translations.*`,
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

    // Find the translation matching the locale
    const translation = data.translations.find(
      (t: Translation) => t.languages_code === lang
    );

    // Use translation if found, otherwise fall back to default fields
    const source = translation || data;

    // Override profits_sharing_3 for en-US due to typo in translation
    const profits_sharing_3 = lang === "en-US" ? data.profits_sharing_3 : source.profits_sharing_3;

    // Construct commissions array
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
    // Return fallback data
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

export default function Commission() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [data, setData] = useState<TransformedCommissionData | null>(null);

  // Fetch data when component mounts or locale changes
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
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (!data) {
    return (
      <div
        className={`text-center py-10 text-2xl font-poppins ${
          mytheme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        Loading...
      </div>
    );
  }

  const { title, description, commissions } = data;

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.div
        className={`${
          mytheme === "light" ? "bg-[#F7FAFC]" : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <motion.div
          className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            className={`text-2xl sm:text-3xl md:text-3xl font-bold font-poppins mb-4 ${
              mytheme === "light" ? "text-[#001737]" : "text-yellow-600"
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
              dataSource={commissions}
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
                  ? "[&_.ant-table-thead_th]:bg-[#F7FAFC] [&_.ant-table-thead_th]:text-[#001737]"
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