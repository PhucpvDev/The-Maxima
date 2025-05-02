'use client'

import { usePageTitle } from '@/hooks/usePageTitle'
import ListPost from '@/components/admin/post/listPost'

export default function PostPage() {
  usePageTitle('Danh sách bài viết')
  
  return (
    <ListPost />
  )
}
