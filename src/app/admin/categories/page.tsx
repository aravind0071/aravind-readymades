'use client';

import React, { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES } from '@/lib/data/initial-data';
import { Category, Subcategory } from '@/lib/supabase/types';
import { FolderTree, Plus, AlertCircle, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(INITIAL_SUBCATEGORIES);
  const [newSubName, setNewSubName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('cat-men');

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const slug = newSubName.trim().toLowerCase().replace(/\s+/g, '-');
    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      category_id: selectedCatId,
      name: newSubName.trim(),
      slug,
    };

    setSubcategories([...subcategories, newSub]);
    setNewSubName('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="pb-4 border-b border-[#E8E3D9]">
          <h1 className="text-2xl font-black text-[#121417]">Category &amp; Department Manager</h1>
          <p className="text-xs text-gray-500">
            Structure your clothing departments and subcategories.
          </p>
        </div>

        {/* Sarees Policy Notice */}
        <div className="p-4 rounded-xl bg-[#881326]/10 border border-[#881326]/20 flex items-start gap-3 text-xs text-[#881326]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Important Store Policy:</span>
            <span>Aravind Readymades specializes exclusively in readymade apparel. <strong>We do not sell sarees.</strong> Keep categories strictly tailored to readymade western, casual, and ethnic stitched suits.</span>
          </div>
        </div>

        {/* Main 3 Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const subs = subcategories.filter((s) => s.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-[#E8E3D9] p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#881326] flex items-center justify-center text-white font-bold text-sm">
                    {cat.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#121417]">{cat.name}</h3>
                    <p className="text-[11px] text-gray-500">{cat.description}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">
                    Subcategories ({subs.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {subs.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded text-xs font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Subcategory Form */}
        <div className="max-w-xl bg-white p-6 rounded-xl border border-[#E8E3D9] shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#121417]">Add New Subcategory</h3>
          <form onSubmit={handleAddSubcategory} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Category</label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subcategory Name</label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Party Wear Blazers, Cotton Shorts..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#881326] text-white font-bold rounded-lg hover:bg-[#6E0E1E] transition-colors"
            >
              Add Subcategory
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
