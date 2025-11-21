# PrescribeMe - Business Information & Application URLs

## Business Overview

PrescribeMe is a prescription management application designed to streamline the relationship between healthcare providers (Doctors) and patients. The platform enables doctors to manage patient records, create and edit prescriptions, and maintain a comprehensive view of patient medical history. Patients can access their prescriptions, view their medical history, find doctors, and manage their health information in one centralized location.

### Key Actors

- **Doctors**: Healthcare providers who prescribe medications and manage patient care
- **Patients**: End users who receive prescriptions and manage their health records

---

## Authentication URLs

### Doctor Authentication

- `/doctor/login` - Doctor Login Page
- `/doctor/signup` - Doctor Registration Page
- `/doctor/forgot-password` - Doctor Password Reset Request
- `/doctor/reset-password` - Doctor Password Reset

### Patient Authentication

- `/patient/login` - Patient Login Page
- `/patient/signup` - Patient Registration Page
- `/patient/forgot-password` - Patient Password Reset Request
- `/patient/reset-password` - Patient Password Reset

---

## Doctor UI Screens

### Dashboard & Patient Management

- `/dashboard/patients` - Patient List

  - Displays all patients associated with the doctor
  - Allows searching and filtering of patients
  - Provides access to individual patient profiles

- `/dashboard/patients/:patientId` - Patient Profile
  - Detailed view of a specific patient
  - Shows patient medical history, prescriptions, and personal information
  - Allows creating new prescriptions for the patient

### Prescription Management

- `/dashboard/prescriptions` - Prescription History

  - Complete list of all prescriptions created by the doctor
  - Filterable by patient, date, medication, or status
  - Quick access to edit or view prescription details

- `/dashboard/prescriptions/new` - Create Prescription

  - Form to create a new prescription
  - Select patient, medications, dosages, and instructions
  - Set prescription validity dates

- `/dashboard/prescriptions/:id/edit` - Edit Prescription
  - Modify existing prescription details
  - Update medications, dosages, or instructions
  - Change prescription status or validity

### Settings

- `/dashboard/doctor-settings` - Doctor Settings
  - Manage doctor profile information
  - Update contact details, specialization, and practice information
  - Account security and preferences

---

## Patient UI Screens

### Dashboard

- `/patient` - Patient Dashboard
  - Overview of patient's health information
  - Recent prescriptions, upcoming appointments, and health summary
  - Quick access to key features

### Prescriptions

- `/patient/prescriptions` - My Prescriptions
  - List of all prescriptions assigned to the patient
  - View prescription details, medications, and instructions
  - Filter by date, doctor, or medication status

### Doctor Discovery

- `/patient/doctors` - Find Doctors
  - Browse available doctors on the platform
  - Search by specialization, location, or name
  - View doctor profiles and request appointments

### Medical Records

- `/patient/medical-history` - Medical History
  - Comprehensive medical record of the patient
  - Past prescriptions, diagnoses, and treatment history
  - Downloadable medical reports

### Settings

- `/patient/settings` - Settings
  - Manage patient profile information
  - Update personal details, contact information
  - Account security, privacy settings, and preferences

---

## Navigation Links & User Flows

### Doctor Navigation Flow

#### From Patient List (`/dashboard/patients`)

- → **Patient Profile** (`/dashboard/patients/:patientId`) - Click on any patient card/row
- → **Create Prescription** (`/dashboard/prescriptions/new`) - Quick action button to create prescription for selected patient

#### From Patient Profile (`/dashboard/patients/:patientId`)

- → **Create Prescription** (`/dashboard/prescriptions/new?patientId=:patientId`) - Create new prescription for this patient
- → **Prescription History** (`/dashboard/prescriptions`) - View all prescriptions
- → **Back to Patient List** (`/dashboard/patients`) - Return to patient list

#### From Prescription History (`/dashboard/prescriptions`)

- → **Edit Prescription** (`/dashboard/prescriptions/:id/edit`) - Click on any prescription to edit
- → **Patient Profile** (`/dashboard/patients/:patientId`) - Navigate to patient from prescription
- → **Create Prescription** (`/dashboard/prescriptions/new`) - Add new prescription

#### From Create Prescription (`/dashboard/prescriptions/new`)

- → **Patient List** (`/dashboard/patients`) - Select patient if not pre-selected
- → **Prescription History** (`/dashboard/prescriptions`) - After successful creation
- → **Patient Profile** (`/dashboard/patients/:patientId`) - Return to patient after creation

#### From Edit Prescription (`/dashboard/prescriptions/:id/edit`)

- → **Prescription History** (`/dashboard/prescriptions`) - After save or cancel
- → **Patient Profile** (`/dashboard/patients/:patientId`) - Navigate to associated patient

#### From Doctor Settings (`/dashboard/doctor-settings`)

- → **Patient List** (`/dashboard/patients`) - Return to main dashboard
- → **Prescription History** (`/dashboard/prescriptions`) - Navigate to prescriptions

### Patient Navigation Flow

#### From Patient Dashboard (`/patient`)

- → **My Prescriptions** (`/patient/prescriptions`) - View all prescriptions
- → **Find Doctors** (`/patient/doctors`) - Search for doctors
- → **Medical History** (`/patient/medical-history`) - View complete medical records
- → **Settings** (`/patient/settings`) - Access account settings

#### From My Prescriptions (`/patient/prescriptions`)

- → **Prescription Detail** (`/patient/prescriptions/:id`) - View detailed prescription information
- → **Find Doctors** (`/patient/doctors`) - Find the prescribing doctor
- → **Medical History** (`/patient/medical-history`) - View related medical history
- → **Patient Dashboard** (`/patient`) - Return to dashboard

#### From Find Doctors (`/patient/doctors`)

- → **Doctor Profile** (`/patient/doctors/:doctorId`) - View doctor details (if implemented)
- → **Patient Dashboard** (`/patient`) - Return to dashboard

#### From Medical History (`/patient/medical-history`)

- → **Prescription Detail** (`/patient/prescriptions/:id`) - View specific prescription from history
- → **My Prescriptions** (`/patient/prescriptions`) - Navigate to prescriptions list
- → **Patient Dashboard** (`/patient`) - Return to dashboard

#### From Settings (`/patient/settings`)

- → **Patient Dashboard** (`/patient`) - Return to dashboard after saving changes

### Authentication Flow

#### Doctor Authentication

- **Login** (`/doctor/login`) → **Patient List** (`/dashboard/patients`) - After successful login
- **Signup** (`/doctor/signup`) → **Login** (`/doctor/login`) - After successful registration
- **Forgot Password** (`/doctor/forgot-password`) → **Reset Password** (`/doctor/reset-password`) - After email verification
- **Logout** → **Login** (`/doctor/login`) - From any authenticated page

#### Patient Authentication

- **Login** (`/patient/login`) → **Patient Dashboard** (`/patient`) - After successful login
- **Signup** (`/patient/signup`) → **Login** (`/patient/login`) - After successful registration
- **Forgot Password** (`/patient/forgot-password`) → **Reset Password** (`/patient/reset-password`) - After email verification
- **Logout** → **Login** (`/patient/login`) - From any authenticated page

---

## Additional Notes

### Protected Routes

All dashboard routes (`/dashboard/*`) require doctor authentication.
All patient routes (`/patient/*`, except auth pages) require patient authentication.

### Route Parameters

- `:patientId` - Unique identifier for a patient
- `:id` - Unique identifier for a prescription
- `:doctorId` - Unique identifier for a doctor (if implemented)

### Query Parameters

- `?patientId=:patientId` - Pre-select patient when creating prescription
- `?status=:status` - Filter prescriptions by status
- `?search=:query` - Search/filter parameters

---

_Last Updated: 2025-01-29_
_Application: PrescribeMe - Prescription Management System_
