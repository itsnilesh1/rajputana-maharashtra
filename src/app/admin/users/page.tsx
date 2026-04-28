'use client';
import { useEffect, useState } from 'react';
import { Search, UserCheck, Ban, Loader2, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-red-400 bg-red-400/10 border-red-400/30',
  moderator: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  user: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const isAdmin = session?.user?.role === 'admin';

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  async function updateUser(userId: string, update: any) {
    if (!isAdmin) { toast.error('Only admins can manage users'); return; }
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...update }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...update } : u));
      toast.success('User updated successfully');
    } catch (err: any) { toast.error(err.message || 'Update failed'); }
    finally { setUpdating(null); }
  }

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">Users</h1>
        <p className="font-sans text-white/40 text-sm">Manage community accounts and roles</p>
      </div>

      {!isAdmin && (
        <div className="flex items-center gap-3 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
          <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="font-sans text-sm text-yellow-300">You have view-only access. Only admins can change user roles or suspend accounts.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: users.length, color: 'text-white' },
          { label: 'Active', value: users.filter(u => u.isActive).length, color: 'text-green-400' },
          { label: 'Moderators', value: users.filter(u => u.role === 'moderator').length, color: 'text-purple-400' },
          { label: 'Suspended', value: users.filter(u => !u.isActive).length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="royal-card rounded-xl p-4 text-center">
            <p className={`font-display text-2xl ${color}`}>{value}</p>
            <p className="font-sans text-xs text-white/40 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            placeholder="Search name or email..."
            className="w-full bg-royal-dark border border-gold-dim rounded-xl pl-10 pr-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'moderator', 'user'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider transition-all capitalize ${
                roleFilter === r ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:border-royal-gold/40 hover:text-white/70'
              }`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="royal-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-dim/20">
                  {['User', 'Role', 'Status', 'Joined', isAdmin ? 'Actions' : ''].map(h => (
                    <th key={h} className="px-5 py-3 font-sans text-xs text-white/30 uppercase tracking-widest text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 font-sans text-white/30">No users found</td></tr>
                ) : filtered.map(user => {
                  const isSelf = user._id === session?.user?.id;
                  const isOtherAdmin = user.role === 'admin' && !isSelf;
                  const canEdit = isAdmin && !isSelf && !isOtherAdmin;
                  return (
                    <tr key={user._id} className="border-b border-gold-dim/10 hover:bg-royal-gold/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-royal-maroon/40 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-royal-gold text-sm">{user.name[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-sans text-sm text-white">{user.name} {isSelf && <span className="text-xs text-white/30">(you)</span>}</p>
                            <p className="font-sans text-xs text-white/35">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {canEdit ? (
                          <select value={user.role} onChange={e => updateUser(user._id, { role: e.target.value })}
                            disabled={updating === user._id}
                            className={`px-2.5 py-1 rounded-full text-xs font-sans border bg-transparent cursor-pointer focus:outline-none ${ROLE_COLORS[user.role] || ROLE_COLORS.user}`}>
                            <option value="user" className="bg-royal-dark text-white">User</option>
                            <option value="moderator" className="bg-royal-dark text-white">Moderator</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-sans border capitalize ${ROLE_COLORS[user.role] || ROLE_COLORS.user}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${user.isActive ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-red-400 bg-red-400/10 border-red-400/30'}`}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-white/35">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        {canEdit && (
                          <button onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                            disabled={updating === user._id}
                            title={user.isActive ? 'Suspend user' : 'Activate user'}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${user.isActive ? 'hover:bg-red-500/20 text-red-400/50 hover:text-red-400' : 'hover:bg-green-500/20 text-green-400/50 hover:text-green-400'}`}>
                            {user.isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
