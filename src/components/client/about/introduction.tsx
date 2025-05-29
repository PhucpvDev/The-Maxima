"use client";

import React, { useState, useCallback, useRef } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useSelector } from "react-redux";
import TeamModal from "@/components/client/about/teamModal";

interface TeamMemberTranslation {
  id: number;
  introductions_id: number;
  languages_code: string;
  name: string;
  role: string;
  bio: string;
  description: string;
  avatar: string;
  skills: string;
  sologan: string;
  achievements: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  description: string;
  avatar: string;
  skills: string[];
  sologan: string;
  achievements: string[];
}

interface ApiResponse {
  data: {
    id: number;
    name: string;
    showMenberIntro: string;
    translations: TeamMemberTranslation[];
  }[];
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

interface RootState {
  theme: {
    mytheme: string;
  };
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
  } catch {
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

function parseAchievements(achievements: string | null | undefined): string[] {
  if (!achievements) return [];
  return achievements.split("\n").filter((item) => item.trim() !== "");
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
      `https://admin.maximagoldhedging.com/items/introductions?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();

    const teamMembers: TeamMember[] = result.data.map((item) => {
      let translation = item.translations.find(
        (t) => t.languages_code === lang
      );
      if (!translation) {
        translation = item.translations.find(
          (t) => t.languages_code === "en-US"
        );
      }
      translation = translation || item.translations[0] || {};

      return {
        id: item.id,
        name: translation.name || item.name || "Unknown",
        role: translation.role || "Unknown",
        bio: translation.bio || "",
        description: translation.description || "",
        avatar: translation.avatar || "/team/default.jpg",
        skills: safeJsonParse(translation.skills, []),
        sologan: translation.sologan || "",
        achievements: parseAchievements(translation.achievements),
      };
    });

    return {
      teamMembers,
      hero_section_title: fallback.hero_section_title,
      title: fallback.title,
      subtitle: fallback.subtitle,
      showMemberIntro: result.data[0]?.showMenberIntro || "false",
    };
  } catch {
    return {
      teamMembers: [
        {
          id: 1,
          name:
            lang === "vi-VN"
              ? "Mr. Chen"
              : lang === "zh-CN"
              ? "陈先生"
              : "Mr. Chen",
          role:
            lang === "vi-VN"
              ? "Giám đốc Điều hành & Nhà sáng lập"
              : lang === "zh-CN"
              ? "首席执行官兼创始人"
              : "CEO & Founder",
          bio:
            lang === "vi-VN"
              ? "Gần đây, hành trình của chúng tôi đã dẫn đến một dự án đột phá có tên là Maxima, được thành lập bởi Ông Chen, một người kỳ cựu với hơn 15 năm kinh nghiệm trong ngành môi giới."
              : lang === "zh-CN"
              ? "最近，我们的旅程引领我们创建了一个名为Maxima的开创性项目，由拥有超过15年经纪行业经验的陈先生创立。"
              : "Recently, our journey led us to a groundbreaking project called Maxima, founded by Mr. Chen, a veteran with over 15 years of experience in the broker industry.",
          description:
            lang === "vi-VN"
              ? "Ông Chen là một chuyên gia dày dạn kinh nghiệm trong ngành tài chính, đặc biệt là giao dịch forex, với 16 năm kinh nghiệm trong ngành."
              : lang === "zh-CN"
              ? "陈先生是金融行业尤其是外汇交易领域的资深专业人士，拥有16年的行业经验。"
              : "Mr. Chen is a seasoned professional in the financial industry, especially in forex trading, with 16 years of experience in the industry.",
          avatar: "/team/chen.jpg",
          skills: ["Leadership", "Strategy", "Investment"],
          sologan:
            lang === "vi-VN"
              ? "Tôi đam mê tạo ra các hệ thống không chỉ tạo ra lợi nhuận mà còn trao quyền cho các nhà giao dịch với các công cụ và hiểu biết tốt hơn. Thành công đối với tôi là thấy khách hàng đạt được mục tiêu tài chính của họ."
              : lang === "zh-CN"
              ? "我热衷于创建不仅能产生利润，还能为交易者提供更好工具和洞察力的系统。对我来说，成功意味着看到我们的客户实现他们的财务目标。"
              : "I'm passionate about creating systems that not only generate profits but also empower traders with better tools and insights. Success for me means seeing our clients achieve their financial goals.",
          achievements: [
            lang === "vi-VN"
              ? "Dẫn dắt phát triển thuật toán giao dịch độc quyền"
              : lang === "zh-CN"
              ? "领导开发我们的专有交易算法"
              : "Led the development of our proprietary trading algorithm",
            lang === "vi-VN"
              ? "Tăng tỷ lệ hài lòng của khách hàng lên 45% mỗi năm"
              : lang === "zh-CN"
              ? "客户满意度逐年提高45%"
              : "Increased client satisfaction scores by 45% year-over-year",
            lang === "vi-VN"
              ? "Diễn giả nổi bật tại Hội nghị Tài chính Quốc tế 2024"
              : lang === "zh-CN"
              ? "2024年国际金融峰会特邀演讲者"
              : "Featured speaker at the 2024 International Finance Summit",
            lang === "vi-VN"
              ? "Tác giả được xuất bản trên các tạp chí hàng đầu ngành"
              : lang === "zh-CN"
              ? "在领先行业期刊上发表的作者"
              : "Published author in leading industry journals",
          ],
        },
        {
          id: 2,
          name:
            lang === "vi-VN"
              ? "Morgan"
              : lang === "zh-CN"
              ? "摩根"
              : "Morgan",
          role:
            lang === "vi-VN"
              ? "Giám đốc Công nghệ"
              : lang === "zh-CN"
              ? "首席技术官"
              : "Chief Technology Officer",
          bio:
            lang === "vi-VN"
              ? "Morgan là một chuyên gia dày dạn kinh nghiệm trong ngành tài chính, đặc biệt là giao dịch forex, với 16 năm kinh nghiệm trong ngành."
              : lang === "zh-CN"
              ? "摩根是金融行业尤其是外汇交易领域的资深专业人士，拥有16年的行业经验。"
              : "Morgan is a seasoned professional in the financial industry, especially in forex trading, with 16 years of experience in the industry.",
          description:
            lang === "vi-VN"
              ? "Ông đã đảm nhiệm các vị trí quan trọng như Giám đốc Tiếp thị (CMO) và Giám đốc Điều hành (CEO) tại nhiều công ty, thể hiện khả năng lãnh đạo và lập kế hoạch chiến lược xuất sắc."
              : lang === "zh-CN"
              ? "他曾在多家公司担任首席营销官（CMO）和首席执行官（CEO）等关键职位，展现出卓越的领导力和战略规划能力。"
              : "He has held key positions such as Chief Marketing Officer (CMO) and Chief Executive Officer (CEO) in many companies, demonstrating excellent leadership and strategic planning abilities.",
          avatar: "/team/morgan.jpg",
          skills: ["AI", "Software Architecture", "Blockchain"],
          sologan:
            lang === "vi-VN"
              ? "Tôi đam mê tạo ra các hệ thống không chỉ tạo ra lợi nhuận mà còn trao quyền cho các nhà giao dịch với các công cụ và hiểu biết tốt hơn. Thành công đối với tôi là thấy khách hàng đạt được mục tiêu tài chính của họ."
              : lang === "zh-CN"
              ? "我热衷于创建不仅能产生利润，还能为交易者提供更好工具和洞察力的系统。对我来说，成功意味着看到我们的客户实现他们的财务目标。"
              : "I'm passionate about creating systems that not only generate profits but also empower traders with better tools and insights. Success for me means seeing our clients achieve their financial goals.",
          achievements: [
            lang === "vi-VN"
              ? "Dẫn dắt phát triển thuật toán giao dịch độc quyền"
              : lang === "zh-CN"
              ? "领导开发我们的专有交易算法"
              : "Led the development of our proprietary trading algorithm",
            lang === "vi-VN"
              ? "Tăng tỷ lệ hài lòng của khách hàng lên 45% mỗi năm"
              : lang === "zh-CN"
              ? "客户满意度逐年提高45%"
              : "Increased client satisfaction scores by 45% year-over-year",
            lang === "vi-VN"
              ? "Diễn giả nổi bật tại Hội nghị Tài chính Quốc tế 2024"
              : lang === "zh-CN"
              ? "2024年国际金融峰会特邀演讲者"
              : "Featured speaker at the 2024 International Finance Summit",
            lang === "vi-VN"
              ? "Tác giả được xuất bản trên các tạp chí hàng đầu ngành"
              : lang === "zh-CN"
              ? "在领先行业期刊上发表的作者"
              : "Published author in leading industry journals",
          ],
        },
      ],
      hero_section_title: fallback.hero_section_title,
      title: fallback.title,
      subtitle: fallback.subtitle,
      showMemberIntro: "false",
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
  const [isHidden, setIsHidden] = useState<string>("false");
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
                  className={`font-bold uppercase tracking-wider text-sm ${
                    mytheme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {heroSectionTitle}
                </span>
                <div className="h-1 w-10 bg-yellow-600 rounded ml-2"></div>
              </div>
              <h1
                className={`text-4xl md:text-5xl font-bold pb-6 ${
                  mytheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {title}
              </h1>
              <p
                className={`text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-8`}
              >
                {subtitle}
              </p>
            </div>

            <div className="relative px-4">
              <button
                onClick={goToPrev}
                className="absolute left-0 cursor-pointer top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-2 md:p-3 shadow-lg text-yellow-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={
                  locale === "vi"
                    ? "Thành viên trước"
                    : locale === "zh"
                    ? "上一成员"
                    : "Previous team member"
                }
              >
                <svg
                  className={`w-6 h-6 ${
                    mytheme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative w-full h-full">
                  {teamMembers.map((member, index) => {
                    const position = getSlidePosition(index);
                    return (
                      <div
                        key={member.id}
                        className={`absolute transition-all duration-500 ease-in-out top-0 w-full max-w-md mx-auto 
                          ${
                            position === "center"
                              ? "left-1/2 -translate-x-1/2 z-10 opacity-100 scale-100"
                              : ""
                          } 
                          ${
                            position === "left"
                              ? "left-0 -translate-x-1/2 z-0 opacity-40 scale-85"
                              : ""
                          } 
                          ${
                            position === "right"
                              ? "right-0 translate-x-1/2 z-0 opacity-40 scale-85"
                              : ""
                          } 
                          ${position === "hidden" ? "opacity-0 scale-75 -z-10" : ""}`}
                      >
                        <div
                          className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform 
                            ${position === "center" ? "hover:scale-105" : ""} 
                            border border-gray-100 dark:border-gray-700 h-full`}
                        >
                          <div className="relative h-80 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                            <div className="h-full w-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              <Image
                                src={`https://admin.maximagoldhedging.com/assets/${member.avatar}`}
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
                            <div className="flex flex-wrap gap-2 mb-4">
                              {member.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-yellow-600 dark:text-blue-400 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 pb-4 line-clamp-3">
                              {member.bio}
                            </p>
                            <button
                              onClick={() => setActiveTeamMember(member)}
                              className="w-full cursor-pointer py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
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
                                viewBox="0 0 24 24"
                              >
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
                }
              >
                <svg
                  className={`w-6 h-6 ${
                    mytheme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentIndex
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

            <TeamModal
              activeTeamMember={activeTeamMember}
              setActiveTeamMember={setActiveTeamMember}
              locale={locale}
              mytheme={mytheme}
            />
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