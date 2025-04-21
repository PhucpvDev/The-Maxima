"use client";

import { Table } from "antd";
import { motion } from "framer-motion";

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

const dataSource = [
  { key: "1", rank: "Direct Referral", commission: "$3", profits: "12%", apple: "$1 per lot" },
  { key: "2", rank: "I.B", commission: "$2", profits: "14%", apple: "$1 per lot" },
  { key: "3", rank: "M.I.B", commission: "$1", profits: "16%", apple: "$1 per lot" },
];

const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (text: string) => <span className="font-poppins font-semibold text-[#001737]">{text}</span>,
  },
  {
    title: "Commission Per Lot",
    dataIndex: "commission",
    key: "commission",
    render: (text: string) => <span className="font-poppins text-[#6B7280]">{text}</span>,
  },
  {
    title: "Profits Sharing",
    dataIndex: "profits",
    key: "profits",
    render: (text: string) => <span className="font-poppins text-[#6B7280]">{text}</span>,
  },
  {
    title: "Apple Orchard",
    dataIndex: "apple",
    key: "apple",
    render: (text: string) => <span className="font-poppins text-[#6B7280]">{text}</span>,
  },
];

export default function Commission() {
  return (
    <motion.div
      className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        className="text-xl sm:text-2xl md:text-3xl font-bold text-[#001737] mb-4 font-poppins"
        variants={childVariants}
      >
        IB, MIB Commission
      </motion.p>

      <motion.p
        className="text-[#6B7280] text-sm sm:text-base mb-8 font-poppins"
        variants={childVariants}
      >
        You earn USDT based on the trading volume you contribute to the community.
      </motion.p>

      <motion.div
        className="bg-white rounded-xl pt-2 shadow-md overflow-x-auto"
        variants={childVariants}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered={false}
          rowClassName={(record, index) => (index % 2 === 1 ? "bg-[#F7FAFC]" : "")}
          className="[&_.ant-table-thead_th]:bg-[#F7FAFC] [&_.ant-table-thead_th]:text-[#001737] [&_.ant-table-thead_th]:font-poppins [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-xs [&_.ant-table-thead_th]:sm:text-sm [&_.ant-table-thead_th]:md:text-base [&_.ant-table-cell]:px-2 [&_.ant-table-cell]:sm:px-4 [&_.ant-table-cell]:py-2 [&_.ant-table-cell]:sm:py-3"
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

      <motion.div
        className="flex justify-between items-center mt-6 text-sm font-poppins"
        variants={childVariants}
      >
        <a href="#" className="text-[#6B7280] hover:text-[#3B82F6] transition-colors">
          Come back
        </a>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((num) => (
            <a
              key={num}
              className={`px-2 py-1 rounded-md transition-all ${
                num === 3
                  ? "bg-[#3B82F6] text-white font-semibold"
                  : "text-[#6B7280] hover:bg-[#3B82F6] hover:text-white"
              }`}
              href="#"
            >
              {num}
            </a>
          ))}
        </div>
        <a href="#" className="text-[#3B82F6] hover:text-[#001737] transition-colors">
          See more
        </a>
      </motion.div>

      {/* Global styles for Poppins font and table customization */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', Arial, Helvetica, sans-serif;
        }
        .ant-table-thead > tr > th {
          background: #f7fafc !important;
          color: #001737 !important;
          font-weight: 600 !important;
        }
        .ant-table-tbody > tr > td {
          color: #6b7280 !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: #e5e7eb !important;
        }
      `}</style>
    </motion.div>
  );
}