import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Badge, Modal } from "../../common";
import { httpGet, httpPatch } from "../../../utils/http";
import type { ApiError } from "../../../types";

const prescriptionSchema = z.object({
  medication: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
  refills: z.string().optional(),
  notes: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionApi {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  notes?: string | null;
  prescribedDate: string;
  status: string;
  refills?: number;
  refillsRemaining?: number;
}

const EditPrescription: React.FC = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const { data: prescription, isLoading } = useQuery<PrescriptionApi, ApiError>({
    queryKey: ["doctor-prescription", prescriptionId],
    queryFn: () =>
      httpGet<PrescriptionApi>(
        `/api/v1/doctors/prescriptions/${prescriptionId}`
      ),
    enabled: !!prescriptionId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      refills: "0",
      notes: "",
    },
  });

  useEffect(() => {
    if (!prescription) return;
    reset({
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions || "",
      refills: String(prescription.refillsRemaining ?? prescription.refills ?? 0),
      notes: prescription.notes || "",
    });
  }, [prescription, reset]);

  const updateMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      httpPatch(`/api/v1/doctors/prescriptions/${prescriptionId}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-prescription", prescriptionId] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      setShowSuccessModal(true);
    },
    onError: (err: ApiError) => {
      setPageError(err.message || "Update failed");
    },
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    setPageError(null);
    const refillsVal = parseInt(data.refills || "0", 10) || 0;
    await updateMutation.mutateAsync({
      medication: data.medication,
      dosage: data.dosage,
      frequency: data.frequency,
      duration: data.duration,
      instructions: data.instructions || undefined,
      notes: data.notes || undefined,
      refills: refillsVal,
      refills_remaining: refillsVal,
    });
  };

  const handleDiscontinue = async () => {
    setPageError(null);
    try {
      await httpPatch(`/api/v1/doctors/prescriptions/${prescriptionId}`, {
        status: "discontinued",
      });
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      navigate("/dashboard/prescriptions");
    } catch (e: unknown) {
      const err = e as ApiError;
      setPageError(err.message || "Failed to discontinue");
    }
  };

  if (isLoading || !prescription) {
    if (!isLoading && !prescription) {
      return (
        <div className="p-6 text-center text-gray-600">
          Prescription not found or you do not have access.
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading prescription...
      </div>
    );
  }

  const submitting = isSubmitting || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <nav className="flex text-sm text-gray-500">
        <button
          type="button"
          onClick={() => navigate("/dashboard/prescriptions")}
          className="hover:text-gray-700"
        >
          Prescriptions
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Edit Prescription</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Prescription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update prescription details for {prescription.patientName}
        </p>
      </div>

      {pageError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {pageError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{prescription.patientName}</h3>
                    <p className="text-sm text-gray-600">Patient ID: {prescription.patientId}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/patients/${prescription.patientId}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Prescription Details</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="info">
                    Prescribed: {new Date(prescription.prescribedDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant={prescription.status === "active" ? "success" : "default"}>
                    {prescription.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Medication Name"
                  register={register("medication")}
                  error={errors.medication}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Dosage"
                    register={register("dosage")}
                    error={errors.dosage}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.frequency ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("frequency")}
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
                    register={register("duration")}
                    error={errors.duration}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Refills remaining
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      {...register("refills")}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="12">12</option>
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
                    {...register("instructions")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinical Notes (Private)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

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
                  onClick={() => navigate("/dashboard/prescriptions")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-gradient text-white"
                  isLoading={submitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-sm text-gray-600">
              Saving updates this prescription in the patient&apos;s record. Discontinue marks
              the prescription as inactive.
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDiscontinueModal}
        onClose={() => setShowDiscontinueModal(false)}
        title="Discontinue Prescription"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            This will mark the prescription as discontinued for {prescription.patientName}.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowDiscontinueModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDiscontinue}>
              Confirm Discontinue
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/dashboard/prescriptions");
        }}
        title="Changes Saved"
        size="sm"
      >
        <div className="text-center py-4">
          <p className="text-gray-900 mb-4">The prescription has been updated.</p>
          <Button
            variant="primary"
            className="btn-gradient text-white w-full"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/dashboard/prescriptions");
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
