'use client';

import { Modal, Input, Select, Button, Upload } from 'antd';
import {
  LockOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useState, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useCustomNotification } from '@/components/admin/notification/customNotification';
import Cookies from 'js-cookie';
import Image from 'next/image';

const { Option } = Select;

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  role: {
    name: string;
  };
  avatar?: string;
}

export default function AccountModal({ visible, onClose }: AccountModalProps) {
  const t = useTranslations('accountModal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showNotification, contextHolder } = useCustomNotification();
  
  const prevVisibleRef = useRef(visible);
  const avatarUrlsToRevoke = useRef<string[]>([]);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: 'Trung Quốc' },
  ];

  const switchLocale = (newLocale: string) => {
    const currentPathname = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  const handleLanguageChange = (value: string) => {
    const selectedLang = languages.find((lang) => lang.name === value);
    if (selectedLang) {
      switchLocale(selectedLang.code);
    }
  };

  const handleAvatarChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const file = newFileList[0]?.originFileObj;
    setFileList(newFileList);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      if (!previewUrl.startsWith('http')) {
        avatarUrlsToRevoke.current.push(previewUrl);
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token không tồn tại trong cookie');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin profile');
      }

      const data = await response.json();
      setProfile(data);
      setUserName(data.name);

      if (data.avatar) {
        setAvatarPreview(data.avatar);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
      showNotification({
        message: t('fetchProfileError'),
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification, t]);

  const logout = () => {
    Cookies.remove('token');
    onClose(); 
    router.push(`/${locale}/auth/login`);
  };

  const updateProfile = async () => {
    try {
      setSaveLoading(true);

      const token = Cookies.get('token');
      if (!token) {
        showNotification({
          message: t('noTokenError'),
          showProgress: true,
        });
        return;
      }

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          showNotification({
            message: t('allFieldsRequired'),
            showProgress: true,
          });
          return;
        }

        if (newPassword !== confirmPassword) {
          showNotification({
            message: t('passwordsNotMatch'),
            showProgress: true,
          });
          return;
        }

        if (newPassword.length < 6) {
          showNotification({
            message: t('passwordTooShort'),
            showProgress: true,
          });
          return;
        }
      }

      let response;
      let isPasswordUpdate = false;

      if (userName !== profile?.name || fileList.length > 0) {
        const formData = new FormData();
        if (userName !== profile?.name) {
          formData.append('name', userName);
        }
        if (fileList.length > 0 && fileList[0].originFileObj) {
          formData.append('avatar', fileList[0].originFileObj);
        }
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      } else if (currentPassword && newPassword) {
        isPasswordUpdate = true;
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
      } else {
        showNotification({
          message: t('noChanges'),
          showProgress: true,
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Không thể cập nhật profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      showNotification({
        message: t('updateProfileSuccess'),
        showProgress: true,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFileList([]);
      setAvatarPreview(updatedProfile.avatar || null);

      if (isPasswordUpdate) {
        showNotification({
          message: t('passwordUpdatedLoggingOut'),
          showProgress: true,
        });
        setTimeout(() => {
          logout();
        }, 1000); 
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
      showNotification({
        message: error instanceof Error ? error.message : t('updateProfileError'),
        showProgress: true,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = async () => {
    await updateProfile();
  };

  const handlePasswordCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (visible && !prevVisibleRef.current) {
    fetchProfile();
    setFileList([]);
    setAvatarPreview(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    avatarUrlsToRevoke.current.forEach(url => {
      if (!url.startsWith('http')) {
        URL.revokeObjectURL(url);
      }
    });
    avatarUrlsToRevoke.current = [];
  }
  
  if (prevVisibleRef.current !== visible) {
    prevVisibleRef.current = visible;
  }

  const handleModalClose = () => {
    avatarUrlsToRevoke.current.forEach(url => {
      if (!url.startsWith('http')) {
        URL.revokeObjectURL(url);
      }
    });
    avatarUrlsToRevoke.current = [];
    onClose();
  };

  const currentLanguage = languages.find((lang) => lang.code === locale)?.name || 'Tiếng Việt';

  return (
    <Modal open={visible} onCancel={handleModalClose} footer={null} width={1100}>
      {contextHolder}
      <h1 className="block text-base font-bold w-32 pl-3 pt-2">{t('title')}</h1>
      {loading ? (
        <p>{t('loading')}</p>
      ) : profile ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-4 mb-4 p-3">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">{t('avatar')}</label>
              <div className="flex items-start gap-4">
                <Upload
                  beforeUpload={() => false}
                  accept="image/*"
                  fileList={fileList}
                  onChange={handleAvatarChange}
                  maxCount={1}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="hover:bg-blue-50"
                    size="middle"
                  >
                    {t('upload')}
                  </Button>
                </Upload>
                <div className="block flex-col -mt-2 items-end">
                <Image
                    src={avatarPreview || profile.avatar || '/default-avatar.png'}
                    alt="Avatar preview"
                    width={50}
                    height={50}
                    style={{ borderRadius: '50px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">{t('name')}</label>
              <Input
                value={userName}
                onChange={handleNameChange}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">{t('email')}</label>
              <Input
                value={profile.email}
                className="flex-1"
                disabled
                style={{ color: '#666' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">{t('language')}</label>
              <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="flex-1"
              >
                {languages.map((lang) => (
                  <Option key={lang.code} value={lang.name}>
                    {lang.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">{t('role')}</label>
              <span className="block rounded flex-1 font-bold">{profile.role.name}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-6 pr-3">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saveLoading}
            >
              {t('save')}
            </Button>
            <Button icon={<CloseCircleOutlined />} onClick={handleModalClose}>
              {t('cancel')}
            </Button>
          </div>

          <div className="pt-4 p-3 border border-gray-200 rounded-lg">
            <h1 className="block text-base font-bold">{t('securityTitle')}</h1>
            <div className="flex flex-col py-3 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <LockOutlined className="mr-2 text-gray-500" />
                <span className="text-sm font-bold">{t('changePassword')}</span>
              </div>
              <div className="text-xs text-gray-900 mb-4">
                {t('passwordRecommendation')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{t('currentPassword')}</label>
                  <Input.Password
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t('enterCurrentPassword')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{t('newPassword')}</label>
                  <Input.Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('enterNewPassword')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{t('confirmPassword')}</label>
                  <Input.Password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('confirmNewPassword')}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saveLoading}
                >
                  {t('savePassword')}
                </Button>
                <Button icon={<CloseCircleOutlined />} onClick={handlePasswordCancel}>
                  {t('cancelPassword')}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>{t('fetchProfileError')}</p>
      )}
    </Modal>
  );
}