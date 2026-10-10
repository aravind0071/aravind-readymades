'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Tag,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Offers', href: '/admin/offers', icon: Tag },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aravind_admin_session');
    }
    router.push('/admin/login');
  };

  return (
    <aside className="w-full lg:w-64 bg-[#121417] text-white flex flex-col shrink-0 border-r border-[#2A2F38]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#2A2F38] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#881326] flex items-center justify-center font-bold text-white border border-[#C5A059]">
            A
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
              ARAVIND ADMIN
            </h2>
            <span className="text-[10px] text-[#C5A059] block font-medium">Store Management</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#881326] text-white shadow'
                  : 'text-gray-300 hover:bg-[#1F232B] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-[#C5A059]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-[#2A2F38] space-y-2 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#1F232B] hover:bg-[#282E39] text-gray-300 hover:text-white font-medium"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export { AdminNav };
