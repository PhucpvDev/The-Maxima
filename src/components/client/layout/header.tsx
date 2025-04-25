import { useState, useEffect } from "react";
import { Button, Drawer } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function Home() {
  const [current, setCurrent] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { key: "home", label: "Home" },
    { key: "about us", label: "About us" },
    { key: "how", label: "How" },
    { key: "tutorial", label: "Tutorial" },
    { key: "become ib", label: "Become IB" },
    { key: "faq", label: "FAQ" },
    { key: "contact", label: "Contact" },
    { key: "affiliate", label: "Affiliate" },
  ];

  const toggleIcon = () => {
    setIsLightMode(!isLightMode);
  };

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

  interface MenuClickEvent {
    key: string;
  }

  const handleMenuClick = (key: string): void => {
    setCurrent(key);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[#003055] text-white font-roboto relative">
        <Image
          src={IMAGES.Banner1}
          alt="Banner Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="md:object-center object-[75%_50%]"
          priority
        />
        <div className="absolute inset-0 bg-black/20 z-0"></div>

        <div className="relative z-50">
          <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
              isScrolled ? "bg-black shadow-md" : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-4 mx-auto max-w-7xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                  <Image
                    src={IMAGES.LogoMaxima}
                    alt="Logo Maxima"
                    width={40}
                    height={40}
                    priority
                  />
                </div>
                <span className="font-medium text-lg">Maxima</span>
              </div>

              <button
                className="md:hidden text-white text-4xl"
                onClick={() => setIsMenuOpen(true)}
              >
                <MenuOutlined className="text-[20px]" />
              </button>

              <Drawer
                placement="right"
                onClose={() => setIsMenuOpen(false)}
                open={isMenuOpen}
                className="md:hidden"
                width="80%"
                closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
                title={
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                      <Image
                        src={IMAGES.LogoMaxima}
                        alt="Logo Maxima"
                        width={32}
                        height={32}
                        priority
                      />
                    </div>
                    <span className="text-white font-medium">Maxima Menu</span>
                  </div>
                }
              >
                <div className="py-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.key}
                      className={`px-6 py-4 border-white/10 ${
                        current === item.key ? "bg-white/10" : ""
                      }`}
                      onClick={() => handleMenuClick(item.key)}
                    >
                      <a
                        href="#"
                        className={`block text-lg ${
                          current === item.key ? "text-white" : "text-white/80"
                        }`}
                      >
                        <span className="text-white">{item.label}</span>
                      </a>
                    </div>
                  ))}

                  <div className="px-6 py-6 mt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-white text-base">Theme</span>
                      <button
                        className="w-8 h-8 bg-white rounded-full text-white flex items-center justify-center"
                        onClick={toggleIcon}
                      >
                        {isLightMode ? (
                          <SunOutlined style={{ fontSize: "18px" }} />
                        ) : (
                          <MoonOutlined style={{ fontSize: "18px" }} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white text-base">Language</span>
                      <div className="flex space-x-4 gap-2">
                        <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <Image
                            src={IMAGES.LangViet}
                            alt="Vietnam Flag"
                            width={24}
                            height={24}
                            priority
                          />
                        </button>
                        <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <Image
                            src={IMAGES.LangAnh}
                            alt="English Flag"
                            width={24}
                            height={24}
                            priority
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>

              <nav className="hidden md:flex flex-row">
                {menuItems.map((item) => (
                  <a
                    key={item.key}
                    href="#"
                    className={`px-5 py-2 text-base font-medium ${
                      current === item.key
                        ? "text-white bg-white/15 rounded-full"
                        : "text-white/80"
                    }`}
                    onClick={() => setCurrent(item.key)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-2">
                <button
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  onClick={toggleIcon}
                >
                  {isLightMode ? (
                    <SunOutlined
                      style={{ fontSize: "16px", color: "#1e3a8a" }}
                    />
                  ) : (
                    <MoonOutlined
                      style={{ fontSize: "16px", color: "#1e3a8a" }}
                    />
                  )}
                </button>
                <span>|</span>
                <button className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Image
                    src={IMAGES.LangViet}
                    alt="Vietnam Flag"
                    width={32}
                    height={32}
                    priority
                  />
                </button>
                <button className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Image
                    src={IMAGES.LangAnh}
                    alt="English Flag"
                    width={32}
                    height={32}
                    priority
                  />
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-10 pt-28 md:pt-32 max-w-7xl mx-auto">
            <div className="md:mb-7 md:text-left">
              <h1 className="text-[25px] sm:text-3xl md:text-[55px] uppercase font-bold mb-6 leading-tight tracking-wide">
                Unlock Peak Profit Model
                <br />
                2.0 Breakthrough with
                <br />
                Futures Trading
              </h1>

              <h1 className="text-xl sm:text-xl md:text-3xl font-bold mb-2">
                To Be Smarter, We’ve Predicted Your Success
              </h1>

              <p className="text-xl sm:text-lg md:text-xl mb-8 font-bold">
                Rate — How Much Is It?
              </p>

              <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-8 sm:px-16 py-3 rounded-full sm:w-auto">
                Get Started Now
              </button>
            </div>
          </main>

          <div className="max-w-7xl mx-auto px-4 pb-10">
            <div className="bg-white/10 text-blue-800 p-1 rounded-3xl shadow-xl border border-yellow-800">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 text-white ml-5 md:ml-35">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-4 rounded-full mr-4 shadow-xl">
                    <Image
                      src={IMAGES.Percent.src}
                      alt="Percent Icon"
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-lg font-medium">Company size</span>
                    <p className="font-bold text-xl">
                      2.000 <span className="text-sm font-normal">Staff</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 p-4 py-5 rounded-full mr-4 shadow-xl">
                    <Image
                      src={IMAGES.User}
                      alt="User Icon"
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-lg font-medium">Client</span>
                    <p className="font-bold text-xl">
                      300.000 <span className="text-sm font-normal">Shop</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-4 rounded-full mr-4 shadow-xl">
                    <Image
                      src={IMAGES.Location}
                      alt="Location Icon"
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-lg font-medium">Coverage</span>
                    <p className="font-bold text-xl">
                      3 <span className="text-sm font-normal">Nation</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
