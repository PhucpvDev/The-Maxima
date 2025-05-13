"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Row,
  Col,
  ConfigProvider,
  theme as antdTheme,
  Typography,
  Card,
  Tag,
  Button,
  Input,
  Skeleton,
  Pagination,
  Empty,
} from "antd"
import {
  SearchOutlined,
  ArrowRightOutlined,
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useSelector } from "react-redux"
import { useLocale } from "next-intl"
import BlogPostModal from "@/components/client/posts/blogPostModal"
import Image from "next/image"


const { Title, Paragraph } = Typography;
const { Meta } = Card;

interface Category {
  key: string;
  name: string;
}

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
  readTime: number;
  featured?: boolean;
  liked?: boolean;
}

interface ApiResponse {
  id: number;
  status: string;
  translations: Translation[];
  category: string;
}

interface RootState {
  theme: {
    mytheme: string;
  };
}

const translationFallbacks: Record<string, Post[]> = {};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

async function getPosts(locale: string): Promise<{
  posts: Post[];
  title: string;
  subtitle: string;
  categories: Category[];
}> {
  const lang = locale === "vi" || locale === "vi-VN" ? "vi-VN" : locale === "zh" || locale === "zh-CN" ? "zh-CN" : "en-US";
  const fallback = translationFallbacks[lang] || translationFallbacks["en-US"];

  const defaultCategories: Category[] = [
    { key: "all", name: lang === "vi-VN" ? "Tất cả" : lang === "zh-CN" ? "全部" : "All" },
    { key: "investment", name: lang === "vi-VN" ? "Đầu tư" : lang === "zh-CN" ? "投资" : "Investment" },
    { key: "finance", name: lang === "vi-VN" ? "Tài chính" : lang === "zh-CN" ? "金融" : "Finance" },
    { key: "crypto", name: lang === "vi-VN" ? "Tiền ảo" : lang === "zh-CN" ? "加密货币" : "Cryptocurrency" },
    { key: "blockchain", name: lang === "vi-VN" ? "Blockchain" : lang === "zh-CN" ? "区块链" : "Blockchain" },
    { key: "technology", name: lang === "vi-VN" ? "Công nghệ" : lang === "zh-CN" ? "技术" : "Technology" },
    { key: "affiliate", name: lang === "vi-VN" ? "Affiliate" : lang === "zh-CN" ? "联盟营销" : "Affiliate" },
    { key: "startup", name: lang === "vi-VN" ? "Khởi nghiệp" : lang === "zh-CN" ? "创业" : "Startup" },
    { key: "digitalmarketing", name: lang === "vi-VN" ? "Marketing số" : lang === "zh-CN" ? "数字营销" : "Digital Marketing" },
  ];

  let title = lang === "vi-VN" ? "Tin tức & Blog" : lang === "zh-CN" ? "新闻与博客" : "Blog & News";
  let subtitle =
    lang === "vi-VN"
      ? "Khám phá các bài viết mới nhất và thông tin hữu ích từ đội ngũ chuyên gia của chúng tôi"
      : lang === "zh-CN"
        ? "探索我们专家团队的最新文章和有用信息"
        : "Explore the latest articles and helpful information from our team of experts";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/posts?lang=${lang}&fields=*,translations.*,category`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    const data: ApiResponse[] = Array.isArray(result.data) ? result.data : [result.data];

    const posts: Post[] = data.flatMap((item) => {
      const translation = item.translations.find((t) => t.languages_code === lang);
      if (!translation) return [];

      title = translation.title || title;
      subtitle = translation.subtitle || subtitle;

      if (translation.category) {
        try {
          const apiCategories: Category[] = JSON.parse(translation.category);
          if (Array.isArray(apiCategories) && apiCategories.every(cat => cat.key && cat.name)) {
            categories = apiCategories;
          } else {
            console.warn("Translation categories are invalid, using default categories");
          }
        } catch (error) {
          console.warn("Failed to parse translation categories:", error);
        }
      } else {
        console.warn("No category field in translation, using default categories");
      }
      return [1, 2, 3, 4, 5, 6].map((index) => {
        const titleKey = `post_title_${index}` as keyof Translation;
        const descriptionKey = `post_description_${index}` as keyof Translation;
        const contentKey = `post_content_${index}` as keyof Translation;
        const imageKey = `post_image_${index}` as keyof Translation;
        const authorKey = `author_${index}` as keyof Translation;
        const categoryKey = `category_${index}` as keyof Translation;

        let categoriesList: string[] = ["investment"];
        try {
          const parsedCategories: string[] = JSON.parse(translation[categoryKey] as string);
          if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
            categoriesList = parsedCategories;
          }
        } catch (error) {
          console.warn(`Failed to parse category for post ${index}:`, error);
        }

        const post: Post = {
          id: `${item.id}-${index}`,
          title: translation[titleKey] as string,
          description: translation[descriptionKey] as string,
          content: translation[contentKey] as string || "<p>Content not available.</p>",
          published: item.status === "published",
          media: translation[imageKey]
            ? [{ url: `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${translation[imageKey]}` }]
            : [{ url: "https://via.placeholder.com/300" }],
          category: categoriesList, // Store array of category keys
          author: translation[authorKey] as string || "The Maxima",
          readTime: Math.floor(Math.random() * 10) + 3,
          featured: index <= 3,
          liked: false,
        };

        return post.title && post.description && post.content ? post : null;
      }).filter((post): post is Post => post !== null);
    });

    const firstTranslation = data[0]?.translations.find((t) => t.languages_code === lang);
    let categories: Category[] = defaultCategories;
    if (firstTranslation?.category) {
      try {
        const apiCategories: Category[] = JSON.parse(firstTranslation.category);
        if (Array.isArray(apiCategories) && apiCategories.every(cat => cat.key && cat.name)) {
          categories = apiCategories;
        } else {
          console.warn("Translation categories are invalid, using default categories");
        }
      } catch (error) {
        console.warn("Failed to parse translation categories:", error);
      }
    }
    return { posts, title, subtitle, categories };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: fallback, title, subtitle, categories: defaultCategories };
  }
}

export default function Posts() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState("Blog & News");
  const [subtitle, setSubtitle] = useState(
    "Explore the latest articles and helpful information from our team of experts"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mytheme || "light");
  }, [mytheme]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { posts, title, subtitle, categories } = await getPosts(locale);
        setPosts(posts);
        setTitle(title);
        setSubtitle(subtitle);
        setCategories(categories);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [locale]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (activeCategory !== "all") {
      result = result.filter((post) => post.category.includes(activeCategory));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeCategory, searchQuery, posts]);

  const featuredPosts = useMemo(() => filteredPosts.filter((post) => post.featured).slice(0, 3), [filteredPosts]);
  const paginatedPosts = useMemo(
    () => filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredPosts, currentPage]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleReadMore = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  }, []);

  const handleViewRelatedPost = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);

  const themeConfig = {
    token: {
      colorPrimary: mytheme === "dark" ? "#FFC800" : "#F0B200",
      borderRadius: 12,
      fontFamily: "'Inter', sans-serif",
      colorText: mytheme === "dark" ? "#E0E0E0" : "#1F2A44",
      colorBgBase: mytheme === "dark" ? "#1A1A1A" : "#F9FAFB",
      colorIcon: mytheme === "dark" ? "#E0E0E0" : "#1F2A44",
    },
    algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  const getImageUrl = (post: Post): string =>
    post.media?.[0]?.url || "https://via.placeholder.com/300";

  const getLocalizedText = (en: string, vi: string, zh: string) =>
    locale === "vi" || locale === "vi-VN" ? vi : locale === "zh" || locale === "zh-CN" ? zh : en;

  const renderFeaturedSkeleton = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card className="h-full shadow-lg">
          <Skeleton.Image active className="w-full h-64 rounded-lg" />
          <Skeleton active paragraph={{ rows: 3 }} className="p-6" />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Row gutter={[16, 16]}>
          {[1, 2].map((i) => (
            <Col span={24} key={i}>
              <Card className="shadow-md">
                <Skeleton.Image active className="w-full h-32 rounded-lg" />
                <Skeleton active paragraph={{ rows: 1 }} className="p-4" />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );

  const renderPostsSkeleton = () => (
    <Row gutter={[24, 24]}>
      {[...Array(6)].map((_, i) => (
        <Col xs={24} sm={12} md={8} key={`skeleton-${i}`}>
          <Card className="shadow-lg h-full">
            <Skeleton.Image active className="w-full h-40 rounded-lg" />
            <Skeleton active paragraph={{ rows: 2 }} className="p-6" />
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`min-h-screen pt-12 pb-24 ${mytheme === "light" ? "bg-gray-50" : "bg-gray-900"
          }`}
      >
        <style jsx>{`
          .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            max-width: 100%;
            overflow: hidden;
          }
          .category-tag {
            font-size: 10px;
            line-height: 1.4;
            padding: 2px 6px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          @media (max-width: 576px) {
            .category-tag {
              font-size: 8px;
              padding: 1px 4px;
            }
            .tags-container {
              gap: 2px;
            }
          }
        `}</style>
        <div className="max-w-7xl px-4 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title
              level={1}
              className={`text-5xl font-extrabold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-gray-100"
                }`}
            >
              {title}
            </Title>
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                className={`h-0.5 w-16 rounded-full ${mytheme === "light" ? "bg-yellow-600" : "bg-yellow-600"
                  }`}
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
              <motion.div
                className={`h-2 w-2 rounded-full ${mytheme === "light" ? "bg-yellow-600" : "bg-yellow-600"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
              <motion.div
                className={`h-0.5 w-16 rounded-full ${mytheme === "light" ? "bg-yellow-600" : "bg-yellow-600"
                  }`}
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
            </div>
            <Paragraph
              className={`text-lg max-w-3xl mx-auto ${mytheme === "light" ? "text-gray-600" : "text-gray-300"
                }`}
            >
              <span className="text-xl">{subtitle}</span>
            </Paragraph>
          </motion.div>

          <motion.div className="mb-20" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center mb-8 text-yellow-600">
              <span
                className={`flex items-center justify-center w-12 h-12 -mt-2 rounded-full ${mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
                  }`}
              >
                <FireOutlined className={`text-xl ${mytheme === "light" ? "text-yellow-600" : "text-yellow-500"}`} />
              </span>
              <Title
                level={3}
                className={`ml-3 mb-0 text-2xl font-bold ${mytheme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}
              >
                {getLocalizedText("Featured Posts", "Bài Viết Nổi Bật", "精选文章")}
              </Title>
              <div className={`flex-1 h-px ml-4 ${mytheme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            </div>

            {loading ? (
              renderFeaturedSkeleton()
            ) : error ? (
              <Empty
                description={getLocalizedText(
                  `An error occurred: ${error}`,
                  `Đã xảy ra lỗi: ${error}`,
                  `发生错误：${error}`
                )}
              />
            ) : !featuredPosts.length ? (
              <Empty
                description={getLocalizedText(
                  "No featured posts found",
                  "Không tìm thấy bài viết nổi bật",
                  "未找到精选文章"
                )}
              />
            ) : (
              <Row gutter={[24, 24]}>
                {featuredPosts[0] && (
                  <Col xs={24} md={12}>
                    <motion.div variants={itemVariants}>
                      <Card
                        hoverable
                        className={`h-full border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${mytheme === "light" ? "bg-white" : "bg-gray-800"
                          }`}
                        onClick={() => handleReadMore(featuredPosts[0].id)}
                        cover={
                          <div className="relative overflow-hidden h-80">
                            <Image
                              src={getImageUrl(featuredPosts[0])}
                              alt={featuredPosts[0].title}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 tags-container">
                              {featuredPosts[0].category.map((catKey) => {
                                const category = categories.find((c) => c.key === catKey);
                                return category ? (
                                  <Tag
                                    key={catKey}
                                    color={mytheme === "light" ? "yellow" : "gold"}
                                    className="category-tag bg-yellow-50 text-yellow-700"
                                  >
                                    {category.name}
                                  </Tag>
                                ) : null;
                              })}
                            </div>
                            <div
                              className={`absolute bottom-0 left-0 w-full px-6 py-4 ${mytheme === "light"
                                ? "bg-gradient-to-t from-black/50 to-transparent"
                                : "bg-gradient-to-t from-black/80 to-transparent"
                                }`}
                            >
                              <Title level={4} className="text-white mb-0 line-clamp-2 drop-shadow-md">
                                <span className="text-white">{featuredPosts[0].title}</span>
                              </Title>
                            </div>
                          </div>
                        }
                        bodyStyle={{ padding: "24px" }}
                      >
                        <Meta
                          description={
                            <div>
                              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                <div className="flex items-center">
                                  <UserOutlined className="mr-1 text-lg" />
                                  <span className={`${mytheme === "light" ? "text-gray-800" : "text-white"}`}>{featuredPosts[0].author}</span>
                                </div>
                              </div>
                              <Paragraph ellipsis={{ rows: 3 }} className="mb-5 text-base">
                                {featuredPosts[0].description}
                              </Paragraph>
                              <Button
                                type="primary"
                                className="rounded-full px-6 text-base font-medium shadow-md bg-yellow-600 hover:bg-yellow-700"
                                icon={<ArrowRightOutlined />}
                                onClick={() => handleReadMore(featuredPosts[0].id)}
                              >
                                {getLocalizedText("Read More", "Đọc tiếp", "继续阅读")}
                              </Button>
                            </div>
                          }
                        />
                      </Card>
                    </motion.div>
                  </Col>
                )}
                {featuredPosts.length > 1 && (
                  <Col xs={24} md={12}>
                    <Row gutter={[16, 16]}>
                      {featuredPosts.slice(1, 3).map((post) => (
                        <Col span={24} key={post.id}>
                          <motion.div variants={itemVariants}>
                            <Card
                              hoverable
                              className={`border-0 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${mytheme === "light" ? "bg-white" : "bg-gray-800"
                                }`}
                              onClick={() => handleReadMore(post.id)}
                            >
                              <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                  <div className="relative overflow-hidden h-[186px] rounded-l-xl">
                                    <Image
                                      src={getImageUrl(post)}
                                      alt={post.title}
                                      fill
                                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 tags-container">
                                      {post.category.map((catKey) => {
                                        const category = categories.find((c) => c.key === catKey);
                                        return category ? (
                                          <Tag
                                            key={catKey}
                                            color={mytheme === "light" ? "yellow" : "gold"}
                                            className="category-tag bg-yellow-50 text-yellow-700"
                                          >
                                            {category.name}
                                          </Tag>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </Col>
                                <Col xs={24} sm={16}>
                                  <div className="pt-3 sm:pt-0">
                                    <Title level={5} className="mb-2 line-clamp-1">
                                      {post.title}
                                    </Title>
                                    <div className="flex items-center flex-wrap gap-3 text-sm mb-3">
                                      <div className="flex items-center">
                                        <UserOutlined className="mr-1" />
                                        <span>{post.author}</span>
                                      </div>
                                    </div>
                                    <Paragraph ellipsis={{ rows: 3 }} className="text-sm mb-3">
                                      {post.description}
                                    </Paragraph>
                                    <Button
                                      type="primary"
                                      className="rounded-full px-6 text-base font-medium shadow-md bg-yellow-600 hover:bg-yellow-700"
                                      icon={<ArrowRightOutlined />}
                                      onClick={() => handleReadMore(post.id)}
                                    >
                                      {getLocalizedText("Read More", "Đọc tiếp", "继续阅读")}
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                )}
              </Row>
            )}
          </motion.div>

          <motion.div
            className="mb-16"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              className={`rounded-xl p-6 ${mytheme === "light" ? "bg-white shadow-lg" : "bg-gray-800 shadow-lg"
                }`}
            >
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} md={8}>
                  <Input
                    placeholder={getLocalizedText(
                      "Search posts...",
                      "Tìm kiếm bài viết...",
                      "搜索文章..."
                    )}
                    prefix={<SearchOutlined className={`text-lg ${mytheme === "light" ? "text-yellow-600" : "text-gray-300"}`} />}
                    allowClear
                    size="large"
                    onChange={handleSearch}
                    className="rounded-full text-base shadow-sm"
                  />
                </Col>
                <Col xs={24} md={16}>
                  <div
                    className={`rounded-full p-2 ${mytheme === "light" ? "bg-yellow-50" : "bg-gray-800"
                      } overflow-x-auto`}
                  >
                    <div className="flex flex-nowrap space-x-2">
                      {categories.map((category) => (
                        <motion.div
                          key={category.key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type={activeCategory === category.key ? "primary" : "text"}
                            className={`rounded-full whitespace-nowrap text-base font-medium ${activeCategory === category.key
                              ? "shadow-md bg-yellow-600 hover:bg-yellow-700"
                              : mytheme === "light"
                                ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                                : "text-gray-300"
                              }`}
                            onClick={() => handleCategoryChange(category.key)}
                          >
                            {category.name}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center mb-10 text-yellow-600">
              <div
                className={`flex items-center justify-center w-12 h-12 -mt-2 rounded-full ${mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"
                  }`}
              >
                <ClockCircleOutlined className={`text-xl ${mytheme === "light" ? "text-yellow-600" : "text-yellow-500"}`} />
              </div>
              <Title
                level={3}
                className={`ml-3 mb-0 text-2xl font-bold ${mytheme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}
              >
                {getLocalizedText("Latest Posts", "Bài Viết Mới Nhất", "最新文章")}
              </Title>
              <div className={`flex-1 h-px ml-4 ${mytheme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            </div>

            {loading ? (
              renderPostsSkeleton()
            ) : error ? (
              <Empty
                description={getLocalizedText(
                  `An error occurred: ${error}`,
                  `Đã xảy ra lỗi: ${error}`,
                  `发生错误：${error}`
                )}
              />
            ) : !filteredPosts.length ? (
              <Empty
                description={getLocalizedText(
                  "No posts found",
                  "Không tìm thấy bài viết phù hợp",
                  "未找到相关文章"
                )}
              />
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  {paginatedPosts.map((post) => (
                    <Col xs={24} sm={12} md={8} key={post.id}>
                      <motion.div variants={itemVariants}>
                        <Card
                          hoverable
                          className={`h-full border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${mytheme === "light" ? "bg-white" : "bg-gray-800"
                            }`}
                          onClick={() => handleReadMore(post.id)}
                          cover={
                            <div className="relative overflow-hidden h-48">
                              <Image
                                src={getImageUrl(post)}
                                alt={post.title}
                                fill
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 tags-container">
                                {post.category.map((catKey) => {
                                  const category = categories.find((c) => c.key === catKey);
                                  return category ? (
                                    <Tag
                                      key={catKey}
                                      color={mytheme === "light" ? "yellow" : "gold"}
                                      className="category-tag bg-yellow-50 text-yellow-700"
                                    >
                                      {category.name}
                                    </Tag>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          }
                        >
                          <Meta
                            title={<Title level={5} className="mb-3 line-clamp-2">{post.title}</Title>}
                            description={
                              <div>
                                <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                                  <div className="flex items-center">
                                    <UserOutlined className="mr-1" />
                                    <span>{post.author}</span>
                                  </div>
                                </div>
                                <Paragraph ellipsis={{ rows: 2 }} className="mb-5">
                                  {post.description}
                                </Paragraph>
                                <Button
                                  type="primary"
                                  className="rounded-full px-5 shadow-md bg-yellow-600 hover:bg-yellow-700"
                                  icon={<ArrowRightOutlined />}
                                  onClick={() => handleReadMore(post.id)}
                                >
                                  {getLocalizedText("Read More", "Đọc tiếp", "继续阅读")}
                                </Button>
                              </div>
                            }
                          />
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
                {filteredPosts.length > pageSize && (
                  <div className="flex justify-center mt-16">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredPosts.length}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      className={mytheme === "light" ? "ant-pagination-light" : ""}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {selectedPostId && (
        <BlogPostModal
          isOpen={isModalOpen}
          postId={selectedPostId}
          onClose={handleCloseModal}
          onViewRelatedPost={handleViewRelatedPost}
        />
      )}
    </ConfigProvider>
  );
}