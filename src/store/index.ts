import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, Project, Track, VideoClip, Notification } from "@/types";

// ─── UI Store ──────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  theme: "dark" | "light";
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  setAiPanelOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    sidebarOpen: true,
    aiPanelOpen: false,
    theme: "dark",
    activeModal: null,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
    setActiveModal: (modal) => set({ activeModal: modal }),
  }))
);

// ─── User Store ─────────────────────────────────────────────
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "demo-user",
        name: "Alex Creator",
        email: "alex@aiclonestudio.com",
        avatar: "",
        plan: "pro",
        aiCredits: 850,
        storageUsed: 12.4,
        storageLimit: 100,
        createdAt: new Date(),
      },
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    { name: "user-store" }
  )
);

// ─── Projects Store ─────────────────────────────────────────
interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  devtools((set) => ({
    projects: [
      {
        id: "1",
        title: "Product Launch Video",
        thumbnail: "",
        duration: 145,
        status: "complete",
        resolution: "4k",
        fps: 60,
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 3600000),
        userId: "demo-user",
        tags: ["product", "marketing"],
      },
      {
        id: "2",
        title: "YouTube Tutorial",
        thumbnail: "",
        duration: 892,
        status: "draft",
        resolution: "1080p",
        fps: 30,
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000),
        userId: "demo-user",
        tags: ["tutorial", "education"],
      },
      {
        id: "3",
        title: "Brand Reel",
        thumbnail: "",
        duration: 30,
        status: "rendering",
        resolution: "1080p",
        fps: 60,
        createdAt: new Date(Date.now() - 3600000 * 2),
        updatedAt: new Date(Date.now() - 1800000),
        userId: "demo-user",
        tags: ["reel", "brand"],
      },
    ],
    activeProject: null,
    setProjects: (projects) => set({ projects }),
    setActiveProject: (project) => set({ activeProject: project }),
    addProject: (project) =>
      set((state) => ({ projects: [project, ...state.projects] })),
    updateProject: (id, updates) =>
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
    deleteProject: (id) =>
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),
  }))
);

// ─── Editor Store ───────────────────────────────────────────
interface EditorState {
  tracks: Track[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoom: number;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  snapToGrid: boolean;
  undoStack: Track[][];
  redoStack: Track[][];
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedClip: (id: string | null) => void;
  addTrack: (track: Track) => void;
  addClipToTrack: (trackId: string, clip: VideoClip) => void;
  removeClip: (trackId: string, clipId: string) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<VideoClip>) => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    tracks: [
      {
        id: "track-video-1",
        name: "Video 1",
        type: "video",
        clips: [
          {
            id: "clip-1",
            name: "Intro Clip",
            src: "",
            duration: 10,
            startTime: 0,
            endTime: 10,
            trackIndex: 0,
            type: "video",
            volume: 1,
            opacity: 1,
          },
          {
            id: "clip-2",
            name: "Main Content",
            src: "",
            duration: 25,
            startTime: 12,
            endTime: 37,
            trackIndex: 0,
            type: "video",
            volume: 1,
            opacity: 1,
          },
        ],
        muted: false,
        locked: false,
        visible: true,
        height: 64,
      },
      {
        id: "track-audio-1",
        name: "Music",
        type: "audio",
        clips: [
          {
            id: "audio-1",
            name: "Background Music",
            src: "",
            duration: 40,
            startTime: 0,
            endTime: 40,
            trackIndex: 1,
            type: "audio",
            volume: 0.6,
          },
        ],
        muted: false,
        locked: false,
        visible: true,
        height: 48,
      },
      {
        id: "track-text-1",
        name: "Captions",
        type: "text",
        clips: [],
        muted: false,
        locked: false,
        visible: true,
        height: 40,
      },
    ],
    currentTime: 0,
    duration: 60,
    isPlaying: false,
    zoom: 1,
    selectedClipId: null,
    selectedTrackId: null,
    snapToGrid: true,
    undoStack: [],
    redoStack: [],
    setCurrentTime: (time) => set({ currentTime: time }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
    setSelectedClip: (id) => set({ selectedClipId: id }),
    addTrack: (track) =>
      set((state) => ({
        tracks: [...state.tracks, track],
        undoStack: [...state.undoStack, state.tracks],
      })),
    addClipToTrack: (trackId, clip) =>
      set((state) => ({
        tracks: state.tracks.map((t) =>
          t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
        ),
        undoStack: [...state.undoStack, state.tracks],
      })),
    removeClip: (trackId, clipId) =>
      set((state) => ({
        tracks: state.tracks.map((t) =>
          t.id === trackId
            ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) }
            : t
        ),
        undoStack: [...state.undoStack, state.tracks],
      })),
    updateClip: (trackId, clipId, updates) =>
      set((state) => ({
        tracks: state.tracks.map((t) =>
          t.id === trackId
            ? {
                ...t,
                clips: t.clips.map((c) =>
                  c.id === clipId ? { ...c, ...updates } : c
                ),
              }
            : t
        ),
      })),
    undo: () => {
      const { undoStack, tracks, redoStack } = get();
      if (!undoStack.length) return;
      const prev = undoStack[undoStack.length - 1];
      set({
        tracks: prev,
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, tracks],
      });
    },
    redo: () => {
      const { redoStack, tracks, undoStack } = get();
      if (!redoStack.length) return;
      const next = redoStack[redoStack.length - 1];
      set({
        tracks: next,
        redoStack: redoStack.slice(0, -1),
        undoStack: [...undoStack, tracks],
      });
    },
  }))
);

// ─── Notifications Store ─────────────────────────────────────
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools((set) => ({
    notifications: [
      {
        id: "1",
        type: "success",
        title: "Export Complete",
        message: "Product Launch Video exported in 4K",
        read: false,
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: "2",
        type: "info",
        title: "AI Generation Ready",
        message: "Your B-roll footage has been generated",
        read: false,
        createdAt: new Date(Date.now() - 3600000),
      },
    ],
    unreadCount: 2,
    addNotification: (n) =>
      set((state) => ({
        notifications: [
          {
            ...n,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date(),
          },
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      })),
    markAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
    markAllRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
    clearAll: () => set({ notifications: [], unreadCount: 0 }),
  }))
);
