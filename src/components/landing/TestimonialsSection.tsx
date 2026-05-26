"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "YouTube Creator",
    subscribers: "2.4M subscribers",
    avatar: "SC",
    color: "#2563eb",
    rating: 5,
    text: "Ai Clone Studio completely transformed my workflow. I produce 3x more content with the AI Auto Editor alone. The reel generator is pure magic.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Agency Owner",
    subscribers: "Creative Director @ PixelForge",
    avatar: "MR",
    color: "#7c3aed",
    rating: 5,
    text: "We handle 20+ clients and Ai Clone Studio's team workspace is flawless. Real-time collaboration, version history — it's the Adobe Suite killer we needed.",
  },
  {
    name: "Priya Sharma",
    role: "TikTok Creator",
    subscribers: "5.1M followers",
    avatar: "PS",
    color: "#ec4899",
    rating: 5,
    text: "The AI captions with emoji animations blew up my engagement by 340%! Reel Generator cuts my editing time from 4 hours to 20 minutes.",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    subscribers: "CEO @ LaunchPad",
    avatar: "DK",
    color: "#06b6d4",
    rating: 5,
    text: "Our product videos used to cost $5K each. Now we produce broadcast-quality content in-house with AI avatars and voice cloning. ROI is incredible.",
  },
  {
    name: "Emma Williams",
    role: "Podcast Host",
    subscribers: "Horizon Talks Podcast",
    avatar: "EW",
    color: "#10b981",
    rating: 5,
    text: "Auto subtitles, B-roll generation, and the AI editor turned our raw podcast recordings into polished YouTube episodes. Game changer.",
  },
  {
    name: "Alex Thompson",
    role: "Filmmaker",
    subscribers: "Award-winning Director",
    avatar: "AT",
    color: "#f59e0b",
    rating: 5,
    text: "4K exports, cinematic LUTs, AI color grading — the output quality rivals $50K software suites. Ai Clone Studio is the future of filmmaking.",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-5">
            Loved by <span className="gradient-text">500K+ Creators</span>
          </h2>
          <p className="text-lg text-white/50">
            From solo creators to enterprise teams — Ai Clone Studio powers
            the world&apos;s best content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-400"
                style={{ background: t.color }}
              />

              <Quote className="w-8 h-8 mb-4 opacity-30" style={{ color: t.color }} />

              <div className="flex mb-3 gap-0.5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-white/70 leading-relaxed mb-6 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: `${t.color}30`, color: t.color, border: `1px solid ${t.color}40` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role} · {t.subscribers}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
