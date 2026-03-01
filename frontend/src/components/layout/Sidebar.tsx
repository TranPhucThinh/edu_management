"use client";

import { GraduationCap, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { items } from "@/src/constants/Nav";
import { Link, useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";

export default function Sidebar() {
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Nav");

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("teacherId", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("fullName", { path: "/" });

    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r bg-white fixed left-0 top-0">
      {/* 1. HEADER */}
      <div className="p-6 flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[17px] font-bold text-slate-900 leading-none">
            {tCommon("appName")}
          </h1>
          <span className="text-[11px] font-medium text-slate-400 mt-1">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                isActive
                  ? "bg-indigo-50 text-primary"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{tNav(item.label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER */}
      <div className="p-4 space-y-1 border-t border-slate-50">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group"
        >
          <Settings className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
          <span className="font-medium text-[14px]">Settings</span>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 p-3 h-auto rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:cursor-pointer font-medium transition-all group"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
          <span className="text-[14px]">Logout</span>
        </Button>

        {/* PROFILE CARD */}
        <div className="mt-4 p-2 bg-slate-50/50 border border-slate-100 rounded-[28px] flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-200">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            <AvatarFallback className="bg-slate-200 text-slate-500 font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-black text-slate-900 truncate">
              Alex Johnson
            </span>
            <span className="text-[11px] font-medium text-slate-400 truncate">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
