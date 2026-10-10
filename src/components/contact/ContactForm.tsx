'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h4 className="font-serif font-bold text-base text-emerald-950">
          Message Received!
        </h4>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Thank you, <strong>{formData.name || 'valued customer'}</strong>. Our store team in Malikipuram has received your message. For immediate response during store hours (9:30 AM – 10:00 PM), feel free to message us on WhatsApp below.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', phone: '', message: '' });
          }}
          className="text-xs text-emerald-700 underline font-medium hover:text-emerald-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div>
        <label className="block font-medium text-gray-700 mb-1">Your Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Ramesh Kumar"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="10-digit mobile number"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Message / Question *</label>
        <textarea
          rows={3}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Ask about clothing sizes, availability, or store directions..."
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881326]"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 bg-[#121417] hover:bg-[#881326] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Send Inquiry</span>
      </button>
    </form>
  );
}
