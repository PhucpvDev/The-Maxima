'use client'

import { useState, useMemo, useEffect } from 'react';
import {
    Table,
    Card,
    Statistic,
    Row,
    Col,
    Input,
    Badge,
} from 'antd';
import {
    LinkOutlined,
    UserOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import Cookies from 'js-cookie';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Định nghĩa interface cho dữ liệu API
interface ApiAffiliateItem {
    id: number;
    code: string;
    commission: number;
    periodClicks: number;
    totalClicks: number;
    user: {
        name: string;
    };
}


export default function StatisticalAff() {
    const t = useTranslations('statisticalAff');

    const [apiStats, setApiStats] = useState({
        totalUsers: 0,
        totalAffiliates: 0,
        totalCommission: 0, 
        totalClicks: 0,
    });

    const [staffData, setStaffData] = useState<Staff[]>([]);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('No token found in cookies');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliates/dashboard/stats`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setApiStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchTopAffiliates = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('No token found in cookies');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliates/stats/top`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const transformedData: Staff[] = data.map((item: ApiAffiliateItem) => ({
                    id: item.id,
                    name: item.user.name,
                    code: item.code,
                    totalSales: 0,
                    commission: item.commission, // Commission is a percentage
                    conversions: item.periodClicks,
                    clicks: item.totalClicks,
                    conversionRate: item.totalClicks > 0 ? (item.periodClicks / item.totalClicks) * 100 : 0,
                    lastActive: moment().format('YYYY-MM-DD'),
                    status: 'active' as 'active' | 'inactive',
                    trend: 0,
                    products: [],
                    historicalSales: [],
                }));
                setStaffData(transformedData);
            } catch (error) {
                console.error('Error fetching top affiliates:', error);
            }
        };
        fetchTopAffiliates();
    }, []);

    const filteredStaffData = useMemo(() => {
        if (!searchQuery) return staffData;
        const lowerQuery = searchQuery.toLowerCase();
        return staffData.filter(
            staff =>
                staff.name.toLowerCase().includes(lowerQuery) ||
                staff.code.toLowerCase().includes(lowerQuery)
        );
    }, [staffData, searchQuery]);


    interface Product {
        name: string;
        count: number;
        revenue: number;
    }

    interface HistoricalSale {
        date: string;
        sales: number;
    }

    interface Staff {
        id: number;
        name: string;
        code: string; 
        totalSales: number;
        commission: number; 
        conversions: number;
        clicks: number;
        conversionRate: number;
        lastActive: string;
        status: 'active' | 'inactive';
        trend: number;
        products: Product[];
        historicalSales: HistoricalSale[];
    }

    interface StaffColumnRecord {
        name: string;
        code: string;
        commission: number; 
        clicks: number;
    }

    const staffColumns: Array<{
        title: string;
        dataIndex: keyof StaffColumnRecord;
        key: string;
        sorter?: (a: StaffColumnRecord, b: StaffColumnRecord) => number;
        render?: (value: string | number, record?: StaffColumnRecord) => React.ReactNode;
    }> = [
            {
                title: t('columnStaff'),
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                    <div className="flex items-center">
                        <Badge status="success" />
                        <span className="ml-2">{text}</span>
                    </div>
                ),
            },
            {
                title: t('columnCode'),
                dataIndex: 'code',
                key: 'code',
                sorter: (a, b) => a.code.localeCompare(b.code),
            },
            {
                title: t('columnClicks'),
                dataIndex: 'clicks',
                key: 'clicks',
                sorter: (a, b) => a.clicks - b.clicks,
            },
        ];

    return (
        <div className="p-3 sm:p-4">
            <style>
                {`
                    @media (max-width: 576px) {
                        .ant-table {
                            font-size: 11px !important;
                        }
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            padding: 6px !important;
                            white-space: nowrap;
                        }
                        .ant-card-body {
                            padding: 10px !important;
                        }
                        .ant-statistic-title {
                            font-size: 11px !important;
                        }
                        .ant-statistic-content {
                            font-size: 14px !important;
                        }
                        .ant-tabs-nav {
                            font-size: 12px !important;
                        }
                        .ant-tabs-tab {
                            padding: 6px 8px !important;
                        }
                        .ant-btn {
                            padding: 3px 6px !important;
                            font-size: 11px !important;
                            height: 28px !important;
                        }
                        .ant-input {
                            font-size: 11px !important;
                            height: 28px !important;
                        }
                        h1 {
                            font-size: 18px !important;
                        }
                        h2 {
                            font-size: 16px !important;
                        }
                        .chart-container {
                            height: 40vh !important;
                        }
                        .ant-row {
                            flex-direction: column !important;
                        }
                        .ant-col {
                            width: 100% !important;
                            max-width: 100% !important;
                        }
                    }

                    @media (max-width: 768px) {
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
                        .ant-statistic-title {
                            font-size: 12px !important;
                        }
                        .ant-statistic-content {
                            font-size: 16px !important;
                        }
                        .chart-container {
                            height: 45vh !important;
                        }
                    }
                `}
            </style>

            <h1 className="text-xl sm:text-2xl font-bold mb-4">{t('pageTitle')}</h1>

            <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalStaff')}
                            value={apiStats.totalUsers}
                            precision={0}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalClicks')}
                            value={apiStats.totalClicks}
                            precision={0}
                            valueStyle={{ color: '#13c2c2' }}
                            prefix={<LinkOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalAffiliates')}
                            value={apiStats.totalAffiliates}
                            precision={0}
                            valueStyle={{ color: '#eb2f96' }}
                            prefix={<LinkOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">{t('tabStaffRanking')}</h2>
                <Input
                    placeholder={t('searchPlaceholder')}
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16, maxWidth: 300 }}
                />
                <Table
                    columns={staffColumns}
                    dataSource={filteredStaffData}
                    rowKey="id"
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>
        </div>
    );
}