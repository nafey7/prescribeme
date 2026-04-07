import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Tabs } from '../../common';
import type { Tab } from '../../common/Tabs';
import { useApiGet } from '../../../hooks/useApi';
import { httpPatch, httpPost } from '../../../utils/http';
import { useAuthStore } from '../../../store/authStore';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select your gender'),
  bloodType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface PatientSettingsApi {
  email: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  blood_type?: string | null;
  address?: string | null;
}

const PatientSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { setBackendUser, user } = useAuthStore();

  const { data: settings, isLoading } = useApiGet<PatientSettingsApi>(
    ['shared-settings'],
    '/api/v1/shared/settings'
  );

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!settings) return;
    const addr = settings.address || '';
    profileForm.reset({
      firstName: settings.first_name || settings.full_name.split(' ')[0] || '',
      lastName: settings.last_name || settings.full_name.split(' ').slice(1).join(' ') || '',
      email: settings.email,
      phone: settings.phone || '',
      dateOfBirth: settings.date_of_birth || '',
      gender: settings.gender || '',
      bloodType: settings.blood_type || '',
      address: addr,
      city: '',
      state: '',
      zipCode: '',
    });
  }, [settings, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setFormError(null);
    try {
      const full_name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
      const addrParts = [data.address, data.city, data.state, data.zipCode].filter(
        (x) => x && String(x).trim()
      );
      const combinedAddress = addrParts.length ? addrParts.join(', ') : undefined;
      await httpPatch('/api/v1/shared/settings', {
        full_name,
        phone: data.phone,
        gender: data.gender,
        blood_type: data.bloodType || undefined,
        date_of_birth: data.dateOfBirth || undefined,
        address: combinedAddress,
      });
      if (user) {
        setBackendUser({
          id: user.id,
          email: data.email,
          username: user.username,
          full_name,
          role: user.role,
          is_active: user.isActive,
          is_verified: user.isVerified,
          created_at: user.createdAt,
        });
      }
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setFormError(err.message || 'Failed to save profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setFormError(null);
    try {
      await httpPost('/api/v1/shared/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      passwordForm.reset();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setFormError(err.message || 'Failed to change password');
    }
  };

  const tabs: Tab[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'privacy', label: 'Privacy' },
  ];

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading settings...
      </div>
    );
  }

  const fn = settings.first_name || settings.full_name.split(' ')[0] || '?';
  const ln = settings.last_name || settings.full_name.split(' ').slice(1).join(' ') || '?';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-3xl">
                      {fn[0]}
                      {ln[0] || fn[0]}
                    </span>
                  </div>
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    Change Photo
                  </Button>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, GIF or PNG. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    register={profileForm.register('firstName')}
                    error={profileForm.formState.errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    register={profileForm.register('lastName')}
                    error={profileForm.formState.errors.lastName}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    disabled
                    register={profileForm.register('email')}
                    error={profileForm.formState.errors.email}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    register={profileForm.register('phone')}
                    error={profileForm.formState.errors.phone}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    register={profileForm.register('dateOfBirth')}
                    error={profileForm.formState.errors.dateOfBirth}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      {...profileForm.register('gender')}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    {profileForm.formState.errors.gender && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileForm.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      {...profileForm.register('bloodType')}
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    register={profileForm.register('address')}
                    error={profileForm.formState.errors.address}
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      register={profileForm.register('city')}
                      error={profileForm.formState.errors.city}
                    />
                    <Input
                      label="State"
                      register={profileForm.register('state')}
                      error={profileForm.formState.errors.state}
                    />
                    <Input
                      label="ZIP Code"
                      register={profileForm.register('zipCode')}
                      error={profileForm.formState.errors.zipCode}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-gradient text-white"
                  isLoading={profileForm.formState.isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      register={passwordForm.register('currentPassword')}
                      error={passwordForm.formState.errors.currentPassword}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      register={passwordForm.register('newPassword')}
                      error={passwordForm.formState.errors.newPassword}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      register={passwordForm.register('confirmPassword')}
                      error={passwordForm.formState.errors.confirmPassword}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-gradient text-white"
                    isLoading={passwordForm.formState.isSubmitting}
                  >
                    Update Password
                  </Button>
                </div>
              </form>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Two-factor authentication is not enabled
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="secondary">Enable</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Prescription updates', description: 'New prescriptions, refill reminders' },
                    { label: 'Appointment reminders', description: 'Upcoming appointment notifications' },
                    { label: 'Lab results', description: 'Notifications when lab results are available' },
                    { label: 'Health tips', description: 'Wellness tips and health information' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  SMS Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Medication reminders', description: 'Daily medication reminder alerts' },
                    { label: 'Appointment reminders', description: 'SMS reminders for upcoming appointments' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <Button variant="primary" className="btn-gradient text-white">
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Data Sharing
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Share data with healthcare providers', description: 'Allow your doctors to access your medical history' },
                    { label: 'Share anonymized data for research', description: 'Help improve healthcare with anonymized data' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index === 0} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Data
                </h3>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Download My Data
                  </Button>
                  <p className="text-sm text-gray-600">
                    Download a copy of your medical records and account data
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Danger Zone
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger">Delete Account</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;
