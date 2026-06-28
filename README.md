# ICHAB — Ishlab chiqarishni avtomatlashtirish boshqarmasi

Korporativ web platforma: sanoat avtomatizatsiyasi, PLC/SCADA, boshqaruv tizimlari.

## Arxitektura

```
ichab_pro/
├── backend/              # Python 3.12 + Django 5 + DRF + PostgreSQL
│   ├── config/           # Django loyiha sozlamalari (settings, urls, wsgi)
│   │   └── settings/     # base / development / production
│   └── apps/             # Domen aplar (Clean Architecture)
│       ├── divisions/    # Tarkibiy bo'linmalar
│       ├── products/     # Mahsulotlar + kategoriyalar
│       ├── services/     # Xizmat turlari
│       ├── certificates/ # Sertifikatlar
│       ├── partners/     # Hamkorlar
│       ├── projects/     # Bajarilgan loyihalar / obyektlar
│       ├── stats/        # Statistika (animated counter uchun)
│       ├── pages/        # Moslashuvchan sahifa kontenti
│       └── leads/        # Murojaat formasi
├── frontend/             # Next.js 14 + TypeScript + Tailwind + Framer Motion
├── nginx/                # Reverse proxy (production)
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tezkor ishga tushirish

### 1. .env fayl tayyorlash
```bash
cp .env.example .env
# .env ichidagi qiymatlarni o'zgartiring
```

### 2. Docker orqali ishga tushirish (tavsiya etiladi)
```bash
docker-compose up --build
```

Xizmatlar:
| Xizmat    | URL                         |
|-----------|-----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8000       |
| Admin     | http://localhost:8000/admin |
| API       | http://localhost:8000/api/v1|

### 3. Lokal ishga tushirish (backend)
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 4. Lokal ishga tushirish (frontend)
```bash
cd frontend
npm install
npm run dev
```

## API hujjatlari

Barcha endpointlar `/api/v1/` prefiksi bilan:

| Resurs         | Endpoint                  |
|----------------|---------------------------|
| Divisions      | `/api/v1/divisions/`      |
| Products       | `/api/v1/products/`       |
| Services       | `/api/v1/services/`       |
| Certificates   | `/api/v1/certificates/`   |
| Partners       | `/api/v1/partners/`       |
| Projects       | `/api/v1/projects/`       |
| Statistics     | `/api/v1/stats/`          |
| Pages          | `/api/v1/pages/`          |
| Leads          | `/api/v1/leads/`          |
| JWT Token      | `/api/v1/auth/token/`     |

## Ko'p tillilik

Har bir DB yozuvi 3 tilda: `uz` (lotin), `ru`, `en`.

UI matnlari: `frontend/messages/{uz,ru,en}.json` fayllar (next-intl).

## Testlar

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm run lint && npm run type-check
```

## Texnologiyalar

| Qatlam    | Texnologiyalar                                          |
|-----------|---------------------------------------------------------|
| Backend   | Python 3.12, Django 5, DRF, SimpleJWT, Celery           |
| Database  | PostgreSQL 16, Redis 7                                  |
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS       |
| UI/UX     | Framer Motion, Zustand, TanStack Query, next-intl       |
| Theme     | Light "Soft Slate" (steel-blue + deep-orange action accent) |
| Infra     | Docker, docker-compose, Nginx, Gunicorn, Railway        |
