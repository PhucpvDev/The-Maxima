'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { NextIntlClientProvider, useLocale } from 'next-intl';
import '@/assets/scss/main.scss';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const [themeConfig, setThemeConfig] = useState<any>(null);
  const [messages, setMessages] = useState<any>({});
  const { mytheme } = useSelector((state: RootState) => state.theme);
  
  // Get locale from next-intl's hook
  const locale = useLocale();
  
  // Fetch messages for the current locale
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = (await import(`@/messages/${locale}.json`)).default;
        setMessages(loadedMessages);
      } catch (error) {
        console.error(`Could not load messages for locale: ${locale}`, error);
      }
    };
    
    loadMessages();
  }, [locale]);
  
  // Setup theme and client-side rendering
  useEffect(() => {
    setIsClient(true);
    document.documentElement.setAttribute('data-theme', mytheme === 'light' ? 'light' : 'dark');

    // Configure Ant Design theme
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
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ConfigProvider>
  );
}