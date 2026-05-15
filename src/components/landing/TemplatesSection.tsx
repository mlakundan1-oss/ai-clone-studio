"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Lock, Sparkles } from "lucide-react";

const categories = ["All", "YouTube", "Shorts", "Reels", "Podcast", "Cinematic"];

const templates = [
  { id: 1, name: "Product Launch", category: "YouTube", duration: "2:30", color: "#2563eb", premium: false, views: "12.4K uses" },
  { id: 2, name: "Viral Reel Pack", category: "Reels", duration: "0:30", color: "#ec4899", premium: true, views: "8.9K uses" },
  { id: 3, name: "Podcast Highlight", category: "Podcast", duration: "1:00", color: "#7c3aed", premium: false, views: "5.2K uses" },
  { id: 4, name: "YouTube Intro", category: "YouTube", duration: "0:15", color: "#06b6d4", premium: false, views: "22.1K uses" },
  { id: 5, name: "Cinematic Opener", category: "Cinematic", duration: "0:45", color: "#f59e0b", premium: true, views: "3.8K uses" },
  { id: 6, name: "Tutorial Layout", category: "YouTube", duration: "10:00", color: "#10b981", premium: false, views: "9.7K uses" },
  { id: 7, name: "Story Pack", category: "Shorts", duration: "0:60", color: "#ef4444", premium: true, views: "15.3K uses" },
  { id: 8, name: "Interview Style", category: "Podcast", duration: "3:00", color: "#8b5cf6", premium: false, views: "4.1K uses" },
];

export default function TemplatesSection() {
  const [active, setActive] = useState("All");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const filtered = active === "All" ? templates : templates.filter(t => t.category === active);

  return (
    <section id="templates" className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-surface/30" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">Ready-Made Templates</span>
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-4">
            Start Fast with <span className="gradient-text">Pro Templates</span>
          </h2>
          <p className="text-white/50 text-lg">100+ professional templates crafted by top creators</p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                  : "glass border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)` }} />
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 glass rounded-md px-2 py-0.5 text-xs text-white/70 font-mono">
                  {t.duration}
                </div>
                {/* Premium badge */}
                {t.premium && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md px-2 py-0.5">
                    <Lock className="w-2.5 h-2.5 text-yellow-400" />
                    <span className="text-[10px] text-yellow-400 font-semibold">PRO</span>
                  </div>
                )}
                {/* Category chip */}
                <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-md font-medium"
                  style={{ background: `${t.color}25`, color: t.color }}>
                  {t.category}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{t.views}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="btn-secondary px-8 py-3 text-sm">
            Browse All 100+ Templates →
          </button>
        </div>
      </div>
    </section>
  );
}
