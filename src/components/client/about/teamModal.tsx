"use client";

import React from "react";
import { Modal } from "antd";
import Image from "next/image";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

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

interface TeamModalProps {
  activeTeamMember: TeamMember | null;
  setActiveTeamMember: (member: TeamMember | null) => void;
  locale: string;
  mytheme: string;
}

export default function TeamModal({
  activeTeamMember,
  setActiveTeamMember,
  locale,
  mytheme,
}: TeamModalProps) {
  return (
    <Modal
      open={!!activeTeamMember}
      onCancel={() => setActiveTeamMember(null)}
      footer={null}
      closable={false}
      centered
      width="90%"
      style={{ maxWidth: "1240px" }}
      className="team-member-modal"
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl w-full overflow-hidden relative animate-scale-in`}
        style={{ animation: "scale-in 0.3s ease-out forwards" }}
      >
        <button
          onClick={() => setActiveTeamMember(null)}
          className={`absolute md:top-1 top-2 cursor-pointer hover:bg-gray-100 right-3 z-30 bg-white/80 dark:bg-gray-100/10 rounded-full p-1 ${
            mytheme === "dark"
              ? "dark:hover:bg-gray-100/20"
              : "hover:bg-gray-100"
          }`}
          aria-label={
            locale === "vi"
              ? "Đóng hồ sơ"
              : locale === "zh"
              ? "关闭简介"
              : "Close profile"
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
                    src={`https://admin.maximagoldhedging.com/assets/${activeTeamMember?.avatar}`}
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
                    viewBox="0 0 24 24"
                  >
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
                {activeTeamMember?.description
                  ? parse(DOMPurify.sanitize(activeTeamMember.description))
                  : ""}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-yellow-600 dark:text-blue-400 p-2 rounded-full mr-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                    />
                  </svg>
                </span>
                {locale === "vi"
                  ? "Thành tựu nổi bật"
                  : locale === "zh"
                  ? "主要成就"
                  : "Key Achievements"}
              </h2>
              <ul className="space-y-3 pl-4">
                {activeTeamMember?.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 dark:text-green-400 mr-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-8">
              <div className="relative p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <svg
                  className="absolute top-3 left-3 w-8 h-8 text-yellow-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432 .917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433 .917-3.996 3.638-3.996 5.849h3.411v10h-9.411z" />
                </svg>
                <div className="ml-10">
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                    {activeTeamMember?.sologan}
                  </p>
                  <p className="text-yellow-600 dark:text-blue-400 font-medium">
                    — {activeTeamMember?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setActiveTeamMember(null)}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
              >
                <span className="text-white">
                  {locale === "vi"
                    ? "Quay lại Đội ngũ"
                    : locale === "zh"
                    ? "返回团队"
                    : "Return to Team"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
