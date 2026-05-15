"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Video, Wand2, User, Mic, Captions, Film, Image, Users,
  ArrowRight, Sparkles
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "AI Video Generator",
    description: "Transform text prompts into stunning cinematic videos with our advanced AI models.",
    color: "#2563eb",
    gradient: "from-blue-600/20 to-blue-600/5",
    glow: "rgba(37,99,235,0.3)",
    badge: "New",
  },
  {
    icon: Wand2,
    title: "AI Auto Editor",
    description: "Automatically detect best scenes, remove silence, add transitions, and beat-sync music.",
    color: "#7c3aed",
    gradient: "from-violet-600/20 to-violet-600/5",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    icon: User,
    title: "AI Avatars",
    description: "Create hyper-realistic talking avatars with facial animation and lip sync technology.",
    color: "#06b6d4",
    gradient: "from-cyan-600/20 to-cyan-600/5",
    glow: "rgba(6,182,212,0.3)",
    badge: "Hot",
  },
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "Clone any voice with just 30 seconds of audio. Multi-language dubbing powered by AI.",
    color: "#ec4899",
    gradient: "from-pink-600/20 to-pink-600/5",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    icon: Captions,
    title: "AI Captions",
    description: "Auto-generate animated captions with viral TikTok styles, emojis, and word highlights.",
    color: "#f59e0b",
    gradient: "from-amber-600/20 to-amber-600/5",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    icon: Film,
    title: "Reel Generator",
    description: "Convert long videos into viral Shorts, Reels, and TikToks with AI-detected viral moments.",
    color: "#10b981",
    gradient: "from-emerald-600/20 to-emerald-600/5",
    glow: "rgba(16,185,129,0.3)",
    badge: "Trending",
  },
  {
    icon: Image,
    title: "Thumbnail AI",
    description: "Generate viral YouTube thumbnails with face enhancement, AI text overlays, and glow effects.",
    color: "#ef4444",
    gradient: "from-red-600/20 to-red-600/5",
    glow: "rgba(239,68,68,0.3)",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaborative editing with shared projects, comments, and version history.",
    color: "#8b5cf6",
    gradient: "from-purple-600/20 to-purple-600/5",
    glow: "rgba(139,92,246,0.3)",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative glass rounded-2xl p-6 border border-white/[0.07] hover:border-white/[0.15] transition-all duration-400 cursor-pointer overflow-hidden"
      style={{
        boxShadow: `0 0 0 rgba(0,0,0,0)`,
      }}
      whileHover={{ boxShadow: `0 8px 40px ${feature.glow}` } as never}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
      />

      {/* Corner decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-400 -translate-y-1/2 translate-x-1/2"
        style={{ background: feature.color }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
          >
            <Icon className="w-6 h-6" style={{ color: feature.color }} />
          </div>

          {feature.badge && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${feature.color}20`,
                color: feature.color,
                border: `1px solid ${feature.color}30`,
              }}
            >
              {feature.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
          {feature.title}
        </h3>

        <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
          {feature.description}
        </p>

        {/* Arrow */}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          style={{ color: feature.color }}
        >
          Explore feature
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="features" className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Powerful Features</span>
          </div>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Everything You Need to
            <br />
            <span className="gradient-text">Create & Dominate</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            One platform combining professional editing power, AI automation,
            and viral content creation tools.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
