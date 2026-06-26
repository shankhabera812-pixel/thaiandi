# Thai & I — Website

Single-page static website for Thai & I at 274 South St, Shrewsbury, MA 01545.

## Stack

- Vanilla HTML5 / CSS3 / JavaScript (ES6+, no framework)
- Google Fonts (Cormorant Garamond + DM Sans)
- Menu data in `src/data/menu.json` (single source of truth)

## Running locally

```bash
# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`.

> **Note:** A local server is required — opening `index.html` directly as a `file://` URL will cause a CORS error for the menu fetch.

## Ordering links

- **Toast** (pickup): https://order.toasttab.com/online/thai-i
- **Grubhub** (delivery): https://www.grubhub.com/restaurant/thai-and-i-restaurant-274-south-st-shrewsbury/2196678
- **DoorDash** (delivery): https://www.doordash.com/store/thai-and-i-shrewsbury-865539/

## Restaurant info

- **Address:** 274 South St, Shrewsbury, MA 01545
- **Phone (primary):** (508) 762-4814
- **Phone (secondary):** (508) 762-4810
- **Hours:** Tuesday Closed · Mon, Wed–Sun 11:00 AM – 9:00 PM
- **Domain:** www.thaiandishrewsbury.com

## Pre-launch checklist

- [ ] All Thai & I photos placed (see TODO comments in index.html)
- [ ] Toast / Grubhub / DoorDash URLs verified live
- [ ] Phone numbers confirmed with owner
- [ ] Google Maps embed URL updated in contact section
- [x] Menu prices updated from Toast-verified reference
- [ ] Test on Chrome, Safari, Firefox + mobile
