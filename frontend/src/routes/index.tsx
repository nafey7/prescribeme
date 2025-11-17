import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/pages/Dashboard';
import Profile from '../components/pages/Profile';
import Settings from '../components/pages/Settings';
import Login from '../components/pages/Login';
import SignUp from '../components/pages/SignUp';
import Home from '../components/pages/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/dashboard',
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
