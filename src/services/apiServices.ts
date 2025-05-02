'use client'

import useSWR, { SWRResponse } from 'swr'
import Cookies from 'js-cookie'

interface RequestOptions {
  headers?: Record<string, string>
  body?: any
  useToken?: boolean
  params?: Record<string, string>
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

const getAuthToken = (): string | undefined => Cookies.get('token')
const getRefreshToken = (): string | undefined => Cookies.get('refresh_token')

const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const fullUrl = `${BASE_URL}${endpoint}`
  if (!params) return fullUrl
  return `${fullUrl}?${new URLSearchParams(params).toString()}`
};

const fetcher = async (
  url: string,
  method: string = 'GET',
  options?: RequestOptions
): Promise<any> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }

    let token = options?.useToken !== false ? getAuthToken() : null

    if (options?.useToken !== false && !token) {
      token = await refreshAccessToken() // Thử làm mới token nếu không có
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    console.log(`Making ${method} request to ${url}`, options?.body || 'No body')

    const response = await fetch(url, {
      method,
      headers,
      ...(options?.body && { body: JSON.stringify(options.body) }),
    })

    const responseText = await response.text()
    console.log(`Response status: ${response.status}`, responseText)

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      data = { message: responseText }
    }

    if (!response.ok) {
      if (response.status === 401 && options?.useToken !== false) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`
          // Thử lại yêu cầu với token mới
          const retryResponse = await fetch(url, {
            method,
            headers,
            ...(options?.body && { body: JSON.stringify(options.body) }),
          })
          const retryText = await retryResponse.text()
          console.log(`Retry response status: ${retryResponse.status}`, retryText)
          let retryData
          try {
            retryData = retryText ? JSON.parse(retryText) : {}
          } catch (e) {
            console.error('Failed to parse retry response as JSON:', e)
            retryData = { message: retryText }
          }
          if (!retryResponse.ok) {
            throw {
              status: retryResponse.status,
              message: retryData.message || `Error ${retryResponse.status}`,
              response: { data: retryData }
            }
          }
          return retryData
        }
      }
      throw {
        status: response.status,
        message: data.message || `Error ${response.status}`,
        response: { data }
      }
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Hàm làm mới token
const refreshAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    console.error('No refresh token available')
    Cookies.remove('token')
    Cookies.remove('refresh_token')
    Cookies.remove('user')
    window.location.href = '/login' // Chuyển hướng về trang login
    return undefined
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const responseText = await response.text()
    console.log(`Refresh response status: ${response.status}`, responseText)

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('Failed to parse refresh response as JSON:', e)
      data = { message: responseText }
    }

    if (!response.ok) {
      throw new Error(data.message || 'Refresh token failed')
    }

    if (data.access_token) {
      Cookies.set('token', data.access_token, {
        expires: 1, // 1 ngày, nhưng backend có thể điều chỉnh
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
      if (data.refresh_token) {
        Cookies.set('refresh_token', data.refresh_token, {
          expires: 7, // 7 ngày
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        })
      }
      return data.access_token
    } else {
      throw new Error('No access token in refresh response')
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    Cookies.remove('token')
    Cookies.remove('refresh_token')
    Cookies.remove('user')
    window.location.href = '/login' // Chuyển hướng về trang login nếu làm mới thất bại
    return undefined
  }
}

export function useApi<T>() {
  const get = (endpoint: string, options?: Omit<RequestOptions, 'body'>): SWRResponse<T, Error> => {
    const url = buildUrl(endpoint, options?.params)
    return useSWR<T, Error>(
      url,
      () => fetcher(url, 'GET', options),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    )
  };

  const mutate = async (
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body?: any,
    options?: RequestOptions
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    const data = await fetcher(url, method, { ...options, body })
    return data
  }

  const post = (endpoint: string, body: any, options?: Omit<RequestOptions, 'body'>) =>
    mutate(endpoint, 'POST', body, options)

  const put = (endpoint: string, body: any, options?: Omit<RequestOptions, 'body'>) =>
    mutate(endpoint, 'PUT', body, options)

  const del = (endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    mutate(endpoint, 'DELETE', undefined, options)

  return { get, post, put, del }
}