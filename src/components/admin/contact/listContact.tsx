'use client';

import { useState, useEffect } from 'react';
import { Table, Space, Button, Spin, Input } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useCustomNotification } from '@/components/admin/notification/customNotification';
import axios from 'axios';
import Cookies from 'js-cookie';


const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No token found in cookies');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);


interface ContactEmail {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export default function ListContact() {
    const t = useTranslations('contactEmails');
    const [loading, setLoading] = useState(false);
    const [contactEmails, setContactEmails] = useState<ContactEmail[]>([]);
    const [searchText, setSearchText] = useState('');
    const { showNotification, contextHolder } = useCustomNotification();

    const fetchContactEmails = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/form-emails');
            let emails = response.data;

            if (!Array.isArray(emails)) {
                throw new Error('Expected contact emails to be an array');
            }

            setContactEmails(emails);
        } catch (error: any) {
            console.error('Error fetching contact emails:', error);
            showNotification({
                message: error.response?.data?.message || t('fetchError'),
                showProgress: true,
            });
            setContactEmails([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteContactEmailApi = async (id: number) => {
        try {
            await apiClient.delete(`/form-emails/${id}`);
            showNotification({
                message: t('deleteSuccess'),
                showProgress: true,
            });
            fetchContactEmails();
            return true;
        } catch (error: any) {
            console.error('Error deleting contact email:', error);
            showNotification({
                message: error.response?.data?.message || t('deleteError'),
                showProgress: true,
            });
            return false;
        }
    };

    useEffect(() => {
        fetchContactEmails();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteContactEmailApi(id);
    };

    const filteredContactEmails = contactEmails.filter((email) =>
        email.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: t('columnEmail'),
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: t('columnCreatedAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => (
                <span>{text ? new Date(text).toLocaleDateString() : '-'}</span>
            ),
        },
        {
            title: t('columnAction'),
            key: 'action',
            render: (_: any, record: ContactEmail) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        danger
                    >
                        {t('deleteButton')}
                    </Button>
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
                    .ant-btn {
                        padding: 4px 8px !important;
                        font-size: 12px !important;
                    }
                    .ant-input {
                        font-size: 12px !important;
                        padding: 4px 8px !important;
                    }
                    h1 {
                        font-size: 20px !important;
                    }
                    .search-container {
                        width: 100% !important;
                        max-width: 300px !important;
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

            <h1 className="text-2xl font-bold mb-4">{t('pageTitle')}</h1>

            <div className="mb-4">
                <Input
                    placeholder={t('searchPlaceholder')}
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-container"
                    style={{ width: 400 }}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <Spin size="large" />
                </div>
            ) : filteredContactEmails.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={filteredContactEmails}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{ x: 600 }}
                />
            ) : (
                <div className="text-center text-xl p-8">
                    <p>{t('noEmailsFound')}</p>
                </div>
            )}
        </div>
    );
}