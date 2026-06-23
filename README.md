# Evoto Leads - Kiosk & Admin Console

A responsive, highly polished Next.js (App Router) application tailored for a tablet kiosk at exhibition booths to collect leads, paired with a secure, minimalist admin dashboard to review submissions.

Designed with rich aesthetics, smooth micro-interactions, and robust data integrity, this app makes capturing and reviewing client requirements fast and frictionless.

---

## 🚀 Key Features

### 1. Front-end: Lead Collection Kiosk (`/`)
* **Tablet Landscape Optimized**: High-touch targets, generous input spacing, and a clean off-white background to prevent screen glare.
* **Interactive WhatsApp Sync**: A "Same as contact number" checkbox that automatically copies the contact number to the WhatsApp field and locks it in a read-only state.
* **Strict Validation**: Real-time form checks using React Hook Form + Zod.
  * **Contact Number**: Must start with `0` and contain at most 10 digits.
  * **WhatsApp Number**: Must start with `07` and contain at most 10 digits.
* **Thank You State**: Celebratory confetti burst on submission, followed by a beautiful full-screen state with an automated 5-second countdown timer that resets the form for the next visitor.

### 2. Back-end: Convex Backend & Database
* **Real-time Synchronization**: Powered by Convex mutations (`insertLead`) and queries (`getLeads`).
* **Offline-Ready Schema**: Locally structured types allowing fast, compiler-safe mock execution.

### 3. Review Console: Admin Dashboard (`/admin`)
* **Secure PIN Overlay**: Staff passcode verification directly in the browser state (persisted via `sessionStorage` until locked or closed).
* **Metrics Cards**: Displays total leads collected and leads submitted today.
* **Scannable Data Table**: Displaying full details with sorting and action links.
* **Detailed popup**: Open requirement descriptions inside a smooth Dialog popup to keep the main table clean.
* **Export Actions**: Export all lead records to a download-ready CSV file or copy formatted leads directly to the clipboard with one click.

---

## 🛠 Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Database & Queries**: Convex
* **Styling**: Tailwind CSS (v4)
* **Form & Validation**: React Hook Form + Zod
* **UI Components**: Shadcn UI (using Base UI Radix primitives)
* **Animations**: Lucide Icons & Canvas Confetti

---

## ⚙️ Configuration & Environment Setup

Before starting, configure your local environment variables. Create a `.env.local` file in the root of the project:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=your-convex-deployment-id-here
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

# Admin Authentication PIN (Defaults to 2026 if not set)
NEXT_PUBLIC_ADMIN_PIN=2026
```

> [!NOTE]
> During development, if you do not have a live Convex deployment configured yet, type check will pass using our pre-compiled mock API references in `convex/_generated`.

---

## 📦 Installation & Running

### 1. Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Convex:
To run the live Convex database backend locally:
```bash
npx convex dev
```
Follow the interactive CLI prompts to link the database to your Convex account.

### 3. Run the development server:
```bash
npm run dev
```
The server will boot up (normally at `http://localhost:3000` or `http://localhost:3001`).

* **Kiosk Form**: `http://localhost:3000/`
* **Admin Panel**: `http://localhost:3000/admin` (Enter PIN `2026` to unlock)

### 4. Build for Production:
```bash
npm run build
```
This runs TypeScript checking and bundles Next.js for high-speed production server deployment.
