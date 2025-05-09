'use client'

import type { MenuProps } from 'antd';
import { SettingOutlined, UserOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AccountModal from '@/components/admin/auth/profile'
import Cookies from 'js-cookie';


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
        const token = Cookies.get('token');
        if (!token) {
          console.error('Token không tồn tại trong cookie');
          return;
        }
  
        const response = await fetch('http://localhost:3001/api/users/profile/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();        

        if (data.avatar) {
          setAvatarUrl(data.avatar);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('refresh_token');
    Cookies.remove('aff_code');
    Cookies.remove('token_aff');
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