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

// Patient pages
import PatientDashboard from '../components/pages/patient/PatientDashboard';
import MyPrescriptions from '../components/pages/patient/MyPrescriptions';
import PrescriptionDetail from '../components/pages/patient/PrescriptionDetail';
import DoctorList from '../components/pages/patient/DoctorList';
import MedicalHistory from '../components/pages/patient/MedicalHistory';
import PatientSettings from '../components/pages/patient/PatientSettings';

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
      // Patient management routes (for doctors)
      {
        path: 'patients',
        element: <PatientList />,
      },
      {
        path: 'patients/:patientId',
        element: <PatientProfile />,
      },
      // Prescription management routes (for doctors)
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
  // Patient routes
  {
    path: '/patient',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PatientDashboard />,
      },
      {
        path: 'prescriptions',
        element: <MyPrescriptions />,
      },
      {
        path: 'prescriptions/:prescriptionId',
        element: <PrescriptionDetail />,
      },
      {
        path: 'doctors',
        element: <DoctorList />,
      },
      {
        path: 'medical-history',
        element: <MedicalHistory />,
      },
      {
        path: 'settings',
        element: <PatientSettings />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
