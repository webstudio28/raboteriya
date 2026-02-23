# Environment + deployment concerns

How to handle secrets and subfolder hosting so the template is safe and portable.

---

## 1) Use `.env` + global data for secrets/keys

This repo loads `.env` via `dotenv` and exposes values through `addGlobalData()`.

Template rule:

- never hardcode secrets inside templates
- expose only what the frontend truly needs (public keys ok; private keys never)

---

## 2) Support `pathPrefix` for subfolder hosting

`.eleventy.js` resolves `pathPrefix` from environment variables and uses the `url` filter in templates.

Template rule:

- always use `{{ '/path/' | url }}` for internal links and asset paths
