import React from 'react';
import { useForm } from '../../hooks';
import { z } from 'zod';
import Card from '../common/Card';
import { Input, Button } from '../common';
import { useAuthStore } from '../../store/authStore';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>(
    profileSchema,
    {
      name: user?.name || '',
      email: user?.email || '',
    }
  );

  const onSubmit = async (formData: Record<string, any>) => {
    try {
      const data = formData as ProfileFormData;
      console.log('Submitting profile update:', data);
      // TODO: Call API to update profile
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

      <Card title="Edit Profile" className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            register={register('name')}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register('email')}
            error={errors.email}
          />

          <Input
            label="Phone"
            placeholder="Enter your phone number"
            register={register('phone')}
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
            <strong>Created:</strong> {user?.createdAt}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
