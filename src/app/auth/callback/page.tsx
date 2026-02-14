'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();

        // This exchanges the code for a session
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get('code');
        
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError(error.message);
            return;
          }
        }

        // Redirect to home page after successful auth
        setTimeout(() => {
          router.push('/');
        }, 500);
      } catch (err) {
        setError('Failed to complete authentication');
        console.error(err);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0B1120]">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 dark:text-red-400 mb-4">Error</div>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}
