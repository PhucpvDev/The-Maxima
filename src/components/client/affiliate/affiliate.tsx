"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ConfigProvider, theme as antdTheme, Form, Input, Button, message } from "antd"
import { useLocale } from "next-intl"

interface AffiliateTranslation {
    affiliate_id: number;
    hero_st_ju_title: string;
    hero_st_wb_title: string;
    id: number;
    languages_code: string;
    step_description_1: string;
    step_description_2: string;
    step_description_3: string;
    step_title_1: string;
    step_title_2: string;
    step_title_3: string;
    submit_button_text: string;
    subtitle_ju: string;
    title_form_1: string;
    title_form_2: string;
    title_form_3: string;
    title_form_4: string;
    title_ju: string;
    title_wb: string;
}

interface AffiliateData {
    hero_st_ju_title: string;
    hero_st_wb_title: string;
    id: number;
    status: string;
    step_description_1: string;
    step_description_2: string;
    step_description_3: string;
    step_title_1: string;
    step_title_2: string;
    step_title_3: string;
    submit_button_text: string;
    subtitle_ju: string;
    title_form_1: string;
    title_form_2: string;
    title_form_3: string;
    title_form_4: string;
    title_ju: string;
    title_wb: string;
    translations: AffiliateTranslation[];
}

interface ApiResponse {
    data: AffiliateData;
}

// Interface for form values
interface FormValues {
    username: string;
    referralLink: string;
    referralId: string;
    email: string;
}

export default function AffiliatePage() {
    const { mytheme } = useSelector((state: RootState) => state.theme);
    const locale = useLocale();
    const [content, setContent] = useState<AffiliateData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocale, setCurrentLocale] = useState(locale);
    
    // Refs for managing effects
    const themeSetRef = useRef(false);
    const dataFetchedRef = useRef(false);
    
    const [form] = Form.useForm();

    // Handle locale change
    if (currentLocale !== locale) {
        setCurrentLocale(locale);
        form.resetFields();
        setFormSubmitted(false);
    }

    // Setup theme effect
    if (!themeSetRef.current) {
        document.documentElement.setAttribute("data-theme", mytheme);
        themeSetRef.current = true;
    }
    if (mytheme && document.documentElement.getAttribute("data-theme") !== mytheme) {
        document.documentElement.setAttribute("data-theme", mytheme);
    }

    // Fetch content handler - uses useCallback to memoize function
    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
            console.log("Fetching content for language:", lang);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/affiliate?lang=${lang}&fields=*,translations.*`,
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch content");
            }   

            const result: ApiResponse = await response.json();
            console.log("API response:", result);

            const translation = result.data.translations.find(
                t => t.languages_code === lang
            );

            if (translation) {
                setContent({
                    ...result.data,
                    hero_st_ju_title: translation.hero_st_ju_title || result.data.hero_st_ju_title,
                    hero_st_wb_title: translation.hero_st_wb_title || result.data.hero_st_wb_title,
                    step_description_1: translation.step_description_1 || result.data.step_description_1,
                    step_description_2: translation.step_description_2 || result.data.step_description_2,
                    step_description_3: translation.step_description_3 || result.data.step_description_3,
                    step_title_1: translation.step_title_1 || result.data.step_title_1,
                    step_title_2: translation.step_title_2 || result.data.step_title_2,
                    step_title_3: translation.step_title_3 || result.data.step_title_3,
                    submit_button_text: translation.submit_button_text || result.data.submit_button_text,
                    subtitle_ju: translation.subtitle_ju || result.data.subtitle_ju,
                    title_form_1: translation.title_form_1 || result.data.title_form_1,
                    title_form_2: translation.title_form_2 || result.data.title_form_2,
                    title_form_3: translation.title_form_3 || result.data.title_form_3,
                    title_form_4: translation.title_form_4 || result.data.title_form_4,
                    title_ju: translation.title_ju || result.data.title_ju,
                    title_wb: translation.title_wb || result.data.title_wb,
                });
            } else {
                setContent(result.data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
            setContent({
                hero_st_ju_title: "JOIN US",
                hero_st_wb_title: "Why Become",
                id: 1,
                status: "draft",
                step_description_1: "Earn high commissions for every successful referral to the Maxima platform.",
                step_description_2: "Access a comprehensive dashboard to track your referrals and earnings in real-time.",
                step_description_3: "Get personalized assistance from our affiliate management team whenever you need it.",
                step_title_1: "Commission",
                step_title_2: "Easy Tracking",
                step_title_3: "Dedicated Support",
                submit_button_text: "Submit",
                subtitle_ju: "Join Maxima's affiliate program and earn rewards by referring users to our platform. Fill out the form below to register as an affiliate partner.",
                title_form_1: "Username",
                title_form_2: "Maxima Referral Link",
                title_form_3: "Referral ID No.",
                title_form_4: "Email",
                title_ju: "Affiliate Program",
                title_wb: "Why Become an Affiliate?",
                translations: []
            });
        } finally {
            setIsLoading(false);
        }
    }, [locale]);

    if (!dataFetchedRef.current) {
        dataFetchedRef.current = true;
        fetchContent();
    }

    const showSuccessMessage = () => {
        message.success('Application submitted successfully!');
    };

    const showErrorMessage = (errorMsg: string) => {
        message.error(errorMsg);
    };

    const resetFormAndState = () => {
        form.resetFields();
        setFormSubmitted(false);
    };

    const handleEAffiliate = async (values: FormValues) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/form-affiliate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    link: values.referralLink,
                    code: values.referralId,
                    email: values.email,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit affiliate form');
            }

            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Error submitting affiliate form:", err);
            throw err;
        }
    };

    const onFinish = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await handleEAffiliate(values);
            setFormSubmitted(true);
            showSuccessMessage();
            setTimeout(() => {
                resetFormAndState();
            }, 3000);
        } catch (err) {
            console.error(err)
            showErrorMessage(
                locale === 'vi' ? 'Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại!' :
                locale === 'zh' ? '提交申请时发生错误。请重试！' :
                'An error occurred while submitting the form. Please try again!'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.03, transition: { duration: 0.3 } },
        tap: { scale: 0.97, transition: { duration: 0.3 } }
    };

    const themeConfig = {
        token: {
            colorPrimary: "#FFC800",
            borderRadius: 8,
            colorText: mytheme === "light" ? "#1f2937" : "#ffffff",
            colorTextPlaceholder: mytheme === "light" ? "#6b7280" : "#9ca3af",
            colorBgContainer: mytheme === "light" ? "#f9fafb" : "#111827",
            colorBorder: mytheme === "light" ? "#d1d5db" : "#374151",
            controlHeight: 48,
        },
        components: {
            Input: {
                paddingBlock: 12,
                paddingInline: 16,
                borderRadius: 8,
                activeShadow: "0 0 0 2px rgba(255, 200, 0, 0.2)",
            },
            Button: {
                borderRadius: 9999,
                primaryColor: "#000000",
                fontWeight: 700,
            },
            Form: {
                itemMarginBottom: 24,
            },
        },
        algorithm: mytheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${mytheme === "light" ? "bg-slate-50" : "bg-gray-900"}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const getPlaceholders = () => {
        if (locale === "vi") {
            return {
                username: "https://admin.maximagoldhedging.com/affiliate-1/[tên người dùng]",
                referralLink: "Sao chép & Dán từ liên kết Lời mời Maxima",
                referralId: "Ví dụ: 66128169",
                email: "Nhập email của bạn"
            };
        } else if (locale === "zh") {
            return {
                username: "www.themaximaexperience.world/affiliate-1/[用户名]",
                referralLink: "从Maxima邀请链接复制和粘贴",
                referralId: "例如：66128169",
                email: "输入您的电子邮件"
            };
        } else {
            return {
                username: "www.themaximaexperience.world/affiliate-1/[username]",
                referralLink: "Copy & Paste from Maxima Invite link",
                referralId: "E.g 66128169",
                email: "Enter your email"
            };
        }
    };

    const placeholders = getPlaceholders();

    const getSuccessText = () => {
        if (locale === "vi") {
            return {
                submitted: "Đã gửi đơn đăng ký!",
                thanks: "Cảm ơn bạn đã quan tâm đến chương trình liên kết của chúng tôi. Chúng tôi sẽ xem xét đơn đăng ký của bạn và phản hồi trong thời gian sớm nhất."
            };
        } else if (locale === "zh") {
            return {
                submitted: "申请已提交！",
                thanks: "感谢您对我们的联盟计划感兴趣。我们将审核您的申请并尽快回复您。"
            };
        } else {
            return {
                submitted: "Application Submitted!",
                thanks: "Thank you for your interest in our affiliate program. We'll review your application and get back to you shortly."
            };
        }
    };

    const successText = getSuccessText();

    return (
        <ConfigProvider theme={themeConfig}>
            <section
                className={`min-h-screen py-16 px-4 relative overflow-hidden font-inter ${mytheme === "light"
                    ? "bg-gradient-to-b from-slate-50 to-white text-gray-900"
                    : "bg-gradient-to-b from-gray-900 to-gray-950 text-white"
                    }`}
                key={`affiliate-section-${locale}`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={`absolute inset-0 opacity-5 ${mytheme === "light" ? "bg-gray-900" : "bg-white"
                            }`}
                        style={{
                            backgroundImage: `radial-gradient(circle, ${mytheme === "light" ? "#1a202c" : "#ffffff"
                                } 1px, transparent 1px)`,
                            backgroundSize: "30px 30px"
                        }}
                    ></div>
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        className="mb-20 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        key={`why-become-section-${locale}`}
                    >
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="h-1 w-10 bg-yellow-500 rounded"></div>
                            <span className={`text-sm font-bold tracking-wider uppercase ${mytheme === "light" ? "text-gray-500" : "text-gray-400"
                                }`}>{content?.hero_st_wb_title}</span>
                            <div className="h-1 w-10 bg-yellow-500 rounded"></div>
                        </div>
                        <h2 className={`text-3xl md:text-4xl font-bold mb-14 ${mytheme === "light" ? "text-gray-900" : "text-white"
                            } relative inline-block`}>
                            {content?.title_wb}
                            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div
                                variants={fadeInUp}
                                className={`p-6 rounded-xl transition-all duration-300 ${mytheme === "light"
                                    ? "bg-white shadow-md hover:shadow-lg"
                                    : "bg-gray-800/50 shadow-lg hover:shadow-xl shadow-black/10 hover:shadow-black/20"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${mytheme === "light" ? "bg-amber-100" : "bg-amber-900/30"
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl text-yellow-500">attach_money</span>
                                </div>
                                <h4 className={`text-xl font-bold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-white"
                                    }`}>{content?.step_title_1}</h4>
                                <p className={`${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                    } tracking-wide leading-relaxed`}>
                                    {content?.step_description_1}
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className={`p-6 rounded-xl transition-all duration-300 ${mytheme === "light"
                                    ? "bg-white shadow-md hover:shadow-lg"
                                    : "bg-gray-800/50 shadow-lg hover:shadow-xl shadow-black/10 hover:shadow-black/20"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${mytheme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl text-blue-500">dashboard</span>
                                </div>
                                <h4 className={`text-xl font-bold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-white"
                                    }`}>{content?.step_title_2}</h4>
                                <p className={`${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                    } tracking-wide leading-relaxed`}>
                                    {content?.step_description_2}
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className={`p-6 rounded-xl transition-all duration-300 ${mytheme === "light"
                                    ? "bg-white shadow-md hover:shadow-lg"
                                    : "bg-gray-800/50 shadow-lg hover:shadow-xl shadow-black/10 hover:shadow-black/20"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${mytheme === "light" ? "bg-green-100" : "bg-green-900/30"
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl text-green-500">support_agent</span>
                                </div>
                                <h4 className={`text-xl font-bold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-white"
                                    }`}>{content?.step_title_3}</h4>
                                <p className={`${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                    } tracking-wide leading-relaxed`}>
                                    {content?.step_description_3}
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        key={`join-us-section-${locale}`}
                    >
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="h-1 w-10 bg-yellow-500 rounded"></div>
                            <span className={`text-sm font-semibold tracking-wider uppercase ${mytheme === "light" ? "text-gray-500" : "text-gray-400"
                                }`}>{content?.hero_st_ju_title}</span>
                            <div className="h-1 w-10 bg-yellow-500 rounded"></div>
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${mytheme === "light" ? "text-gray-900" : "text-yellow-400"
                            } relative inline-block`}>
                            {content?.title_ju}
                        </h1>
                        <p className={`text-lg max-w-2xl mx-auto ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                            {content?.subtitle_ju}
                        </p>
                    </motion.div>

                    <motion.div
                        className={`rounded-xl p-8 shadow-2xl custom-ant-styles ${mytheme === "light"
                            ? "bg-white shadow-blue-200/60"
                            : "bg-gray-800/80 shadow-black/50"
                            }`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                        key={`form-section-${locale}`}
                    >
                        {formSubmitted ? (
                            <div className="text-center py-8">
                                <div className={`text-5xl mb-4 ${mytheme === "light" ? "text-yellow-600" : "text-yellow-400"
                                    }`}>
                                    <span className="material-symbols-outlined text-6xl">check_circle</span>
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${mytheme === "light" ? "text-gray-900" : "text-white"
                                    }`}>{successText.submitted}</h3>
                                <p className={`${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                    }`}>{successText.thanks}</p>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                name="affiliateForm"
                                onFinish={onFinish}
                                layout="vertical"
                                requiredMark={false}
                                className="space-y-6"
                                initialValues={{
                                    username: '',
                                    referralLink: '',
                                    referralId: '',
                                    email: ''
                                }}
                                key={`form-${locale}`}
                            >
                                <Form.Item
                                    label={
                                        <span className={`font-medium text-lg ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                            }`}>
                                            {content?.title_form_1} <span className="text-yellow-500 text-lg">*</span>
                                        </span>
                                    }
                                    name="username"
                                    rules={[{ required: true, message: `Please input your ${content?.title_form_1.toLowerCase()}!` }]}
                                    className="mb-6"
                                >
                                    <Input
                                        placeholder={placeholders.username}
                                        className={`rounded-md px-4 py-3 border ${mytheme === "light"
                                            ? "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                                            : "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                            }`}
                                        style={{ height: '48px' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span className={`font-medium text-lg ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                            }`}>
                                            {content?.title_form_2} <span className="text-yellow-500 text-lg">*</span>
                                        </span>
                                    }
                                    name="referralLink"
                                    rules={[{ required: true, message: `Please input your ${content?.title_form_2.toLowerCase()}!` }]}
                                    className="mb-6"
                                >
                                    <Input
                                        placeholder={placeholders.referralLink}
                                        className={`rounded-md px-4 py-3 border ${mytheme === "light"
                                            ? "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                                            : "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                            }`}
                                        style={{ height: '48px' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span className={`font-medium text-lg ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                            }`}>
                                            {content?.title_form_3} <span className="text-yellow-500 text-lg">*</span>
                                        </span>
                                    }
                                    name="referralId"
                                    rules={[{ required: true, message: `Please input your ${content?.title_form_3.toLowerCase()}!` }]}
                                    className="mb-6"
                                >
                                    <Input
                                        placeholder={placeholders.referralId}
                                        className={`rounded-md px-4 py-3 border ${mytheme === "light"
                                            ? "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                                            : "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                            }`}
                                        style={{ height: '48px' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span className={`font-medium text-lg ${mytheme === "light" ? "text-gray-700" : "text-gray-300"
                                            }`}>
                                            {content?.title_form_4} <span className="text-yellow-500 text-lg">*</span>
                                        </span>
                                    }
                                    name="email"
                                    rules={[
                                        { required: true, message: `Please input your ${content?.title_form_4.toLowerCase()}!` },
                                        { type: 'email', message: locale === 'vi' ? 'Vui lòng nhập một email hợp lệ!' : locale === 'zh' ? '请输入有效的电子邮件！' : 'Please enter a valid email!' }
                                    ]}
                                    className="mb-6"
                                >
                                    <Input
                                        type="email"
                                        placeholder={placeholders.email}
                                        className={`rounded-md px-4 py-3 border ${mytheme === "light"
                                            ? "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                                            : "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                            }`}
                                        style={{ height: '48px' }}
                                    />
                                </Form.Item>

                                <Form.Item className="mb-0 flex item-center justify-center">
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="idle"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isSubmitting}
                                            className={`w-56 text-black font-bold h-10 px-6 rounded-full mt-6 ${mytheme === "light"
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : "bg-yellow-500 hover:bg-yellow-600"
                                                }`}
                                        >
                                            <span className="text-white text-base">{isSubmitting ? (locale === 'vi' ? "Đang xử lý..." : locale === 'zh' ? "处理中..." : "Processing...") : content?.submit_button_text}</span>
                                        </Button>
                                    </motion.div>
                                </Form.Item>
                            </Form>
                        )}
                    </motion.div>
                </div>

                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
                    
                    .font-inter {
                        font-family: 'Inter', Arial, sans-serif;
                    }
                    
                    .leading-relaxed {
                        line-height: 1.75 !important;
                    }
                    
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }

                    .custom-ant-styles {
                        --ant-color-primary: #FFC800;
                        --ant-color-primary-hover: #FFD700;
                    }
                `}</style>
            </section>
        </ConfigProvider>
    );
}