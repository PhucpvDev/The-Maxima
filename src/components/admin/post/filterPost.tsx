'use client';

import { Drawer, Form, Button, Select, DatePicker, Input, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterPostProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterPost: React.FC<FilterPostProps> = ({ visible, onClose, onApply }) => {
  const t = useTranslations('filterPost');
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const formattedValues = {
      published: values.published !== undefined ? values.published === 'true' : undefined,
      createdAtRange: values.createdAtRange
        ? [
            values.createdAtRange[0]?.format('YYYY-MM-DD'),
            values.createdAtRange[1]?.format('YYYY-MM-DD'),
          ]
        : undefined,
      author: values.author || undefined,
    };
    onApply(formattedValues);
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    onApply({});
  };

  return (
    <Drawer
      title={t('title')}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          published: undefined,
          createdAtRange: undefined,
          author: undefined,
        }}
      >
        <Form.Item label={t('publishedLabel')} name="published">
          <Select placeholder={t('publishedPlaceholder')} allowClear>
            <Option value="true">{t('statusPublished')}</Option>
            <Option value="false">{t('statusDraft')}</Option>
          </Select>
        </Form.Item>

        <Form.Item label={t('createdAtLabel')} name="createdAtRange">
          <RangePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={[t('createdAtFromPlaceholder'), t('createdAtToPlaceholder')]}
          />
        </Form.Item>

        <Form.Item label={t('authorLabel')} name="author">
          <Input placeholder={t('authorPlaceholder')} allowClear />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {t('applyButton')}
            </Button>
            <Button onClick={handleReset}>
              {t('resetButton')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterPost;