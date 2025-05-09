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

    if (options?.useToken !== false) {
      const token = getAuthToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method,
      headers,
      ...(options?.body && { body: JSON.stringify(options.body) }),
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
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('Refresh token not found')

  const response = await fetcher(`${BASE_URL}/api/auth/refresh`, 'POST', {
    body: { refresh_token: refreshToken },
    useToken: false, 
  })

  if (response.token) Cookies.set('token', response.token, { expires: 1/96 }) 
  if (response.refresh_token) Cookies.set('refresh_token', response.refresh_token, { expires: 7 }) 

  return response
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