# Verisib website

The official static website for [verisib.com](https://verisib.com), built with plain HTML, CSS, and JavaScript.

## Local preview

From the repository directory, run any static web server. For example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with these settings:

- Production branch: `main`
- Framework preset: None
- Build command: leave blank
- Build output directory: `/`

The `_headers`, `404.html`, `robots.txt`, and `sitemap.xml` files are ready for Cloudflare Pages.

## Publishing workflow

All website changes should be committed to Git and pushed to the `main` branch.
