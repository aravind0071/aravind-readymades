'use client';

const WISHLIST_KEY = 'aravind_store_wishlist';

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading wishlist', e);
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  const list = getWishlist();
  return list.includes(productId);
}

export function toggleWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWishlist();
    const index = list.indexOf(productId);
    let updated: string[];
    let added = false;
    if (index > -1) {
      updated = list.filter((id) => id !== productId);
      added = false;
    } else {
      updated = [...list, productId];
      added = true;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: updated.length } }));
    return added;
  } catch (e) {
    console.error('Error updating wishlist', e);
    return false;
  }
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
