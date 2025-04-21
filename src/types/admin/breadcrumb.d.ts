interface BreadcrumbItem {
    title: string
    path: string
}

interface MenuItem {
    key: string
    label: string
    children?: MenuItem[]
}