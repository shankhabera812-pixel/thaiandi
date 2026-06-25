# Thai & I — Image Manifest

All client images should be placed in this directory.
Rename files to match the exact filenames listed below before running the build.

## Hero carousel (5 slides) — `hero/` folder

Play order:

| # | Filename (in `hero/`) | Usage                    | Overlay  |
|---|------------------------|--------------------------|----------|
| 1 | foodspread3.jpg        | Food spread              | 45% dark |
| 2 | barshot1.jpg           | Bar + flowers            | 35% dark (lighter class on slide 2) |
| 3 | drinks5.jpg            | Beverages                | 45% dark |
| 4 | padthai2.jpg           | Pad Thai                 | 45% dark |
| 5 | specials.jpg           | House specialties        | 45% dark |

OG / Twitter preview: `hero/foodspread3.jpg`

Legacy root hero images (`foodheroshot1.jpg`, `interior1.jpg`) are not used in the carousel.

## Story section

| Filename                      | Usage                            | Crop intent        |
|-------------------------------|----------------------------------|--------------------|
| foodspread4.jpg               | Rectangular photo (primary)      | Landscape, 4:3     |
| medusa.jpg                    | Oval-clipped photo (overlapping) | Portrait 3:4 center|

## Category oval strip (Section 04)

| Filename          | Oval label       | Crop intent         |
|-------------------|------------------|---------------------|
| curryphoto.jpg    | Curries          | Portrait center bowl |
| noodlesandfriedrice.jpg | Noodles & Rice | Portrait center dish |
| appetizer.jpg     | Appetizers       | Portrait center plate (spring rolls) |
| drinkscloseup.jpg | Drinks & Bar     | Portrait center tray |

## Menu section (Section 05)

| Filename          | Usage                                    |
|-------------------|------------------------------------------|
| foodspread2.jpg   | Cinematic banner above menu              |
| desertheroshot.jpg| Desserts tab panel accent (mango sticky) |

## Featured dishes (Section 06) — 6 cards

| Filename                  | Card dish              |
|---------------------------|------------------------|
| padthai3.jpg              | Pad Thai (featured card) |
| ramaduck.jpg              | Rama Duck              |
| panangcurry2.jpg          | Panang Curry (featured card) |
| papayasalad1.jpg          | Papaya Salad (featured card) |
| papayasalad.jpg           | (legacy — not used on site)  |
| featured-basil-combo.jpg  | Basil Combo            |
| featured-fried-rice.jpg   | Thai Special Fried Rice|

## Press / local news (Section 07)

| Filename | Publication | Article URL |
|----------|-------------|-------------|
| wm.jpg | Worcester Magazine | https://www.worcestermag.com/story/lifestyle/2021/03/04/table-hoppin-brown-rice-thai-cuisine-owner-opening-second-w-boylston-site/6824681002/ |
| tg.jpg | Telegram & Gazette | https://www.telegram.com/story/news/local/the-item/2021/04/10/west-boylstons-brown-rice-opening-second-location-right-down-road/7112490002/ |
| ca.jpg | Community Advocate | https://www.communityadvocate.com/business/the-thai-i-restaurant-high-quality-authentic-thai-food-in-shrewsbury/article_61610d8a-442c-55dc-9ad1-4f7c671c6413.html |
| RestaurantGuru_Certificate.jpg | Certificate (below cards) | — |

Decoration: Seigaiha pattern on charcoal; certificate has animated gold frame (static under reduced-motion).

## Testimonials (Section 08)

| Filename              | Usage                          | Treatment      |
|-----------------------|--------------------------------|----------------|
| drinksheroshot2.jpg   | Section background             | 20% opacity    |

## Order CTA band (Section 09)

| Filename          | Usage              | Treatment       |
|-------------------|--------------------|-----------------|
| khaosoi2.jpg      | Section background | 15–20% opacity  |

## Logo

| Filename   | Usage               | Notes                        |
|------------|---------------------|------------------------------|
| logo.png   | Header + footer     | Circular, wood-grain, transparent background preferred |

## Performance targets

- Hero images: max 400 KB each as WebP at 1920w
- Food spread: max 300 KB at 1600w
- Featured cards: max 150 KB each at 600w
- All images: provide WebP with JPG fallback
