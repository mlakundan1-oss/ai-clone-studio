// Core Types for Ai Clone Studio

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "studio" | "enterprise";
  aiCredits: number;
  storageUsed: number;
  storageLimit: number;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  thumbnail?: string;
  duration: number;
  status: "draft" | "rendering" | "complete" | "failed";
  resolution: "720p" | "1080p" | "2k" | "4k";
  fps: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  collaborators?: string[];
  tags?: string[];
}

export interface VideoClip {
  id: string;
  name: string;
  src: string;
  duration: number;
  startTime: number;
  endTime: number;
  trackIndex: number;
  type: "video" | "audio" | "image" | "text" | "overlay";
  effects?: Effect[];
  keyframes?: Keyframe[];
  volume?: number;
  opacity?: number;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

export interface Track {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "effects";
  clips: VideoClip[];
  muted: boolean;
  locked: boolean;
  visible: boolean;
  height: number;
}

export interface Effect {
  id: string;
  type: string;
  name: string;
  params: Record<string, unknown>;
}

export interface Keyframe {
  time: number;
  property: string;
  value: unknown;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface AIGeneration {
  id: string;
  type: "video" | "avatar" | "voice" | "caption" | "thumbnail";
  prompt: string;
  status: "pending" | "processing" | "complete" | "failed";
  progress: number;
  result?: string;
  creditsUsed: number;
  createdAt: Date;
}

export interface ExportJob {
  id: string;
  projectId: string;
  resolution: "720p" | "1080p" | "2k" | "4k";
  format: "mp4" | "mov" | "webm";
  fps: 24 | 30 | 60;
  status: "queued" | "processing" | "complete" | "failed";
  progress: number;
  fileSize?: number;
  downloadUrl?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer" | "commenter";
  joinedAt: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  description: string;
  features: string[];
  aiCredits: number;
  storage: string;
  resolution: string;
  popular?: boolean;
  color: string;
}

export interface Template {
  id: string;
  name: string;
  category: "youtube" | "shorts" | "reels" | "podcast" | "cinematic";
  thumbnail: string;
  duration: number;
  resolution: string;
  premium: boolean;
}
