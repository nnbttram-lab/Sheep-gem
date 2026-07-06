# Making the CMS Live on Your Netlify Site

This connects `admin.html`'s replacement — a proper live editor at **yoursite.com/admin** — directly to
your deployed site. Edit content there, click Publish, and the live site updates automatically
(Netlify rebuilds it for you). No more downloading files and re-dragging folders.

The pieces already built into your project folder:

- `content/site-content.json` — the single source of truth for all site text/prices/links.
- `admin/index.html` + `admin/config.yml` — Decap CMS (a free, open-source editor) configured
  with a form matching your site's content.
- `js/main.js` — already updated to load `content/site-content.json` at runtime.
- `netlify.toml` — tells Netlify how to publish the site.

Everything below this point is steps only you can do, since they require your own GitHub and
Netlify accounts.

## 1. Put the code in a GitHub repository

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `sheep-gem-site`). Keep it Public or Private, either works.
2. On the new repo's page, click **"uploading an existing file"**.
3. Drag in everything from your `website` folder **except** the `.docx` handbook and the old `.zip` files (they're not needed for the live site).
4. Commit the files (the green "Commit changes" button).

## 2. Point config.yml at your new repo

1. Open `admin/config.yml` in a text editor.
2. Change this line:
   ```
   repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
   ```
   to your actual GitHub username and the repo name you just created, e.g.:
   ```
   repo: tramnguyen/sheep-gem-site
   ```
3. Save, then upload this one changed file to the same GitHub repo (Add file > Upload files, drag `config.yml` into the `admin` folder, commit). If GitHub asks, replace the existing file.

## 3. Connect your Netlify site to that repo

1. Open your site on [app.netlify.com](https://app.netlify.com).
2. Go to **Project configuration → Build & deploy → Continuous deployment → Repository**.
3. Click **Link repository**, choose GitHub, and select the repo from step 1.
4. Leave build command empty and publish directory as `.` (this matches `netlify.toml`).

From now on, any change pushed to that GitHub repo — including ones made through the CMS —
automatically redeploys your live site.

## 4. Let people log in to the CMS with GitHub

Decap CMS needs a way to check that whoever opens `/admin` is allowed to edit. The simplest
setup uses Netlify as a GitHub login broker:

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**.
2. Fill in:
   - **Application name**: anything, e.g. "Sheep Gem CMS"
   - **Homepage URL**: your Netlify site URL (e.g. `https://sheep-gem.netlify.app`)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Click **Register application**, then copy the **Client ID** and generate/copy a **Client Secret**.
4. Back in Netlify: **Project configuration → General → Access → OAuth** (sometimes shown under
   "Identity" depending on your Netlify UI version) → **GitHub** → paste in the Client ID and
   Client Secret → enable it.

## 5. Use it

Visit `https://your-site.netlify.app/admin`, log in with your GitHub account, and edit away.
Every save creates a commit in your GitHub repo and triggers a new Netlify deploy — check the
"Deploys" tab on Netlify to watch it happen (usually live within a minute).

## What still works the old way

- `admin.html` (at the site root) still works as a quick offline editor with a live preview —
  handy for drafting copy before you're near a computer with GitHub access. Its "Download" button
  still produces a `site-content.js` file, which is only used as a fallback for local double-click
  previews of `index.html` — it does **not** feed the live site. To get changes onto the live site,
  make them through `/admin` (Decap CMS) instead, or manually edit `content/site-content.json` in
  GitHub.
