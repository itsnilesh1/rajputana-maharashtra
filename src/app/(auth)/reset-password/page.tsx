'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No reset token found. Please request a new reset link.');
    }
  }, [token]);

  function getStrength(p: string) {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  const strength = getStrength(password);
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#C9A84C'][strength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    if (strength < 3) {
      setStatus('error');
      setMessage('Please choose a stronger password (uppercase, lowercase, number required).');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold text-[#C9A84C] tracking-widest">⚔️ RAJPUTANA</h1>
          <p className="text-[#8B1A1A] text-xs tracking-[4px] mt-1">MAHARASHTRA</p>
        </Link>
      </div>

      <div className="bg-[#111] border border-[#8B1A1A]/40 rounded-lg p-8">
        <h2 className="text-xl font-bold text-white mb-2">Set New Password</h2>
        <p className="text-gray-400 text-sm mb-6">
          Choose a strong password to secure your account.
        </p>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-[#C9A84C] font-semibold mb-2">Password Reset Successful!</p>
            <p className="text-gray-400 text-sm">{message}</p>
            <p className="text-gray-500 text-xs mt-2">Redirecting to login in 3 seconds…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-600 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: n <= strength ? strengthColor : '#333' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Re-enter password"
                className="w-full bg-[#1a1a1a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-600"
              />
              {confirm && password !== confirm && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="bg-[#1a1a1a] rounded p-3 text-xs text-gray-400 space-y-1">
              <p className="text-gray-300 font-medium mb-2">Password requirements:</p>
              <p className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                {/[A-Z]/.test(password) ? '✓' : '○'} At least one uppercase letter
              </p>
              <p className={/[a-z]/.test(password) ? 'text-green-400' : ''}>
                {/[a-z]/.test(password) ? '✓' : '○'} At least one lowercase letter
              </p>
              <p className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                {/[0-9]/.test(password) ? '✓' : '○'} At least one number
              </p>
              <p className={password.length >= 8 ? 'text-green-400' : ''}>
                {password.length >= 8 ? '✓' : '○'} Minimum 8 characters
              </p>
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !token}
              className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#C9A84C] text-white font-semibold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Resetting…' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-gray-500">
              <Link href="/forgot-password" className="text-[#C9A84C] hover:underline">
                Request a new link
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-[#C9A84C]">Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
