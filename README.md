# PoultryManager - Production Deployment Guide

This application is built with Next.js 15, React, Tailwind CSS, and SQLite. It is optimized for performance, local data sovereignty, and ease of deployment.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: SQLite (via `better-sqlite3`)
- **Email**: Resend API
- **Icons**: Lucide React

## Environment Variables

Ensure the following variables are set in your production environment or `.env.local` file:

### Core Configuration
- `NEXT_PUBLIC_SITE_URL`: The full URL of your deployment (e.g., `https://poultrymanager.in`).
- `NEXT_PUBLIC_PRICING_PAGE`: Set to `ON` to show the pricing page, or `OFF` to hide it.
- `NEXT_PUBLIC_LAST_UPDATED`: The date string shown on legal pages (e.g., `15 August 2024`).
- `NEXT_PUBLIC_MAINTENANCE_MODE`: Set to `ON` to enable the global maintenance screen.
- `NEXT_PUBLIC_MORE_REGISTRATION`: Set to `ON` to show a high-demand notice on the registration form.

### Administration (Super Admin)
- `SUPER_ADMIN_USERID`: The username for the admin dashboard (e.g., `admin`).
- `SUPER_ADMIN_PASSWORD`: A secure password for the admin dashboard.

### Email Service (Resend)
- `RESEND_API_KEY`: Your API key from [resend.com](https://resend.com).
- `EMAIL_FROM`: The verified sender email (e.g., `onboarding@yourdomain.com`).
- `EMAIL_FROM_NAME`: The name that will appear as the sender (e.g., `PoultryManager Onboarding`).
- `EMAIL_TO`: The admin email where notifications are sent.
- `SEND_ADMIN_NOTIFICATIONS`: Set to `OFF` to disable admin emails (defaults to `ON`).
- `SEND_CUSTOMER_NOTIFICATIONS`: Set to `OFF` to disable customer emails (defaults to `ON`).

## Database Management

The application uses a local SQLite database file named `poultry.db` located in the root directory.

- **Automatic Setup**: The database and its tables are automatically created on the first run.
- **Persistence**: Ensure your deployment environment (e.g., Docker, VPS) persists the `poultry.db` file across deployments.
- **Backups**: It is recommended to periodically back up the `poultry.db` file.

## Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3000 by default
```

### Production
1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   # Standard production start
   npm run start
   ```

## Admin Access
The administration console is available at `/super-admin`. Use the credentials defined in your environment variables to log in and manage farm onboarding requests.
