"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Scissors,
  Undo2,
  Redo2,
  Layers,
  Download,
  ChevronLeft,
  Plus,
  Lock,
  Eye,
  Music,
  Type,
  Image,
  Video,
  Maximize2,
  Save,
  Share2,
  Zap,
} from "lucide-react";

import Link from "next/link";

import MediaUpload from "../../components/editor/media-upload";

import { useEditorStore } from "@/store/editor-store";

import { formatDuration, cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", icon: Layers, label: "Select" },
  { id: "cut", icon: Scissors, label: "Cut" },
  { id: "text", icon: Type, label: "Text" },
  { id: "audio", icon: Music, label: "Audio" },
  { id: "image", icon: Image, label: "Image" },
];

const EFFECTS = [
  "Fade In",
  "Fade Out",
  "Blur",
  "Glow",
  "Zoom",
  "Pan",
  "Shake",
  "Flash",
];

const TRANSITIONS = [
  "Cut",
  "Dissolve",
  "Wipe",
  "Slide",
  "Zoom",
  "Spin",
];

const FILTERS = [
  "None",
  "Cinematic",
  "Warm",
  "Cool",
  "B&W",
  "Vintage",
];

function TrackClip({
  clip,
  zoom,
  trackColor,
}: {
  clip: any;
  zoom: number;
  trackColor: string;
}) {
  const { selectedClipId, setSelectedClip } =
    useEditorStore();

  const isSelected = selectedClipId === clip.id;

  return (
    <motion.div
      drag="x"
      dragMomentum={false}
      transition={{ type: "spring", stiffness: 450, damping: 35 }}
      onClick={() => setSelectedClip(clip.id)}
      whileHover={{ scaleY: 1.05 }}
      className={cn(
        "absolute top-1 bottom-1 rounded-md cursor-pointer transition-all overflow-hidden border transform-gpu",
        "shadow-2xl/5",
        isSelected
          ? "border-white/60 ring-1 ring-white/30 scale-[1.02]"
          : "border-transparent hover:border-white/20 hover:scale-[1.01]"
      )}
      style={{
        left: `${clip.startTime * zoom * 20}px`,
        width: `${clip.duration * zoom * 20}px`,
        background: `linear-gradient(135deg, ${trackColor}60, ${trackColor}30)`,
        minWidth: 50,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />

      <div className="px-2 py-1 flex items-center gap-1 h-full">
        <div
          className="w-1 h-full opacity-40 rounded-full"
          style={{
            background: trackColor,
          }}
        />

        <span className="text-[10px] text-white/80 truncate font-medium">
          {clip.name}
        </span>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20" />

      <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20" />
    </motion.div>
  );
}

export default function EditorPage() {
  const {
    tracks,
    currentTime,
    duration,
    isPlaying,
    zoom,
    currentVideo,
    setCurrentTime,
    setIsPlaying,
    setZoom,
    setCurrentVideo,
    setDuration,
    addClip,
    updateClip,
    undo,
    redo,
  } = useEditorStore();

  const [volume, setVolume] = useState(80);

  const [videos, setVideos] = useState<any[]>([]);
  const RP: any = ReactPlayer;
  const handleVideoUpload = (newVideos: any[]) => {
    // add to local list
    setVideos((prev) => {
      const merged = [...prev, ...newVideos];

      // set first uploaded video as current preview
      if (merged.length > 0) {
        setCurrentVideo(merged[0].url);
      }

      return merged;
    });

    // create clips on the video track and read durations
    newVideos.forEach((v: any, idx: number) => {
      const clip = {
        id: v.id,
        name: v.file?.name || `Video ${v.id}`,
        startTime: 0,
        duration: 10,
        src: v.url,
      } as any;

      addClip("video-track", clip);

      // read actual duration using a temporary video element
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.src = v.url;
      vid.onloadedmetadata = () => {
        const d = vid.duration || 10;
        updateClip("video-track", v.id, { duration: d });

        // extend project duration if needed
        setDuration(Math.max(duration, d + 0));
        // revoke object URL later when appropriate
      };
    });
  };

  const [muted, setMuted] = useState(false);

  const [activeTool, setActiveTool] =
    useState("select");

  const [leftPanel, setLeftPanel] = useState<
    "media" | "effects" | "transitions" | "filters"
  >("media");

  const [rightPanel, setRightPanel] = useState<
    "properties" | "ai" | "export"
  >("properties");

  const [aiInput, setAiInput] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  const [aiMessages, setAiMessages] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "ai",
      text: "Hi! I'm your AI editing assistant.",
    },
  ]);

  const timelineRef = useRef<HTMLDivElement>(null);

  const trackColors: Record<string, string> = {
    video: "#2563eb",
    audio: "#06b6d4",
    text: "#7c3aed",
  };

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      if (!timelineRef.current) return;

      const rect =
        timelineRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;

      const newTime = Math.max(
        0,
        Math.min(duration, x / (zoom * 20))
      );

      setCurrentTime(newTime);
    },
    [duration, zoom, setCurrentTime]
  );

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;

    const msg = aiInput.trim();

    setAiInput("");

    setAiMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: msg,
      },
    ]);

    setAiLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    setAiMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `✅ Applied "${msg}" successfully.`,
      },
    ]);

    setAiLoading(false);
  };

  const pxPerSec = zoom * 20;

  const timelineWidth = Math.max(
    duration * pxPerSec,
    800
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-neutral-950 via-black to-neutral-900 overflow-hidden text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/6 backdrop-blur-sm bg-black/40">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 rounded-lg hover:bg-white/5">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>

          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />

            <input
              defaultValue="AI Clone Studio"
              className="bg-transparent outline-none text-sm font-semibold"
            />
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 bg-white/3 rounded-2xl p-1.5 border border-white/6 shadow-sm">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() =>
                setActiveTool(tool.id)
              }
              className={cn(
                "p-2 rounded-lg transition transform-gpu duration-200",
                activeTool === tool.id
                  ? "bg-gradient-to-br from-blue-700/30 to-violet-700/20 text-blue-300 ring-1 ring-white/10"
                  : "text-white/40 hover:text-white/90 hover:bg-white/5 hover:scale-105"
              )}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            onClick={undo}
            className="p-2 text-white/40 hover:text-white"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            className="p-2 text-white/40 hover:text-white"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-white/5 flex items-center gap-2 bg-white/2 border border-white/6">
            <Save className="w-4 h-4" />
            Save
          </button>

          <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-white/5 flex items-center gap-2 bg-white/2 border border-white/6">
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={() =>
              setRightPanel("export")
            }
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 font-semibold flex items-center gap-2 shadow-[0_12px_30px_rgba(79,70,229,0.18)]"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left */}
        <div className="w-72 border-r border-white/10 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {[
              "media",
              "effects",
              "transitions",
              "filters",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setLeftPanel(tab as any)
                }
                className={cn(
                  "flex-1 py-3 text-[10px] uppercase font-semibold",
                  leftPanel === tab
                    ? "text-blue-400 border-b-2 border-blue-500"
                    : "text-white/40"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {leftPanel === "media" && (
              <div className="space-y-3">
                <MediaUpload onVideoUpload={handleVideoUpload} />

                {tracks[0]?.clips?.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => clip.src && setCurrentVideo(clip.src)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-violet-500/20"
                  >
                    <p className="text-xs font-medium">
                      {clip.name}
                    </p>

                    <p className="text-[10px] text-white/40">
                      Video Clip
                    </p>
                  </div>
                ))}
              </div>
            )}

            {leftPanel === "effects" && (
              <div className="grid grid-cols-2 gap-2">
                {EFFECTS.map((effect) => (
                  <button
                    key={effect}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                  >
                    {effect}
                  </button>
                ))}
              </div>
            )}

            {leftPanel === "transitions" && (
              <div className="grid grid-cols-2 gap-2">
                {TRANSITIONS.map((transition) => (
                  <button
                    key={transition}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                  >
                    {transition}
                  </button>
                ))}
              </div>
            )}

            {leftPanel === "filters" && (
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
            <div className="relative w-full max-w-5xl aspect-video bg-gradient-to-br from-black via-neutral-900 to-black rounded-xl overflow-hidden border border-white/8 shadow-2xl">
              {currentVideo ? (
                <RP
                  url={currentVideo || videos[0]?.url || ""}
                  playing={Boolean(currentVideo) && isPlaying}
                  controls
                  width="100%"
                  height="100%"
                  volume={muted ? 0 : volume / 100}
                  playsinline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  Upload Video To Preview
                </div>
              )}

              {/* Time */}
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 rounded-lg text-sm">
                {formatDuration(currentTime)} /{" "}
                {formatDuration(duration)}
              </div>

              {/* Quality */}
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 rounded-lg text-xs text-cyan-400">
                4K • 60fps
              </div>

              {/* Fullscreen */}
              <button className="absolute top-3 left-3 p-2 rounded-lg bg-black/50 hover:bg-black/40 backdrop-blur-sm shadow-md">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Playback */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl px-4 py-2">
              <button className="p-2">
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setIsPlaying(!isPlaying)
                }
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center transform-gpu transition-transform duration-200 hover:scale-105 shadow-[0_8px_30px_rgba(79,70,229,0.25)]"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              <button className="p-2">
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/10 mx-1" />

              <button
                onClick={() =>
                  setMuted(!muted)
                }
                className="p-2"
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(+e.target.value);
                  setMuted(false);
                }}
                className="w-20 accent-blue-500"
              />
            </div>
          </div>
          {/* Timeline */}
          <div className="h-40 border-t border-white/10 bg-[#050506] p-3 overflow-auto">
            <div
              ref={timelineRef}
              onClick={handleTimelineClick}
              className="relative h-full"
              style={{ width: timelineWidth }}
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="relative mb-2 h-10"
                  style={{ height: track.height }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-24 px-2 flex items-center text-xs text-white/60">
                    {track.name}
                  </div>

                  <div className="absolute left-24 right-0 top-0 bottom-0">
                    <div className="relative h-full">
                      {track.clips.map((clip) => (
                        <TrackClip
                          key={clip.id}
                          clip={clip}
                          zoom={zoom}
                          trackColor={trackColors[track.type] || "#999"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          {/* Timeline */}
          <div className="h-48 border-t border-white/8 bg-gradient-to-tr from-neutral-900 to-black p-4">
            <div className="relative overflow-auto rounded-xl bg-[linear-gradient(180deg,#0b0b0d,rgba(255,255,255,0.02))] p-3" style={{ minWidth: 800 }}>
              <div
                ref={timelineRef}
                onClick={handleTimelineClick}
                className="relative h-36"
                style={{ width: timelineWidth }}
              >
                {/* grid background */}
                <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 60px)' }} />

                {/* playhead */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-400/80"
                  style={{ left: `${currentTime * pxPerSec}px`, transform: "translateX(-0.5px)" }}
                />

                {tracks.map((track) => (
                  <div key={track.id} className="relative mb-2 h-10" style={{ height: track.height }}>
                    <div className="absolute left-0 top-0 bottom-0 w-28 px-3 flex items-center text-xs text-white/60">
                      {track.name}
                    </div>

                    <div className="absolute left-28 right-0 top-0 bottom-0">
                      <div className="relative h-full">
                        {track.clips.map((clip) => (
                          <TrackClip key={clip.id} clip={clip} zoom={zoom} trackColor={trackColors[track.type] || "#999"} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}