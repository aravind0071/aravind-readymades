import React from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { getAdminDashboardStats, getProducts } from '@/lib/data/store-service';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Sparkles,
  Tag,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [stats, recentProducts] = await Promise.all([
    getAdminDashboardStats(),
    getProducts(),
  ]);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-500' },
    { title: 'Available In-Stock', value: stats.availableProducts, icon: CheckCircle2, color: 'text-green-500' },
    { title: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'text-amber-500' },
    { title: 'Categories', value: stats.categoriesCount, icon: FolderTree, color: 'text-purple-500' },
    { title: 'New Arrivals', value: stats.newArrivals, icon: Sparkles, color: 'text-[#C5A059]' },
    { title: 'Active Offers', value: stats.activeOffers, icon: Tag, color: 'text-[#881326]' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
      {/* Sidebar Nav */}
      <AdminNav />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E3D9]">
          <div>
            <span className="text-xs font-bold text-[#881326] uppercase tracking-wider">
              Overview &amp; Metrics
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#121417]">
              Store Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              Live statistics and product catalog management for Aravind Readymades.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* 6 Statistic Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="bg-white p-4 rounded-xl border border-[#E8E3D9] shadow-sm flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500 truncate">{c.title}</span>
                  <Icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <span className="text-2xl font-black text-[#121417]">{c.value}</span>
              </div>
            );
          })}
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl border border-[#E8E3D9] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#121417]">Recent Products</h2>
              <p className="text-xs text-gray-500">Products currently listed on the store</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#881326] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {recentProducts.slice(0, 6).map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{prod.product_code}</td>
                    <td className="py-3 px-4 font-semibold text-[#121417]">{prod.name}</td>
                    <td className="py-3 px-4">{prod.category?.name || 'General'}</td>
                    <td className="py-3 px-4 font-bold">
                      ₹{(prod.discount_price ?? prod.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prod.stock_status === 'in_stock'
                            ? 'bg-green-100 text-green-800'
                            : prod.stock_status === 'low_stock'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.stock_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-1">
                      {prod.new_arrival && (
                        <span className="bg-[#881326] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                      {prod.featured && (
                        <span className="bg-[#C5A059] text-[#121417] text-[9px] font-bold px-1.5 py-0.5 rounded">
                          FEATURED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="text-xs font-semibold text-[#881326] hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-gray-500 hover:text-black"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
