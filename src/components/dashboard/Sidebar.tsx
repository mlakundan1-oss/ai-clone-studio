"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, LayoutDashboard, Video, Wand2, User, Mic, Captions,
  Image, Users, Settings, HelpCircle, ChevronLeft, ChevronRight,
  BarChart3, CreditCard, Bell, FolderOpen, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#2563eb" },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen, color: "#06b6d4" },
  { label: "Editor", href: "/editor", icon: Video, color: "#7c3aed" },
  { divider: true, label: "AI Tools" },
  { label: "AI Studio", href: "/ai-studio", icon: Sparkles, color: "#f59e0b", badge: "New" },
  { label: "AI Avatars", href: "/avatar-studio", icon: User, color: "#ec4899" },
  { label: "Voice Clone", href: "/voice-studio", icon: Mic, color: "#10b981" },
  { label: "AI Captions", href: "/captions", icon: Captions, color: "#3b82f6" },
  { label: "Thumbnails", href: "/thumbnails", icon: Image, color: "#ef4444" },
  { divider: true, label: "Workspace" },
  { label: "Team", href: "/workspace", icon: Users, color: "#8b5cf6" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "#06b6d4" },
  { label: "Billing", href: "/pricing", icon: CreditCard, color: "#f59e0b" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-screen glass border-r border-white/[0.06] shrink-0 z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] min-h-[72px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center neon-blue shrink-0">
          <Zap className="w-5 h-5 text-white" fill="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-orbitron font-bold text-base text-white whitespace-nowrap"
            >
              Ai<span className="gradient-text"> Clone</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
        {navItems.map((item, i) => {
          if ("divider" in item && item.divider) {
            return (
              <div key={i} className="mt-4 mb-1">
                {!collapsed && (
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-1">
                    {item.label}
                  </p>
                )}
                {collapsed && <div className="h-px bg-white/[0.06] mx-2 my-2" />}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href!}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 relative",
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
                <item.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: isActive ? item.color : undefined }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between flex-1 whitespace-nowrap"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-2 space-y-0.5">
        <Link href="#">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Help & Support</span>}
          </div>
        </Link>
        <Link href="#">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </div>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-2 glass border border-white/[0.07]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            AC
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-white truncate">Alex Creator</p>
                <p className="text-[10px] text-blue-400 font-medium">Pro Plan</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 glass rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors hover:border-white/30"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
