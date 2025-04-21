'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { IMAGES } from '@/constants/client/theme'
import { Tooltip, Switch } from 'antd'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  const languages = [
    { code: 'en', name: 'EN', flag: IMAGES.flagEn || '/flags/gb.png' },
    { code: 'vi', name: 'VI', flag: IMAGES.flagVi || '/flags/vn.png' },
  ]

  const [isToggled, setIsToggled] = useState(false) 

  useEffect(() => {
    setIsClient(true) 
    setIsToggled(locale === 'vi') 
  }, [locale])

  const switchLocale = (newLocale: string) => {
    const currentPathname = pathname.replace(`/${locale}`, '') || '/'
    router.push(`/${newLocale}${currentPathname}`)
  }

  const handleToggle = () => {
    const newLocale = isToggled ? 'en' : 'vi'
    setIsToggled(!isToggled)
    switchLocale(newLocale)
  }

  if (!isClient) {
    return null 
  }

  return (
    <div className="flex justify-end p-4">
      <Tooltip title="Language">
        <Switch
          className="hidden sm:inline"
          checkedChildren={
            <Image
              src={languages[1].flag}
              alt={`${languages[1].name} flag`}
              width={16}
              height={16}
              priority
              className="rounded-full w-5 mt-[1.5px] h-5"
            />
          }
          unCheckedChildren={
            <Image
              src={languages[0].flag}
              alt={`${languages[0].name} flag`}
              width={16}
              height={16}
              priority
              className="rounded-full w-5 h-5"
            />
          }
          checked={isToggled}
          onClick={handleToggle}
        />
      </Tooltip>
    </div>
  )
}