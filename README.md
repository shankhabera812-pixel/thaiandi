# Brown Rice 2 Thai Cuisine — Website Redesign

Single-page static website for Brown Rice 2 Thai Cuisine at 184 West Boylston Street, West Boylston, MA.

## Stack

- Vanilla HTML5 / CSS3 / JavaScript (ES6+, no framework)
- Google Fonts (Cormorant Garamond + DM Sans)
- Menu data in `src/data/menu.json` (single source of truth)

## Running locally

Any static file server works:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Use the Live Server extension and open index.html
```

Then visit `http://localhost:8080`.

> **Note:** The menu is loaded via `fetch('src/data/menu.json')`.
> A local server is required — opening `index.html` directly as a `file://` URL will cause a CORS error for the fetch.
> Use Live Server, Python, or any static host.

## Adding images

1. Place all image files in `assets/images/`.
2. See `assets/images/manifest.md` for exact filenames and their usage.
3. Recommended formats: **WebP** (primary) + JPG fallback. Compress hero images to ≤ 400 KB each.

## Project structure

```
brownrice2-redesign/
├── index.html                 Main page (all sections)
├── src/
│   ├── styles/
│   │   ├── tokens.css         Design tokens (colors, type, spacing)
│   │   ├── global.css         Reset, utilities, buttons, animations
│   │   └── sections.css       All section-specific styles
│   ├── data/
│   │   └── menu.json          Complete menu data (single source of truth)
│   └── js/
│       ├── carousel.js        Hero crossfade carousel
│       ├── menu-tabs.js       Menu rendering + tab system
│       └── main.js            Nav, scroll reveal, mobile menu
└── assets/
    └── images/
        ├── manifest.md        Image assignment manifest
        └── [image files]      Place client images here
```

## Updating the menu

Edit `src/data/menu.json`. The structure is:
- `tabs[]` — each tab has `id`, `label`, `dualPeriod`, `subsections[]`
- `subsections[]` — each has `period?` (`lunch` | `dinner`) and `items[]`
- `items[]` — each has `id`, `name`, `description?`, `price?` or `priceFrom?`

## Ordering links

Ordering URLs (also in `index.html` and `src/js/menu-tabs.js`):
- **Toast** (pickup): `https://www.toasttab.com/brown-rice-2-184-west-boylston-street/v3`
- **Grubhub** (online ordering): `https://brownricethaicuisine.dine.online/`
- **DoorDash**: `https://order.online/business/brown-rice-2-thai-cuisine--11626800`

## Deployment

The site is a static folder — upload the entire directory to any host:
- GitHub Pages, Netlify, Vercel (drag-and-drop deploy)
- Traditional cPanel hosting (upload via FTP)
- AWS S3 + CloudFront

## Pre-launch checklist

- [ ] All images placed in `assets/images/` with correct filenames (see manifest)
- [ ] Toast / Grubhub / DoorDash URLs verified live
- [ ] Phone number `(508) 935-5388` confirmed
- [ ] Hours confirmed accurate
- [ ] Google Maps embed URL returns correct location pin
- [ ] Test on Chrome, Safari, Firefox + mobile (iOS Safari, Android Chrome)
- [ ] Verify menu JSON renders all tabs correctly
- [ ] Confirm Lighthouse scores: Performance ≥ 85, Accessibility ≥ 95
