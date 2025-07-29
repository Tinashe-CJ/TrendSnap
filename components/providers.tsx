'use client';

import { AuthProvider } from '@/lib/auth-context';
import { VideoProvider } from '@/lib/video-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <VideoProvider>
        {children}
      </VideoProvider>
    </AuthProvider>
  );
}