# src/assets

Central media folder, mirroring the content tree:
- `images/<section>/` — raster images and SVG (`<Figure>`, `<Gallery>`, `<Svg>`, `<Gif>`, `cover`)
- `video/<section>/`, `audio/<section>/` — local media (`<Video>`, `<Audio>`)
- `lottie/<section>/` — Lottie JSON (`<Lottie>`)
- `data/<section>/` — CSV/JSON for `<Chart>`

Raster images are optimized by Astro at build.
