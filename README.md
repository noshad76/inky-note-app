<p align="center">
  <img src="./src/app/favicon.ico" alt="Inky logo" width="72" height="72" />
</p>

<h1 align="center">Inky</h1>

<p align="center">
  A modern, local-first note-taking app with a rich writing experience, bilingual layouts, and optional cloud sync.
</p>

<p align="center">
  <strong>Next.js</strong> · <strong>React</strong> · <strong>TypeScript</strong> · <strong>Tiptap</strong> · <strong>Dexie</strong> · <strong>Tailwind CSS</strong>
</p>

## Overview

Inky is a polished note-taking workspace designed for focused writing. It combines a responsive notes interface, a full-featured rich-text editor, IndexedDB-powered local persistence, and API-backed authentication/synchronization flows. The app supports English and Persian locales, including right-to-left layouts and text-direction handling for mixed-language writing.

## Preview

![Inky editor in dark mode](./screenshots/Screenshot%202026-05-17%20031039.png)

![Inky editor in light mode](./screenshots/Screenshot%202026-05-17%20031116.png)

![Inky empty state](./screenshots/Screenshot%202026-05-17%20031127.png)

![Inky Persian RTL layout](./screenshots/Screenshot%202026-05-17%20031142.png)

## Features

- **Rich-text editing:** Built with Tiptap and support for headings, lists, tasks, blockquotes, tables, highlights, code blocks, typography, colors, and inline formatting.
- **Local-first notes:** Stores notes in IndexedDB through Dexie so writing remains fast and available in the browser.
- **Cloud sync flow:** Tracks pending/synced notes and communicates with authenticated note push/pull API routes.
- **Authentication:** Includes login and signup screens with React Hook Form, Zod validation, token storage, and API integration.
- **Internationalization:** Uses `next-intl` for English and Persian translations with locale-aware routing and RTL support.
- **Responsive workspace:** Adapts between desktop sidebar/editor layouts and mobile-focused editing flows.
- **Theme-ready UI:** Uses Tailwind CSS, custom fonts, and theme providers for a refined light/dark interface.
- **Developer tooling:** Includes Biome for linting/formatting and TypeScript path aliases for clean imports.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript, React 19
- **Styling:** Tailwind CSS 4, custom global CSS, `tailwind-merge`, `clsx`, `class-variance-authority`
- **Editor:** Tiptap, Lowlight, Highlight.js
- **State & data:** Zustand, TanStack Query, Dexie, Dexie React Hooks
- **Forms & validation:** React Hook Form, Zod
- **Internationalization:** `next-intl`
- **HTTP:** Axios
- **Animation & feedback:** GSAP, Sonner, Lucide React
- **Desktop-related tooling:** Tauri project artifacts under `src-tauri`, plus Electron dependencies in `package.json`
- **Tooling:** Biome, Prettier, TypeScript

## Project Structure

```text
.
├── public/                 # Static assets and fonts
├── screenshots/            # README and product screenshots
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   ├── features/           # Feature modules for auth and notes
│   ├── i18n/               # Locale routing and request config
│   ├── lib/                # API client, DB, env, storage, utilities
│   ├── messages/           # English and Persian translations
│   └── share/              # Shared UI and stores
├── src-tauri/              # Tauri-generated schemas/build artifacts
├── next.config.ts          # Next.js and next-intl configuration
├── biome.json              # Linting and formatting rules
└── package.json            # Scripts and dependencies
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A running backend API compatible with the configured auth and notes routes

The frontend expects an API base URL through `NEXT_PUBLIC_API_BASE_URL` and falls back to `http://localhost:3500` in the Axios client. Because `src/lib/env.config.ts` validates this value, define it before starting the app.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/noshad76/inky-note-app.git
   cd inky
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file:

   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3500" > .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the app:

   ```text
   http://localhost:3000
   ```

## Available Scripts

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run Biome checks
npm run format   # Format files with Biome
```

## Usage

1. Start the backend API and set `NEXT_PUBLIC_API_BASE_URL` to its base URL.
2. Run `npm run dev` and visit `http://localhost:3000`.
3. Sign up or log in to enable authenticated sync.
4. Create a note from the sidebar or empty state.
5. Write using the editor toolbar for formatting, lists, tasks, tables, code blocks, and alignment.
6. Use English or Persian routes/locales to work in LTR or RTL layouts.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for authentication and note synchronization API requests. |

## API Expectations

The app is configured to call the following endpoints relative to `NEXT_PUBLIC_API_BASE_URL`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /notes/push`
- `POST /notes/pull`
- `GET /notes`

## Contributing

Contributions are welcome. Please keep changes focused and consistent with the existing feature-based structure.

1. Fork the repository and create a feature branch.
2. Install dependencies with `npm install`.
3. Make your changes in `src/`, keeping shared logic in `src/lib` or `src/share` where appropriate.
4. Run `npm run lint` and `npm run build` before opening a pull request.
5. Include screenshots or notes for UI changes.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
