import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const items: MenuItem[] = [
    {
        key: 'admin/dashboard',
        label: 'Bảng điều khiển',
    },
    {
        key: 'admin/post',
        label: 'Bài viết',
    },
]