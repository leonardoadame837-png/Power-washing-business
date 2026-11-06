PowerWash Booking — Business Management Platform

Project Overview

PowerWash Booking is a professional, mobile-first web application designed to manage a pressure washing business from a single platform.

The application combines customer acquisition, service estimates, appointment scheduling, job management, photo uploads, invoicing, and payment processing.

Primary objective: Allow customers to request, schedule, and pay for services online while allowing the business owner to manage customers, appointments, job locations, and revenue through an administrative dashboard.

Core Features

1. Public Business Website

- Professional homepage.
- Service descriptions and pricing.
- Before-and-after project gallery.
- Service-area information.
- Customer reviews.
- Contact information.
- Search-engine optimization.

2. Customer Booking System

- Select pressure washing services.
- Enter property address.
- Select preferred appointment date and time.
- Upload property photographs.
- Request a customized estimate.
- Receive booking confirmation.
- View booking status.
- Request rescheduling or cancellation.

3. Estimate Management

- Customer-submitted estimates.
- Photo-based property assessment.
- Custom service pricing.
- Estimate approval and rejection.
- Conversion of approved estimates into scheduled jobs.

4. Business Owner Dashboard

- Daily, weekly, and monthly calendar.
- Customer directory.
- Appointment management.
- Job-location tracking.
- Booking status management.
- Revenue tracking.
- Completed and pending jobs.
- Customer communication records.

5. Invoicing

- Automatically generate invoices.
- Assign invoice numbers.
- Include services, quantities, and prices.
- Track outstanding balances.
- Send payment links.
- Record payment status.
- Generate downloadable PDF invoices and receipts.

6. Stripe Integration

Use Stripe for:

- Secure online payments.
- Credit and debit card transactions.
- Hosted Stripe Checkout.
- Recurring service subscriptions.
- Customer billing.
- Invoice payments.
- Payment confirmation through verified webhooks.

Never expose Stripe secret keys in frontend code.

7. Photo Management

- Allow customers to upload property photographs.
- Support before-and-after job documentation.
- Allow authorized customers to download requested photographs.
- Use private storage and expiring download links.
- Apply file-type and file-size restrictions.

8. Calendar and Scheduling

- Prevent conflicting appointments.
- Configure business hours.
- Set appointment durations.
- Include travel and service-area considerations.
- Support rescheduling and cancellations.
- Provide an administrative calendar.
- Optionally synchronize appointments with Google Calendar.

Technical Architecture

- Frontend: HTML, CSS, JavaScript.
- Hosting: GitHub Pages.
- Backend: Supabase or equivalent.
- Database: PostgreSQL.
- Authentication: Supabase Auth.
- File storage: Supabase Storage.
- Payments: Stripe Checkout and Billing.
- Invoicing: Stripe Invoicing and PDF generation.
- Calendar: Internal scheduling system with optional Google Calendar synchronization.

Security Requirements

- Never expose API secret keys.
- Authenticate administrative access.
- Apply database row-level security.
- Protect customer photographs.
- Validate all uploads.
- Verify Stripe webhook signatures.
- Prevent duplicate bookings and payments.
- Maintain booking and payment audit records.

Deployment

Initial deployment target:

https://leonardoadame837-png.github.io/powerwash-booking/

Use GitHub Actions to validate and deploy the frontend to GitHub Pages.

Backend services must be deployed separately.

Development Roadmap

Phase 1: Professional website and responsive customer interface.

Phase 2: Estimate requests, photo uploads, and booking calendar.

Phase 3: Administrative dashboard and customer management.

Phase 4: Stripe payments, invoices, and recurring subscriptions.

Phase 5: Calendar synchronization, automated notifications, analytics, and SEO improvements.

Success Criteria

A customer must be able to request an estimate, upload photographs, schedule a service, receive confirmation, and pay online.

The business owner must be able to manage customers, appointments, job locations, estimates, invoices, and payments from one dashboard.
