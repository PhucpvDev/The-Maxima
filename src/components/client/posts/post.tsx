"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Row, Col, ConfigProvider, theme, Typography, Card, Tag, Button, Input, Skeleton, Pagination, Empty, Tabs } from "antd";
import { SearchOutlined, ArrowRightOutlined, FireOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocale } from "next-intl";
import Image from "next/image";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Category { key: string; name: string; parentKey: string | null; }
interface Translation { title: string; subtitle: string; category?: string; languages_code: string; [key: string]: string | undefined; }
interface Post { id: string; title: string; description: string; media: { url: string }[]; category: string[]; author: string; featured?: boolean; }
interface ApiResponse { id: number; status: string; translations: Translation[]; }
interface RootState { theme: { mytheme: string }; }

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

async function getPosts(locale: string): Promise<{ posts: Post[]; title: string; subtitle: string; categories: Category[] }> {
  const lang = locale.startsWith("vi") ? "vi-VN" : locale.startsWith("zh") ? "zh-CN" : "en-US";
  let title = lang === "vi-VN" ? "Tin tức & Blog" : lang === "zh-CN" ? "新闻与博客" : "Blog & News";
  let subtitle = lang === "vi-VN" ? "Khám phá các bài viết mới nhất..." : lang === "zh-CN" ? "探索我们专家团队..." : "Explore the latest articles...";
  let categories: Category[] = [];

  const defaultCategories: Category[] = [
    { key: "updates", name: lang === "vi-VN" ? "Cập nhật" : lang === "zh-CN" ? "更新" : "Updates", parentKey: null },
    { key: "all", name: lang === "vi-VN" ? "Tất cả" : lang === "zh-CN" ? "全部" : "All", parentKey: "updates" },
    { key: "crypto", name: lang === "vi-VN" ? "Tiền ảo" : lang === "zh-CN" ? "加密货币" : "Cryptocurrency", parentKey: "updates" },
    { key: "investment", name: lang === "vi-VN" ? "Đầu tư" : lang === "zh-CN" ? "投资" : "Investment", parentKey: "updates" },
    { key: "technology", name: lang === "vi-VN" ? "Công nghệ" : lang === "zh-CN" ? "技术" : "Technology", parentKey: "updates" },
    { key: "affiliate", name: lang === "vi-VN" ? "Affiliate" : lang === "zh-CN" ? "联盟营销" : "Affiliate", parentKey: "updates" },
  ];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/posts?lang=${lang}&fields=*,translations.*,category`, { cache: "no-store" });
    if (!response.ok) throw new Error("Fetch failed");
    
    const { data } = await response.json();

    const posts: Post[] = (Array.isArray(data) ? data : [data]).flatMap((item: ApiResponse) => {
      const translation = item.translations.find((t) => t.languages_code === lang);
      if (!translation) return [];

      title = translation.title || title;
      subtitle = translation.subtitle || subtitle;

      if (translation.category) {
        try {
          let cleanedCategory = translation.category.trim();
          cleanedCategory = cleanedCategory.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
          categories = JSON.parse(cleanedCategory);
          const parentCategory = categories.find(c => c.parentKey === null);
          if (parentCategory) {
            categories = categories.map(c => 
              c.parentKey === "updates" ? { ...c, parentKey: parentCategory.key } : c
            );
          }
        } catch (e) {
          console.error("Failed to parse category JSON for language", lang, ":", e, "Raw string:", translation.category);
          categories = defaultCategories; 
        }
      } else {
        categories = defaultCategories; 
      }

      return [1, 2, 3, 4, 5, 6].map((index) => {
        const post: Post = {
          id: `${item.id}-${index}`,
          title: translation[`post_title_${index}`] || "Untitled",
          description: translation[`post_description_${index}`] || "No description",
          media: translation[`post_image_${index}`]
            ? [{ url: `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/assets/${translation[`post_image_${index}`]}` }]
            : [{ url: "https://via.placeholder.com/300" }],
          category: translation[`category_${index}`] ? JSON.parse(translation[`category_${index}`] || '["investment"]') : ["investment"],
          author: translation[`author_${index}`] || "The Maxima",
          featured: index <= 3,
        };
        return post.title && post.description ? post : null;
      }).filter((post): post is Post => post !== null);
    });

    if (!categories.length) {
      console.warn("Categories array is empty, using default categories");
      categories = defaultCategories;
    }

    return { posts, title, subtitle, categories };
  } catch (err) {
    console.error("Error fetching posts:", err);
    return { posts: [], title, subtitle, categories: defaultCategories };
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
        console.log("Categories received in Posts component for language", locale, ":", categories);
        setPosts(posts);
        setTitle(title);
        setSubtitle(subtitle);
        setCategories(categories);
        console.log("Categories set in state:", categories);
      } catch (err) {
        setError((err as Error).message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [locale]);

  useEffect(() => {
  }, [categories]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") result = result.filter((post) => post.category.includes(activeCategory));
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((post) => post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query));
    }
    return result;
  }, [activeCategory, searchQuery, posts]);

  const featuredPosts = useMemo(() => filteredPosts.filter((post) => post.featured).slice(0, 3), [filteredPosts]);
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
  const handleReadMore = useCallback((postId: string) => router.push(`/posts/${postId}`), [router]);

  const themeConfig = {
    token: { colorPrimary: mytheme === "dark" ? "#FFC800" : "#F0B200", borderRadius: 12, fontFamily: "'Inter', sans-serif", colorText: mytheme === "dark" ? "#E0E0E0" : "#1F2A44", colorBgBase: mytheme === "dark" ? "#1A1A1A" : "#F9FAFB" },
    algorithm: mytheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  const getImageUrl = (post: Post) => post.media?.[0]?.url || "https://via.placeholder.com/300";
  const getLocalizedText = (en: string, vi: string, zh: string) => locale.startsWith("vi") ? vi : locale.startsWith("zh") ? zh : en;

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
        [...Array(6)].map((_, i) => (
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
        onClick={() => handleReadMore(post.id)}
        cover={
          <div className={`relative overflow-hidden ${isFeatured ? "h-80" : isSmall ? "h-[186px]" : "h-48"}`}>
            <Image src={getImageUrl(post)} alt={post.title} fill className="object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 tags-container">
              {post.category.map((catKey) => {
                const category = categories.find((c) => c.key === catKey);
                return category ? (
                  <Tag key={catKey} color={mytheme === "light" ? "yellow" : "gold"} className="category-tag bg-yellow-50 text-yellow-700">{category.name}</Tag>
                ) : null;
              })}
            </div>
            {isFeatured && (
              <div className={`absolute bottom-0 left-0 w-full px-6 py-4 bg-gradient-to-t ${mytheme === "light" ? "from-black/50" : "from-black/80"} to-transparent`}>
                <Title level={4} className="text-white mb-0 line-clamp-2 drop-shadow-md">{post.title}</Title>
              </div>
            )}
          </div>
        }
      >
        <div className={isSmall ? "pt-3 sm:pt-0" : ""}>
          {!isFeatured && <Title level={5} className="mb-2 line-clamp-2">{post.title}</Title>}
          <div className="flex items-center gap-3 text-sm mb-3">
            <UserOutlined className="mr-1" />
            <span>{post.author}</span>
          </div>
          <Paragraph ellipsis={{ rows: isFeatured ? 3 : 2 }} className="mb-5">{post.description}</Paragraph>
          <Button type="primary" className="rounded-full px-5 bg-yellow-600 hover:bg-yellow-700" icon={<ArrowRightOutlined />} onClick={() => handleReadMore(post.id)}>
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
          .tags-container { display: flex; flex-wrap: wrap; gap: 4px; max-width: 100%; overflow: hidden; }
          .category-tag { font-size: 10px; line-height: 1.4; padding: 2px 6px; text-transform: uppercase; white-space: nowrap; }
          @media (max-width: 576px) { .category-tag { font-size: 8px; padding: 1px 4px; } .tags-container { gap: 2px; } }
        `}</style>
        <div className="max-w-7xl px-4 mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Title level={1} className={`text-5xl font-extrabold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-gray-100"}`}>{title}</Title>
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div className="h-0.5 w-16 rounded-full bg-yellow-600" initial={{ width: 0 }} animate={{ width: 64 }} transition={{ delay: 0.3, duration: 0.7 }} />
              <motion.div className="h-2 w-2 rounded-full bg-yellow-600" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
              <motion.div className="h-0.5 w-16 rounded-full bg-yellow-600" initial={{ width: 0 }} animate={{ width: 64 }} transition={{ delay: 0.3, duration: 0.7 }} />
            </div>
            <p className={`text-xl max-w-3xl mx-auto ${mytheme === "light" ? "text-gray-600" : "text-gray-300"}`}>{subtitle}</p>
          </motion.div>

          <motion.div className="mb-20" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex items-center mb-8 text-yellow-600">
              <span className={`flex items-center justify-center w-12 h-12 -mt-2 rounded-full ${mytheme === "light" ? "bg-yellow-100" : "bg-yellow-900/30"}`}>
                <FireOutlined className={`text-xl ${mytheme === "light" ? "text-yellow-600" : "text-yellow-500"}`} />
              </span>
              <Title level={3} className={`ml-3 mb-0 text-2xl font-bold ${mytheme === "light" ? "text-gray-900" : "text-gray-200"}`}>
                {getLocalizedText("Featured Posts", "Bài Viết Nổi Bật", "精选文章")}
              </Title>
              <div className={`flex-1 h-px ml-4 ${mytheme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            </div>
            {loading ? (
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
            ) : error ? (
              <Empty description={getLocalizedText(`An error occurred: ${error}`, `Đã xảy ra lỗi: ${error}`, `发生错误：${error}`)} />
            ) : !featuredPosts.length ? (
              <Empty description={getLocalizedText("No featured posts found", "Không tìm thấy bài viết nổi bật", "未找到精选文章")} />
            ) : (
              <Row gutter={[24, 24]}>
                {featuredPosts[0] && (
                  <Col xs={24} md={12}>
                    <motion.div variants={itemVariants}>
                      <Card
                        hoverable
                        className={`h-full border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${mytheme === "light" ? "bg-white" : "bg-gray-800"}`}
                        onClick={() => handleReadMore(featuredPosts[0].id)}
                        cover={
                          <div className="relative overflow-hidden h-[313px]">
                            <Image
                              src={getImageUrl(featuredPosts[0])}
                              alt={featuredPosts[0].title}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-1 tags-container">
                              {featuredPosts[0].category.map((catKey) => {
                                const category = categories.find((c) => c.key === catKey);
                                return category ? (
                                  <Tag key={catKey} color={mytheme === "light" ? "yellow" : "gold"} className="category-tag bg-yellow-50 text-yellow-700">
                                    {category.name}
                                  </Tag>
                                ) : null;
                              })}
                            </div>
                            <div className={`absolute bottom-0 left-0 w-full px-3 py-4 bg-gradient-to-t ${mytheme === "light" ? "from-black/50" : "from-black/80"} to-transparent`}>
                              <p className={`text-white mb-0 text-xl line-clamp-2 drop-shadow-md`} >
                                {featuredPosts[0].title}
                              </p>
                            </div>
                          </div>
                        }
                        bodyStyle={{ padding: "24px" }}
                      >
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <UserOutlined className="mr-1 text-lg" />
                          <span className={mytheme === "light" ? "text-gray-800" : "text-white"}>{featuredPosts[0].author}</span>
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
                              className={`border-0 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${mytheme === "light" ? "bg-white" : "bg-gray-800"}`}
                              onClick={() => handleReadMore(post.id)}
                            >
                              <Row gutter={16}>
                                <Col xs={24} sm={8}>
                                  <div className="relative overflow-hidden h-[186px] rounded-l-xl">
                                    <Image
                                      src={getImageUrl(post)}
                                      alt={post.title}
                                      fill
                                      className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 tags-container">
                                      {post.category.map((catKey) => {
                                        const category = categories.find((c) => c.key === catKey);
                                        return category ? (
                                          <Tag key={catKey} color={mytheme === "light" ? "yellow" : "gold"} className="category-tag bg-yellow-50 text-yellow-700">
                                            {category.name}
                                          </Tag>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </Col>
                                <Col xs={24} sm={16}>
                                  <div className="pt-3 sm:pt-0">
                                    <Title level={5} className="mb-2 line-clamp-1">{post.title}</Title>
                                    <div className="flex items-center gap-3 text-sm mb-3">
                                      <UserOutlined className="mr-1" />
                                      <span>{post.author}</span>
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
                      {[...Array(5)].map((_, i) => <Skeleton.Button key={i} active size="large" shape="round" className="min-w-[100px]" />)}
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500">{getLocalizedText("Failed to load categories", "Không thể tải danh mục", "无法加载分类")}</div>
                  ) : !categories.filter((c) => c.parentKey === null).length ? (
                    <div className="text-center text-gray-500">{getLocalizedText("No categories available", "Không có danh mục nào", "没有可用的分类")}</div>
                  ) : (
                    <Tabs defaultActiveKey="updatesc" tabBarStyle={{ }} renderTabBar={(props, DefaultTabBar) => (
                      <DefaultTabBar {...props} className="flex flex-wrap gap-4 font-semibold text-lg" />
                    )}>
                      {categories.filter((c) => c.parentKey === null).map((parent) => (
                        <TabPane tab={<span className={`px-5 py-2 transition-all duration-300 ${mytheme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-gray-200 hover:bg-gray-700"}`}>{parent.name}</span>} key={parent.key}>
                          <div className={`rounded-xl ${mytheme === "light" ? "bg-white" : ""} overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}>
                            <div className="flex flex-nowrap space-x-3 pb-1 pt-[1px]">
                              {categories.filter((category) => category.parentKey === parent.key).map((category) => (
                                <motion.div key={category.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    type={activeCategory === category.key ? "primary" : "default"}
                                    className={`rounded-full px-5 py-2 text-base font-medium ${activeCategory === category.key
                                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600"
                                      : mytheme === "light" ? "bg-gray-100 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700" : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"} whitespace-nowrap`}
                                    onClick={() => handleCategoryChange(category.key)}
                                  >
                                    {category.name}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </TabPane>
                      ))}
                    </Tabs>
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
            {loading ? renderSkeleton("posts") : error ? (
              <Empty description={getLocalizedText(`An error occurred: ${error}`, `Đã xảy ra lỗi: ${error}`, `发生错误：${error}`)} />
            ) : !filteredPosts.length ? (
              <Empty description={getLocalizedText("No posts found", "Không tìm thấy bài viết phù hợp", "未找到相关文章")} />
            ) : (
              <>
                <Row gutter={[24, 24]}>
                  {paginatedPosts.map((post) => (
                    <Col xs={24} sm={12} md={8} key={post.id}>{renderPostCard(post)}</Col>
                  ))}
                </Row>
                {filteredPosts.length > pageSize && (
                  <div className="flex justify-center mt-16">
                    <Pagination current={currentPage} pageSize={pageSize} total={filteredPosts.length} onChange={handlePageChange} showSizeChanger={false} />
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