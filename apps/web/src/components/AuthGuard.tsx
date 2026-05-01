'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicPaths = ['/login', '/register', '/health'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (!token && !isPublicPath) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized && !publicPaths.some(path => pathname.startsWith(path))) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
