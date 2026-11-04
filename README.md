# macOS Portfolio

A portfolio that looks and feels like macOS — Finder, Notes, Terminal, Mail, Preview, System Settings, Spotlight, Quick Look, a working dock, menu bar and Trash.

Everything personal lives in one file, so you can clone it and make it yours in a few minutes.

## Make it yours

1. Clone the repo and install dependencies

   ```bash
   npm install
   npm run dev
   ```

2. Edit [`data/portfolio.json`](data/portfolio.json) — your name, links, experience, projects, awards, skills, wallpapers and the welcome notification.
3. Replace `public/CV.pdf` with your CV (or point `profile.cv` somewhere else).
4. Drop your own wallpapers in `public/wallpapers/` and list them under `system.wallpapers`.

That's it. Every app reads from that file — nothing personal is hardcoded in the components.

### Content reference

The shape of the file is defined by `PortfolioContent` in [`app/lib/content/types.ts`](app/lib/content/types.ts).

| Field                     | Used by                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `site`                    | Browser tab title and description                                           |
| `profile`                 | Contacts card, Notes, Terminal, menu bar, Mail, lock screen                 |
| `profile.links`           | Any link left out is hidden everywhere (`repository` → VS Code in the dock) |
| `experiences`             | Notes, Terminal `experience`, Spotlight                                     |
| `projects`                | Finder (tags become sidebar tags), Spotlight, Terminal                      |
| `awards`, `skills`        | Notes, Terminal                                                             |
| `system.wallpapers`       | System Settings → Wallpaper (`src` image or CSS `gradient`)                 |
| `system.default*`         | First-visit appearance and wallpaper                                        |
| `system.hostname`         | Terminal prompt                                                             |
| `system.browser.homepage` | Safari's start page (falls back to `profile.links.website`)                 |
| `projects[].caseStudy`    | Project pages only — problem, role, architecture, challenges, outcomes      |

Dates use `YYYY-MM` (leave `end` out for a current role).

## Using your own backend

The app never imports the JSON directly. It calls an API through a `ContentSource` ([`app/lib/content/source.ts`](app/lib/content/source.ts)):

```ts
export interface ContentSource {
  load(): Promise<PortfolioContent>;
}
```

By default it fetches `GET /api/portfolio`, a route that serves `data/portfolio.json` and is exported as a static file at build time, so it works on GitHub Pages too.

To use a real backend, return the same `PortfolioContent` shape from any endpoint and set:

```bash
NEXT_PUBLIC_CONTENT_API_URL=https://your-api.example.com/portfolio
```

(Allow CORS from your site's origin.) For anything more custom — auth headers, a CMS SDK, GraphQL — implement `ContentSource` yourself and export it as `contentSource`.

## Reading pages

The desktop is one surface; the same portfolio is also published as plain,
server-rendered HTML so search engines, recruiters and AI assistants can read it
without running JavaScript.

```text
/                 Interactive desktop (client-rendered, unchanged)
/about            Background, focus, skills, links
/projects         Index of every project, plus open-source contributions
/projects/[id]    One case study per project
/experience       Roles and the products shipped in them
/contact          Email, GitHub, LinkedIn, CV
/sitemap.xml      Generated from the same content
/robots.txt
/llms.txt         Generated from the same content
```

- `app/lib/content/archive.ts` merges `experiences[].projects` and `projects`
  into one record per project (deduped by `id`, work projects first), so every
  project has exactly one URL. The sitemap, `llms.txt` and the pages all read it.
- `caseStudy` is optional. Its sections only render when you fill them in, and
  they live on the project page — the desktop apps keep using `description`.
- Each route sets its own canonical URL and Open Graph tags via
  `pageMetadata()` in `app/lib/content/seo.ts`; the homepage uses the defaults
  in `app/layout.tsx`. `SITE_URL` comes from `profile.links.website`.
- Structured data is `Person` on the homepage and `SoftwareApplication` /
  `SoftwareSourceCode` on each project page — only facts already on the page.

## Development

```bash
npm run dev          # start the dev server
npm run check        # lint, typecheck, formatting and tests — what CI runs
npm test             # unit tests (Vitest)
npm run format       # format with Prettier
```

### Test on your phone

Run `npm run dev:mobile`, then connect your phone and computer to the same Wi-Fi. Open `http://<computer-LAN-IP>:3000` on your phone (use the port printed by Next.js if 3000 is busy). On Linux, `ip -4 route get 1.1.1.1` shows the address after `src`. Changes reload automatically while the server is running.

Mobile has an iOS-style home screen with a local clock, seven apps, and a dock; Terminal stays on desktop. Tap the bottom Home indicator to return to the launcher. Mail opens your installed mail app, and Preview includes an external PDF link for mobile browsers.

### Architecture

```
app/
├── (content)/        Server-rendered reading pages (/about, /projects, …)
├── api/portfolio/     Static API route serving data/portfolio.json
├── llms.txt/          /llms.txt generated from the content
├── sitemap.ts         Sitemap generated from the content
├── robots.ts          robots.txt
├── components/
│   ├── apps/          One folder per app (Finder, Notes, Terminal, …), lazy-loaded
│   ├── desktop/       Desktop icons and marquee selection
│   ├── dock/          Dock layout, items, magnification
│   ├── menubar/       Menu bar, menus, Control Center
│   ├── window/        Window chrome, frame geometry, resize, error boundary
│   └── …              Spotlight, Quick Look, launcher, system screens
├── context/           React state: content, settings, windows, files, overlays, notifications
├── hooks/             Reusable hooks
└── lib/
    ├── content/       Zod schema, content sources, project archive, SEO
    │                  builders and date formatting
    ├── file-system.ts Virtual file system shared by Desktop, Finder and Quick Look
    ├── apps.tsx       App registry
    └── design-tokens.ts  Type scale and layer order used by Tailwind
```

- **Content** is validated with Zod at the API boundary, so a bad backend response shows a readable error instead of breaking the UI.
- **Window management** is a pure reducer (`context/window-state.ts`) with selectors, so every interaction is unit tested.
- **Logic lives outside components** — geometry, search, navigation and the file system are plain functions with tests next to them.
- **Each app runs in an error boundary**, so one crashing app shows a "quit unexpectedly" sheet instead of taking down the desktop.

## Deploying

`npm run build` produces a static site in `out/`. CI runs `npm run check` on every pull request, and the deploy workflow runs the same checks before publishing to GitHub Pages on every push to `main`.

## Built with

Next.js, Tailwind CSS, Framer Motion and react-draggable.

App icons, SF Symbols and the SF Pro font are Apple's. They're licensed for use on Apple platforms, so swap them out if you need to be strict about it.
