import React, { useEffect, useState } from "react";
import { useForm } from "../../hooks";
import { z } from "zod";
import Card from "../common/Card";
import { Input, Button } from "../common";
import { useAuthStore } from "../../store/authStore";
import { useApiGet } from "../../hooks/useApi";
import { httpPatch } from "../../utils/http";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SettingsShape {
  full_name: string;
  email: string;
  phone?: string | null;
}

const Profile: React.FC = () => {
  const { user, setBackendUser } = useAuthStore();
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: settings, isLoading } = useApiGet<SettingsShape>(
    ["dashboard-profile"],
    "/api/v1/shared/settings"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>(profileSchema, {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    if (!settings) return;
    reset({
      name: settings.full_name,
      email: settings.email,
      phone: settings.phone || "",
    });
  }, [settings, reset]);

  const onSubmit = async (formData: Record<string, unknown>) => {
    const data = formData as ProfileFormData;
    setSaveError(null);
    try {
      await httpPatch("/api/v1/shared/settings", {
        full_name: data.name.trim(),
        phone: data.phone || undefined,
      });
      if (user) {
        setBackendUser({
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: data.name.trim(),
          role: user.role,
          is_active: user.isActive,
          is_verified: user.isVerified,
          created_at: user.createdAt,
        });
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setSaveError(err.message || "Failed to update profile");
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="p-6 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 max-w-2xl">
          {saveError}
        </div>
      )}

      <Card title="Edit Profile" className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            register={register("name")}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled
            register={register("email")}
            error={errors.email}
          />

          <Input
            label="Phone"
            placeholder="Enter your phone number"
            register={register("phone")}
            error={errors.phone}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card title="Account Information">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Role:</strong> {user?.role}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Created:</strong>{" "}
            {new Date(user?.createdAt || "").toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
