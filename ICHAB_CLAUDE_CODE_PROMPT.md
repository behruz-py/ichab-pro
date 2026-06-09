# ICHAB — Korporativ Web Platforma | Claude Code Build Specification

## 0. ROL VA REJIM
Sen senior fullstack arxitektor, UI/UX dizayner va DevOps muhandisisan. Bu loyihani
production-grade sifatda, bosqichma-bosqich quryapsan. Har bosqichda:
- Avval rejani ko'rsat, tasdiq kut (yoki davom et, agar aniq bo'lsa).
- Kod yoz -> o'zing test qil -> xatolarni tuzat -> KEYIN keyingi bosqichga o't.
- HECH QACHON bir faylda 300 qatordan oshib ketma. Modulyar bo'l.
- Har bosqich oxirida qisqa "DONE / NEXT" hisoboti ber.

## 1. KORXONA KONTEKSTI
**Nomi:** "Ishlab chiqarishni avtomatlashtirish boshqarmasi" (ICHAB)
**Soha:** Ishlab chiqarish va sanoatni avtomatlashtirish (PLC/SCADA, sanoat
avtomatizatsiyasi, sensorlar, boshqaruv tizimlari).
**Bozor:** O'zbekiston + xalqaro hamkorlar.
**Maqsad:** Reklama-prezentatsion sayt — hamkorlar va mijozlarni JALB qilish.
Tashrif buyuruvchi birinchi ekrandanoq "vau" effektini his qilishi va mijoz
bo'lishga ishtiyoq paydo bo'lishi shart.

## 2. TEXNOLOGIK STACK (qat'iy)
**Backend:** Python 3.12 + Django 5 + Django REST Framework + PostgreSQL +
JWT auth (SimpleJWT) + Redis (cache) + Celery (background tasks, optional).
**Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS +
Framer Motion (animatsiyalar) + Zustand (state) + TanStack Query (data fetching) +
next-intl (i18n) + next-themes (theme).
**Admin:** Custom React admin (saytga mos premium dizayn), DRF backend ustida —
to'liq CRUD.
**Infra:** Docker + docker-compose (har servis alohida konteyner).
.env orqali konfiguratsiya.

## 3. ARXITEKTURA TALABLARI (eng muhim)
- Monorepo: /backend va /frontend alohida.
- **Clean Architecture / modulyar:** har Django app — alohida domen
  (divisions, products, services, certificates, partners, projects, stats, pages).
- Har fayl KICHIK va TOZA bo'lsin (models, serializers, views, urls,
  services alohida fayllarda). Bir faylga hamma narsani tiqma.
- Frontend: feature-based papka tuzilishi, reusable komponentlar (atoms/molecules).
- Type-safe: backend API -> frontend TypeScript tiplari avtomatik mos.
- Kelajakda yangi bo'linma/mahsulot/kategoriya OSON qo'shilsin —
  hech qachon hardcode qilma, hammasi DB'dan keladi.

## 4. MA'LUMOTLAR MODELI (asosiy entitilar)
1. **Division (Tarkibiy bo'linma):** nomi, slug, tavsif (qisqa+to'liq),
   logo/rasm, rahbar, kontakt, tartib raqami, faol/nofaol.
2. **Service (Xizmat turi):** bo'linmaga bog'langan, nomi, tavsif, ikona,
   rasmlar galereyasi, narx (optional).
3. **Product (Mahsulot):** kategoriya, nomi, texnik xususiyatlar (JSON/flexible),
   rasmlar, fayl/katalog (PDF), tavsif.
4. **ProductCategory:** ierarxik (parent-child).
5. **Certificate (Sertifikat):** nomi, beruvchi tashkilot, sana, rasm/PDF,
   xalqaro/milliy.
6. **Partner (Hamkor):** nomi, logo, sayt, tavsif.
7. **Project / ClientObject (Bajarilgan ish / obyekt):** nomi, mijoz,
   rasmlar, natija, sana, joylashuv.
8. **Statistic (Statistika):** kalit-qiymat (masalan "Loyihalar: 250+"),
   ikona, animatsion counter uchun.
9. **PageContent (Maqsad/vazifa/about):** moslashuvchan kontent bloklari.
10. **Lead/Contact (Murojaat):** ism, kompaniya, telefon, email, xabar —
    saytdan keladigan so'rovlar.
HAR BIRI ko'p tilli: uzbek_latin, russian, english maydonlari (yoki
translation jadval orqali — sen eng to'g'ri yondashuvni tanla).

## 5. DIZAYN — ULTRA PREMIUM (ustuvor)
Bu loyihaning eng muhim qismi. Tashrif buyuruvchini hayratga solishi shart.
- **3 ta theme** (men quyidagilarni tavsiya qilaman, sen yaxshilashing mumkin):
  1. **"Midnight Industrial"** — qora/grafit fon, neon-siyan va elektr-ko'k aksent,
     glassmorphism panellar (asosiy/default).
  2. **"Pure Light"** — oq/och kulrang, minimalist, ko'k-yashil aksent,
     toza korporativ his.
  3. **"Cyber Aurora"** — to'q binafsha/qora gradient, neon-pushti va
     yashil aurora effektlari, eng futuristik.
- **next-themes** orqali silliq theme almashish, foydalanuvchi tanlovi saqlansin.
- **Effektlar:** glassmorphism panellar, yumshoq neon glow, micro-interactions,
  scroll-triggered animatsiyalar (Framer Motion), parallax, animated gradient
  background, animated counters, hover-da 3D tilt, smooth page transitions.
- **Hero:** kuchli birinchi ekran — animatsion sarlavha, sanoat/avtomatizatsiya
  mavzusidagi vizual (Three.js yoki Spline yoki animatsion SVG — sen tanla),
  CTA tugma neon glow bilan.
- Mobil-birinchi, to'liq responsive, 60fps silliq.
- Accessibility (a11y) va Lighthouse 90+ maqsad.

## 6. KO'P TILLILIK
3 til: **English, Русский, O'zbek (lotin)**.
- Frontend UI matnlari: next-intl JSON fayllar.
- DB kontenti: har yozuv 3 tilda.
- Til almashtirgich header'da, tanlov saqlansin (URL yoki cookie).

## 7. SAYT SAHIFALARI (public)
- Bosh sahifa (hero, statistika counterlari, bo'linmalar preview,
  hamkorlar lentasi, CTA).
- Korxona haqida (maqsad, vazifa, tarix, missiya).
- Tarkibiy bo'linmalar (ro'yxat + har biriga alohida batafsil sahifa).
- Xizmatlar (filtrlanadigan).
- Mahsulotlar (kategoriya bo'yicha filtr, qidiruv, batafsil sahifa, katalog yuklab olish).
- Sertifikatlar (galereya, lightbox).
- Hamkorlar.
- Loyihalar/obyektlar (portfolio uslubida).
- Statistika/yutuqlar.
- Aloqa (forma -> Lead saqlanadi + telegram/email notify, optional).

## 8. ADMIN PANEL (full CRUD)
- JWT auth, himoyalangan marshrutlar, rol (admin/editor).
- Yuqoridagi HAR entiti uchun ro'yxat / qo'shish / tahrirlash / o'chirish.
- Rasm/fayl yuklash (preview bilan).
- Ko'p tilli maydonlarni tabbed tarzda tahrirlash.
- Dashboard: leadlar, statistika, oxirgi o'zgarishlar.
- Tartiblash (drag-drop order), faol/nofaol toggle.
- Saytga mos premium dizayn (Midnight Industrial theme asosida).

## 9. SIFAT VA TEST
- Backend: pytest + DRF test client (modellar, API endpointlar).
- Frontend: build xatosiz, TypeScript strict, ESLint toza.
- Har bosqichda o'zing test qilib, ishlashiga ishonch hosil qilgachgina davom et.
- README: o'rnatish, ishga tushirish, .env namuna, arxitektura tushuntirishi.
- Seed data: namuna ICHAB kontenti bilan DB to'ldir (demo uchun).

## 10. BOSQICHLAR (build order)
1. Repo skeleti + docker-compose + .env + README.
2. Django loyiha + PostgreSQL ulanish + asosiy sozlamalar.
3. Domen applar + modellar + migratsiyalar.
4. DRF serializerlar + viewlar + API marshrutlar + JWT auth.
5. Seed data + API test.
6. Next.js skeleti + Tailwind + theme tizimi (3 theme) + i18n.
7. Reusable UI komponentlar + layout + header/footer + theme/til almashgich.
8. Public sahifalar (bosh sahifadan boshlab, ketma-ket).
9. Animatsiyalar + premium effektlar pollish.
10. Admin panel (auth -> CRUD -> dashboard).
11. Yakuniy test, Lighthouse, responsive tekshiruv, README yakunlash.

## ESLATMA
Agar mening talablarimda noaniqlik yoki texnik xato bo'lsa — xalqaro
standartlarga ko'ra eng to'g'ri qarorni o'zing qabul qil va sababini qisqa tushuntir.
HOZIRDAN BOSHLA: avval 1-bosqichdan.
