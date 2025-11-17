# PrescribeMe Frontend

Modern React + TypeScript frontend with Vite, TanStack Query, Zustand, and more.

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router 7.9.6
- **Data Fetching**: TanStack Query 5.90.7
- **State Management**: Zustand 5.0.8
- **Forms**: React Hook Form 7.55.0 + Zod 4.1.12
- **HTTP Client**: Axios 1.7.7
- **Styling**: Tailwind CSS (default Vite setup)

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components (Button, Input, Card)
│   ├── layout/           # Layout components (Layout, Sidebar, Header)
│   └── pages/            # Page components (Dashboard, Profile, Settings, Login)
├── hooks/                # Custom React hooks (useApi, useForm, useNotification)
├── services/             # API client setup (api.ts)
├── store/                # Zustand stores (authStore, uiStore)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions (http helpers, queryClient)
├── routes/               # React Router configuration
├── styles/               # Global styles
├── App.tsx               # Root app component
└── main.tsx              # Entry point
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local
```

### Development

```bash
# Start dev server
npm run dev

# The app will be available at http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Check code style
npm run lint
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=PrescribeMe
VITE_ENV=development
```

See `.env.example` for all available options.

## API Integration

### Using the API Hooks

```tsx
import { useApiGet, useApiPost } from '@/hooks';

function MyComponent() {
  // GET request
  const { data, isLoading, error } = useApiGet('/users', '/api/users');

  // POST request
  const { mutate, isPending } = useApiPost('/api/users', {
    onSuccess: (data) => {
      console.log('Created:', data);
    },
  });

  return (
    // JSX
  );
}
```

### HTTP Client

The `httpGet`, `httpPost`, `httpPut`, `httpPatch`, and `httpDelete` functions are available from `utils/http`.

Authentication tokens are automatically added to requests via request interceptors.

## State Management

### Auth Store

```tsx
import { useAuthStore } from '@/store';

function Component() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  return (
    // JSX
  );
}
```

### UI Store

```tsx
import { useUIStore } from '@/store';

function Component() {
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useUIStore();

  return (
    // JSX
  );
}
```

## Forms

### Using React Hook Form with Zod

```tsx
import { useForm } from '@/hooks';
import { z } from 'zod';
import { Input, Button } from '@/components/common';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>(schema);

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Email" register={register('email')} error={errors.email} />
      <Input label="Password" type="password" register={register('password')} error={errors.password} />
      <Button type="submit" isLoading={isSubmitting}>Login</Button>
    </form>
  );
}
```

## Routing

Routes are defined in `src/routes/index.tsx`. Add new routes by updating the `routes` array:

```tsx
{
  path: '/new-page',
  element: <NewPage />,
}
```

## Components

### Common Components

Located in `src/components/common/`:

- **Button**: Customizable button with variants (primary, secondary, danger) and sizes
- **Input**: Form input with built-in error handling and label support
- **Card**: Container component for content sections

### Layout Components

Located in `src/components/layout/`:

- **Layout**: Main app layout with sidebar and header
- **Sidebar**: Collapsible navigation sidebar
- **Header**: Top header bar with user info and logout

## TypeScript

The project uses strict TypeScript settings. Type definitions are located in `src/types/index.ts`.

Common types:
- `ApiResponse<T>`: Standard API response wrapper
- `PaginatedResponse<T>`: Paginated list response
- `ApiError`: Error response structure
- `User`: User data type

## Development Tips

### Adding a New Page

1. Create component in `src/components/pages/`
2. Add route in `src/routes/index.tsx`
3. Link to it from navigation components

### Adding a New API Integration

1. Create hook in `src/hooks/` using `useApiGet`, `useApiPost`, etc.
2. Use the hook in your components
3. Handle loading, error, and success states

### Creating Reusable Components

1. Add component to `src/components/common/`
2. Export from `src/components/common/index.ts`
3. Import and use in other components

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, update `vite.config.ts`:

```ts
server: {
  port: 3001, // Change to your preferred port
}
```

### CORS Issues

Configure the API proxy in `vite.config.ts` or set up proper CORS headers on your backend.

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [ ] Integrate a toast notification library (react-hot-toast, sonner, etc.)
- [ ] Add authentication flow (login, register, password reset)
- [ ] Implement error boundary for better error handling
- [ ] Add tests (Vitest, React Testing Library)
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure API error handling globally
- [ ] Add loading skeletons for better UX
- [ ] Implement proper responsive design
- [ ] Add dark mode support with Tailwind
- [ ] Set up CI/CD pipeline

## License

MIT
