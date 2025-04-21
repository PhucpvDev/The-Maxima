import { configureStore, combineReducers } from '@reduxjs/toolkit'
import themeReducer, { ThemeState } from '@/redux/theme/themeSlice'
import { persistReducer, persistStore, PersistConfig } from 'redux-persist'
import titleReducer from './features/titleSlice'
import storage from 'redux-persist/lib/storage'

interface RootState {
  theme: ThemeState
}

const rootReducer = combineReducers({
  theme: themeReducer,
})

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: {
    persistedReducer,
    theme: themeReducer,
    title: titleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
export type { RootState }
export type AppDispatch = typeof store.dispatch