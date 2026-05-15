"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-600/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-3xl rounded-full" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 glass border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-blue-300 font-medium">Free to start — no credit card required</span>
          </div>
          <h2 className="font-orbitron text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Create
            <br />
            <span className="gradient-text">Your Next Viral Hit?</span>
          </h2>
          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
            Join 500,000+ creators already using Ai Clone Studio to produce
            professional content 10x faster with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold px-8 py-4 rounded-2xl text-lg neon-blue"
              >
                <Zap className="w-5 h-5" />
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <p className="text-white/40 text-sm">✓ 50 free AI credits &nbsp; ✓ No credit card &nbsp; ✓ Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
