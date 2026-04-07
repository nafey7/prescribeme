import React from "react";
import Layout from "./Layout";
import PatientRoute from "../auth/PatientRoute";

const PatientLayout: React.FC = () => (
  <PatientRoute>
    <Layout />
  </PatientRoute>
);

export default PatientLayout;
