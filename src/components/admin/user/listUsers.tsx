'use client'

import { useState } from 'react';
import {
    Table,
    Card,
    Input,
    Button,
    Space,
    Tag,
    Dropdown,
    Avatar,
    Badge,
    message,
    Modal
} from 'antd';
import {
    UserAddOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    TeamOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    ExportOutlined,
    ImportOutlined,
    FilterOutlined,
    LockOutlined,
    UnlockOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import ModalAddUser from '@/components/admin/user/modalUser';
import FilterUser from '@/components/admin/user/filterUser';

export default function Users() {
    const t = useTranslations('users');
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [filters, setFilters] = useState<any>({});

    const [userData, setUserData] = useState([
        {
            id: 1,
            name: 'Phúc Vừa',
            avatar: '/api/placeholder/40/40',
            email: 'phucvua@example.com',
            phone: '0912 345 678',
            status: 'active',
            joinDate: '2023-05-15',
            affiliateId: 'AFF001',
            totalSales: 372877000,
            commission: 18643850
        },
        {
            id: 2,
            name: 'Hoàng Long',
            avatar: '/api/placeholder/40/40',
            email: 'hoanglong@example.com',
            phone: '0923 456 789',
            status: 'active',
            joinDate: '2023-06-22',
            affiliateId: 'AFF002',
            totalSales: 232538000,
            commission: 11626900
        },
        {
            id: 3,
            name: 'Mai Hương',
            avatar: '/api/placeholder/40/40',
            email: 'maihuong@example.com',
            phone: '0934 567 890',
            status: 'active',
            joinDate: '2023-08-10',
            affiliateId: 'AFF003',
            totalSales: 145890000,
            commission: 7294500
        },
        {
            id: 4,
            name: 'Trần Thành',
            avatar: '/api/placeholder/40/40',
            email: 'tranthanh@example.com',
            phone: '0945 678 901',
            status: 'inactive',
            joinDate: '2023-09-05',
            affiliateId: 'AFF004',
            totalSales: 89750000,
            commission: 4487500
        },
        {
            id: 5,
            name: 'Ngọc Anh',
            avatar: '/api/placeholder/40/40',
            email: 'ngocanh@example.com',
            phone: '0956 789 012',
            status: 'active',
            joinDate: '2023-11-15',
            affiliateId: 'AFF005',
            totalSales: 203450000,
            commission: 10172500
        },
        {
            id: 6,
            name: 'Quang Minh',
            avatar: '/api/placeholder/40/40',
            email: 'quangminh@example.com',
            phone: '0967 890 123',
            status: 'active',
            joinDate: '2024-01-10',
            affiliateId: 'AFF006',
            totalSales: 178650000,
            commission: 8932500
        },
        {
            id: 7,
            name: 'Thùy Linh',
            avatar: '/api/placeholder/40/40',
            email: 'thuylinh@example.com',
            phone: '0978 901 234',
            status: 'active',
            joinDate: '2024-02-20',
            affiliateId: 'AFF007',
            totalSales: 85430000,
            commission: 4271500
        },
        {
            id: 8,
            name: 'Văn Dũng',
            avatar: '/api/placeholder/40/40',
            email: 'vandung@example.com',
            phone: '0989 012 345',
            status: 'inactive',
            joinDate: '2024-03-15',
            affiliateId: 'AFF008',
            totalSales: 45870000,
            commission: 2293500
        }
    ]);

    const filteredUsers = userData.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.phone.includes(searchText) ||
            user.affiliateId.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = !filters.status || user.status === filters.status;

        const matchesJoinDate = !filters.joinDateRange || (
            (!filters.joinDateRange[0] || user.joinDate >= filters.joinDateRange[0]) &&
            (!filters.joinDateRange[1] || user.joinDate <= filters.joinDateRange[1])
        );

        const matchesTotalSales = !filters.totalSalesRange || (
            (!filters.totalSalesRange[0] || user.totalSales >= filters.totalSalesRange[0]) &&
            (!filters.totalSalesRange[1] || user.totalSales <= filters.totalSalesRange[1])
        );

        const matchesCommission = !filters.commissionRange || (
            (!filters.commissionRange[0] || user.commission >= filters.commissionRange[0]) &&
            (!filters.commissionRange[1] || user.commission <= filters.commissionRange[1])
        );

        return matchesSearch && matchesStatus && matchesJoinDate && matchesTotalSales && matchesCommission;
    });

    const showModal = (user: any = null) => {
        setEditingUser(user);
        setIsModalVisible(true);
    };

    const showFilter = () => {
        setIsFilterVisible(true);
    };

    const closeFilter = () => {
        setIsFilterVisible(false);
    };

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleOk = (values: any) => {
        const newUser = {
            id: editingUser ? editingUser.id : userData.length + 1,
            name: values.name,
            avatar: '/api/placeholder/40/40',
            email: values.email,
            phone: values.phone,
            status: values.status,
            joinDate: values.joinDate || new Date().toISOString().split('T')[0],
            affiliateId: values.affiliateId,
            totalSales: editingUser ? editingUser.totalSales : 0,
            commission: editingUser ? editingUser.commission : 0,
        };

        if (editingUser) {
            setUserData(userData.map(user => (user.id === editingUser.id ? newUser : user)));
            message.success(t('updateSuccess'));
        } else {
            setUserData([...userData, newUser]);
            message.success(t('addSuccess'));
        }

        setIsModalVisible(false);
        setEditingUser(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: t('deleteConfirmTitle'),
            content: t('deleteConfirmContent'),
            okText: t('deleteConfirmOk'),
            cancelText: t('deleteConfirmCancel'),
            onOk: () => {
                setUserData(userData.filter(user => user.id !== id));
                setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
                message.success(t('deleteSuccess'));
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning(t('bulkDeleteWarning'));
            return;
        }

        Modal.confirm({
            title: t('bulkDeleteConfirmTitle'),
            content: t('bulkDeleteConfirmContent', { count: selectedRowKeys.length }),
            okText: t('deleteConfirmOk'),
            cancelText: t('deleteConfirmCancel'),
            onOk: () => {
                setUserData(userData.filter(user => !selectedRowKeys.includes(user.id)));
                setSelectedRowKeys([]);
                message.success(t('bulkDeleteSuccess'));
            }
        });
    };

    const handleToggleStatus = (user: any) => {
        setUserData(
            userData.map(u =>
                u.id === user.id
                    ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
                    : u
            )
        );
        message.success(t(user.status === 'active' ? 'lockSuccess' : 'unlockSuccess', { name: user.name }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'edit',
            label: t('menuEdit'),
            icon: <EditOutlined />,
            onClick: ({ key }: any) => {
                const user = userData.find(u => u.id === key);
                if (user) showModal(user);
            }
        },
        {
            key: 'delete',
            label: t('menuDelete'),
            icon: <DeleteOutlined />,
            onClick: ({ key }: any) => handleDelete(Number(key))
        },
        {
            key: 'toggleStatus',
            label: t('menuToggleStatus'),
            icon: <LockOutlined />,
            onClick: ({ key }: any) => {
                const user = userData.find(u => u.id === key);
                if (user) handleToggleStatus(user);
            }
        }
    ];

    const columns = [
        {
            title: t('columnName'),
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <Badge dot={record.status === 'active'} color="green">
                        <Avatar src={record.avatar} icon={<UserOutlined />} size={40} />
                    </Badge>
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: t('columnEmail'),
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => (
                <Space>
                    <MailOutlined />
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: t('columnPhone'),
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => (
                <Space>
                    <PhoneOutlined />
                    <span>{text}</span>
                </Space>
            )
        },
        {
            title: t('columnAffiliateId'),
            dataIndex: 'affiliateId',
            key: 'affiliateId'
        },
        {
            title: t('columnTotalSales'),
            dataIndex: 'totalSales',
            key: 'totalSales',
            render: (value: number) => value.toLocaleString()
        },
        {
            title: t('columnCommission'),
            dataIndex: 'commission',
            key: 'commission',
            render: (value: number) => value.toLocaleString()
        },
        {
            title: t('columnStatus'),
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? t('statusActive') : t('statusInactive')}
                </Tag>
            )
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Dropdown
                        menu={{
                            items: menuItems.map(item => ({
                                ...item,
                                key: item && item.key === 'toggleStatus'
                                    ? {
                                        ...item,
                                        label: record.status === 'active' ? t('menuLock') : t('menuUnlock'),
                                        icon: record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />
                                      }
                                    : item,
                                onClick: (info) => item && item.onClick?.({ key: record.id })
                            }))
                        }}
                        trigger={['click']}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            )
        }
    ];

    return (
        <div className="p-4">
            <style>
                {`
                    @media (max-width: 576px) {
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
                        .ant-btn {
                            padding: 4px 8px !important;
                            font-size: 12px !important;
                        }
                        .ant-input {
                            font-size: 12px !important;
                            padding: 4px 8px !important;
                        }
                        .ant-tag {
                            font-size: 12px !important;
                            padding: 2px 6px !important;
                        }
                        .ant-avatar {
                            width: 32px !important;
                            height: 32px !important;
                            line-height: 32px !important;
                        }
                        h1 {
                            font-size: 20px !important;
                        }
                        .header-container {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                            gap: 12px !important;
                        }
                        .search-filter-container {
                            flex-direction: column !important;
                            align-items: stretch !important;
                            gap: 8px !important;
                        }
                        .header-actions {
                            flex-direction: column !important;
                            align-items: stretch !important;
                            gap: 8px !important;
                            width: 100% !important;
                        }
                        .search-filter-container > *,
                        .header-actions > * {
                            width: 100% !important;
                        }
                        .ant-modal {
                            width: 90% !important;
                            max-width: 320px !important;
                        }
                        .ant-modal-title {
                            font-size: 16px !important;
                        }
                        .ant-modal-body {
                            padding: 16px !important;
                        }
                        .ant-modal-footer .ant-btn {
                            font-size: 12px !important;
                            padding: 4px 8px !important;
                        }
                        .ant-table-column-title {
                            white-space: nowrap;
                        }
                        .ant-table-column-content {
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                `}
            </style>

            <div className="flex justify-between items-center mb-4 header-container">
                <h1 className="text-2xl font-bold">
                    <TeamOutlined className="mr-2" /> {t('pageTitle')}
                </h1>
                <Space className="header-actions">
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => showModal()}
                    >
                        {t('addButton')}
                    </Button>
                </Space>
            </div>

            <Space className="mb-4 search-filter-container" direction="horizontal" size="middle">
                <Input
                    placeholder={t('searchPlaceholder')}
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button icon={<FilterOutlined />} onClick={showFilter}>
                    {t('filterButton')}
                </Button>
                {selectedRowKeys.length > 0 && (
                    <Button danger onClick={handleBulkDelete}>
                        {t('bulkDeleteButton', { count: selectedRowKeys.length })}
                    </Button>
                )}
            </Space>

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                }}
                scroll={{ x: 1000 }}
            />

            <ModalAddUser
                isModalVisible={isModalVisible}
                editingUser={editingUser}
                onSubmit={handleOk}
                onCancel={handleCancel}
            />

            <FilterUser
                visible={isFilterVisible}
                onClose={closeFilter}
                onApply={handleApplyFilters}
            />
        </div>
    );
}