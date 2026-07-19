# Dhimant Suthar — Portfolio

Modern single-page portfolio with a real-time Three.js 3D background (particle field +
wireframe torus knot), scroll-driven reveal animations, 3D-tilt cards, and a typewriter hero.
No build step — plain HTML/CSS/JS with Three.js vendored locally.

## Structure

```
index.html                     — all content (hero, about, experience, skills, projects, gallery, contact)
assets/css/style.css           — design system (deep-space dark, cyan→violet accents)
assets/js/three-scene.js       — 3D background (ES module, imports vendored Three.js)
assets/js/main.js              — nav, typewriter, reveals, counters, tilt
assets/vendor/three/           — three.module.min.js r160 (local, no CDN dependency)
assets/img/                    — photos restored from the old 24cv repo + UC-Inventory demo GIF
```

## Run locally

Any static server works, e.g.:

```
python -m http.server 8123
```

then open http://localhost:8123. (Opening index.html via `file://` won't work — ES modules
need a server.)

## Deploy

To replace the old site at dhimantsuthar.in (GitHub Pages on `dhimant6/24cv`):
copy these files into that repo (keep its `CNAME` file), commit and push.
