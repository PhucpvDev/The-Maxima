'use client'

import { useState, useMemo } from 'react';
import {
    Table,
    Card,
    Statistic,
    Row,
    Col,
    Select,
    Button,
    DatePicker,
    Tabs,
    Badge,
} from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    ReloadOutlined,
    DollarOutlined,
    LinkOutlined,
    BarChartOutlined
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
import moment from 'moment';
import { useTranslations } from 'next-intl';

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
    const { RangePicker } = DatePicker;
    const { TabPane } = Tabs;

    const [staffData] = useState([
        {
            id: 1,
            name: 'Phúc Vừa',
            totalSales: 372877000,
            commission: 18643850,
            conversions: 28,
            clicks: 568,
            conversionRate: 4.93,
            lastActive: '2025-04-30',
            status: 'active',
            trend: 12.5,
            products: [
                { name: t('productDeluxe'), count: 12, revenue: 161142000 },
                { name: t('productStandard'), count: 9, revenue: 46290000 },
                { name: t('productSuite'), count: 7, revenue: 159000000 },
                { name: t('productSpa'), count: 3, revenue: 6945000 },
            ],
            historicalSales: [
                { date: '2025-04-01', sales: 30000000 },
                { date: '2025-04-07', sales: 45000000 },
                { date: '2025-04-14', sales: 60000000 },
                { date: '2025-04-21', sales: 90000000 },
                { date: '2025-04-28', sales: 120000000 },
            ],
        },
        {
            id: 2,
            name: 'Hoàng Long',
            totalSales: 232538000,
            commission: 11626900,
            conversions: 16,
            clicks: 412,
            conversionRate: 3.88,
            lastActive: '2025-04-29',
            status: 'active',
            trend: -3.4,
            products: [
                { name: t('productDeluxe'), count: 5, revenue: 67560000 },
                { name: t('productStandard'), count: 7, revenue: 36544000 },
                { name: t('productSuite'), count: 2, revenue: 122590000 },
                { name: t('productSpa'), count: 2, revenue: 5844000 },
            ],
            historicalSales: [
                { date: '2025-04-01', sales: 40000000 },
                { date: '2025-04-07', sales: 35000000 },
                { date: '2025-04-14', sales: 50000000 },
                { date: '2025-04-21', sales: 45000000 },
                { date: '2025-04-28', sales: 42000000 },
            ],
        },
        {
            id: 3,
            name: 'Mai Hương',
            totalSales: 145890000,
            commission: 7294500,
            conversions: 12,
            clicks: 376,
            conversionRate: 3.19,
            lastActive: '2025-04-30',
            status: 'active',
            trend: 5.2,
            products: [
                { name: t('productDeluxe'), count: 4, revenue: 53890000 },
                { name: t('productStandard'), count: 6, revenue: 30800000 },
                { name: t('productSuite'), count: 1, revenue: 56800000 },
                { name: t('productSpa'), count: 1, revenue: 4400000 },
            ],
            historicalSales: [
                { date: '2025-04-01', sales: 20000000 },
                { date: '2025-04-07', sales: 25000000 },
                { date: '2025-04-14', sales: 30000000 },
                { date: '2025-04-21', sales: 35000000 },
                { date: '2025-04-28', sales: 40000000 },
            ],
        },
        {
            id: 4,
            name: 'Trần Thành',
            totalSales: 89750000,
            commission: 4487500,
            conversions: 7,
            clicks: 253,
            conversionRate: 2.77,
            lastActive: '2025-04-28',
            status: 'inactive',
            trend: -1.3,
            products: [
                { name: t('productDeluxe'), count: 3, revenue: 40450000 },
                { name: t('productStandard'), count: 4, revenue: 20600000 },
                { name: t('productSpa'), count: 3, revenue: 28700000 },
            ],
            historicalSales: [
                { date: '2025-04-01', sales: 15000000 },
                { date: '2025-04-07', sales: 18000000 },
                { date: '2025-04-14', sales: 17000000 },
                { date: '2025-04-21', sales: 16000000 },
                { date: '2025-04-28', sales: 15000000 },
            ],
        },
        {
            id: 5,
            name: 'Ngọc Anh',
            totalSales: 203450000,
            commission: 10172500,
            conversions: 15,
            clicks: 427,
            conversionRate: 3.51,
            lastActive: '2025-04-30',
            status: 'active',
            trend: 8.7,
            products: [
                { name: t('productDeluxe'), count: 6, revenue: 80684000 },
                { name: t('productStandard'), count: 5, revenue: 25770000 },
                { name: t('productSuite'), count: 2, revenue: 85996000 },
                { name: t('productSpa'), count: 2, revenue: 11000000 },
            ],
            historicalSales: [
                { date: '2025-04-01', sales: 30000000 },
                { date: '2025-04-07', sales: 35000000 },
                { date: '2025-04-14', sales: 40000000 },
                { date: '2025-04-21', sales: 45000000 },
                { date: '2025-04-28', sales: 50000000 },
            ],
        }
    ]);

    const [timePeriod, setTimePeriod] = useState('month');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    const filteredStaffData = useMemo(() => {
        return staffData.filter(staff => {
            if (statusFilter !== 'all' && staff.status !== statusFilter) {
                return false;
            }

            if (dateRange) {
                const [start, end] = dateRange;
                const lastActiveDate = new Date(staff.lastActive);
                const startDate = start.toDate();
                const endDate = end.toDate();
                if (lastActiveDate < startDate || lastActiveDate > endDate) {
                    return false;
                }
            }

            if (timePeriod !== 'month') {
                const today = new Date();
                const lastActiveDate = new Date(staff.lastActive);
                const diffDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

                if (timePeriod === 'today' && diffDays > 0) return false;
                if (timePeriod === 'week' && diffDays > 7) return false;
                if (timePeriod === 'year' && diffDays > 365) return false;
            }

            return true;
        });
    }, [staffData, statusFilter, dateRange, timePeriod]);

    const totalSales = filteredStaffData.reduce((sum, staff) => sum + staff.totalSales, 0);
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
        totalSales: number;
        commission: number;
        conversions: number;
        clicks: number;
        conversionRate: number;
        trend: number;
        lastActive: string;
        status: 'active' | 'inactive';
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
            render: (text, record) => (
                <div className="flex items-center">
                    <Badge status={(record?.status ?? 'default') === 'active' ? 'success' : 'default'} />
                    <span className="ml-2">{text}</span>
                </div>
            ),
        },
        {
            title: t('columnTotalSales'),
            dataIndex: 'totalSales',
            key: 'totalSales',
            sorter: (a, b) => a.totalSales - b.totalSales,
            render: (value) => (
                <span>{new Intl.NumberFormat('vi-VN').format(value)} {t('currency')}</span>
            ),
        },
        {
            title: t('columnCommission'),
            dataIndex: 'commission',
            key: 'commission',
            sorter: (a, b) => a.commission - b.commission,
            render: (value) => (
                <span>{new Intl.NumberFormat('vi-VN').format(value)} {t('currency')}</span>
            ),
        },
        {
            title: t('columnConversions'),
            dataIndex: 'conversions',
            key: 'conversions',
            sorter: (a, b) => a.conversions - b.conversions,
        },
        {
            title: t('columnClicks'),
            dataIndex: 'clicks',
            key: 'clicks',
            sorter: (a, b) => a.clicks - b.clicks,
        },
        {
            title: t('columnConversionRate'),
            dataIndex: 'conversionRate',
            key: 'conversionRate',
            sorter: (a, b) => a.conversionRate - b.conversionRate,
            render: (value) => `${value}%`,
        },
        {
            title: t('columnTrend'),
            dataIndex: 'trend',
            key: 'trend',
            render: (value) => (
                <span className={value >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(value)}%
                </span>
            ),
        },
        {
            title: t('columnLastActive'),
            dataIndex: 'lastActive',
            key: 'lastActive',
            render: (date) => {
                const today = new Date();
                const lastActiveDate = new Date(date);
                const diffDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 0) return t('today');
                if (diffDays === 1) return t('yesterday');
                return t('daysAgo', { count: diffDays });
            }
        },
    ];

    interface ProductColumnRecord {
        name: string;
        count: number;
        revenue: number;
    }

    const productColumns: Array<{
        title: string;
        dataIndex: keyof ProductColumnRecord;
        key: string;
        sorter?: (a: ProductColumnRecord, b: ProductColumnRecord) => number;
        render?: (value: any, record?: ProductColumnRecord) => React.ReactNode;
    }> = [
        {
            title: t('columnProduct'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('columnSalesCount'),
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: t('columnRevenue'),
            dataIndex: 'revenue',
            key: 'revenue',
            sorter: (a, b) => a.revenue - b.revenue,
            render: (value) => (
                <span>{new Intl.NumberFormat('vi-VN').format(value)} {t('currency')}</span>
            ),
        },
    ];

    const salesComparisonData = {
        labels: filteredStaffData.map(staff => staff.name),
        datasets: [
            {
                label: t('chartSalesLabel'),
                data: filteredStaffData.map(staff => staff.totalSales),
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

    const historicalSalesLineData = selectedStaff ? {
        labels: selectedStaff.historicalSales.map(data => data.date),
        datasets: [
            {
                label: t('chartSalesLabel'),
                data: selectedStaff.historicalSales.map(data => data.sales),
                fill: false,
                borderColor: 'rgba(136, 132, 216, 1)',
                tension: 0.1,
            },
        ],
    } : null;

    const salesComparisonOptions = {
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
                    maxRotation: 45, // Xoay nhãn trên trục x để tránh chồng lấn
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
                        return `${t('chartConversionRateLabel')}: ${tooltipItem.raw}%`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: number) => `${value}%`,
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

    const resetFilters = () => {
        setTimePeriod('month');
        setStatusFilter('all');
        setDateRange(null);
    };

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
                            white-space: nowrap; /* Ngăn text xuống dòng */
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
                        .ant-select-selector {
                            font-size: 11px !important;
                            padding: 0 6px !important;
                            height: 28px !important;
                            display: flex;
                            align-items: center;
                        }
                        .ant-picker {
                            font-size: 11px !important;
                            height: 28px !important;
                        }
                        .ant-picker-input > input {
                            font-size: 11px !important;
                        }
                        h1 {
                            font-size: 18px !important;
                        }
                        h2 {
                            font-size: 16px !important;
                        }
                        .filter-controls {
                            flex-direction: column !important;
                            gap: 6px !important;
                            align-items: stretch !important;
                        }
                        .filter-controls > * {
                            width: 100% !important;
                        }
                        .chart-container {
                            height: 40vh !important; /* Giảm chiều cao biểu đồ trên mobile */
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

            <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
                <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0">{t('pageTitle')}</h1>
                <div className="flex gap-3 filter-controls">
                    <Select
                        value={timePeriod}
                        onChange={setTimePeriod}
                        className="w-32 sm:w-32"
                    >
                        <Select.Option value="today">{t('timeToday')}</Select.Option>
                        <Select.Option value="week">{t('timeWeek')}</Select.Option>
                        <Select.Option value="month">{t('timeMonth')}</Select.Option>
                        <Select.Option value="year">{t('timeYear')}</Select.Option>
                    </Select>
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="w-32 sm:w-32"
                    >
                        <Select.Option value="all">{t('statusAll')}</Select.Option>
                        <Select.Option value="active">{t('statusActive')}</Select.Option>
                        <Select.Option value="inactive">{t('statusInactive')}</Select.Option>
                    </Select>
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment] | null)}
                        className="w-60 sm:w-64"
                        placeholder={[t('dateFrom'), t('dateTo')]}
                    />
                    <Button type="primary" icon={<ReloadOutlined />} onClick={resetFilters}>
                        {t('resetButton')}
                    </Button>
                </div>
            </div>

            <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalSales')}
                            value={totalSales}
                            precision={0}
                            valueStyle={{ color: '#1677ff' }}
                            prefix={<DollarOutlined />}
                            suffix={t('currency')}
                            formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalCommissions')}
                            value={totalCommissions}
                            precision={0}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<DollarOutlined />}
                            suffix={t('currency')}
                            formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statTotalConversions')}
                            value={totalConversions}
                            precision={0}
                            valueStyle={{ color: '#722ed1' }}
                            prefix={<LinkOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title={t('statAvgConversionRate')}
                            value={avgConversionRate.toFixed(2)}
                            precision={2}
                            valueStyle={{ color: '#fa8c16' }}
                            prefix={<BarChartOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>

            {selectedStaff ? (
                <div>
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold">{t('staffDetailTitle', { name: selectedStaff.name })}</h2>
                        <Button onClick={() => setSelectedStaff(null)}>{t('backButton')}</Button>
                    </div>

                    <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statSales')}
                                    value={selectedStaff.totalSales}
                                    precision={0}
                                    valueStyle={{ color: '#1677ff' }}
                                    suffix={t('currency')}
                                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('statCommission')}
                                    value={selectedStaff.commission}
                                    precision={0}
                                    valueStyle={{ color: '#52c41a' }}
                                    suffix={t('currency')}
                                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
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
                                    title={t('statConversionRate')}
                                    value={selectedStaff.conversionRate}
                                    precision={2}
                                    valueStyle={{ color: '#fa8c16' }}
                                    suffix="%"
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title={t('cardProducts')} className="mb-4 sm:mb-6">
                        <Table
                            columns={productColumns}
                            dataSource={selectedStaff.products}
                            rowKey="name"
                            pagination={{
                                pageSize: 5,
                                showSizeChanger: false, // Ẩn tùy chọn thay đổi số lượng trên mobile
                            }}
                            scroll={{ x: 400 }}
                        />
                    </Card>

                    <Card title={t('cardPerformance')}>
                        {historicalSalesLineData && (
                            <div className="chart-container">
                                <Line
                                    data={historicalSalesLineData}
                                    options={trendLineOptions}
                                />
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <Tabs defaultActiveKey="1" tabBarGutter={12}>
                    <TabPane tab={t('tabStaffRanking')} key="1">
                        <Card>
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
                    </TabPane>

                    <TabPane tab={t('tabCharts')} key="2">
                        <Row gutter={[12, 12]}>
                            <Col xs={24} sm={12}>
                                <Card title={t('cardSalesComparison')} className="mb-4 sm:mb-6">
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
                        <Card title={t('cardSalesTrend')}>
                            <div className="chart-container">
                                <Line
                                    data={trendLineData}
                                    options={trendLineOptions}
                                />
                            </div>
                        </Card>
                    </TabPane>
                </Tabs>
            )}
        </div>
    );
}