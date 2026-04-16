# Ahoum Sessions Marketplace

A sessions marketplace for Ahoum SpiritualTech — where seekers discover and book 1-on-1 wellness sessions with verified guides across meditation, yoga, sound healing, breathwork, and life coaching.

Built as part of the Ahoum internship assignment.

---

## What this does

Seekers can browse sessions, pick a time slot, and pay securely. Guides can create sessions, view booking requests, and accept or decline them. Everything runs in Docker with a single command.

---

## Stack

- React 19 + Vite (frontend)
- Django 4.2 + Django REST Framework (backend)
- PostgreSQL (production) / SQLite (local dev)
- GitHub OAuth + JWT tokens (authentication)
- Razorpay (payments)
- Docker + Nginx (containerization)

---

## Running with Docker

Make sure Docker Desktop is running, then:

```bash
git clone https://github.com/Mudavath-Swathi/ahoum-sessions-marketplace.git
cd ahoum-sessions-marketplace
```

Create a `.env` file in the root (see `.env.example` for reference) and fill in your credentials:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost/auth/callback/github

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

POSTGRES_DB=ahoum_db
POSTGRES_USER=ahoum_user
POSTGRES_PASSWORD=ahoum_password
DATABASE_URL=postgresql://ahoum_user:ahoum_password@db:5432/ahoum_db

VITE_API_URL=http://localhost/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_REDIRECT_BASE=http://localhost
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Then:

```bash
docker-compose up --build
```

App will be live at `http://localhost`

After first run, create a superuser and seed sessions:

```bash
docker exec -it ahoum_backend python manage.py createsuperuser
```

---

## Running locally (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`

---

## GitHub OAuth setup

1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:5173/auth/callback/github` (local) or `http://localhost/auth/callback/github` (Docker)
4. Copy Client ID and Secret into your `.env`

---

## Test payment credentials

Razorpay test mode is enabled. Use these details:
Card number : 5267 3181 8797 5449
Expiry      : 03/29
CVV         : 123
OTP         : 1234

---

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/github/callback/ | No | GitHub OAuth login |
| GET | /api/auth/profile/ | Yes | Get current user |
| GET | /api/sessions/ | No | List all sessions |
| POST | /api/sessions/ | Creator | Create a session |
| GET | /api/sessions/my/ | Creator | My sessions |
| POST | /api/bookings/ | Yes | Book a session |
| GET | /api/bookings/my/ | Yes | My bookings |
| GET | /api/bookings/creator/ | Creator | Incoming bookings |
| PATCH | /api/bookings/:id/ | Creator | Accept or decline |
| POST | /api/payments/create-order/ | Yes | Create Razorpay order |
| POST | /api/payments/verify/ | Yes | Verify payment |

---

## Project structure
ahoum-sessions-marketplace/
├── backend/
│   ├── core/          # Django settings and URLs
│   ├── users/         # Auth, OAuth, JWT
│   ├── sessions_app/  # Session CRUD
│   ├── bookings/      # Booking management
│   ├── payments/      # Razorpay integration
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/     # Home, Login, SessionDetail, Dashboards
│   │   ├── components/# Navbar, SessionCard, BookingModal
│   │   ├── context/   # Auth context
│   │   └── api/       # Axios client
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
└── docker-compose.yml

---

## Admin panel

Available at `http://localhost/admin` (Docker) or `http://localhost:8000/admin` (local)

Default credentials after running the createsuperuser command.

