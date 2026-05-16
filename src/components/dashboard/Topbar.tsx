"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Plus, Zap, ChevronDown, Check } from "lucide-react";
import { useNotificationsStore } from "@/store";
import { formatRelativeTime } from "@/lib/utils";

export default function Topbar({ title = "Dashboard", subtitle }: { title?: string; subtitle?: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotificationsStore();

  const notifColors = { success: "#10b981", info: "#2563eb", warning: "#f59e0b", error: "#ef4444" };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] glass">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-orbitron font-bold text-lg text-white">{title}</h1>
          {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 glass border border-white/10 rounded-xl px-3 py-2 w-64 group focus-within:border-blue-500/50 transition-colors">
          <Search className="w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search projects..."
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1"
          />
          <kbd className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
        </div>

        {/* AI Credits */}
        <div className="hidden sm:flex items-center gap-2 glass border border-yellow-500/20 rounded-xl px-3 py-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">850</span>
          <span className="text-xs text-white/40">credits</span>
        </div>

        {/* New Project */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl neon-blue transition-shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 glass border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass-strong border border-white/10 rounded-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <span className="font-semibold text-white text-sm">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-white/30 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: notifColors[n.type] }} />
                          <div>
                            <p className="text-sm font-medium text-white">{n.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-white/30 mt-1">{formatRelativeTime(n.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white">
            AC
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

