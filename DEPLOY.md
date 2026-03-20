# Mæt — Deploy Runbook

**Status:** ✅ Klar til deployment  
**Build:** Verificeret ren (npm run build — 0 fejl)  
**Data:** 100 opskrifter statisk genereret (ingen Supabase nødvendig til demo)

---

## Hurtig Deploy (Static Demo — ingen Supabase)

Appen fungerer med mock data og statiske opskrifter **uden** Supabase credentials. Brug denne til hurtig demo/preview.

### Option A: Vercel CLI

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login (åbner browser)
vercel login

# 3. Deploy fra projekt-mappen
cd /Users/heimdal/.openclaw/workspaces/maet/projects/maet-app
vercel

# Følg prompterne:
# - Link to existing project? No
# - Project name: maet-app (eller andet)
# - Override settings? No
# → Du får en preview URL

# 4. Deploy til produktion
vercel --prod
```

### Option B: GitHub → Vercel (anbefalede)

1. Push kode til GitHub:
```bash
cd /Users/heimdal/.openclaw/workspaces/maet/projects/maet-app
git init
git add .
git commit -m "Mæt MVP — initial deploy"
git remote add origin https://github.com/<din-github>/maet-app.git
git push -u origin main
```

2. Gå til [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. Vælg repo → Framework: Next.js (auto-detected) → Deploy
4. Appen er live på `https://maet-app-xxx.vercel.app`

**Env vars til static demo (ingen Supabase):**
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```
*(Auth vil ikke fungere, men opskrifter og UI er tilgængeligt)*

---

## Fuld Deploy (Med Supabase Auth)

### Trin 1: Supabase Cloud Projekt

1. [supabase.com](https://supabase.com) → New Project
2. Navn: `maet-mvp`, Region: `eu-central-1`, Password: stærkt password
3. Vent ~2 min

**Kopiér fra Project Settings → API:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Trin 2: Database Schema

```bash
cd /Users/heimdal/.openclaw/workspaces/maet/projects/maet-app
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Alternativt: kør `supabase/migrations/001_initial_schema.sql` i Supabase SQL Editor.

### Trin 3: Opskriftsdata Import (100 opskrifter)

```bash
cd /Users/heimdal/.openclaw/workspaces/maet/cto/mvp/maet-app
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
EOF

# Batch 1
npx ts-node --compiler-options '{"module":"CommonJS"}' \
  src/lib/etl/run-import.ts \
  --file /Users/heimdal/.openclaw/workspaces/maet/data/opskrifter-batch1.csv \
  --source cpo-batch1

# Batch 2
npx ts-node --compiler-options '{"module":"CommonJS"}' \
  src/lib/etl/run-import.ts \
  --file /Users/heimdal/.openclaw/workspaces/maet/data/opskrifter-batch2.csv \
  --source cpo-batch2
```

### Trin 4: App Environment Variables

`/projects/maet-app/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Trin 5: Deploy til Vercel

```bash
cd /Users/heimdal/.openclaw/workspaces/maet/projects/maet-app
vercel --prod
```

Tilføj env vars i Vercel Dashboard: `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Trin 6: Supabase Auth Callback

Supabase dashboard → Authentication → URL Configuration:
```
Site URL: https://maet-app.vercel.app
Redirect URLs: https://maet-app.vercel.app/auth/callback
```

---

## Post-Deploy Checklist

- [ ] `/opskrifter` viser opskrifter ✓ (static, fungerer altid)
- [ ] `/opskrifter/pasta-bolognese` viser detaljer ✓ (static)
- [ ] `/login` → opret bruger → `/onboarding` → `/dashboard` (kræver Supabase)
- [ ] PWA installérbar (manifest.json + HTTPS)

---

## Kontakt

Tekniske spørgsmål → CTO-rollen via AOP  
*Estimeret fuld deploy-tid: ~30 minutter*
