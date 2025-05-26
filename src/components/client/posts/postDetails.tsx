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
  post_slug: string;
  languages_code: string;
  title: string;
  description: string;
  content: string;
  image: string;
  categories?: number[];
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

interface CategoryTranslation {
  languages_code: string;
  title: string;
}

interface Category {
  key: string; // slug from post_categories
  name: string; // translated title from post_categories
}

interface ApiResponse {
  slug: string;
  title: string;
  translations: Translation[];
  status?: string;
}

interface PostCategory {
  slug: string;
  title: string;
  translations: CategoryTranslation[];
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

// Fetch categories from post_categories with translations
async function fetchCategories(locale: string): Promise<Category[]> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://admin.maximagoldhedging.com/items/post_categories?lang=${locale}&fields=slug,title,translations.*`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data.map((cat: PostCategory) => {
      const translation = cat.translations?.find(
        (t: CategoryTranslation) => t.languages_code === lang
      );
      return {
        key: cat.slug,
        name: translation?.title || cat.title, // Use translated title if available, otherwise fallback to default title
      };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [
      { key: "updates", name: "Updates" },
      { key: "virtual-currency", name: "Virtual Currency" },
      { key: "financial-investment", name: "Financial Investment" },
    ];
  }
}

async function getPostDetail(
  locale: string,
  postSlug: string
): Promise<{ post: Post | null; categories: Category[] }> {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const categories = await fetchCategories(locale);

  try {
    const response = await fetch(
      `https://admin.maximagoldhedging.com/items/post?filter[slug][_eq]=${postSlug}&fields=*,translations.*&lang=${lang}`,
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
      : [result.data].filter(Boolean);

    let selectedPost: Post | null = null;

    for (const item of data) {
      if (item.slug !== postSlug) continue;

      const translation = item.translations.find(
        (t) => t.languages_code === lang
      );
      if (!translation) {
        console.warn(`No translation found for language: ${lang}`);
        continue;
      }

      const categoryKeys = Array.isArray(translation.categories)
        ? [...new Set(translation.categories.map((catId) => {
            switch (catId) {
              case 8:
                return "updates";
              case 7:
                return "virtual-currency";
              case 6:
                return "financial-investment";
              default:
                return "updates";
            }
          }))] 
        : ["updates"];

      selectedPost = {
        id: item.slug,
        title: translation.title,
        description: translation.description,
        content: translation.content || "<p>Content not available.</p>",
        published: item.status === "published" || true,
        media: translation.image
          ? [
              {
                url: `https://admin.maximagoldhedging.com/assets/${translation.image}`,
              },
            ]
          : [{ url: "/placeholder.jpg" }],
        category: categoryKeys,
        author: "The Maxima",
        authorAvatar: IMAGES.LogoMaxima.src,
        readTime: 8,
        publishDate: "2025-04-15",
        featured: true,
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
            id: "e2cc9905-81a0-4ee3-9cf6-11d66fff88c8",
            title:
              lang === "vi-VN"
                ? "Tiêu đề mẫu số 1"
                : lang === "zh-CN"
                ? "样本标题 #1"
                : "Sample Title #1",
            image:
              "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
            category: "updates",
          },
          {
            id: "45724a92-e382-4449-996b-d78f7489a1df",
            title:
              lang === "vi-VN"
                ? "Bài viết mẫu số 2"
                : lang === "zh-CN"
                ? "示例文章2"
                : "Sample essay number 2",
            image:
              "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
            category: "updates",
          },
          {
            id: "e2cc9905-81a0-4ee3-9cf6-11d66fff88c8",
            title:
              lang === "vi-VN"
                ? "Tài chính cá nhân cho người mới bắt đầu"
                : lang === "zh-CN"
                ? "个人理财入门"
                : "Personal Finance for Beginners",
            image:
              "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6",
            category: "virtual-currency",
          },
        ],
      };
      break;
    }

    if (!selectedPost) {
      console.warn("No post found for slug:", postSlug);
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
          content={post ? post.category.join(", ") : "blog, finance, investment"}
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
        className={`min-h-screen ${
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
                            <Divider type="vertical" />
                            <Dropdown
                              menu={{
                                items: socialOptions.map((option, index) => ({
                                  key: index,
                                  label: (
                                    <Button
                                      type="text"
                                      className="hover:text-gray-400"
                                      icon={option.icon}
                                      onClick={option.onClick}>
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
                                className="hover:text-blue-500"
                                icon={<ShareAltOutlined />}>
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
                        {post.category.map((categorySlug, index) => {
                          const category = categories.find(
                            (cat) => cat.key === categorySlug
                          );
                          return category ? (
                            <Tag
                              key={`category-${index}`}
                              className={`rounded-full px-3 py-1 capitalize cursor-pointer transition-all ${
                                mytheme === "light"
                                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }`}
                            >
                              {category.name}
                            </Tag>
                          ) : null;
                        })}
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