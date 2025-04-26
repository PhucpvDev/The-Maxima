"use client";

import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { getFaqs } from "@/lib/directus/faqs";

const { Panel } = Collapse;

export default function FAQSection() {
  interface FaqItem {
    question: string;
    answer: string;
  }

  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [title, setTitle] = useState("Giải đáp một số thắc mắc trước khi mua phần mềm");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFaqs();
        if (result && result.length > 0) {
          if (result[0].faqs && result[0].faqs.length > 0) {
            setFaqData(result[0].faqs);
          }
          if (result[0].title) {
            setTitle(result[0].title);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-12 px-4 md:px-16 bg-gradient-to-r from-white to-[#DDEFFF]">
      <div className="max-w-7xl p-8 mx-auto flex flex-col md:flex-row gap-8">
        {/* Tiêu đề bên trái */}
        <div className="md:w-1/3 text-left">
          <p className="text-4xl font-bold text-[#1A1A1A] uppercase tracking-wider leading-tight">
            {title}
          </p>
        </div>

        {/* Câu hỏi bên phải */}
        <div className="md:w-2/3 text-left">
          <Collapse
            accordion
            expandIcon={({ isActive }) => (isActive ? <MinusOutlined /> : <PlusOutlined />)}
            className="site-collapse-custom-collapse rounded-lg overflow-hidden"
            expandIconPosition="start"
          >
            {faqData.map((item, index) => (
              <Panel
                header={item.question}
                key={index}
                className="text-xl text-[#1A1A1A] font-medium border-b border-gray-300"
              >
                <p className="text-lg text-[#666666]">{item.answer}</p>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  );
}