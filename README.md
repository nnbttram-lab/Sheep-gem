# Sheep Gem — Landing Page

A static landing page for the Sheep Gem feng shui stone business, with a live, Git-backed CMS.

## Preview

Double-click `index.html` to open it in your browser locally, or visit your live Netlify URL.

## Structure

```
index.html                 Landing page markup
admin.html                  Offline draft editor (local-only, does not touch the live site)
admin/index.html            Live CMS (Decap CMS) — deployed at yoursite.com/admin
admin/config.yml             Field schema for the live CMS
css/style.css                Landing page styles
css/admin.css                 Offline editor styles
js/main.js                   Renders content into index.html (fetches JSON, or falls back to bundled JS)
js/admin.js                  Powers the offline editor form
content/site-content.json   Canonical content — edited live via /admin, read by the live site
content/site-content.js     Fallback content snapshot used only for local file:// preview
netlify.toml                 Netlify publish config
LIVE_CMS_SETUP.md           Step-by-step guide to connect GitHub + Netlify + the live CMS
```

## Editing content

- **Live site, once set up** (see `LIVE_CMS_SETUP.md`) — go to `yoursite.com/admin`, log in with GitHub, edit, publish. The live site rebuilds automatically.
- **Offline draft** — open `admin.html` locally for a quick editor with live preview. Its download button only updates the local fallback file, not the live site.
- **Direct edit** — open `content/site-content.json` (for the live site) or `content/site-content.js` (for local fallback) in any text editor.

## Going live

See `LIVE_CMS_SETUP.md` for the one-time setup: creating a GitHub repo, connecting it to Netlify, and enabling GitHub login for the CMS.

## Next steps

- Add real product photography and copy review.
- Wire the newsletter form and contact form to an actual email service.
- Reconcile against the original architecture/schema doc if there were decisions there not yet reflected here (e.g. product catalog structure, additional integrations).
