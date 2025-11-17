# Frontend Development Guide

Quick reference for developers working on the PrescribeMe frontend.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Layout

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── layout/           # App layout components
│   │   ├── Layout.tsx    # Main wrapper
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── pages/            # Page-level components
│       ├── Dashboard.tsx
│       ├── Profile.tsx
│       ├── Settings.tsx
│       └── Login.tsx
├── hooks/                # Custom React hooks
│   ├── useApi.ts        # Data fetching hooks
│   ├── useForm.ts       # Form handling with validation
│   ├── useNotification.ts
│   └── index.ts
├── services/
│   └── api.ts           # Axios instance with interceptors
├── store/                # Zustand stores
│   ├── authStore.ts     # Authentication state
│   ├── uiStore.ts       # UI state
│   └── index.ts
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/                # Helper functions
│   ├── http.ts          # HTTP utility functions
│   ├── queryClient.ts   # TanStack Query config
│   └── index.ts
├── routes/
│   └── index.tsx        # React Router configuration
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Common Tasks

### Adding a New Page

1. Create component in `src/components/pages/NewPage.tsx`:
```tsx
import React from 'react';
import Card from '../common/Card';

const NewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">New Page</h1>
      <Card title="Content">
        {/* Page content */}
      </Card>
    </div>
  );
};

export default NewPage;
```

2. Add route to `src/routes/index.tsx`:
```tsx
{
  path: 'new-page',
  element: <NewPage />,
}
```

3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Adding API Integration

1. Create a custom hook in `src/hooks/`:
```tsx
import { useApiGet, useApiPost } from './useApi';
import { queryClient } from '@/utils';

export function useUsers() {
  return useApiGet('users', '/api/users');
}

export function useCreateUser() {
  return useApiPost('/api/users', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

2. Use in your component:
```tsx
import { useUsers, useCreateUser } from '@/hooks';

function UserList() {
  const { data: users, isLoading } = useUsers();
  const { mutate: createUser } = useCreateUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    // Render users
  );
}
```

### Creating a Reusable Component

1. Create in `src/components/common/`:
```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

2. Export from `src/components/common/index.ts`:
```tsx
export { default as MyComponent } from './MyComponent';
```

### Adding Form Validation

```tsx
import { useForm } from '@/hooks';
import { z } from 'zod';
import { Input, Button } from '@/components/common';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>(schema);

  const onSubmit = async (formData: Record<string, any>) => {
    const data = formData as FormData;
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        register={register('email')}
        error={errors.email}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Login
      </Button>
    </form>
  );
}
```

## State Management

### Using Auth Store

```tsx
import { useAuthStore } from '@/store';

function MyComponent() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Using UI Store

```tsx
import { useUIStore } from '@/store';

function MyComponent() {
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();

  return (
    <div>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

## API Integration

### Making Requests

```tsx
// GET request
const { data, isLoading, error } = useApiGet('key', '/api/users');

// POST request
const { mutate, isPending } = useApiPost('/api/users', {
  onSuccess: (data) => {
    console.log('Created:', data);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  },
});

mutate({ name: 'John', email: 'john@example.com' });
```

### Error Handling

Errors are automatically handled by interceptors. For 401 (Unauthorized) responses:
- Token is cleared from localStorage
- User is redirected to login page

Add custom error handling in hooks:
```tsx
const { mutate } = useApiPost('/api/users', {
  onError: (error) => {
    // Handle specific error
    if (error.status === 400) {
      console.log('Validation error:', error.errors);
    }
  },
});
```

## Environment Variables

Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=PrescribeMe
VITE_ENV=development
```

Access in code:
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Styling

Using Tailwind CSS (already configured):

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Styled with Tailwind
</div>
```

Common utilities already available:
- Responsive design: `md:`, `lg:`, etc.
- Spacing: `p-`, `m-`, `gap-`
- Colors: `text-`, `bg-`, `border-`
- Effects: `shadow-`, `rounded-`, `hover:`

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

## Debugging

### Enable React DevTools

Install React DevTools browser extension and use it to inspect:
- Component hierarchy
- Props and state
- Render performance

### Enable Redux DevTools for Zustand

Add to your store:
```tsx
import { devtools } from 'zustand/middleware';

export const useStore = devtools(create(...));
```

### Network Debugging

Open browser DevTools (F12) and check Network tab:
- API requests and responses
- Authentication headers
- Request/response times

## Performance Tips

1. **Use React.memo** for expensive components
```tsx
const MyComponent = React.memo(() => {
  // Component code
});
```

2. **Use useCallback** for event handlers
```tsx
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);
```

3. **Lazy load routes**
```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

4. **Optimize images**
- Compress before uploading
- Use appropriate formats (WebP, JPEG, PNG)

## Testing

Testing setup (to be configured):
- Test runner: Vitest
- Testing library: React Testing Library
- Mocking: MSW (Mock Service Worker)

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## Troubleshooting

### Hot Module Replacement (HMR) not working
```bash
# Restart dev server
npm run dev
```

### Type errors in IDE
```bash
# Rebuild TypeScript
npm run build
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
Update `vite.config.ts`:
```ts
server: {
  port: 3001,
}
```

## Support

For issues or questions, check:
1. Error message in console
2. Network tab in DevTools
3. Documentation links above
4. Create an issue in the repository
