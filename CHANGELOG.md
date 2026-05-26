# Changelog

## Unreleased

### Added
- feat: Ultra Pro AI Video Editor with multi-upload timeline preview system
  - Multi-video upload and drag & drop support
  - Timeline rendering with tracks and `TrackClip` components
  - Live preview wired to `currentVideo` in editor store
  - Duration detection for uploaded videos (via temporary video element)
  - Premium dark UI polish: glassmorphism, gradients, shadows, refined controls
  - ESLint config and lint fixes

### Files changed
- `src/app/editor/page.tsx` — editor UI, timeline, preview wiring
- `src/components/editor/media-upload.tsx` — polished media upload UI and DnD
- `src/store/editor-store.ts` — new store methods: `setDuration`, `updateClip`
- `src/components/landing/TestimonialsSection.tsx` — lint fix
- `.eslintrc.json`, `.eslintignore`

### How to test locally
1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open `http://localhost:3000/editor` and:
- Drag & drop multiple video files into the Media Library.
- Click uploaded clips in the left panel to preview.
- Observe timeline tracks and playhead; play/pause controls should work.

### Notes & Next steps
- Implement clip trimming UI (drag handles to update `startTime`/`duration`).
- Revoke object URLs on removal/unload to avoid memory leaks.
- Add FFmpeg export scaffolding and tests.
- Commit changes with a descriptive message and push to remote.
