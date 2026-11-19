# Coy Discover — Swipe-Based Discovery Feature

A swipe-based discovery feature built for Coy, similar to Bumble/Tinder. Users can browse through profiles by swiping right (like) or left (pass), and get matched when the interest is mutual.

> Built as a standalone Next.js app with a **"Discover" tab** alongside a placeholder **"Home" tab**, as specified in the Coy SDE Intern assignment.

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd coy-discover
npm install

# Run
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

### Swipe Experience
- **Drag gestures** on mobile — swipe right to like, left to pass
- **Action buttons** on desktop — ❌ to pass, ❤️ to like
- **Keyboard shortcuts** — `←` pass, `→` like, `Ctrl+Z` undo (desktop)
- **Smooth card animations** using Framer Motion with spring physics
- **LIKE/NOPE overlays** that appear while dragging for clear visual feedback
- **Stacked card preview** — peek at the next profile behind the current one
- **Empty state** when all profiles have been swiped, with a reset button

### Undo & Reset
- **Undo last swipe** — changed your mind? Hit the undo button or `Ctrl+Z`
- **Reset all swipes** — start the demo over with a single click (great for showing to others)

### Matching
- A match happens **only when both users have liked each other** (mutual like)
- **"It's a match!" celebration** — confetti explosion + animated modal
- **"View Matches" or "Keep Swiping"** — choose your next step after a match
- **Match count badge** on the Matches tab — updates in real-time
- **Never reveals** who has liked the user unless it's mutual — Coy's core privacy promise

### Profile Data
- **35 seeded mock profiles** with realistic Indian names, ages, photos, bios, cities, colleges, and interests
- **10 profiles pre-liked** the logged-in user, so matches happen naturally during a demo
- Placeholder avatar images via [DiceBear Avataaars](https://dicebear.com/)

### Persistence
- All swipes and matches **persist across page reloads** using SQLite
- Once a profile is swiped, it **never reappears** in the feed

### Tab Navigation
- **Home** — Blank placeholder tab
- **Discover** — Swipe-based discovery (the main feature)
- **Matches** — List of all mutual matches with profile details

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | SQLite (better-sqlite3) |
| Backend | Next.js API Routes |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with tab bar
│   ├── page.tsx                # Redirects to /discover
│   ├── globals.css             # Global styles
│   ├── home/page.tsx           # Blank Home tab
│   ├── discover/page.tsx       # Swipe discovery UI
│   ├── matches/page.tsx        # Matches list view
│   └── api/
│       ├── feed/route.ts       # GET  /api/feed
│       ├── swipe/route.ts      # POST /api/swipe
│       ├── matches/route.ts    # GET  /api/matches
│       ├── undo/route.ts       # POST /api/undo
│       └── reset/route.ts      # POST /api/reset
├── components/
│   ├── TabBar.tsx              # Bottom navigation with match badge
│   ├── ProfileCard.tsx         # Profile card UI
│   ├── SwipeableCard.tsx       # Draggable card with animations
│   ├── MatchModal.tsx          # "It's a match!" celebration
│   ├── Confetti.tsx            # Confetti particle explosion
│   ├── EmptyState.tsx          # No more profiles state
│   └── Icons.tsx               # SVG icon components
└── lib/
    ├── db.ts                   # SQLite setup + initialization
    ├── seed.ts                 # 35 mock profiles
    └── types.ts                # TypeScript interfaces
```

## 🔌 API Endpoints

### `GET /api/feed`
Returns profiles the logged-in user has **not yet swiped on**.

```json
{
  "profiles": [
    {
      "id": 1,
      "name": "Ananya Sharma",
      "age": 22,
      "photo": "https://...",
      "bio": "Coffee addict ☕ | ...",
      "city": "Delhi",
      "college": "IIT Delhi",
      "interests": ["Data Science", "Hiking", "Board Games", "Coffee"]
    }
  ]
}
```

### `POST /api/swipe`
Records a like or pass and returns whether it created a match.

**Request:** `{ "profileId": 1, "action": "like" }`

**Response:**
```json
{
  "success": true,
  "matched": true,
  "matchedProfile": { "id": 1, "name": "Ananya Sharma", ... }
}
```

### `GET /api/matches`
Returns mutual matches only (both liked each other).

```json
{
  "matches": [
    { "id": 1, "profile": { ... }, "matchedAt": "2024-01-01 12:00:00" }
  ]
}
```

### `POST /api/undo`
Undoes the last swipe and returns the profile to the feed.

```json
{
  "success": true,
  "undoneProfile": { "id": 1, "name": "Ananya Sharma", ... },
  "undoneAction": "like"
}
```

### `POST /api/reset`
Resets all user swipes (useful for demos). Pre-seeded likes from profiles are preserved.

```json
{ "success": true, "message": "All your swipes have been reset" }
```

## 🏗️ Database Schema

```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,
  name TEXT, age INTEGER, photo TEXT,
  bio TEXT, city TEXT, college TEXT, interests TEXT
);

CREATE TABLE swipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  swiper_id INTEGER,     -- 0 = logged-in user
  swiped_id INTEGER,
  action TEXT,            -- 'like' or 'pass'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, swiped_id)
);
```

## 🔒 Privacy

> **"Never reveal who has liked the user unless it is mutual."**

- The feed API returns profiles with no indication of who has liked the user
- Matches are only shown when **both** users have liked each other
- Pre-seeded likes are invisible to the frontend until a mutual like occurs

## 📱 Mobile-First

- Touch-friendly drag gestures for swiping
- Responsive card sizing and layout
- Fixed bottom tab bar
- Dynamic viewport height (`dvh`) for proper mobile browser support
- Disabled pull-to-refresh and tap highlight for a native app feel

## 🔄 Reset Data

Delete the SQLite database to start completely fresh:
```bash
# Windows
del coy.db

# Mac/Linux
rm coy.db
```
The database is auto-created and re-seeded on the next server start.

---

Built for the Coy SDE Intern Assignment
