"""
Thai & I — Quick n' Easy Set Image Downloader
Extracted directly from Toast CDN on 2026-06-25.
Run from the thaiandirestaurant/ project root.
Requires: pip install requests
"""

import requests
import os
import time

OUTPUT_DIR = "assets/images/sets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# All 20 Quick n' Easy Sets with confirmed CDN image URLs.
# Pineapple Fried Rice Set and Red Curry Set have no image on Toast (url=None).
SETS = [
    # ── COMBINATIONS ─────────────────────────────────────────────────────────
    {
        "filename": "set-basil.jpg",
        "item":     "Basil Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/RN882TzoIbHY5ZQpxa4eLebEdHgp_Rg0h246keh3sZk/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/3/item-500000060157570733_1765748050.jpg",
    },
    {
        "filename": "set-broccoli.png",
        "item":     "Broccoli Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/Dc-zHiDf2xTsrcH61J6yyGvCZJ1JFHuKOLjVcNFKNHc/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/5/item-500000060157570735_1765748080.png",
    },
    {
        "filename": "set-cashew-nuts.png",
        "item":     "Cashew Nuts Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/V5JXFP9aJ1M8zo51bnoRPlTSSDiW0e2x4zLM5_Nz2gw/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/7/item-500000060157570737_1765748123.png",
    },
    {
        "filename": "set-garlic.jpg",
        "item":     "Garlic Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/gCXLsbIfv9w4bwxvqgjZZS6xQfsQlFzk8PoxDOADEKU/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/1/item-500000060157570741_1765748199.jpg",
    },
    {
        "filename": "set-ginger.jpg",
        "item":     "Ginger Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/mOyljOFPNVUxTHgoNey8R_6AH_CKiiHaGhg0Zdnurko/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/3/item-500000060157570743_1765748225.jpg",
    },
    {
        "filename": "set-lemongrass.jpg",
        "item":     "Lemongrass Set",
        "price":    "$13.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/ddDb7p5-zK-_cHsokOPkgalm-xvITpiOYB6xshmLKo0/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/5/item-500000060157570745_1765748245.jpg",
    },
    {
        "filename": "set-thai-and-i-special.jpg",
        "item":     "Thai & I Special Set",
        "price":    "$15.95",
        "category": "Combinations",
        "url": "https://d1w7312wesee68.cloudfront.net/t5X3LVdwl8tz5IbjynGWhg309fVCq4Alk_0JIiKf460/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/7/item-500000060158405847_1765749105.jpg",
    },

    # ── NOODLES & FRIED RICE ─────────────────────────────────────────────────
    {
        "filename": "set-pad-thai.jpg",
        "item":     "Pad Thai Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/2HXfcbG8XxpVJOGalW5QPOM9wI5VuCe3gVc28ScIyCE/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/0/item-500000060240561290_1766002905.jpg",
    },
    {
        "filename": "set-drunken-noodle.jpg",
        "item":     "Drunken Noodle Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/EKQO1-9junZ52ZxFt1VQiBNg9426peCfQKRdtDVJy8w/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/2/item-500000060240561292_1766002967.jpg",
    },
    {
        "filename": "set-fiery-pad-thai.jpg",
        "item":     "Fiery Pad Thai Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/SBdDPm9z-qLSjFXDuFDNZYGQCy1lO3eZ-fvMW0e6AIU/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/4/item-500000060240561294_1766002938.jpg",
    },
    {
        "filename": "set-fried-rice.jpg",
        "item":     "Fried Rice Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/t04zbgJ6-9CnI0wo2LP9rrSCR6S-mmnB_t46mBhHTgY/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/6/item-500000060240561296_1766002997.jpg",
    },
    {
        "filename": "set-pineapple-fried-rice.jpg",
        "item":     "Pineapple Fried Rice Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": None,  # No image uploaded on Toast
    },
    {
        "filename": "set-basil-fried-rice.jpg",
        "item":     "Basil Fried Rice Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/mNY9EiejMiLap2dOozsUdNRGpvjGoqLXM-UNGsXT8xo/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/0/item-500000060240563300_1766003027.jpg",
    },
    {
        "filename": "set-thai-lo-mein.jpg",
        "item":     "Thai Lo Mein Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/t5eIwCYJp3CSRfXHTFM8SbFG3TU5zodOFoiUvNsnPok/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/4/item-500000060240964434_1766003089.jpg",
    },
    {
        "filename": "set-pad-see-u.jpg",
        "item":     "Pad See U Set",
        "price":    "$12.95",
        "category": "Noodles & Fried Rice",
        "url": "https://d1w7312wesee68.cloudfront.net/_BtyPabirWEtlOHtTWR4c9Cz5GacH8b3g9e3r3qLGzM/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/4/item-500000060241007254_1766003157.jpg",
    },

    # ── CURRIES ──────────────────────────────────────────────────────────────
    {
        "filename": "set-yellow-curry.jpg",
        "item":     "Yellow Curry Set",
        "price":    "$13.95",
        "category": "Curries",
        "url": "https://d1w7312wesee68.cloudfront.net/2wE5B-2fUiUfpfXPubyiuX41zR8UVzLExwB15sSMxrE/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/1/item-500000060241229701_1766003840.jpg",
    },
    {
        "filename": "set-massaman-curry.png",
        "item":     "Massaman Curry Set",
        "price":    "$13.95",
        "category": "Curries",
        "url": "https://d1w7312wesee68.cloudfront.net/Z8ABwuL1KhnFHlOmK3YPksItquQpED81sxnBTSiqlv0/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/3/item-500000060241229703_1766003866.png",
    },
    {
        "filename": "set-green-curry.jpg",
        "item":     "Green Curry Set",
        "price":    "$13.95",
        "category": "Curries",
        "url": "https://d1w7312wesee68.cloudfront.net/QkyoR-q7NSlauygGUYuuIp1IGOMs8a0Nvg6nMHOGKlc/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/5/item-500000060241229705_1766003889.jpg",
    },
    {
        "filename": "set-red-curry.jpg",
        "item":     "Red Curry Set",
        "price":    "$13.95",
        "category": "Curries",
        "url": None,  # No image uploaded on Toast
    },
    {
        "filename": "set-mango-curry.jpg",
        "item":     "Mango Curry Set",
        "price":    "$13.95",
        "category": "Curries",
        "url": "https://d1w7312wesee68.cloudfront.net/_gpMpEH_J0mVo7UBzexiPzSstZJmNux9aku-WymICXQ/resize:fit:720:720/plain/s3://toasttab/restaurants/restaurant-30584000000000000/menu/items/8/item-500000060241422278_1766003953.jpg",
    },
]


def download():
    downloaded, skipped, missing = [], [], []

    for item in SETS:
        path = os.path.join(OUTPUT_DIR, item["filename"])

        if item["url"] is None:
            print(f"  SKIP  (no image on Toast): {item['item']}")
            missing.append(item["item"])
            continue

        if os.path.exists(path):
            print(f"  EXISTS: {item['filename']}")
            skipped.append(item["filename"])
            continue

        try:
            r = requests.get(item["url"], headers=HEADERS, timeout=15)
            r.raise_for_status()
            with open(path, "wb") as f:
                f.write(r.content)
            kb = len(r.content) // 1024
            print(f"  OK  {item['filename']}  ({kb} KB)  — {item['item']}")
            downloaded.append(item["filename"])
            time.sleep(0.3)
        except Exception as e:
            print(f"  ERR {item['filename']}: {e}")

    print(f"\n{'─'*55}")
    print(f"Downloaded : {len(downloaded)}")
    print(f"Already existed: {len(skipped)}")
    print(f"No image on Toast (manual needed): {len(missing)}")
    if missing:
        print(f"  → {', '.join(missing)}")
    print(f"Saved to: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    download()
