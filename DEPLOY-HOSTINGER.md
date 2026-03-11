# Deploy LPCX (Vite + React) to Hostinger

## 1. Build the app locally

On your machine, in the project folder:

```bash
cd "c:\Users\Vedaa\Downloads\Test Website\betclotto-app"
npm run build
```

This creates a **`dist`** folder with the production files:
- `index.html`
- `assets/` (JS, CSS)
- Any files from `public/` (e.g. `winner-images/`, `draw-card-images/`, `brand-logos/`, `.htaccess`)

## 2. Zip the contents of `dist`

- Open the **`dist`** folder.
- Select **all** files and folders inside it (e.g. `index.html`, `assets`, `winner-images`, `draw-card-images`, `brand-logos`, `.htaccess`).
- Right‑click → **Send to** → **Compressed (zipped) folder**.
- Name it e.g. `lpcx-site.zip`.

Do **not** zip the `dist` folder itself—zip the contents so that when Hostinger extracts the zip, `index.html` is at the root of what you upload.

## 3. Upload to Hostinger

1. Log in to **Hostinger** (hPanel).
2. Go to **Files** → **File Manager**.
3. Open **`public_html`** (this is the web root for your domain).
4. Remove or rename any default file (e.g. `default.html`) if you want your app to be the main site.
5. Click **Upload**.
6. Select your **`lpcx-site.zip`** and upload it.
7. In File Manager, **right‑click the zip** → **Extract**. Extract into `public_html` so that `index.html` sits directly inside `public_html`.
8. Delete the zip after a successful extract if you like.

## 4. Result

- Your site should be live at **https://yourdomain.com** (or the folder you uploaded to).
- The `.htaccess` file (included from `public/`) makes sure refreshes and direct links to routes like `/results` or `/how-to-play` still load the app instead of a 404.

## If the site is in a subfolder (e.g. yourdomain.com/lpcx)

1. In **vite.config.js** set `base: '/lpcx/'`.
2. Run **`npm run build`** again.
3. Zip the **contents** of `dist` and upload them into **`public_html/lpcx/`** (create `lpcx` if needed), then extract the zip there.
4. In `public/.htaccess`, set `RewriteBase /lpcx/` and `RewriteRule . /lpcx/index.html [L]`, then rebuild and re-upload.

## Troubleshooting

- **Blank page:** Check the browser console (F12). If assets 404, you may have zipped the `dist` folder instead of its contents, or `base` in Vite doesn’t match the URL path.
- **404 on refresh/direct link:** Ensure `.htaccess` is in the same directory as `index.html` and that Hostinger has **mod_rewrite** enabled (it usually is on shared hosting).
- **Images missing:** Ensure the folders `winner-images`, `draw-card-images`, and `brand-logos` (with their files) are inside the zip and end up next to `index.html` after extract.
