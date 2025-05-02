'use client'

import { usePageTitle } from '@/hooks/usePageTitle'
import StatisticalAff from '@/components/admin/dashboard/statisticalAff'

export default function DashboardPage() {
  usePageTitle('Bảng điều khiển')
  
  return (
    <StatisticalAff />
  )
}
