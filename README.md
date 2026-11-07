# PowerWash Booking — Business Management Platform

A mobile-first website and booking-management starter for a pressure-washing business.

## Project status

This repository contains the public website prototype and GitHub Pages deployment workflow. The customer-facing interface can collect service details, calculate an indicative estimate, preview selected property photos, and prepare a booking request. **Live booking storage, administrator authentication, private photo storage, Google Calendar write access, invoices, and Stripe transactions require the separately deployed backend and account configuration described below.** Do not accept real payments or treat a browser-only demo request as a confirmed appointment.

## Core capabilities planned

- Professional service website, service-area and project-gallery sections.
- Customer estimate request form with local photo previews.\n- Customer-facing calendar showing only backend-confirmed available dates and time slots.\n- Automatic booking confirmation after the backend atomically reserves a selected slot; conflicting requests receive a retry response.
- Property photo selection and local preview before upload.
- Owner dashboard for customers, estimates, jobs, and schedule.
- Availability rules, working hours, travel buffers, rescheduling, and cancellation.
- Google Calendar synchronization after OAuth consent and server-side integration.
- Invoice generation, downloadable PDFs, payment status, and customer receipts.
- Stripe Checkout for deposits/full payments and Stripe Billing for recurring plans.
- Search-engine metadata, responsive design, and accessible forms.

## Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Public frontend | HTML, CSS, JavaScript | GitHub Pages website and customer UI |
| Backend | Supabase Edge Functions or equivalent | Secure booking, estimate, calendar, invoice, and payment APIs |
| Database | PostgreSQL / Supabase | Customers, services, bookings, estimates, invoices, audit events |
| Authentication | Supabase Auth | Owner/admin login and authorization |
| Photo storage | Private Supabase Storage bucket | Customer uploads and time-limited download URLs |
| Payments | Stripe Checkout, Billing, Invoicing | Hosted payment collection and recurring billing |
| Calendar | Google Calendar API | Owner calendar synchronization through OAuth |

GitHub Pages is static hosting. It cannot securely store Stripe secret keys, perform trusted webhook verification, or provide private database and photo operations by itself.

## Local preview

Open `index.html` in a browser, or run a local static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy.yml` deploys the repository root when changes are pushed to `main`.

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` and monitor the **Actions** tab.
4. After the first successful deployment, visit:

   https://leonardoadame837-png.github.io/Power-washing-business/

GitHub Pages is available for public repositories on GitHub Free. See the [GitHub Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Live calendar and booking API contract\n\nConfigure a public API base URL as `window.POWERWASH_CONFIG.apiBaseUrl` in a `config.js` file loaded before `script.js`. Keep secrets out of browser configuration. The frontend expects:\n\n- `GET /api/availability?month=YYYY-MM` returning `{ "days": [{ "date": "YYYY-MM-DD", "slots": [{ "id": "opaque-slot-id", "label": "9:00 AM", "available": true }] }] }`.\n- `POST /api/bookings` with `{ slot_id, service, name, email, phone, address, notes }`, returning a booking confirmation. Return HTTP `409` if the slot was taken by another customer.\n- The server must re-check availability and reserve the slot atomically. The browser calendar is never authoritative.\n- The backend controls business hours, service durations, travel buffers, blackout dates, capacity, time zone, and Google Calendar synchronization.\n\n## Required production configuration

Before real customers can book or pay, configure:

- Supabase project URL and public anon key in frontend-safe configuration; enable strict Row Level Security policies.
- Server-side functions for booking creation, availability checks, estimate submission, invoice generation, and signed photo access.
- Google Cloud OAuth consent, Calendar API, and server-side token handling. Never put a Google client secret in browser code.
- Stripe account, products/prices, Checkout and Billing configuration, webhook endpoint, and verified webhook signing secret.
- Email/SMS provider and verified sender for confirmations and reminders.
- Business name, phone, email, service area, hours, service catalog, tax settings, cancellation policy, and terms/privacy notices.

**Never commit secrets or customer personal information.** Keep Stripe secret keys, webhook secrets, OAuth client secrets, and service-role keys on the server only. Restrict photo types and sizes, use private storage, verify webhook signatures, make payment/booking operations idempotent, and keep an audit trail.

## Roadmap

1. Website and responsive customer-facing forms.
2. Secure backend, database, admin login, and private photo uploads.
3. Availability engine, automatic booking confirmation, and owner scheduling dashboard.
4. Google Calendar synchronization and notifications.
5. Stripe payments, recurring plans, invoices, and receipts.
6. Operational testing, accessibility, SEO, and production launch.

## Success criteria

A customer can request a quote, provide property details/photos, select an available appointment, receive a confirmed booking, and pay securely. The owner can manage the full customer/job lifecycle, calendar, estimates, invoices, and payment records from an authenticated dashboard.
