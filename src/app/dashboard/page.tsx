"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Clock, Zap, HardDrive, Play, Plus, Sparkles,
  Wand2, User, Mic, Captions, Film, MoreHorizontal, CheckCircle,
  Loader2, FileVideo, Eye, Download
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { useProjectsStore, useUserStore } from "@/store";
import { formatDuration, formatRelativeTime, STATUS_COLORS, STATUS_BG } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { day: "Mon", views: 1200, exports: 3 },
  { day: "Tue", views: 1900, exports: 5 },
  { day: "Wed", views: 1500, exports: 4 },
  { day: "Thu", views: 2800, exports: 8 },
  { day: "Fri", views: 3200, exports: 6 },
  { day: "Sat", views: 4100, exports: 11 },
  { day: "Sun", views: 3600, exports: 9 },
];

const quickActions = [
  { label: "AI Video", icon: Sparkles, href: "/ai-studio", color: "#2563eb", desc: "Generate from prompt" },
  { label: "Auto Edit", icon: Wand2, href: "/editor", color: "#7c3aed", desc: "AI-powered editing" },
  { label: "AI Avatar", icon: User, href: "/avatar-studio", color: "#ec4899", desc: "Talking avatars" },
  { label: "Voice Clone", icon: Mic, href: "/voice-studio", color: "#10b981", desc: "Clone any voice" },
  { label: "Captions", icon: Captions, href: "/captions", color: "#f59e0b", desc: "Auto subtitles" },
  { label: "Reel Cut", icon: Film, href: "/ai-studio", color: "#ef4444", desc: "Viral reels" },
];

const renderQueue = [
  { name: "Brand Reel", progress: 72, resolution: "1080p", eta: "2 min" },
  { name: "Tutorial Part 2", progress: 100, resolution: "4K", eta: "Done" },
];

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string; trend?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.13] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="font-orbitron text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
      <p className="text-xs text-white/30 mt-0.5">{sub}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { projects } = useProjectsStore();
  const { user } = useUserStore();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-violet-600/5 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-violet-600/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="font-orbitron text-xl font-bold text-white mb-1">
              Welcome back, Alex! 👋
            </h2>
            <p className="text-white/50 text-sm mb-4">
              You have <span className="text-blue-400 font-semibold">{user?.aiCredits} AI credits</span> remaining.
              1 project rendering.
            </p>
            <Link href="/editor">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl neon-blue"
              >
                <Plus className="w-4 h-4" /> New Project
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: "24", sub: "3 this week", icon: FileVideo, color: "#2563eb", trend: "+3" },
            { label: "Video Views", value: "128K", sub: "Last 7 days", icon: Eye, color: "#06b6d4", trend: "+18%" },
            { label: "AI Credits", value: `${user?.aiCredits}`, sub: "of 500/month", icon: Zap, color: "#f59e0b" },
            { label: "Storage Used", value: `${user?.storageUsed}GB`, sub: `of ${user?.storageLimit}GB`, icon: HardDrive, color: "#7c3aed" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" /> Quick AI Actions
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((action, i) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="glass rounded-xl p-4 border border-white/[0.07] hover:border-white/20 text-center cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${action.color}20` }}>
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <p className="text-xs font-semibold text-white">{action.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5 hidden md:block">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" /> Recent Projects
              </h3>
              <Link href="/dashboard/projects" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
            </div>
            <div className="space-y-2">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 2 }}
                  className="glass rounded-xl p-4 border border-white/[0.07] hover:border-white/15 flex items-center gap-4 transition-all cursor-pointer group"
                >
                  {/* Thumbnail placeholder */}
                  <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">{project.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status]} ${STATUS_BG[project.status]}`}>
                        {project.status === "rendering" && <Loader2 className="w-2.5 h-2.5 inline animate-spin mr-1" />}
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{formatDuration(project.duration)}</span>
                      <span>•</span>
                      <span>{project.resolution.toUpperCase()}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(project.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/editor">
                      <button className="p-2 glass rounded-lg hover:bg-blue-500/20 text-white/60 hover:text-blue-400 transition-colors">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button className="p-2 glass rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 glass rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Views chart */}
            <div className="glass rounded-2xl p-5 border border-white/[0.07]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Video Views
                </h3>
                <span className="text-xs text-green-400 font-semibold">+18% ↑</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }}
                    cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} fill="url(#viewsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Render Queue */}
            <div className="glass rounded-2xl p-5 border border-white/[0.07]">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" /> Render Queue
              </h3>
              <div className="space-y-3">
                {renderQueue.map(job => (
                  <div key={job.name}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-white/70 font-medium">{job.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">{job.resolution}</span>
                        {job.progress === 100
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                          : <span className="text-blue-400 font-mono">{job.eta}</span>}
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${job.progress === 100 ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-violet-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-white/30 mt-1 text-right">{job.progress}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="glass rounded-2xl p-5 border border-white/[0.07]">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-violet-400" /> Cloud Storage
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Videos", used: 8.2, total: 100, color: "#2563eb" },
                  { label: "Audio", used: 2.1, total: 100, color: "#06b6d4" },
                  { label: "Images", used: 2.1, total: 100, color: "#7c3aed" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{s.label}</span><span>{s.used}GB</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.used / s.total) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-white/30 mt-2 text-right">12.4 GB / 100 GB used</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
