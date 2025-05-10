'use client'

import { Layout, theme as antdTheme, ConfigProvider } from 'antd'
import { useState, useEffect, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { IMAGES } from '@/constants/client/theme'
import { motion } from 'framer-motion'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/layout/sidebar'
import MainHeader from '@/components/admin/layout/mainHeader'
import MainBreadcrumb from '@/components/admin/layout/mainBreadcrumb'
import Image from 'next/image'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuth } from '@/hooks/useAuth'

function DashboardContent({ 
  collapsed,
  setCollapsed,
  mytheme,
  isLoading,
  children  // Để children ở cuối là tốt nhất
}: {
  collapsed: boolean,
  setCollapsed: (collapsed: boolean) => void,
  mytheme: string,
  isLoading: boolean,
  children: React.ReactNode
}) {
  const { Content } = Layout
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    NProgress.done()
    return () => {
      NProgress.start()
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  return (
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
  )
}

// Component chính không trực tiếp sử dụng useSearchParams
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { mytheme } = useSelector((state: RootState) => state.theme)
  const [isLoading, setIsLoading] = useState(true)
  const [colorPrimary, setColorPrimary] = useState('#FFC800')

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mytheme === 'light' ? 'light' : 'dark')
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [mytheme])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCSSVariable = (variable: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
      const color = getCSSVariable('--yellow-500') || '#FFC800'
      setColorPrimary(color)
    }
  }, [])

  const themeConfig = {
    token: {
      colorPrimary,
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
              src={IMAGES.LogoMaxima}
              alt="logoAlt"
              width={100}
              priority
              className="drop-shadow-lg"
            />
          </div>
        </motion.div>
      )}
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading dashboard...</p>
          </div>
        </div>
      }>
        <DashboardContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mytheme={mytheme}
          isLoading={isLoading}
        >
          {children}
        </DashboardContent>
      </Suspense>
    </ConfigProvider>
  )
}