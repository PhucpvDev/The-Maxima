'use client'

import { Drawer, Form, Input, Button, Space, Typography, Select } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

const { Text } = Typography;
const { Option } = Select;

interface Role {
  id: number;
  name: string;
  description: string;
}

interface DrawerAddUserProps {
  visible: boolean;
  editingUser: any;
  onSubmit: (values: any) => void;
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

  const getAvatarUrl = (avatar: any): string | undefined => {
    if (!avatar) return undefined;
    if (typeof avatar === 'string') return avatar;
    if (avatar.url) return avatar.url;
    if (avatar.avatar && avatar.avatar.url) return avatar.avatar.url;
    return undefined;
  };

  const getAvatarName = (avatar: any): string => {
    if (!avatar) return 'avatar';
    if (typeof avatar === 'string') {
      const urlParts = avatar.split('/');
      return urlParts[urlParts.length - 1] || 'avatar';
    }
    if (avatar.name) return avatar.name;
    if (avatar.fileName) return avatar.fileName;
    if (avatar.avatar && avatar.avatar.name) return avatar.avatar.name;
    return 'avatar';
  };

  const createAvatarFileList = () => {
    if (!editingUser || !editingUser.avatar) return [];
    const avatarUrl = getAvatarUrl(editingUser.avatar);
    if (!avatarUrl) return [];
    return [
      {
        uid: '-1',
        name: getAvatarName(editingUser.avatar),
        status: 'done',
        url: avatarUrl,
      },
    ];
  };

  useEffect(() => {
    if (visible) {
      const initialValues = editingUser
        ? {
            name: editingUser.name || '',
            email: editingUser.email || '',
            codeAff:
              editingUser.affiliates && editingUser.affiliates.length > 0
                ? editingUser.affiliates[0].code
                : '',
            roleId: editingUser.roleId ? Number(editingUser.roleId) : roles[0]?.id || 4,
            avatar: createAvatarFileList(),
          }
        : {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            codeAff: '',
            roleId: roles[0]?.id || 4,
            avatar: [],
          };
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, editingUser, form, roles]);

  const handleFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name || '');
    formData.append('email', values.email || '');
    formData.append('codeAff', values.codeAff || '');
    if (!editingUser) {
      formData.append('password', values.password || '');
      formData.append('confirmPassword', values.confirmPassword || '');
    }
    if (values.roleId) {
      formData.append('roleId', Number(values.roleId).toString());
    } else {
      formData.append('roleId', (roles[0]?.id || 4).toString());
    }
    if (values.avatar && values.avatar.length > 0) {
      const avatarFile = values.avatar[0];
      if (avatarFile.originFileObj) {
        formData.append('avatar', avatarFile.originFileObj);
      }
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
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