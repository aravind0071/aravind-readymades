'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Phone, MessageCircle, Menu, X, MapPin, Clock, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants/store-defaults';
import { generateGeneralWhatsAppLink } from '@/lib/utils/whatsapp';
import { getWishlistCount } from '@/lib/utils/wishlist';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setWishlistCount(getWishlistCount());
    const handleUpdate = () => setWishlistCount(getWishlistCount());
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Kids', href: '/kids' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Offers', href: '/offers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const whatsappUrl = generateGeneralWhatsAppLink(DEFAULT_STORE_SETTINGS.whatsapp_number);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#121417] text-[#FDFBF7] text-xs py-2 px-4 border-b border-[#2A2F38]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs tracking-wide">
            <span className="flex items-center gap-1.5 text-[#C5A059]">
              <MapPin className="w-3.5 h-3.5" />
              Main Road, Malikipuram - 533253
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[#A1A1AA]">
              <Clock className="w-3.5 h-3.5" />
              {DEFAULT_STORE_SETTINGS.opening_hours}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#C5A059] hover:text-white bg-[#C5A059]/10 px-2.5 py-0.5 rounded border border-[#C5A059]/30 transition-all hover:bg-[#C5A059]/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Host / Owner Login</span>
            </Link>
            <span className="text-[#3F3F46]">|</span>
            <a
              href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
              className="hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden sm:inline">{DEFAULT_STORE_SETTINGS.phone_primary}</span>
            </a>
            <span className="text-[#3F3F46]">|</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-[#20ba59] flex items-center gap-1 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E3D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-lg bg-[#881326] flex items-center justify-center text-[#FDFBF7] font-bold text-xl border border-[#C5A059] shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#121417]">
                  ARAVIND <span className="text-[#881326]">READYMADES</span>
                </span>
                <span className="text-[10px] tracking-widest font-semibold uppercase text-[#71717A]">
                  Ladies • Gents • Kids Wear
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-[#881326] font-semibold bg-[#881326]/5'
                        : 'text-[#121417] hover:text-[#881326] hover:bg-black/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search clothing"
                className="p-2 text-[#121417] hover:text-[#881326] hover:bg-black/5 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button (Boutique Style) */}
              <Link
                href="/wishlist"
                aria-label="View Wishlist"
                className="relative p-2 text-gray-700 hover:text-[#881326] hover:bg-black/5 rounded-full transition-colors flex items-center justify-center group"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5 group-hover:fill-[#881326] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#881326] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Host/Owner Login Direct Button */}
              <Link
                href="/admin/login"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#881326] bg-[#881326]/10 hover:bg-[#881326]/20 rounded-md transition-colors border border-[#881326]/20"
                title="Store Owner Portal (Stock, Prices & Products)"
              >
                <ShieldCheck className="w-4 h-4 text-[#881326]" />
                <span>Host Login</span>
              </Link>

              {/* WhatsApp Quick CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A059]" />
                <span>Enquire Now</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="lg:hidden p-2 text-[#121417] hover:bg-black/5 rounded-md"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E8E3D9] bg-[#FFFFFF] py-4 px-4 shadow-md animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search shirts, jeans, kurtis, kids wear, product code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-11 pr-24 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#881326] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-[#881326] text-white text-xs font-medium rounded-md hover:bg-[#6E0E1E] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-[#FDFBF7] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[#881326] flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <span className="font-bold text-[#121417]">ARAVIND READYMADES</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-gray-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-[#881326] text-white'
                        : 'text-[#121417] hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-6 border-t border-[#E8E3D9] space-y-3">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 bg-[#881326]/5 rounded-xl border border-[#881326]/15 text-[#881326] font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-[#881326]" />
                  Saved Wishlist ({wishlistCount})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 text-[#881326] font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#881326]" />
                  Host / Owner Login (Manage Stock)
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold shadow"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>

              <a
                href={`tel:${DEFAULT_STORE_SETTINGS.phone_primary}`}
                className="w-full flex items-center justify-center gap-2 bg-[#121417] text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                Call {DEFAULT_STORE_SETTINGS.phone_primary}
              </a>
              <div className="text-center text-xs text-gray-500 pt-2">
                <p>Main Road, Malikipuram - 533253</p>
                <p>Timings: 9:30 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
