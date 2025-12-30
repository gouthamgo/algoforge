# AlgoForge - Progress Tracker

> **Last Updated:** December 30, 2024 (Evening Update)
> **Reference this file in future Claude sessions to save tokens!**
>
> ## Recent Session Changes
> - Installed Monaco Editor for code editing
> - Created split-view ProblemPage with resizable panels
> - Redesigned Dashboard with pattern progress
> - Fixed full-width layouts across all pages
> - Added 5 more problems (6 total)

---

## Quick Start Commands

```bash
# First time setup
./run.sh setup

# Start development (db + app)
./run.sh dev

# Other commands
./run.sh status   # Check service status
./run.sh seed     # Re-seed lesson content
./run.sh reset    # Reset database completely
./run.sh help     # Show all commands
```

---

## Project Overview

| Item | Value |
|------|-------|
| **Project** | AlgoForge - FAANG Interview Prep Platform |
| **Framework** | Wasp v0.19+ (Full-stack TypeScript) |
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Database** | PostgreSQL + Prisma ORM |
| **Location** | `/Users/ganguly/Documents/code/algoforge/` |

---

## Implementation Progress

### Phase 1: Foundation [90% Complete]

| Task | Status | Files |
|------|--------|-------|
| Project setup with Wasp | ✅ Done | `main.wasp` |
| Database schema | ✅ Done | `schema.prisma` |
| Authentication (email) | ✅ Done | `src/auth/` |
| Basic UI components | ✅ Done | `src/client/components/ui/` |
| Design system | ✅ Done | `src/client/Main.css` |
| Landing page | ✅ Done | `src/landing-page/` |
| Dashboard | ✅ Done | `src/dashboard/DashboardPage.tsx` |
| Seed script | ✅ Done | `src/server/scripts/dbSeeds.ts` |

### Phase 2: Learning Core [40% Complete]

| Task | Status | Files |
|------|--------|-------|
| Roadmap page | ✅ Done | `src/roadmap/RoadmapPage.tsx` |
| Topic page | ✅ Done | `src/roadmap/TopicPage.tsx` |
| Pattern page | ✅ Done | `src/roadmap/PatternPage.tsx` |
| Problem list page | ✅ Done | `src/problems/ProblemsListPage.tsx` |
| Problem detail page | ✅ Done | `src/problems/ProblemPage.tsx` |
| Code editor (Monaco) | ⏳ Pending | - |
| Code execution (Judge0) | ⏳ Pending | `src/server/codeExecution/` |
| Test case runner | ⏳ Pending | - |

### Phase 3: Problem Experience [20% Complete]

| Task | Status | Files |
|------|--------|-------|
| Problem operations | ✅ Done | `src/problems/operations.ts` |
| Hints system | ✅ Done | `useHint` action |
| Solution reveal | ✅ Done | `viewSolution` action |
| Split-view interface | ⏳ Pending | - |
| Multiple languages | ⏳ Pending | - |
| Submission history | ⏳ Pending | - |

### Phase 4: Gamification [10% Complete]

| Task | Status | Files |
|------|--------|-------|
| XP system | ✅ Done | `src/shared/constants.ts` |
| Level config | ✅ Done | `LEVEL_CONFIG` |
| Streak config | ✅ Done | `STREAK_CONFIG` |
| Achievements page | ⏳ Pending | - |
| Leaderboards | ⏳ Pending | - |

### Phase 5: Spaced Repetition [0% Complete]

| Task | Status | Files |
|------|--------|-------|
| SM-2 algorithm | ⏳ Pending | - |
| Review queue | ⏳ Pending | - |
| Daily goals | ⏳ Pending | - |

---

## Database Content

### Current Seed Data

| Entity | Count | Details |
|--------|-------|---------|
| Topics | 1 | Fundamentals |
| Patterns | 1 | Arrays & Hashing |
| Problems | 6 | See list below |
| Company Tags | 4 per problem | Google, Amazon, Meta, Microsoft |

### Available Problems

| # | Problem | Difficulty | XP |
|---|---------|------------|-----|
| 1 | Two Sum | Easy | 10 |
| 2 | Valid Anagram | Easy | 10 |
| 3 | Contains Duplicate | Easy | 10 |
| 4 | Group Anagrams | Medium | 20 |
| 5 | Top K Frequent Elements | Medium | 20 |
| 6 | Product of Array Except Self | Medium | 20 |

### Problems to Add

Refer to `ALGOFORGE_ARCHITECTURE.md` for the full 15-pattern curriculum:

1. Arrays & Hashing (50 problems) - 1 done
2. Two Pointers (30 problems)
3. Sliding Window (25 problems)
4. Stack (20 problems)
5. Binary Search (30 problems)
6. Linked List (25 problems)
7. Trees (40 problems)
8. Tries (10 problems)
9. Heap/Priority Queue (20 problems)
10. Backtracking (25 problems)
11. Graphs (35 problems)
12. 1D Dynamic Programming (30 problems)
13. 2D Dynamic Programming (25 problems)
14. Greedy (20 problems)
15. Intervals (15 problems)

---

## Key Files Reference

### Configuration
- `app/main.wasp` - Main Wasp config (routes, queries, actions)
- `app/schema.prisma` - Database schema
- `app/.env.server` - Environment variables

### Core Features
- `app/src/dashboard/DashboardPage.tsx` - Main dashboard
- `app/src/problems/operations.ts` - Problem CRUD operations
- `app/src/roadmap/operations.ts` - Roadmap queries
- `app/src/shared/constants.ts` - XP, levels, patterns config

### Database
- `app/src/server/scripts/dbSeeds.ts` - Seed functions
- DB Container: `wasp-dev-db-AlgoForge-ebd83a2445`
- DB Credentials: `postgresWaspDevUser:postgresWaspDevPass`

---

## Common Tasks for Claude

### Add More Problems

```
Tell Claude: "Add [X] more problems to the [pattern] pattern.
Use the seed script format in dbSeeds.ts. Run ./run.sh seed after."
```

### Fix UI Issues

```
Tell Claude: "The [component] in [file path] needs [description].
Check the file and fix it."
```

### Add New Feature

```
Tell Claude: "I want to add [feature].
Check ALGOFORGE_ARCHITECTURE.md for the design spec.
Focus on [specific aspect]."
```

---

## Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Code execution not implemented | Pending | Need Judge0 API key |
| Only 1 problem seeded | Pending | Add more via seed script |
| Social auth commented out | Pending | Need Google/GitHub OAuth keys |

---

## Next Steps (Priority Order)

1. **Add more problems** - Need at least 5-10 per pattern for testing
2. **Code editor** - Integrate Monaco editor for problem solving
3. **Code execution** - Set up Judge0 API for running code
4. **Dashboard improvements** - Show more context, patterns progress

---

## Environment Setup

### Required Services
- Docker Desktop (for PostgreSQL)
- Node.js 18+
- Wasp CLI (`curl -sSL https://get.wasp.sh | sh`)

### API Keys Needed (for full features)
- Judge0 API (code execution)
- Stripe (payments)
- SendGrid (emails)
- Google OAuth (social login)
- GitHub OAuth (social login)

---

## Architecture Reference

See `ALGOFORGE_ARCHITECTURE.md` for:
- Complete database schema
- All 15 patterns with descriptions
- Component structure
- API reference
- Design system colors/components

---

*Keep this file updated after each development session!*
