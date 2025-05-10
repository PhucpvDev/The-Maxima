'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Form, Input, Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { IMAGES } from '@/constants/client/theme'
import { Link } from '@/i18n/routing'
import { useState, useEffect } from 'react'
import { useCustomNotification } from '@/components/admin/notification/customNotification'
import Image from 'next/image'


export default function ForgotPassword() {
  const t = useTranslations('forgotPassword')
  const locale = useLocale()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showNotification, contextHolder } = useCustomNotification()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onFinish = async (values: { email: string }) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email, locale: locale }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t('requestFailed'))
      }

      const data = await response.json()
      showNotification({
        message: data.message || t('requestSuccess'),
        showProgress: true,
      })
    } catch (error) {
      console.error('Error sending forgot password request:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="flex min-h-screen font-roboto">
      {contextHolder}
      <div className="hidden md:flex md:w-1/2 bg-white flex-col items-center justify-center p-8">
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
            The Maxima
          </h2>
        </div>
        <p className="text-center text-gray-700 text-lg mb-8 max-w-lg">
          {locale === 'vi'
            ? 'Quản lý kinh doanh đầu tư tiền ảo với Maxima của bạn một cách dễ dàng và hiệu quả.'
            : 'Manage your crypto investment business with Maxima easily and efficiently.'}
        </p>
        <Image
          src={IMAGES.Banner3}
          alt="Illustration of people with charts"
          width={400}
          height={250}
          className="w-full max-w-lg object-cover rounded-xl shadow-sm transform transition-transform hover:scale-102"
        />
      </div>

      <div className="w-full md:w-1/2 -mt-56 flex items-center justify-center min-h-screen relative">
        <Image
          src={IMAGES.Istock}
          alt="Banner Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="md:object-center object-[75%_50%]"
          priority
        />
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="w-full max-w-md p-6 flex flex-col items-center justify-center z-10">
          <div className="w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
                {t('title')}
              </h1>
            </div>
            <Form
              name="forgot_password"
              style={{ maxWidth: 600 }}
              layout="vertical"
              size="large"
              requiredMark={false}
              onFinish={onFinish}
            >
              <Form.Item
                label={<span className="text-gray-700 font-medium">{t('emailLabel')}</span>}
                name="email"
                rules={[
                  { required: true, message: t('emailRequired') },
                  { type: 'email', message: t('emailInvalid') },
                ]}
                className="mb-5"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder={t('emailPlaceholder')}
                  className="rounded-md py-2 px-4 text-gray-700"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  className="w-full h-12 font-medium tracking-wide"
                  loading={loading}
                >
                  {t('submitButton')}
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}