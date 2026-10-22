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

The new pricing layout lives in `web/pricing-experience.css` and
`web/pricing-experience.js`. It reuses the existing pricing data and recommendation
flow from `app.js` and `recommender.js`. Decorative assets are original Figma
exports; the optional WebGPU backgrounds use the original shader programs.

The Figma sources are the Personal frame `31951:32322` and Teams frame
`32080:12481` in the supplied Official Website file. The two-way transition follows
the supplied screen recording. Purchase and contact buttons are interactive
preview dialogs; they are not connected to backend services.

See `design-qa.md` and `qa/verification.json` for verification evidence.
`scripts/verify-pricing.cjs` runs the regression flow against the live server when
Playwright is available. `PLAYWRIGHT_MODULE`, `BROWSER_PATH` and `PREVIEW_URL` can
override its module, browser executable and target URL.
