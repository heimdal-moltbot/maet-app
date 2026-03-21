# Mæt MVP — Teknisk QA Checkliste

**Dato:** 2026-03-21  
**Build:** `npm run build` ✅ (verificeret)  
**GitHub:** https://github.com/heimdal-moltbot/maet-app

---

## Pre-deployment Tjek

- [x] `npm run build` — 0 fejl, 0 type errors
- [x] Alle routes renderer korrekt
- [x] 50 statiske opskrift-sider genereret
- [x] `vercel.json` konfigureret med CDG1 region + security headers
- [x] GitHub Actions CI workflow oprettet

---

## Funktionel QA (kør på live URL)

### Auth Flow
- [ ] `/` → landing-side vises
- [ ] `/signup` → opret ny konto → redirect til `/onboarding`
- [ ] `/login` → log ind med eksisterende konto → redirect til `/dashboard`
- [ ] `/login` → forkert adgangskode → fejlbesked vises
- [ ] Ikke-logget bruger forsøger `/dashboard` → redirect til `/login`
- [ ] Logget bruger besøger `/login` → redirect til `/dashboard`

### Onboarding
- [ ] Step 1: Vælg husstandsstørrelse 1-5 + "6 eller flere"
- [ ] Step 2: Vælg kostrestriktioner (2-kolonne grid)
- [ ] Step 2: Vælg madpræferencer (separat sektion)
- [ ] Step 2: "Ingen særlige ønsker" deselekterer andre
- [ ] Step 3: Familienavn-inputfelt fungerer
- [ ] Step 3: Sammenfatning viser korrekte valg
- [ ] "Kom i gang! 🚀" → gem + redirect til `/dashboard`
- [ ] Progress-dots viser korrekt step (3 steps)

### Dashboard
- [ ] Ugeoversigt vises med dage og retter
- [ ] "Generer ugeplan" knap er synlig
- [ ] Link til opskrift-detalje fra dagens ret
- [ ] Quick-action til indkøbsliste fungerer

### Opskrifter
- [ ] 100 opskrifter vises i 2-kolonne grid
- [ ] Søgefelt filtrerer i realtid
- [ ] Filter-chips (Alle/Vegansk/Vegetarisk/Glutenfri/Hurtig) fungerer
- [ ] Klik på opskrift → navigerer til `/opskrifter/[slug]`

### Opskrift Detalje
- [ ] Titel, beskrivelse, stats vises
- [ ] Ingrediensliste vises med mængder
- [ ] Fremgangsmåde vises som nummererede trin
- [ ] Allergen-advarsel vises for relevante opskrifter

### Madplan / Ugeplans-generator
- [ ] 7-dages kalender vises
- [ ] "✨ Generer" kalder API og opdaterer planen
- [ ] × fjerner enkelt ret fra dag
- [ ] Generer igen → ny plan
- [ ] "Genér indkøbsliste" navigerer til `/indkoebsliste`

### Indkøbsliste
- [ ] API kaldes ved sideload → ingredienser vises
- [ ] Kategorier vises (Kød & Fisk, Grøntsager, Mejeri, Tørvarer, etc.)
- [ ] Kategori-filter fungerer
- [ ] Check-off en vare → streg + grøn hak + sorteres til bunden
- [ ] Progress-bar opdateres
- [ ] "Nulstil afkrydsede" nulstiller

### Profil
- [ ] E-mail og metadata vises
- [ ] "Rediger" links til onboarding
- [ ] "Log ud" → sign out → redirect til `/`

### PWA
- [ ] `manifest.json` serveres korrekt (200)
- [ ] App kan installeres fra Chrome (desktop) / Safari (iOS)
- [ ] `sw.js` registreres korrekt

---

## Performance Tjek (Lighthouse)

Kør Lighthouse på live URL — mål:
- Performance: > 75
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

---

## Security Headers (kør på https://securityheaders.com)

- [ ] X-Content-Type-Options: nosniff ✅
- [ ] X-Frame-Options: DENY ✅
- [ ] X-XSS-Protection: 1; mode=block ✅
- [ ] Referrer-Policy: strict-origin-when-cross-origin ✅

---

## Deployment Trin

1. Gå til https://vercel.com/new
2. Import `heimdal-moltbot/maet-app`
3. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://placeholder.supabase.co` (eller real URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `placeholder` (eller real key)
4. Deploy → live URL
5. Kør QA-checkliste på live URL

*Auth-features kræver real Supabase credentials.*
*Opskrifter, generator og indkøbsliste fungerer uden Supabase.*
