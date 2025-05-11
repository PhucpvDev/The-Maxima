'use client'

import Cookies from 'js-cookie'

interface RequestOptions {
  headers?: Record<string, string>
  body?: string | Record<string, unknown>
  useToken?: boolean
  params?: Record<string, string>
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const TOKEN_COOKIE_EXPIRY = 0.5; 

const getAuthToken = (): string | undefined => Cookies.get('token')
const getRefreshToken = (): string | undefined => Cookies.get('refresh_token')

const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const fullUrl = `${BASE_URL}${endpoint}`
  if (!params) return fullUrl
  return `${fullUrl}?${new URLSearchParams(params).toString()}`
};

const fetcher = async <T>(
  url: string,
  method: string = 'GET',
  options?: RequestOptions
): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }

    if (options?.useToken !== false) {
      const token = getAuthToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    const finalBody = typeof options?.body === 'string' 
      ? options.body
      : options?.body ? JSON.stringify(options.body) : undefined;

    const response = await fetch(url, {
      method,
      headers,
      ...(finalBody && { body: finalBody }),
    })

    const responseText = await response.text()

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      data = { message: responseText }
    }

    if (!response.ok) {
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

export const refreshToken = async (): Promise<{ token: string; refresh_token: string }> => {
  const refreshTokenValue = getRefreshToken()
  if (!refreshTokenValue) throw new Error('Refresh token not found')

  const response = await fetcher<{ token: string; refresh_token: string }>(
    `${BASE_URL}/api/auth/refresh`, 
    'POST', 
    {
      body: { refresh_token: refreshTokenValue },
      useToken: false,
    }
  )

  if (response.token) Cookies.set('token', response.token, { expires: TOKEN_COOKIE_EXPIRY })
  if (response.refresh_token) Cookies.set('refresh_token', response.refresh_token, { expires: 7 })
  
  return response
}

export function useApi<T>() {
  const fetchData = async (
    endpoint: string, 
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    return fetcher<T>(url, 'GET', options)
  }

  const get = async (
    endpoint: string, 
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    return fetchData(endpoint, options)
  }

  const mutate = async (
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    const data = await fetcher<T>(url, method, { ...options, body })
    return data
  }

  const post = (
    endpoint: string, 
    body: Record<string, unknown>, 
    options?: Omit<RequestOptions, 'body'>
  ) => mutate(endpoint, 'POST', body, options)

  const put = (
    endpoint: string, 
    body: Record<string, unknown>, 
    options?: Omit<RequestOptions, 'body'>
  ) => mutate(endpoint, 'PUT', body, options)

  const del = (
    endpoint: string, 
    options?: Omit<RequestOptions, 'body'>
  ) => mutate(endpoint, 'DELETE', undefined, options)

  return { get, post, put, del }
}

export const apiClient = {
  get: async <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    return fetcher<T>(url, 'GET', options)
  },
  
  post: async <T>(
    endpoint: string, 
    body: Record<string, unknown>, 
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    return fetcher<T>(url, 'POST', { ...options, body })
  },
  
  put: async <T>(
    endpoint: string, 
    body: Record<string, unknown>, 
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    return fetcher<T>(url, 'PUT', { ...options, body })
  },
  
  delete: async <T>(
    endpoint: string, 
    options?: Omit<RequestOptions, 'body'>
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params)
    return fetcher<T>(url, 'DELETE', options)
  }
}