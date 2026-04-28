'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Register the user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Step 2: Sign in — wait for session to be fully established
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Account created but login failed. Please login manually.');
      }

      toast.success('Welcome to Rajputana Maharashtra!');

      // Step 3: Use window.location instead of router.push
      // This forces a full page reload so the session cookie is picked up correctly
      window.location.href = '/dashboard';

    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-royal-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-royal-maroon/10 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Crown className="w-12 h-12 text-royal-gold mx-auto mb-4 animate-float" />
          <h1 className="font-display text-3xl text-white tracking-widest mb-2">JOIN THE COMMUNITY</h1>
          <p className="font-serif text-royal-gold/60 italic">Create your Rajputana Maharashtra account</p>
        </div>

        <div className="royal-card rounded-2xl p-8 border border-gold-dim">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={form.name} onChange={update('name')} required
                  placeholder="Your full name" autoComplete="name"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={form.email} onChange={update('email')} required
                  placeholder="your@email.com" autoComplete="email"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')}
                  required minLength={6} placeholder="Min. 6 characters" autoComplete="new-password"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-10 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="password" value={form.confirm} onChange={update('confirm')} required
                  placeholder="Re-enter password" autoComplete="new-password"
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-3 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
              </div>
            </div>

            <p className="font-sans text-xs text-white/30 leading-relaxed">
              By registering, you agree to our community guidelines. Your profile will require admin approval before being publicly visible.
            </p>

            <button type="submit" disabled={loading}
              className="btn-royal w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-royal-black/50 border-t-royal-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <><Crown className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-dim/30 text-center">
            <p className="font-sans text-xs text-white/40">
              Already a member?{' '}
              <Link href="/login" className="text-royal-gold hover:text-royal-amber transition-colors">Sign In</Link>
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
