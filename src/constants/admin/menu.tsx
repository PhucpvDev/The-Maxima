'use client'

import type { MenuProps } from 'antd'
import { useTranslations } from 'next-intl'

type MenuItem = Required<MenuProps>['items'][number]

export const AdminMenu = () => {
  const t = useTranslations('adminMenu')

  const items: MenuItem[] = [
    {
      key: 'admin/dashboard',
      label: t('dashboard'),  
    },
    {
      key: 'admin/user',
      label: t('user'),      
    },
    {
      key: 'admin/contact',
      label: t('contact'),   
    },
    {
      key: 'admin/affiliate',
      label: t('affiliate'),  
    },
  ]

  return items
}