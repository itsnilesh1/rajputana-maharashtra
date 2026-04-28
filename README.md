# 🏰 Rajputana Maharashtra — Community Platform

> **एकता · शौर्य · गौरव** — Unity · Valor · Glory

A full-stack production-ready community platform for the Rajput community in Maharashtra, India.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | NextAuth.js with credentials — JWT sessions, bcrypt passwords |
| 👑 Role System | Guest / User / Moderator / Admin with route protection |
| ✅ Approval System | All user content goes through admin review before publishing |
| 📋 Submissions | Member profiles, events, gallery, contact — all moderated |
| 🗺️ Districts | 9 district pages with members, events, announcements |
| 📰 Heritage | Admin-managed articles with categories and search |
| 📅 Events | Public listing + user submission + admin approval |
| 🖼️ Gallery | Masonry image gallery with category filters |
| 🔔 Notifications | In-app notifications on submission status change |
| 🔍 Search | Cross-entity search (members, events, articles) |
| 📱 Responsive | Mobile-first, fully responsive design |
| 🎨 Royal UI | Black, maroon & gold premium design system |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/rajputana-maharashtra.git
cd rajputana-maharashtra
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rajputana-maharashtra
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin user: `admin@rajputana-maharashtra.org` / `Admin@123456`
- ✅ Moderator: `mod@rajputana-maharashtra.org` / `Admin@123456`
- ✅ Sample users, profiles, events, articles, announcements, gallery

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                   # Login, Register pages (no navbar)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                   # Public site with Navbar + Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── heritage/
│   │   │   ├── page.tsx          # Articles listing
│   │   │   └── [slug]/page.tsx   # Article detail
│   │   ├── members/page.tsx
│   │   ├── events/page.tsx
│   │   ├── districts/
│   │   │   ├── page.tsx          # All districts
│   │   │   └── [slug]/page.tsx   # District detail
│   │   ├── gallery/page.tsx
│   │   ├── search/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/                    # Admin panel (requires admin/mod role)
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── submissions/page.tsx  # Review & moderate submissions
│   │   ├── users/page.tsx        # User management
│   │   ├── events/page.tsx
│   │   ├── articles/page.tsx
│   │   ├── announcements/page.tsx
│   │   └── gallery/page.tsx
│   ├── dashboard/                # User portal (requires login)
│   │   ├── page.tsx              # User overview
│   │   ├── profile/page.tsx      # Create/edit profile
│   │   └── submissions/page.tsx  # Track submission status
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── auth/register/        # User registration
│       ├── members/              # Member profiles CRUD
│       ├── events/               # Events CRUD
│       ├── articles/             # Articles CRUD
│       ├── announcements/        # Announcements CRUD
│       ├── submissions/          # Submission system
│       ├── admin/
│       │   ├── submissions/[id]/ # Review action (approve/reject/revision)
│       │   ├── submissions/      # List all submissions
│       │   ├── users/            # User management
│       │   └── stats/            # Dashboard statistics
│       ├── search/               # Global search
│       ├── districts/            # District data
│       ├── contact/              # Contact/volunteer/suggestion forms
│       └── upload/               # Cloudinary image upload
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/                 # Homepage section components
│   │   ├── HeroSection.tsx
│   │   ├── CommunityStats.tsx
│   │   ├── FeaturedDistricts.tsx
│   │   ├── LatestAnnouncements.tsx
│   │   ├── UpcomingEvents.tsx
│   │   ├── HeritageHighlights.tsx
│   │   └── JoinCTA.tsx
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── dashboard/
│       └── DashboardSidebar.tsx
├── models/
│   ├── User.ts
│   ├── MemberProfile.ts
│   ├── Event.ts
│   ├── Article.ts
│   ├── SubmissionRequest.ts
│   └── index.ts                  # Announcement, Gallery, District, Notification, ActivityLog
├── lib/
│   ├── auth.ts                   # NextAuth config
│   └── db.ts                     # Mongoose connection
└── types/
    └── next-auth.d.ts            # Session type augmentation
```

---

## 🔐 Role-Based Access

| Route | Guest | User | Moderator | Admin |
|---|:---:|:---:|:---:|:---:|
| Public pages | ✅ | ✅ | ✅ | ✅ |
| Create profile/event | ❌ | ✅ | ✅ | ✅ |
| View dashboard | ❌ | ✅ | ✅ | ✅ |
| Review submissions | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Admin dashboard | ❌ | ❌ | ✅ | ✅ |

---

## 🔄 Approval Workflow

```
User submits content (profile / event / gallery / contact)
        ↓
SubmissionRequest created with status: "pending"
        ↓
Admin sees it in /admin/submissions
        ↓
Admin reviews payload data
        ↓
    ┌───────────────────────────────────┐
    │                                   │
  Approve                Reject      Request Revision
    │                     │              │
Content auto-          Discarded     User notified
published                          Re-submits with
(MemberProfile /                     edits applied
Event/Article/
Gallery created)
    │
User notified via
Notification system
```

---

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/rajputana-maharashtra.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env.example`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → set to your Vercel domain: `https://your-app.vercel.app`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`
4. Click **Deploy**

### 3. Post-Deploy

After deployment, run the seed script against your production DB:

```bash
MONGODB_URI=your-production-uri node scripts/seed.js
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `royal-black` | `#0A0A0B` | Page backgrounds |
| `royal-dark` | `#1A1A1F` | Card backgrounds |
| `royal-gold` | `#C9A84C` | Primary accent, borders, icons |
| `royal-amber` | `#E8C45A` | Hover states, gradients |
| `royal-maroon` | `#7B1C2C` | Secondary accent, tags |
| `gold-text` | gradient | Heading highlights |
| `btn-royal` | gold gradient | Primary CTA buttons |
| `btn-ghost` | outlined | Secondary buttons |
| `royal-card` | dark + border | Card component |

**Fonts:**
- **Cinzel** — Display / Headings (`.font-display`)
- **Crimson Text** — Body / Quotes (`.font-serif`)
- **Inter** — UI / Labels (`.font-sans`)

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js v4 |
| Image Upload | Cloudinary |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — © 2025 Rajputana Maharashtra

---

<div align="center">
  <strong>🏰 Rajputana Maharashtra</strong><br>
  <em>एकता · शौर्य · गौरव</em>
</div>
