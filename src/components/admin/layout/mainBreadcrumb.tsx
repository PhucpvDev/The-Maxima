'use client'

import { Breadcrumb, Typography } from 'antd'
import { usePathname } from 'next/navigation'
import { items } from '@/constants/admin/menu'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'

export default function BreadcrumbWithTitle() {
  const pathname = usePathname()
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([])
  const { mytheme } = useSelector((state: RootState) => state.theme)
  const { title: reduxTitle } = useSelector((state: RootState) => state.title)
  const { Title } = Typography

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const buildBreadcrumbItems = () => {
      const result: BreadcrumbItem[] = []
      let currentItems = items as MenuItem[]
      let currentPath = ''
      for (const segment of pathSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`
        const matchingItem = currentItems.find(item => {
          return item.key === segment || item.key === currentPath || `/${item.key}` === currentPath
        })
        if (matchingItem) {
          result.push({
            title: matchingItem.label,
            path: currentPath
          })
          if (matchingItem.children) {
            currentItems = matchingItem.children
          }
        } else {
          result.push({
            title: segment.charAt(0).toUpperCase() + segment.slice(1),
            path: currentPath
          })
        }
      }
      return result
    }
    setBreadcrumbItems(buildBreadcrumbItems())
  }, [pathname])

  const displayTitle = reduxTitle || (breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1].title : '')

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
        <div>
          <Title
            level={5}
            className={`m-0 ${mytheme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            {displayTitle}
          </Title>
        </div>
      </div>
      <Breadcrumb items={antdBreadcrumbItems}/>
    </div>
  )
}