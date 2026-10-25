# Next.js Migration Report

## Baseline
- Original: React 18 + Vite + React Router DOM 6.
- Production build passed with Vite before migration.

## Target
- Next.js 14.2.35 (App Router), React 18.3.1, TypeScript.

## Route mapping
| Old route | New route |
|---|---|
| / | app/page.tsx -> /overview |
| /signin | app/signin/page.tsx |
| /forgot-password | app/forgot-password/page.tsx |
| /reset-password | app/reset-password/page.tsx |
| /accept-invite | app/accept-invite/page.tsx |
| /unauthorized | app/unauthorized/page.tsx |
| /overview | app/(app)/overview/page.tsx |
| /queue | app/(app)/queue/page.tsx -> /queue/mine |
| /queue/:view | app/(app)/queue/[view]/page.tsx |
| /tickets | app/(app)/tickets/page.tsx -> /queue/mine |
| /tickets/new | app/(app)/tickets/new/page.tsx |
| /tickets/:id | app/(app)/tickets/[id]/page.tsx |
| /notifications | app/(app)/notifications/page.tsx |
| /account | app/(app)/account/page.tsx -> /account/profile |
| /account/:section | app/(app)/account/[section]/page.tsx |
| /reports | app/(app)/reports/page.tsx |
| /admin | app/(app)/admin/page.tsx -> /admin/users |
| /admin/users | app/(app)/admin/users/page.tsx |
| /admin/users/:id | app/(app)/admin/users/[id]/page.tsx |
| /admin/teams | app/(app)/admin/teams/page.tsx |
| /admin/teams/:id | app/(app)/admin/teams/[id]/page.tsx |
| /admin/roles | app/(app)/admin/roles/page.tsx |
| /settings | app/(app)/settings/page.tsx -> /settings/general |
| /settings/:section | app/(app)/settings/[section]/page.tsx |

## Key changes
- Added `app/` routes and root layout.
- Moved Vite pages to `src/views`.
- Added `src/lib/router.tsx` compatibility shim for react-router APIs.
- Updated imports and client component boundaries.
- Guarded browser-only portal/document usage for SSR.
- Removed Vite config and dependency.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run dev` started and served /overview, /tickets/:id.
- `npm start` served production build.
