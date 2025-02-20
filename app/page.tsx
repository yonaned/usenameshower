'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get user ID from Telegram Mini App context
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    
    if (!user?.id) {
      setError('User ID not found. Please open the app inside Telegram.');
      return;
    }

    setUserId(user.id);

    const checkMembership = async () => {
      try {
        const res = await fetch('/api/checkMembership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus(data.status === 'member' ? 'You are a member!' : 'Please join the channel.');
        } else {
          setError(data.error || 'Something went wrong');
        }
      } catch (err) {
        setError('Network error');
      }
    };

    checkMembership();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        {status && <div className="text-green-600">{status}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
}
