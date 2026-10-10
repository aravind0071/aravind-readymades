import React from 'react';
import { ShieldCheck, Sparkles, Layers, HeartHandshake } from 'lucide-react';

export default function WhyShopWithUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Quality Products',
      description: 'Carefully chosen fabrics with durable stitching, colorfast dyes, and superior finish.',
    },
    {
      icon: Sparkles,
      title: 'Latest Styles',
      description: 'Frequently refreshed catalogues featuring contemporary fashion trends for every age group.',
    },
    {
      icon: Layers,
      title: 'Wide Variety',
      description: 'Extensive options across casual shirts, jeans, trousers, designer kurtis, and children’s outfits.',
    },
    {
      icon: HeartHandshake,
      title: 'Friendly Service',
      description: 'Warm, personalized assistance from our store staff to help you find the ideal size and fit.',
    },
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#E8E3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#881326]">
            Our Commitment To You
          </p>
          <h2 className="text-3xl font-extrabold text-[#121417] tracking-tight">
            WHY SHOP WITH US
          </h2>
          <p className="text-sm text-gray-500">
            A trusted local clothing retailer serving Malikipuram families with pride.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-xl bg-[#FDFBF7] border border-[#E8E3D9] hover:border-[#881326]/40 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#881326]/10 text-[#881326] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#881326] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#121417] mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
