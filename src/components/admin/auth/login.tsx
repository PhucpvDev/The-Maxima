'use client';

import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useCustomNotification } from '@/components/admin/notification/customNotification';
import { IMAGES } from '@/constants/client/theme';
import { Link, useRouter } from '@/i18n/routing';
import { useApi } from '@/services/apiServices';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function Login() {
  const t = useTranslations('login');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { showNotification, contextHolder } = useCustomNotification();
  const router = useRouter();
  const { post } = useApi();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    try {
      const response = await post('/api/auth/login', {
        email: values.email,
        password: values.password,
      }, { useToken: false });

      if (response && response.access_token) {
        Cookies.set('token', response.access_token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });

        if (response.refresh_token) {
          Cookies.set('refresh_token', response.refresh_token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
          });
        }

        if (values.remember && response.user) {
          Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
        } else {
          Cookies.remove('user');
        }

        showNotification({
          message: t('loginSuccess'),
          type: 'success',
          showProgress: true,
        });
        router.push('/admin/dashboard');
      } else {
        console.error('Invalid response format:', response);
        showNotification({
          message: t('loginFailedTitle'),
          description: 'Invalid server response format',
          type: 'error',
          showProgress: true,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = t('loginFailedDescription');

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      if (errorMessage.includes('Account locked')) {
        showNotification({
          message: t('accountLockedTitle'),
          description: errorMessage,
          type: 'error',
          showProgress: true,
        });
      } else {
        showNotification({
          message: t('loginFailedTitle'),
          description: errorMessage,
          type: 'error',
          showProgress: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className='flex min-h-screen font-roboto'>
      {contextHolder}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-50 to-white flex-col items-center justify-center p-10">
        <div className="mb-8 flex items-center gap-4 transform transition-transform hover:scale-105">
          <Image
            src={IMAGES.Logo11}
            alt="Logo Gas"
            width={56}
            height={56}
            priority
            className="rounded-lg"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            {t('storeTitle')}
          </h2>
        </div>
        <p className="text-center text-gray-600 text-lg mb-10 max-w-md leading-relaxed">
          {t('storeDescription')}
        </p>
        <div className="relative">
          <Image
            src={IMAGES.Banner3}
            alt="Illustration of people with charts"
            width={400}
            height={250}
            className="w-full max-w-lg object-cover rounded-xl shadow-sm transform transition-transform hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100/20 to-transparent rounded-xl"></div>
        </div>
      </div>
      <div className='w-full md:w-1/2 flex items-center justify-center min-h-screen relative'>
        <Image
          src={IMAGES.Istock}
          alt="Banner Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="md:object-center object-[75%_50%]"
          priority
        />
        <div className='absolute inset-0 bg-white/85'></div>
        <div className='w-full max-w-md p-6 flex flex-col items-center justify-center z-10'>
          <div className='w-full'>
            <div className='text-center mb-6'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight'>
                {t('title')}
              </h1>
            </div>
            <Form
              name='login'
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              layout='vertical'
              size='large'
              requiredMark={false}
              onFinish={onFinish}
            >
              <Form.Item
                label={<span className='text-gray-700 font-medium'>{t('emailLabel')}</span>}
                name='email'
                rules={[{ required: true, message: t('emailRequired') }, { type: 'email', message: t('emailInvalid') }]}
                className='mb-5'
              >
                <Input
                  prefix={<MailOutlined className='text-gray-400' />}
                  placeholder={t('emailPlaceholder')}
                  className='rounded-md py-2 px-4 text-gray-700'
                />
              </Form.Item>
              <Form.Item
                label={<span className='text-gray-700 font-medium'>{t('passwordLabel')}</span>}
                name='password'
                rules={[{ required: true, message: t('passwordRequired') }, { min: 8, message: t('passwordMinLength') }]}
                className='mb-5'
              >
                <Input.Password
                  prefix={<LockOutlined className='text-gray-400' />}
                  placeholder={t('passwordPlaceholder')}
                  className='rounded-md py-2 px-4 text-gray-700'
                />
              </Form.Item>
              <Form.Item>
                <div className='flex flex-wrap items-center justify-between mb-4 mt-1 gap-3'>
                  <Form.Item name='remember' valuePropName='checked' noStyle>
                    <label className='flex items-center space-x-2 cursor-pointer'>
                      <input type='checkbox' className='w-4 h-4 text-red-500 bg-white border accent-red-500' />
                      <span className='text-gray-700 hover:text-red-500 transition-colors'>
                        {t('rememberMe')}
                      </span>
                    </label>
                  </Form.Item>
                  <Link
                    href='/auth/forgotPassword'
                    className='text-sm text-red-600 hover:text-red-800 transition-colors'
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
                <Button
                  type='primary'
                  danger
                  htmlType='submit'
                  className='w-full h-12 font-medium tracking-wide'
                  loading={loading}
                >
                  {t('submitButton')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}