'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Form, Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { IMAGES } from '@/constants/client/theme'
import { Link } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useCustomNotification } from '@/components/admin/notification/customNotification'
import Image from 'next/image'

function ResetPasswordForm() {
  const t = useTranslations('resetPassword')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const { showNotification, contextHolder } = useCustomNotification()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    setLoading(true)
    try {
      if (values.newPassword !== values.confirmPassword) {
        throw new Error(t('passwordsNotMatch'))
      }
      if (values.newPassword.length < 6) {
        throw new Error(t('passwordTooShort'))
      }
      if (!email || !token) {
        throw new Error(t('invalidLink'))
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
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
      setTimeout(() => {
        window.location.href = `/${locale}/auth/login`
      }, 2000)
    } catch (error) {
      console.error('Error resetting password:', error)
      const errorMessage = error instanceof Error ? error.message : t('requestFailed')
      showNotification({
        message: errorMessage,
        showProgress: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <Form
        name="reset_password"
        style={{ maxWidth: 600 }}
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          label={<span className="text-gray-700 text-base font-medium">{t('newPasswordLabel')}</span>}
          name="newPassword"
          rules={[
            { required: true, message: t('passwordRequired') },
            { min: 6, message: t('passwordTooShort') },
          ]}
          className="mb-5"
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('newPasswordPlaceholder')}
            className="rounded-md py-2 px-4 text-gray-700"
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-700 text-base font-medium">{t('confirmPasswordLabel')}</span>}
          name="confirmPassword"
          rules={[
            { required: true, message: t('confirmPasswordRequired') },
          ]}
          className="mb-5"
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('confirmPasswordPlaceholder')}
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
    </>
  )
}

export default function ResetPassword() {
  const t = useTranslations('resetPassword')
  const locale = useLocale()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex min-h-screen font-roboto">
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
                {t('resetTitle')}
              </h1>
            </div>
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}