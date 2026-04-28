'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-[#C9A84C] tracking-widest">⚔️ RAJPUTANA</h1>
            <p className="text-[#8B1A1A] text-xs tracking-[4px] mt-1">MAHARASHTRA</p>
          </Link>
        </div>

        <div className="bg-[#111] border border-[#8B1A1A]/40 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your registered email address. If it exists in our system, we'll send you a
            secure reset link.
          </p>

          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-[#C9A84C] font-semibold mb-2">Check Your Inbox</p>
              <p className="text-gray-400 text-sm">{message}</p>
              <p className="text-gray-500 text-xs mt-3">
                Didn't get it? Check spam folder. Link expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="inline-block mt-6 text-[#C9A84C] text-sm hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-600"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#C9A84C] text-white font-semibold py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link href="/login" className="text-[#C9A84C] hover:underline">
                  Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
