"use client";

import React, { useState, useCallback, useRef } from "react";
import { Modal } from "antd";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useSelector } from "react-redux";

interface TeamMemberTranslation {
  id: number;
  introduction_id: number;
  languages_code: string;
  hero_section_title: string;
  title: string;
  subtitle: string;
  name_1: string;
  role_1: string;
  bio_1: string;
  description_1: string;
  name_2: string;
  role_2: string;
  bio_2: string;
  description_2: string;
  name_3: string;
  role_3: string;
  bio_3: string;
  description_3: string;
  name_4: string;
  role_4: string;
  bio_4: string;
  description_4: string;
  skills_1: string;
  skills_2: string;
  skills_3: string;
  skills_4: string;
  avatar_1: string;
  avatar_2: string;
  avatar_3: string;
  avatar_4: string;
  showMemberIntro: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  description: string;
  avatar: string;
  skills: string[];
}

interface ApiResponse {
  id: number;
  translations: TeamMemberTranslation[];
}

interface TeamSliderProps {
  initialData?: {
    teamMembers: TeamMember[];
    hero_section_title: string;
    title: string;
    subtitle: string;
  };
  id?: string;
}

const translationFallbacks: Record<
  string,
  { hero_section_title: string; title: string; subtitle: string }
> = {
  "en-US": {
    hero_section_title: "Our Team",
    title: "Meet Our Exceptional Team",
    subtitle:
      "Our diverse group of experts brings together decades of experience in finance, technology, and customer service to deliver an unparalleled trading experience.",
  },
  "vi-VN": {
    hero_section_title: "Đội Ngũ Của Chúng Tôi",
    title: "Gặp Gỡ Đội Ngũ Xuất Sắc Của Chúng Tôi",
    subtitle:
      "Nhóm chuyên gia đa dạng của chúng tôi mang đến hàng thập kỷ kinh nghiệm trong lĩnh vực tài chính, công nghệ và dịch vụ khách hàng để cung cấp trải nghiệm giao dịch không thể sánh bằng.",
  },
  "zh-CN": {
    hero_section_title: "我们的团队",
    title: "认识我们卓越的团队",
    subtitle:
      "我们多样化的专家团队汇聚了在金融、科技和客户服务领域数十年的经验，为您提供无与伦比的交易体验。",
  },
};

function safeJsonParse<T extends string[]>(
  jsonString: string | null | undefined,
  fallback: T = [] as unknown as T
): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(error);

    console.warn("Failed to parse JSON string:", jsonString);
    if (
      typeof jsonString === "string" &&
      jsonString.includes("[") &&
      jsonString.includes("]")
    ) {
      try {
        const cleanedStr = jsonString
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*]/g, "]");
        return JSON.parse(cleanedStr);
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

async function getTeamMembers(locale: string): Promise<{
  teamMembers: TeamMember[];
  hero_section_title: string;
  title: string;
  subtitle: string;
  showMemberIntro: string;
}> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const fallback = translationFallbacks[lang] || translationFallbacks["en-US"];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/introduction?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );


    if (!response.ok) {
      throw new Error("Failed to fetch team members");
    }

    const result = await response.json();

    const data: ApiResponse = result.data;

    const translation =
      data.translations.find(
        (t: TeamMemberTranslation) => t.languages_code === lang
      ) ||
      ({
        languages_code: lang,
      } as TeamMemberTranslation);

    const teamMembers: TeamMember[] = Array.from({ length: 5 }, (_, i) => {
      const index = i + 1;
      return {
        id: index,
        name: String(
          translation[`name_${index}` as keyof TeamMemberTranslation] ||
          `Unknown ${index}`
        ),
        role: String(
          translation[`role_${index}` as keyof TeamMemberTranslation] ||
          "Unknown"
        ),
        bio: String(
          translation[`bio_${index}` as keyof TeamMemberTranslation] || ""
        ),
        description: String(
          translation[`description_${index}` as keyof TeamMemberTranslation] ||
          ""
        ),
        avatar: String(
          translation[`avatar_${index}` as keyof TeamMemberTranslation] ||
          "/team/default.jpg"
        ),
        skills: safeJsonParse(
          String(translation[`skills_${index}` as keyof TeamMemberTranslation]),
          []
        ),
      };
    });

    return {
      teamMembers,
      hero_section_title:
        translation.hero_section_title || fallback.hero_section_title,
      title: translation.title || fallback.title,
      subtitle: translation.subtitle || fallback.subtitle,
      showMemberIntro: result.data.showMemberIntro
    };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return {
      teamMembers: [
        {
          id: 1,
          name:
            lang === "vi-VN"
              ? "Alex Johnson"
              : lang === "zh-CN"
                ? "亚历克斯·约翰逊"
                : "Alex Johnson",
          role:
            lang === "vi-VN"
              ? "Giám đốc Điều hành & Nhà sáng lập"
              : lang === "zh-CN"
                ? "首席执行官兼创始人"
                : "CEO & Founder",
          bio:
            lang === "vi-VN"
              ? "Nhà khởi nghiệp có tầm nhìn với hơn 10 năm trong công nghệ tài chính. Đam mê tạo ra các giải pháp trao quyền cho nhà giao dịch."
              : lang === "zh-CN"
                ? "具有超过10年金融科技经验的企业家。热衷于创建赋予交易者权力的解决方案。"
                : "Entrepreneurial visionary with 10+ years in finance technology. Passionate about creating solutions that empower traders.",
          description:
            lang === "vi-VN"
              ? "Với kinh nghiệm sâu rộng trong lĩnh vực của mình, Alex Johnson đã đóng vai trò quan trọng trong việc phát triển các giải pháp và chiến lược sáng tạo, thúc đẩy công ty tiến xa hơn."
              : lang === "zh-CN"
                ? "凭借其领域的丰富经验，亚历克斯·约翰逊在开发创新解决方案和战略方面发挥了重要作用，推动公司向前发展。"
                : "With extensive experience in their field, Alex Johnson has been instrumental in developing innovative solutions and strategies that have propelled our company forward.",
          avatar: "/team/alex.jpg",
          skills: ["Leadership", "Strategy", "Investment"],
        },
        {
          id: 2,
          name:
            lang === "vi-VN"
              ? "Sarah Chen"
              : lang === "zh-CN"
                ? "莎拉·陈"
                : "Sarah Chen",
          role:
            lang === "vi-VN"
              ? "Giám đốc Công nghệ"
              : lang === "zh-CN"
                ? "首席技术官"
                : "Chief Technology Officer",
          bio:
            lang === "vi-VN"
              ? "Cựu kỹ sư Google chuyên về thuật toán AI và hệ thống giao dịch. Dẫn dắt sự đổi mới kỹ thuật của chúng tôi."
              : lang === "zh-CN"
                ? "前谷歌工程师，专注于人工智能算法和交易系统。领导我们的技术创新。"
                : "Former Google engineer with specialization in AI algorithms and trading systems. Leads our technical innovation.",
          description:
            lang === "vi-VN"
              ? "Với kinh nghiệm sâu rộng trong lĩnh vực của mình, Sarah Chen đã đóng vai trò quan trọng trong việc phát triển các giải pháp và chiến lược sáng tạo."
              : lang === "zh-CN"
                ? "凭借其领域的丰富经验，莎拉·陈在开发创新解决方案和战略方面发挥了重要作用。"
                : "With extensive experience in their field, Sarah Chen has been instrumental in developing innovative solutions and strategies.",
          avatar: "/team/sarah.jpg",
          skills:
            lang === "vi-VN"
              ? ["AI", "Kiến trúc phần mềm", "Blockchain"]
              : lang === "zh-CN"
                ? ["人工智能", "软件架构", "区块链"]
                : ["AI", "Software Architecture", "Blockchain"],
        },
        {
          id: 3,
          name:
            lang === "vi-VN"
              ? "Michael Patel"
              : lang === "zh-CN"
                ? "迈克尔·帕特尔"
                : "Michael Patel",
          role:
            lang === "vi-VN"
              ? "Trưởng phòng Giao dịch"
              : lang === "zh-CN"
                ? "交易主管"
                : "Head of Trading",
          bio:
            lang === "vi-VN"
              ? "15 năm kinh nghiệm trong giao dịch định lượng. Từng quản lý 2 tỷ USD tài sản tại Goldman Sachs."
              : lang === "zh-CN"
                ? "拥有15年量化交易经验。曾在高盛管理20亿美元的资产。"
                : "15 years of experience in quantitative trading. Previously managed $2B in assets at Goldman Sachs.",
          description:
            lang === "vi-VN"
              ? "Với kinh nghiệm sâu rộng, Michael Patel đã đóng vai trò quan trọng trong việc phát triển các giải pháp sáng tạo."
              : lang === "zh-CN"
                ? "凭借丰富的经验，迈克尔·帕特尔在开发创新解决方案方面发挥了重要作用。"
                : "With extensive experience, Michael Patel has been instrumental in developing innovative solutions.",
          avatar: "/team/michael.jpg",
          skills:
            lang === "vi-VN"
              ? [
                "Giao dịch thuật toán",
                "Quản lý rủi ro",
                "Phân tích thị trường",
              ]
              : lang === "zh-CN"
                ? ["算法交易", "风险管理", "市场分析"]
                : ["Algorithmic Trading", "Risk Management", "Market Analysis"],
        },
        {
          id: 4,
          name:
            lang === "vi-VN"
              ? "Emily Rodriguez"
              : lang === "zh-CN"
                ? "艾米丽·罗德里格斯"
                : "Emily Rodriguez",
          role:
            lang === "vi-VN"
              ? "Quản lý Thành công Khách hàng"
              : lang === "zh-CN"
                ? "客户成功经理"
                : "Customer Success Manager",
          bio:
            lang === "vi-VN"
              ? "Chuyên đảm bảo khách hàng đạt được mục tiêu đầu tư. Chuyên gia về trải nghiệm khách hàng và tư vấn tài chính."
              : lang === "zh-CN"
                ? "致力于确保客户实现投资目标。客户体验和财务咨询专家。"
                : "Dedicated to ensuring our clients achieve their investment goals. Expert in customer experience and financial advising.",
          description:
            lang === "vi-VN"
              ? "Với kinh nghiệm sâu rộng, Emily Rodriguez đã đóng vai trò quan trọng trong việc phát triển các giải pháp sáng tạo."
              : lang === "zh-CN"
                ? "凭借丰富的经验，艾米丽·罗德里格斯在开发创新解决方案方面发挥了重要作用。"
                : "With extensive experience, Emily Rodriguez has been instrumental in developing innovative solutions.",
          avatar: "/team/emily.jpg",
          skills:
            lang === "vi-VN"
              ? ["Quan hệ khách hàng", "Tư vấn tài chính", "Đào tạo"]
              : lang === "zh-CN"
                ? ["客户关系", "财务咨询", "培训"]
                : ["Client Relations", "Financial Advisory", "Training"],
        },
      ],
      hero_section_title: fallback.hero_section_title,
      title: fallback.title,
      subtitle: fallback.subtitle,
      showMemberIntro: "",
    };
  }
}

export default function TeamSlider({ initialData }: TeamSliderProps) {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialData?.teamMembers || []
  );
  const [heroSectionTitle, setHeroSectionTitle] = useState<string>(
    initialData?.hero_section_title ||
    translationFallbacks["en-US"].hero_section_title
  );
  const [title, setTitle] = useState<string>(
    initialData?.title || translationFallbacks["en-US"].title
  );
  const [subtitle, setSubtitle] = useState<string>(
    initialData?.subtitle || translationFallbacks["en-US"].subtitle
  );

   const [isHidden, setIsHidden] = useState<string>();

  const [activeTeamMember, setActiveTeamMember] = useState<TeamMember | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const dataFetchedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideshowPausedRef = useRef(false);

  const goToNext = useCallback(() => {
    if (isAnimating || isLoading || !teamMembers.length) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, isLoading, teamMembers.length]);

  const goToPrev = useCallback(() => {
    if (isAnimating || isLoading || !teamMembers.length) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + teamMembers.length) % teamMembers.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, isLoading, teamMembers.length]);

  const setupSlideshow = useCallback(() => {
    if (
      slideshowPausedRef.current ||
      isLoading ||
      !teamMembers.length ||
      activeTeamMember
    )
      return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [goToNext, isLoading, teamMembers.length, activeTeamMember]);

  if (!initialData && !dataFetchedRef.current) {
    dataFetchedRef.current = true;
    setIsLoading(true);
    getTeamMembers(locale).then((data) => {
      setTeamMembers(data.teamMembers);
      setHeroSectionTitle(data.hero_section_title);
      setTitle(data.title);
      setSubtitle(data.subtitle);
      setIsHidden(data.showMemberIntro);
      setIsLoading(false);
    });
  }

  if (
    !isLoading &&
    teamMembers.length > 0 &&
    !activeTeamMember &&
    !timerRef.current
  ) {
    setupSlideshow();
  }

  if (activeTeamMember && timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 100) {
      goToNext();
    } else if (touchEndX.current - touchStartX.current > 100) {
      goToPrev();
    }
  };

  const goToSlide = (index: number) => {
    if (isAnimating || isLoading || !teamMembers.length) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getSlidePosition = (index: number) => {
    if (index === currentIndex) {
      return "center";
    } else if (
      index ===
      (currentIndex - 1 + teamMembers.length) % teamMembers.length
    ) {
      return "left";
    } else if (index === (currentIndex + 1) % teamMembers.length) {
      return "right";
    } else {
      return "hidden";
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading team members...
        </p>
      </div>
    );
  }

  return (
    <>
     {isHidden === "true" ? (
      <div className="md:py-18 py-14 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-3 max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-yellow-600 rounded mr-2"></div>
            <span
              className={`font-bold uppercase tracking-wider text-sm ${mytheme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
              {heroSectionTitle}
            </span>
            <div className="h-1 w-10 bg-yellow-600 rounded ml-2"></div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold pb-6 ${mytheme === "dark" ? "text-white" : "text-gray-800"
              }`}>
            {title}
          </h1>
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-8`}>
            {subtitle}
          </p>
        </div>

        <div className="relative px-4">
          <button
            onClick={goToPrev}
            className="absolute left-0 cursor-pointer  top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-2 md:p-3 shadow-lg text-yellow-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              locale === "vi"
                ? "Thành viên trước"
                : locale === "zh"
                  ? "上一成员"
                  : "Previous team member"
            }>
            <svg
              className={`w-6 h-6 ${mytheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={sliderRef}
            className="overflow-hidden relative h-[600px] mx-auto md:p-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div className="relative w-full h-full">
              {teamMembers.map((member, index) => {
                const position = getSlidePosition(index);
                return (
                  <div
                    key={member.id}
                    className={`absolute transition-all duration-500 ease-in-out top-0 w-full max-w-md mx-auto 
                      ${position === "center"
                        ? "left-1/2 -translate-x-1/2 z-10 opacity-100 scale-100"
                        : ""
                      } 
                      ${position === "left"
                        ? "left-0 -translate-x-1/2 z-0 opacity-40 scale-85"
                        : ""
                      } 
                      ${position === "right"
                        ? "right-0 translate-x-1/2 z-0 opacity-40 scale-85"
                        : ""
                      } 
                      ${position === "hidden" ? "opacity-0 scale-75 -z-10" : ""
                      }`}>
                    <div
                      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform 
                        ${position === "center" ? "hover:scale-105" : ""} 
                        border border-gray-100 dark:border-gray-700 h-full`}>
                      <div className="relative h-80 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${member.avatar}`}
                            alt={member.name}
                            className="object-cover w-full h-full"
                            width={400}
                            height={400}
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                          <h3 className="text-2xl font-bold">{member.name}</h3>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-gray-600 dark:text-gray-300 pb-4 line-clamp-3">
                          {member.bio}
                        </p>
                        <button
                          onClick={() => setActiveTeamMember(member)}
                          className="w-full cursor-pointer  py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                          <span className="text-white cursor-pointer">
                            {locale === "vi"
                              ? "Xem Hồ Sơ"
                              : locale === "zh"
                                ? "查看简介"
                                : "View Profile"}
                          </span>
                          <svg
                            className="w-4 h-4 ml-2 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 cursor-pointer top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-2 md:p-3 shadow-lg text-yellow-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={
              locale === "vi"
                ? "Thành viên tiếp theo"
                : locale === "zh"
                  ? "下一成员"
                  : "Next team member"
            }>
            <svg
              className={`w-6 h-6 ${mytheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-center md:mt-6 -mt-18 space-x-2">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex
                  ? "bg-yellow-600 w-8"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              aria-label={
                locale === "vi"
                  ? `Đi đến slide ${index + 1}`
                  : locale === "zh"
                    ? `转到幻灯片 ${index + 1}`
                    : `Go to slide ${index + 1}`
              }
            />
          ))}
        </div>

        <Modal
          open={!!activeTeamMember}
          onCancel={() => setActiveTeamMember(null)}
          footer={null}
          closable={false}
          centered
          width="90%"
          style={{ maxWidth: "1240px" }}
          className="team-member-modal">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full overflow-hidden relative animate-scale-in"
            style={{ animation: "scale-in 0.3s ease-out forwards" }}>
            <button
              onClick={() => setActiveTeamMember(null)}
              className="absolute md:top-0 top-2 cursor-pointer hover:bg-gray-100 right-2 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
              aria-label={
                locale === "vi"
                  ? "Đóng hồ sơ"
                  : locale === "zh"
                    ? "关闭简介"
                    : "Close profile"
              }>
              <svg
                className={`w-6 h-6 ${mytheme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative">
                <div className="absolute inset-0 bg-gray-700"></div>
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-white">
                  <div className="p-2 rounded-full bg-white/20 p-1 backdrop-blur-sm mb-6 ring-4 ring-white/30">
                    <div className="w-full h-full p-1 rounded-full flex items-center justify-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${activeTeamMember?.avatar}`}
                        alt={activeTeamMember?.name || "Team Member"}
                        className="object-cover h-36 w-36 min-h-32 min-w-32 rounded-full"
                        width={130}
                        height={130}
                      />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">
                    {activeTeamMember?.name}
                  </h2>
                  <div className="w-full mt-10">
                    <p className="text-sm uppercase tracking-wider text-blue-200 mb-3 font-bold">
                      {locale === "vi"
                        ? "Mô tả"
                        : locale === "zh"
                          ? "描述"
                          : "Description"}
                    </p>
                    <p className="text-white text-base dark:text-gray-300 leading-relaxed">
                      {activeTeamMember?.bio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 p-8 max-h-[80vh] overflow-y-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-yellow-600 dark:text-blue-400 p-2 rounded-full mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    {locale === "vi"
                      ? `Giới thiệu về ${activeTeamMember?.name}`
                      : locale === "zh"
                        ? `关于 ${activeTeamMember?.name}`
                        : `About ${activeTeamMember?.name}`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {activeTeamMember?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
      ) : null}

    </>
  );
}
