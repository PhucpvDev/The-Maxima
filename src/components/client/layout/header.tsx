"use client";

import { useState, useEffect, Suspense } from "react";
import { Drawer, ConfigProvider, theme as antdTheme } from "antd";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getHeader, TransformedHeaderData } from "@/lib/directus/header";
import { motion } from "framer-motion";
import Link from "next/link";
import Cookies from "js-cookie";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  tap: { scale: 0.98, transition: { duration: 0.2, ease: "easeInOut" } },
};

const detailedPostTranslations: Record<string, string> = {
  "en-US": "Detailed Post",
  "vi-VN": "Bài viết chi tiết",
  "zh-CN": "详细文章",
};

function AffiliateHandler({
  onAffCodeChange,
}: {
  onAffCodeChange: (affCode: string | null, shouldCall: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const [affCode, setAffCode] = useState<string | null>(null);
  const [shouldCallAffiliatesClick, setShouldCallAffiliatesClick] =
    useState(false);

  const generateTokenAff = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  };

  useEffect(() => {
    const user = searchParams.get("user");
    const aff = searchParams.get("aff");
    const existingAffCode = Cookies.get("aff_code");

    const fetchAffCodeFromUser = async (user: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/by-name/${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch affiliate code");
        }

        const data = await response.json();

        return data.affiliates[0].code;
      } catch (error) {
        console.error("Error fetching affiliate code:", error);
        return null;
      }
    };

    const handleAffCode = async () => {
      let finalAffCode = aff;

      if (user && !aff) {
        finalAffCode = await fetchAffCodeFromUser(user);
      }

      if (finalAffCode) {
        if (finalAffCode !== existingAffCode) {
          Cookies.set("aff_code", finalAffCode, { expires: 7 });
          const newTokenAff = generateTokenAff();
          Cookies.set("token_aff", newTokenAff, { expires: 7 });
          setShouldCallAffiliatesClick(true);
        } else {
          setShouldCallAffiliatesClick(false);
        }
        setAffCode(finalAffCode);
      } else {
        Cookies.remove("aff_code");
        Cookies.remove("token_aff");
        setAffCode(null);
        setShouldCallAffiliatesClick(false);
      }

      onAffCodeChange(finalAffCode, shouldCallAffiliatesClick);
    };

    handleAffCode();
  }, [searchParams, affCode, shouldCallAffiliatesClick, onAffCodeChange]);

  return null;
}

export default function Home() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [headerData, setHeaderData] = useState<TransformedHeaderData | null>(
    null
  );
  const [current, setCurrent] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [affCode, setAffCode] = useState<string | null>(null);
  const [shouldCallAffiliatesClick, setShouldCallAffiliatesClick] =
    useState(false);

  const handleAffCodeChange = (
    newAffCode: string | null,
    shouldCall: boolean
  ) => {
    setAffCode(newAffCode);
    setShouldCallAffiliatesClick(shouldCall);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHeader(locale);
        setHeaderData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  useEffect(() => {
    if (!headerData) return;

    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const alias: Record<string, string> = {
      "/posts": "/posts",
      "/affiliate": "/affiliate",
    };
    let mappedPath = alias[pathWithoutLocale] || pathWithoutLocale;

    if (
      pathWithoutLocale.startsWith("/posts/") &&
      pathWithoutLocale !== "/posts"
    ) {
      mappedPath = pathWithoutLocale;
    }

    const activeLink = headerData.nav_links.find((link) => {
      const linkPath = link.url === "/" ? "/" : link.url;
      return mappedPath === linkPath;
    });

    let newCurrent = activeLink
      ? activeLink.url === "/"
        ? "home"
        : activeLink.url.replace(/^\//, "").toLowerCase()
      : "home";

    if (
      pathWithoutLocale.startsWith("/posts/") &&
      pathWithoutLocale !== "/posts"
    ) {
      newCurrent = pathWithoutLocale.replace(/^\//, "").toLowerCase();
    }

    setCurrent(newCurrent);
  }, [pathname, headerData, locale]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme);
  }, [mytheme]);

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollToSection");
    if (targetId) {
      const attemptScroll = (attempts = 5, delay = 100) => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          sessionStorage.removeItem("scrollToSection");
        } else if (attempts > 0) {
          setTimeout(() => attemptScroll(attempts - 1, delay), delay);
        } else {
          console.warn(
            `Element with ID "${targetId}" not found after retries.`
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          sessionStorage.removeItem("scrollToSection");
        }
      };
      attemptScroll();
    }
  }, []);

  const AffiliatesClick = async () => {
    try {
      const code = Cookies.get("aff_code");
      const token = Cookies.get("token_aff");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliates/click`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            token,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit affiliate code");
      }
    } catch (error) {
      console.error("Error in AffiliatesClick:", error);
    }
  };

  useEffect(() => {
    if (affCode && shouldCallAffiliatesClick) {
      AffiliatesClick();
      setShouldCallAffiliatesClick(false);
    }
  }, [affCode, shouldCallAffiliatesClick]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
      borderRadius: 8,
    },
    algorithm:
      mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const getBannerImage = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      return mytheme === "light" ? IMAGES.Banner9Mb : IMAGES.Banner1Mb;
    }
    return mytheme === "light" ? IMAGES.Banner9 : IMAGES.Banner1;
  };

  const getElementId = (url: string) => {
    return url === "/" ? "home" : url.replace(/^\//, "").toLowerCase();
  };

  const getHrefFromUrl = (url: string) => {
    return url === "/" ? "#home" : `#${url.replace(/^\//, "")}`;
  };

  const handleMenuClick = (menuItem: string, url: string) => {
    setCurrent(url === "/" ? "home" : url.replace(/^\//, "").toLowerCase());
    setIsMenuOpen(false);

    const currentPage = pathname.replace(`/${locale}`, "") || "/";

    if (url === "/posts" || url === "/affiliate") {
      router.push(`/${locale}${url}`);
      return;
    }

    if (
      url === "/" &&
      (currentPage === "/posts" ||
        currentPage === "/affiliate" ||
        currentPage.startsWith("/posts/"))
    ) {
      router.push(`/${locale}/`);
      return;
    }

    const elementId = getElementId(url);
    const element = document.getElementById(elementId);

    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      console.warn(`Element with ID "${elementId}" not found.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getFilteredNavLinks = () => {
    const currentPage = pathname.replace(`/${locale}`, "") || "/";
    const lang =
      locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const detailedPostLabel =
      detailedPostTranslations[lang] || detailedPostTranslations["en-US"];

    if (currentPage.startsWith("/posts/") && currentPage !== "/posts") {
      const homeLink =
        headerData?.nav_links.filter((link) => link.url === "/") || [];
      const detailedPostLink = {
        name: detailedPostLabel,
        url: currentPage,
      };
      return [...homeLink, detailedPostLink];
    }
    if (currentPage === "/posts" || currentPage === "/affiliate") {
      return (
        headerData?.nav_links.filter(
          (link) => link.url === "/" || link.url === currentPage
        ) || []
      );
    }
    return headerData?.nav_links || [];
  };

  const filteredNavLinks = getFilteredNavLinks();

  if (loading) {
    return (
      <ConfigProvider theme={themeConfig}>
        <div
          className={`min-h-screen font-inter flex items-center justify-center overflow-x-hidden ${
            mytheme === "light"
              ? "bg-gradient-to-b from-gray-50 to-white"
              : "bg-gradient-to-b from-gray-900 to-gray-950"
          }`}
        >
          <motion.div
            className="relative w-32 h-32 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  mytheme === "light" ? "bg-white" : "bg-gray-800"
                }`}
              >
                <Image
                  src={IMAGES.LogoMaxima}
                  alt="Loading Logo"
                  width={48}
                  height={48}
                  priority
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-20 h-20 border-4 border-transparent border-b-yellow-500 border-l-yellow-400 rounded-full"></div>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
            </motion.div>
          </motion.div>
        </div>
      </ConfigProvider>
    );
  }

  const registrationUrl = affCode
    ? `https://agreement.maximadao.com/#/register?code=${encodeURIComponent(
        affCode
      )}`
    : `https://agreement.maximadao.com/#/register`;

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`min-h-screen font-inter relative ${
          mytheme === "light"
            ? "bg-gradient-to-b from-gray-50 to-white"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
        }`}
      >
        <Suspense fallback={null}>
          <AffiliateHandler onAffCodeChange={handleAffCodeChange} />
        </Suspense>

        <div className="absolute inset-0 overflow-hidden z-0">
          <div
            className={`absolute inset-0 opacity-5 ${
              mytheme === "light" ? "bg-gray-900" : "bg-white"
            }`}
            style={{
              backgroundImage: `radial-gradient(circle, ${
                mytheme === "light" ? "#1a202c" : "#ffffff"
              } 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <Image
          src={getBannerImage()}
          alt="Banner Background"
          fill
          className="object-cover md:object-center object-[75%_50%] md:object-[75%_50%] sm:object-[50%_50%]"
          priority
        />
        <div
          className={`absolute inset-0 z-0 ${
            mytheme === "light" ? "bg-black/20" : "bg-black/30"
          }`}
        ></div>

        <div className="relative z-50">
          <motion.header
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 overflow-x-hidden ${
              isScrolled
                ? mytheme === "light"
                  ? "bg-white/80 backdrop-blur-md shadow-lg"
                  : "bg-gray-900/80 backdrop-blur-md shadow-black/20"
                : "bg-transparent"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center px-4 py-4 mx-auto max-w-7xl w-full">
              <motion.div className="flex items-center" variants={fadeInUp}>
                <Link href={`/${locale}/`} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${
                      mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
                    } shadow-md`}
                  >
                    <Image
                      src={IMAGES.LogoMaxima}
                      alt="Logo Maxima"
                      width={40}
                      height={40}
                      priority
                    />
                  </div>
                  <span
                    className={`text-lg font-bold tracking-tight ${
                      mytheme === "light"
                        ? isScrolled
                          ? "text-gray-900"
                          : "text-white"
                        : "text-yellow-500"
                    }`}
                  >
                    MAXIMA
                  </span>
                </Link>
              </motion.div>

              <motion.button
                className={`md:hidden cursor-pointer w-9 h-9 rounded-full ${
                  mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
                } shadow-md`}
                onClick={() => setIsMenuOpen(true)}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <MenuOutlined
                  style={{
                    fontSize: "18px",
                    color: mytheme === "light" ? "#000000" : "#ffffff",
                  }}
                />
              </motion.button>

              <Drawer
                placement="right"
                onClose={() => setIsMenuOpen(false)}
                open={isMenuOpen}
                className="md:hidden"
                width="80%"
                closeIcon={
                  <CloseOutlined
                    style={{
                      color: mytheme === "light" ? "#000000" : "#ffffff",
                    }}
                  />
                }
                title={
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
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
                      className={`font-semibold ${
                        mytheme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Maxima Menu
                    </span>
                  </div>
                }
              >
                <motion.div
                  className="py-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredNavLinks.map((item) => (
                    <motion.div
                      key={item.name}
                      variants={fadeInUp}
                      className={`px-6 py-4 border-b ${
                        mytheme === "light"
                          ? "border-gray-200"
                          : "border-gray-700"
                      } ${
                        current ===
                        (item.url === "/"
                          ? "home"
                          : item.url.replace(/^\//, "").toLowerCase())
                          ? mytheme === "light"
                            ? "bg-yellow-50"
                            : "bg-yellow-900/20"
                          : ""
                      }`}
                      onClick={() => handleMenuClick(item.name, item.url)}
                    >
                      <motion.a
                        href={
                          item.url === "/posts" || item.url === "/affiliate"
                            ? `/${locale}${item.url}`
                            : getHrefFromUrl(item.url)
                        }
                        className={`block text-lg font-medium ${
                          current ===
                          (item.url === "/"
                            ? "home"
                            : item.url.replace(/^\//, "").toLowerCase())
                            ? mytheme === "light"
                              ? "text-yellow-500"
                              : "text-yellow-400"
                            : mytheme === "light"
                            ? "text-gray-700"
                            : "text-gray-300"
                        }`}
                        onClick={(e) => {
                          if (
                            item.url !== "/posts" &&
                            item.url !== "/affiliate"
                          ) {
                            e.preventDefault();
                            handleMenuClick(item.name, item.url);
                          }
                        }}
                      >
                        <span
                          className={
                            mytheme === "light" ? "text-gray-800" : "text-white"
                          }
                        >
                          {item.name}
                        </span>
                      </motion.a>
                    </motion.div>
                  ))}
                  <motion.div className="px-6 py-6 mt-4" variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`text-base font-medium ${
                          mytheme === "light" ? "text-gray-900" : "text-white"
                        }`}
                      >
                        Theme
                      </span>
                      <motion.button
                        className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center ${
                          mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
                        } shadow-md`}
                        onClick={handleToggleTheme}
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {mytheme === "light" ? (
                          <SunOutlined
                            style={{ fontSize: "16px", color: "#FFC800" }}
                          />
                        ) : (
                          <MoonOutlined
                            style={{ fontSize: "16px", color: "#FFC800" }}
                          />
                        )}
                      </motion.button>
                      <LanguageSwitcher />
                    </div>
                  </motion.div>
                </motion.div>
              </Drawer>

              <motion.nav
                className="hidden md:block flex-row items-center flex-wrap"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredNavLinks.map((item) => (
                  <motion.a
                    key={item.name}
                    href={
                      item.url === "/posts" || item.url === "/affiliate"
                        ? `/${locale}${item.url}`
                        : getHrefFromUrl(item.url)
                    }
                    className={`px-5 py-2 text-base font-medium rounded-full transition-all duration-200 ${
                      current ===
                      (item.url === "/"
                        ? "home"
                        : item.url.replace(/^\//, "").toLowerCase())
                        ? mytheme === "light"
                          ? "bg-yellow-500 text-white shadow-md"
                          : "bg-yellow-500/20 text-yellow-400 shadow-black/20"
                        : mytheme === "light"
                        ? isScrolled
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-white hover:bg-white/10"
                        : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                    onClick={(e) => {
                      if (item.url !== "/posts" && item.url !== "/affiliate") {
                        e.preventDefault();
                        handleMenuClick(item.name, item.url);
                      }
                    }}
                    variants={fadeInUp}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </motion.nav>

              <motion.div
                className="hidden md:flex items-center gap-4"
                variants={fadeInUp}
              >
                <motion.button
                  className={`w-9 h-9 rounded-full cursor-pointer flex items-center justify-center ${
                    mytheme === "light" ? "bg-gray-100" : "bg-gray-800"
                  } shadow-md`}
                  onClick={handleToggleTheme}
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {mytheme === "light" ? (
                    <SunOutlined
                      style={{ fontSize: "20px", color: "#FFC800" }}
                    />
                  ) : (
                    <MoonOutlined
                      style={{ fontSize: "20px", color: "#FFC800" }}
                    />
                  )}
                </motion.button>
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.header>

          <main className="px-4 py-10 pt-28 md:pt-32 max-w-7xl mx-auto">
            <section id="home">
              <motion.div
                className="md:mb-7 md:text-left"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.p
                  className={`text-3xl sm:text-4xl md:text-6xl md:w-4xl uppercase font-bold leading-tight tracking-tight ${
                    mytheme === "light" ? "text-white" : "text-white"
                  }`}
                  variants={fadeInUp}
                >
                  {headerData?.main_title.split("<br />").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </motion.p>

                <motion.p
                  className={`text-xl sm:text-2xl md:text-3xl md:w-3xl uppercase font-semibold pt-6 pb-4 ${
                    mytheme === "light" ? "text-white" : "text-gray-200"
                  }`}
                  variants={fadeInUp}
                >
                  {headerData?.subtitle}
                </motion.p>

                <motion.p
                  className={`text-lg sm:text-xl pb-4 uppercase font-bold ${
                    mytheme === "light" ? "text-white" : "text-gray-300"
                  }`}
                  variants={fadeInUp}
                >
                  {headerData?.rate_text}
                </motion.p>

                <motion.a
                  href={registrationUrl}
                  className="inline-block text-white"
                  variants={fadeInUp}
                >
                  <motion.button
                    className={`px-8 py-3 rounded-lg cursor-pointer text-white font-medium text-base shadow-lg ${
                      mytheme === "light"
                        ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200/30"
                        : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-900/20"
                    } transition-all duration-300`}
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {headerData?.cta_button_text}
                  </motion.button>
                </motion.a>
              </motion.div>

              <motion.div
                className="max-w-7xl mx-auto pt-10"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div
                  className={`p-6 rounded-2xl shadow-xl pmd:pl-32 ${
                    mytheme === "light"
                      ? "bg-white/80 backdrop-blur-md"
                      : "bg-gray-800/80 backdrop-blur-md"
                  }`}
                  variants={fadeInUp}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {headerData?.stats.map((stat, index) => {
                      const numberMatch = stat.value.match(/^\d{1,3}(,\d{3})*/);
                      const number = numberMatch ? numberMatch[0] : stat.value;
                      const unit = stat.value.replace(number, "").trim();

                      return (
                        <motion.div
                          key={index}
                          className="flex items-center"
                          variants={fadeInUp}
                        >
                          <div
                            className={`p-6 rounded-full mr-4 shadow-md ${
                              index === 0
                                ? mytheme === "light"
                                  ? "bg-yellow-100"
                                  : "bg-yellow-900/40"
                                : index === 1
                                ? mytheme === "light"
                                  ? "bg-blue-100"
                                  : "bg-blue-900/40"
                                : mytheme === "light"
                                ? "bg-green-100"
                                : "bg-green-900/40"
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
                          <div>
                            <span
                              className={`text-[22px] font-bold ${
                                mytheme === "light"
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }`}
                            >
                              {stat.label}
                            </span>
                            <p
                              className={`font-bold text-xl ${
                                mytheme === "light"
                                  ? "text-gray-900"
                                  : "text-white"
                              }`}
                            >
                              {number}{" "}
                              <span
                                className={`text-base font-bold ${
                                  mytheme === "light"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {unit}
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </section>
          </main>
        </div>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");

          .font-inter {
            font-family: "Inter", Arial, sans-serif;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin-slow {
            to {
              transform: rotate(-360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          .animate-bounce {
            animation: bounce 0.6s infinite;
          }
          .delay-100 {
            animation-delay: 0.1s;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }

          .transition-all {
            transition-property: all;
            transition-duration: 300ms;
            transition-timing-function: ease-in-out;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
