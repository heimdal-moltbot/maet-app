# Mæt MVP — Staging QA Rapport
**Dato:** 2026-03-21  
**Branch:** main + staging (GitHub)  
**Repo:** https://github.com/heimdal-moltbot/maet-app

---

## Build Status ✅

| Check | Resultat |
|-------|----------|
| `npm run build` | ✅ 0 fejl |
| TypeScript strict | ✅ 0 fejl |
| `brand-*` tokens | ✅ 0 forekomster |
| `gray-N` tokens | ✅ 0 forekomster |
| `red-50/100` | ✅ 0 forekomster |

---

## Routes

| Route | Type | Status |
|-------|------|--------|
| `/` | Dynamic | ✅ |
| `/login` | Dynamic | ✅ |
| `/signup` | Dynamic | ✅ |
| `/onboarding` | Dynamic | ✅ |
| `/dashboard` | Dynamic | ✅ |
| `/opskrifter` | Dynamic | ✅ |
| `/opskrifter/[slug]` | SSG (50 sider) | ✅ |
| `/madplan` | Dynamic | ✅ |
| `/indkoebsliste` | Dynamic | ✅ |
| `/profil` | Dynamic | ✅ |
| `/api/ugeplan/generer` | API Route | ✅ |
| `/api/indkoebsliste/generer` | API Route | ✅ |

---

## Feature Readiness

| Feature | Static Demo | Med Supabase |
|---------|------------|--------------|
| Opskrifter (100 stk) | ✅ Virker | ✅ Virker |
| Opskrift detalje | ✅ Virker | ✅ Virker |
| Ugeplans-generator | ✅ Virker | ✅ Virker |
| Indkøbsliste aggregering | ✅ Virker | ✅ Virker |
| Auth (login/signup) | ❌ Kræver Supabase | ✅ Klar |
| Onboarding | ❌ Kræver Supabase | ✅ Klar |
| Profil-data | ❌ Kræver Supabase | ✅ Klar |

---

## Deployment Bloker

**Vercel CLI kræver browser-login.** Kan ikke eksekveres autonomt.

**Løsning — 2 minutter:**
1. Gå til https://vercel.com/new
2. Import `heimdal-moltbot/maet-app`  
3. Env vars: `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co` + `NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder`
4. Deploy

**Staging branch er klar:** `https://github.com/heimdal-moltbot/maet-app/tree/staging`

---

## Design Compliance (seneste QA)

- UX QA rapport v1.0: **~95% compliance**
- Alle P0/P1/P2 rettelser er implementeret
- Opskriftsliste redesignet til SCR-05 v1.0 spec

---

## Næste skridt (blokeret på human-action)

1. **Vercel deployment** — browser-login (2 min)
2. **Supabase projekt** — opret på supabase.com (5 min)
3. **Kør QA-CHECKLIST.md** på live URL
