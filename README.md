# NativeTalk Assessment

A full-stack customer support ticketing system built with Django REST Framework and Next.js 14.

---

## Project Overview

NativeTalk is a support-desk application that allows agents to manage customers, create and track support tickets, and communicate via comments. The system is composed of two independent services:

- **Backend** — a Django REST Framework API backed by a Supabase PostgreSQL database. It exposes RESTful endpoints for `customers`, `tickets`, and `comments`, plus a custom aggregation endpoint (`/api/tickets/by-status/`) used to power the dashboard.
- **Frontend** — a Next.js 14 App Router application styled with Tailwind CSS. It consumes the Django API using the native `fetch` API and renders a responsive dashboard, tickets list, ticket detail view, and customers table.

```
nativetalk-assessment/
├── backend/      # Django REST Framework API
└── frontend/     # Next.js 14 App Router UI
```

---

## Backend Setup

### Prerequisites
- Python 3.10+
- A Supabase project with a PostgreSQL database

### Steps

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Activate the virtual environment (Windows)
venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Configure environment variables
#    Copy the example file and fill in your Supabase credentials
copy .env.example .env
```

Open `.env` in your editor and set the following variables:

```env
# Transaction-mode pooler — used by the application at runtime
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/<db>?pgbouncer=true"

# Session-mode pooler — required for running migrations
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<db>"

DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
```

> Both URLs are available in your Supabase project under **Settings → Database → Connection string**.

```bash
# 5. Apply database migrations (uses DIRECT_URL for session-mode compatibility)
python manage.py migrate

# 6. (Optional) Create a superuser to access the Django admin panel
python manage.py createsuperuser

# 7. Start the development server
python manage.py runserver
```

The API will be available at **http://localhost:8000/api/**.

| Endpoint | Description |
|---|---|
| `GET /api/tickets/` | List all tickets |
| `POST /api/tickets/` | Create a ticket |
| `GET /api/tickets/:id/` | Retrieve a ticket with nested comments |
| `GET /api/tickets/by-status/` | Ticket counts grouped by status (dashboard) |
| `GET /api/customers/` | List all customers |
| `POST /api/comments/` | Add a comment to a ticket |

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure the API base URL
#    Create a .env.local file (already present if you cloned the repo)
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local

# 4. Start the development server
npm run dev
```

The application will be available at **http://localhost:3000**.

Make sure the Django backend is running before starting the frontend so that API calls resolve correctly.

---

## Design Extrapolation

The **Ticket Details** page (`app/tickets/[id]/page.tsx`) does not exist in the original Figma design and was extrapolated by rigorously applying the same visual language established across the Dashboard and Tickets screens. Every card uses the identical `rounded-xl border border-slate-100 shadow-sm` combination (`card` utility class) defined in `globals.css`, ensuring the same border radius, border colour, and drop shadow appear on the detail page as on the dashboard stat cards and ticket list items. Description blocks adopt the `bg-slate-50 rounded-xl border border-slate-100` inset-panel pattern used elsewhere for secondary content areas. The progress bar reuses the same `progress-bar-track` / `progress-bar-fill` utility classes and per-status colour tokens (`STATUS_CONFIG` in `components/Badges.tsx`) that drive the ticket cards on the list view. Typography follows the same `DM Sans` scale — `text-xl font-semibold` for the primary heading, `text-sm text-slate-500` for metadata — matching the hierarchy seen in the Figma screens. The metadata sidebar card and activity summary card mirror the Quick Actions card layout from the Dashboard: a simple `card p-5` container with a `text-sm font-semibold text-slate-800` heading and subdued secondary text. The net effect is a page that feels like a natural extension of the design system rather than a separately designed screen.
