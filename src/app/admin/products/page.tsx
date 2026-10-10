'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { Product } from '@/lib/supabase/types';
import { Plus, Search, Edit, Trash2, ExternalLink, Filter } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleStock = (id: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const nextStock =
            p.stock_status === 'in_stock'
              ? 'low_stock'
              : p.stock_status === 'low_stock'
              ? 'out_of_stock'
              : 'in_stock';
          return { ...p, stock_status: nextStock };
        }
        return p;
      })
    );
  };

  const handleTogglePublish = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3D9]">
          <div>
            <h1 className="text-2xl font-black text-[#121417]">Product Management</h1>
            <p className="text-xs text-gray-500">
              Manage inventory, pricing, sizes, and store visibility.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#881326] hover:bg-[#6E0E1E] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E3D9] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="text-xs py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none text-gray-700"
            >
              <option value="all">All Categories</option>
              {INITIAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-[#E8E3D9] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status (Click to Cycle)</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{prod.product_code}</td>
                    <td className="py-3 px-4 font-semibold text-[#121417]">
                      {prod.name}
                      <span className="block text-[10px] text-gray-400">
                        Sizes: {prod.sizes.join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      ₹{(prod.discount_price ?? prod.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(prod.id)}
                        title="Click to toggle stock status"
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                          prod.stock_status === 'in_stock'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : prod.stock_status === 'low_stock'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {prod.stock_status.replace('_', ' ')}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(prod.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prod.published
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {prod.published ? 'Published' : 'Draft'}
                      </button>
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
                        className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                        title="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
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
