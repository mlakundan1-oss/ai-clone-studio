"use client";

import React from "react";

import {
  Scissors,
  ZoomIn,
  ZoomOut,
  Layers3,
  Video,
} from "lucide-react";

interface VideoItem {
  id: string;
  file: File;
  url: string;
}

interface TimelineProps {
  videos: VideoItem[];
}

export default function Timeline({
  videos,
}: TimelineProps) {
  return (
    <div className="w-full h-[240px] bg-[#09090b] border-t border-white/10 p-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10">
            <Scissors className="text-white w-4 h-4" />
          </button>

          <button className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10">
            <ZoomIn className="text-white w-4 h-4" />
          </button>

          <button className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10">
            <ZoomOut className="text-white w-4 h-4" />
          </button>

          <button className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10">
            <Layers3 className="text-white w-4 h-4" />
          </button>
        </div>

        <div className="text-white/40 text-sm">
          AI Timeline Editor
        </div>
      </div>

      <div className="relative h-[150px] rounded-3xl overflow-y-auto border border-white/10 bg-[#111116] p-4 space-y-4">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={video.id}
              className="h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 flex items-center px-5 shadow-lg shadow-violet-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center">
                  <Video className="text-white w-5 h-5" />
                </div>

                <div>
                  <p className="text-white font-medium truncate max-w-[250px]">
                    {video.file.name}
                  </p>

                  <p className="text-white/50 text-xs">
                    Track {index + 1}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            Upload media to create timeline
          </div>
        )}
      </div>
    </div>
  );
}