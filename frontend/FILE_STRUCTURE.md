# Frontend File Structure

```
prescribeme/frontend/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx          ← Reusable button component
│   │   │   ├── Card.tsx            ← Container component
│   │   │   ├── Input.tsx           ← Form input with validation
│   │   │   └── index.ts            ← Barrel export
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx          ← Main app wrapper
│   │   │   ├── Sidebar.tsx         ← Collapsible sidebar navigation
│   │   │   ├── Header.tsx          ← Top header bar
│   │   │   └── (no index.ts)       ← Direct imports used
│   │   │
│   │   └── pages/
│   │       ├── Dashboard.tsx       ← Dashboard page
│   │       ├── Login.tsx           ← Login page with form
│   │       ├── Profile.tsx         ← User profile page
│   │       └── Settings.tsx        ← Settings page
│   │
│   ├── hooks/
│   │   ├── useApi.ts              ← GET/POST/PUT/DELETE hooks
│   │   ├── useForm.ts             ← Form hook with Zod validation
│   │   ├── useNotification.ts     ← Notification hook
│   │   └── index.ts               ← Barrel export
│   │
│   ├── services/
│   │   └── api.ts                 ← Axios instance with interceptors
│   │
│   ├── store/
│   │   ├── authStore.ts           ← Authentication state (Zustand)
│   │   ├── uiStore.ts             ← UI state (sidebar, theme)
│   │   └── index.ts               ← Barrel export
│   │
│   ├── types/
│   │   └── index.ts               ← TypeScript type definitions
│   │                                 (ApiResponse, User, etc)
│   │
│   ├── utils/
│   │   ├── http.ts                ← HTTP utility functions
│   │   ├── queryClient.ts         ← TanStack Query configuration
│   │   └── index.ts               ← Barrel export
│   │
│   ├── routes/
│   │   └── index.tsx              ← React Router configuration
│   │
│   ├── styles/
│   │   └── (placeholder folder)   ← For global/shared styles
│   │
│   ├── assets/                    ← Static assets (images, logos)
│   │   └── react.svg
│   │
│   ├── App.tsx                    ← Root component
│   ├── App.css                    ← Root styles
│   ├── main.tsx                   ← React entry point
│   ├── index.css                  ← Global styles
│   └── vite-env.d.ts              ← Vite type definitions
│
├── public/                         ← Static assets
│   └── vite.svg
│
├── dist/                           ← Production build output
│   ├── index.html
│   └── assets/
│       ├── index-*.js             ← Bundled JavaScript
│       └── index-*.css            ← Bundled CSS
│
├── node_modules/                  ← Dependencies (228 packages)
│
├── Configuration Files
├── ├── vite.config.ts             ← Vite build configuration
│ ├── tsconfig.json                ← Root TypeScript config
│ ├── tsconfig.app.json            ← App-specific TypeScript
│ ├── tsconfig.node.json           ← Node TypeScript config
│ ├── eslint.config.mjs            ← ESLint configuration
│ ├── package.json                 ← Project metadata & dependencies
│ ├── package-lock.json            ← Locked dependency versions
│ ├── index.html                   ← HTML entry point
│ │
│ ├── Environment Files
│ ├── .env.example                 ← Environment template
│ ├── .env.local                   ← Local environment (gitignored)
│ ├── .gitignore                   ← Git ignore rules
│ │
│ └── Documentation
│     ├── README.md                ← Main project documentation
│     ├── DEVELOPMENT.md           ← Developer guide
│     ├── SETUP_SUMMARY.md         ← Setup overview
│     ├── CHECKLIST.md             ← Completion checklist
│     └── FILE_STRUCTURE.md        ← This file
│
└── Key Files Summary
    │
    ├── Entry Points
    │   ├── index.html              ← Browser loads this
    │   ├── src/main.tsx            ← React app starts here
    │   └── src/App.tsx             ← Root component (minimal)
    │
    ├── Core Setup
    │   ├── src/routes/index.tsx    ← All page routes defined
    │   ├── src/services/api.ts     ← API client config
    │   └── vite.config.ts          ← Build configuration
    │
    ├── Data & State
    │   ├── src/utils/queryClient.ts  ← TanStack Query setup
    │   ├── src/store/authStore.ts    ← Auth state
    │   └── src/store/uiStore.ts      ← UI state
    │
    ├── Utilities
    │   ├── src/utils/http.ts       ← HTTP functions
    │   ├── src/hooks/useApi.ts     ← Data fetching hooks
    │   ├── src/hooks/useForm.ts    ← Form validation
    │   └── src/types/index.ts      ← Type definitions
    │
    └── UI Components
        ├── src/components/common/ ← Reusable UI elements
        ├── src/components/layout/ ← App structure
        └── src/components/pages/  ← Page components
```

## File Counts

| Category | Count |
|----------|-------|
| React/TSX Components | 10 |
| TypeScript Files | 16 |
| Configuration Files | 8 |
| Documentation Files | 4 |
| Total Source Files | 26+ |
| Total Dependencies | 228 |
| Production Bundle | 133.65 KB (gzipped) |

## Important Notes

### Imports Pattern
```tsx
// Use barrel exports
import { Button, Input, Card } from '@/components/common';

// Use index files
import { useAuthStore, useUIStore } from '@/store';

// Use direct imports for pages
import Dashboard from '@/components/pages/Dashboard';
```

### Type-Only Imports
```tsx
// TypeScript strict mode requires type imports
import type { User, ApiResponse } from '@/types';
```

### API Path Aliases
```tsx
// @ is configured in vite.config.ts
import { useForm } from '@/hooks';  // Maps to src/hooks
```

## Development Workflow

1. **Add a feature** → Create component in appropriate folder
2. **Add a route** → Update `src/routes/index.tsx`
3. **Add navigation** → Update `src/components/layout/Sidebar.tsx`
4. **Use API** → Create hook in `src/hooks/` using `useApi*`
5. **Manage state** → Add store to `src/store/`
6. **Define types** → Add to `src/types/index.ts`

## Build Process

```
src/ (TypeScript/React)
  ↓
TypeScript Compiler (tsc)
  ↓
Vite Build
  ↓
dist/ (Optimized JavaScript/CSS)
```

Generated: 2025-11-17
