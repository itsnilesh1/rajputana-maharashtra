import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // Server-side auth check — fully reliable
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="min-h-screen bg-royal-black flex">
      <DashboardSidebar user={{
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || 'user',
      }} />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
