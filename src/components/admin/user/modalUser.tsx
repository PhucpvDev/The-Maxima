'use client'

import { Modal, Form, Input, DatePicker, Switch, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import moment from 'moment';

const { Text } = Typography;

interface ModalAddUserProps {
  isModalVisible: boolean;
  editingUser: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const ModalAddUser: React.FC<ModalAddUserProps> = ({
  isModalVisible,
  editingUser,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslations('modalAddUser');
  const [form] = Form.useForm();

  const initialValues = editingUser
    ? {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        affiliateId: editingUser.affiliateId,
        joinDate: editingUser.joinDate ? moment(editingUser.joinDate) : null,
        status: editingUser.status === 'active',
      }
    : {
        name: '',
        email: '',
        phone: '',
        affiliateId: '',
        joinDate: null,
        status: true,
      };

  const handleModalOpen = (open: boolean) => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  };

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : '',
      status: values.status ? 'active' : 'inactive',
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold text-gray-800">
          {editingUser ? t('editTitle') : t('addTitle')}
        </div>
      }
      open={isModalVisible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      okText={editingUser ? t('updateButton') : t('addButton')}
      cancelText={t('cancelButton')}
      okButtonProps={{
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
      }}
      cancelButtonProps={{
        className: 'border-gray-300 text-gray-700 hover:border-gray-400',
      }}
      width={600}
      centered
      styles={{
        body: {
          padding: '14px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
        },
      }}
      afterOpenChange={handleModalOpen}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <div className="space-y-5">
          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('nameLabel')}</Text>
                <Tooltip title={t('nameTooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
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
                <Tooltip title={t('emailTooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
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
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('phoneLabel')}</Text>
                <Tooltip title={t('phoneTooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
              </div>
            }
            name="phone"
            rules={[
              { required: true, message: t('phoneRequired') },
              {
                pattern: /^[0-9]{10,11}$/,
                message: t('phoneInvalid'),
              },
            ]}
          >
            <Input
              placeholder={t('phonePlaceholder')}
              size="large"
              type="tel"
              className="rounded-md border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('affiliateIdLabel')}</Text>
                <Tooltip title={t('affiliateIdTooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
              </div>
            }
            name="affiliateId"
            rules={[
              { required: true, message: t('affiliateIdRequired') },
              {
                pattern: /^AFF\d{3}$/,
                message: t('affiliateIdInvalid'),
              },
            ]}
          >
            <Input
              placeholder={t('affiliateIdPlaceholder')}
              size="large"
              className="rounded-md border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center">
                <Text className="text-gray-700 font-medium">{t('joinDateLabel')}</Text>
                <Tooltip title={t('joinDateTooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
              </div>
            }
            name="joinDate"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder={t('joinDatePlaceholder')}
              size="large"
              className="rounded-md border-gray-300 focus:border-blue-500"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            label={
              <Text className="text-gray-700 font-medium">{t('statusLabel')}</Text>
            }
            name="status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={t('statusActive')}
              unCheckedChildren={t('statusInactive')}
              className="bg-gray-300"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddUser;