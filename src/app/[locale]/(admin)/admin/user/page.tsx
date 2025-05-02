'use client'

import { usePageTitle } from '@/hooks/usePageTitle'
import Users from '@/components/admin/user/listUsers'

export default function UserPage() {
  usePageTitle('Danh sách nhân viên')
  
  return (
    <Users />
  )
}
