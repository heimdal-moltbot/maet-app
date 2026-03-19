# Maet - Madplanlaegning for familier

Maet er en dansk webapp til familiemadplanlaegning. Planlaeg ugens maaltider, saml opskrifter og generer indkoebslister automatisk.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Sprog:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **Deployment:** Vercel (CDG1 region)

## Kom i gang

### 1. Installer dependencies

```bash
npm install
```

### 2. Opsaet environment variables

Kopiér `.env.example` til `.env.local` og udfyld med dine Supabase-credentials:

```bash
cp .env.example .env.local
```

Rediger `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://dit-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-noegle
```

### 3. Opsaet Supabase database

Koer migrationen i Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

### 4. Start udviklingsserveren

```bash
npm run dev
```

Aaben [http://localhost:3000](http://localhost:3000) i din browser.

## Projektstruktur

```
src/
  app/
    (auth)/           # Login og signup sider
    (dashboard)/      # Dashboard med madplan, opskrifter, etc.
    actions/          # Server actions (auth)
  components/
    ui/               # Genanvendelige UI-komponenter
    navigation/       # Navbar og Sidebar
  lib/
    supabase/         # Supabase client konfiguration
supabase/
  migrations/         # Database migrationer
```

## Scripts

- `npm run dev` - Start udviklingsserver
- `npm run build` - Byg til produktion
- `npm run start` - Start produktionsserver
- `npm run lint` - Koer ESLint
