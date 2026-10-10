'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

function EditProductForm({ params }: EditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const product = INITIAL_PRODUCTS.find((p) => p.id === id) || INITIAL_PRODUCTS[0];

  const [name, setName] = useState(product.name);
  const [productCode, setProductCode] = useState(product.product_code);
  const [categoryId, setCategoryId] = useState(product.category_id);
  const [price, setPrice] = useState(product.price.toString());
  const [discountPrice, setDiscountPrice] = useState(product.discount_price?.toString() || '');
  const [description, setDescription] = useState(product.description);
  const [stockStatus, setStockStatus] = useState(product.stock_status);
  const [newArrival, setNewArrival] = useState(product.new_arrival);
  const [featured, setFeatured] = useState(product.featured);
  const [published, setPublished] = useState(product.published);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E8E3D9]">
          <Link
            href="/admin/products"
            className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#121417]">Edit Product</h1>
            <p className="text-xs text-gray-500">
              Updating details for code: <span className="font-mono font-bold text-black">{productCode}</span>
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-green-100 text-green-800 rounded-lg text-xs font-bold">
            ✓ Product updated successfully! Redirecting...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm space-y-5 text-xs"
        >
          <div className="space-y-1">
            <label className="block font-bold text-gray-900">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Product Code</label>
              <input
                type="text"
                required
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
              >
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.slug === 'women' ? '(No Sarees)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Price (₹ INR)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Discount Price</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-gray-900">Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-gray-900">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100 font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>Published</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#881326] text-white font-bold rounded-lg shadow hover:bg-[#6E0E1E] transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/products"
              className="px-4 py-2.5 text-gray-600 hover:text-black font-semibold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditProductPage({ params }: EditPageProps) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] p-10 text-stone-500">Loading product editor...</div>}>
      <EditProductForm params={params} />
    </React.Suspense>
  );
}
