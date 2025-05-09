'use client'

import { useState, useMemo, useEffect } from 'react';
import {
    Table,
    Card,
    Statistic,
    Row,
    Col,
    Input,
    Tabs,
    Badge,
} from 'antd';
import {
    DollarOutlined,
    LinkOutlined,
    UserOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
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

                const response = await fetch('http://localhost:3001/api/affiliates/dashboard/stats', {
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

                const response = await fetch('http://localhost:3001/api/affiliates/stats/top', {
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
                const transformedData: Staff[] = data.map((item: any) => ({
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

    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    const filteredStaffData = useMemo(() => {
        if (!searchQuery) return staffData;
        const lowerQuery = searchQuery.toLowerCase();
        return staffData.filter(
            staff =>
                staff.name.toLowerCase().includes(lowerQuery) ||
                staff.code.toLowerCase().includes(lowerQuery)
        );
    }, [staffData, searchQuery]);

    const totalCommissions = filteredStaffData.reduce((sum, staff) => sum + staff.commission, 0);
    const totalConversions = filteredStaffData.reduce((sum, staff) => sum + staff.conversions, 0);
    const totalClicks = filteredStaffData.reduce((sum, staff) => sum + staff.clicks, 0);
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

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
        render?: (value: any, record?: StaffColumnRecord) => React.ReactNode;
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

    const salesComparisonData = {
        labels: filteredStaffData.map(staff => staff.name),
        datasets: [
            {
                label: t('chartCommissionLabel'),
                data: filteredStaffData.map(staff => staff.commission),
                backgroundColor: 'rgba(136, 132, 216, 0.6)',
                borderColor: 'rgba(136, 132, 216, 1)',
                borderWidth: 1,
            },
        ],
    };

    const conversionRateData = {
        labels: filteredStaffData.map(staff => staff.name),
        datasets: [
            {
                label: t('chartConversionRateLabel'),
                data: filteredStaffData.map(staff => staff.conversionRate),
                backgroundColor: 'rgba(130, 202, 157, 0.6)',
                borderColor: 'rgba(130, 202, 157, 1)',
                borderWidth: 1,
            },
        ],
    };

    const trendData = filteredStaffData.reduce((acc, staff) => {
        staff.historicalSales.forEach(sale => {
            const existing = acc.find(d => d.date === sale.date);
            if (existing) {
                existing.sales += sale.sales;
            } else {
                acc.push({ date: sale.date, sales: sale.sales });
            }
        });
        return acc;
    }, [] as { date: string; sales: number }[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const trendLineData = {
        labels: trendData.map(data => data.date),
        datasets: [
            {
                label: t('chartSalesLabel'),
                data: trendData.map(data => data.sales),
                fill: false,
                borderColor: 'rgba(136, 132, 216, 1)',
                tension: 0.1,
            },
        ],
    };


    const salesComparisonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { font: { size: 12 } } },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return `${t('chartCommissionLabel')}: ${tooltipItem.raw.toFixed(2)}%`; // Show as percentage
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number) => `${value.toFixed(2)}%`, // Show percentage on Y-axis
                    font: { size: 10 },
                },
            },
            x: {
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    };

    const conversionRateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { font: { size: 12 } } },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return `${t('chartConversionRateLabel')}: ${tooltipItem.raw.toFixed(2)}%`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number) => `${value.toFixed(2)}%`,
                    font: { size: 10 },
                },
            },
            x: {
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    };

    const trendLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { font: { size: 12 } } },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return `${t('chartSalesLabel')}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(tooltipItem.raw)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value),
                    font: { size: 10 },
                },
            },
            x: {
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
        },
    };

    const tabItems = [
        {
            key: '1',
            label: t('tabStaffRanking'),
            children: (
                <Card>
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
                        onRow={(record) => ({
                            onClick: () => setSelectedStaff(record),
                            style: { cursor: 'pointer' }
                        })}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: false,
                        }}
                        scroll={{ x: 800 }}
                    />
                </Card>
            )
        },
        {
            key: '2',
            label: t('tabCharts'),
            children: (
                <>
                    <Row gutter={[12, 12]}>
                        <Col xs={24} sm={12}>
                            <Card title={t('cardCommissionComparison')} className="mb-4 sm:mb-6">
                                <div className="chart-container">
                                    <Bar
                                        data={salesComparisonData}
                                        options={salesComparisonOptions}
                                    />
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card title={t('cardConversionRate')} className="mb-4 sm:mb-6">
                                <div className="chart-container">
                                    <Bar
                                        data={conversionRateData}
                                        options={conversionRateOptions}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </>
            )
        }
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

            {selectedStaff ? (
                <div>
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold">{t('staffDetailTitle', { name: selectedStaff.name })}</h2>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setSelectedStaff(null)}>{t('backButton')}</button>
                    </div>

                    <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statCommission')}
                                    value={selectedStaff.commission}
                                    precision={2} 
                                    valueStyle={{ color: '#52c41a' }}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statConversions')}
                                    value={selectedStaff.conversions}
                                    precision={0}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statClicks')}
                                    value={selectedStaff.clicks}
                                    precision={0}
                                    valueStyle={{ color: '#13c2c2' }}
                                    prefix={<LinkOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statConversionRate')}
                                    value={selectedStaff.conversionRate}
                                    precision={2}
                                    valueStyle={{ color: '#fa8c16' }}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <Tabs defaultActiveKey="1" tabBarGutter={12} items={tabItems} />
            )}
        </div>
    );
}