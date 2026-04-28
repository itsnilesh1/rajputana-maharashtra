'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Crown, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      // Hard redirect to ensure session cookie is read correctly
      window.location.href = callbackUrl;

    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-royal-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-royal-maroon/10 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Crown className="w-12 h-12 text-royal-gold mx-auto mb-4 animate-float" />
          <h1 className="font-display text-3xl text-white tracking-widest mb-2">WELCOME BACK</h1>
          <p className="font-serif text-royal-gold/60 italic">Sign in to your community account</p>
        </div>

        <div className="royal-card rounded-2xl p-8 border border-gold-dim">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="your@email.com" autoComplete="email"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-10 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn-royal w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-royal-black/50 border-t-royal-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <><Crown className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-dim/30 text-center">
            <p className="font-sans text-xs text-white/40">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-royal-gold hover:text-royal-amber transition-colors">Join the Community</Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="font-sans text-xs text-white/30 hover:text-white/60 transition-colors">← Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-royal-black flex items-center justify-center">
        <Crown className="w-8 h-8 text-royal-gold animate-pulse" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
