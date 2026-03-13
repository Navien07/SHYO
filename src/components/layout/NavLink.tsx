'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function NavLink({ href, className, children }: NavLinkProps) {
  const pathname = usePathname();
  // Exact match for home (/), prefix match for all other routes
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        className,
        // Active route: replace transparent border with brand-green underline
        isActive && 'border-brand-green text-brand-green-dark'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
