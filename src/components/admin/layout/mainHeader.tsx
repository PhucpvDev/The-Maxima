'use client'

import { MoonOutlined, SunOutlined} from '@ant-design/icons'
import { Button, Tooltip, Switch, Input } from 'antd'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu02Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { toggleTheme } from '@/redux/theme/themeSlice'
import type { GetProps } from 'antd'
import MainHeaderUser from '@/components/admin/layout/mainHeaderUser'
type SearchProps = GetProps<typeof Input.Search>

export default function MainHeader({ collapsed, setCollapsed }: MainHeaderProps) {
    const dispatch = useDispatch()
    const { mytheme } = useSelector((state: RootState) => state.theme)
    const { Search } = Input

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

    return (
        <header
            className={`${mytheme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-700'} p-2 border-b flex items-center justify-between`}
        >
            <div className="flex items-center gap-3">
                <Button
                    type="text"
                    icon={collapsed ? <HugeiconsIcon icon={Menu02Icon} /> : <HugeiconsIcon icon={Menu01Icon} />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-sm p-2"
                />
                <Search placeholder="Tìm kiếm..." allowClear onSearch={onSearch} style={{ width: 200 }} />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <MainHeaderUser />
                <Tooltip title="Theme">
                    <Switch
                        className="hidden sm:inline py-1"
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        checked={mytheme === 'light' ? true : false}
                        onClick={() => dispatch(toggleTheme())}
                    />
                </Tooltip>
            </div>
        </header>
    )
}