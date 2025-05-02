'use client'; // Thêm directive này vì component sử dụng các hook phía client

import { Modal, Input, Select, Button, List, Tooltip } from 'antd';
import {
  EditOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  SafetyOutlined,
  PoweroffOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl'; // Thêm useLocale để lấy ngôn ngữ hiện tại
import { usePathname, useRouter } from 'next/navigation'; // Thêm để điều hướng

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
}

export default function AccountModal({ visible, onClose }: AccountModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const devices = [
    { name: 'Máy tính Linux', browser: 'Chrome', status: 'Đang hoạt động', date: '29/04/2025 00:13:16', id: '294020250013' },
  ];

  // Lấy ngôn ngữ hiện tại và các hook để điều hướng
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Danh sách ngôn ngữ tương tự như trong LanguageSwitcher
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: 'Trung Quốc' },
  ];

  // Hàm thay đổi ngôn ngữ
  const switchLocale = (newLocale: string) => {
    const currentPathname = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  // Xử lý khi người dùng thay đổi ngôn ngữ
  const handleLanguageChange = (value: string) => {
    const selectedLang = languages.find((lang) => lang.name === value);
    if (selectedLang) {
      switchLocale(selectedLang.code);
    }
  };

  // Hàm gọi API để lấy thông tin profile
  const fetchProfile = async () => {
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

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    if (visible) {
      fetchProfile();
    }
  }, [visible]);

  // Xác định giá trị ngôn ngữ hiện tại để hiển thị trong Select
  const currentLanguage = languages.find((lang) => lang.code === locale)?.name || 'Tiếng Việt';

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={1000}>
      <h1 className="block text-base font-bold w-32 pl-3 pt-2">Tài khoản</h1>
      {loading ? (
        <p>Đang tải thông tin...</p>
      ) : profile ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-4 mb-4 p-3">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Tên tài khoản</label>
              <Input defaultValue={profile.name} className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Email</label>
              <Input defaultValue={profile.email} className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Tên đăng nhập</label>
              <Input defaultValue="0347161218" className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">SĐT</label>
              <Input defaultValue="+84347161218" className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Vai trò</label>
              <span className="block rounded flex-1 font-bold">{profile.role.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Ngôn ngữ</label>
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
            <div className="flex items-center gap-2"></div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold w-32">Ghi chú</label>
              <Input suffix={<EditOutlined />} className="flex-1" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-6 pr-3">
            <Button type="primary" icon={<SaveOutlined />}>
              Lưu
            </Button>
            <Button icon={<CloseCircleOutlined />}>Bỏ qua</Button>
          </div>

          <div className="pt-4 p-3 border border-gray-200 rounded-lg">
            <h1 className="block text-base font-bold">Đăng nhập và bảo mật</h1>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <div className="flex items-center mb-1">
                  <LockOutlined className="mr-2 text-gray-500" />
                  <span className="text-sm font-bold">Đổi mật khẩu</span>
                </div>
                <div className="text-xs text-gray-900">
                  Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác
                </div>
              </div>
              <Button icon={<EditOutlined />} className="border px-3 py-1 rounded-md text-sm">
                Chỉnh sửa
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="flex items-center mb-1">
                  <SafetyOutlined className="mr-2 text-gray-500" />
                  <span className="text-sm font-bold">Sử dụng xác thực 2 lớp</span>
                  <Tooltip title="Two-factor authentication">
                    <QuestionCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="text-xs text-gray-900">Tắt • Số điện thoại nhận mã xác thực:</div>
              </div>
              <Button icon={<PoweroffOutlined />} className="border px-3 py-1 rounded-md text-sm">
                Bật tính năng
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg mt-4 p-3 mb-3">
            <h1 className="block text-base font-bold">
              <DesktopOutlined className="mr-2 text-gray-500" />
              Các thiết bị đã đăng nhập
            </h1>
            <List
              itemLayout="horizontal"
              dataSource={devices}
              renderItem={(item) => (
                <List.Item
                  className="hover:bg-gray-50 px-3 py-2"
                  actions={[
                    <Button type="text" icon={<DeleteOutlined className="text-gray-700" />} />,
                  ]}
                >
                  <List.Item.Meta
                    title={<span className="text-sm font-bold">{item.name}</span>}
                    description={
                      <div className="text-xs text-gray-900">
                        {item.browser} <span className="text-green-500">{item.status}</span> {item.date}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </>
      ) : (
        <p>Không thể tải thông tin profile.</p>
      )}
    </Modal>
  );
}