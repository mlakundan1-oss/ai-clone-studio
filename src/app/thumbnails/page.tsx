"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Upload, Sparkles, Download, RefreshCw,
  Loader2, Type, Palette, Sliders, Zap, Star
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const thumbnailStyles = [
  { id: "viral", name: "Viral YouTube", desc: "High contrast, bold text", color: "#ef4444" },
  { id: "cinematic", name: "Cinematic", desc: "Dark moody tones", color: "#7c3aed" },
  { id: "tech", name: "Tech/Gaming", desc: "Neon + dark bg", color: "#06b6d4" },
  { id: "vlog", name: "Lifestyle Vlog", desc: "Bright & warm", color: "#f59e0b" },
  { id: "tutorial", name: "Tutorial", desc: "Clean & clear", color: "#10b981" },
  { id: "news", name: "News Style", desc: "Professional", color: "#2563eb" },
];

const textStyles = ["Bold Impact", "Clean Sans", "Handwritten", "Futuristic", "Outline", "Shadow"];
const overlayEffects = ["None", "Glow", "Fire", "Lightning", "Particles", "Lens Flare"];

const defaultPresets = [
  { title: "10 SECRET HACKS 🔥", color: "#ef4444" },
  { title: "I QUIT MY JOB...", color: "#f59e0b" },
  { title: "YOU WON'T BELIEVE THIS", color: "#7c3aed" },
  { title: "The TRUTH About AI", color: "#2563eb" },
];

export default function ThumbnailsPage() {
  const [thumbStyle, setThumbStyle] = useState("viral");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [textStyle, setTextStyle] = useState("Bold Impact");
  const [overlay, setOverlay] = useState("Glow");
  const [generating, setGenerating] = useState(false);
  const [generatingTitles, setGeneratingTitles] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faceEnhance, setFaceEnhance] = useState(true);
  const [bgRemove, setBgRemove] = useState(false);
  const [aiTitles, setAiTitles] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const selected = thumbnailStyles.find(s => s.id === thumbStyle)!;

  // ── Claude: Generate Viral Titles ─────────────────────────────────────────
  const handleGenerateTitles = async () => {
    const topicToUse = topic.trim() || title.trim();
    if (!topicToUse || generatingTitles) return;
    setGeneratingTitles(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "thumbnail-titles",
          data: {
            topic: topicToUse,
            style: selected.name,
            channelType: "YouTube",
          },
        }),
      });
      const data = await res.json();
      if (data.result?.titles) {
        setAiTitles(data.result.titles);
      } else if (Array.isArray(data.result)) {
        setAiTitles(data.result);
      } else {
        setErrorMsg("Titles generate nahi hue. Topic likhke try karo.");
      }
    } catch {
      setErrorMsg("Network error. API key check karo.");
    } finally {
      setGeneratingTitles(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true); setDone(false); setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 94) { clearInterval(iv); return 94; } return p + Math.random() * 9; });
    }, 200);
    await new Promise(r => setTimeout(r, 3500));
    clearInterval(iv); setProgress(100); setDone(true); setGenerating(false);
  };

  const presets = aiTitles.length > 0
    ? aiTitles.map((t, i) => ({ title: t, color: thumbnailStyles[i % thumbnailStyles.length].color }))
    : defaultPresets;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="AI Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="space-y-4">
              {/* Upload */}
              <div className="glass rounded-2xl border border-dashed border-white/20 p-5 text-center">
                <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white/60 mb-1">Upload Image / Screenshot</p>
                <p className="text-xs text-white/30 mb-3">Or generate from AI</p>
                <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
                  Upload Photo
                </button>
              </div>

              {/* Thumbnail Style */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Thumbnail Style</p>
                <div className="space-y-1.5">
                  {thumbnailStyles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setThumbStyle(s.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all",
                        thumbStyle === s.id ? "border-white/20 bg-white/[0.06]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                      <div>
                        <p className="text-xs font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-white/40">{s.desc}</p>
                      </div>
                      {thumbStyle === s.id && <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${s.color}30` }}><div className="w-2 h-2 rounded-full" style={{ background: s.color }} /></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Enhancements */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4 space-y-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Enhancements
                </p>
                {[
                  { label: "Face Enhancement", desc: "AI sharpens & brightens faces", val: faceEnhance, set: setFaceEnhance },
                  { label: "Background Remove", desc: "Remove & replace background", val: bgRemove, set: setBgRemove },
                ].map(t => (
                  <div key={t.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">{t.label}</p>
                      <p className="text-[10px] text-white/30">{t.desc}</p>
                    </div>
                    <button
                      onClick={() => t.set(!t.val)}
                      className={cn("w-10 h-5 rounded-full relative transition-all", t.val ? "bg-blue-600" : "bg-white/10")}
                    >
                      <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", t.val ? "right-0.5" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Center — Preview */}
            <div className="space-y-4">
              {/* Thumbnail preview */}
              <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${selected.color}20, #000)` }} />
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <div className="absolute left-4 top-4 bottom-4 w-36 rounded-xl flex items-center justify-center"
                    style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}20` }}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl"
                        style={{ background: `${selected.color}25` }}>👤</div>
                      <p className="text-[10px] text-white/30">Your face here</p>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 bottom-4 flex items-center w-40">
                    <div>
                      {done || title ? (
                        <p className="text-xl font-black text-white leading-tight" style={{ textShadow: `0 0 20px ${selected.color}` }}>
                          {title || defaultPresets[0].title}
                        </p>
                      ) : (
                        <p className="text-sm text-white/20">Your title appears here</p>
                      )}
                    </div>
                  </div>
                  {overlay === "Glow" && (
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 60px ${selected.color}30` }} />
                  )}
                </div>
                <div className="p-3 flex gap-2">
                  {done ? (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-600/20 border border-green-500/30 rounded-xl py-2.5 text-xs text-green-400">
                        <Download className="w-3.5 h-3.5" /> Download PNG
                      </button>
                      <button onClick={handleGenerate} className="flex items-center justify-center gap-1.5 glass border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white/60 hover:text-white">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <p className="flex-1 text-center text-xs text-white/30 py-2">Generate to see result</p>
                  )}
                </div>
              </div>

              {/* ── Claude AI Titles ─────────────────────────────────────── */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" />
                    {aiTitles.length > 0 ? "✨ Claude AI Titles" : "Viral Title Presets"}
                  </p>
                  {aiTitles.length > 0 && (
                    <button onClick={() => setAiTitles([])} className="text-[10px] text-white/30 hover:text-white">Reset</button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {presets.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setTitle(p.title)}
                      className={cn(
                        "w-full text-left px-3 py-2 glass rounded-xl border transition-all text-xs font-bold",
                        title === p.title ? "border-white/30" : "border-white/[0.06] hover:border-white/20"
                      )}
                      style={{ color: p.color }}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
                {errorMsg && (
                  <p className="text-[10px] text-red-400 mt-2">⚠️ {errorMsg}</p>
                )}
              </div>
            </div>

            {/* Right — Text & Generate */}
            <div className="space-y-4">
              {/* Topic for Claude + Title input */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" /> Title Text
                </p>

                {/* Topic for AI titles */}
                <div className="mb-3">
                  <p className="text-[10px] text-white/30 mb-1.5">Topic / Video idea (Claude ke liye):</p>
                  <div className="flex gap-2">
                    <input
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. How to make money online..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-violet-500/50"
                    />
                    <button
                      onClick={handleGenerateTitles}
                      disabled={(!topic.trim() && !title.trim()) || generatingTitles}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0",
                        (topic.trim() || title.trim()) && !generatingTitles
                          ? "bg-violet-600/40 border border-violet-500/50 text-violet-300 hover:bg-violet-600/60"
                          : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                      )}
                    >
                      {generatingTitles ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI
                    </button>
                  </div>
                </div>

                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="YOUR VIRAL TITLE HERE..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/25 outline-none border-b border-white/10 focus:border-blue-500/50 pb-2 mb-4 transition-colors"
                />
                <p className="text-xs text-white/40 mb-2">Text Style</p>
                <div className="flex flex-wrap gap-1.5">
                  {textStyles.map(s => (
                    <button
                      key={s}
                      onClick={() => setTextStyle(s)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                        textStyle === s ? "bg-red-600/30 text-red-300 border border-red-500/40" : "glass border border-white/[0.07] text-white/50 hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay effect */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Overlay Effect
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {overlayEffects.map(o => (
                    <button
                      key={o}
                      onClick={() => setOverlay(o)}
                      className={cn(
                        "py-2 rounded-lg text-[11px] font-medium transition-all",
                        overlay === o ? "bg-violet-600/30 text-violet-300 border border-violet-500/40" : "glass border border-white/[0.07] text-white/40 hover:text-white"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <AnimatePresence>
                  {(generating || done) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>{done ? "✅ Thumbnail ready!" : "🎨 Generating..."}</span>
                        <span className="font-mono text-red-400">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" animate={{ width: `${progress}%` }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    generating ? "glass border border-white/10 text-white/30 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-orange-600 text-white"
                  )}
                >
                  {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate Thumbnail</>}
                </motion.button>
                <p className="text-[10px] text-white/30 text-center mt-2">Costs 5 AI credits · Titles by Claude AI ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
