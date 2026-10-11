'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Unify login into single /login route
    router.replace('/login?redirect=/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#E8ECEF] flex items-center justify-center p-4 text-xs font-semibold text-gray-600">
      <div className="text-center space-y-2">
        <p>Redirecting to Unified Aravind Readymade Login...</p>
      </div>
    </div>
  );
}
