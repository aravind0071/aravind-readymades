'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { createProduct } from '@/lib/data/store-service';
import { ArrowLeft, Upload, Check, Sparkles } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [productCode, setProductCode] = useState('AR-1001');

  useEffect(() => {
    setProductCode(`AR-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);
  const [categoryId, setCategoryId] = useState('cat-men');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [selectedColours, setSelectedColours] = useState<string[]>(['Navy Blue']);
  const [colourInput, setColourInput] = useState('');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');
  const [newArrival, setNewArrival] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState('/images/products/shirt_casual_olive.jpg');
  const [submitting, setSubmitting] = useState(false);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '2-3Y', '4-5Y', '6-7Y', '8-9Y'];

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleAddColour = () => {
    if (colourInput.trim() && !selectedColours.includes(colourInput.trim())) {
      setSelectedColours([...selectedColours, colourInput.trim()]);
      setColourInput('');
    }
  };

  const removeColour = (col: string) => {
    setSelectedColours(selectedColours.filter((c) => c !== col));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSubmitting(true);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    await createProduct({
      name,
      slug: `${slug}-${productCode.toLowerCase()}`,
      description: description || 'Premium readymade apparel from Aravind Readymades, Malikipuram.',
      category_id: categoryId,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : undefined,
      product_code: productCode,
      sizes: selectedSizes,
      colours: selectedColours,
      stock_status: stockStatus,
      new_arrival: newArrival,
      featured,
      published,
      display_order: 1,
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: '',
          image_url: imageUrl,
          alt_text: name,
          display_order: 1,
          is_primary: true,
        },
      ],
    });

    router.push('/admin/products');
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
            <h1 className="text-2xl font-black text-[#121417]">Add New Product</h1>
            <p className="text-xs text-gray-500">
              Simple 10-step form designed for quick in-store inventory entry.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm space-y-6 text-xs"
        >
          {/* 1. Photo Selection */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-900">
              1. Product Photo (Select Preset or Enter Image URL)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Men Shirt', url: '/images/products/shirt_casual_olive.jpg' },
                { label: 'Men Jeans', url: '/images/products/jeans_men_indigo.jpg' },
                { label: 'Women Kurti', url: '/images/products/kurti_designer_cotton.jpg' },
                { label: 'Girls Frock', url: '/images/products/girls_frock_dress.jpg' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.url}
                  onClick={() => setImageUrl(opt.url)}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all ${
                    imageUrl === opt.url
                      ? 'border-[#881326] bg-[#881326]/5 ring-2 ring-[#881326]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={opt.url} alt={opt.label} className="w-16 h-20 object-cover rounded" />
                  <span className="font-semibold text-[11px] text-gray-700">{opt.label}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or custom image URL (/images/...)"
              className="w-full mt-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* 2. Product Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-gray-900">2. Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cotton Check Casual Shirt"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-[#881326]"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Product Code *</label>
              <input
                type="text"
                required
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* 3. Category */}
          <div className="space-y-1">
            <label className="block font-bold text-gray-900">3. Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800"
            >
              {INITIAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.slug === 'women' ? '(No Sarees)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Price & Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">4. Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="899"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-gray-900">Discounted Price (Optional)</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="799"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
              />
            </div>
          </div>

          {/* 5. Sizes */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-900">
              5. Select Available Sizes ({selectedSizes.join(', ')})
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    selectedSizes.includes(sz)
                      ? 'bg-[#121417] text-white border-[#121417]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Colours */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-900">6. Colours</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={colourInput}
                onChange={(e) => setColourInput(e.target.value)}
                placeholder="Enter colour (e.g. Olive, Royal Blue) & press Add"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddColour}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-bold rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedColours.map((col) => (
                <span
                  key={col}
                  onClick={() => removeColour(col)}
                  className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md font-semibold text-gray-700 cursor-pointer hover:bg-red-50 hover:text-red-700"
                  title="Click to remove"
                >
                  {col} ✕
                </span>
              ))}
            </div>
          </div>

          {/* 7. Stock Status */}
          <div className="space-y-1">
            <label className="block font-bold text-gray-900">7. Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold"
            >
              <option value="in_stock">In Stock (Available In-Store)</option>
              <option value="low_stock">Low Stock (Few Left)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* 8. Description */}
          <div className="space-y-1">
            <label className="block font-bold text-gray-900">8. Product Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric details, fit details, wash care..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* 9. Badges & Publishing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>Mark as New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>Mark as Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded text-[#881326]"
              />
              <span>Publish Immediately</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#881326] hover:bg-[#6E0E1E] text-white font-extrabold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#C5A059]" />
              <span>{submitting ? 'Adding Product...' : 'Publish Product to Store'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
