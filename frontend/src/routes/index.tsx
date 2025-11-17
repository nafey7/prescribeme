import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/pages/Dashboard';
import Profile from '../components/pages/Profile';
import Settings from '../components/pages/Settings';
import Login from '../components/pages/Login';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
