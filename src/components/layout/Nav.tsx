import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { NavLink } from './NavLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileDrawer } from './MobileDrawer';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'programmes', href: '/programmes' },
  { key: 'team', href: '/team' },
  { key: 'documents', href: '/documents' },
  { key: 'contact', href: '/contact' },
  { key: 'membership', href: '/membership' },
] as const;

export function Nav() {
  const t = useTranslations('nav');

  const navLinkElements = NAV_LINKS.map(({ key, href }) => (
    <NavLink
      key={key}
      href={href}
      className="block px-3 py-2 text-gray-800 font-medium text-base hover:text-brand-green-dark transition-colors rounded-md hover:bg-gray-50 min-h-[44px] flex items-center lg:inline-flex lg:px-2 lg:py-1 lg:rounded-none lg:border-b-2 lg:border-transparent lg:hover:border-brand-green lg:hover:bg-transparent"
    >
      {t(key)}
    </NavLink>
  ));

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
      {/* Logo left */}
      <Link href="/" className="flex items-center gap-2 shrink-0 min-h-[44px]" aria-label="Seputeh HYO — Home">
        <Image
          src="/logo.svg"
          alt="Seputeh HYO logo"
          width={140}
          height={36}
          priority
        />
      </Link>

      {/* Desktop nav links — hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
        {navLinkElements}
      </nav>

      {/* Desktop language switcher — hidden on mobile */}
      <div className="hidden lg:flex items-center">
        <LanguageSwitcher />
      </div>

      {/* Mobile hamburger — hidden on desktop */}
      <MobileDrawer navLinks={navLinkElements} />
    </div>
  );
}
