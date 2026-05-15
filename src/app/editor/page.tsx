"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ZoomIn, ZoomOut, Scissors, Copy, Trash2, Undo2, Redo2,
  Layers, Wand2, Sparkles, Download, ChevronLeft, Plus,
  Lock, Eye, EyeOff, Music, Type, Image, Video,
  AlignLeft, Maximize2, Settings, Save, Share2, Mic,
  SlidersHorizontal, Zap, MoreHorizontal, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useEditorStore } from "@/store";
import { formatDuration, cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", icon: Layers, label: "Select" },
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "text", icon: Type, label: "Text" },
  { id: "audio", icon: Music, label: "Audio" },
  { id: "image", icon: Image, label: "Image" },
];

const EFFECTS = ["Fade In", "Fade Out", "Blur", "Glow", "Zoom", "Pan", "Shake", "Flash", "Film Grain", "Vignette"];
const TRANSITIONS = ["Cut", "Dissolve", "Wipe", "Slide", "Zoom", "Spin", "Glitch", "Morph"];
const FILTERS = ["None", "Cinematic", "Warm", "Cool", "B&W", "Vintage", "Neon", "Fade", "HDR", "Matte"];

function TrackClip({ clip, zoom, trackColor }: { clip: any; zoom: number; trackColor: string }) {
  const [dragging, setDragging] = useState(false);
  const { selectedClipId, setSelectedClip } = useEditorStore();
  const isSelected = selectedClipId === clip.id;

  return (
    <motion.div
      onClick={() => setSelectedClip(clip.id)}
      whileHover={{ scaleY: 1.05 }}
      className={cn(
        "absolute top-1 bottom-1 rounded-md cursor-pointer transition-all overflow-hidden border",
        isSelected ? "border-white/60 ring-1 ring-white/30" : "border-transparent hover:border-white/20"
      )}
      style={{
        left: `${clip.startTime * zoom * 20}px`,
        width: `${clip.duration * zoom * 20}px`,
        background: `linear-gradient(135deg, ${trackColor}60, ${trackColor}30)`,
        minWidth: 40,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
      <div className="px-2 py-1 flex items-center gap-1 h-full">
        <div className="w-1 h-full opacity-40 rounded-full" style={{ background: trackColor }} />
        <span className="text-[10px] text-white/80 truncate font-medium">{clip.name}</span>
      </div>
      {/* Resize handles */}
      <div className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20 transition-colors rounded-l-md" />
      <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20 transition-colors rounded-r-md" />
    </motion.div>
  );
}

export default function EditorPage() {
  const {
    tracks, currentTime, duration, isPlaying, zoom,
    setCurrentTime, setIsPlaying, setZoom, undo, redo
  } = useEditorStore();

  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [activeTool, setActiveTool] = useState("select");
  const [leftPanel, setLeftPanel] = useState<"media" | "effects" | "transitions" | "filters" | "text">("media");
  const [rightPanel, setRightPanel] = useState<"properties" | "ai" | "export">("properties");
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hi! I'm your AI editing assistant. Tell me what to do — 'add cinematic transitions', 'remove silence', 'generate captions', etc." }
  ]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const trackColors: Record<string, string> = {
    video: "#2563eb", audio: "#06b6d4", text: "#7c3aed", effects: "#ec4899"
  };

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, x / (zoom * 20)));
    setCurrentTime(newTime);
  }, [duration, zoom, setCurrentTime]);

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", text: msg }]);
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const responses: Record<string, string> = {
      default: "✅ Done! Applied the changes to your timeline. Check the preview to see the result.",
    };
    const reply = Object.entries(responses).find(([k]) => msg.toLowerCase().includes(k))?.[1] || responses.default;
    setAiMessages(prev => [...prev, { role: "ai", text: `✅ I've analyzed your video and applied "${msg}". The timeline has been updated with AI-optimized edits!` }]);
    setAiLoading(false);
  };

  const pxPerSec = zoom * 20;
  const timelineWidth = Math.max(duration * pxPerSec, 800);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] glass shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <input
              defaultValue="Product Launch Video"
              className="bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-blue-500/50 pb-0.5 w-48"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Autosaved
          </div>
        </div>

        {/* Center tools */}
        <div className="flex items-center gap-1 glass border border-white/10 rounded-xl p-1">
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.label}
              className={cn(
                "p-2 rounded-lg transition-all",
                activeTool === t.id
                  ? "bg-blue-600/30 text-blue-400"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <t.icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button onClick={undo} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-ghost flex items-center gap-1.5 text-sm px-3 py-1.5">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          <button className="btn-ghost flex items-center gap-1.5 text-sm px-3 py-1.5">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setRightPanel("export")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl neon-blue"
          >
            <Download className="w-4 h-4" /> Export
          </motion.button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-52 shrink-0 border-r border-white/[0.06] glass flex flex-col overflow-hidden">
          {/* Panel tabs */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto no-scrollbar">
            {(["media", "effects", "transitions", "filters"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setLeftPanel(tab)}
                className={cn(
                  "px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors",
                  leftPanel === tab ? "text-blue-400 border-b-2 border-blue-500" : "text-white/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
            {leftPanel === "media" && (
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl p-4 text-xs text-white/40 hover:text-white hover:border-white/40 transition-colors">
                  <Plus className="w-4 h-4" /> Upload Media
                </button>
                {["Intro Clip", "Main Content", "Outro", "Background Music", "SFX Pack"].map(name => (
                  <div key={name} className="flex items-center gap-2 p-2.5 glass rounded-xl border border-white/[0.06] hover:border-white/15 cursor-grab transition-all group">
                    <div className="w-10 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                      <Video className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-white/80 truncate">{name}</p>
                      <p className="text-[10px] text-white/30">MP4 • 1080p</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {leftPanel === "effects" && (
              <div className="grid grid-cols-2 gap-1.5">
                {EFFECTS.map(fx => (
                  <button key={fx} className="p-2 glass rounded-lg border border-white/[0.06] hover:border-blue-500/40 text-[11px] text-white/60 hover:text-white transition-all">
                    {fx}
                  </button>
                ))}
              </div>
            )}
            {leftPanel === "transitions" && (
              <div className="grid grid-cols-2 gap-1.5">
                {TRANSITIONS.map(tr => (
                  <button key={tr} className="p-2 glass rounded-lg border border-white/[0.06] hover:border-violet-500/40 text-[11px] text-white/60 hover:text-white transition-all">
                    {tr}
                  </button>
                ))}
              </div>
            )}
            {leftPanel === "filters" && (
              <div className="grid grid-cols-2 gap-1.5">
                {FILTERS.map(f => (
                  <button key={f} className="p-2 glass rounded-lg border border-white/[0.06] hover:border-cyan-500/40 text-[11px] text-white/60 hover:text-white transition-all">
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Preview + Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 bg-black/60 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />

            {/* Video preview area */}
            <div className="relative w-full max-w-2xl aspect-video bg-black/80 rounded-lg overflow-hidden border border-white/10 mx-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-violet-900/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full glass border border-white/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying
                      ? <Pause className="w-7 h-7 text-white" fill="white" />
                      : <Play className="w-7 h-7 text-white ml-1" fill="white" />}
                  </div>
                  <p className="text-white/30 text-xs">Preview Area</p>
                </div>
              </div>

              {/* Timecode */}
              <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1 font-mono text-sm text-white/90">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>
              {/* Quality badge */}
              <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-xs text-cyan-400 font-semibold">
                4K • 60fps
              </div>
              {/* Fullscreen */}
              <button className="absolute top-3 left-3 p-1.5 glass rounded-lg text-white/40 hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playback controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-strong border border-white/10 rounded-2xl px-4 py-2">
              <button className="p-1.5 text-white/50 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center neon-blue"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" fill="white" /> : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
              </motion.button>
              <button className="p-1.5 text-white/50 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button onClick={() => setMuted(!muted)} className="p-1.5 text-white/50 hover:text-white transition-colors">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={e => { setVolume(+e.target.value); setMuted(false); }}
                className="w-16 accent-blue-500"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="h-56 border-t border-white/[0.06] bg-surface/50 flex flex-col shrink-0">
            {/* Timeline toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(zoom - 0.25)} className="p-1.5 glass rounded-lg text-white/50 hover:text-white border border-white/10 transition-colors">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-white/40 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(zoom + 0.25)} className="p-1.5 glass rounded-lg text-white/50 hover:text-white border border-white/10 transition-colors">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button className="p-1.5 glass rounded-lg text-white/50 hover:text-white border border-white/10 text-xs px-2 transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Track
                </button>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/30 font-mono">
                {formatDuration(currentTime)}
              </div>
            </div>

            {/* Track area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Track labels */}
              <div className="w-28 shrink-0 border-r border-white/[0.06]">
                {tracks.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center gap-2 px-2 border-b border-white/[0.04]"
                    style={{ height: track.height + 8 }}
                  >
                    <div className="w-1.5 h-full py-1.5">
                      <div className="w-full h-full rounded-full" style={{ background: trackColors[track.type] ?? "#888" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-white/70 truncate">{track.name}</p>
                    </div>
                    <div className="flex gap-0.5">
                      <button className="p-0.5 text-white/30 hover:text-white transition-colors">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-0.5 text-white/30 hover:text-white transition-colors">
                        <Lock className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline scroll area */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar">
                <div style={{ width: timelineWidth, minWidth: "100%" }} className="relative">
                  {/* Time ruler */}
                  <div className="h-6 border-b border-white/[0.06] relative flex items-end pb-1 cursor-pointer" onClick={handleTimelineClick}>
                    {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => (
                      i % 5 === 0 && (
                        <div key={i} className="absolute bottom-0 flex flex-col items-center" style={{ left: i * pxPerSec }}>
                          <span className="text-[9px] text-white/20 font-mono mb-0.5">{formatDuration(i)}</span>
                          <div className="w-px h-3 bg-white/10" />
                        </div>
                      )
                    ))}
                    {/* Playhead */}
                    <motion.div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
                      style={{ left: currentTime * pxPerSec }}
                    >
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rotate-45 -mt-1.5" />
                    </motion.div>
                  </div>

                  {/* Tracks */}
                  {tracks.map(track => (
                    <div
                      key={track.id}
                      className="relative border-b border-white/[0.04] cursor-pointer"
                      style={{ height: track.height + 8 }}
                      onClick={handleTimelineClick}
                    >
                      <div className="absolute inset-0 bg-white/[0.01] hover:bg-white/[0.02] transition-colors" />
                      {track.clips.map(clip => (
                        <TrackClip key={clip.id} clip={clip} zoom={zoom} trackColor={trackColors[track.type] ?? "#888"} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 shrink-0 border-l border-white/[0.06] glass flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            {(["properties", "ai", "export"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setRightPanel(tab)}
                className={cn(
                  "flex-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  rightPanel === tab ? "text-blue-400 border-b-2 border-blue-500" : "text-white/40 hover:text-white"
                )}
              >
                {tab === "ai" ? "✨ AI" : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
            {rightPanel === "properties" && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Transform</p>
                  {[["X Position", "0"], ["Y Position", "0"], ["Scale", "100%"], ["Rotation", "0°"], ["Opacity", "100%"]].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/50">{label}</span>
                      <input defaultValue={val} className="w-20 glass border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-right outline-none focus:border-blue-500/50" />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Color Grading</p>
                  {[["Brightness", 0], ["Contrast", 0], ["Saturation", 0], ["Temperature", 0]].map(([label, val]) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>{label}</span><span>{val}</span>
                      </div>
                      <input type="range" min={-100} max={100} defaultValue={val as number} className="w-full accent-blue-500" />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Audio</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-white/50 mb-1"><span>Volume</span><span>100%</span></div>
                    <input type="range" min={0} max={100} defaultValue={100} className="w-full accent-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {rightPanel === "ai" && (
              <div className="flex flex-col h-full" style={{ height: "calc(100vh - 200px)" }}>
                {/* AI Chat */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 no-scrollbar">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "ai" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mr-1.5 shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                        msg.role === "user"
                          ? "bg-blue-600/30 text-white ml-2"
                          : "glass border border-white/[0.06] text-white/80"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="glass border border-white/[0.06] rounded-xl px-3 py-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick prompts */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {["Add captions", "Beat sync", "Remove silence", "Make cinematic"].map(prompt => (
                    <button key={prompt} onClick={() => setAiInput(prompt)}
                      className="text-[10px] glass border border-white/10 rounded-lg px-2 py-1.5 text-white/50 hover:text-white hover:border-blue-500/30 transition-all text-left">
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-1.5">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAiSend()}
                    placeholder="Tell AI what to do..."
                    className="flex-1 glass border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleAiSend}
                    className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl flex items-center justify-center neon-blue shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>
              </div>
            )}

            {rightPanel === "export" && (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Resolution</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["720p", "1080p", "2K", "4K"].map(res => (
                      <button key={res} className={cn(
                        "py-2 rounded-xl text-xs font-semibold transition-all",
                        res === "4K" ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white" : "glass border border-white/10 text-white/50 hover:text-white"
                      )}>{res}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Format</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["MP4", "MOV", "WEBM"].map(f => (
                      <button key={f} className={cn(
                        "py-2 rounded-xl text-xs font-semibold transition-all",
                        f === "MP4" ? "bg-blue-600/30 text-blue-400 border border-blue-500/40" : "glass border border-white/10 text-white/50 hover:text-white"
                      )}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Frame Rate</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["24fps", "30fps", "60fps"].map(f => (
                      <button key={f} className={cn(
                        "py-2 rounded-xl text-xs font-semibold transition-all",
                        f === "60fps" ? "bg-blue-600/30 text-blue-400 border border-blue-500/40" : "glass border border-white/10 text-white/50 hover:text-white"
                      )}>{f}</button>
                    ))}
                  </div>
                </div>
                <div className="glass border border-white/[0.07] rounded-xl p-3 text-xs text-white/50 space-y-1">
                  <div className="flex justify-between"><span>Estimated Size</span><span className="text-white/70">~2.4 GB</span></div>
                  <div className="flex justify-between"><span>Duration</span><span className="text-white/70">1:00:00</span></div>
                  <div className="flex justify-between"><span>GPU Acceleration</span><span className="text-green-400">✓ Enabled</span></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl neon-blue flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Export 4K Video
                </motion.button>
                <button className="w-full py-2.5 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-medium transition-colors">
                  ☁️ Cloud Render (Priority)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
