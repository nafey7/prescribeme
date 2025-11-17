import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useUIStore } from '../../store/uiStore';

const Settings: React.FC = () => {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <Card title="Appearance">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Notifications">
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4" />
            <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
          </label>
        </div>
      </Card>

      <Card title="Danger Zone">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            These actions are irreversible. Please proceed with caution.
          </p>
          <Button variant="danger" size="sm">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
