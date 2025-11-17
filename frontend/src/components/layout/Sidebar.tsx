import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-gray-900 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">App Logo</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <nav className="mt-8">
        <Link
          to="/"
          className="block px-4 py-2 hover:bg-gray-800 transition"
        >
          {sidebarOpen ? 'Dashboard' : '📊'}
        </Link>
        <Link
          to="/profile"
          className="block px-4 py-2 hover:bg-gray-800 transition"
        >
          {sidebarOpen ? 'Profile' : '👤'}
        </Link>
        <Link
          to="/settings"
          className="block px-4 py-2 hover:bg-gray-800 transition"
        >
          {sidebarOpen ? 'Settings' : '⚙️'}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
