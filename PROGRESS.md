# ICHAB — Build Progress Log

## Joriy holat: 7-bosqich (Public sahifalar) — keyingi

---

## ✅ 1-BOSQICH — Repo Skeleti (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar
- `docker-compose.yml` — PostgreSQL 16, Redis 7, Django, Next.js, Nginx (prod profil)
- `.env.example` — barcha muhit o'zgaruvchilari
- `.gitignore` — Python/Node/Docker/OS
- `backend/config/settings/` — `base`, `development`, `production`, `test` sozlamalari
- `backend/config/urls.py` — `/api/v1/` prefiksi bilan barcha 9 app + JWT endpointlar
- `backend/requirements.txt` — Django>=5, DRF, SimpleJWT, psycopg2, Celery, pytest
- `backend/Dockerfile`, `frontend/Dockerfile`, `nginx/nginx.conf`
- `README.md` — o'rnatish, arxitektura, API jadval

---

## ✅ 2-BOSQICH — Modellar va Migratsiyalar (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar
- `core/models.py` — 4 ta abstract baza: `TimeStampedModel`, `TranslatedModel`, `OrderedModel`, `ActiveModel`
- 9 domen app to'liq modeli (har biri 3-tilli: _uz / _ru / _en)
- Barcha app uchun `admin.py` (inline, list_editable, search, filter)
- `migrations/0001_initial.py` — barcha 9 app
- `django check` — 0 xato ✓ | `migrate` SQLite — barcha 9 app ✓

| App | Modellar |
|-----|----------|
| divisions | `Division` (slug, 3-til, logo, rahbar, kontakt) |
| products | `ProductCategory` (ierarxik), `Product` (JSON specs), `ProductImage` |
| services | `Service` (division FK), `ServiceImage` |
| certificates | `Certificate` (rasm+PDF, xalqaro/milliy) |
| partners | `Partner` (logo, website, is_featured) |
| projects | `Project` (division FK), `ProjectImage` |
| stats | `Statistic` (int value + suffix) |
| pages | `PageContent` (key-based flexible blocks) |
| leads | `Lead` (status: new/in_progress/done/spam) |

---

## ✅ 3-BOSQICH — DRF Serializers + ViewSets + API URLs (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar

**Shared core:**
- `core/serializers.py` — `TranslatedSerializerMixin` (`?lang=uz|ru|en`), `ImageFieldAbsoluteURL`, `FileFieldAbsoluteURL`
- `core/views.py` — `PublicReadAdminWriteMixin` (GET=public, POST/PUT/DELETE=admin)

**Har app uchun (9 ta):**

| App | Serializer | ViewSet xususiyatlari |
|-----|-----------|----------------------|
| divisions | List/Detail/Write | `?lang=`, search, filter is_active |
| products | Category (ierarxik), Product List/Detail/Write, ProductImage | `?category=`, search, nested images |
| services | List/Detail/Write, ServiceImage | `?division=`, nested images |
| certificates | Read/Write | `?is_international=`, filter |
| partners | Read/Write | `?is_featured=`, filter |
| projects | List/Detail/Write, ProjectImage | `?division=`, nested images |
| stats | Read/Write | filter is_active, order |
| pages | Read/Write + `by-key/{key}` custom action | filter by key |
| leads | `LeadCreateSerializer` (public POST) + `LeadAdminSerializer` (admin GET/PATCH) | Telegram notify task |

**Testlar:**
- `tests/test_divisions_api.py` — 6 test
- `tests/test_leads_api.py` — 5 test
- **Natija: 11/11 PASSED ✓**

---

## ✅ 4-BOSQICH — Seed Data + To'liq API Test (DONE)

**Sana:** 2026-06-08

**Seed data (idempotent `python manage.py seed_data`):**

| Model | Yozuvlar |
|-------|----------|
| Division | 5 (PLC/SCADA, Sensorlar, Elektr, Loyihalar, Xizmat) |
| ProductCategory | 10 (ierarxik) |
| Product | 5 |
| Service | 6 |
| Certificate | 4 |
| Partner | 6 |
| Project | 4 |
| Statistic | 4 |
| PageContent | 5 |

**Testlar: 29/29 PASSED ✓**

---

## ✅ 5-BOSQICH — Next.js Skeleti + Tailwind + 3 Tema + i18n (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar
- `frontend/package.json` — next 14.2.5, next-intl 3.17+, next-themes, framer-motion, zustand, TanStack Query
- `frontend/next.config.mjs` — next-intl plugin, image remotePatterns, API rewrite
- `frontend/tailwind.config.ts` — semantic tokenlar: surface/content/accent/border (CSS var orqali)
- `frontend/src/app/globals.css` — 3 tema CSS custom properties:
  - `[data-theme="midnight"]` — Midnight Industrial (dark, cyan)
  - `[data-theme="light"]` — Pure Light (white, blue)
  - `[data-theme="cyber"]` — Cyber Aurora (dark, purple/green)
  - `.glass-card`, `.neon-border`, `.text-gradient`, `.gradient-bg` utilities
- `frontend/src/i18n/request.ts` — next-intl async `requestLocale` pattern
- `frontend/src/middleware.ts` — locale routing `localePrefix: "always"`
- `frontend/messages/{uz,ru,en}.json` — to'liq tarjimalar (nav, hero, footer, common...)
- `frontend/src/types/api.ts` — TypeScript interfeyslari (barcha Django API responses)
- `frontend/src/lib/utils.ts` — `cn()`, `formatDate()`, `mediaUrl()`, `truncate()`
- `frontend/src/lib/api-client.ts` — typed fetch wrapper, barcha endpointlar
- `frontend/src/store/ui.store.ts` — Zustand (mobileMenuOpen, searchQuery)
- `frontend/src/components/ui/` — Button, Card, Badge
- `frontend/src/components/shared/` — ThemeSwitcher, LangSwitcher
- `frontend/src/app/[locale]/layout.tsx` — locale layout (ThemeProvider + NextIntlClientProvider)
- `frontend/src/app/[locale]/page.tsx` — hero stub + `generateStaticParams`

**Build natija:** `npm run build` — barcha 3 locale statik ✓

---

## ✅ 6-BOSQICH — Layout Komponentlar: Header + Footer (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar

**`frontend/src/components/layout/Header.tsx`** (Client Component):
- Sticky header: scrollda `glass-card` + `backdrop-blur-xl` effekti
- Desktop nav: barcha 9 sahifa havolasi, faol link highlighted
- Logo: IC monogram + ICHAB nomi
- O'ng taraf: LangSwitcher + ThemeSwitcher
- Mobile: hamburger → slide-out drawer (Zustand state orqali)
- Mobile drawer: nav linklar + LangSwitcher + ThemeSwitcher
- Avtomatik yopilish route o'zgarganda

**`frontend/src/components/layout/Footer.tsx`** (Server Component — async):
- 3 ustunli grid: Brand + Quick Links + Contact
- `getLocale()` + `getTranslations()` — server-side next-intl
- Manzil, telefon, email kontaktlar
- Copyright + "Made with ♥"

**`frontend/src/app/[locale]/layout.tsx`** yangilandi:
- Header + main + Footer wrapper

**Build natija:** `npm run build` — 6/6 statik sahifa ✓

---

## ✅ 7-BOSQICH — Public Sahifalar (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar

**Yangi komponentlar:**
- `components/sections/StatsSection.tsx` — IntersectionObserver + requestAnimationFrame animated counter
- `components/sections/DivisionsPreview.tsx` — hover+glow cards with Image
- `components/sections/ServicesPreview.tsx` — icon + description cards
- `components/sections/PartnersMarquee.tsx` — CSS keyframes infinite scroll, pause-on-hover
- `components/providers/QueryProvider.tsx` — TanStack Query client wrapper

**Sahifalar (har biri 3 tilda statik):**

| Sahifa | Tur | Xususiyatlar |
|--------|-----|-------------|
| `/` | SSG | Hero + grid lines + animated stats + divisions preview + services + partners marquee + CTA |
| `/about` | SSG | `pages` API dan `about_mission/vision/history` kontenti |
| `/divisions` | SSG | 3-ustunli grid, cover image, leader info |
| `/divisions/[slug]` | SSR dynamic | Cover overlay + sidebar kontaktlar |
| `/services` | SSG | Grid cards, icon, price |
| `/products` | SSG + Client | TanStack Query, search input, category filter buttons, skeleton loading |
| `/projects` | SSG | 2-ustunli grid, client/location/result |
| `/certificates` | SSG | International/National bo'limlari, PDF download link |
| `/partners` | SSG | 5-ustunli grid, logo/website |
| `/contact` | SSG + Client | `ContactForm` — Zustand-free, native React state, validation, success state |

**globals.css yangiliklari:**
- `.form-input` utility (CSS var orqali styling)
- `.marquee-track` keyframe animation
- `.line-clamp-2`, `.line-clamp-3` utilities

**`mediaUrl` fix:** `string | null` → `string` (returns `""` for null)

**Build natija:** `npm run build` — 30/30 sahifa ✓ (27 SSG + 3 dynamic)

---

## ✅ 8-BOSQICH — Animatsiyalar + Premium Effektlar (DONE)

**Sana:** 2026-06-08

### Qilingan ishlar

**Animatsiya tizimi (`src/lib/motion.ts`):**
- `fadeUp`, `fadeIn`, `fadeLeft`, `fadeRight`, `scaleIn` — scroll-triggered variants
- `staggerContainer`, `staggerFast` — ketma-ket paydo bo'lish
- `VIEWPORT` — `once: true, margin: "-80px"` standart sozlama

**Reusable komponentlar:**
- `Reveal` — istalgan elementni scroll-trigger bilan animatsion qiluvchi wrapper (variant: up/in/left/right/scale, delay prop)
- `StaggerGrid` + `StaggerItem` — grid uchun stagger animatsiya
- `TiltCard` — mouse harakatiga 3D tilt + glare effekti (useMotionValue + useSpring)
- `PageTransition` — sahifalar o'rtasida `AnimatePresence` bilan smooth fade+slide

**HeroSection (yangi animatsion komponent):**
- `useScroll` + `useTransform` — parallax: bg +30%, orbs ±40/60%, kontent +15%
- Floating gradient orbs — `animate scale/opacity` + parallax Y
- Pulsating badge dot
- Animated gradient text (backgroundPosition keyframe)
- Stagger: badge → h1 → subtitle → CTAs → scroll hint
- CTA buttonlar: `whileHover scale` + `whileTap scale`
- Floating tech badges (PLC/SCADA/HMI/VFD/IoT) — stagger + hover slide

**Section animatsiyalar:**
- `StatsSection` — stagger cards + icon wobble animate
- `DivisionsPreview` — TiltCard + stagger grid + glare overlay
- `ServicesPreview` — hover lift + icon shake on hover
- `PartnersMarquee` — hover scale/lift on each partner card

**Locale layout:** `PageTransition` wrapper — sahifalar o'rtasida opacity+y transition

**Build:** 30/30 sahifa ✓

---

## ⏳ KEYINGI BOSQICHLAR

| # | Bosqich | Holat |
|---|---------|-------|
| 9 | Admin panel (React, JWT auth, CRUD barcha modellar) | **Keyingi** |
| 10 | Yakuniy test, Lighthouse, responsive tekshiruv | Kutmoqda |
