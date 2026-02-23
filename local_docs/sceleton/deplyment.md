# Deployment settings — two approaches

Use **one** of these. The repo currently has:
- **`.github/workflows/deploy.yml`** → cPanel (FTP) deploy
- **`.github/workflows/deploy.txt`** → GitHub Pages workflow (kept as `.txt` so it doesn’t run; copy to `.yml` when you want it)

---

## Approach A: Deploy to GitHub Pages (direct to GitHub)

**Use this when:** The site should be hosted on GitHub Pages (e.g. `username.github.io/advokatgeorgiev` or a custom domain).

**Do this:**

1. **Enable GitHub Pages in the repo**
   - Repo → **Settings** → **Pages**
   - **Source**: GitHub Actions (not “Deploy from a branch”).

2. **Add the workflow file**
   - Create or replace `.github/workflows/deploy-pages.yml` (or rename `deploy.txt` → `deploy-pages.yml`).
   - Paste the workflow below. If the repo name is not `advokatgeorgiev`, change `PATH_PREFIX` in the `build` job `env` to `'/your-repo-name'`.

3. **Optional: avoid running both workflows**
   - If you use **only** GitHub Pages: you can remove or rename `deploy.yml` so the cPanel workflow doesn’t run.
   - If you want both available: keep `deploy.yml` for cPanel and use a different filename for the Pages workflow (e.g. `deploy-pages.yml`); disable the one you don’t use via **Actions** tab or by deleting its file.

**Workflow (Approach A — GitHub Pages):**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PATH_PREFIX: '/advokatgeorgiev'   # change to '/your-repo-name' if different
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build CSS
        run: npm run css:build

      - name: Build site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Notes:**
- `.eleventy.js` reads `PATH_PREFIX` from the environment; the build step sets it so asset and link URLs work under `username.github.io/advokatgeorgiev/`.
- No secrets required for public GitHub Pages.

---

## Approach B: Deploy to cPanel (FTP) — legacy / external host

**Use this when:** The site is hosted on a cPanel server (or any host that offers FTP/FTPS).

**Do this:**

1. **Keep the existing workflow**
   - The file `.github/workflows/deploy.yml` in this repo is already the cPanel workflow. Leave it as-is if you deploy to cPanel.

2. **Configure repository secrets**
   - Repo → **Settings** → **Secrets and variables** → **Actions**
   - Add:
     - `CPANEL_HOST` — FTP host (e.g. `ftp.yourdomain.com` or your cPanel server address)
     - `CPANEL_USER` — FTP username
     - `CPANEL_PASS` — FTP password
   - Optional:
     - `CPANEL_PROTOCOL`: `ftp` or `ftps` (default `ftp`)
     - `CPANEL_PORT`: e.g. `21` (default `21`)
     - `CPANEL_SERVER_DIR`: remote folder, e.g. `public_html/` or `advokatgeorgiev/`
     - `MAIL_KEY`: for contact/inquiry forms (if the site uses it)

3. **Push to `main`**
   - Push (or merge) to `main` triggers the workflow: build then FTP upload of `_site/` to the server.

**Workflow (Approach B — cPanel/FTP):**

```yaml
name: "Deploy to cPanel"
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: Deploy

    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build CSS
        run: npm run css:build
      - name: Build
        run: npm run build
        env:
          MAIL_KEY: ${{ secrets.MAIL_KEY }}

      - name: Ensure cPanel secrets present
        env:
          CPANEL_HOST: ${{ secrets.CPANEL_HOST }}
          CPANEL_USER: ${{ secrets.CPANEL_USER }}
          CPANEL_PASS: ${{ secrets.CPANEL_PASS }}
        run: |
          if [ -z "$CPANEL_HOST" ] || [ -z "$CPANEL_USER" ] || [ -z "$CPANEL_PASS" ]; then
            echo "One or more required secrets (CPANEL_HOST, CPANEL_USER, CPANEL_PASS) are missing." >&2
            exit 1
          fi
          if [ -z "${{ secrets.MAIL_KEY }}" ]; then
            echo "MAIL_KEY secret is missing (contact forms will be disabled)." >&2
          fi

      - name: Deploy to cPanel
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          protocol: ${{ secrets.CPANEL_PROTOCOL || 'ftp' }}
          port: ${{ secrets.CPANEL_PORT || 21 }}
          server: ${{ secrets.CPANEL_HOST }}
          username: ${{ secrets.CPANEL_USER }}
          password: ${{ secrets.CPANEL_PASS }}
          local-dir: _site/
          server-dir: ${{ secrets.CPANEL_SERVER_DIR || 'advokatgeorgiev/' }}
          dangerous-clean-slate: false
```

**Notes:**
- This action uses **FTP/FTPS** only (no SFTP). If your host only supports SFTP, you’d need a different action (e.g. SSH/SCP).
- `dangerous-clean-slate: false` keeps incremental sync (only changed files are uploaded).

---

## Quick choice

| Goal | Do this |
|------|--------|
| **Host on GitHub Pages** | Use **Approach A**: add the GitHub Pages workflow (e.g. copy `deploy.txt` → `deploy-pages.yml`), set `PATH_PREFIX` to your repo name, enable Pages in Settings → Pages. Optionally remove or disable the cPanel workflow. |
| **Host on cPanel / FTP** | Use **Approach B**: keep `deploy.yml`, set secrets `CPANEL_HOST`, `CPANEL_USER`, `CPANEL_PASS` (and optional ones). Push to `main` to deploy. |
