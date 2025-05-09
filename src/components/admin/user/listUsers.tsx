'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Tag,
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
  baseURL: 'http://localhost:3001/api',
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

interface Role {
  id: number;
  name: string;
  description: string;
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
  affiliates: string;
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

  const getAvatarUrl = (avatar: any): string | undefined => {
    if (!avatar) return undefined;
    if (typeof avatar === 'string') return avatar;
    if (avatar.url) return avatar.url;
    if (avatar.avatar && avatar.avatar.url) return avatar.avatar.url;
    return undefined;
  };

  const fetchCurrentUserRoleFromCookie = () => {
    try {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        const user = JSON.parse(userCookie);
        setCurrentUserRole(user.role || null);
      } else {
        console.warn('User cookie not found');
        setCurrentUserRole(null);
      }
    } catch (error: any) {
      console.error('Error parsing user cookie:', error);
      showNotification({
        message: 'Failed to parse user information from cookie',
        showProgress: true,
      });
      setCurrentUserRole(null);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get('/roles');
      setRoles(response.data);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUsers = async () => {
    if (currentUserRole !== 'admin') {
      setUserData([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      let users = response.data;

      if (!Array.isArray(users) && users.data) {
        users = users.data;
      }

      if (!Array.isArray(users)) {
        throw new Error('Expected users to be an array');
      }

      const mappedUsers = users.map((user: User) => ({
        ...user,
        status: user.loginAttempts < 5 ? 'active' : 'inactive',
      }));

      setUserData(mappedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showNotification({
        message: error.response?.data?.message || 'Failed to fetch users',
        showProgress: true,
      });
      setUserData([]);
    } finally {
      setLoading(false);
    }
  };

  const createUserApi = async (formData: FormData) => {
    if (currentUserRole !== 'admin') {
      showNotification({
        message: t('unauthorizedAction'),
        showProgress: true,
      });
      return null;
    }
    try {
      const response = await apiClient.post('/users', formData);
      showNotification({
        message: t('addSuccess'),
        showProgress: true,
      });
      fetchUsers();
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error.response?.data || error.message);
      const errorMessage =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : JSON.stringify(error.response?.data?.message || 'Failed to create user');
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
      const formDataObj: any = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
  
      if (formDataObj.roleId) {
        formDataObj.roleId = Number(formDataObj.roleId);
        if (isNaN(formDataObj.roleId) || formDataObj.roleId <= 0) {
          formDataObj.roleId = roles[0]?.id || 4;
        }
      } else {
        formDataObj.roleId = roles[0]?.id || 4;
      }
  
      if (!formDataObj.avatar || !(formDataObj.avatar instanceof File)) {
        const jsonData: any = {};
        formData.forEach((value, key) => {
          if (key !== 'avatar' && value !== '') {
            jsonData[key] = key === 'roleId' ? Number(value) : value;
          }
        });
        const response = await apiClient.patch(`/users/${id}`, jsonData);
        showNotification({
          message: t('updateSuccess'),
          showProgress: true,
        });
        fetchUsers();
        return response.data;
      } else {
        formData.delete('roleId');
        formData.append('roleId', String(formDataObj.roleId));
        const response = await apiClient.patch(`/users/${id}`, formData);
        showNotification({
          message: t('updateSuccess'),
          showProgress: true,
        });
        fetchUsers();
        return response.data;
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : JSON.stringify(error.response?.data?.message || 'Failed to update user');
      showNotification({
        message: errorMessage,
        showProgress: true,
      });
      return null;
    }
  };

  const deleteUserApi = async (id: number, retries = 1) => {
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
    } catch (error: any) {
      console.error('Error deleting user:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.status === 401 && retries > 0) {
        showNotification({
          message: 'Authentication failed, retrying...',
          showProgress: true,
        });
        return deleteUserApi(id, retries - 1);
      }

      const errorMessage =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : JSON.stringify(error.response?.data?.message || 'Failed to delete user');
      showNotification({
        message: errorMessage,
        showProgress: true,
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCurrentUserRoleFromCookie();
  }, []);

  useEffect(() => {
    if (currentUserRole) {
      fetchUsers();
      fetchRoles();
    }
  }, [currentUserRole]);

  const filteredUsers = userData.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.affiliates &&
        user.affiliates.length > 0 &&
        user.affiliates[0].code.toLowerCase().includes(searchText.toLowerCase()));
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
      render: (_, record: User) => <span className="capitalize">{record.role?.name || '-'}</span>,
    },
    {
      title: t('columnAffiliateId'),
      key: 'affiliateId',
      render: (_, record: User) => {
        const affiliate =
          record.affiliates && record.affiliates.length > 0 ? record.affiliates[0] : null;
        return affiliate ? affiliate.code : '-';
      },
    },
    {
      title: t('columnClicks'),
      key: 'clicks',
      render: (_, record: User) => {
        const affiliate =
          record.affiliates && record.affiliates.length > 0 ? record.affiliates[0] : null;
        const clicks = affiliate ? affiliate.clicks : 0;
        return (
          <Tooltip title={t('tooltipClicks')}>
            <span className="cursor-pointer text-blue-500 hover:underline">
              {clicks.toLocaleString()}
            </span>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        const aClicks =
          a.affiliates && a.affiliates.length > 0 ? a.affiliates[0].clicks : 0;
        const bClicks =
          b.affiliates && b.affiliates.length > 0 ? b.affiliates[0].clicks : 0;
        return aClicks - bClicks;
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: User) => (
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