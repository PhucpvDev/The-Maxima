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

  // Hàm tạo email duy nhất
  const generateUniqueEmail = (name: string) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8); // Chuỗi ngẫu nhiên 6 ký tự
    const sanitizedName = (name || 'user').toLowerCase().replace(/[^a-z0-9]/g, ''); // Làm sạch tên
    return `${sanitizedName}_${timestamp}_${random}@example.com`;
  };

  useEffect(() => {
    if (visible) {
      const initialValues = editingUser
        ? {
            name: editingUser.name || '',
            codeAff: editingUser.affiliates?.length ? editingUser.affiliates[0].code : editingUser.codeAff || '',
          }
        : {
            name: '',
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
    formData.append('codeAff', values.codeAff || '');

    // Tạo email duy nhất khi thêm người dùng mới, giữ nguyên email khi chỉnh sửa
    const email = editingUser ? editingUser.email || 'default@example.com' : generateUniqueEmail(values.name);
    formData.append('email', email);
    formData.append('roleId', String(editingUser?.roleId || 4));
    if (!editingUser) {
      formData.append('password', 'Password123@');
      formData.append('confirmPassword', 'Password123@');
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