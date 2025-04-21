'use client'

import { useLocale } from 'next-intl'
import { Form, Input, Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { IMAGES } from '@/constants/admin/theme'
import { Link } from '@/i18n/routing'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ForgotPassword() {
  const t = useTranslations('forgotPassword')
  const locale = useLocale()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])


  if (!isMounted) return null

  return (
    <div className="flex min-h-screen font-roboto">
      <div className="hidden md:flex md:w-1/2 bg-white flex-col items-center justify-center p-8">
        <div className="mb-6 flex items-center gap-3">
          <Image
            src={IMAGES.LogoGas}
            alt="Logo Gas"
            width={48}
            height={48}
            priority // Giữ priority cho logo nhỏ
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {locale === 'vi' ? 'CỬA HÀNG GAS' : 'GAS STORE'}
          </h2>
        </div>
        <p className="text-center text-gray-700 text-lg mb-8 max-w-lg">
          {locale === 'vi'
            ? 'Cung cấp các loại bình gas chất lượng cao, đảm bảo an toàn và chất lượng dịch vụ giao hàng nhanh chóng đến tận nhà.'
            : 'Providing high-quality gas cylinders, ensuring safety and fast delivery service right to your door.'}
        </p>
        <Image
          src={IMAGES.GaoGas}
          alt="Illustration of people with charts"
          width={500}
          height={300}
          className="w-full max-w-2xl object-cover"
          // Không dùng priority để tối ưu tải
        />
      </div>

      <div
        className="w-full md:w-1/2 -mt-56 flex items-center justify-center min-h-screen relative"
        style={{ backgroundImage: `url(${IMAGES.Istock})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
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