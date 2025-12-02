'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Employee Onboarding',
    href: '/onboarding',
  },
  {
    name: 'Leave & Attendance',
    href: '/leave-attendance',
  },
  {
    name: 'Payroll Management',
    href: '/payroll',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-full max-w-xs border-r bg-background md:block">
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'block rounded-md px-4 py-2 text-sm font-medium',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}