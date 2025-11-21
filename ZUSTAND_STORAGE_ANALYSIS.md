# Zustand Storage Analysis

## Currently Stored in `authStore.ts`

### ✅ What's Currently Stored:

```typescript
interface AuthState {
  // User Data
  user: User | null
  
  // Auth State
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface User {
  id: string              // ✅ Stored
  email: string           // ✅ Stored
  username: string        // ✅ Stored
  full_name: string       // ✅ Stored (but components use `name`)
  role: "patient" | "doctor" | "admin"  // ✅ Stored
  is_active: boolean      // ✅ Stored
  is_verified: boolean    // ✅ Stored
  created_at: string      // ✅ Stored (but components use `createdAt`)
}
```

### 🔴 Issues Found:

1. **Property Name Mismatch**: 
   - Store has: `full_name`, `created_at` (snake_case)
   - Components expect: `user.name`, `user.createdAt` (camelCase)
   - **Fix needed**: Update User interface or map backend response

2. **Missing Properties** (that might be useful):
   - `updated_at` - Last update timestamp
   - Profile picture/avatar URL (if you add it later)
   - Preferences/settings specific to user

---

## What Should Be Stored

### ✅ Keep These (Essential):

1. **User Identity**
   - `id` - Unique user identifier ✅
   - `email` - Email address ✅
   - `username` - Username ✅
   - `full_name` - Display name ✅

2. **User Status**
   - `role` - User role (patient/doctor/admin) ✅
   - `is_active` - Account status ✅
   - `is_verified` - Email verification status ✅

3. **Timestamps**
   - `created_at` - Account creation date ✅
   - `updated_at` - Last update (optional, not from backend yet)

4. **Auth State**
   - `accessToken` - JWT access token ✅
   - `isAuthenticated` - Auth status ✅
   - `isLoading` - Loading state ✅

### ❌ Don't Store (Use TanStack Query Instead):

- Prescriptions list - Use TanStack Query with caching
- Patient/Doctor profile details - Fetch when needed
- Medical history - Server-side data, not client state
- Notifications - Could be separate store or TanStack Query
- Settings/Preferences - Could be separate store or server-side

### 🤔 Consider Adding (Future):

1. **User Preferences** (in `authStore` or separate `preferencesStore`):
   - Theme preference (currently in `uiStore` ✅)
   - Language preference
   - Notification preferences
   - Default view settings

2. **Session Metadata**:
   - Last login time
   - Session expiration time
   - Refresh token expiry (for UX)

3. **Profile Extensions** (if backend adds them):
   - Avatar/profile picture URL
   - Phone number (from Patient/Doctor profile)
   - Address (from Patient/Doctor profile)
   - Bio/description (for doctors)

---

## Recommendations

### 1. Fix Property Name Consistency ⚠️

**Option A**: Update User interface to match what components expect:
```typescript
interface User {
  id: string
  email: string
  username: string
  name: string  // Map from full_name
  role: "patient" | "doctor" | "admin"
  is_active: boolean
  is_verified: boolean
  createdAt: string  // Map from created_at
}
```

**Option B**: Update components to use snake_case:
```typescript
user.full_name  // instead of user.name
user.created_at // instead of user.createdAt
```

**Recommendation**: Option A - Map backend response to camelCase in frontend.

### 2. Keep Current Structure ✅

Your current storage approach is good:
- ✅ User data in `authStore`
- ✅ UI preferences in `uiStore` (separate concern)
- ✅ Server data in TanStack Query (caching, refetching)

### 3. Add Helper Actions (Optional)

Consider adding convenience methods:
```typescript
login: async (accessToken: string, user: User) => {
  set({ accessToken, user, isAuthenticated: true });
},
clearAuth: () => {
  set({ user: null, accessToken: null, isAuthenticated: false });
}
```

---

## Summary

**Currently Stored** ✅:
- User identity (id, email, username, full_name)
- User status (role, is_active, is_verified)
- Timestamps (created_at)
- Auth tokens & state

**Should Store** ✅ (You're already doing it):
- Keep user data in Zustand
- Keep UI state separate
- Use TanStack Query for server data

**Don't Store** ❌:
- Large data lists (prescriptions, patients, etc.) - Use TanStack Query
- Server-side medical records - Fetch when needed
- Temporary form state - Use React state

**Action Needed** ⚠️:
- Fix property name mismatch (full_name vs name, created_at vs createdAt)

