# portfolio

Alejandro De Leon's site: projects, work, a persona page and a pixel transit game. Next.js (App Router) on Vercel, Tailwind, no database. All media lives in this repository.

## Run it

Node 24 (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

`dev`, `build` and `typecheck` first run `scripts/media-manifest.mjs` (below).

## Where things are

| | |
| --- | --- |
| `src/data/projects.ts` | Every project: title, description, specs, links. The order is the catalog order, newest first. |
| `src/data/experience.ts` | Jobs on the work page. |
| `src/data/sound.ts` | Which gallery clips have audio worth hearing. |
| `public/media/<alias>/` | A project's gallery. Files show in file name order; the name, less its number, is the caption. |
| `public/media/posters/<alias>/<clip>.mp4.jpg` | The first frame of a gallery clip. |
| `public/videos/`, `public/images/` | Hero clips and work page pictures, referenced by path from the data files. |
| `src/app/` | Routes. `projects/[slug]` is a project page, `metro` is the game. |
| `src/components/koivu/` | The home page, project grid, navigation spines, snake. |
| `src/components/metro/` | The game "No ticket". |

## Add a project

1. Add an entry to `src/data/projects.ts` with a unique `alias`.
2. Put its pictures and clips in `public/media/<alias>/`, named `01-what-it-shows.jpg`, `02-…`.
3. For each clip, add a poster at `public/media/posters/<alias>/<file>.mp4.jpg`.
4. Run `npm run dev`. The manifest script picks the files up.

A replaced picture should get a new file name (`-v2`): resized copies are cached for a month.

## The media manifest

`scripts/media-manifest.mjs` reads `public/` and writes three things:

- `src/data/media.json`: the list of gallery files, so pages do not read the disk at request time.
- `src/data/sizes.json`: the pixel size of every picture, so a page holds each picture's place before it loads.
- `public/og/<alias>.jpg`: a 1200×630 share card per project, from its first picture. Not committed; made at build.

The two JSON files are committed. Commit them when they change.

## Deploy

Vercel builds every push. Pull requests get a preview deployment. GitHub Actions runs lint and typecheck (`.github/workflows/ci.yml`).
