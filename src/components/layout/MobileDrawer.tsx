'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileDrawerProps {
  navLinks: React.ReactNode;
}

export function MobileDrawer({ navLinks }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors lg:hidden"
      >
        <Menu className="h-6 w-6 text-gray-700" aria-hidden="true" />
      </button>
      <SheetContent side="right" className="w-[300px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6 flex-1" aria-label="Mobile navigation">
          {navLinks}
        </nav>
        <div className="pt-6 border-t border-gray-200 pb-4">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Language</p>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
