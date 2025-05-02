'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Dropdown,
  Image,
  message,
  Modal,
} from 'antd';
import {
  FileAddOutlined,
  SearchOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
  LockOutlined,
  UnlockOutlined,
  FilterOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import FilterPost from '@/components/admin/post/filterPost';
import axios from 'axios';

export default function ListPost() {
  const t = useTranslations('listPost');
  const router = useRouter();
  const locale = useLocale();
  const [searchText, setSearchText] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [postData, setPostData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<
          {
            id: number;
            title: string;
            author: { name: string };
            createdAt: string;
            published: boolean;
            media?: { default?: { url: string } };
            description: string | null;
          }[]
        >('http://localhost:3001/api/posts');
        const sanitizedData = response.data.map((post) => ({
          ...post,
          description: post.description || '',
        }));
        setPostData(sanitizedData);
      } catch (error) {
        message.error(t('fetchError'));
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts based on search and filters
  const filteredPosts = postData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      !filters.published || post.published === filters.published;
    const matchesCreatedDate =
      !filters.createdAtRange ||
      (post.createdAt >= filters.createdAtRange[0] &&
        post.createdAt <= filters.createdAtRange[1]);
    const matchesAuthor =
      !filters.author ||
      post.author.name.toLowerCase().includes(filters.author.toLowerCase());
    return matchesSearch && matchesStatus && matchesCreatedDate && matchesAuthor;
  });

  const showFilter = () => setIsFilterVisible(true);
  const closeFilter = () => setIsFilterVisible(false);
  const handleApplyFilters = (newFilters: any) => setFilters(newFilters);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t('deleteConfirmTitle'),
      content: t('deleteConfirmContent'),
      okText: t('deleteConfirmOk'),
      cancelText: t('deleteConfirmCancel'),
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/posts/${id}`);
          setPostData(postData.filter((post) => post.id !== id));
          setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
          message.success(t('deleteSuccess'));
        } catch (error) {
          message.error(t('deleteError'));
          console.error('Error deleting post:', error);
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t('bulkDeleteWarning'));
      return;
    }

    Modal.confirm({
      title: t('bulkDeleteConfirmTitle'),
      content: t('bulkDeleteConfirmContent', { count: selectedRowKeys.length }),
      okText: t('deleteConfirmOk'),
      cancelText: t('deleteConfirmCancel'),
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) =>
              axios.delete(`http://localhost:3001/api/posts/${id}`)
            )
          );
          setPostData(
            postData.filter((post) => !selectedRowKeys.includes(post.id))
          );
          setSelectedRowKeys([]);
          message.success(t('bulkDeleteSuccess'));
        } catch (error) {
          message.error(t('bulkDeleteError'));
          console.error('Error bulk deleting posts:', error);
        }
      },
    });
  };

  const handleToggleStatus = async (post: any) => {
    const updatedPost = {
      ...post,
      published: !post.published,
      updatedAt: new Date().toISOString(),
    };
    try {
      await axios.put(`http://localhost:3001/api/posts/${post.id}`, updatedPost);
      setPostData(postData.map((p) => (p.id === post.id ? updatedPost : p)));
      message.success(
        t(post.published ? 'unpublishSuccess' : 'publishSuccess', {
          title: post.title,
        })
      );
    } catch (error) {
      message.error(t('toggleStatusError'));
      console.error('Error toggling post status:', error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: t('menuEdit'),
      icon: <EditOutlined />,
      onClick: ({ key }: any) => {
        console.log('Navigating to edit post with ID:', key);
        router.push(`/${locale}/admin/postAdd?id=${key}`);
      },
    },
    {
      key: 'delete',
      label: t('menuDelete'),
      icon: <DeleteOutlined />,
      onClick: ({ key }: any) => handleDelete(Number(key)),
    },
    {
      key: 'toggleStatus',
      label: t('menuToggleStatus'),
      icon: <LockOutlined />,
      onClick: ({ key }: any) => {
        const post = postData.find((p) => p.id === Number(key));
        if (post) handleToggleStatus(post);
      },
    },
  ];

  const columns = [
    {
      title: t('columnTitle'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <Image
            src={record.media?.default?.url || 'https://via.placeholder.com/40'}
            width={40}
            height={40}
            className="rounded-md object-cover"
            placeholder={<Image src="https://via.placeholder.com/40" width={40} height={40} />}
            preview={false}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: t('columnDescription'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string | null | undefined) => (
        <span>
          {text && typeof text === 'string' && text.length > 50
            ? `${text.substring(0, 50)}...`
            : text || '-'}
        </span>
      ),
    },
    {
      title: t('columnAuthor'),
      dataIndex: ['author', 'name'],
      key: 'author',
    },
    {
      title: t('columnCreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: t('columnStatus'),
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'red'}>
          {published ? t('statusPublished') : t('statusDraft')}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items: menuItems.map((item) => ({
                ...item,
                key: item?.key,
                label:
                  item?.key === 'toggleStatus'
                    ? record.published
                      ? t('menuUnpublish')
                      : t('menuPublish')
                    : item?.label,
                icon:
                  item?.key === 'toggleStatus'
                    ? record.published
                      ? <LockOutlined />
                      : <UnlockOutlined />
                    : item?.icon,
                onClick: (info) =>
                  item?.onClick?.({ key: record.id.toString() }),
              })),
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="p-4">
      <style>
        {`
          @media (max-width: 576px) {
            .ant-table {
              font-size: 12px !important;
            }
            .ant-table-thead > tr > th,
            .ant-table-tbody > tr > td {
              padding: 8px !important;
            }
            .ant-btn {
              padding: 4px 8px !important;
              font-size: 12px !important;
            }
            .ant-input {
              font-size: 12px !important;
              padding: 4px 8px !important;
            }
            .ant-tag {
              font-size: 12px !important;
              padding: 2px 6px !important;
            }
            h1 {
              font-size: 20px !important;
            }
            .header-container {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            .search-filter-container {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 8px !important;
            }
            .search-filter-container > * {
              width: 100% !important;
            }
            .ant-image-img {
              width: 32px !important;
              height: 32px !important;
            }
            .ant-table-column-title {
              white-space: nowrap;
            }
            .ant-table-column-content {
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        `}
      </style>

      <div className="flex justify-between items-center mb-4 header-container">
        <h1 className="text-2xl font-bold">
          <FileTextOutlined className="mr-2" /> {t('pageTitle')}
        </h1>
        <Space>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            onClick={() => router.push(`/${locale}/admin/postAdd`)}
          >
            {t('addButton')}
          </Button>
        </Space>
      </div>

      <Space
        className="mb-4 search-filter-container"
        direction="horizontal"
        size="middle"
      >
        <Input
          placeholder={t('searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<FilterOutlined />} onClick={showFilter}>
          {t('filterButton')}
        </Button>
        {selectedRowKeys.length > 0 && (
          <Button danger onClick={handleBulkDelete}>
            {t('bulkDeleteButton', { count: selectedRowKeys.length })}
          </Button>
        )}
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredPosts}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />

      <FilterPost
        visible={isFilterVisible}
        onClose={closeFilter}
        onApply={handleApplyFilters}
      />
    </div>
  );
}