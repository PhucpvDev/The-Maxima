"use client";

import { Table } from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCommission, TransformedCommissionData } from "@/lib/directus/commission";

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
    render: (text: string) => (
      <span className="font-poppins font-semibold text-[#001737] text-sm sm:text-base md:text-lg">
        {text}
      </span>
    ),
  },
  {
    title: "Commission Per Lot",
    dataIndex: "commission",
    key: "commission",
    render: (text: string) => (
      <span className="font-poppins text-[#6B7280] text-sm sm:text-base md:text-lg">
        {text}
      </span>
    ),
  },
  {
    title: "Profits Sharing",
    dataIndex: "profits",
    key: "profits",
    render: (text: string) => (
      <span className="font-poppins text-[#6B7280] text-sm sm:text-base md:text-lg">
        {text}
      </span>
    ),
  },
  {
    title: "Apple Orchard",
    dataIndex: "apple",
    key: "apple",
    render: (text: string) => (
      <span className="font-poppins text-[#6B7280] text-sm sm:text-base md:text-lg">
        {text}
      </span>
    ),
  },
];

export default function Commission() {
  const [data, setData] = useState<TransformedCommissionData | null>(null);

  // Lấy dữ liệu từ Directus khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCommission();
        const fetchedData: TransformedCommissionData = result[0]; // Lấy mục đầu tiên
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Commission:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center py-10 text-2xl font-poppins">Đang tải...</div>;
  }

  const { title, description, commissions } = data;

  return (
    <motion.div
      className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#001737] mb-4 font-poppins"
        variants={childVariants}
      >
        {title}
      </motion.p>

      <motion.p
        className="text-[#6B7280] text-base sm:text-lg mb-8 font-poppins"
        variants={childVariants}
      >
        {description}
      </motion.p>

      <motion.div
        className="bg-white rounded-xl pt-2 shadow-md overflow-x-auto"
        variants={childVariants}
      >
        <Table
          dataSource={commissions}
          columns={columns}
          pagination={false}
          bordered={false}
          rowClassName={(record, index) => (index % 2 === 1 ? "bg-[#F7FAFC]" : "")}
          className="[&_.ant-table-thead_th]:bg-[#F7FAFC] [&_.ant-table-thead_th]:text-[#001737] [&_.ant-table-thead_th]:font-poppins [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-sm [&_.ant-table-thead_th]:sm:text-base [&_.ant-table-thead_th]:md:text-lg [&_.ant-table-cell]:px-2 [&_.ant-table-cell]:sm:px-4 [&_.ant-table-cell]:py-2 [&_.ant-table-cell]:sm:py-3"
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
    </motion.div>
  );
}