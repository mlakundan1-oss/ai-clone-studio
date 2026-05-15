# 🚀 Ai Clone Studio

> **Create Videos at the Speed of AI** — A next-generation AI video creation and editing platform.

![Ai Clone Studio](https://img.shields.io/badge/Ai%20Clone%20Studio-v1.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

- 🎬 **Professional Video Editor** — Multi-track timeline, effects, transitions
- 🤖 **AI Video Generator** — Text-to-video with multiple styles
- 👤 **AI Avatar Studio** — Talking avatars with lip sync
- 🎙️ **Voice Clone Studio** — Clone any voice, multi-language dubbing
- 📝 **AI Caption Generator** — Auto subtitles with TikTok-style animations
- 🖼️ **AI Thumbnail Generator** — Viral YouTube thumbnails
- 👥 **Team Workspace** — Real-time collaboration
- 📊 **Analytics Dashboard** — Project stats and insights

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| State | Zustand |
| Icons | Lucide React |
| Charts | Recharts |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# 1. Clone or extract the project
cd ai-clone-studio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
ai-clone-studio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   ├── dashboard/          # Dashboard + Projects
│   │   ├── editor/             # Professional video editor
│   │   ├── ai-studio/          # AI video generator
│   │   ├── avatar-studio/      # AI avatar creator
│   │   ├── voice-studio/       # Voice cloning
│   │   ├── captions/           # AI caption generator
│   │   ├── thumbnails/         # AI thumbnail generator
│   │   ├── workspace/          # Team collaboration
│   │   └── pricing/            # Pricing page
│   │
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── landing/            # Hero, Features, Pricing, etc.
│   │   └── dashboard/          # Sidebar, Topbar
│   │
│   ├── store/                  # Zustand state management
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global CSS
│
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🌐 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing |
| `/dashboard` | Main dashboard with analytics |
| `/dashboard/projects` | All projects grid/list view |
| `/editor` | Professional multi-track video editor |
| `/ai-studio` | AI video generation studio |
| `/avatar-studio` | AI talking avatar creator |
| `/voice-studio` | Voice cloning & dubbing |
| `/captions` | Auto caption generator |
| `/thumbnails` | AI thumbnail generator |
| `/workspace` | Team collaboration |
| `/pricing` | Pricing plans |

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify

```bash
npm run build
# Upload .next folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎨 Design System

- **Background**: `#0b0f19`
- **Surface**: `#111827`
- **Primary**: `#2563eb` (Electric Blue)
- **Accent**: `#7c3aed` (Purple)
- **Cyan**: `#06b6d4`
- **Font**: DM Sans + Orbitron (headings)

---

## 📝 License

MIT © 2025 Ai Clone Studio
