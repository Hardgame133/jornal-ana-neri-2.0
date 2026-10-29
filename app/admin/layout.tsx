import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Proteção de verdade no servidor: sem o cookie assinado, /admin não existe.
  if (!(await isAdminRequest())) {
    redirect('/')
  }
  return children
}
