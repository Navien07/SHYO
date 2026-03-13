'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Bahasa Malaysia' },
  { code: 'ta', label: 'தமிழ்' },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();

  const handleLocaleChange = (locale: string) => {
    router.replace(
      // @ts-expect-error — params type from next/navigation is broader than next-intl expects
      { pathname, params },
      { locale }
    );
  };

  return (
    <div className="flex gap-1 flex-wrap" role="group" aria-label="Language switcher">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleLocaleChange(code)}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium min-h-[44px] min-w-[44px] transition-colors',
            currentLocale === code
              ? 'bg-brand-green-dark text-white'
              : 'text-gray-600 hover:text-brand-green-dark border border-gray-200 hover:border-brand-green'
          )}
          aria-current={currentLocale === code ? 'true' : undefined}
          aria-pressed={currentLocale === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
