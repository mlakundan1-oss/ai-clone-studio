"use client";

import React, { useRef, useState } from "react";

import {
  Pause,
  Play,
  Volume2,
  Maximize2,
} from "lucide-react";

interface VideoItem {
  id: string;
  url: string;
  file: File;
}

interface VideoPreviewProps {
  videos: VideoItem[];
}

export default function VideoPreview({
  videos,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(false);

  const currentVideo = videos[0];

  const togglePlay = async () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      await videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-[30px] overflow-hidden border border-white/10">
      {currentVideo ? (
        <>
          <video
            ref={videoRef}
            key={currentVideo.id}
            src={currentVideo.url}
            className="w-full h-full object-contain"
            preload="metadata"
          />

          <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-sm">
            4K • 60FPS
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-5 px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10">
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 transition flex items-center justify-center"
              >
                {playing ? (
                  <Pause className="text-white" />
                ) : (
                  <Play className="text-white ml-1" />
                )}
              </button>

              <button className="text-white/70 hover:text-white">
                <Volume2 />
              </button>

              <button className="text-white/70 hover:text-white">
                <Maximize2 />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/30 text-xl">
          Upload Video To Preview
        </div>
      )}
    </div>
  );
}