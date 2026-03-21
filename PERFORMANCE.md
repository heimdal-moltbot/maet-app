# Mæt MVP — Performance Rapport

**Dato:** 2026-03-21  
**Status:** Klar til Vercel deployment + Lighthouse audit

---

## Bundle Analysis

| Route | Size | First Load JS |
|-------|------|--------------|
| `/opskrifter` | 9 KB | 105 KB |
| `/opskrifter/[slug]` | 2.3 KB | 98.3 KB |
| `/onboarding` | 58 KB | 145 KB |
| `/madplan` | 2 KB | 98 KB |
| `/indkoebsliste` | 2.2 KB | 90 KB |
| Shared JS | — | 87.3 KB |

**Note:** `/onboarding` er 58KB page — skyldes inline mock-data og kompleks state. Acceptabelt for MVP.

---

## Optimeringstiltag (implementeret)

- ✅ `recipes-index.json` (43KB) til opskriftsliste — 82% reduktion vs. all-recipes.json (243KB)
- ✅ `all-recipes.json` (243KB) kun loadet på detalje-sider (SSG — bundled pr. side)
- ✅ `compress: true` i next.config.mjs
- ✅ Image optimization konfigureret (avif/webp, mobile device sizes)
- ✅ `optimizePackageImports` for Supabase
- ✅ Static generation (SSG) for alle 97 opskrift-detalje-sider
- ✅ Service Worker cacher statiske assets (cache-first)

---

## Lighthouse Målsætninger (kør på live URL)

| Metric | Mål | Estimeret (uden netværk) |
|--------|-----|--------------------------|
| Performance | > 90 | ~85-92 (SSG + compression) |
| Accessibility | > 90 | ~88 (mangler aria-labels) |
| Best Practices | > 90 | ~92 |
| SEO | > 80 | ~85 |

**Bekymringer:**
- `onboarding` route er 145KB first load — over ideelt men acceptabelt
- Ingen `alt` tags på emoji-billeder — påvirker accessibility

---

## Deployment (klar)

```bash
# GitHub repo: https://github.com/heimdal-moltbot/maet-app
# Deploy via vercel.com/new → Import heimdal-moltbot/maet-app

# Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

**Post-deploy Lighthouse URL:**
`https://pagespeed.web.dev/analysis?url=https://din-url.vercel.app`

---

## Accessibility Forbedringer (til post-MVP)

- [ ] Tilføj `aria-label` til emoji-ikoner og knapper uden tekst
- [ ] Tilføj `role="main"` til primært indholdsområde
- [ ] Skip-navigation link til screen readers
- [ ] Fokus-management i onboarding-flow
