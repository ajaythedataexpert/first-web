# Low-poly 3D portfolio

A single-page, corporate-professional portfolio built with **React 19, react-three-fiber, drei, Tailwind CSS v4 and framer-motion**. Flat-shaded low-poly geometry, a white/light-gray canvas and one brand accent (deep indigo).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve dist/
```

## Editing content

Everything — the site sections, the print resume and the generated PDF — reads from **one file**:

```
src/data/portfolio.ts
```

Change `profile`, `stats`, `skills`, `experience`, `projects` and `testimonials` there and all three outputs stay in sync.

Brand colours live in `src/index.css` (`@theme` block, `--color-brand-*`) and `src/three/palette.ts`.

## Sections

| Section | 3D element (desktop) | Fallback (mobile / reduced-motion / no WebGL) |
| --- | --- | --- |
| Hero | Faceted icosahedron with a custom flat-shading shader. A `uProgress` uniform driven by scroll progress orbits the key light and lerps the base colour. | Procedurally generated low-poly sphere SVG |
| About | Four small low-poly icon models beside animated counters | Static SVG icons |
| Skills | Isometric 3D bar chart; bars extrude with a staggered damp when scrolled into view | 2D bars animating on scroll |
| Experience | Horizontal scroll strip with a 3D rail; milestone markers pan in sync and the focused role is highlighted | 2D rail with diamond markers |
| Projects | Card grid, each with an interactive low-poly icon that spins faster on hover; click opens a case-study modal | Static SVG icons |
| Testimonials | Simple auto-advancing carousel | – |
| Resume | One-page PDF generated in the browser (`@react-pdf/renderer`) + print-friendly layout (`window.print()`) | same |
| Contact | Validated form (currently hands off to a `mailto:` link) | same |

## Architecture notes

- **Two WebGL contexts at most.** The hero has its own canvas (it must sit *behind* the headline). Every other 3D element is a drei `<View>` tunnelled into one shared fixed canvas (`src/three/SceneCanvas.tsx`) that sits *above* page content but below the nav and modals, so opaque cards never hide their icons.
- **Lazy 3D.** All three.js code is in lazily-loaded chunks (`src/three/*`). Lite-mode visitors never download it — `useLite()` in `src/hooks/useMediaQuery.ts` decides based on viewport, pointer type, `prefers-reduced-motion` and WebGL support.
- **Scroll progress** is tracked once (`useGlobalScrollTracker`) into a mutable ref that the shader reads every frame without React re-renders; the side indicator uses a throttled state version.
- **Print.** `@media print` hides the interactive site and shows `PrintResume`, a clean two-column A4 layout of the same data.
- **PDF.** `src/pdf/ResumePDF.tsx` is a one-page A4 document using built-in Helvetica (no font downloads). `downloadResumePDF()` lazy-loads the renderer only when the button is clicked.

## Wiring up the contact form

`src/components/Contact.tsx` validates client-side and then opens the visitor's mail client. Replace the `mailto:` hand-off in `onSubmit` with a `fetch()` to your form endpoint (Formspree, Resend, a serverless function, etc.).
