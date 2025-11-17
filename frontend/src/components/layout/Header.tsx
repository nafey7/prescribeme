import React from 'react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h2 className="text-gray-800 font-semibold">Welcome</h2>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
