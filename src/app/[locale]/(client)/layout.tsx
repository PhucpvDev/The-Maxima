'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { NextIntlClientProvider } from 'next-intl';
import '@/assets/scss/main.scss';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: string;
  messages: any; // Thay bằng type cụ thể nếu cần
}

export default function ClientLayout({ children, locale, messages }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const [themeConfig, setThemeConfig] = useState<any>(null); // State để lưu themeConfig
  const { mytheme } = useSelector((state: RootState) => state.theme);

  // Thiết lập theme và client-side rendering
  useEffect(() => {
    setIsClient(true);
    document.documentElement.setAttribute('data-theme', mytheme === 'light' ? 'light' : 'dark');

    // Cấu hình theme cho Ant Design
    const getCSSVariable = (variable: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

    const config = {
      token: {
        colorPrimary: getCSSVariable('--yellow-500') || '#FFC800',
      },
      algorithm:
        mytheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    };

    setThemeConfig(config);
  }, [mytheme]);

  if (!isClient || !themeConfig) {
    return null; 
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ConfigProvider>
  );
}