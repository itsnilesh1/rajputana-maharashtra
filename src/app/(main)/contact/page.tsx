'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Crown, Heart, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

type FormType = 'contact' | 'volunteer' | 'suggestion';

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState<FormType>('contact');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', skills: '', area: '', category: '' });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeForm, ...form }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  const forms: { type: FormType; label: string; icon: any; desc: string }[] = [
    { type: 'contact', label: 'Contact Us', icon: Mail, desc: 'General inquiries and messages' },
    { type: 'volunteer', label: 'Volunteer', icon: Heart, desc: 'Join our volunteer network' },
    { type: 'suggestion', label: 'Suggestion', icon: Lightbulb, desc: 'Share ideas and feedback' },
  ];

  if (submitted) {
    return (
      <main className="bg-royal-black min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-royal-gold/20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-royal-gold" />
          </div>
          <h2 className="font-display text-3xl text-white tracking-wide mb-4">Message Received!</h2>
          <p className="font-serif text-white/55 italic text-lg mb-8 leading-relaxed">
            Thank you for reaching out to Rajputana Maharashtra. Our team will review your message and respond within 2-3 business days.
          </p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '', skills: '', area: '', category: '' }); }}
            className="btn-royal rounded-xl text-sm px-6 py-3">
            Send Another Message
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">
            Contact <span className="gold-text">Us</span>
          </h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto" />
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="royal-card rounded-2xl p-6">
              <h3 className="font-display text-white tracking-wide mb-5">Find Us</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address', value: 'Rajputana Maharashtra Bhavan, Deccan Gymkhana, Pune - 411004' },
                  { icon: Mail, label: 'Email', value: 'info@rajputana-maharashtra.org' },
                  { icon: Phone, label: 'Phone', value: '+91 20 2553 7890' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-royal-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-royal-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-white/30 uppercase tracking-wider">{label}</p>
                      <p className="font-sans text-sm text-white/70 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="royal-card rounded-2xl p-6">
              <h3 className="font-display text-white tracking-wide mb-3">Office Hours</h3>
              <div className="space-y-2">
                {[
                  { day: 'Mon – Fri', time: '9:00 AM – 6:00 PM' },
                  { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
                  { day: 'Sunday', time: 'Closed' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between font-sans text-sm">
                    <span className="text-white/40">{day}</span>
                    <span className="text-white/70">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2">
            {/* Form selector */}
            <div className="flex gap-3 mb-6">
              {forms.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setActiveForm(type)}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-200 font-sans text-xs uppercase tracking-wider ${
                    activeForm === type
                      ? 'bg-royal-gold text-royal-black border-royal-gold'
                      : 'border-gold-dim text-white/50 hover:border-royal-gold/50 hover:text-white/70'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="royal-card rounded-2xl p-8 border border-gold-dim">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={update('name')} required placeholder="Your name"
                      className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={update('email')} required placeholder="your@email.com"
                      className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                  </div>
                </div>

                {activeForm === 'contact' && (
                  <>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Subject *</label>
                      <input type="text" value={form.subject} onChange={update('subject')} required placeholder="What is your message about?"
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Message *</label>
                      <textarea value={form.message} onChange={update('message')} required rows={5} placeholder="Write your message here..."
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors resize-none" />
                    </div>
                  </>
                )}

                {activeForm === 'volunteer' && (
                  <>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Area of Interest</label>
                      <select value={form.area} onChange={update('area')}
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                        <option value="" className="bg-royal-dark">Select area...</option>
                        {['Event Management', 'Heritage Documentation', 'Youth Programs', 'Digital Media', 'Community Outreach', 'Legal Aid'].map((a) => (
                          <option key={a} value={a} className="bg-royal-dark">{a}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Skills & Experience *</label>
                      <textarea value={form.skills} onChange={update('skills')} required rows={4} placeholder="Tell us about your skills, experience, and how you'd like to contribute..."
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors resize-none" />
                    </div>
                  </>
                )}

                {activeForm === 'suggestion' && (
                  <>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Category</label>
                      <select value={form.category} onChange={update('category')}
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                        <option value="" className="bg-royal-dark">Select category...</option>
                        {['Website Features', 'Events', 'Heritage Documentation', 'Community Programs', 'Partnerships', 'Other'].map((c) => (
                          <option key={c} value={c} className="bg-royal-dark">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Your Suggestion *</label>
                      <textarea value={form.message} onChange={update('message')} required rows={5} placeholder="Share your idea or suggestion..."
                        className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors resize-none" />
                    </div>
                  </>
                )}

                <button type="submit" disabled={loading} className="btn-royal w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
