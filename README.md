# Verisib website

The official static website for [verisib.com](https://verisib.com), built with semantic HTML, modern CSS, and dependency-free JavaScript.

## Pages

- `/` — family-focused placement and contact experience
- `/privacy.html` — privacy notice
- `/404.html` — Cloudflare Pages not-found experience

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

The `_headers`, `404.html`, `robots.txt`, `site.webmanifest`, and `sitemap.xml` files are ready for Cloudflare Pages.

## Architecture

The site intentionally has no build step, framework, tracking scripts, third-party fonts, or runtime dependencies. The contact form prepares a message in the visitor's email application; it does not store information on the site.

The site is intentionally focused on families seeking assisted living or memory care guidance. It does not simulate accounts, messaging, matching, or other backend features.

## Publishing workflow

All website changes should be committed to Git and pushed to the `main` branch.
