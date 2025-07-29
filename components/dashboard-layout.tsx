'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
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
import { useRouter } from 'next/navigation';

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
      { title: 'Billing', icon: CreditCard, href: '/billing' },
      { title: 'Help', icon: HelpCircle, href: '/help' },
    ],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <SidebarHeader className="border-b border-gray-200 p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                TrendSnap
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            {/* User info */}
            <div className="mb-6 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm truncate">
                  {user.name || user.email.split('@')[0]}
                </span>
                <Badge variant={user.tier === 'free' ? 'secondary' : 'default'} className="text-xs">
                  {user.tier}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Credits</span>
                <span className="font-medium">{user.credits}</span>
              </div>
              {user.tier === 'free' && (
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>

            {/* Navigation */}
            {navigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <Badge variant="outline">{user.credits}</Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="hidden md:block">{user.name || user.email.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name || user.email.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}