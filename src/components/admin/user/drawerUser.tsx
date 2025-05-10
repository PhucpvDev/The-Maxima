'use client'

import { Drawer, Form, Input, Button, Space, Typography, Select, Upload } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useEffect, useCallback } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;
const { Option } = Select;

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

interface FormValues {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  roleId: number;
  codeAff: string;
  avatar?: UploadFile[];
}

interface DrawerAddUserProps {
  visible: boolean;
  editingUser: User | null;
  onSubmit: (values: FormData) => void;
  onClose: () => void;
  roles: Role[];
}

const DrawerAddUser: React.FC<DrawerAddUserProps> = ({
  visible,
  editingUser,
  onSubmit,
  onClose,
  roles,
}) => {
  const t = useTranslations('drawerAddUser');
  const [form] = Form.useForm();

  // Helper function to get avatar URL from various formats
  const getAvatarUrl = useCallback((avatar: User['avatar']): string | undefined => {
    if (!avatar) return undefined;
    if (typeof avatar === 'string') return avatar;
    if (avatar.url) return avatar.url;
    if (avatar.avatar?.url) return avatar.avatar.url;
    return undefined;
  }, []);

  // Get avatar name from various formats
  const getAvatarName = useCallback((avatar: User['avatar']): string => {
    if (!avatar) return 'avatar';
    if (typeof avatar === 'string') {
      const urlParts = avatar.split('/');
      return urlParts[urlParts.length - 1] || 'avatar';
    }
    if (avatar.name) return avatar.name;
    if (avatar.fileName) return avatar.fileName;
    if (avatar.avatar?.name) return avatar.avatar.name;
    return 'avatar';
  }, []);

  // Create file list for avatar upload
  const createAvatarFileList = useCallback((): UploadFile[] => {
    if (!editingUser || !editingUser.avatar) return [];
    const avatarUrl = getAvatarUrl(editingUser.avatar);
    if (!avatarUrl) return [];
    return [{
      uid: '-1',
      name: getAvatarName(editingUser.avatar),
      status: 'done',
      url: avatarUrl
    }];
  }, [editingUser, getAvatarUrl, getAvatarName]);

  // Set initial values when drawer opens or editing user changes
  useEffect(() => {
    if (visible) {
      const initialValues = editingUser
        ? {
            name: editingUser.name || '',
            email: editingUser.email || '',
            roleId: editingUser.roleId || 4,
            codeAff: editingUser.affiliates?.length ? editingUser.affiliates[0].code : editingUser.codeAff || '',
            avatar: createAvatarFileList()
          }
        : {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            codeAff: '',
            roleId: 4,
            avatar: [],
          };

      console.log('Setting form values:', initialValues);
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, editingUser, form, createAvatarFileList]);

  const handleFinish = async (values: FormValues): Promise<void> => {
    const formData = new FormData();
    formData.append('name', values.name || '');
    formData.append('email', values.email || '');
    formData.append('codeAff', values.codeAff || '');

    if (!editingUser) {
      formData.append('password', values.password || '');
      formData.append('confirmPassword', values.confirmPassword || '');
    }

    formData.append('roleId', String(values.roleId));

    // Handle avatar upload
    if (values.avatar && values.avatar.length > 0) {
      const avatarFile = values.avatar[0];
      if (avatarFile.originFileObj) {
        formData.append('avatar', avatarFile.originFileObj);
      } else if (editingUser && !avatarFile.originFileObj) {
        console.log('Using existing avatar, no new upload');
      }
    }

    // Debug: Log formData entries
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(formData);
  };

  const validateConfirmPassword = async (_: unknown, value: string): Promise<void> => {
    const password = form.getFieldValue('password');
    if (value && value !== password) {
      throw new Error(t('confirmPasswordMismatch'));
    }
  };

  const normFile = (e: { fileList: UploadFile[] } | UploadFile[]): UploadFile[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  return (
    <Drawer
      title={
        <div className="text-xl font-semibold text-gray-800">
          {editingUser ? t('editTitle') : t('addTitle')}
        </div>
      }
      placement="right"
      open={visible}
      onClose={onClose}
      width={600}
      styles={{
        body: {
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <div className="space-y-5">
          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('nameLabel')}</Text>
                <InfoCircleOutlined className="ml-2 text-gray-400" />
              </div>
            }
            name="name"
            rules={[
              { required: true, message: t('nameRequired') },
              { min: 2, message: t('nameMinLength') },
            ]}
          >
            <Input
              placeholder={t('namePlaceholder')}
              size="large"
              className="rounded-md border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('emailLabel')}</Text>
                <InfoCircleOutlined className="ml-2 text-gray-400" />
              </div>
            }
            name="email"
            rules={[
              { required: true, message: t('emailRequired') },
              { type: 'email', message: t('emailInvalid') },
            ]}
          >
            <Input
              placeholder={t('emailPlaceholder')}
              size="large"
              type="email"
              className="rounded-md border-gray-300 focus:border-blue-500"
              disabled={!!editingUser}
              style={editingUser ? { backgroundColor: '#f5f5f5', color: '#666' } : {}}
            />
          </Form.Item>

          {!editingUser && (
            <>
              <Form.Item
                label={
                  <div className="flex items-center">
                    <Text className="text-gray-700 font-medium">{t('passwordLabel')}</Text>
                    <InfoCircleOutlined className="ml-2 text-gray-400" />
                  </div>
                }
                name="password"
                rules={[
                  { required: true, message: t('passwordRequired') },
                  { min: 6, message: t('passwordMinLength') },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message: t('passwordStrength'),
                  },
                ]}
              >
                <Input.Password
                  placeholder={t('passwordPlaceholder')}
                  size="large"
                  className="rounded-md border-gray-300 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                label={
                  <div className="flex items-center">
                    <Text className="text-gray-700 font-medium">{t('confirmPasswordLabel')}</Text>
                    <InfoCircleOutlined className="ml-2 text-gray-400" />
                  </div>
                }
                name="confirmPassword"
                rules={[
                  { required: true, message: t('confirmPasswordRequired') },
                  { validator: validateConfirmPassword },
                ]}
              >
                <Input.Password
                  placeholder={t('confirmPasswordPlaceholder')}
                  size="large"
                  className="rounded-md border-gray-300 focus:border-blue-500"
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('roleLabel')}</Text>
                <InfoCircleOutlined className="ml-2 text-gray-400" />
              </div>
            }
            name="roleId"
            rules={[{ required: true, message: t('roleRequired') }]}
          >
            <Select
              placeholder={t('rolePlaceholder')}
              size="large"
              className="rounded-md"
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label={
                <div className="flex items-center">
                  <Text className="text-gray-700 font-medium">{t('avatarLabel')}</Text>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </div>
              }
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: !editingUser,
                  message: t('avatarRequired')
                }
              ]}
            >
              <Upload
                name="avatar"
                listType="picture"
                maxCount={1}
                accept="image/*"
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>{t('avatarUploadButton')}</Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('codeAffLabel')}</Text>
                <InfoCircleOutlined className="ml-2 text-gray-400" />
              </div>
            }
            name="codeAff"
          >
            <Input
              placeholder={t('codeAffPlaceholder')}
              size="large"
              className="rounded-md border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingUser ? t('updateButton') : t('addButton')}
              </Button>
              <Button
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:border-gray-400"
              >
                {t('cancelButton')}
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerAddUser;