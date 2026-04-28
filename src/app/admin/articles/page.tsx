'use client';
import { useState } from 'react';
import { BookOpen, Plus, Trash2, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface Article {
  _id: string;
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
  slug: string;
}

const DUMMY_ARTICLES: Article[] = [
  { _id: '1', title: 'The Rajput Legacy in the Deccan Plateau', description: 'Tracing 600 years of Rajput presence across Maharashtra.', category: 'history', isPublished: true, createdAt: '2025-01-15', views: 342, slug: 'rajput-legacy-deccan' },
  { _id: '2', title: 'Clan Traditions: Bhonsle, Sisodiya & Chauhan Lines', description: 'How the great Rajput clans adapted their traditions.', category: 'culture', isPublished: true, createdAt: '2025-02-10', views: 218, slug: 'clan-traditions-maharashtra' },
  { _id: '3', title: 'Warriors Who Shaped Deccan History', description: 'Profiles of ten remarkable Rajput leaders.', category: 'personalities', isPublished: true, createdAt: '2025-03-01', views: 187, slug: 'warriors-deccan-history' },
  { _id: '4', title: 'Draft: Modern Rajput in Business', description: 'Stories of entrepreneurial success in the community.', category: 'achievements', isPublished: false, createdAt: '2025-06-01', views: 0, slug: 'rajput-business-draft' },
];

const CATEGORIES = ['history', 'culture', 'heritage', 'traditions', 'personalities', 'achievements', 'news'];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(DUMMY_ARTICLES);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', content: '', category: 'history', image: '', tags: '',
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      });
      const newArticle: Article = {
        _id: String(Date.now()),
        title: form.title,
        description: form.description,
        category: form.category,
        isPublished: true,
        createdAt: new Date().toISOString(),
        views: 0,
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
      };
      setArticles((prev) => [newArticle, ...prev]);
      toast.success('Article published!');
      setShowForm(false);
      setForm({ title: '', description: '', content: '', category: 'history', image: '', tags: '' });
    } catch {
      toast.error('Failed to publish');
    } finally {
      setLoading(false);
    }
  }

  function remove(id: string) {
    if (confirm('Delete this article?')) {
      setArticles((prev) => prev.filter((a) => a._id !== id));
      toast.success('Article deleted');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide mb-1">Heritage Articles</h1>
          <p className="font-sans text-white/40 text-sm">Manage heritage, culture, and community articles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-royal rounded-xl text-xs px-5 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      {showForm && (
        <div className="royal-card rounded-2xl p-6 border border-royal-gold/30">
          <h3 className="font-display text-white text-lg tracking-wide mb-5">New Article</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={update('title')} required
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors"
                  placeholder="Article title" />
              </div>
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Category *</label>
                <select value={form.category} onChange={update('category')}
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-royal-dark capitalize">{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Description *</label>
              <input type="text" value={form.description} onChange={update('description')} required
                className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors"
                placeholder="Brief description (shown in listings)" />
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Content (Markdown) *</label>
              <textarea value={form.content} onChange={update('content')} required rows={8}
                className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors resize-none font-mono"
                placeholder="Write article content here. Supports Markdown formatting." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Image URL</label>
                <input type="text" value={form.image} onChange={update('image')}
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={update('tags')}
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors"
                  placeholder="rajput, history, maharashtra" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost rounded-xl text-xs px-5 py-2.5">Cancel</button>
              <button type="submit" disabled={loading} className="btn-royal rounded-xl text-xs px-5 py-2.5 disabled:opacity-50">
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles table */}
      <div className="royal-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-dim/20">
                {['Article', 'Category', 'Status', 'Views', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 font-sans text-xs text-white/30 uppercase tracking-widest text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id} className="border-b border-gold-dim/10 hover:bg-royal-gold/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-sans text-sm text-white line-clamp-1">{article.title}</p>
                    <p className="font-sans text-xs text-white/30 line-clamp-1 mt-0.5">{article.description}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-royal-maroon/30 text-royal-gold/70 text-xs font-sans rounded-full capitalize">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${
                      article.isPublished
                        ? 'text-green-400 bg-green-400/10 border-green-400/30'
                        : 'text-white/30 bg-white/5 border-white/10'
                    }`}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-sans text-sm text-white/50">{article.views}</td>
                  <td className="px-5 py-4 font-sans text-xs text-white/35">
                    {new Date(article.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a href={`/heritage/${article.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => remove(article._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
