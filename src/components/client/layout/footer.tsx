"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "antd"
import { useLocale } from "next-intl"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme } from "antd"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { getFooter, TransformedFooterData } from "@/lib/directus/footer"

export default function FooterSection() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [footerData, setFooterData] = useState<TransformedFooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFooter(locale);
        setFooterData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching footer data:", error);
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
      colorPrimary: "#FFC800",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  if (loading) {
    return (
      <ConfigProvider theme={themeConfig}>
        <div
          className={`border-t py-4 ${
            mytheme === "light" ? "border-gray-800 bg-white" : "border-gray-700 bg-[#1a1a1a]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <Row justify="space-between" align="middle">
              <Col>
                <p
                  className={`text-base ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-300"
                  }`}
                >
                  {locale === "vi" ? "Đang tải..." : locale === "zh" ? "加载中..." : "Loading..."}
                </p>
              </Col>
              <Col>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base ${
                      mytheme === "light" ? "text-gray-800" : "text-gray-300"
                    }`}
                  >
                    {locale === "vi" ? "Ngôn ngữ:" : locale === "zh" ? "语言:" : "Language:"}
                  </span>
                  <LanguageSwitcher />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`border-t py-4 ${
          mytheme === "light" ? "border-gray-800 bg-white" : "border-gray-700 bg-[#1a1a1a]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Row justify="space-between" align="middle">
            <Col>
              <p
                className={`text-base ${
                  mytheme === "light" ? "text-gray-800" : "text-gray-300"
                }`}
              >
                {footerData?.description}
              </p>
            </Col>

            <Col>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base ${
                    mytheme === "light" ? "text-gray-800" : "text-gray-300"
                  }`}
                >
                  {footerData?.title_lang}
                </span>
                <LanguageSwitcher />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
}