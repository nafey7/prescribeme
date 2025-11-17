import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Badge, Modal } from '../../common';

const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  medication: z.string().min(2, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  refills: z.string().optional(),
  notes: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface Patient {
  id: string;
  name: string;
  age: number;
  allergies: string[];
}

const CreatePrescription: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get('patientId');

  const [showPatientModal, setShowPatientModal] = useState(!preSelectedPatientId);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    preSelectedPatientId
      ? {
          id: preSelectedPatientId,
          name: 'Sarah Johnson',
          age: 45,
          allergies: ['Penicillin', 'Shellfish'],
        }
      : null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: preSelectedPatientId || '',
    },
  });

  // Mock patients data
  const patients: Patient[] = [
    { id: '1', name: 'Sarah Johnson', age: 45, allergies: ['Penicillin', 'Shellfish'] },
    { id: '2', name: 'Michael Chen', age: 62, allergies: ['Latex'] },
    { id: '3', name: 'Emily Rodriguez', age: 28, allergies: [] },
  ];

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
    setShowPatientModal(false);
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      // TODO: Implement actual API call
      console.log('Prescription data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard/prescriptions');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500">
        <button
          onClick={() => navigate('/dashboard/prescriptions')}
          className="hover:text-gray-700"
        >
          Prescriptions
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">New Prescription</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Prescription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to create a new prescription
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPatientModal(true)}
                >
                  {selectedPatient ? 'Change Patient' : 'Select Patient'}
                </Button>
              </div>

              {selectedPatient ? (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPatient.age} years old</p>
                    </div>
                  </div>
                  {selectedPatient.allergies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        ⚠️ Known Allergies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="danger">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600">No patient selected</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click "Select Patient" to choose a patient
                  </p>
                </div>
              )}
              <input type="hidden" {...register('patientId')} />
              {errors.patientId && (
                <p className="mt-2 text-sm text-red-500">{errors.patientId.message}</p>
              )}
            </div>

            {/* Medication Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Medication Details
              </h2>

              <div className="space-y-4">
                <Input
                  label="Medication Name"
                  placeholder="e.g., Amoxicillin"
                  register={register('medication')}
                  error={errors.medication}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Dosage"
                    placeholder="e.g., 500mg"
                    register={register('dosage')}
                    error={errors.dosage}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.frequency ? 'border-red-500' : 'border-gray-300'
                      }`}
                      {...register('frequency')}
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="As needed">As needed</option>
                    </select>
                    {errors.frequency && (
                      <p className="mt-1 text-sm text-red-500">{errors.frequency.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Duration"
                    placeholder="e.g., 7 days, 30 days, 90 days"
                    register={register('duration')}
                    error={errors.duration}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Refills
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      {...register('refills')}
                    >
                      <option value="0">No refills</option>
                      <option value="1">1 refill</option>
                      <option value="2">2 refills</option>
                      <option value="3">3 refills</option>
                      <option value="6">6 refills</option>
                      <option value="12">12 refills</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Instructions
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Take with food, Avoid alcohol, etc."
                    {...register('instructions')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinical Notes (Private)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Internal notes for medical records..."
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard/prescriptions')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-gradient text-white"
                isLoading={isSubmitting}
              >
                Create Prescription
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar - Quick Reference */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Reference
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Common Dosing</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Amoxicillin: 250-500mg</li>
                  <li>• Lisinopril: 5-40mg</li>
                  <li>• Metformin: 500-2000mg</li>
                  <li>• Atorvastatin: 10-80mg</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Abbreviations</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• QD: Once daily</li>
                  <li>• BID: Twice daily</li>
                  <li>• TID: Three times daily</li>
                  <li>• QID: Four times daily</li>
                  <li>• PRN: As needed</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Safety Tips</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Always check allergies</li>
                  <li>• Verify drug interactions</li>
                  <li>• Confirm dosage calculations</li>
                  <li>• Include clear instructions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Selection Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Select Patient"
        size="md"
      >
        <div className="space-y-3">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{patient.name}</h4>
                  <p className="text-sm text-gray-500">{patient.age} years old</p>
                </div>
                {patient.allergies.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {patient.allergies.length} allergy
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Prescription Created"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-900 mb-4">
            The prescription has been successfully created and is ready for patient pickup.
          </p>
          <Button
            variant="primary"
            className="btn-gradient text-white w-full"
            onClick={handleSuccessClose}
          >
            View All Prescriptions
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePrescription;
