'use client'

import { Drawer, Form, Input, Button, Space, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const { Text } = Typography;

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
  fullname: string | null; 
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
  fullname: string; 
  codeAff: string;
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
}) => {
  const t = useTranslations('drawerAddUser');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      const initialValues = editingUser
        ? {
            name: editingUser.name || '',
            email: editingUser.email || '',
            fullname: editingUser.fullname || '', 
            codeAff: editingUser.affiliates?.length ? editingUser.affiliates[0].code : editingUser.codeAff || '',
          }
        : {
            name: '',
            email: '',
            fullname: '',
            codeAff: '',
          };

      console.log('Setting form values:', initialValues);
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, editingUser, form]);

  const handleFinish = async (values: FormValues): Promise<void> => {
    const formData = new FormData();
    formData.append('name', values.name || '');
    formData.append('email', values.email || '');
    formData.append('fullname', values.fullname || ''); 
    formData.append('codeAff', values.codeAff || '');

    if (!editingUser) {
      formData.append('password', 'Password123@');
      formData.append('confirmPassword', 'Password123@');
      formData.append('roleId', '4'); 
      formData.append('avatar', 'https://example.com/default-avatar.png');
    } else {
      formData.append('roleId', String(editingUser.roleId || 4));
      if (editingUser.avatar) {
        const avatarUrl = typeof editingUser.avatar === 'string' ? editingUser.avatar : editingUser.avatar.url || '';
        if (avatarUrl) {
          formData.append('avatar', avatarUrl);
        }
      }
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(formData);
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
                <Text className="text-gray-700 font-medium">{t('fullnameLabel')}</Text>
              </div>
            }
            name="fullname"
          >
            <Input
              placeholder={t('fullnamePlaceholder')}
              size="large"
              className="rounded-md border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          
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