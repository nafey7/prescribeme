import React from 'react';
import Card from '../common/Card';
import { useAuthStore } from '../../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Users">
          <p className="text-3xl font-bold text-blue-500">1,234</p>
        </Card>
        <Card title="Revenue">
          <p className="text-3xl font-bold text-green-500">$45,678</p>
        </Card>
        <Card title="Orders">
          <p className="text-3xl font-bold text-purple-500">567</p>
        </Card>
        <Card title="Active Sessions">
          <p className="text-3xl font-bold text-orange-500">89</p>
        </Card>
      </div>

      <Card title="Welcome">
        <p className="text-gray-600">
          {user
            ? `Welcome back, ${user.name}!`
            : 'Please log in to continue.'}
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
