"use client";

import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getFaqs } from "@/lib/directus/faqs";

const { Panel } = Collapse;

export default function FAQSection() {
  interface FaqItem {
    question: string;
    answer: string;
  }

  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [title, setTitle] = useState("Frequently Asked Questions");
  
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
        // Will use fallback data if fetch fails
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="bg-white py-12 px-4 md:px-16 text-center">
      <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 uppercase">{title}</p>
      
      <div className="max-w-6xl mx-auto text-left">
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="site-collapse-custom-collapse rounded-lg overflow-hidden"
        >
          {faqData.map((item, index) => (
            <Panel header={item.question} key={index} className="text-base text-gray-700">
              <p>{item.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}