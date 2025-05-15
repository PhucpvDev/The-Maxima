"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import Image from "next/image";

interface Translation {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  posts_id: number;
  languages_code: string;
  post_title_1: string;
  post_description_1: string;
  post_content_1: string;
  post_image_1: string;
  post_title_2: string;
  post_description_2: string;
  post_content_2: string;
  post_image_2: string;
  post_title_3: string;
  post_description_3: string;
  post_content_3: string;
  post_image_3: string;
  post_title_4: string;
  post_description_4: string;
  post_content_4: string;
  post_image_4: string;
  post_title_5: string;
  post_description_5: string;
  post_content_5: string;
  post_image_5: string;
  post_title_6: string;
  post_description_6: string;
  post_content_6: string;
  post_image_6: string;
  author_1: string;
  author_2: string;
  author_3: string;
  author_4: string;
  author_5: string;
  author_6: string;
  category_1: string;
  category_2: string;
  category_3: string;
  category_4: string;
  category_5: string;
  category_6: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  published: boolean;
  media: { url: string }[];
  author: string;
}

interface ApiResponse {
  id: number;
  status: string;
  translations: Translation[];
  category: string;
}

interface FallbackPost {
  id: string;
  title: string;
  description: string;
  published: boolean;
  media: { url: string }[];
  author: string;
}

const buttonTranslations: Record<
  string,
  { viewDetails: string; viewMore: string }
> = {
  "en-US": {
    viewDetails: "View Details",
    viewMore: "View More",
  },
  "vi-VN": {
    viewDetails: "Xem chi tiết",
    viewMore: "Xem thêm",
  },
  "zh-CN": {
    viewDetails: "查看详情",
    viewMore: "查看更多",
  },
};

const translationFallbacks: Record<string, FallbackPost[]> = {};

async function getPosts(
  locale: string
): Promise<{ posts: Post[]; title: string }> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const fallback = translationFallbacks[lang] || translationFallbacks["en-US"];
  let title =
    lang === "vi-VN"
      ? "Tin tức & Blog"
      : lang === "zh-CN"
      ? "新闻与博客"
      : "Blog & News";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/posts?lang=${lang}&fields=*,translations.*,category`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const result = await response.json();

    const data: ApiResponse[] = Array.isArray(result.data)
      ? result.data
      : [result.data];

    const posts: Post[] = data.flatMap((item) => {
      const translation = item.translations.find(
        (t) => t.languages_code === lang
      );
      if (!translation) {
        return [];
      }

      title = translation.title || title;

      const postIndices = [1, 2, 3, 4, 5, 6];

      return postIndices.map((index) => {
        const titleKey = `post_title_${index}` as keyof Translation;
        const descriptionKey = `post_description_${index}` as keyof Translation;
        const imageKey = `post_image_${index}` as keyof Translation;
        const authorKey = `author_${index}` as keyof Translation;

        const post = {
          id: `${item.id}-${index}`,
          title: translation[titleKey] as string,
          description: translation[descriptionKey] as string,
          published: item.status === "published",
          media: translation[imageKey]
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${translation[imageKey]}`,
                },
              ]
            : [{ url: "/placeholder.jpg" }],
          author: (translation[authorKey] as string) || "Unknown Author",
        };

        return post;
      });
    });

    const filteredPosts = posts.filter(
      (post) => post.title && post.description
    );

    return {
      posts: filteredPosts.slice(0, 6),
      title,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: fallback,
      title,
    };
  }
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("Blog & News");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const locale = useLocale();
  const router = useRouter();

  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const { viewDetails, viewMore } =
    buttonTranslations[lang] || buttonTranslations["en-US"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: fetchedPosts, title: fetchedTitle } = await getPosts(
          locale
        );
        setPosts(fetchedPosts);
        setTitle(fetchedTitle);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [locale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme || "light");
  }, [mytheme]);

  const themeConfig = {
    token: {
      colorPrimary: "#FFC800",
    },
    algorithm:
      mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const handleViewDetails = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          mytheme === "light" ? "text-gray-800" : "text-gray-200"
        }`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          mytheme === "light" ? "text-red-500" : "text-red-400"
        }`}>
        Error: {error}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.01, 0.05, 0.95],
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: custom * 0.15,
        duration: 0.5,
      },
    }),
  };

  const getImageUrl = (post: Post): string => {
    if (!post || !post.media) return "/placeholder.jpg";
    if (Array.isArray(post.media) && post.media.length > 0) {
      return post.media[0].url;
    }
    return "/placeholder.jpg";
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <motion.div
        className={`relative overflow-hidden py-12 md:py-18 ${
          mytheme === "light"
            ? "bg-gradient-to-b from-slate-50 to-gray-100"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto z-10 relative px-4">
          <motion.div className="mb-8 relative overflow-hidden">
            <motion.div
              className={`absolute -inset-1 rounded-lg blur-xl opacity-30`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1 }}
            />
            <motion.p
              className={`relative text-4xl pb-10 font-bold text-center py-3 mx-auto bg-clip-text text-transparent ${
                mytheme === "light"
                  ? "bg-gradient-to-r from-[#1a1a1a] to-[#555555]"
                  : "bg-gradient-to-r from-white to-[#FFC800]"
              }`}
              variants={textVariants}
              custom={0}>
              {title}
            </motion.p>
            <div className="flex justify-center items-center gap-3 -mt-6 mb-3">
              <motion.div
                className="h-0.5 w-12 bg-gradient-to-r from-gray-600 to-transparent rounded"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-yellow-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
              <motion.div
                className="h-0.5 w-12 bg-gradient-to-l from-gray-600 to-transparent rounded"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
            </div>
          </motion.div>

          {posts.length === 0 ? (
            <div
              className={`flex justify-center items-center h-64 ${
                mytheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}>
              No posts available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts[0] && (
                <motion.div
                  className="md:col-span-1 overflow-hidden cursor-pointer"
                  variants={childVariants}
                  onClick={() => handleViewDetails(posts[0].id)}>
                  <Image
                    src={getImageUrl(posts[0])}
                    alt={posts[0]?.title || ""}
                    width={400}
                    height={192}
                    className="w-full object-cover h-48 rounded-xl shadow-md"
                  />
                  <div className="pt-4">
                    <motion.h2
                      className={`text-lg font-bold ${
                        mytheme === "light" ? "text-gray-900" : "text-gray-100"
                      } mb-2`}
                      variants={textVariants}
                      custom={1}>
                      {posts[0]?.title}
                    </motion.h2>
                    <motion.p
                      className={`text-[15px] ${
                        mytheme === "light" ? "text-gray-700" : "text-gray-300"
                      } mb-2`}
                      variants={textVariants}
                      custom={2}>
                      {posts[0]?.description?.substring(0, 100)}...
                    </motion.p>
                    <motion.p
                      className={`text-[14px] ${
                        mytheme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                      variants={textVariants}
                      custom={3}>
                      {posts[0]?.author}
                    </motion.p>
                    <div className="p-1 rounded-lg text-white">
                      <motion.button
                        className={`px-5 py-1.5 cursor-pointer bg-yellow-600 ${
                          mytheme === "light"
                            ? "from-blue-500 to-indigo-600"
                            : "bg-yellow-600"
                        } text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(posts[0].id)}>
                        <span className="text-white">{viewDetails}</span>
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {posts[1] && (
                <motion.div
                  className="md:col-span-1 overflow-hidden cursor-pointer"  
                  variants={childVariants}
                  onClick={() => handleViewDetails(posts[1].id)}
                  >
                  <Image
                    src={getImageUrl(posts[1])}
                    alt={posts[1]?.title || ""}
                    width={400}
                    height={192}
                    className="w-full object-cover h-48 rounded-xl shadow-md"
                  />
                  <div className="pt-4">
                    <motion.p
                      className={`text-lg font-medium ${
                        mytheme === "light" ? "text-gray-900" : "text-gray-100"
                      } mb-2`}
                      variants={textVariants}
                      custom={1}>
                      {posts[1]?.title}
                    </motion.p>
                    <motion.p
                      className={`text-[15px] ${
                        mytheme === "light" ? "text-gray-700" : "text-gray-300"
                      } mb-2`}
                      variants={textVariants}
                      custom={2}>
                      {posts[1]?.description?.substring(0, 100)}...
                    </motion.p>
                    <motion.p
                      className={`text-[14px] ${
                        mytheme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                      variants={textVariants}
                      custom={3}>
                      {posts[1]?.author}
                    </motion.p>
                    <div className="p-1 rounded-lg text-white">
                      <motion.button
                        className={`px-5 py-1.5 cursor-pointer bg-yellow-600 ${
                          mytheme === "light"
                            ? "from-blue-500 to-indigo-600"
                            : "bg-yellow-600"
                        } text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(posts[1].id)}>
                        <span>{viewDetails}</span>
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {posts.length >= 2 && (
                <motion.div className="md:col-span-1" variants={childVariants}>
                  {posts.slice(2, 6).map((post, index) => (
                    <motion.div
                      key={post.id || index}
                      className="rounded overflow-hidden mb-4 flex gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 transition-colors rounded-lg"
                      variants={childVariants}
                      onClick={() => handleViewDetails(post.id)}>
                      <div className="w-4/6">
                        <Image
                          src={getImageUrl(post)}
                          alt={post.title}
                          width={400}
                          height={192}
                          className="w-full h-22 object-cover rounded-xl shadow-md"
                        />
                      </div>
                      <div className="w-3/5">
                        <motion.p
                          className={`text-[15px] font-bold line-clamp-3 ${
                            mytheme === "light"
                              ? "text-gray-800"
                              : "text-gray-200"
                          }`}
                          variants={textVariants}
                          custom={1}>
                          {post.title}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {posts.length > 0 && (
            <div className="p-1 mt-10 flex justify-center text-center mx-auto rounded-lg text-white">
              <motion.button
                className={`px-15 py-3 cursor-pointer bg-yellow-600 ${
                  mytheme === "light"
                    ? "from-blue-500 to-indigo-600"
                    : "bg-yellow-600 "
                } text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${locale}/posts`)}>
                <span>{viewMore}</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </ConfigProvider>
  );
}
