"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, Play, Pause, Wand2, Globe, Volume2, Zap, Check, Loader2, RefreshCw, Sparkles } from "lucide-react";

import Topbar from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese", "Portuguese", "Arabic"];
const EMOTIONS = ["Neutral", "Happy", "Sad", "Excited", "Calm", "Serious", "Whispering"];

const savedVoices = [
  { id: 1, name: "My Voice", lang: "English", trained: true, samples: 12 },
  { id: 2, name: "Brand Voice", lang: "English", trained: true, samples: 8 },
  { id: 3, name: "Hindi Narrator", lang: "Hindi", trained: false, samples: 3 },
];

const WaveformBars = ({ active }: { active: boolean }) => (
  <div className="flex items-center gap-0.5 h-8">
    {Array.from({ length: 24 }, (_, i) => (
      <div
        key={i}
        className={cn("w-1 rounded-full transition-all", active ? "bg-blue-400" : "bg-white/20")}
        style={{
          height: active ? `${20 + Math.sin(i * 0.8) * 14}px` : "8px",
          animation: active ? `waveform ${0.5 + (i % 3) * 0.2}s ease-in-out infinite` : "none",
          animationDelay: `${i * 0.05}s`,
        }}
      />
    ))}
  </div>
);

export default function VoiceStudioPage() {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(1);
  const [language, setLanguage] = useState("English");
  const [emotion, setEmotion] = useState("Neutral");
  const [text, setText] = useState("Welcome to Ai Clone Studio. The future of AI video creation is here.");
  const [generating, setGenerating] = useState(false);
  const [writingScript, setWritingScript] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Claude: Write AI Voiceover Script ──────────────────────────────────────
  const handleWriteScript = async () => {
    if (!text.trim() || writingScript) return;
    setWritingScript(true);
    setErrorMsg("");
    try {
      const voiceName = savedVoices.find(v => v.id === selectedVoice)?.name ?? "Voice";
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "voiceover-script",
          data: { text, language, emotion, voiceName },
        }),
      });
      const data = await res.json();
      if (data.result) setText(data.result);
      else setErrorMsg("Script write nahi hua. Dobara try karo.");
    } catch {
      setErrorMsg("Network error. API key check karo.");
    } finally {
      setWritingScript(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 2200));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Voice Clone Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 to-blue-600/5 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center neon-cyan">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-orbitron text-2xl font-bold text-white mb-1">Voice Clone Studio</h2>
                <p className="text-white/50">Clone voices, generate speech, dub videos in 20+ languages</p>
              </div>
            </div>
            <div className="glass border border-green-500/20 rounded-xl px-4 py-2 text-center">
              <div className="font-orbitron text-sm font-bold text-green-400">LIVE</div>
              <div className="text-xs text-white/40">Claude AI</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Voice cloning */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5 border border-white/[0.08]">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" /> Clone Your Voice
              </h3>

              <div className="space-y-3 mb-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRecording(!recording)}
                  className={cn(
                    "w-full py-4 rounded-xl flex flex-col items-center gap-2 border transition-all",
                    recording
                      ? "bg-red-500/20 border-red-500/50 text-red-400"
                      : "glass border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", recording ? "bg-red-500 animate-pulse" : "bg-white/10")}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{recording ? "🔴 Recording... Click to stop" : "Record Voice Sample"}</span>
                  {recording && <WaveformBars active />}
                </motion.button>

                <button className="w-full py-3 glass border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white hover:border-white/40 transition-all">
                  <Upload className="w-4 h-4" /> Upload Audio File
                </button>
              </div>

              <div className="text-xs text-white/30 text-center mb-4">
                Need 30+ seconds for best results. Speak naturally and clearly.
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm">
                <Wand2 className="w-4 h-4" /> Train Voice Model — 50 credits
              </button>
            </div>

            {/* Saved voices */}
            <div className="glass rounded-2xl p-5 border border-white/[0.08]">
              <h3 className="font-semibold text-white mb-3 text-sm">My Voice Library</h3>
              <div className="space-y-2">
                {savedVoices.map(voice => (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                      selectedVoice === voice.id
                        ? "bg-blue-600/20 border-blue-500/40 text-white"
                        : "glass border-white/[0.06] text-white/60 hover:text-white hover:border-white/15"
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{voice.name}</p>
                      <p className="text-[10px] text-white/30">{voice.lang} · {voice.samples} samples</p>
                    </div>
                    {voice.trained
                      ? <Check className="w-4 h-4 text-green-400" />
                      : <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center — Text to speech */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-400" /> Generate Speech
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Voice:</span>
                  <span className="text-xs font-medium text-blue-400">
                    {savedVoices.find(v => v.id === selectedVoice)?.name}
                  </span>
                </div>
              </div>

              {/* ✨ AI Write Script Button */}
              <div className="mb-3">
                <button
                  onClick={handleWriteScript}
                  disabled={!text.trim() || writingScript}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                    text.trim() && !writingScript
                      ? "bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50"
                      : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                  )}
                >
                  {writingScript ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> AI likh raha hai...</>
                  ) : (
                    <><Sparkles className="w-3 h-3" /> ✨ Claude se likhwao</>
                  )}
                </button>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={5}
                placeholder="Type or paste the text you want to convert to speech... Ya upar se Claude se likhwao!"
                className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder-white/20 leading-relaxed mb-4"
              />

              {/* Error */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="glass rounded-xl p-3 border border-red-500/30 text-red-400 text-sm mb-3">
                    ⚠️ {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Language
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.slice(0, 6).map(lang => (
                      <button key={lang} onClick={() => setLanguage(lang)}
                        className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all",
                          language === lang ? "bg-blue-600/30 text-blue-400 border border-blue-500/40" : "glass border border-white/10 text-white/50 hover:text-white"
                        )}>{lang}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Emotion</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS.map(em => (
                      <button key={em} onClick={() => setEmotion(em)}
                        className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all",
                          emotion === em ? "bg-violet-600/30 text-violet-400 border border-violet-500/40" : "glass border border-white/10 text-white/50 hover:text-white"
                        )}>{em}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl neon-blue flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                    : <><Wand2 className="w-4 h-4" /> Generate Voice · 5 credits</>}
                </motion.button>
              </div>
            </div>

            {/* Generated audio player */}
            <AnimatePresence>
              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-5 border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" /> Generated Audio Ready
                    </p>
                    <button onClick={handleGenerate} className="p-2 glass rounded-lg text-white/40 hover:text-white border border-white/10">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass rounded-xl p-4 border border-white/[0.06] mb-4">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setPlaying(!playing)}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center neon-blue shrink-0"
                      >
                        {playing ? <Pause className="w-4 h-4 text-white" fill="white" /> : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
                      </motion.button>
                      <div className="flex-1">
                        <WaveformBars active={playing} />
                      </div>
                      <span className="text-xs text-white/40 font-mono shrink-0">0:12 / 0:45</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-white/50 mb-4">
                    <div className="glass rounded-lg p-2 text-center border border-white/[0.06]">
                      <div className="font-semibold text-white">{language}</div>
                      <div>Language</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center border border-white/[0.06]">
                      <div className="font-semibold text-white">{emotion}</div>
                      <div>Emotion</div>
                    </div>
                    <div className="glass rounded-lg p-2 text-center border border-white/[0.06]">
                      <div className="font-semibold text-white">48kHz</div>
                      <div>Quality</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> Add to Video
                    </button>
                    <button className="px-4 py-2.5 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-sm transition-colors">
                      Download
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
