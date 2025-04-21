import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale || 'vi'
  
  try {
    return {
      messages: (await import(`./messages/${safeLocale}.json`)).default,
      locale: safeLocale 
    }
  } catch (error) {
    console.error(`Could not load messages for locale ${safeLocale}`, error)
    return {
      messages: (await import('./messages/vi.json')).default,
      locale: 'vi' 
    }
  }
})