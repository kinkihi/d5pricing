# D5 pricing UI and motion QA

final result: passed

Scope: the supplied Personal and Teams tabs, hero, pricing cards, billing controls,
education entry, comparison table and responsive behavior. The FAQ and footer
remain available. The plan recommendation was removed in the October 22 follow-up.
Those lower sections are not claimed as a clone of the supplied full-page frames.

## Evidence

- Source Personal: Figma `PDtfa9hHljnEk6mZU35jM0 / 31951:32322`;
  `/workspace/reference/personal.png` (1920 × 2571).
- Source Teams: Figma `PDtfa9hHljnEk6mZU35jM0 / 32080:12481`;
  `/workspace/reference/team.png` (1920 × 2571).
- Motion: supplied recording, 7.65 seconds;
  `/workspace/reference/motion.jpg` contains the sampled timeline.
- Rendered implementation: `qa/personal-desktop.png`, `qa/team-desktop.png`.
- Desktop CSS viewport: 1920 × 1100, deviceScaleFactor 1; captures are full-page.
  The compared content crop is 1920 × 1630, with no density conversion.
- Full-view paired comparisons: `qa/personal-comparison.jpg`,
  `qa/team-comparison.jpg`. Each combines the source and implementation at equal
  scale before resizing the pair to 1920 × 835 for overview inspection.
- Focused paired comparisons: `qa/personal-detail.png`, `qa/team-detail.png`.
  Each card is compared at 464 × 536, one CSS pixel per image pixel.
- State: Chinese, monthly billing, settled Personal and Teams states.
- Responsive captures: `qa/mobile-personal.png`, `qa/mobile-team.png`, and their
  `-top.png` crops; CSS viewport 390 × 844, deviceScaleFactor 1.
- Intermediate animation: `qa/transition-midpoint.png`.
- Browser interaction report: `qa/verification.json`.

## Findings and fixes

### Hero aura update, preview v20261022-4

- Replaced the original star field with a custom low-saturation WebGL aura:
  soft gray-violet and blue-gray light fades into the black pricing page.
  Continuous seeded noise moves the glow slowly without a repeating loop.
- The hero keeps a matching CSS gradient when WebGL is unavailable or its
  context is lost; restoring the context restarts the renderer.
- Rendering is capped at 24fps, half CSS resolution and 960px buffer width.
  Offscreen/hidden-page animation pauses; reduced-motion preference freezes it.
- Team-card hover retains its lift/shadow and now ends at `#8F94FB`.
- Actual WebGL rendering, pixel changes over time, pause/resume, context recovery,
  fallback and responsive behavior pass in Chromium/SwiftShader. Existing pricing
  interactions and mobile layout regression also pass, with no console errors.
- Evidence: `qa/aura-desktop.png`, `qa/aura-mobile.png`,
  `qa/aura-team-hover.png`, and `qa/aura-verification.json`.
  Safari hardware rendering has not been exercised in this environment.

### October 22 follow-up, preview v20261022-2

- Removed the recommendation section and its stylesheet/script includes.
- Localized the FAQ heading to “常见问题” in Chinese and “FAQ” in English.
- Initialized number wheels before the first interaction; extra leading digits
  now expand/fade in and shrink/fade out, preserving baseline and period-label
  position continuously. Six rapid billing reversals pass the regression check.
- Replaced the team card's live backdrop sampling with an independent opaque
  dark surface and its existing purple glow. This avoids Safari compositing the
  animated rear cards differently when hover creates a new layer. Rest/hover
  captures are `qa/team-background-rest.png` and `qa/team-background-hover.png`.
- Added a 6px lift, 1.006 scale and soft shadow to all four active cards on hover.
  These compose with tab motion and mobile centering without replacing them.
- Both browser regression scripts pass in Chromium. The Safari-specific fix
  has not been tested in Safari/WebKit: browser downloads return “Domain forbidden”
  under the environment's network policy. It still needs Safari confirmation.

The following findings describe the original implementation review.

No actionable P0, P1 or P2 issues remain in the requested scope.

1. Initial render verification found the development server's root path retained
   a trailing slash, rejecting CSS and JS requests. Normalizing the root restored
   resource loading; all final browser requests pass.
2. First paired visual comparison found the Pro wave too faint. Its Figma export
   already contains 40% alpha. Removed the second opacity multiplier and aligned
   the background to the source's 108px offset. Post-fix evidence is in the final
   Personal comparison and detail capture.
3. Font verification found Inter resolving to the environment's default sans.
   Added a local licensed Inter variable font, with the existing Chinese fallback.
4. Responsive tests found Pro benefits clipped in the 820px three-column layout.
   The stacked layout now starts at 960px. A ResizeObserver measures natural card
   heights so translated and wrapped copy determines the stack's vertical positions.
   Final viewport checks pass at 1440, 1024, 820, 760, 390 and 320px for both tabs.
   A separate English check also passes at 320px.

## Required fidelity surfaces

- Typography: Inter loaded locally; 64px hero, 20px plan headings, 32px prices,
  14px benefits; Chinese fallback may differ subtly from the Figma renderer.
- Layout: verified desktop card grid x=240, y=474, width=1440, height=536;
  cards=464px with 24px gaps. Shared section height prevents desktop content jumps.
- Colors: black canvas, subtle borders, #9459ff Pro CTA, #656ad9 Teams CTA,
  original nebula and wave source assets, and layered blur match the intended hierarchy.
- Assets: original check icon exported from Figma, not redrawn; 16 × 16 in cards.
  Existing exact comparison check (16.25 × 16.25) and caret (24 × 24) assets reused.
  All local visible image files are non-empty, loaded, and have verified callsites
  and geometry. The original Figma shader setup/render programs are retained.
- Content: personal and team benefits match the supplied designs. Comparison
  labels retain the existing Chinese localization. The placeholder discount text
  `享x折` becomes `年付惠`; annual amounts reuse the site's existing pricing data.

## Interaction and preview verification

- Personal ↔ Teams transitions include visible intermediate positions, rotation,
  blur and foreground-card reveal. Seven rapid reversals settle correctly.
- Hidden cards, billing and education content become inert and aria-hidden.
- Arrow keys, Home/End, selected tab focus and reduced-motion behavior pass.
- Monthly ↔ annual pricing and the chosen cycle survive tab changes and reloads.
- Chinese ↔ English changes preserve the active audience.
- Main CTAs open honest preview dialogs, support Escape and restore focus.
- Comparison rows expand and collapse.
- Saving a file triggers live browser reload and preserves the active tab/cycle.
- Final console errors: zero. Failed resource requests: zero.
- Syntax checks and `git diff --check`: pass.

## Limits and follow-up polish

- P3: Chinese font rasterization and soft glow blending vary slightly between
  Chromium and Figma; content geometry and visual hierarchy are preserved.
- Headless Chromium provides no WebGPU adapter in this environment, including
  with unsafe WebGPU enabled. It renders the exact exported Figma backgrounds.
  The imported original shader programs are retained for capable browsers, but
  that hardware rendering path could not be exercised here.
- Checkout, account creation and sales submission are not connected. Preview
  dialogs make this clear and do not create orders or send requests.
- The Codex browser panel open request was queued by the host; the local server
  and browser-rendered page were independently verified at port 4173.

## Implementation checklist

- [x] Source-grounded personal and team cards
- [x] Reversible card and tab motion
- [x] Billing and comparison synchronization
- [x] Desktop and mobile captures reviewed
- [x] Original local assets and font verified
- [x] Core interactions, accessibility and reload behavior checked
- [x] Preview server left running
