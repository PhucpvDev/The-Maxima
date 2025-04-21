'use client'

import { Result, Button } from 'antd'
import { IMAGES } from '@/constants/admin/theme'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Conflict() {
  const router = useRouter()

  const handleResetLimit = async () => {
    try {
      await fetch('/api/reset-limit')
      router.push('/') 
    } catch (error) {
      console.error('Lỗi reset request limit:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="relative max-w-lg w-full mx-4 p-8 bg-white rounded-xs">
        <div className="absolute top-4 right-4">
          <Image
            src={IMAGES.Conflict} 
            alt="Error Robot"
            width={120}
            height={120}
            className="opacity-90"
          />
        </div>

        <Result
          status="warning"
          title={
            <h1 className="text-3xl font-semibold text-gray-800">
              409 - Xung đột
            </h1>
          }
          subTitle={
            <p className="text-gray-600 text-base max-w-sm mx-auto">
              Yêu cầu của bạn không thể được hoàn thành do xung đột với trạng thái hiện tại của tài nguyên.
            </p>
          }
          extra={
            <div className="flex flex-col items-center gap-4 mt-4">
              <Button
                type="primary"
                onClick={handleResetLimit}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg px-6 py-2 transition-all duration-300"
              >
                Quay lại trang chủ
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}
