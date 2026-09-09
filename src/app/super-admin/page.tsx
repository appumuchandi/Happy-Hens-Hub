
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SuperAdminRoot() {
  const cookieStore = await cookies();
  const session = cookieStore.get('pm_admin_session');

  if (session?.value === 'authenticated') {
    redirect('/super-admin/dashboard');
  } else {
    redirect('/super-admin/login');
  }
}
