'use client'

import type { MenuProps } from 'antd';
import { SettingOutlined, UserOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import AccountModal from '@/components/admin/auth/profile'; // Import AccountModal

export default function MainHeaderUser() {
  const t = useTranslations('mainHeaderUser');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'vi';

  useEffect(() => {
    const storedToken = Cookies.get('token');
    setToken(storedToken || null);

    if (!storedToken) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://uat-lotus-dreams.goldenbeeltd.top/api/me', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && response?.data?.data) {
          const data = response?.data?.data as { avatar?: string; picture?: string };
          setAvatarUrl(data.avatar || data.picture || null);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setToken(null);
    message.success(t('logoutSuccess'));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const localizedUrl = (path: string, locale: string) => `/${locale}${path}`;

  const authItems: MenuProps['items'] = [
    { key: '1', label: t('menuProfile'), icon: <UserOutlined />, onClick: () => setIsProfileModalOpen(true) },
    { key: '3', label: t('menuLogout'), icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  const guestItems: MenuProps['items'] = [
    { key: '4', label: t('menuLogin'), icon: <UserAddOutlined />, onClick: () => router.push(localizedUrl('/auth/login', locale)) },
  ];

  return (
    <div className="flex items-center">
      <Dropdown menu={{ items: token ? authItems : guestItems }} trigger={['click']} overlayStyle={{ minWidth: '150px' }} className="ml-2">
        <a onClick={(e) => e.preventDefault()}>
          <Avatar src={avatarUrl} icon={!avatarUrl && <UserOutlined />} size={30} />
        </a>
      </Dropdown>

      <AccountModal
        visible={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}