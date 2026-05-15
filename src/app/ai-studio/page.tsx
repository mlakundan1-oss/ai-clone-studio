"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Film, Zap, Play, Download, RefreshCw, ChevronRight, Loader2 } from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const STYLES = ["Cinematic","Documentary","Vlog","Commercial","Anime","Realistic","Abstract","Vintage"];
const DURATIONS = ["15s","30s","1 min","2 min","5 min"];
const RATIOS = ["16:9 (Landscape)","9:16 (Portrait)","1:1 (Square)","4:3 (Classic)"];
const EXAMPLES = [
  "A futuristic city at sunset with flying cars and neon lights",
  "Product showcase for a luxury watch with cinematic close-ups",
  "Motivational reel with fast cuts, epic music and bold text",
  "Ocean waves crashing on a rocky shore at golden hour",
];
const recentGenerations = [
  { id: 1, prompt: "Cyberpunk city at night", status: "complete", style: "Cinematic", duration: "30s" },
  { id: 2, prompt: "Product launch reveal", status: "complete", style: "Commercial", duration: "1 min" },
  { id: 3, prompt: "Nature timelapse", status: "processing", style: "Documentary", duration: "2 min" },
];

export default function AIStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState("30s");
  const [ratio, setRatio] = useState("16:9 (Landscape)");
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [generatedScript, setGeneratedScript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Claude: Enhance Prompt ──────────────────────────────────────────────────
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || enhancing) return;
    setEnhancing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "enhance-prompt", data: { prompt } }),
      });
      const data = await res.json();
      if (data.result) setPrompt(data.result);
      else setErrorMsg("Prompt enhance nahi hua. Dobara try karo.");
    } catch {
      setErrorMsg("Network error. API key check karo.");
    } finally {
      setEnhancing(false);
    }
  };

  // ── Claude: Generate Video Script ──────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setProgress(0);
    setGenerated(false);
    setGeneratedScript("");
    setErrorMsg("");

    // Animate progress while Claude generates
    const progressInterval = setInterval(() => {
      setProgress(p => (p >= 85 ? 85 : p + Math.random() * 8));
    }, 300);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "generate-script",
          data: { prompt, style, duration, ratio },
        }),
      });
      const data = await res.json();
      clearInterval(progressInterval);
      setProgress(100);
      if (data.result) {
        setGeneratedScript(data.result);
        setGenerated(true);
      } else {
        setErrorMsg(data.error || "Script generate nahi hua.");
      }
    } catch {
      clearInterval(progressInterval);
      setErrorMsg("Network error. API key check karo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="AI Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="glass rounded-2xl p-6 border border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-blue-600/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-dots opacity-20" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="font-orbitron text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-violet-400" /> AI Video Generator
                </h2>
                <p className="text-white/50 text-sm">Transform prompts, scripts, and ideas into stunning videos</p>
              </div>
              <div className="glass border border-green-500/20 rounded-xl px-4 py-2 text-center">
                <div className="font-orbitron text-xl font-bold text-green-400">LIVE</div>
                <div className="text-xs text-white/40">Claude AI</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: "generate", label: "🎬 Generate Video" },
            { id: "reel", label: "📱 Reel Generator" },
            { id: "broll", label: "🎥 B-Roll AI" },
            { id: "storyboard", label: "📋 Storyboard" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white neon-blue" : "glass border border-white/10 text-white/60 hover:text-white"
              )}>{tab.label}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Video Prompt</label>
                {/* ✨ Enhance Prompt Button */}
                <button
                  onClick={handleEnhancePrompt}
                  disabled={!prompt.trim() || enhancing}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                    prompt.trim() && !enhancing
                      ? "bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:bg-violet-600/50"
                      : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                  )}
                >
                  {enhancing ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Enhancing...</>
                  ) : (
                    <><Wand2 className="w-3 h-3" /> ✨ AI Enhance</>
                  )}
                </button>
              </div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video in detail... e.g. 'A cinematic product reveal of a luxury watch, close-up shots, dramatic lighting, epic orchestral music'"
                rows={4} className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder-white/20 leading-relaxed" />
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Try these:</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLES.map(ex => (
                    <button key={ex} onClick={() => setPrompt(ex)}
                      className="text-[11px] text-white/40 hover:text-white border border-white/10 hover:border-white/25 rounded-lg px-2.5 py-1 transition-all max-w-[200px] truncate">{ex}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Style", items: STYLES.slice(0, 4), val: style, set: setStyle },
                { label: "Duration", items: DURATIONS, val: duration, set: setDuration },
                { label: "Aspect Ratio", items: RATIOS, val: ratio, set: setRatio },
              ].map(({ label, items, val, set }) => (
                <div key={label} className="glass rounded-xl p-4 border border-white/[0.08]">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{label}</p>
                  <div className="space-y-1">
                    {items.map(item => (
                      <button key={item} onClick={() => set(item)}
                        className={cn("w-full py-1.5 rounded-lg text-[11px] font-medium transition-all text-left px-2",
                          val === item ? "bg-blue-600/30 text-blue-400 border border-blue-500/40" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}>{item.split(" ")[0]}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass rounded-xl p-3 border border-red-500/30 text-red-400 text-sm">
                  ⚠️ {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleGenerate} disabled={generating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl neon-blue flex items-center justify-center gap-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating with Claude AI...</> : <><Sparkles className="w-5 h-5" /> Generate Video Script <span className="text-white/60 text-sm font-normal">· Claude AI</span></>}
            </motion.button>

            <AnimatePresence>
              {generating && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="glass rounded-xl p-4 border border-blue-500/20">
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>Claude AI thinking...</span><span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-2 text-[11px] text-white/30 text-center">
                    {progress < 30 ? "🧠 Claude prompt analyze kar raha hai..." : progress < 60 ? "✍️ Script likh raha hai..." : progress < 90 ? "🎬 Finalizing..." : "✅ Almost done..."}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Generated Script Output ─────────────────────────────────── */}
            <AnimatePresence>
              {generated && generatedScript && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl border border-green-500/20 overflow-hidden">
                  <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-semibold text-white">Claude AI Script Ready</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleGenerate} className="p-1.5 glass rounded-lg border border-white/10 text-white/60 hover:text-white">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedScript)}
                        className="text-xs bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Copy Script
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <pre className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">{generatedScript}</pre>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-3 text-xs text-white/30">
                      <span>📹 {style}</span><span>⏱ {duration}</span><span>📐 {ratio.split(" ")[0]}</span>
                      <span className="ml-auto text-green-400/60">✨ Generated by Claude AI</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Recent Generations
            </h3>
            <div className="space-y-3">
              {recentGenerations.map(gen => (
                <motion.div key={gen.id} whileHover={{ x: 2 }}
                  className="glass rounded-xl p-4 border border-white/[0.07] hover:border-white/15 cursor-pointer transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 flex items-center justify-center shrink-0">
                      <Play className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{gen.prompt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                          gen.status === "complete" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400")}>
                          {gen.status === "processing" && <Loader2 className="w-2.5 h-2.5 inline animate-spin mr-1" />}{gen.status}
                        </span>
                        <span className="text-[10px] text-white/30">{gen.style}</span>
                        <span className="text-[10px] text-white/30">{gen.duration}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
