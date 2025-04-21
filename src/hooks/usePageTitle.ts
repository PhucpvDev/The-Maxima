'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '@/redux/features/titleSlice'

export function usePageTitle(title: string) {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setPageTitle({ title}))
  }, [dispatch, title])
}