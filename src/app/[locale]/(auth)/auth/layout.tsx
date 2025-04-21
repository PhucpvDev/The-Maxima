'use client'

import { Layout } from 'antd'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Layout>
      <main>{children}</main>
    </Layout>
  )
}