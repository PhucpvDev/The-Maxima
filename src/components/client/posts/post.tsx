"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Row, Col, ConfigProvider, theme, Typography, Card, Tag, Button, Input, Skeleton, Pagination, Empty, Tabs } from "antd";
import { SearchOutlined, ArrowRightOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";
import Image from "next/image";

const { Title, Paragraph } = Typography;

interface Category {
  slug: string;
  title: string;
  parent: string | null;
}
interface Translation {
  title: string;
  description: string;
  content: string;
  image: string;
  categories: { id: number; post_translations_id: number; post_categories_slug: string }[];
  languages_code: string;
}
interface Post {
  slug: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  author: string;
  featured?: boolean;
}
interface PostApiResponse {
  slug: string;
  translations: Translation[];
}
interface CategoryApiResponse {
  slug: string;
  title: string;
  parent: string | null;
}
interface RootState {
  theme: { mytheme: string };
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

async function getPosts(locale: string): Promise<{ posts: Post[]; title: string; subtitle: string; categories: Category[] }> {
  const lang = locale.startsWith("vi") ? "vi-VN" : locale.startsWith("zh") ? "zh-CN" : "en-US";
  const title = lang === "vi-VN" ? "Tin tức & Blog" : lang === "zh-CN" ? "新闻与博客" : "Blog & News";
  const subtitle = lang === "vi-VN" ? "Khám phá các bài viết mới nhất của The Maxima" : lang === "zh-CN" ? "探索 Maxima 的最新文章" : "Explore The Maxima's latest articles";

  let categories: Category[] = [
    { slug: "updates", title: lang === "vi-VN" ? "Cập nhật" : lang === "zh-CN" ? "更新" : "Updates", parent: null },
    { slug: "virtual-currency", title: lang === "vi-VN" ? "Tiền ảo" : lang === "zh-CN" ? "虚拟货币" : "Virtual Currency", parent: "updates" },
    { slug: "financial-investment", title: lang === "vi-VN" ? "Đầu tư tài chính" : lang === "zh-CN" ? "金融投资" : "Financial Investment", parent: "updates" },
  ];

  try {
    const categoriesResponse = await fetch(`https://admin.maximagoldhedging.com/items/post_categories`, { cache: "no-store" });
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.data && Array.isArray(categoriesData.data)) {
        categories = categoriesData.data.map((cat: CategoryApiResponse) => ({
          slug: cat.slug,
          title: cat.title,
          parent: cat.parent,
        }));
      } else {
        console.warn("Categories data is not in expected format, using default categories:", categoriesData);
      }
    } else {
      console.warn(`Fetch categories failed: ${categoriesResponse.statusText}, using default categories`);
    }

    const postsResponse = await fetch(
      `https://admin.maximagoldhedging.com/items/post?lang=${lang}&fields=*,translations.*,translations.categories.*`,
      { cache: "no-store" }
    );
    if (!postsResponse.ok) throw new Error(`Fetch posts failed: ${postsResponse.statusText}`);
    const postsData = await postsResponse.json();

    const posts: Post[] = postsData.data && Array.isArray(postsData.data) ? postsData.data.map((item: PostApiResponse, index: number) => {
      const translation = item.translations.find((t) => t.languages_code === lang) || item.translations[0];
      if (!translation) {
        console.warn(`No translation found for post ${item.slug} in language ${lang}`);
        return null;
      }

      let categoriesList: string[] = [];
      if (translation.categories && Array.isArray(translation.categories)) {
        categoriesList = translation.categories
          .map((cat) => {
            return cat.post_categories_slug;
          })
          .filter((slug): slug is string => !!slug);
      }

      if (categoriesList.length === 0) {
        categoriesList = ["uncategorized"];
        console.warn(`No valid categories found for post ${item.slug} in language ${lang}, defaulting to 'uncategorized'`);
      }

      return {
        slug: item.slug,
        title: translation.title || "Untitled",
        description: translation.description || "",
        image: translation.image ? `https://admin.maximagoldhedging.com/assets/${translation.image}` : "https://via.placeholder.com/300",
        categories: categoriesList,
        author: "The Maxima",
        featured: index < 3,
      };
    }).filter((post: Post | null): post is Post => post !== null) : [];

    return { posts, title, subtitle, categories };
  } catch (err) {
    console.error("Error fetching posts:", err);
    return { posts: [], title, subtitle, categories };
  }
}

export default function Posts() {
  const locale = useLocale();
  const { mytheme } = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState("Blog & News");
  const [subtitle, setSubtitle] = useState("Explore the latest articles...");
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
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [locale]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") result = result.filter((post) => post.categories.includes(activeCategory));
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((post) => post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query));
    }
    return result;
  }, [activeCategory, searchQuery, posts]);

  const paginatedPosts = useMemo(() => filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filteredPosts, currentPage]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);
  const handleReadMore = useCallback((postSlug: string) => router.push(`/posts/${postSlug}`), [router]);

  const themeConfig = {
    token: {
      colorPrimary: mytheme === "dark" ? "#FFC800" : "#F0B200",
      borderRadius: 12,
      fontFamily: "'Inter', sans-serif",
      colorText: mytheme === "dark" ? "#E0E0E0" : "#1F2A44",
      colorBgBase: mytheme === "dark" ? "#1A1A1A" : "#F9FAFB",
    },
    algorithm: mytheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  const getImageUrl = (post: Post) => post.image || "https://via.placeholder.com/300";
  const getLocalizedText = (en: string, vi: string, zh: string) => (locale.startsWith("vi") ? vi : locale.startsWith("zh") ? zh : en)

  const tabItems = categories
    .filter((c) => c.parent === null)
    .map((parent) => ({
      key: parent.slug,
      label: (
        <span className={`px-5 py-2 transition-all duration-300 ${mytheme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-gray-200 hover:bg-gray-700"}`}>
          {parent.title}
        </span>
      ),
      children: (
        <div className={`rounded-xl ${mytheme === "light" ? "bg-white" : ""} overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}>
          <div className="flex flex-nowrap space-x-3 pb-1 pt-[1px]">
            <motion.div key="all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type={activeCategory === "all" ? "primary" : "default"}
                className={`rounded-full px-5 py-2 text-base font-medium ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600"
                    : mytheme === "light"
                    ? "bg-gray-100 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                } whitespace-nowrap`}
                onClick={() => handleCategoryChange("all")}
              >
                All
              </Button>
            </motion.div>
            {categories
              .filter((category) => category.parent === parent.slug)
              .map((category) => (
                <motion.div key={category.slug} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type={activeCategory === category.slug ? "primary" : "default"}
                    className={`rounded-full px-5 py-2 text-base font-medium ${
                      activeCategory === category.slug
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600"
                        : mytheme === "light"
                        ? "bg-gray-100 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                    } whitespace-nowrap`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.title}
                  </Button>
                </motion.div>
              ))}
          </div>
        </div>
      ),
    }));

  const renderSkeleton = (type: "featured" | "posts") => (
    <Row gutter={[24, 24]}>
      {type === "featured" ? (
        <>
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
        </>
      ) : (
        [...Array(3)].map((_, i) => ( 
          <Col xs={24} sm={12} md={8} key={i}>
            <Card className="shadow-lg h-full">
              <Skeleton.Image active className="w-full h-40 rounded-lg" />
              <Skeleton active paragraph={{ rows: 2 }} className="p-6" />
            </Card>
          </Col>
        ))
      )}
    </Row>
  );

  const renderPostCard = (post: Post, isFeatured = false, isSmall = false) => (
    <motion.div variants={itemVariants}>
      <Card
        hoverable
        className={`h-full border-0 rounded-xl shadow-lg hover:shadow-xl ${mytheme === "light" ? "bg-white" : "bg-gray-800"}`}
        onClick={() => handleReadMore(post.slug)}
        cover={
          <div className={`relative overflow-hidden ${isFeatured ? "h-80" : isSmall ? "h-[186px]" : "h-48"}`}>
            <Image src={getImageUrl(post)} alt={post.title} fill className="object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 tags-container">
              {post.categories.map((catSlug) => {
                const category = categories.find((c) => c.slug === catSlug);
                const displayTitle = category ? category.title : getLocalizedText("Uncategorized", "Không phân loại", "未分类");
                if (!category) {
                  console.warn(`Category slug ${catSlug} not found in categories for post ${post.slug}`);
                }
                return (
                  <Tag key={catSlug} color={mytheme === "light" ? "yellow" : "gold"} className="category-tag bg-yellow-50 text-yellow-700">
                    {displayTitle}
                  </Tag>
                );
              })}
            </div>
            {isFeatured && (
              <div
                className={`absolute bottom-0 left-0 w-full px-6 py-4 bg-gradient-to-t ${mytheme === "light" ? "from-black/50" : "from-black/80"} to-transparent`}
              >
                <Title level={4} className="text-white mb-0 line-clamp-2 drop-shadow-md">
                  {post.title}
                </Title>
              </div>
            )}
          </div>
        }
        styles={{ body: { padding: "24px" } }}
      >
        <div className={isSmall ? "pt-3 sm:pt-0" : ""}>
          {!isFeatured && <Title level={5} className="mb-2 line-clamp-2">{post.title}</Title>}
          <div className="flex items-center gap-3 text-sm mb-3">
            <UserOutlined className="mr-1" />
            <span>{post.author}</span>
          </div>
          <Paragraph ellipsis={{ rows: isFeatured ? 3 : 2 }} className="mb-5">
            {post.description}
          </Paragraph>
          <Button
            type="primary"
            className="rounded-full px-5 bg-yellow-600 hover:bg-yellow-700"
            icon={<ArrowRightOutlined />}
            onClick={() => handleReadMore(post.slug)}
          >
            {getLocalizedText("Read More", "Đọc tiếp", "继续阅读")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={`min-h-screen pt-12 pb-24 ${mytheme === "light" ? "bg-gray-50" : "bg-gray-900"}`}>
        <style jsx>{`
          .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            max-width: 100%;
            overflow: visible;
            padding: 4px;
          }
          .category-tag {
            font-size: 12px;
            line-height: 1.5;
            padding: 3px 8px;
            text-transform: uppercase;
            white-space: nowrap;
            border-radius: 4px;
          }
          @media (max-width: 576px) {
            .category-tag {
              font-size: 0.8rem;
              padding: 2px 6px;
            }
            .tags-container {
              gap: 4px;
              flex-wrap: wrap;
              padding: 2px;
            }
          }
        `}</style>
        <div className="max-w-7xl px-4 mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Title level={1} className={`text-5xl font-extrabold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-gray-100"}`}>
              {title}
            </Title>
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                className="h-0.5 w-16 rounded-full bg-yellow-600"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
              <motion.div
                className="h-2 w-2 rounded-full bg-yellow-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
              <motion.div
                className="h-0.5 w-16 rounded-full bg-yellow-600"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              />
            </div>
            <p className={`text-xl max-w-3xl mx-auto ${mytheme === "light" ? "text-gray-600" : "text-gray-300"}`}>{subtitle}</p>
          </motion.div>

          <motion.div className="mb-16" variants={containerVariants} initial="hidden" animate="visible">
            <div className={`rounded-xl pb-1 pl-4 pr-4 ${mytheme === "light" ? "bg-white shadow-lg" : "bg-gray-800 shadow-lg"}`}>
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} md={8}>
                  <Input
                    placeholder={getLocalizedText("Search posts...", "Tìm kiếm bài viết...", "搜索文章...")}
                    prefix={<SearchOutlined className={`text-lg ${mytheme === "light" ? "text-yellow-600" : "text-gray-300"}`} />}
                    allowClear
                    size="large"
                    onChange={handleSearch}
                    className="rounded-full"
                  />
                </Col>
                <Col xs={24} md={16}>
                  {loading ? (
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton.Button key={i} active size="large" shape="round" className="min-w-[100px]" />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500">{getLocalizedText("Failed to load categories", "Không thể tải danh mục", "无法加载分类")}</div>
                  ) : !categories.filter((c) => c.parent === null).length ? (
                    <div className="text-center text-gray-500">{getLocalizedText("No categories available", "Không có danh mục nào", "没有可用的分类")}</div>
                  ) : (
                    <Tabs
                      defaultActiveKey="updates"
                      items={tabItems}
                      tabBarStyle={{}}
                      renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} className="flex flex-wrap gap-4 font-semibold text-lg" />}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center mb-10 text-yellow-600">
              <span className={`flex items-center justify-center w-12 h-12 -mt-2 rounded-full ${mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"}`}>
                <ClockCircleOutlined className={`text-xl ${mytheme === "light" ? "text-yellow-600" : "text-yellow-500"}`} />
              </span>
              <Title level={3} className={`ml-3 mb-0 text-2xl font-bold ${mytheme === "light" ? "text-gray-900" : "text-gray-200"}`}>
                {getLocalizedText("Latest Posts", "Bài Viết Mới Nhất", "最新文章")}
              </Title>
              <div className={`flex-1 h-px ml-4 ${mytheme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            </div>
            {loading ? (
              renderSkeleton("posts")
            ) : error ? (
              <Empty description={getLocalizedText(`An error occurred: ${error}`, `Đã xảy ra lỗi: ${error}`, `发生错误：${error}`)} />
            ) : !filteredPosts.length ? (
              <Empty description={getLocalizedText("No posts found", "Không tìm thấy bài viết phù hợp", "未找到相关文章")} />
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  {paginatedPosts.map((post) => (
                    <Col xs={24} sm={12} md={8} key={post.slug}>
                      {renderPostCard(post)}
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
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </ConfigProvider>
  );
}