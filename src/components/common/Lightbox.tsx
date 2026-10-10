'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string; title: string; subtitle?: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
      {/* Top Bar with Counter and Close */}
      <div className="flex items-center justify-between text-white z-10">
        <span className="text-xs text-gray-300 font-mono tracking-wider">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Display with Navigation Arrows */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <button
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          aria-label="Previous Image"
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
          <Image
            src={current.url}
            alt={current.title}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          aria-label="Next Image"
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption */}
      <div className="text-center text-white pb-2 z-10">
        <h4 className="text-sm sm:text-base font-semibold">{current.title}</h4>
        {current.subtitle && <p className="text-xs text-gray-400 mt-0.5">{current.subtitle}</p>}
      </div>
    </div>
  );
}
