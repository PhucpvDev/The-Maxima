'use client'

import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { refreshToken } from '@/services/apiServices'

interface AuthState {
  token: string | undefined
  refreshToken: string | undefined
  isAuthenticated: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: Cookies.get('token'),
    refreshToken: Cookies.get('refresh_token'),
    isAuthenticated: !!Cookies.get('token'),
  })

  // Hàm logout
  const logout = useCallback(() => {
    Cookies.remove('token')
    Cookies.remove('refresh_token')
    setAuthState({
      token: undefined,
      refreshToken: undefined,
      isAuthenticated: false,
    })
  }, [])

  // Hàm làm mới token - sử dụng useCallback để memoize hàm
  const handleRefreshToken = useCallback(async () => {
    try {
      const { token, refresh_token } = await refreshToken()
      setAuthState({
        token,
        refreshToken: refresh_token,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Xử lý logout nếu làm mới thất bại
      logout()
    }
  }, [logout]) // thêm logout vào dependencies

  // Kiểm tra và làm mới token sau mỗi 14 phút (thời gian gần hết hạn 15 phút)
  useEffect(() => {
    const tokenExpiryCheck = setInterval(() => {
      const token = Cookies.get('token')
      if (token) {
        handleRefreshToken()
      }
    }, 14 * 60 * 1000) // 14 phút

    return () => clearInterval(tokenExpiryCheck)
  }, [handleRefreshToken]) // Thêm handleRefreshToken vào dependency array

  // Hàm login
  const login = useCallback((newToken: string, newRefreshToken: string) => {
    Cookies.set('token', newToken, { expires: 1/96 }) // 15 phút
    Cookies.set('refresh_token', newRefreshToken, { expires: 7 }) // 7 ngày
    setAuthState({
      token: newToken,
      refreshToken: newRefreshToken,
      isAuthenticated: true,
    })
  }, [])

  return {
    ...authState,
    login,
    logout,
  }
}

export default useAuth