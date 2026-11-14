# LearnWise Next.js Frontend v0.2

This is a real Next.js App Router frontend for the existing LearnWise FastAPI backend.

## Requirements
- Node.js 20.9+
- npm
- Existing FastAPI backend running at http://127.0.0.1:8000
- Ollama running for chat and quiz generation

## Run
```powershell
npm install
Copy-Item .env.local.example .env.local
npm run dev
```
Open http://localhost:3000.

Run the Python backend separately from your existing backend folder:
```powershell
uvicorn app.main:app --reload --port 8000
```

The frontend calls the existing endpoints:
- GET /api/documents
- POST /api/documents
- POST /api/chat
- POST /api/quiz

Your existing FastAPI app currently enables CORS with `CORS(app)`, which allows the Next.js development origin. If you tighten CORS later, allow `http://localhost:3000`.

The Next.js frontend does not implement AI logic. Ollama, embeddings, FAISS, RAG and SQLite remain in Python.


## v0.3.1 UI refinements
- Added a working Light/Dark theme switch. Theme preference is saved in localStorage.
- Fixed horizontal overflow and constrained desktop layout to viewport width.
- Scrollbars are visually hidden while scrolling remains available.
- Improved dark theme surface, text, input, card and navigation contrast.


## v0.3.2 AI Tutor refresh
- Added GSAP entrance animations for page sections and cards.
- Added an interactive AI Tutor welcome experience, prompt shortcuts, animated typing state, clearer source toggle, and responsive composer.
- Added auto-scroll to the latest chat message and auto-growing prompt field.
- Install the new dependency with `npm install` after replacing the project files.


## v0.3.3 — Three.js AI Tutor orb
- Added a lightweight procedural Three.js orb to the AI Tutor welcome state.
- Includes pointer-responsive rotation, a glowing icosahedron core, orbit rings and ambient particles.
- Uses no external 3D models, textures, image assets or paid APIs.
- WebGL is initialized only in the browser and gracefully falls back to a CSS mark if unavailable.
- The scene respects reduced-motion preferences, caps pixel ratio for performance, and disposes GPU resources on unmount.
- Run `npm install` after replacing the frontend files.


## v0.3.4 — Contrast + 3D visual refresh
- Reworked the light theme with a lavender-tinted canvas, darker typography, clearer borders, stronger card surfaces and shadows.
- Added an interactive Three.js hero sculpture with a faceted crystal, two orbital rings, floating geometric objects and particles.
- The hero sculpture responds gently to pointer movement and respects reduced-motion preferences.
- Kept the existing AI Tutor Three.js orb, GSAP transitions, backend endpoints and theme switch.
- Dependencies: `three` and `@types/three`.
- Run `npm install` after replacing the project files, then `npm run dev`.


## v0.3.5 — Gen Z contrast and typography
- Reduced the washed-out appearance of the light theme using a deeper lavender-gray canvas, more saturated purple accents and stronger text contrast.
- Increased key UI font sizes across navigation, cards, prompts, chat messages and composer controls.
- Strengthened card borders, surface separation and shadows.
- Preserved the dark theme and existing Three.js scenes.
- No new dependencies.


## v0.3.6 — Focus mode conversations
- Removed the initial page-load auto-scroll. The conversation only scrolls when a new message is added.
- After the first sent prompt, the AI Tutor switches into a full-height focused chat layout.
- Hides the landing hero, suggestion cards and tutor intro during an active conversation.
- Keeps the navigation sidebar and compact top bar available.
- Chat history scrolls inside the conversation panel; the composer stays at the bottom.
- Starting a new chat clears the conversation and restores the landing experience.


## v0.3.7 — Frontend architecture refactor
The previous large page component has been split into reusable components, a feature hook, API helpers and shared types.

### Structure
- `app/page.tsx`: application composition and page-level GSAP/scroll effects only.
- `components/layout/`: sidebar and top navigation.
- `components/tutor/`: AI tutor landing and chat experience.
- `components/library/`: document library and upload UI.
- `components/quiz/`: quiz builder and results UI.
- `app/components/`: Three.js scenes (`AiOrb`, `LearningScene`).
- `hooks/useLearnWise.ts`: application state and user workflows.
- `lib/api.ts`: FastAPI request helpers.
- `types/index.ts`: shared TypeScript types.

### Existing behavior retained
- FastAPI endpoints remain `/api/chat`, `/api/documents`, and `/api/quiz`.
- Light/dark theme preference persists in localStorage.
- New chat, fullscreen conversation mode, and message-only auto-scroll remain.
- Three.js scenes and GSAP animations remain.
- No backend changes.
