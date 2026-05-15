"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Filter, Grid, List, Play, Download,
  MoreHorizontal, Loader2, Clock, Trash2, Edit2, Copy,
  FolderOpen, Video, Star
} from "lucide-react";
import Link from "next/link";
import Topbar from "@/components/dashboard/Topbar";
import { useProjectsStore } from "@/store";
import { formatDuration, formatRelativeTime, STATUS_COLORS, STATUS_BG, RESOLUTION_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const filters = ["All", "Draft", "Rendering", "Complete", "Failed"];
const sorts = ["Last edited", "Created", "Name", "Duration"];

export default function ProjectsPage() {
  const { projects, deleteProject } = useProjectsStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort] = useState("Last edited");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || p.status === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Projects" subtitle={`${projects.length} total projects`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Top bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full glass border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/40 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 glass border border-white/[0.08] rounded-xl p-1.5">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    activeFilter === f ? "bg-blue-600/30 text-blue-300 border border-blue-500/30" : "text-white/40 hover:text-white"
                  )}>{f}</button>
              ))}
            </div>

            {/* Sort */}
            <select className="glass border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white/60 outline-none">
              {sorts.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex gap-1 glass border border-white/[0.08] rounded-xl p-1">
              <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg transition-colors", view === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white")}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={cn("p-2 rounded-lg transition-colors", view === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white")}>
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* New project */}
            <Link href="/editor">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl neon-blue">
                <Plus className="w-4 h-4" /> New Project
              </motion.button>
            </Link>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-white/40 font-semibold mb-2">No projects found</p>
              <p className="text-white/20 text-sm">Try a different search or filter</p>
            </div>
          )}

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl border border-white/[0.07] hover:border-white/15 overflow-hidden group transition-all">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-blue-600/10 to-violet-600/10 relative flex items-center justify-center border-b border-white/[0.05]">
                    <Play className="w-8 h-8 text-white/20 group-hover:text-white/60 transition-colors" />
                    {/* Status badge */}
                    <div className="absolute top-2 left-2">
                      <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1", STATUS_COLORS[project.status], STATUS_BG[project.status])}>
                        {project.status === "rendering" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                        {project.status}
                      </span>
                    </div>
                    {/* Actions on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href="/editor">
                        <button className="p-2.5 glass rounded-xl border border-white/20 text-white hover:bg-blue-600/30 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2.5 glass rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Resolution */}
                    <div className="absolute bottom-2 right-2 glass rounded-lg px-2 py-0.5 text-[10px] text-cyan-400 font-semibold">
                      {project.resolution.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{project.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/35">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(project.duration)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(project.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                          className="p-1.5 text-white/30 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === project.id && (
                          <div className="absolute right-0 top-7 glass rounded-xl border border-white/10 overflow-hidden z-20 w-36">
                            {[
                              { label: "Open Editor", icon: Edit2 },
                              { label: "Duplicate", icon: Copy },
                              { label: "Download", icon: Download },
                              { label: "Favourite", icon: Star },
                            ].map(item => (
                              <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                <item.icon className="w-3.5 h-3.5" /> {item.label}
                              </button>
                            ))}
                            <button onClick={() => deleteProject(project.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/[0.06] rounded-full text-[10px] text-white/40">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="grid grid-cols-[auto,1fr,auto,auto,auto,auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                <span>Preview</span><span>Title</span><span>Duration</span><span>Resolution</span><span>Modified</span><span>Actions</span>
              </div>
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[auto,1fr,auto,auto,auto,auto] gap-4 items-center px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white/30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{project.title}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", STATUS_COLORS[project.status], STATUS_BG[project.status])}>
                      {project.status}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 font-mono">{formatDuration(project.duration)}</span>
                  <span className="text-xs text-cyan-400 font-semibold">{project.resolution.toUpperCase()}</span>
                  <span className="text-xs text-white/40">{formatRelativeTime(project.updatedAt)}</span>
                  <div className="flex items-center gap-1.5">
                    <Link href="/editor"><button className="p-2 glass rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button></Link>
                    <button className="p-2 glass rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteProject(project.id)} className="p-2 glass rounded-lg border border-white/10 text-white/50 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
