import { LayoutGrid, Users, GraduationCap, Wallet, Book } from 'lucide-react'

export const items = [
  { href: '/dashboard', label: 'home', icon: LayoutGrid },
  { href: '/courses', label: 'courses', icon: GraduationCap },
  { href: '/classes', label: 'classes', icon: Book },
  { href: '/students', label: 'students', icon: Users },
  { href: '/finance', label: 'finance', icon: Wallet },
] as const
