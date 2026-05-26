import { create } from "zustand";

export interface Clip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  src?: string;
}

export interface Track {
  id: string;
  name: string;
  type: "video" | "audio" | "text";
  height: number;
  clips: Clip[];
}

interface EditorStore {
  tracks: Track[];

  currentTime: number;
  duration: number;
  zoom: number;

  isPlaying: boolean;

  selectedClipId: string | null;

  currentVideo: string;

  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedClip: (id: string) => void;

  setCurrentVideo: (src: string) => void;
  setDuration: (d: number) => void;
  updateClip: (
    trackId: string,
    clipId: string,
    patch: Partial<Clip>
  ) => void;

  addClip: (trackId: string, clip: Clip) => void;

  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  tracks: [
    {
      id: "video-track",
      name: "Video 1",
      type: "video",
      height: 56,

      clips: [
        {
          id: "clip-1",
          name: "Intro Clip",
          startTime: 0,
          duration: 10,
        },

        {
          id: "clip-2",
          name: "Main Content",
          startTime: 12,
          duration: 18,
        },
      ],
    },

    {
      id: "audio-track",
      name: "Music",
      type: "audio",
      height: 42,

      clips: [
        {
          id: "music-1",
          name: "Background Music",
          startTime: 0,
          duration: 35,
        },
      ],
    },
  ],

  currentTime: 0,
  duration: 60,
  zoom: 1,

  isPlaying: false,

  selectedClipId: null,

  currentVideo: "",

  setCurrentTime: (time) =>
    set({
      currentTime: time,
    }),

  setIsPlaying: (playing) =>
    set({
      isPlaying: playing,
    }),

  setZoom: (zoom) =>
    set({
      zoom: Math.max(0.5, Math.min(zoom, 5)),
    }),

  setSelectedClip: (id) =>
    set({
      selectedClipId: id,
    }),

  setCurrentVideo: (src) =>
    set({
      currentVideo: src,
    }),

  setDuration: (d) =>
    set({
      duration: d,
    }),

  updateClip: (trackId, clipId, patch) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              clips: track.clips.map((c) =>
                c.id === clipId ? { ...c, ...patch } : c
              ),
            }
          : track
      ),
    })),

  addClip: (trackId, clip) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? {
              ...track,
              clips: [...track.clips, clip],
            }
          : track
      ),
    })),

  undo: () => {
    console.log("Undo");
  },

  redo: () => {
    console.log("Redo");
  },
}));