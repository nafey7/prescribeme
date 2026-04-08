import React from "react";
import Layout from "./Layout";
import DoctorRoute from "../auth/DoctorRoute";

const DoctorLayout: React.FC = () => (
  <DoctorRoute>
    <Layout />
  </DoctorRoute>
);

export default DoctorLayout;
