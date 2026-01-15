'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Menu,
  X,
  Package,
  ShoppingCart,
  TrendingDown,
  BarChart3,
  CalendarDays,
  FileText,
  ChevronDown,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type MenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type MenuGroup = {
  name: string;
  icon: React.ElementType;
  isGroup: true;
  children: MenuItem[];
};

type NavigationItem = MenuItem | MenuGroup;

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Absensi', href: '/absensi', icon: UserCheck },
  { 
    name: 'Cuti', 
    icon: CalendarDays, 
    isGroup: true,
    children: [
      { name: 'Data Karyawan', href: '/karyawan', icon: Users },
      { name: 'Cuti Tahunan', href: '/cuti-tahunan', icon: CalendarCheck },
      { name: 'Pengajuan Cuti', href: '/cuti', icon: FileText },
    ]
  },
  { 
    name: 'Inventory', 
    icon: Package, 
    isGroup: true,
    children: [
      { name: 'Master Item', href: '/item', icon: Package },
      { name: 'Pembelian', href: '/pembelian', icon: ShoppingCart },
      { name: 'Pengeluaran', href: '/pengeluaran', icon: TrendingDown },
      { name: 'Laporan', href: '/laporan', icon: BarChart3 },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Cuti': true,
    'Inventory': true,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <CalendarCheck className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              HRD App
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if ('isGroup' in item && item.isGroup) {
                const isExpanded = expandedGroups[item.name];
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(item.name)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {isExpanded && item.children?.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center pl-8 pr-4 py-2 text-sm font-medium rounded-lg transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          <child.icon className="h-4 w-4 mr-3" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              // This is a regular menu item with href
              const menuItem = item as MenuItem;
              const isActive = pathname === menuItem.href;
              return (
                <Link
                  key={menuItem.name}
                  href={menuItem.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <menuItem.icon className="h-5 w-5 mr-3" />
                  {menuItem.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2026 HRD App
              <br />
              v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
