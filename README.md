# AlgoForge

**Master Coding Interviews with Pattern-Based Learning**

AlgoForge is a comprehensive coding interview preparation platform featuring pattern-based learning, spaced repetition, and real code execution. From beginner to FAANG-ready.

## Tech Stack

### Core Framework
| Technology | Purpose |
|------------|---------|
| [Wasp](https://wasp.sh) v0.19 | Full-stack framework (handles routing, auth, DB, jobs) |
| [React](https://react.dev) 18 | Frontend UI library |
| [TypeScript](https://www.typescriptlang.org/) 5.8 | Type-safe JavaScript |
| [Node.js](https://nodejs.org/) | Backend runtime |
| [Vite](https://vitejs.dev/) 7 | Build tool & dev server |

### Database & ORM
| Technology | Purpose |
|------------|---------|
| [PostgreSQL](https://www.postgresql.org/) | Primary database |
| [Prisma](https://www.prisma.io/) 5.19 | ORM & database migrations |
| [PgBoss](https://github.com/timgit/pg-boss) | Background job processing |

### Frontend
| Technology | Purpose |
|------------|---------|
| [Tailwind CSS](https://tailwindcss.com/) 3 | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible component primitives |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Code editor (VS Code engine) |
| [ApexCharts](https://apexcharts.com/) | Data visualization |
| [React Hook Form](https://react-hook-form.com/) | Form handling |
| [Zod](https://zod.dev/) | Schema validation |

### Authentication & Payments
| Technology | Purpose |
|------------|---------|
| Wasp Auth | Email/password authentication |
| [Stripe](https://stripe.com/) | Payment processing |
| [LemonSqueezy](https://www.lemonsqueezy.com/) | Alternative payment processor |
| [Polar](https://polar.sh/) | Creator monetization |

### Integrations
| Technology | Purpose |
|------------|---------|
| [OpenAI](https://openai.com/) | AI-powered features |
| [AWS S3](https://aws.amazon.com/s3/) | File storage |
| [Google Analytics](https://analytics.google.com/) | Analytics |
| [Plausible](https://plausible.io/) | Privacy-friendly analytics |

### Testing & Documentation
| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | End-to-end testing |
| [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) | Blog & documentation |

## Project Structure

```
algoforge/
├── app/                    # Main Wasp application
│   ├── src/
│   │   ├── auth/          # Authentication pages & logic
│   │   ├── client/        # Shared UI components
│   │   ├── dashboard/     # User dashboard
│   │   ├── landing-page/  # Public landing page
│   │   ├── payment/       # Subscription & checkout
│   │   ├── problems/      # Problem solving interface
│   │   ├── profile/       # User profile & settings
│   │   ├── review/        # Spaced repetition review
│   │   ├── roadmap/       # Learning path & topics
│   │   └── admin/         # Admin dashboard
│   ├── main.wasp          # Wasp config (routes, queries, actions)
│   └── schema.prisma      # Database schema
├── blog/                   # Astro-based blog/docs
└── e2e-tests/             # Playwright test suite
```

## Features

- **Pattern-Based Learning** - Structured curriculum organized by DSA patterns
- **Spaced Repetition** - SM-2 algorithm for optimal problem review scheduling
- **Code Execution** - Real-time code running with test cases
- **Progress Tracking** - XP, streaks, levels, and achievements
- **Company-Specific Prep** - Problems tagged by FAANG companies
- **Multiple Languages** - Support for Python, JavaScript, and more

## Getting Started

```bash
# Install Wasp CLI
curl -sSL https://get.wasp-lang.dev/installer.sh | sh

# Navigate to app directory
cd app

# Install dependencies
npm install

# Start development server
wasp start
```

## License

MIT
