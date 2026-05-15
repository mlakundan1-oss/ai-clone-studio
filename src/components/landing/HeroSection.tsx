"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useAnimationFrame } from "framer-motion";
import { Play, Sparkles, Zap, ArrowRight, Star } from "lucide-react";

// Animated orb
function AnimatedOrb({ color, size, x, y, delay }: {
  color: string; size: number; x: string; y: string; delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full opacity-20 blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Floating card
function FloatingCard({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass rounded-2xl border border-white/[0.08] ${className}`}
      style={{ animation: `float ${6 + delay}s ease-in-out infinite` }}
    >
      {children}
    </motion.div>
  );
}

// Stats ticker
const stats = [
  { value: "10M+", label: "Videos Created" },
  { value: "500K+", label: "Creators" },
  { value: "99.9%", label: "Uptime" },
  { value: "4K", label: "Max Resolution" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Animated orbs */}
      <AnimatedOrb color="#2563eb" size={600} x="60%" y="-10%" delay={0} />
      <AnimatedOrb color="#7c3aed" size={500} x="-5%" y="20%" delay={2} />
      <AnimatedOrb color="#06b6d4" size={400} x="40%" y="60%" delay={4} />

      {/* Scan line */}
      <div className="scan-line opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass border border-blue-500/30 rounded-full px-4 py-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Next-Gen AI Video Studio</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="font-orbitron text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="text-white">Create</span>
                <br />
                <span className="gradient-text">Viral AI</span>
                <br />
                <span className="text-white">Videos</span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/60 leading-relaxed max-w-md"
            >
              Edit, Generate, Dub, Animate, Caption, and Render with AI.
              From prompt to viral content in minutes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-7 py-4 rounded-2xl text-base overflow-hidden neon-blue transition-shadow duration-300"
                >
                  <Zap className="w-5 h-5" />
                  Start Creating Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2.5 glass border border-white/10 hover:border-white/20 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["#3b82f6", "#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold"
                    style={{ background: `${color}33`, borderColor: color, color }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-white/50">
                  Trusted by <span className="text-white/80 font-medium">500,000+</span> creators
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — Preview UI */}
          <div className="relative hidden lg:block">
            {/* Main preview card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Editor mockup */}
              <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden neon-blue">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/60">Product Launch — 4K</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="glass rounded-lg px-3 py-1.5 text-xs text-blue-400">Export</div>
                  </div>
                </div>

                {/* Preview area */}
                <div className="relative bg-black/40 aspect-video overflow-hidden">
                  {/* Fake video content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-violet-900/30 to-cyan-900/30" />
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  
                  {/* AI processing overlay */}
                  <div className="absolute top-3 left-3 glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                    <span className="text-xs text-white/80">AI Enhancing...</span>
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>

                  {/* Bottom caption bar */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2">
                    <p className="text-sm font-bold text-white text-center">
                      <span className="text-yellow-400">🔥</span> Create. Publish. Grow.
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs text-white/40 font-mono w-8">0:00</div>
                    <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                        animate={{ width: ["0%", "65%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      />
                    </div>
                    <div className="text-xs text-white/40 font-mono w-8">2:25</div>
                  </div>
                  {/* Track rows */}
                  {["Video", "Audio", "Text"].map((track, i) => (
                    <div key={track} className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-white/30 w-8">{track}</span>
                      <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden flex gap-1 p-0.5">
                        {[...Array(3 - i)].map((_, j) => (
                          <div
                            key={j}
                            className="h-full rounded-sm"
                            style={{
                              width: `${30 + j * 15}%`,
                              background: i === 0
                                ? "rgba(37,99,235,0.5)"
                                : i === 1
                                ? "rgba(6,182,212,0.5)"
                                : "rgba(124,58,237,0.5)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stats */}
              <FloatingCard
                className="absolute -left-12 top-12 px-4 py-3 min-w-[140px]"
                delay={0.6}
              >
                <div className="text-xs text-white/50 mb-1">AI Credits</div>
                <div className="text-xl font-bold text-blue-400 font-orbitron">850</div>
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                </div>
              </FloatingCard>

              <FloatingCard
                className="absolute -right-8 bottom-20 px-4 py-3"
                delay={0.8}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Export Ready</div>
                    <div className="text-sm font-semibold text-green-400">4K • 60fps</div>
                  </div>
                </div>
              </FloatingCard>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-8 border-t border-white/[0.06]"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-orbitron text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
