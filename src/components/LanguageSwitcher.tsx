'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { IMAGES } from '@/constants/client/theme'
import { Tooltip, Select } from 'antd'
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
    { code: 'zh', name: 'ZH', flag: IMAGES.LangCn || '/flags/cn.png' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const switchLocale = (newLocale: string) => {
    const currentPathname = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${currentPathname}`);
  };

  const handleChange = (value: string) => {
    switchLocale(value);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <Tooltip title="Language">
        <Select
          value={locale}
          onChange={handleChange}
          className="w-24"
          options={languages.map((lang) => ({
            value: lang.code,
            label: (
              <div className="flex items-center gap-2">
                <Image
                  src={lang.flag}
                  alt={`${lang.name} flag`}
                  width={16}
                  height={16}
                  priority
                  className="rounded-full w-5 h-5 coverage-image object-cover aspect-square"
                />
                <span>{lang.name}</span>
              </div>
            ),
          }))}
        />
      </Tooltip>
    </div>
  );
}