"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Upload, Play, Sparkles, Mic, Video,
  Loader2, Check, Download, RefreshCw, Camera,
  Sliders, Globe, Smile
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const avatarTemplates = [
  { id: "1", name: "Alex Pro", role: "Business Presenter", color: "#2563eb" },
  { id: "2", name: "Sophia", role: "News Anchor", color: "#ec4899" },
  { id: "3", name: "Marcus", role: "Tech Educator", color: "#7c3aed" },
  { id: "4", name: "Priya", role: "Lifestyle Creator", color: "#10b981" },
  { id: "5", name: "David", role: "Sales Presenter", color: "#f59e0b" },
  { id: "6", name: "Emma", role: "Podcast Host", color: "#06b6d4" },
];

const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Arabic", "Portuguese"];

export default function AvatarStudioPage() {
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [script, setScript] = useState("");
  const [language, setLanguage] = useState("English");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState<"template" | "upload">("template");

  const handleGenerate = async () => {
    if (!script.trim() || generating) return;
    setGenerating(true);
    setDone(false);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 94) { clearInterval(iv); return 94; }
        return p + Math.random() * 6;
      });
    }, 250);
    await new Promise(r => setTimeout(r, 4500));
    clearInterval(iv);
    setProgress(100);
    setDone(true);
    setGenerating(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="AI Avatar Studio" subtitle="Create hyper-realistic talking avatars" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — Avatar Picker */}
            <div className="space-y-4">
              {/* Tab */}
              <div className="glass rounded-2xl border border-white/[0.08] p-1.5 flex gap-1">
                {(["template", "upload"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all",
                      tab === t
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                        : "text-white/40 hover:text-white"
                    )}
                  >
                    {t === "template" ? "🤖 Templates" : "📸 Upload"}
                  </button>
                ))}
              </div>

              {tab === "template" ? (
                <div className="glass rounded-2xl border border-white/[0.08] p-4">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Choose Avatar</p>
                  <div className="grid grid-cols-2 gap-2">
                    {avatarTemplates.map(av => (
                      <motion.button
                        key={av.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedAvatar(av.id)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all",
                          selectedAvatar === av.id
                            ? "border-blue-500/50 bg-blue-600/10"
                            : "border-white/[0.07] glass hover:border-white/20"
                        )}
                      >
                        <div
                          className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold"
                          style={{ background: `${av.color}25`, border: `2px solid ${av.color}40`, color: av.color }}
                        >
                          {av.name[0]}
                        </div>
                        <p className="text-xs font-semibold text-white text-center">{av.name}</p>
                        <p className="text-[10px] text-white/40 text-center truncate">{av.role}</p>
                        {selectedAvatar === av.id && (
                          <div className="mt-1 flex justify-center">
                            <Check className="w-3 h-3 text-blue-400" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl border border-dashed border-white/20 p-8 text-center">
                  <Camera className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white/60 mb-1">Upload Your Photo</p>
                  <p className="text-xs text-white/30 mb-4">AI will create your personal avatar</p>
                  <button className="btn-primary text-xs px-4 py-2 rounded-xl">
                    Choose Photo
                  </button>
                </div>
              )}

              {/* Settings */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4 space-y-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" /> Avatar Settings
                </p>
                {[
                  { label: "Eye Blink", desc: "Natural blinking" },
                  { label: "Head Movement", desc: "Subtle head motion" },
                  { label: "Gesture", desc: "Hand gestures" },
                  { label: "Emotion", desc: "Facial expression" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/70">{s.label}</p>
                      <p className="text-[10px] text-white/30">{s.desc}</p>
                    </div>
                    <button className="w-10 h-5 rounded-full bg-blue-600/50 border border-blue-500/50 relative transition-all">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-blue-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Center — Preview */}
            <div className="space-y-4">
              {/* Preview window */}
              <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
                <div className="bg-black/50 aspect-[9/16] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-violet-900/20" />
                  {/* Avatar placeholder */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold border-4"
                      style={{
                        background: `${avatarTemplates.find(a => a.id === selectedAvatar)?.color}25`,
                        borderColor: `${avatarTemplates.find(a => a.id === selectedAvatar)?.color}60`,
                        color: avatarTemplates.find(a => a.id === selectedAvatar)?.color,
                        boxShadow: `0 0 40px ${avatarTemplates.find(a => a.id === selectedAvatar)?.color}30`,
                      }}
                    >
                      {avatarTemplates.find(a => a.id === selectedAvatar)?.name[0]}
                    </motion.div>
                    <p className="text-white font-semibold text-sm">
                      {avatarTemplates.find(a => a.id === selectedAvatar)?.name}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {avatarTemplates.find(a => a.id === selectedAvatar)?.role}
                    </p>
                    {/* Waveform */}
                    {generating && (
                      <div className="flex items-end justify-center gap-0.5 mt-4 h-8">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-blue-400"
                            animate={{ height: [4, Math.random() * 28 + 4, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Holographic rings */}
                  {[80, 120, 160].map((size, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border opacity-10"
                      style={{
                        width: size + 80,
                        height: size + 80,
                        borderColor: avatarTemplates.find(a => a.id === selectedAvatar)?.color,
                      }}
                      animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.15, 0.08] }}
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                    />
                  ))}
                </div>
                <div className="p-3 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 glass border border-white/10 rounded-xl py-2.5 text-xs text-white/60 hover:text-white transition-colors">
                    <Play className="w-3.5 h-3.5" /> Preview
                  </button>
                  {done && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-600/20 border border-green-500/30 rounded-xl py-2.5 text-xs text-green-400">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right — Script & Generate */}
            <div className="space-y-4">
              {/* Language */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Language
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map(l => (
                    <button
                      key={l}
                      onClick={() => setLanguage(l)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                        language === l
                          ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                          : "glass border border-white/[0.07] text-white/50 hover:text-white hover:border-white/20"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Script */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5" /> Script / Dialogue
                </p>
                <textarea
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  placeholder="Enter what your avatar should say..."
                  className="w-full h-36 bg-transparent resize-none text-sm text-white placeholder-white/25 outline-none leading-relaxed"
                />
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] text-white/30">{script.length} chars</span>
                  <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Record voice
                  </button>
                </div>
              </div>

              {/* Generate */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <AnimatePresence>
                  {(generating || done) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>{done ? "✅ Avatar ready!" : "⚡ Rendering avatar..."}</span>
                        <span className="font-mono text-blue-400">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={!script.trim() || generating}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    !script.trim() || generating
                      ? "glass border border-white/10 text-white/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-violet-600 text-white"
                  )}
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Avatar...</>
                    : done
                    ? <><RefreshCw className="w-4 h-4" /> Regenerate</>
                    : <><User className="w-4 h-4" /> Generate Avatar Video</>}
                </motion.button>
                <p className="text-[10px] text-white/30 text-center mt-2">Costs 30 AI credits per generation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
