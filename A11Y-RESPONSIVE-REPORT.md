# A11y & Responsivt Review — Mæt Frontend

**Dato:** 26. marts 2026  
**Udført af:** Frontend Developer  
**Commits:** 8920564 → d4be0b6 (5 commits)  
**Status:** ✅ Komplet

---

## Accessibility (A11y) — 3 passes

### Pass 1 (commit 8920564)
- `RecipeDetailClient`: `aria-label` på gem-knap, `aria-label` + `aria-live` på portionstæller, `aria-label` + `aria-current="step"` på trin-navigation dots
- `opskrifter/page`: `aria-label` på ryd-søgning-knap og favorit-knapper (dynamisk med opskriftstitel)
- `indkoebsliste/page`: `aria-label` på opdater-knap, skift-uge-knap; `aria-pressed` + `aria-label` på varecheckboxes

### Pass 2 (commit 032a661)
- `madplan/page`: `aria-busy` + `aria-label` på generer-knap, `aria-label` på uge-navigator (forrige/næste uge), kontekstuel `aria-label` på fjern-knapper
- `dashboard/page`: `aria-label="Notifikationer"` på notifikationsknap
- **Ny:** `Skeleton.tsx` komponent med `role="status"` og `aria-busy="true"` — 3 varianter: `RecipeCardSkeleton`, `ShoppingCategorySkeleton`, `MealPlanDaySkeleton`
- `indkoebsliste/page`: Erstattede simple pulse-divs med `ShoppingCategorySkeleton` (korrekt a11y)
- **Ny:** `lib/utils.ts` med `cn()` helper

### Pass 3 (commit 0f37ec7)
- `BottomNav`: `aria-label="Primær navigation"` på `<nav>`, `aria-current="page"` på aktiv tab, `aria-hidden="true"` på emoji-ikoner
- `profil/page`: Kontekstuelle labels — "Rediger husstand" og "Rediger kostpræferencer"
- `onboarding/page`: `role="progressbar"` med `aria-valuenow/min/max/label`; `role="radiogroup"` + `role="radio"` + `aria-checked` på husstandsknapper
- `RecipeDetailClient`: `aria-label="Tilbage til opskrifter"` på tilbage-link
- `Navbar`: `aria-label="Primær navigation"`

---

## Responsivt Review — Fund & Fixes

### Desktop layout (md: 768px+) — commit 5d65b4d

**Problem 1:** `BottomNav` var synlig på desktop, men `Navbar` er desktop-only nav.  
→ **Fix:** `BottomNav` tilføjet `md:hidden` — vises kun på mobile.

**Problem 2:** Alle dashboard-pages brugte `pt-12` (48px) til header clearance, men Navbar er `h-14` (56px) på md+.  
→ **Fix:** Alle 5 dashboard-pages: `pt-12 md:pt-20`

**Problem 3:** `<main>` i dashboard layout havde `pb-16` på alle viewports, men BottomNav er ikke synlig på desktop.  
→ **Fix:** `pb-16 md:pb-0`

### Madplan sticky indkøbslistknap — commit d4be0b6

**Problem:** Sticky indkøbslistknap placeret `bottom-16` (over BottomNav) — på desktop er BottomNav skjult, så `bottom-16` efterlader unødvendigt gap.  
→ **Fix:** `bottom-16 md:bottom-0`

---

## Status per flow

| Flow | A11y | Responsivt |
|------|------|-----------|
| Dashboard | ✅ | ✅ |
| Madplan | ✅ | ✅ |
| Opskrifter (liste) | ✅ | ✅ |
| Opskrifter (detalje) | ✅ | ✅ |
| Indkøbsliste | ✅ | ✅ |
| Profil | ✅ | ✅ |
| Onboarding | ✅ | ✅ |
| Login/Signup | ✅ (labels allerede korrekte) | ✅ |

---

## Næste skridt

- [ ] Visuel QA med UX på echte browser (mangler Supabase credentials til deployment)
- [ ] WCAG AA farvekontrast-verifikation (kræver browser-tool)
- [ ] Keyboard-navigation end-to-end test
- [ ] Design system finalisering (afventer UX-svar i møde #8)
