# Personal website

Vue 3 (`<script setup>`), Vue Router, Vite, and Tailwind CSS. The GitHub profile README lives separately in `shipiyouniao/shipiyouniao`.

## Development

Use Node.js 22.12 or newer. Run `npm ci`, then `npm run dev` for a local preview. Run `npx playwright install chromium` and `npm run check` for redirect tests, production build, and desktop/mobile browser tests.

Edit `src/content.js` for contribution metadata, public links, and technology categories. Edit `src/locales/messages.js` for Chinese/English text and PR summaries. PR summaries link to the public sources; no ghostwritten blog posts are included. Do not add internal project names, private deployment details, or unverified performance claims.

Vue I18n handles named placeholders. An explicit language choice is stored locally; otherwise the first supported browser language is selected (Chinese or English, default English). Storage failures do not block rendering or language switching. Tests check translation-key parity, placeholders, browser detection, persistence, and both languages at mobile/desktop widths.

The Bilibili profile URL is verified against the GitHub profile's social links. Featured game videos provide sources for the gaming introduction. Career and education details were provided by the site owner; no graduation or team-transfer dates are inferred. The unreleased internal query tool is described generically.

Hash-based routes work without server rewrites. The about page supports the browser print dialog. Screenshots are saved to ignored `.preview/`.

The workflow audits dependencies and runs formatting, unit tests, the production build, and bilingual browser tests on pull requests and main. It deploys `dist/` only after a successful main build. Failed browser runs retain diagnostics for seven days. Local previews do not change the public website.

## Deployment ownership

| Repository | Published path | Content |
| --- | --- | --- |
| `shipiyouniao.github.io` | `/` | Personal website and legacy game redirect |
| `minefarer` | `/minefarer/`, `/minefarer/dev/` | Stable game and development preview |
| `shipiyouniao` | None | GitHub profile README, not a Pages deployment |

The personal site must build with base `/`. Its public files must not contain `index.html` (which would overwrite Vite's entry), a `minefarer/` directory, or a `CNAME`. CI also checks the final artifact and the Pages destination before deployment. Minefarer owns its independent project-site artifact; do not copy its build into this repository. No cross-repository deployment token is needed.

## Images

- `site/images/mountains.jpg`: [Unsplash source image](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b), subject to the [Unsplash license](https://unsplash.com/license).
- `site/images/minefarer.png`: [Minefarer original artwork](https://github.com/shipiyouniao/minefarer/blob/main/public/assets/story/camp-banner.png), licensed with that repository.

## Legacy Pages redirects

This account-level GitHub Pages site preserves the old Minesweeper 2.0 game address after its rename to **Minefarer**.

- Current game: [Minefarer](https://shipiyouniao.github.io/minefarer/).
- Legacy entry: [Minesweeper-2.0](https://shipiyouniao.github.io/Minesweeper-2.0/), including `index.html`, query parameters and fragments.
- Source and game issues: [shipiyouniao/minefarer](https://github.com/shipiyouniao/minefarer).

The redirect uses a fixed same-origin target and `location.replace`, keeping mode/language parameters and fragments while avoiding a Back-button loop. A visible link and delayed refresh provide fallbacks. It is a static browser redirect, not an HTTP 301 rule. The game remains on the same origin and retains its existing browser storage namespaces.

Keep the old game repository name unused. [GitHub repository redirects](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) preserve source, issue and PR links separately; recreating that repository would disable them.

Run `npm run check` before changing the bridge. Vite copies the legacy directory from `site/` into `dist/`. Minefarer remains independently deployed; this repository does not modify its game code. Changes are reviewed through PRs.
