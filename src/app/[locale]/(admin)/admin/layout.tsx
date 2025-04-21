'use client'

import { Layout, theme as antdTheme, ConfigProvider } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { IMAGES } from '@/constants/admin/theme'
import { motion } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/admin/layout/sidebar'
import MainHeader from '@/components/admin/layout/mainHeader'
import MainBreadcrumb from '@/components/admin/layout/mainBreadcrumb'
import Image from 'next/image'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { Content } = Layout
    const [collapsed, setCollapsed] = useState(false)
    const { mytheme } = useSelector((state: RootState) => state.theme)
    const [isClient, setIsClient] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        NProgress.configure({ showSpinner: false })
    }, [])

    useEffect(() => {
        NProgress.done()
        return () => {
            NProgress.start()
        }
    }, [pathname, searchParams])

    useEffect(() => {
        setIsClient(true)
        document.documentElement.setAttribute('data-theme', mytheme === 'light' ? 'light' : 'dark')
        const timer = setTimeout(() => setIsLoading(false), 1500)
        return () => clearTimeout(timer)
    }, [mytheme])

    const getCSSVariable = (variable: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    const themeConfig = {
        token: {
            colorPrimary: getCSSVariable('--yellow-500') || '#FFC800',
        },
        algorithm:
            mytheme === 'dark'
                ? antdTheme.darkAlgorithm
                : antdTheme.defaultAlgorithm,
    }

    return (
        <ConfigProvider theme={themeConfig}>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 flex flex-col items-center justify-center z-50"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: '-80%', opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-primary">
                        <Image
                            src={IMAGES.Logo}
                            alt="Logo"
                            width={150}
                            priority
                            className="drop-shadow-lg"
                        />
                    </div>
                </motion.div>
            )}
            <Layout className={`h-screen ${isLoading ? 'hidden' : 'block'}`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Layout>
                    <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                    <MainBreadcrumb />
                    <Content className={`${mytheme === 'light' ? 'bg-white' : 'bg-neutral-900'} mx-3 p-2 rounded-md`}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}