"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Captions, Upload, Play, Download,
  Loader2, Globe, Type, Check, Palette, FileVideo
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const captionStyles = [
  { id: "tiktok", name: "TikTok Viral", desc: "Bold + emoji", color: "#ec4899", preview: "🔥 THIS IS FIRE" },
  { id: "youtube", name: "YouTube Clean", desc: "Professional", color: "#2563eb", preview: "This is clean text" },
  { id: "cinematic", name: "Cinematic", desc: "Movie style", color: "#7c3aed", preview: "A story begins..." },
  { id: "podcast", name: "Podcast", desc: "Minimal bar", color: "#10b981", preview: "Speaking now" },
  { id: "neon", name: "Neon Glow", desc: "Futuristic", color: "#06b6d4", preview: "NEON TEXT" },
  { id: "minimal", name: "Minimal", desc: "Clean & simple", color: "#6b7280", preview: "Simple caption" },
];

const languages = ["Auto Detect", "English", "Hindi", "Spanish", "French", "German", "Japanese", "Arabic"];
const fontSizes = ["Small", "Medium", "Large", "Extra Large"];
const positions = ["Bottom", "Center", "Top"];

export default function CaptionsPage() {
  const [style, setStyle] = useState("tiktok");
  const [language, setLanguage] = useState("Auto Detect");
  const [fontSize, setFontSize] = useState("Large");
  const [position, setPosition] = useState("Bottom");
  const [generating, setGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [emojis, setEmojis] = useState(true);
  const [wordHighlight, setWordHighlight] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captions, setCaptions] = useState<{ time: string; text: string; highlighted: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedStyle = captionStyles.find(s => s.id === style)!;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setDone(false); setCaptions([]); setErrorMsg(""); }
  };

  const handleGenerate = async () => {
    if (!selectedFile || generating) return;
    setGenerating(true);
    setDone(false);
    setProgress(10);
    setErrorMsg("");
    setCaptions([]);
    setStatusMsg("📤 Uploading file...");

    try {
      // Step 1: Upload + start transcription
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("language", language);

      const res = await fetch("/api/assemblyai", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) { setErrorMsg(data.error); setGenerating(false); return; }

      const { transcriptId } = data;
      setProgress(30);
      setStatusMsg("🎙️ Transcribing audio...");

      // Step 2: Poll every 3 seconds
      let attempts = 0;
      while (attempts < 40) {
        await new Promise(r => setTimeout(r, 3000));
        attempts++;

        const pollRes = await fetch(`/api/assemblyai?id=${transcriptId}`);
        const pollData = await pollRes.json();

        if (pollData.status === "completed") {
          setCaptions(pollData.captions);
          setProgress(100);
          setStatusMsg("✅ Captions ready!");
          setDone(true);
          setGenerating(false);
          return;
        }

        if (pollData.status === "error") {
          setErrorMsg(pollData.error || "Transcription failed");
          setGenerating(false);
          return;
        }

        // Update progress gradually
        setProgress(p => Math.min(p + 5, 90));
        setStatusMsg(pollData.status === "processing" ? "⚙️ Processing..." : "⏳ Queued...");
      }

      setErrorMsg("Timeout. Dobara try karo.");
      setGenerating(false);
    } catch {
      setErrorMsg("Network error. Dobara try karo.");
      setGenerating(false);
    }
  };

  const handleExportSRT = () => {
    const srt = captions.map((c, i) =>
      `${i + 1}\n${c.time},000 --> ${c.time},999\n${c.text}\n`
    ).join("\n");
    const blob = new Blob([srt], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "captions.srt";
    a.click();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="AI Caption Generator" subtitle="Auto-generate animated captions" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — Settings */}
            <div className="space-y-4">
              <div
                className="glass rounded-2xl border border-dashed border-white/20 p-6 text-center cursor-pointer hover:border-white/40 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="video/*,audio/*" onChange={handleFileSelect} className="hidden" />
                {selectedFile ? (
                  <>
                    <FileVideo className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white mb-1 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-white/30">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                    <p className="text-xs text-green-400 mt-2">✅ File ready</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white/60 mb-1">Upload Video / Audio</p>
                    <p className="text-xs text-white/30 mb-3">MP4, MOV, MP3, WAV</p>
                    <button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">Choose File</button>
                  </>
                )}
              </div>

              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Language
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map(l => (
                    <button key={l} onClick={() => setLanguage(l)}
                      className={cn("px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                        language === l ? "bg-blue-600/30 text-blue-300 border border-blue-500/40" : "glass border border-white/[0.07] text-white/50 hover:text-white"
                      )}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/[0.08] p-4 space-y-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" /> Typography
                </p>
                <div>
                  <p className="text-xs text-white/50 mb-2">Font Size</p>
                  <div className="flex gap-1.5">
                    {fontSizes.map(f => (
                      <button key={f} onClick={() => setFontSize(f)}
                        className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                          fontSize === f ? "bg-violet-600/30 text-violet-300 border border-violet-500/40" : "glass border border-white/[0.07] text-white/40"
                        )}>{f[0]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-2">Position</p>
                  <div className="flex gap-1.5">
                    {positions.map(p => (
                      <button key={p} onClick={() => setPosition(p)}
                        className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                          position === p ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40" : "glass border border-white/[0.07] text-white/40"
                        )}>{p}</button>
                    ))}
                  </div>
                </div>
                {[{ label: "Emoji Captions", val: emojis, set: setEmojis }, { label: "Word Highlight", val: wordHighlight, set: setWordHighlight }].map(t => (
                  <div key={t.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{t.label}</span>
                    <button onClick={() => t.set(!t.val)}
                      className={cn("w-10 h-5 rounded-full relative transition-all", t.val ? "bg-blue-600" : "bg-white/10")}>
                      <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", t.val ? "right-0.5" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Center — Style + Preview */}
            <div className="space-y-4">
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Caption Style
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {captionStyles.map(s => (
                    <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setStyle(s.id)}
                      className={cn("p-3 rounded-xl border text-left transition-all",
                        style === s.id ? "border-white/20 bg-white/[0.07]" : "border-white/[0.07] glass hover:border-white/15"
                      )}
                      style={style === s.id ? { boxShadow: `0 0 15px ${s.color}20` } : {}}>
                      <div className="text-sm font-bold mb-1 truncate" style={{ color: s.color }}>{s.preview}</div>
                      <p className="text-[11px] font-semibold text-white/70">{s.name}</p>
                      <p className="text-[10px] text-white/30">{s.desc}</p>
                      {style === s.id && <Check className="w-3 h-3 mt-1" style={{ color: s.color }} />}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
                <div className="bg-black aspect-video relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                  <div className="relative text-center">
                    <Play className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-white/30 text-xs">Video Preview</p>
                  </div>
                  <div className={cn("absolute left-0 right-0 px-4 flex justify-center",
                    position === "Bottom" ? "bottom-4" : position === "Top" ? "top-4" : "top-1/2 -translate-y-1/2")}>
                    <div className="px-4 py-2 rounded-xl text-center font-bold text-lg max-w-xs"
                      style={{ color: selectedStyle.color, textShadow: `0 0 20px ${selectedStyle.color}80`, background: "rgba(0,0,0,0.5)" }}>
                      {emojis ? "🔥 " : ""}{selectedStyle.preview}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Generate + Captions */}
            <div className="space-y-4">
              <div className="glass rounded-2xl border border-white/[0.08] p-4">
                <AnimatePresence>
                  {(generating || done) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>{statusMsg}</span>
                        <span className="font-mono text-blue-400">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" animate={{ width: `${progress}%` }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="glass rounded-xl p-3 border border-red-500/30 text-red-400 text-sm mb-3">
                      ⚠️ {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={generating || !selectedFile}
                  className={cn("w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    generating || !selectedFile
                      ? "glass border border-white/10 text-white/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
                  )}>
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    : <><Captions className="w-4 h-4" /> Generate Captions (AssemblyAI)</>}
                </motion.button>
                {!selectedFile && <p className="text-[10px] text-white/30 text-center mt-2">⬅️ Pehle file upload karo</p>}
              </div>

              {done && captions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Generated Captions</p>
                    <button onClick={handleExportSRT} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                      <Download className="w-3 h-3" /> Export SRT
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {captions.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3 p-2.5 glass rounded-xl border border-white/[0.06] hover:border-white/15 cursor-pointer">
                        <span className="text-[10px] font-mono text-white/30 shrink-0 mt-0.5">{c.time}</span>
                        <p className="text-xs text-white/70 leading-relaxed">
                          {c.text.split(c.highlighted).map((part, j) =>
                            j === 0 ? part : (
                              <span key={j}>
                                <span style={{ color: selectedStyle.color, fontWeight: 700 }}>{c.highlighted}</span>
                                {part}
                              </span>
                            )
                          )}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <button onClick={handleExportSRT}
                    className="w-full mt-3 flex items-center justify-center gap-2 glass border border-white/10 rounded-xl py-2.5 text-xs text-white/60 hover:text-white transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download SRT File
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
