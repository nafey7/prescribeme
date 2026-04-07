# End-to-end completion for existing PrescribeMe features

**GitHub issue:** https://github.com/nafey7/prescribeme/issues/4

This document describes how existing product flows were completed so the backend, frontend, and documented behavior align before new features are added.

## Goals

1. **Prescriptions:** Doctors can create and update prescriptions backed by MongoDB; patients continue to read their own data.
2. **Doctor–patient access:** Doctors only see patients they have an explicit care relationship with (derived from seeded prescriptions and new prescriptions).
3. **Settings & profile:** Authenticated users load and update profile, role-specific fields, and password via the API.
4. **Notifications:** Users can mark notifications read, mark all read, and delete them.
5. **Password reset:** Email-based request + token reset flow (dev-oriented; email is logged when SMTP is not configured).
6. **Frontend:** Wire forms to APIs, fix dashboard navigation, add route guards, add forgot/reset pages, disable placeholder OAuth buttons.

## Backend changes (summary)

| Area | Change |
|------|--------|
| `CareRelationship` | New document linking `Doctor` ↔ `Patient`; seeded from existing prescriptions; created when a new prescription is created. |
| `PasswordResetToken` | New document for reset tokens (hashed), expiry, one-time use. |
| `POST /api/v1/doctors/prescriptions` | Creates `Prescription` + ensures `CareRelationship`. |
| `GET/PATCH /api/v1/doctors/prescriptions/{id}` | Read/update prescription for owning doctor. |
| `GET/PATCH /api/v1/shared/profile` | Read/update `User.full_name` (email/username unchanged here). |
| `GET/PATCH /api/v1/shared/settings` | Aggregate user + doctor or patient profile for the settings UI. |
| `POST /api/v1/shared/change-password` | Verifies current password and sets a new one. |
| `PATCH /api/v1/shared/notifications/{id}` | Mark one notification read. |
| `POST /api/v1/shared/notifications/mark-all-read` | Mark all read for current user. |
| `DELETE /api/v1/shared/notifications/{id}` | Delete one notification. |
| `POST /api/v1/auth/forgot-password` | Creates reset token; responds generically. |
| `POST /api/v1/auth/reset-password` | Validates token and updates password. |

## Frontend changes (summary)

| Area | Change |
|------|--------|
| Create / edit prescription | Real patient list, `POST`/`PATCH` to doctor prescription APIs. |
| Doctor & patient settings | Load `GET /shared/settings`, save profile via `PATCH`, password via `POST /shared/change-password`. |
| Dashboard profile | Load `GET /shared/profile`, save via `PATCH /shared/profile`. |
| Notifications | Mutation hooks for mark read, mark all, delete; fix query string for type filters. |
| Auth | `RequireAuth` + `DoctorRoute` / `PatientRoute` wrappers; forgot + reset pages. |
| Sidebar | Role- and path-aware links under `/dashboard/*` and `/patient/*`. |
| OAuth buttons | Disabled with title explaining they are not configured. |

## Environment & local run

**Backend** (from repo root):

- Copy `backend/.env.example` to `backend/.env` if needed; set `JWT_SECRET_KEY`, `SEEDER_PASSWORD`, and `MONGODB_URL`.
- `cd backend && pip install -r requirements.txt && python main.py` → API at `http://localhost:8000`, prefix `/api/v1`.

**Frontend:**

- `VITE_API_URL=http://localhost:8000/api/v1` in `frontend/.env.local`.
- `cd frontend && npm install && npm run dev` (Vite default port may be 5173; ensure `CORS_ORIGINS` includes the Vite origin).

## Verification checklist

- [ ] Doctor login → patient list only shows linked patients.
- [ ] Create prescription for a patient → appears in history and patient portal.
- [ ] Edit prescription → changes persist; discontinue sets status.
- [ ] Patient settings / doctor settings save and reload correctly.
- [ ] Notifications actions update server state and UI.
- [ ] Forgot + reset password completes with token from server logs (dev).
- [ ] Patient cannot open doctor-only routes (redirect); doctor cannot open patient-only routes.

## Out of scope (follow-ups)

- Production email delivery for password reset.
- Real OAuth (Google/GitHub).
- Email verification for signup (`is_verified` remains as today).
