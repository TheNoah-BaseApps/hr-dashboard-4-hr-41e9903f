'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="ml-4 text-xl font-bold">HR Dashboard 4</div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">HR Manager</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Logout</Button>
        </div>
      </div>
    </header>
  );
}