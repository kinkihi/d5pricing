# Browser preview

Public preview: https://kinkihi.github.io/d5pricing/

The GitHub Pages workflow publishes the `web/` directory after a push to `main`.
Wait for “Deploy GitHub Pages” to finish, then refresh the public page. Changes in
a cloud workspace do not appear on this URL until committed and published.

## Local development with automatic reload

From the repository root:

```sh
npm run dev
```

Open http://localhost:4173 **on the machine running the server**. A cloud
workspace's localhost is not reachable from your own browser unless the host
provides port forwarding. Saving files under `web/` automatically reloads the
page and preserves the selected audience, billing cycle, language and scroll.
The server uses Node's standard library; no install step is required.

The pricing layout lives in `web/pricing-experience.css` and
`web/pricing-experience.js`. Personal card content follows Figma node
`31951:32326`; its two independent tiers use the prices in
https://github.com/jjcyixi/d5pricing-beta/blob/main/data.js (read on 2026-10-27).
Basic costs ¥49 / ¥129 monthly or ¥468 / ¥1,188 annually; Pro costs
¥200 / ¥279 monthly or ¥1,920 / ¥2,628 annually. Annual prices show the full
year's subscription fee. Each price arrow switches between Starter and Advanced;
the selected tiers persist in `basicTier` / `proTier` URL parameters and appear in
the subscription preview. The old four-tier data in `app.js` is not used by these cards.

Starter card benefits follow the supplied Figma, including 2K / 720p for both
paid plans. Advanced benefits follow the beta's large tier: 4K image/video and six
concurrent tasks. The displayed 1,500 / 4,500 credits include the beta's 50% launch
bonus; accessible tooltips explain the 1,000 / 3,000 base allowance and shared
launch-window conditions. Render and AI benefits are grouped separately. Original
16px icons are exported from the corresponding Figma nodes into
`web/assets/figma/personal-*.svg`. Existing page backgrounds and team content remain
from the previous implementation.
The recommendation section is currently removed from the page; its standalone
source files are retained for future use. The hero uses a custom low-saturation
WebGL light-curtain shader in `web/hero-aura.mjs`, with a matching CSS gradient
fallback. Gray-violet and steel-blue folds overlap and drift slowly, with darker
shading behind the hero title. It pauses offscreen/in background tabs and respects reduced
motion. The Pro-card decoration retains the original Figma export and optional
WebGPU shader.

The Figma sources are the Personal frame `31951:32322` and Teams frame
`32080:12481` in the supplied Official Website file. The two-way transition follows
the supplied screen recording. Purchase and contact buttons are interactive
preview dialogs; they are not connected to backend services.

See `design-qa.md` and `qa/verification.json` for verification evidence.
`scripts/verify-pricing.cjs` runs the regression flow against the live server when
Playwright is available. `PLAYWRIGHT_MODULE`, `BROWSER_PATH` and `PREVIEW_URL` can
override its module, browser executable and target URL.

`scripts/verify-pricing-refinements.cjs` checks billing animation continuity,
rapid reversals, card hover geometry/background stability and FAQ localization.
Safari/WebKit verification is still pending: this environment cannot download
WebKit under its current network policy. See `qa/refinements-verification.json`.

`scripts/verify-personal-tiers.cjs` checks every Basic/Pro tier and billing
combination, interrupted switching, visible price digits, subscription previews,
keyboard controls, URL persistence, localization, icon geometry and narrow layouts.
Its report is `qa/personal-tiers-verification.json`. Set `SCREENSHOT_DIR` to keep
browser screenshots outside the repository when running these checks.

`scripts/verify-aura.cjs` exercises the actual WebGL shader, animation pause/resume,
context loss/recovery, fallback rendering, responsive buffer sizing and the team
hover border. Its report is `qa/aura-verification.json`.
