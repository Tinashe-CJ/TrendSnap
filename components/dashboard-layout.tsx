'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Plus,
  Video,
  TrendingUp,
  Settings,
  CreditCard,
  LogOut,
  User,
  HelpCircle,
  Crown,
  BarChart3,
  Archive,
  Zap,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const navigation = [
  {
    title: 'Create',
    items: [
      { title: 'Dashboard', icon: Home, href: '/dashboard' },
      { title: 'New Video', icon: Plus, href: '/create' },
      { title: 'Templates', icon: Video, href: '/templates' },
      { title: 'Trending', icon: TrendingUp, href: '/trends' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { title: 'My Locker', icon: Archive, href: '/locker' },
      { title: 'Analytics', icon: BarChart3, href: '/analytics' },
    ],
  },
  {
    title: 'Account',
    items: [
      { title: 'Settings', icon: Settings, href: '/settings' },
      { title: 'Upgrade', icon: Crown, href: '/upgrade' },
      { title: 'Billing', icon: CreditCard, href: '/billing' },
      { title: 'Help', icon: HelpCircle, href: '/help' },
    ],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="border-b border-gray-200 p-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              TrendSnap
            </span>
          </Link>
        </div>

        <div className="p-4">
          {/* Navigation */}
          {navigation.map((group) => (
            <div key={group.title} className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link 
                    key={item.title}
                    href={item.href} 
                    onClick={() => setSidebarOpen(false)} 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'text-purple-600 font-semibold bg-purple-50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

              <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Credits:</span>
                <Badge variant="outline">{user.credits}</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Sign out</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}