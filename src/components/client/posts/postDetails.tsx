"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ConfigProvider,
  theme as antdTheme,
  Typography,
  Card,
  Tag,
  Button,
  Avatar,
  Skeleton,
  Divider,
  Dropdown,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  ShareAltOutlined,
  CopyOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";
import { IMAGES } from "@/constants/client/theme";
import { NextPage } from "next";
import Head from "next/head";
import Posts from "@/components/client/about/posts";

const { Text } = Typography;

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
  content: string;
  published: boolean;
  media: { url: string }[];
  category: string[];
  author: string;
  authorAvatar?: string;
  readTime: number;
  publishDate: string;
  featured?: boolean;
  liked?: boolean;
  viewCount?: number;
  tags?: string[];
  relatedPosts?: RelatedPost[];
}

interface RelatedPost {
  id: string;
  title: string;
  image: string;
  category: string;
}

interface Category {
  key: string;
  name: string;
}

interface ApiResponse {
  id: number;
  translations: Translation[];
  status: string;
}

interface RootState {
  theme: {
    mytheme: string;
  };
}

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

async function getPostDetail(
  locale: string,
  postId: string
): Promise<{ post: Post | null; categories: Category[] }> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const categories: Category[] = [
    {
      key: "investment",
      name:
        lang === "vi-VN" ? "Đầu tư" : lang === "zh-CN" ? "投资" : "Investment",
    },
    {
      key: "finance",
      name:
        lang === "vi-VN" ? "Tài chính" : lang === "zh-CN" ? "金融" : "Finance",
    },
    {
      key: "analysis",
      name:
        lang === "vi-VN" ? "Phân tích" : lang === "zh-CN" ? "分析" : "Analysis",
    },
    {
      key: "crypto",
      name:
        lang === "vi-VN"
          ? "Tiền ảo"
          : lang === "zh-CN"
          ? "加密货币"
          : "Cryptocurrency",
    },
    {
      key: "blockchain",
      name:
        lang === "vi-VN"
          ? "Blockchain"
          : lang === "zh-CN"
          ? "区块链"
          : "Blockchain",
    },
    {
      key: "affiliate",
      name:
        lang === "vi-VN"
          ? "Affiliate"
          : lang === "zh-CN"
          ? "联盟营销"
          : "Affiliate",
    },
  ];

  try {
    const [groupId, indexStr] = postId.split("-");
    const postIndex = parseInt(indexStr, 10);

    if (isNaN(postIndex)) {
      throw new Error("Invalid post ID format");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/posts?lang=${lang}&fields=*,translations.*,category`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const result = await response.json();
    const data: ApiResponse[] = Array.isArray(result.data)
      ? result.data
      : [result.data];

    let selectedPost: Post | null = null;

    for (const item of data) {
      const translation = item.translations.find(
        (t) => t.languages_code === lang
      );
      if (!translation) continue;

      const titleKey = `post_title_${postIndex}` as keyof Translation;
      const descriptionKey =
        `post_description_${postIndex}` as keyof Translation;
      const contentKey = `post_content_${postIndex}` as keyof Translation;
      const imageKey = `post_image_${postIndex}` as keyof Translation;
      const authorKey = `author_${postIndex}` as keyof Translation;
      const categoryKey = `category_${postIndex}` as keyof Translation;

      if (translation[titleKey] && translation[descriptionKey]) {
        let categoriesList: string[] = ["investment"];
        try {
          const parsedCategories: string[] = JSON.parse(
            translation[categoryKey] as string
          );
          if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
            categoriesList = parsedCategories;
          }
        } catch (error) {
          console.warn(
            `Failed to parse category for post ${postIndex}:`,
            error
          );
        }

        selectedPost = {
          id: postId,
          title: translation[titleKey] as string,
          description: translation[descriptionKey] as string,
          content:
            (translation[contentKey] as string) ||
            "<p>Content not available.</p>",
          published: item.status === "published",
          media: translation[imageKey]
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${translation[imageKey]}`,
                },
              ]
            : [{ url: "/placeholder.jpg" }],
          category: categoriesList,
          author: (translation[authorKey] as string) || "The Maxima",
          authorAvatar: IMAGES.LogoMaxima.src,
          readTime: 8,
          publishDate: "2025-04-15",
          featured: postIndex === 1,
          liked: false,
          viewCount: 3842,
          tags: [
            "investment",
            "portfolio management",
            "cryptocurrency",
            "finance",
            "risk management",
          ],
          relatedPosts: [
            {
              id: `${groupId}-${
                (postIndex % 6) + 1 === postIndex
                  ? (postIndex % 6) + 2
                  : (postIndex % 6) + 1
              }`,
              title:
                lang === "vi-VN"
                  ? "Chiến lược đầu tư dài hạn"
                  : lang === "zh-CN"
                  ? "长期投资策略"
                  : "Long-term Investment Strategies",
              image:
                "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
              category: "investment",
            },
            {
              id: `${groupId}-${
                (postIndex % 6) + 2 === postIndex || (postIndex % 6) + 2 > 6
                  ? 1
                  : (postIndex % 6) + 2
              }`,
              title:
                lang === "vi-VN"
                  ? "Phân tích thị trường tiền điện tử"
                  : lang === "zh-CN"
                  ? "加密货币市场分析"
                  : "Cryptocurrency Market Analysis",
              image:
                "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
              category: "analysis",
            },
            {
              id: `${groupId}-${
                (postIndex % 6) + 3 === postIndex || (postIndex % 6) + 3 > 6
                  ? 2
                  : (postIndex % 6) + 3
              }`,
              title:
                lang === "vi-VN"
                  ? "Tài chính cá nhân cho người mới bắt đầu"
                  : lang === "zh-CN"
                  ? "个人理财入门"
                  : "Personal Finance for Beginners",
              image:
                "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6",
              category: "finance",
            },
          ],
        };
        break;
      }
    }

    return { post: selectedPost, categories };
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return { post: null, categories };
  }
}

interface PostPageProps {
  params: { postId: string };
}

const BlogPostDetail: NextPage<PostPageProps> = ({ params }) => {
  const { postId } = params;
  const locale = useLocale();
  const router = useRouter();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    back: locale === "vi" ? "Quay lại" : locale === "zh" ? "返回" : "Back",
    relatedPosts:
      locale === "vi"
        ? "Bài viết liên quan"
        : locale === "zh"
        ? "相关文章"
        : "Related Posts",
    errorTitle:
      locale === "vi"
        ? "Đã xảy ra lỗi"
        : locale === "zh"
        ? "发生错误"
        : "An error occurred",
    postNotFound:
      locale === "vi"
        ? "Không tìm thấy bài viết"
        : locale === "zh"
        ? "未找到文章"
        : "Post not found",
    views: locale === "vi" ? "lượt xem" : locale === "zh" ? "次查看" : "views",
    minRead:
      locale === "vi" ? "phút đọc" : locale === "zh" ? "分钟阅读" : "min read",
    like: locale === "vi" ? "Thích" : locale === "zh" ? "喜欢" : "Like",
    share: locale === "vi" ? "Chia sẻ" : locale === "zh" ? "分享" : "Share",
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const { post, categories } = await getPostDetail(locale, postId);
        if (post) {
          setPost(post);
          setCategories(categories);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPostDetail();
  }, [postId, locale]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/${locale}/posts/${postId}`;
      navigator.clipboard.writeText(url);
    }
  };

  const socialOptions = [
    {
      icon: <CopyOutlined />,
      color: "#6B7280",
      title: "Copy Link",
      onClick: handleCopyLink,
    },
  ];

  const themeConfig = {
    token: {
      colorPrimary: mytheme === "dark" ? "#FFC800" : "#F0B200",
      borderRadius: 12,
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      colorText: mytheme === "dark" ? "#E0E0E0" : "#1F2A44",
      colorBgBase: mytheme === "dark" ? "#1A1A1A" : "#F9FAFB",
    },
    algorithm:
      mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const renderLoading = () => (
    <div className="p-6 max-w-7xl mx-auto">
      <Skeleton.Image className="w-full h-48 rounded-xl mb-4" active />
      <Skeleton active paragraph={{ rows: 10 }} title={{ width: "80%" }} />
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen">
      <div
        className={`text-3xl mb-4 ${
          mytheme === "dark" ? "text-red-400" : "text-red-500"
        }`}>
        ⚠️
      </div>
      <h3 className="text-xl font-medium mb-2">
        {error === "Post not found"
          ? translations.postNotFound
          : translations.errorTitle}
      </h3>
      <p
        className={`${mytheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        {error !== "Post not found" && error}
      </p>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        className="mt-4 rounded-full"
        onClick={() => router.push("/posts")}>
        {translations.back}
      </Button>
    </div>
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <Head>
        <title>{post ? post.title : "Blog Post | The Maxima"}</title>
        <meta
          name="description"
          content={
            post
              ? post.description
              : "Read the latest blog post from The Maxima."
          }
        />
        <meta
          name="keywords"
          content={post ? post.tags?.join(", ") : "blog, finance, investment"}
        />
        <meta property="og:title" content={post ? post.title : "Blog Post"} />
        <meta
          property="og:description"
          content={
            post
              ? post.description
              : "Read the latest blog post from The Maxima."
          }
        />
        <meta
          property="og:image"
          content={post ? post.media[0].url : "/placeholder.jpg"}
        />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <motion.div
        className={`min-h-screen  ${
          mytheme === "light"
            ? "bg-gradient-to-b from-slate-50 to-gray-100"
            : "bg-gradient-to-b from-gray-900 to-gray-950"
        }`}
        variants={pageVariants}
        initial="hidden"
        animate="visible">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {loading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : post ? (
            <>
              <div
                className="w-full mt-3 h-80 bg-center bg-cover relative rounded-xl"
                style={{
                  backgroundImage: `url(${post.media[0].url})`,
                  backgroundPosition: "center 30%",
                }}>
                <div
                  className={`absolute inset-0 rounded-xl ${
                    mytheme === "light" ? "bg-black/50" : "bg-black/70"
                  }`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                  <motion.div variants={itemVariants}>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category.map((catKey) => {
                        const category = categories.find(
                          (c) => c.key === catKey
                        );
                        return category ? (
                          <Tag
                            key={catKey}
                            color={mytheme === "light" ? "#F0B200" : "#FFC800"}
                            className="px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                            {category.name}
                          </Tag>
                        ) : null;
                      })}
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                      {post.title}
                    </h1>
                    <p className="text-base sm:text-lg font-bold text-gray-200 mb-4 max-w-3xl">
                      {post.description}
                    </p>
                    <div className="flex items-center text-white">
                      <Avatar
                        src={post.authorAvatar}
                        size={{ xs: 46, sm: 56, md: 68 }}
                        icon={!post.authorAvatar ? <UserOutlined /> : undefined}
                        className="border-2 border-white"
                      />
                      <div className="ml-3">
                        <Text className="font-bold block text-white">
                          <span className="text-sm sm:text-base md:text-lg text-white">
                            {post.author}
                          </span>
                        </Text>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="pt-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-8">
                    <Card
                      className={`shadow-md border-0 rounded-xl overflow-hidden mb-6 ${
                        mytheme === "light" ? "bg-white" : "bg-gray-800/90"
                      }`}
                      styles={{ body: { padding: "24px" } }}>
                      <div
                        className={`post-content prose max-w-none ${
                          mytheme === "dark" ? "prose-invert" : ""
                        }`}
                        style={{ lineHeight: "1.8", fontSize: "1.05rem" }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-4">
                            <span
                              className={`font-bold text-sm ${
                                mytheme === "light"
                                  ? "text-gray-800"
                                  : "text-white"
                              }`}>
                              The Maxima
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Divider type="vertical" className="h-6" />
                            <Dropdown
                              menu={{
                                items: socialOptions.map((option, index) => ({
                                  key: index,
                                  label: (
                                    <Button
                                      type="text"
                                      icon={option.icon}
                                      onClick={option.onClick}
                                      style={{ color: option.color }}>
                                      <span
                                        className={`${
                                          mytheme === "light"
                                            ? "text-gray-800"
                                            : "text-white"
                                        }`}>
                                        {option.title}
                                      </span>
                                    </Button>
                                  ),
                                })),
                              }}>
                              <Button
                                type="text"
                                icon={<ShareAltOutlined />}
                                className="hover:text-blue-500">
                                <span
                                  className={`${
                                    mytheme === "light"
                                      ? "text-gray-800"
                                      : "text-white"
                                  }`}>
                                  {translations.share}
                                </span>
                              </Button>
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="md:col-span-4">
                    <Card
                      className={`shadow-md border-0 rounded-xl mb-6 ${
                        mytheme === "light" ? "bg-white" : "bg-gray-800/90"
                      }`}
                      styles={{ body: { padding: "24px" } }}>
                      <div className="flex items-center flex-wrap gap-2">
                        <TagsOutlined className="mr-2 text-lg" />
                        {post.tags?.map((tag, index) => (
                          <Tag
                            key={index}
                            className={`rounded-full px-3 py-1 text-sm capitalize cursor-pointer transition-all ${
                              mytheme === "light"
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <Posts />
      </motion.div>
    </ConfigProvider>
  );
};

export default BlogPostDetail;
