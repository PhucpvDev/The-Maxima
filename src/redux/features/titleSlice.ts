import { createSlice, PayloadAction } from '@reduxjs/toolkit' 

const initialState: TitleState = {
  title: '',
}

const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<{ title: string}>) => {
      state.title = action.payload.title
    },
  },
})

export const { setPageTitle } = titleSlice.actions
export default titleSlice.reducer

