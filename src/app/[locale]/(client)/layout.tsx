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

interface ThemeConfig {
  token: {
    colorPrimary: string;
  };
  algorithm: typeof antdTheme.darkAlgorithm | typeof antdTheme.defaultAlgorithm;
}

interface Messages {
  [key: string]: string | Messages;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [messages, setMessages] = useState<Messages>({});
  const { mytheme } = useSelector((state: RootState) => state.theme);
  
  const locale = useLocale();
  
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
  
  useEffect(() => {
    setIsClient(true);
    document.documentElement.setAttribute('data-theme', mytheme === 'light' ? 'light' : 'dark');

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