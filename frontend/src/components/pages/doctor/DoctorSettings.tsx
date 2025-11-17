import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Tabs } from '../../common';
import type { Tab } from '../../common/Tabs';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  specialty: z.string().min(2, 'Specialty is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  clinic: z.string().optional(),
  address: z.string().optional(),
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

const DoctorSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock doctor data
  const doctor = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'dr.smith@hospital.com',
    phone: '+1 (555) 987-6543',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD123456',
    clinic: 'City Medical Center',
    address: '456 Health Ave, San Francisco, CA 94103',
  };

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: doctor,
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      console.log('Profile data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      console.log('Password change:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      passwordForm.reset();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const tabs: Tab[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

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
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-3xl">
                      {doctor.firstName[0]}{doctor.lastName[0]}
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  register={profileForm.register('email')}
                  error={profileForm.formState.errors.email}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  register={profileForm.register('phone')}
                  error={profileForm.formState.errors.phone}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...profileForm.register('specialty')}
                  >
                    <option>Internal Medicine</option>
                    <option>Cardiology</option>
                    <option>Pediatrics</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                    <option>Neurology</option>
                    <option>General Practice</option>
                  </select>
                  {profileForm.formState.errors.specialty && (
                    <p className="mt-1 text-sm text-red-500">
                      {profileForm.formState.errors.specialty.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Medical License Number"
                  register={profileForm.register('licenseNumber')}
                  error={profileForm.formState.errors.licenseNumber}
                />
              </div>

              <Input
                label="Clinic/Hospital Name"
                register={profileForm.register('clinic')}
                error={profileForm.formState.errors.clinic}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...profileForm.register('address')}
                />
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

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            MacBook Pro - San Francisco, CA
                          </p>
                          <p className="text-xs text-gray-500">Current session</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Active now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Display Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Language</p>
                      <p className="text-xs text-gray-500">Select your preferred language</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time Zone</p>
                      <p className="text-xs text-gray-500">Automatically detect time zone</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date Format</p>
                      <p className="text-xs text-gray-500">Choose how dates are displayed</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prescription Defaults
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Duration
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>30 days</option>
                      <option selected>90 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Refills
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>No refills</option>
                      <option>1 refill</option>
                      <option selected>3 refills</option>
                      <option>6 refills</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <Button variant="primary" className="btn-gradient text-white">
                  Save Preferences
                </Button>
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
                    { label: 'New prescription requests', description: 'Receive alerts for new prescription requests' },
                    { label: 'Patient updates', description: 'Get notified when patients update their information' },
                    { label: 'Prescription renewals', description: 'Alerts for prescriptions due for renewal' },
                    { label: 'System updates', description: 'Important platform updates and announcements' },
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
                    { label: 'Urgent alerts', description: 'Critical notifications sent via SMS' },
                    { label: 'Appointment reminders', description: 'Reminders for upcoming appointments' },
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
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
