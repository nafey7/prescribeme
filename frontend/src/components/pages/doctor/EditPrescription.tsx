import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Badge, Modal } from '../../common';

const prescriptionSchema = z.object({
  medication: z.string().min(2, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  refills: z.string().optional(),
  notes: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

const EditPrescription: React.FC = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock data - replace with actual API call
  const prescription = {
    id: prescriptionId,
    patientName: 'Sarah Johnson',
    patientId: '1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '90 days',
    instructions: 'Take with or without food',
    refills: '3',
    notes: 'For blood pressure management',
    prescribedDate: '2025-11-01',
    status: 'active',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      refills: prescription.refills,
      notes: prescription.notes,
    },
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      // TODO: Implement actual API call
      console.log('Updated prescription data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating prescription:', error);
    }
  };

  const handleDiscontinue = async () => {
    try {
      // TODO: Implement actual API call
      console.log('Discontinuing prescription:', prescriptionId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/dashboard/prescriptions');
    } catch (error) {
      console.error('Error discontinuing prescription:', error);
    }
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
        <span className="text-gray-900">Edit Prescription</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Prescription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update prescription details for {prescription.patientName}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Patient Information
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {prescription.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Patient ID: {prescription.patientId}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/dashboard/patients/${prescription.patientId}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Prescription Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Prescription Details
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="info">
                    Prescribed: {new Date(prescription.prescribedDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant={prescription.status === 'active' ? 'success' : 'default'}>
                    {prescription.status}
                  </Badge>
                </div>
              </div>

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
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowDiscontinueModal(true)}
              >
                Discontinue Prescription
              </Button>
              <div className="flex items-center space-x-4">
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
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar - Audit Log */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Audit Log
            </h3>
            <div className="space-y-4">
              <div className="border-l-2 border-primary-500 pl-4">
                <p className="text-sm font-medium text-gray-900">Prescription Created</p>
                <p className="text-xs text-gray-500">
                  {new Date(prescription.prescribedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-gray-600 mt-1">By Dr. Smith</p>
              </div>
              <div className="border-l-2 border-gray-300 pl-4">
                <p className="text-sm font-medium text-gray-900">Last Modified</p>
                <p className="text-xs text-gray-500">Never</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Change Notes
              </h4>
              <p className="text-xs text-gray-600">
                Any changes made to this prescription will be logged for compliance and
                audit purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discontinue Confirmation Modal */}
      <Modal
        isOpen={showDiscontinueModal}
        onClose={() => setShowDiscontinueModal(false)}
        title="Discontinue Prescription"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <p className="text-sm text-red-700 mt-1">
                  This action will discontinue the prescription for {prescription.patientName}.
                  This cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for discontinuation
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Please provide a reason..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDiscontinueModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDiscontinue}>
              Confirm Discontinue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/dashboard/prescriptions');
        }}
        title="Changes Saved"
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
            The prescription has been successfully updated.
          </p>
          <Button
            variant="primary"
            className="btn-gradient text-white w-full"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/dashboard/prescriptions');
            }}
          >
            Back to Prescriptions
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditPrescription;
