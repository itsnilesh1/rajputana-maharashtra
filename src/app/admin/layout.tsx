import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'moderator'].includes(session.user.role)) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-royal-black flex">
      <AdminSidebar role={session.user.role} userName={session.user.name || ''} />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
