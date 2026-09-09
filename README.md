# Project links and legacy Pages redirects

This account-level GitHub Pages site preserves the old Minesweeper 2.0 game address after its rename to **Minefarer**.

- Current game: [Minefarer](https://shipiyouniao.github.io/minefarer/).
- Legacy entry: [Minesweeper-2.0](https://shipiyouniao.github.io/Minesweeper-2.0/), including `index.html`, query parameters and fragments.
- Source and game issues: [shipiyouniao/minefarer](https://github.com/shipiyouniao/minefarer).

The redirect uses a fixed same-origin target and `location.replace`, keeping mode/language parameters and fragments while avoiding a Back-button loop. A visible link and delayed refresh provide fallbacks. It is a static browser redirect, not an HTTP 301 rule. The game remains on the same origin and retains its existing browser storage namespaces.

Keep the old game repository name unused. [GitHub repository redirects](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) preserve source, issue and PR links separately; recreating that repository would disable them.

Run `node --test tests/redirect.test.mjs` before changing the bridge. The Pages workflow checks pull requests, but only the main branch can upload or deploy the site. Changes are reviewed through PRs after this initial site bootstrap.
