"use client";

import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfigProvider, theme as antdTheme } from "antd";
import { getFaqs, FaqItem, TransformedFaqData } from "@/lib/directus/faqs";

const { Panel } = Collapse;

export default function FAQSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFaqs(locale);
        if (result && result.length > 0) {
          if (result[0].faqs && result[0].faqs.length > 0) {
            setFaqData(result[0].faqs);
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

  const getCSSVariable = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  const themeConfig = {
    token: {
      colorPrimary: getCSSVariable("--yellow-500") || "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (loading) {
    return (
      <div
        className={`py-12 px-4 md:px-16 ${
          mytheme === "light"
            ? "bg-gradient-to-r from-white to-[#DDEFFF]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <div className="max-w-7xl p-8 mx-auto flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 text-left">
            <p
              className={`text-4xl font-bold uppercase tracking-wider leading-tight ${
                mytheme === "light" ? "text-[#1A1A1A]" : "text-white"
              }`}
            >
              {locale === "vi" ? "Đang tải..." : locale === "zh" ? "加载中..." : "Loading..."}
            </p>
          </div>
          <div className="md:w-2/3 text-left"></div>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`py-12 px-4 md:px-16 ${
          mytheme === "light"
            ? "bg-gradient-to-r from-white to-[#DDEFFF]"
            : "bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]"
        }`}
      >
        <div className="max-w-7xl p-8 mx-auto flex flex-col md:flex-row gap-8">
          {/* Tiêu đề bên trái */}
          <div className="md:w-1/3 text-left">
            <p
              className={`text-4xl font-bold uppercase tracking-wider leading-tight ${
                mytheme === "light" ? "text-[#1A1A1A]" : "text-yellow-600"
              }`}
            >
              {title}
            </p>
          </div>

          {/* Câu hỏi bên phải */}
          <div className="md:w-2/3 text-left">
            <Collapse
              accordion
              expandIcon={({ isActive }) => (isActive ? <MinusOutlined /> : <PlusOutlined />)}
              className={`site-collapse-custom-collapse rounded-lg overflow-hidden ${
                mytheme === "light"
                  ? "[&_.ant-collapse-header]:bg-white [&_.ant-collapse-content]:bg-white"
                  : "[&_.ant-collapse-header]:bg-black/50 [&_.ant-collapse-content]:bg-black/50"
              }`}
              expandIconPosition="start"
            >
              {faqData.map((item, index) => (
                <Panel
                  header={item.question}
                  key={index}
                  className={`text-xl font-medium border-b ${
                    mytheme === "light"
                      ? "text-[#1A1A1A] border-gray-300"
                      : "text-gray-200 border-gray-700"
                  }`}
                >
                  <p
                    className={`text-lg ${
                      mytheme === "light" ? "text-[#666666]" : "text-gray-300"
                    }`}
                  >
                    {item.answer}
                  </p>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}