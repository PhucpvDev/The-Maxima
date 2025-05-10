'use client';

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Table, Space, Button, Spin, Input } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useCustomNotification } from '@/components/admin/notification/customNotification';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

interface AffiliateForm {
    id: number;
    username: string;
    link: string;
    code: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export default function ListAffiliate() {
    const t = useTranslations('affiliateForms');
    const [loading, setLoading] = useState(false);
    const [affiliateForms, setAffiliateForms] = useState<AffiliateForm[]>([]);
    const [searchText, setSearchText] = useState('');
    const { showNotification, contextHolder } = useCustomNotification();
    const dataFetchedRef = useRef(false);

    const fetchAffiliateForms = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            const response = await apiClient.get('/form-affiliate');
            const forms = response.data;

            if (!Array.isArray(forms)) {
                throw new Error('Expected affiliate forms to be an array');
            }

            setAffiliateForms(forms);
        } catch (error) {
            console.error('Error fetching affiliate forms:', error);
            setAffiliateForms([]);
        } finally {
            setLoading(false);
        }
    }, [loading]); 

    if (!dataFetchedRef.current) {
        dataFetchedRef.current = true;
        fetchAffiliateForms();
    }

    const deleteAffiliateFormApi = async (id: number) => {
        try {
            await apiClient.delete(`/form-affiliate/${id}`); 
            showNotification({
                message: t('deleteSuccess'),
                showProgress: true,
            });
            fetchAffiliateForms();
            return true;
        } catch (error) {
            console.error('Error deleting affiliate form:', error);
            showNotification({
                message: t('deleteError'),
                showProgress: true,
            });
            return false;
        }
    };

    const handleDelete = async (id: number) => {
        await deleteAffiliateFormApi(id);
    };

    const filteredAffiliateForms = affiliateForms.filter((form) => {
        const searchLower = searchText.toLowerCase();
        return (
            form.username.toLowerCase().includes(searchLower) ||
            form.email.toLowerCase().includes(searchLower) ||
            form.code.toLowerCase().includes(searchLower)
        );
    });

    const columns = [
        {
            title: t('columnUsername'),
            dataIndex: 'username',
            key: 'username',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: t('columnLink'),
            dataIndex: 'link',
            key: 'link',
            render: (text: string) => (
                <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {text}
                </a>
            ),
        },
        {
            title: t('columnCode'),
            dataIndex: 'code',
            key: 'code',
            render: (text: string) => <span>{text}</span>,
        },
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
            render: (_: unknown, record: AffiliateForm) => (
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
            ) : filteredAffiliateForms.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={filteredAffiliateForms}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{ x: 1000 }}
                />
            ) : (
                <div className="text-center text-xl p-8">
                    <p>{t('noFormsFound')}</p>
                </div>
            )}
        </div>
    );
}