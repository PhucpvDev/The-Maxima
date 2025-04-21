'use client'

import React, { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { items } from '@/constants/admin/menu'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { IMAGES } from '@/constants/admin/theme'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface SidebarProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const { Sider } = Layout
    const { mytheme } = useSelector((state: RootState) => state.theme)
    const router = useRouter()
    const pathname = usePathname()
    
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1'])
    const [openKeys, setOpenKeys] = useState<string[]>(['sub1'])
    
    useEffect(() => {
        const findKeyByPath = (items: any[]): string | null => {
            for (const item of items) {
                const itemRoute = item.key
                
                const parts = pathname.split('/')
                const pagePath = parts.length >= 3 ? parts[2] : ''
                
                if (pagePath === itemRoute) {
                    return item.key
                }
                
                if (item.children) {
                    const key = findKeyByPath(item.children)
                    if (key) return key
                }
            }
            return null
        }
        
        const activeKey = findKeyByPath(items)
        
        if (activeKey) {
            setSelectedKeys([activeKey])
            
            const findParentKey = (items: any[], targetKey: string): string | null => {
                for (const item of items) {
                    if (item.children && item.children.some((child: any) => child.key === targetKey)) {
                        return item.key
                    }
                }
                return null
            }
            
            const parentKey = findParentKey(items, activeKey)
            if (parentKey) {
                setOpenKeys([parentKey])
            }
        }
    }, [pathname])
    
    const onClick: MenuProps['onClick'] = (e) => {
        
        const locale = pathname.split('/')[1]
        
        const routePath = `/${locale}/${e.key}`
        router.push(routePath)
        
        setSelectedKeys([e.key])
    }
    
    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        setOpenKeys(keys as string[])
    }
    
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme='light'
            className={`${mytheme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-700'} border-r`}
        >
            <div className={`${mytheme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-700'} p-2 flex border-b items-center justify-between`}>
                <Image
                    src={IMAGES.Logo}
                    alt="Logo"
                    height={32}
                    priority
                />
            </div>
            <Menu
                onClick={onClick}
                selectedKeys={selectedKeys}
                openKeys={collapsed ? [] : openKeys}
                onOpenChange={onOpenChange}
                mode="inline"
                items={items}
                theme='light'
            />
        </Sider>
    )
}