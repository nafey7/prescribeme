import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout/Layout";

// Lazy load pages for code splitting
const Home = lazy(() => import("../components/pages/Home"));
const Login = lazy(() => import("../components/pages/Login"));
const SignUp = lazy(() => import("../components/pages/SignUp"));
const Dashboard = lazy(() => import("../components/pages/Dashboard"));
const Profile = lazy(() => import("../components/pages/Profile"));
const Settings = lazy(() => import("../components/pages/Settings"));

// Doctor pages - lazy loaded
const PatientList = lazy(
  () => import("../components/pages/doctor/PatientList")
);
const PatientProfile = lazy(
  () => import("../components/pages/doctor/PatientProfile")
);
const CreatePrescription = lazy(
  () => import("../components/pages/doctor/CreatePrescription")
);
const PrescriptionHistory = lazy(
  () => import("../components/pages/doctor/PrescriptionHistory")
);
const EditPrescription = lazy(
  () => import("../components/pages/doctor/EditPrescription")
);
const DoctorSettings = lazy(
  () => import("../components/pages/doctor/DoctorSettings")
);

// Patient pages - lazy loaded
const PatientDashboard = lazy(
  () => import("../components/pages/patient/PatientDashboard")
);
const MyPrescriptions = lazy(
  () => import("../components/pages/patient/MyPrescriptions")
);
const PrescriptionDetail = lazy(
  () => import("../components/pages/patient/PrescriptionDetail")
);
const DoctorList = lazy(() => import("../components/pages/patient/DoctorList"));
const MedicalHistory = lazy(
  () => import("../components/pages/patient/MedicalHistory")
);
const PatientSettings = lazy(
  () => import("../components/pages/patient/PatientSettings")
);

// Shared pages - lazy loaded
const Notifications = lazy(
  () => import("../components/pages/shared/Notifications")
);
const Help = lazy(() => import("../components/pages/shared/Help"));
const Terms = lazy(() => import("../components/pages/shared/Terms"));
const Privacy = lazy(() => import("../components/pages/shared/Privacy"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Wrapper function to create a Suspense-wrapped component for routes
const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(Home),
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/signup",
    element: withSuspense(SignUp),
  },
  {
    path: "/terms",
    element: withSuspense(Terms),
  },
  {
    path: "/privacy",
    element: withSuspense(Privacy),
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: "profile",
        element: withSuspense(Profile),
      },
      {
        path: "settings",
        element: withSuspense(Settings),
      },
      // Doctor routes
      {
        path: "doctor-settings",
        element: withSuspense(DoctorSettings),
      },
      // Patient management routes (for doctors)
      {
        path: "patients",
        element: withSuspense(PatientList),
      },
      {
        path: "patients/:patientId",
        element: withSuspense(PatientProfile),
      },
      // Prescription management routes (for doctors)
      {
        path: "prescriptions",
        element: withSuspense(PrescriptionHistory),
      },
      {
        path: "prescriptions/new",
        element: withSuspense(CreatePrescription),
      },
      {
        path: "prescriptions/:prescriptionId/edit",
        element: withSuspense(EditPrescription),
      },
      // Shared routes (for doctors)
      {
        path: "notifications",
        element: withSuspense(Notifications),
      },
      {
        path: "help",
        element: withSuspense(Help),
      },
    ],
  },
  // Patient routes
  {
    path: "/patient",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(PatientDashboard),
      },
      {
        path: "prescriptions",
        element: withSuspense(MyPrescriptions),
      },
      {
        path: "prescriptions/:prescriptionId",
        element: withSuspense(PrescriptionDetail),
      },
      {
        path: "doctors",
        element: withSuspense(DoctorList),
      },
      {
        path: "medical-history",
        element: withSuspense(MedicalHistory),
      },
      {
        path: "settings",
        element: withSuspense(PatientSettings),
      },
      // Shared routes (for patients)
      {
        path: "notifications",
        element: withSuspense(Notifications),
      },
      {
        path: "help",
        element: withSuspense(Help),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
