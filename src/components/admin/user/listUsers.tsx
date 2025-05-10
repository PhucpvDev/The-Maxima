'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Avatar,
  Badge,
  Spin,
  Tooltip,
} from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useCustomNotification } from '@/components/admin/notification/customNotification';
import DrawerAddUser from '@/components/admin/user/drawerUser';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in cookies');
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Custom interface to type axios-like errors without using AxiosError
interface AxiosErrorLike {
  response?: {
    data?: ErrorResponse;
    status?: number;
  };
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface Affiliate {
  code: string;
  clicks: number;
}

interface User {
  id: number;
  email: string | null;
  name: string | null;
  roleId: number | null;
  loginAttempts: number;
  lastLoginAttempt: string;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    description: string;
    permissions?: Array<{
      id: number;
      roleId: number;
      permissionId: number;
      permission: {
        id: number;
        name: string;
        description: string;
      };
    }>;
  };
  affiliates: Affiliate[];
  avatar?: {
    id?: number;
    fileName?: string;
    name?: string;
    url?: string;
    avatar?: {
      id?: number;
      fileName?: string;
      name?: string;
      url?: string;
    };
  } | string | null;
  status?: 'active' | 'inactive';
  codeAff?: string | null;
}

interface ErrorResponse {
  message?: string | string[];
}

interface ApiResponse {
  data?: User[];
}

export default function Users() {
  const t = useTranslations('users');
  const [searchText, setSearchText] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { showNotification, contextHolder } = useCustomNotification();

  // Refs to manage state
  const initializedRef = useRef(false);
  const userRoleFetchedRef = useRef(false);

  const getAvatarUrl = (avatar: User['avatar']): string | undefined => {
    if (!avatar) return undefined;
    if (typeof avatar === 'string') return avatar;
    if (avatar.url) return avatar.url;
    if (avatar.avatar?.url) return avatar.avatar.url;
    return undefined;
  };

  const fetchCurrentUserRoleFromCookie = useCallback(() => {
    try {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        const user = JSON.parse(userCookie);
        setCurrentUserRole(user.role || null);
      } else {
        console.warn('User cookie not found');
        setCurrentUserRole(null);
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      showNotification({
        message: 'Failed to parse user information from cookie',
        showProgress: true,
      });
      setCurrentUserRole(null);
    }
  }, [showNotification]);

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get<Role[]>('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUsers = useCallback(async () => {
    if (currentUserRole !== 'admin') {
      setUserData([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get<User[] | ApiResponse>('/users');
      const users: User[] = Array.isArray(response.data) ? response.data : response.data.data || [];

      if (!Array.isArray(users)) {
        throw new Error('Expected users to be an array');
      }

      const mappedUsers = users.map((user: User) => ({
        ...user,
        status: user.loginAttempts < 5 ? 'active' : 'inactive' as 'active' | 'inactive',
      }));

      setUserData(mappedUsers);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      const errorResponse = (error as AxiosErrorLike).response?.data;
      showNotification({
        message:
          typeof errorResponse?.message === 'string'
            ? errorResponse.message
            : JSON.stringify(errorResponse?.message || 'Failed to fetch users'),
        showProgress: true,
      });
      setUserData([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserRole, showNotification]);

  const createUserApi = async (formData: FormData) => {
    if (currentUserRole !== 'admin') {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return null;
    }
    try {
      const response = await apiClient.post<User>('/users', formData);
      showNotification({
        message: t('addSuccess'),
        showProgress: true,
      });
      fetchUsers();
      return response.data;
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      const errorResponse = (error as AxiosErrorLike).response?.data;
      const errorMessage =
        typeof errorResponse?.message === 'string'
          ? errorResponse.message
          : JSON.stringify(errorResponse?.message || 'Failed to create user');
      showNotification({
        message: errorMessage,
        showProgress: true,
      });
      return null;
    }
  };

  const updateUserApi = async (id: number, formData: FormData) => {
    if (currentUserRole !== 'admin') {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return null;
    }
    try {
      const formDataObj: { [key: string]: FormDataEntryValue } = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      // Keep roleId as string and validate
      if (formDataObj.roleId) {
        const roleIdNum = Number(formDataObj.roleId);
        if (isNaN(roleIdNum) || roleIdNum <= 0) {
          formDataObj.roleId = String(roles[0]?.id ?? 4);
        }
      } else {
        formDataObj.roleId = String(roles[0]?.id ?? 4);
      }

      if (!formDataObj.avatar || !(formDataObj.avatar instanceof File)) {
        const jsonData: { [key: string]: string | number } = {};
        formData.forEach((value, key) => {
          if (key !== 'avatar' && value !== '' && typeof value === 'string') {
            jsonData[key] = key === 'roleId' ? Number(value) : value;
          }
        });
        const response = await apiClient.patch<User>(`/users/${id}`, jsonData);
        showNotification({
          message: t('updateSuccess'),
          showProgress: true,
        });
        fetchUsers();
        return response.data;
      } else {
        formData.delete('roleId');
        formData.append('roleId', String(formDataObj.roleId));
        const response = await apiClient.patch<User>(`/users/${id}`, formData);
        showNotification({
          message: t('updateSuccess'),
          showProgress: true,
        });
        fetchUsers();
        return response.data;
      }
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      const errorResponse = (error as AxiosErrorLike).response?.data;
      const errorMessage =
        typeof errorResponse?.message === 'string'
          ? errorResponse.message
          : JSON.stringify(errorResponse?.message || 'Failed to update user');
      showNotification({
        message: errorMessage,
        showProgress: true,
      });
      return null;
    }
  };

  const deleteUserApi = async (id: number, retries = 1): Promise<boolean> => {
    if (currentUserRole !== 'admin') {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return false;
    }
    try {
      await apiClient.delete(`/users/${id}`);
      return true;
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      const errorResponse = (error as AxiosErrorLike).response?.data;
      const status = (error as AxiosErrorLike).response?.status;

      if (status === 401 && retries > 0) {
        showNotification({
          message: 'Authentication failed, retrying...',
          showProgress: true,
        });
        return deleteUserApi(id, retries - 1);
      }

      const errorMessage =
        typeof errorResponse?.message === 'string'
          ? errorResponse.message
          : JSON.stringify(errorResponse?.message || 'Failed to delete user');
      showNotification({
        message: errorMessage,
        showProgress: true,
      });
      return false;
    }
  };

  // Initialize data - replaces useEffect
  if (!initializedRef.current) {
    initializedRef.current = true;
    fetchCurrentUserRoleFromCookie();
  }

  // Handle after currentUserRole is set - replaces useEffect
  if (currentUserRole && !userRoleFetchedRef.current) {
    userRoleFetchedRef.current = true;
    fetchUsers();
    fetchRoles();
  }

  const filteredUsers = userData.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.affiliates.some((affiliate) =>
        affiliate.code.toLowerCase().includes(searchText.toLowerCase())
      );
    return matchesSearch;
  });

  const showDrawer = (user: User | null = null) => {
    if (currentUserRole !== 'admin' && user !== null) {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return;
    }
    setEditingUser(user);
    setIsDrawerVisible(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (currentUserRole !== 'admin') {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return;
    }
    if (editingUser) {
      const result = await updateUserApi(editingUser.id, formData);
      if (result) {
        setIsDrawerVisible(false);
        setEditingUser(null);
      }
    } else {
      const result = await createUserApi(formData);
      if (result) {
        setIsDrawerVisible(false);
      }
    }
  };

  const handleClose = () => {
    setIsDrawerVisible(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteUserApi(id);
    if (success) {
      showNotification({
        message: t('deleteSuccess'),
        showProgress: true,
      });
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
      await fetchUsers();
    }
  };

  const rowSelection =
    currentUserRole === 'admin'
      ? {
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }
      : undefined;

  const getMenuItems = (record: User): MenuProps['items'] => {
    if (currentUserRole !== 'admin') return [];
    return [
      {
        key: 'edit',
        label: t('menuEdit'),
        icon: <EditOutlined />,
        onClick: () => showDrawer(record),
      },
      {
        key: 'delete',
        label: t('menuDelete'),
        icon: <DeleteOutlined />,
        onClick: () => handleDelete(record.id),
      },
    ];
  };

  const columns = [
    {
      title: t('columnName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <Space>
          <Badge dot={record.status === 'active'} color="green">
            <Avatar src={getAvatarUrl(record.avatar)} icon={<UserOutlined />} size={40} />
          </Badge>
          <span>{text || '-'}</span>
        </Space>
      ),
    },
    {
      title: t('columnEmail'),
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <MailOutlined />
          <span>{text || '-'}</span>
        </Space>
      ),
    },
    {
      title: t('columnRole'),
      key: 'role',
      render: (_: unknown, record: User) => (
        <span className="capitalize">{record.role?.name || '-'}</span>
      ),
    },
    {
      title: t('columnAffiliateId'),
      key: 'affiliateId',
      render: (_: unknown, record: User) => {
        const affiliate = record.affiliates.length > 0 ? record.affiliates[0] : null;
        return affiliate ? affiliate.code : record.codeAff || '-';
      },
    },
    {
      title: t('columnClicks'),
      key: 'clicks',
      render: (_: unknown, record: User) => {
        const affiliate = record.affiliates.length > 0 ? record.affiliates[0] : null;
        const clicks = affiliate ? affiliate.clicks : 0;
        return (
          <Tooltip title={t('tooltipClicks')}>
            <span className="cursor-pointer text-blue-500 hover:underline">
              {clicks.toLocaleString()}
            </span>
          </Tooltip>
        );
      },
      sorter: (a: User, b: User) => {
        const aClicks = a.affiliates.length > 0 ? a.affiliates[0].clicks : 0;
        const bClicks = b.affiliates.length > 0 ? b.affiliates[0].clicks : 0;
        return aClicks - bClicks;
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items: getMenuItems(record),
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {contextHolder}
      <style jsx>{`
        @media (max-width: 576px) {
          .ant-table {
            font-size: 12px !important;
          }
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            padding: 8px !important;
          }
          .ant-card-body {
            padding: 12px !important;
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
          .ant-avatar {
            width: 32px !important;
            height: 32px !important;
            line-height: 32px !important;
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
          .header-actions {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .search-filter-container > *,
          .header-actions > * {
            width: 100% !important;
          }
          .ant-drawer {
            width: 90% !important;
            max-width: 320px !important;
          }
          .ant-drawer-title {
            font-size: 16px !important;
          }
          .ant-drawer-body {
            padding: 16px !important;
          }
          .ant-drawer-footer .ant-btn {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }
          .ant-table-column-title {
            white-space: nowrap;
          }
          .ant-table-column-content {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-4 header-container">
        {currentUserRole === 'admin' && (
          <h1 className="text-2xl font-bold">
            <TeamOutlined className="mr-2" /> {t('pageTitle')}
          </h1>
        )}
        {currentUserRole === 'admin' && (
          <Space className="header-actions">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => showDrawer()}
            >
              {t('addButton')}
            </Button>
          </Space>
        )}
      </div>

      <Space className="mb-4 search-filter-container" direction="horizontal" size="middle">
        {currentUserRole === 'admin' && (
          <Input
            placeholder={t('searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        )}
      </Space>

      {currentUserRole === 'admin' ? (
        loading ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{
              pageSize: 10,
            }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <div className="text-center text-xl p-8">
            <p>{t('noUsersFound')}</p>
          </div>
        )
      ) : (
        <div className="text-center text-xl p-8">
          <p>{t('onlyAdminCanViewList')}</p>
        </div>
      )}

      <DrawerAddUser
        visible={isDrawerVisible}
        editingUser={editingUser}
        onSubmit={handleSubmit}
        onClose={handleClose}
        roles={roles}
      />
    </div>
  );
}