import { Input, Button } from "antd";
import { IMAGES } from "@/constants/client/theme";
import Image from "next/image";
import { YoutubeOutlined, FacebookOutlined } from "@ant-design/icons";

export default function ContactSection() {
  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333333] relative overflow-hidden text-white py-16">
      {/* Background decorative images */}
      <div className="absolute top-0 left-0 z-0">
        <Image
          src={IMAGES.BgFooter1}
          alt="Maxima Background"
          width={300}
          height={300}
          priority
        />
      </div>
      <div className="absolute right-0 top-20 z-0">
        <Image
          src={IMAGES.BgFooter2}
          alt="Maxima Background Right"
          width={900}
          height={300}
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Content */}
          <div>
            <div className="flex items-center mb-5">
              <Image
                src={IMAGES.LogoMaxima}
                alt="Maxima Logo"
                width={50}
                height={50}
              />
              <span className="ml-3 text-2xl font-semibold">Maxima</span>
            </div>

            <h3 className="text-xl font-semibold mb-3">
              The Maxima Experience
            </h3>
            <div className="space-y-1 text-sm leading-relaxed">
              <p>Head office: 1B Malaysia</p>
              <p>Hotline: 0243 990 4991</p>
              <p>Email: themaxima@gmail.com</p>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <span>Follow us on:</span>
              <FacebookOutlined style={{ fontSize: "20px" }} />
              <YoutubeOutlined style={{ fontSize: "20px" }} />
              {/* Tiktok icon có thể dùng svg hoặc ant icon nếu có */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.2 7.35v2.229a7.1 7.1 0 01-3.744-.894v5.84a5.602 5.602 0 11-5.602-5.602h.374v2.25h-.374a3.35 3.35 0 103.35 3.35V2.25h2.25a4.842 4.842 0 003.746 4.767z" />
              </svg>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:mt-12">
            <h3 className="text-2xl font-semibold mb-3">Get in Touch</h3>
            <p className="text-xl mb-3">
              Training Center in Kuala Lumpur, Malaysia
            </p>
            <p className="mb-5">Send us your feedback if needed!</p>

            <div className="flex bg-white rounded-full overflow-hidden mb-5 max-w-md">
              <Input
                placeholder="Email..."
                className="border-0 focus:shadow-none focus:border-0 text-black rounded-none px-4 py-2"
              />
              <div className="text-black font-medium ">
                <button className="bg-gray-200 gap-2 hover:bg-gray-300 flex items-center  text-white font-medium px-8 sm:px-6 py-2 rounded-full w-full sm:w-auto">
                  Send
                </button>
              </div>
            </div>

            <div className="text-black font-medium">
              <button className="bg-white gap-2  flex items-center  text-white font-medium px-8 sm:px-6 py-2 rounded-full w-full sm:w-auto">
                <DownloadIcon />
                Download now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
      />
    </svg>
  );
}
