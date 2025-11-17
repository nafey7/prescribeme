import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/pages/Dashboard';
import Profile from '../components/pages/Profile';
import Settings from '../components/pages/Settings';
import Login from '../components/pages/Login';
import SignUp from '../components/pages/SignUp';
import Home from '../components/pages/Home';

// Doctor pages
import PatientList from '../components/pages/doctor/PatientList';
import PatientProfile from '../components/pages/doctor/PatientProfile';
import CreatePrescription from '../components/pages/doctor/CreatePrescription';
import PrescriptionHistory from '../components/pages/doctor/PrescriptionHistory';
import EditPrescription from '../components/pages/doctor/EditPrescription';
import DoctorSettings from '../components/pages/doctor/DoctorSettings';

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
      // Doctor routes
      {
        path: 'doctor-settings',
        element: <DoctorSettings />,
      },
      // Patient management routes
      {
        path: 'patients',
        element: <PatientList />,
      },
      {
        path: 'patients/:patientId',
        element: <PatientProfile />,
      },
      // Prescription management routes
      {
        path: 'prescriptions',
        element: <PrescriptionHistory />,
      },
      {
        path: 'prescriptions/new',
        element: <CreatePrescription />,
      },
      {
        path: 'prescriptions/:prescriptionId/edit',
        element: <EditPrescription />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
