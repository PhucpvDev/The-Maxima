import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('mytheme')
    if (savedTheme) return savedTheme
  }
  return 'light'
}

export interface ThemeState {
  mytheme: string
}

const initialState: ThemeState = {
  mytheme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'mytheme',
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      state.mytheme = state.mytheme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.setItem('mytheme', state.mytheme)
      }
    },
  },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer