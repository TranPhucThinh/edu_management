import { LayoutGrid, Users, BookOpen, Wallet } from "lucide-react";

export const items = [
  { href: "/dashboard", label: "home", icon: LayoutGrid },
  { href: "/classes", label: "classes", icon: BookOpen },
  { href: "/students", label: "students", icon: Users },
  { href: "/finance", label: "finance", icon: Wallet },
] as const;
