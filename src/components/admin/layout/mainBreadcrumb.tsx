'use client'

import { Breadcrumb } from 'antd'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type BreadcrumbItem = {
  title: string;
  path: string;
}

export default function BreadcrumbWithTitle() {
  const pathname = usePathname()
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([])
  const t = useTranslations('adminMenu')
  
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const buildBreadcrumbItems = () => {
      const result: BreadcrumbItem[] = []

      let currentPath = ''
      
      for (const segment of pathSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`
      }
      return result
    }
    
    setBreadcrumbItems(buildBreadcrumbItems())
  }, [pathname, t])
  
  const antdBreadcrumbItems = breadcrumbItems.map((item, index) => {
    if (index < breadcrumbItems.length - 1) {
      return {
        title: <Link href={item.path} className="text-sm">{item.title}</Link>
      }
    }
    return {
      title: <span className="text-sm">{item.title}</span>
    }
  })
  
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        {/* Your commented title section */}
      </div>
      <Breadcrumb items={antdBreadcrumbItems}/>
    </div>
  )
}