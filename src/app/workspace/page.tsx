"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Plus, Crown, Edit3, Eye, MessageSquare,
  FolderOpen, Clock, Share2, Settings, Check, X, Zap
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const members = [
  { id: "1", name: "Alex Creator", email: "alex@aiclone.com", role: "owner", avatar: "AC", color: "#2563eb", status: "online", lastSeen: "Now" },
  { id: "2", name: "Priya Sharma", email: "priya@aiclone.com", role: "editor", avatar: "PS", color: "#ec4899", status: "online", lastSeen: "Now" },
  { id: "3", name: "Marcus Kim", email: "marcus@aiclone.com", role: "editor", avatar: "MK", color: "#10b981", status: "away", lastSeen: "5m ago" },
  { id: "4", name: "Sophie Chen", email: "sophie@aiclone.com", role: "viewer", avatar: "SC", color: "#f59e0b", status: "offline", lastSeen: "2h ago" },
  { id: "5", name: "David R.", email: "david@aiclone.com", role: "commenter", avatar: "DR", color: "#7c3aed", status: "offline", lastSeen: "1d ago" },
];

const sharedProjects = [
  { title: "Q4 Brand Campaign", members: 3, lastEdit: "Alex, 2m ago", status: "active" },
  { title: "Product Demo Video", members: 2, lastEdit: "Priya, 1h ago", status: "active" },
  { title: "Social Media Pack", members: 4, lastEdit: "Marcus, 3h ago", status: "review" },
  { title: "Onboarding Tutorial", members: 2, lastEdit: "Sophie, 1d ago", status: "complete" },
];

const activity = [
  { user: "Priya", action: "edited", target: "Q4 Brand Campaign", time: "2 min ago", color: "#ec4899" },
  { user: "Marcus", action: "exported", target: "Product Demo Video", time: "45 min ago", color: "#10b981" },
  { user: "Alex", action: "commented on", target: "Social Media Pack", time: "1h ago", color: "#2563eb" },
  { user: "Sophie", action: "uploaded", target: "New footage", time: "3h ago", color: "#f59e0b" },
  { user: "David", action: "approved", target: "Onboarding Tutorial", time: "1d ago", color: "#7c3aed" },
];

const roleIcons: Record<string, typeof Crown> = {
  owner: Crown, editor: Edit3, viewer: Eye, commenter: MessageSquare,
};
const roleColors: Record<string, string> = {
  owner: "#f59e0b", editor: "#2563eb", viewer: "#6b7280", commenter: "#7c3aed",
};

export default function WorkspacePage() {
  const [tab, setTab] = useState<"members" | "projects" | "activity">("members");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Team Workspace" subtitle="Collaborate with your team in real-time" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Team Members", value: "5", icon: Users, color: "#2563eb" },
              { label: "Shared Projects", value: "12", icon: FolderOpen, color: "#7c3aed" },
              { label: "Comments", value: "48", icon: MessageSquare, color: "#06b6d4" },
              { label: "Exports Today", value: "7", icon: Zap, color: "#10b981" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-5 border border-white/[0.07]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}20` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <p className="font-orbitron text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass border border-white/[0.08] rounded-2xl p-1.5 w-fit">
            {(["members", "projects", "activity"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all",
                  tab === t ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white" : "text-white/40 hover:text-white"
                )}>{t}</button>
            ))}
          </div>

          {/* Members tab */}
          {tab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">{members.length} Members</h3>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowInvite(!showInvite)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl neon-blue">
                  <Plus className="w-4 h-4" /> Invite Member
                </motion.button>
              </div>

              {/* Invite form */}
              {showInvite && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl border border-blue-500/30 p-4 flex gap-3">
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@email.com"
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none border-b border-white/10 focus:border-blue-500/50 pb-1 transition-colors" />
                  <select className="glass border border-white/10 rounded-xl px-3 py-1 text-xs text-white/70 outline-none">
                    <option>Editor</option><option>Viewer</option><option>Commenter</option>
                  </select>
                  <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Send
                  </button>
                  <button onClick={() => setShowInvite(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
                {members.map((m, i) => {
                  const RoleIcon = roleIcons[m.role];
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: `${m.color}25`, color: m.color, border: `2px solid ${m.color}30` }}>
                          {m.avatar}
                        </div>
                        <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                          m.status === "online" ? "bg-green-400" : m.status === "away" ? "bg-yellow-400" : "bg-gray-500")} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-white/40">{m.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${roleColors[m.role]}15` }}>
                        <RoleIcon className="w-3.5 h-3.5" style={{ color: roleColors[m.role] }} />
                        <span className="text-xs font-semibold capitalize" style={{ color: roleColors[m.role] }}>{m.role}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", m.status === "online" ? "bg-green-400" : m.status === "away" ? "bg-yellow-400 animate-pulse" : "bg-gray-500")} />
                        <span className="text-xs text-white/30">{m.lastSeen}</span>
                      </div>
                      <button className="p-2 text-white/30 hover:text-white/70 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects tab */}
          {tab === "projects" && (
            <div className="space-y-3">
              {sharedProjects.map((p, i) => (
                <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl border border-white/[0.07] hover:border-white/15 p-5 flex items-center gap-4 cursor-pointer transition-all group">
                  <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-0.5">{p.title}</p>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span><Users className="w-3 h-3 inline mr-1" />{p.members} members</span>
                      <span>•</span>
                      <span><Clock className="w-3 h-3 inline mr-1" />Edited by {p.lastEdit}</span>
                    </div>
                  </div>
                  <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full",
                    p.status === "active" ? "bg-blue-500/20 text-blue-400" :
                    p.status === "review" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                  )}>{p.status}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Activity tab */}
          {tab === "activity" && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              {activity.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.05] last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${a.color}20`, color: a.color }}>
                    {a.user[0]}
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-semibold text-white">{a.user}</span>
                    <span className="text-white/40"> {a.action} </span>
                    <span className="text-white/70 font-medium">{a.target}</span>
                  </div>
                  <span className="text-xs text-white/30 shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
