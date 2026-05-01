'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicPaths = ['/login', '/register'];
const BASE_PATH = '/eigo';

function getCleanPath(pathname: string): string {
  // Strip basePath prefix for matching
  if (pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || '/';
  }
  return pathname;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cleanPath = getCleanPath(pathname);
    const isPublic = publicPaths.some(p => cleanPath.startsWith(p));
    const token = localStorage.getItem('token');

    if (!token && !isPublic) {
      // Not logged in and not on a public page — redirect to login
      window.location.href = BASE_PATH + '/login/';
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  const cleanPath = getCleanPath(pathname);
  const isPublic = publicPaths.some(p => cleanPath.startsWith(p));

  // Always render public pages immediately
  if (isPublic) return <>{children}</>;

  // Show nothing until auth check completes
  if (!ready) return null;

  return <>{children}</>;
}
