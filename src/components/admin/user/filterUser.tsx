'use client'

import { Drawer, Form, Button, Select, DatePicker, InputNumber, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterUserProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const FilterUser: React.FC<FilterUserProps> = ({ visible, onClose, onApply }) => {
    const t = useTranslations('filterUser');
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        const formattedValues = {
            status: values.status || undefined,
            joinDateRange: values.joinDateRange
                ? [
                    values.joinDateRange[0]?.format('YYYY-MM-DD'),
                    values.joinDateRange[1]?.format('YYYY-MM-DD'),
                ]
                : undefined,
            totalSalesRange: values.totalSalesRange
                ? [values.totalSalesRange[0], values.totalSalesRange[1]]
                : undefined,
            commissionRange: values.commissionRange
                ? [values.commissionRange[0], values.commissionRange[1]]
                : undefined,
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
                    status: undefined,
                    joinDateRange: undefined,
                    totalSalesRange: undefined,
                    commissionRange: undefined,
                }}
            >
                <Form.Item label={t('statusLabel')} name="status">
                    <Select placeholder={t('statusPlaceholder')} allowClear>
                        <Option value="active">{t('statusActive')}</Option>
                        <Option value="inactive">{t('statusInactive')}</Option>
                    </Select>
                </Form.Item>

                <Form.Item label={t('joinDateLabel')} name="joinDateRange">
                    <RangePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        placeholder={[t('joinDateFromPlaceholder'), t('joinDateToPlaceholder')]}
                    />
                </Form.Item>

                <Form.Item label={t('totalSalesLabel')} name="totalSalesRange">
                    <Space>
                        <Form.Item name={['totalSalesRange', 0]} noStyle>
                            <InputNumber
                                min={0}
                                placeholder={t('rangeFromPlaceholder')}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => {
                                    const parsed = value?.replace(/\$\s?|(,*)/g, '');
                                    return parsed ? Number(parsed) : 0;
                                }}
                            />
                        </Form.Item>
                        <span>-</span>
                        <Form.Item name={['totalSalesRange', 1]} noStyle>
                            <InputNumber
                                min={0}
                                placeholder={t('rangeToPlaceholder')}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                            />
                        </Form.Item>
                    </Space>
                </Form.Item>

                <Form.Item label={t('commissionLabel')} name="commissionRange">
                    <Space>
                        <Form.Item name={['commissionRange', 0]} noStyle>
                            <InputNumber
                                min={0}
                                placeholder={t('rangeFromPlaceholder')}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                            />
                        </Form.Item>
                        <span>-</span>
                        <Form.Item name={['commissionRange', 1]} noStyle>
                            <InputNumber
                                min={0}
                                placeholder={t('rangeToPlaceholder')}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                            />
                        </Form.Item>
                    </Space>
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

export default FilterUser;