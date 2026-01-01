# AlgoForge Architecture

> A comprehensive guide to the AlgoForge codebase for developers and AI assistants.

## Overview

**AlgoForge** is a full-stack web application for mastering coding interviews through pattern-based learning. Built with the Wasp framework, it combines a React frontend with a Node.js backend and PostgreSQL database.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Wasp v0.19.0 |
| Frontend | React 18, TypeScript, Tailwind CSS, Radix UI |
| Backend | Node.js, Express (via Wasp) |
| Database | PostgreSQL with Prisma ORM |
| Code Editor | Monaco Editor |
| Auth | Email/password with verification |
| Payments | Stripe, Polar, LemonSqueezy |
| Jobs | PgBoss (background task scheduler) |

---

## Project Structure

```
algoforge/
├── app/                          # Main application
│   ├── main.wasp                 # Wasp configuration (routes, queries, actions, jobs)
│   ├── schema.prisma             # Database schema
│   ├── package.json              # Dependencies
│   ├── tailwind.config.js        # Tailwind theme
│   └── src/
│       ├── admin/                # Admin dashboards
│       │   ├── dashboards/
│       │   │   ├── analytics/    # Revenue, users, page views
│       │   │   └── users/        # User management
│       │   └── layout/           # Admin layout components
│       ├── analytics/            # Stats calculation
│       │   ├── operations.ts     # getDailyStats query
│       │   └── stats.ts          # dailyStatsJob implementation
│       ├── auth/                 # Authentication
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   └── email-and-pass/   # Password reset, email verification
│       ├── celebration/          # Achievement celebrations
│       ├── client/               # Core client setup
│       │   ├── App.tsx           # Root component with NavBar
│       │   ├── components/       # Shared UI components
│       │   │   ├── gamification/ # XP badges, level displays
│       │   │   └── ui/           # Buttons, cards, inputs
│       │   ├── hooks/            # Custom React hooks
│       │   └── icons/            # Icon components
│       ├── dashboard/            # User dashboard
│       │   ├── DashboardPage.tsx
│       │   └── operations.ts     # getDashboardData
│       ├── gamification/         # XP, levels, achievements
│       │   ├── constants.ts      # Level titles, XP calculations
│       │   ├── operations.ts     # getGamificationData, getHeaderStats
│       │   └── components/       # XPDisplay, AchievementCard
│       ├── landing-page/         # Public homepage
│       ├── learning-path/        # Personalized learning
│       │   ├── operations.ts     # getLearningPath
│       │   └── components/       # PathProgress, PhaseCard
│       ├── onboarding/           # New user flow
│       │   ├── OnboardingPage.tsx
│       │   └── operations.ts     # getOnboardingStatus, completeOnboarding
│       ├── payment/              # Subscriptions
│       │   ├── PricingPage.tsx
│       │   ├── operations.ts     # generateCheckoutSession
│       │   └── paymentProcessor.ts
│       ├── problems/             # Core problem solving
│       │   ├── ProblemsListPage.tsx
│       │   ├── ProblemPage.tsx   # Code editor + problem view
│       │   └── operations.ts     # submitCode, runCode, getProblems
│       ├── profile/              # User profile & settings
│       ├── review/               # Spaced repetition
│       │   ├── ReviewPage.tsx
│       │   └── operations.ts     # getReviewQueue, completeReview
│       ├── roadmap/              # Learning curriculum
│       │   ├── RoadmapPage.tsx   # Skill tree visualization
│       │   ├── TopicPage.tsx
│       │   ├── PatternPage.tsx
│       │   └── operations.ts     # getRoadmap, getTopic, getPattern
│       ├── server/               # Backend utilities
│       │   ├── jobs/
│       │   │   ├── achievements.ts  # checkAchievements job
│       │   │   └── streaks.ts       # updateStreaks job
│       │   └── scripts/          # Database seeders
│       ├── shared/               # Shared utilities
│       └── user/                 # User operations
│           └── operations.ts     # updateSettings
└── run.sh                        # Development helper script
```

---

## Database Schema

### Core Models

#### User
Primary user account with learning stats and preferences.

```prisma
model User {
  id                    String   @id @default(uuid())
  email                 String?  @unique
  username              String?  @unique
  displayName           String?
  isAdmin               Boolean  @default(false)

  // Subscription
  subscriptionStatus    String?  // 'free', 'pro', 'lifetime'
  credits               Int      @default(3)

  // Learning Stats
  currentStreak         Int      @default(0)
  longestStreak         Int      @default(0)
  totalXp               Int      @default(0)
  level                 Int      @default(1)

  // Preferences
  preferredLanguage     String   @default("python")
  dailyGoal             Int      @default(3)

  // Onboarding
  hasCompletedOnboarding  Boolean @default(false)
  onboardingGoal          String? // 'career', 'startup', 'upskill', 'curious'
  experienceLevel         String? // 'beginner', 'intermediate', 'advanced'
}
```

#### Learning Content Hierarchy

```
Topic (e.g., "Fundamentals")
  └── Pattern (e.g., "Arrays & Hashing")
        └── Problem (e.g., "Two Sum")
              └── ProblemCompany (e.g., "Google", frequency: 5)
```

#### User Progress Tracking

```prisma
model UserProblemProgress {
  status          String    // not_started, attempted, solved, mastered
  hintsUsed       Int
  solutionViewed  Boolean
  totalTimeSpent  Int       // seconds

  // Spaced Repetition (SM-2 algorithm)
  easeFactor      Float     @default(2.5)
  interval        Int       @default(1)
  nextReviewDate  DateTime?
}
```

### All Models

| Model | Purpose |
|-------|---------|
| `User` | User accounts with stats, preferences, subscriptions |
| `Topic` | Top-level learning categories |
| `TopicPrerequisite` | Topic dependency graph |
| `Pattern` | Coding patterns within topics |
| `Problem` | Individual coding challenges |
| `ProblemCompany` | Company tags for problems |
| `UserProblemProgress` | Per-problem user progress |
| `Submission` | Code submission history |
| `ReviewQueueItem` | Spaced repetition queue |
| `Achievement` | Achievement definitions |
| `UserAchievement` | Unlocked achievements |
| `Celebration` | Celebration events (level up, streaks, etc.) |
| `StudySession` | Learning session tracking |
| `DailyStats` | Admin analytics data |
| `PageViewSource` | Traffic source analytics |
| `Logs` | Application logs |
| `File` | S3 file uploads |

---

## API Operations

### Queries (Read Operations)

| Query | Location | Description |
|-------|----------|-------------|
| `getDashboardData` | `dashboard/operations.ts` | User stats, recent activity, next problems |
| `getRoadmap` | `roadmap/operations.ts` | Complete roadmap with all topics/patterns |
| `getTopic` | `roadmap/operations.ts` | Specific topic with patterns |
| `getPattern` | `roadmap/operations.ts` | Pattern with problems |
| `getProblems` | `problems/operations.ts` | Paginated problem list with filters |
| `getProblem` | `problems/operations.ts` | Single problem with user progress |
| `getLearningPath` | `learning-path/operations.ts` | Personalized learning phases |
| `getReviewQueue` | `review/operations.ts` | Problems due for review |
| `getGamificationData` | `gamification/operations.ts` | XP, level, streaks, achievements |
| `getHeaderStats` | `gamification/operations.ts` | Minimal stats for navbar |
| `getUserProfile` | `profile/operations.ts` | Profile with stats |
| `getOnboardingStatus` | `onboarding/operations.ts` | Onboarding completion |
| `getDailyStats` | `analytics/operations.ts` | Admin analytics (admin-only) |
| `getPaginatedUsers` | `user/operations.ts` | User list (admin-only) |
| `getCustomerPortalUrl` | `payment/operations.ts` | Subscription management URL |
| `getPendingCelebrations` | `celebration/operations.ts` | Unseen celebrations |
| `getCelebration` | `celebration/operations.ts` | Single celebration |

### Actions (Write Operations)

| Action | Location | Description |
|--------|----------|-------------|
| `submitCode` | `problems/operations.ts` | Submit solution, award XP, update progress |
| `runCode` | `problems/operations.ts` | Execute code with test cases |
| `saveProgress` | `problems/operations.ts` | Save code without submitting |
| `useHint` | `problems/operations.ts` | Get next hint |
| `viewSolution` | `problems/operations.ts` | Mark solution as viewed |
| `completeReview` | `review/operations.ts` | Complete spaced repetition review |
| `updateSettings` | `user/operations.ts` | Update user preferences |
| `completeOnboarding` | `onboarding/operations.ts` | Finish onboarding flow |
| `generateCheckoutSession` | `payment/operations.ts` | Create payment session |
| `updateIsUserAdminById` | `user/operations.ts` | Toggle admin (admin-only) |

### Background Jobs

| Job | Schedule | Location | Description |
|-----|----------|----------|-------------|
| `dailyStatsJob` | Hourly | `analytics/stats.ts` | Calculate admin analytics |
| `checkAchievements` | Every 15 min | `server/jobs/achievements.ts` | Check/award achievements |
| `updateStreaks` | Daily midnight | `server/jobs/streaks.ts` | Update user streaks |

---

## Routes & Pages

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | `LandingPage` | Marketing homepage |
| `/pricing` | `PricingPage` | Subscription plans |

### Auth Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | `LoginPage` | Sign in |
| `/signup` | `SignupPage` | Registration |
| `/email-verification` | `EmailVerificationPage` | Verify email |
| `/request-password-reset` | `RequestPasswordResetPage` | Request reset |
| `/password-reset` | `PasswordResetPage` | Set new password |

### Protected Routes (Require Auth)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | `DashboardPage` | Main user dashboard |
| `/roadmap` | `RoadmapPage` | Learning skill tree |
| `/roadmap/:topicSlug` | `TopicPage` | Topic details |
| `/roadmap/:topicSlug/:patternSlug` | `PatternPage` | Pattern details |
| `/problems` | `ProblemsListPage` | Browse problems |
| `/problems/:problemSlug` | `ProblemPage` | Solve problem (code editor) |
| `/companies/:company` | `CompanyProblemsPage` | Problems by company |
| `/review` | `ReviewPage` | Spaced repetition |
| `/onboarding` | `OnboardingPage` | New user setup |
| `/celebrate/:celebrationId` | `CelebrationPage` | Achievement display |
| `/profile` | `ProfilePage` | User profile |
| `/achievements` | `AchievementsPage` | All achievements |
| `/settings` | `SettingsPage` | Preferences |
| `/account` | `AccountPage` | Billing |
| `/checkout` | `CheckoutResultPage` | Payment result |

### Admin Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | `AnalyticsDashboardPage` | Revenue, metrics |
| `/admin/users` | `UsersDashboardPage` | User management |

---

## Key Systems

### 1. Gamification System

**Location:** `src/gamification/`

**XP Earning:**
- Solving problems: `problem.xpReward` (typically 10+ XP)
- Unlocking achievements: `achievement.xpReward` (25-5000 XP)

**Leveling:**
- 10 levels with exponential XP requirements
- Formula: `100 * Math.pow(1.5, level - 1)`
- Level 1: 100 XP, Level 5: 760 XP, Level 10: 3,844 XP

**Level Titles:**
```
Level 1:  Curious Learner    🌱
Level 2:  Code Explorer      🔍
Level 3:  Pattern Seeker     🧩
Level 4:  Algorithm Apprentice 📚
Level 5:  Data Structurer    🏗️
Level 6:  Problem Solver     💡
Level 7:  Code Warrior       ⚔️
Level 8:  Algorithm Ninja    🥷
Level 9:  Tech Architect     🏛️
Level 10: AI Mastermind      👑
```

### 2. Spaced Repetition System

**Location:** `src/review/`

Uses SM-2 algorithm for optimal review scheduling:
- Quality rating: 0-5 scale
- Ease factor adjustment based on performance
- Interval calculation for next review

### 3. Learning Path System

**Location:** `src/learning-path/`

6 phases of structured learning:
1. Foundation (free)
2. Traversal Mastery (free)
3. Core Structures (premium)
4. Hierarchical Thinking (premium)
5. Advanced Techniques (premium)
6. Optimization Masters (premium)

15 core patterns across all phases.

### 4. Problem Solving

**Location:** `src/problems/`

**Code Execution:** Currently uses mock responses. Designed for Judge0/Piston API integration.

**Progress States:**
- `not_started` → `attempted` → `solved` → `mastered`

**Features:**
- Monaco code editor
- Multiple language support (Python, JavaScript, etc.)
- Hints system
- Solution viewing
- Time tracking

---

## Development

### Running the App

```bash
# First time setup
./run.sh setup

# Start development (db + app)
./run.sh dev

# Other commands
./run.sh db        # Start only database
./run.sh migrate   # Run migrations
./run.sh seed      # Seed content
./run.sh clean     # Clean build artifacts
./run.sh status    # Check service status
```

### Database

```bash
# Connection
DATABASE_URL="postgresql://postgresWaspDevUser:postgresWaspDevPass@localhost:5432/AlgoForge-ebd83a2445"

# Prisma commands
npx prisma studio    # Visual database browser
npx prisma migrate   # Run migrations
```

### Key Files to Modify

| Purpose | File |
|---------|------|
| Add route | `main.wasp` |
| Add query/action | `main.wasp` + `*/operations.ts` |
| Add model | `schema.prisma` |
| Add page | `src/*/Page.tsx` |
| Add component | `src/client/components/` |
| Modify gamification | `src/gamification/constants.ts` |
| Add background job | `main.wasp` + `src/server/jobs/` |

---

## Authentication

**Provider:** Email/password via Wasp's built-in auth

**Features:**
- Email verification required
- Password reset flow
- Session-based authentication
- `authRequired: true` on protected routes

**User Fields:** email, username, displayName, avatarUrl, isAdmin

---

## Payment Integration

**Location:** `src/payment/`

**Supported Processors:**
- Stripe
- Polar
- LemonSqueezy

**Subscription Tiers:**
- Free (3 credits)
- Pro (monthly)
- Lifetime

Webhook endpoint at `/payments-webhook` for payment events.

---

## Common Patterns

### Adding a New Query

1. Define in `main.wasp`:
```wasp
query getMyData {
  fn: import { getMyData } from "@src/myFeature/operations",
  entities: [User, Problem]
}
```

2. Implement in `src/myFeature/operations.ts`:
```typescript
export const getMyData: GetMyData<void, MyDataType> = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  return await context.entities.Problem.findMany({ ... });
};
```

### Adding a New Page

1. Define in `main.wasp`:
```wasp
route MyPageRoute { path: "/my-page", to: MyPage }
page MyPage {
  component: import MyPage from "@src/myFeature/MyPage",
  authRequired: true
}
```

2. Create `src/myFeature/MyPage.tsx`

### Using Operations in Components

```typescript
import { useQuery } from 'wasp/client/operations';
import { getMyData } from 'wasp/client/operations';

function MyComponent() {
  const { data, isLoading, error } = useQuery(getMyData);
  // ...
}
```

---

## Notes for AI Assistants

1. **Wasp Framework**: Routes, queries, actions, and jobs are defined in `main.wasp`, not in separate routing files.

2. **Generated Code**: The `.wasp/out/` directory contains generated code - don't modify directly.

3. **Type Safety**: Wasp generates types from `main.wasp` and `schema.prisma`.

4. **Operations Pattern**: All backend logic goes in `operations.ts` files per feature.

5. **Component Location**: Shared components in `src/client/components/`, feature-specific next to their pages.

6. **Database Access**: Use `context.entities` in operations, not direct Prisma imports.

---

---

## Session Progress Tracker

### Modularization (Completed Jan 2026)

**Goal:** Reduce file sizes to avoid context limits, improve development speed

| Task | Status | Details |
|------|--------|---------|
| Split ProblemPage.tsx | ✅ Done | 4,436 → 957 lines (-78%) |
| Extract EXPLANATIONS data | ✅ Done | Created `problems/data/explanations.ts` (3,488 lines) |
| Add barrel exports | ✅ Done | 7 index.ts files added |
| Landing page | ✅ Already modular | Has `components/` folder |
| Gamification constants | ✅ Well organized | 318 lines with clear sections |
| Roadmap data | ⏭️ Skipped | Icon dependencies, 500 lines acceptable |

**New Files Created:**
- `src/problems/data/explanations.ts` - Problem explanations
- `src/gamification/index.ts` - Barrel export
- `src/problems/index.ts` - Barrel export
- `src/shared/index.ts` - Barrel export
- `src/roadmap/index.ts` - Barrel export
- `src/dashboard/index.ts` - Barrel export
- `src/onboarding/index.ts` - Barrel export
- `src/learning-path/index.ts` - Barrel export

---

*Last updated: January 2026*
