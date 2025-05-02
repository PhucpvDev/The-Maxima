"use client";

import { useState, useEffect } from "react";
import { Button, Drawer, ConfigProvider, theme as antdTheme } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleTheme } from "@/redux/theme/themeSlice";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getHeader, TransformedHeaderData } from "@/lib/directus/header";

export default function Home() {
  const locale = useLocale();
  const dispatch = useDispatch();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [headerData, setHeaderData] = useState<TransformedHeaderData | null>(null);
  const [current, setCurrent] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHeader(locale);
        setHeaderData(result);
        setCurrent(result.nav_links[0]?.name.toLowerCase() || "home");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

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
      <ConfigProvider theme={themeConfig}>
        <div
          className={`min-h-screen font-roboto flex items-center justify-center ${
            mytheme === "light" ? "bg-gradient-to-b bg-white/10" : "bg-gradient-to-b from-gray-900 to-black"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            {/* Enhanced loading animation with multiple elements */}
            <div className="relative mb-8">
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src={IMAGES.LogoMaxima}
                    alt="Loading Logo"
                    width={48}
                    height={48}
                    priority
                  />
                </div>
              </div>

              {/* Outer spinning ring */}
              <div className="w-24 h-24 border-4 border-transparent border-t-green-500 border-r-green-400 rounded-full animate-spin"></div>

              {/* Inner spinning ring (opposite direction) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent border-b-yellow-500 border-l-yellow-400 rounded-full animate-spin-slow"></div>
              </div>

              {/* Pulsing glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Loading text with subtle animation */}
            <div className="text-center">
              <p className={`text-2xl font-medium ${mytheme === "light" ? "text-gray-800" : "text-white"}`}>
                {locale === "vi"
                  ? "Đang tải..."
                  : locale === "zh"
                    ? "加载中..."
                    : "Loading..."}
              </p>
              <div className="mt-2 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  function handleMenuClick(menuItem: string): void {
    setCurrent(menuItem);
    setIsMenuOpen(false);
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`min-h-screen font-roboto relative ${
          mytheme === "light" ? "bg-[#003055] text-black" : "bg-[#001529] text-white"
        }`}
      >
        <Image
          src={mytheme === "dark" ? IMAGES.Banner1 : IMAGES.Banner9}
          alt="Banner Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="md:object-center object-[75%_50%]"
          priority
        />
        <div
          className={`absolute inset-0 z-0 ${
            mytheme === "light" ? "bg-black/20" : "bg-black/20"
          }`}
        ></div>

        <div className="relative z-50">
          <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              isScrolled
                ? mytheme === "light"
                  ? "bg-white shadow-md text-black"
                  : "bg-black shadow-md text-white"
                : "bg-transparent text-white"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-4 mx-auto max-w-7xl">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${
                    mytheme === "light" ? "bg-gray-200" : "bg-white/10"
                  }`}
                >
                  <Image
                    src={IMAGES.LogoMaxima}
                    alt="Logo Maxima"
                    width={40}
                    height={40}
                    priority
                  />
                </div>
                
                <style jsx global>{`
                  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');
                  .maxima-brand-text {
                    font-family: 'Montserrat', sans-serif;
                    letter-spacing: 0.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    background: ${mytheme === "light" 
                      ? (isScrolled ? "linear-gradient(90deg, #000 0%, #333 100%)" : "linear-gradient(90deg, #fff 0%, #f0f0f0 100%)") 
                      : "linear-gradient(90deg, #FFC800 0%, #FF9500 100%)"};
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    text-shadow: ${mytheme === "light" 
                      ? (isScrolled ? "0px 1px 2px rgba(0,0,0,0.1)" : "0px 1px 2px rgba(255,255,255,0.2)") 
                      : "0px 1px 2px rgba(255,200,0,0.2)"};
                  }
                `}</style>
                
                <span className="maxima-brand-text text-lg">
                  MAXIMA
                </span>
              </div>

              <button
                className="md:hidden text-4xl"
                onClick={() => setIsMenuOpen(true)}
              >
                <MenuOutlined
                  className={`text-[20px] ${
                    isScrolled && mytheme === "light" ? "text-black" : "text-white"
                  }`}
                />
              </button>

              <Drawer
                placement="right"
                onClose={() => setIsMenuOpen(false)}
                open={isMenuOpen}
                className="md:hidden"
                width="80%"
                closeIcon={
                  <CloseOutlined
                    style={{ color: mytheme === "light" ? "#000000" : "#ffffff" }}
                  />
                }
                bodyStyle={{
                  backgroundColor: mytheme === "light" ? "#ffffff" : "#000000",
                  color: mytheme === "light" ? "#000000" : "#ffffff",
                }}
                headerStyle={{
                  backgroundColor: mytheme === "light" ? "#ffffff" : "#000000",
                  borderBottom:
                    mytheme === "light" ? "1px solid #e0e0e0" : "1px solid #333333",
                }}
                title={
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        mytheme === "light" ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      <Image
                        src={IMAGES.LogoMaxima}
                        alt="Logo Maxima"
                        width={32}
                        height={32}
                        priority
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        mytheme === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      Maxima Menu
                    </span>
                  </div>
                }
              >
                <div className="py-4">
                  {headerData?.nav_links.map((item) => (
                    <div
                      key={item.name}
                      className={`px-6 py-4 border-b ${
                        mytheme === "light"
                          ? "border-gray-200"
                          : "border-white/10"
                      } ${
                        current === item.name.toLowerCase()
                          ? mytheme === "light"
                            ? "bg-gray-100"
                            : "bg-white/10"
                          : ""
                      }`}
                      onClick={() => handleMenuClick(item.name.toLowerCase())}
                    >
                      <a
                        href={item.url}
                        className={`block text-lg ${
                          current === item.name.toLowerCase()
                            ? mytheme === "light"
                              ? "text-black"
                              : "text-white"
                            : mytheme === "light"
                              ? "text-gray-600"
                              : "text-white/80"
                        }`}
                      >
                        <span
                          className={mytheme === "light" ? "text-black" : "text-white"}
                        >
                          {item.name}
                        </span>
                      </a>
                    </div>
                  ))}

                  <div className="px-6 py-6 mt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`text-base ${
                          mytheme === "light" ? "text-black" : "text-white"
                        }`}
                      >
                        Theme
                      </span>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          mytheme === "light" ? "bg-gray-200" : "bg-white"
                        }`}
                        onClick={handleToggleTheme}
                      >
                        {mytheme === "light" ? (
                          <SunOutlined
                            style={{ fontSize: "16px", color: "#1e3a8a" }}
                          />
                        ) : (
                          <MoonOutlined
                            style={{ fontSize: "16px", color: "#1e3a8a" }}
                          />
                        )}
                      </button>
                      <LanguageSwitcher />
                    </div>
                    <div className="flex items-center justify-between">
                    </div>
                  </div>
                </div>
              </Drawer>

              <nav className="hidden md:flex flex-row">
                {headerData?.nav_links.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    className={`px-5 py-2 text-base font-medium ${
                      current === item.name.toLowerCase()
                        ? isScrolled && mytheme === "light"
                          ? "text-black bg-gray-200 rounded-full"
                          : "text-white bg-white/15 rounded-full"
                        : isScrolled && mytheme === "light"
                          ? "text-black"
                          : "text-white"
                    }`}
                    onClick={() => setCurrent(item.name.toLowerCase())}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="hidden md:flex items-center">
                <button
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    mytheme === "light" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={handleToggleTheme}
                >
                  {mytheme === "light" ? (
                    <SunOutlined
                      style={{ fontSize: "16px", color: "#1e3a8a" }}
                    />
                  ) : (
                    <MoonOutlined
                      style={{ fontSize: "16px", color: "#1e3a8a" }}
                    />
                  )}
                </button>
                <span
                  className={`ml-3 mr-3 ${
                    isScrolled && mytheme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  |
                </span>
                <LanguageSwitcher />
              </div>
            </div>
          </header>

          <main className="px-4 py-10 pt-28 md:pt-36 max-w-7xl mx-auto">
            <div className="md:mb-7 md:text-left">
              <h1
                className={`text-[30px] max-w-4xl sm:text-3xl md:text-[55px] uppercase font-bold mb-6 leading-tight tracking-wide ${
                  mytheme === "light" ? "text-white" : "text-white"
                }`}
              >
                {headerData?.main_title.split("<br />").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>

              <h1
                className={`text-xl sm:text-xl md:text-3xl font-bold mb-2 ${
                  mytheme === "light" ? "text-white" : "text-white"
                }`}
              >
                {headerData?.subtitle}
              </h1>

              <p
                className={`text-xl sm:text-lg md:text-xl mb-8 font-bold ${
                  mytheme === "light" ? "text-white" : "text-white"
                }`}
              >
                {headerData?.rate_text}
              </p>

              <a className="text-white" href={headerData?.cta_button_url}>
                <button
                  className={`bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-3 rounded-full sm:w-auto`}
                >
                  {headerData?.cta_button_text}
                </button>
              </a>
            </div>
          </main>

          <div className="max-w-7xl mx-auto px-4 pb-10">
            <div
              className={`p-1 rounded-3xl shadow-xl border ${
                mytheme === "light"
                  ? "border-yellow-600"
                  : "border-yellow-800"
              }`}
            >
              <div
                className={`grid grid-cols-1 md:grid-cols-3 md:gap-8 ml-5 md:ml-35 ${
                  mytheme === "light" ? "text-white" : "text-white"
                }`}
              >
                {headerData?.stats.map((stat, index) => {
                  const numberMatch = stat.value.match(/^\d{1,3}(,\d{3})*/);
                  const number = numberMatch ? numberMatch[0] : stat.value;
                  const unit = stat.value.replace(number, "").trim();

                  return (
                    <div key={index} className="flex items-center">
                      <div
                        className={`p-4 rounded-full mr-4 shadow-xl ${
                          index === 0
                            ? mytheme === "light"
                              ? "bg-orange-200"
                              : "bg-orange-100"
                            : index === 1
                              ? mytheme === "light"
                                ? "bg-blue-200 py-5"
                                : "bg-blue-100 py-5"
                              : mytheme === "light"
                                ? "bg-green-200"
                                : "bg-green-100"
                        }`}
                      >
                        <Image
                          src={
                            index === 0
                              ? IMAGES.Percent.src
                              : index === 1
                                ? IMAGES.User
                                : IMAGES.Location
                          }
                          alt={`${stat.label} Icon`}
                          width={32}
                          height={32}
                          priority
                        />
                      </div>
                      <div className="mt-6">
                        <span className="text-lg font-medium">{stat.label}</span>
                        <p className="font-bold text-xl">
                          {number}{" "}
                          <span
                            className={`text-sm font-normal ${
                              mytheme === "light" ? "text-white" : "text-white"
                            }`}
                          >
                            {unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}