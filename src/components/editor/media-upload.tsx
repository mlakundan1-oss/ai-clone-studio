"use client";

import React, { useRef, useState } from "react";
import { Upload, Film, Sparkles } from "lucide-react";

interface UploadedVideo {
  id: string;
  file: File;
  url: string;
}

interface MediaUploadProps {
  onVideoUpload: (videos: UploadedVideo[]) => void;
}

export default function MediaUpload({ onVideoUpload }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = (files: FileList) => {
    const videoFiles: UploadedVideo[] = Array.from(files)
      .filter((file) => file.type.startsWith("video/"))
      .map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) }));

    if (videoFiles.length > 0) onVideoUpload(videoFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#050307] to-[#07070a] border-r border-white/8 p-4">
      <div className="flex items-center gap-3 mb-5">
        <Sparkles className="text-violet-400 w-5 h-5" />
        <h2 className="text-white font-semibold text-lg tracking-tight">Media Library</h2>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`relative h-[190px] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
          dragging
            ? "border-violet-400 bg-violet-600/6 scale-[1.01] shadow-[0_20px_40px_rgba(124,58,237,0.06)]"
            : "border-white/8 bg-[rgba(255,255,255,0.02)]"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/6 to-blue-500/6 backdrop-blur-sm" />

        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-700/10 to-transparent flex items-center justify-center border border-violet-500/10">
          <Upload className="text-violet-300 w-10 h-10" />
        </div>

        <h2 className="relative z-10 text-white text-lg font-semibold mt-4">Drag & Drop Videos</h2>

        <p className="relative z-10 text-white/40 mt-2 text-sm">Upload multiple videos · MP4, MOV, WEBM</p>

        <button className="relative z-10 mt-5 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition text-white shadow-md">
          Browse Media
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files);
          }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {["Intro Clip", "Main Clip", "Outro"].map((item, index) => (
          <div key={index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 hover:border-violet-500/20 transition flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-700/8 to-transparent flex items-center justify-center shadow-sm">
              <Film className="text-violet-300 w-5 h-5" />
            </div>

            <div className="flex-1">
              <p className="text-white font-medium truncate">{item}</p>
              <p className="text-white/40 text-xs">Video Layer</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
