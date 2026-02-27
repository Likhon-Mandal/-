import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircle, Search, Map, Home as HomeIcon, Menu,
  LogOut, LayoutDashboard, Trash2, Shield, Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon, exact: true },
  { to: '/explorer', label: 'Lineage Explorer', icon: Map },
  { to: '/directory', label: 'Search Members', icon: Search },
  { to: '/relation', label: 'Find Relation' },
  { to: '/board', label: 'Events & Notices' },
  { to: '/committee', label: 'Committee Board' },
  { to: '/eminent', label: 'Eminent Figures' },
  { to: '/help', label: 'Help Desk' },
  { to: '/recycle-bin', label: 'Recycle Bin', icon: Trash2, adminOnly: true },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="bg-orange-800 text-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-orange-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="font-serif font-bold text-lg text-yellow-400 hover:text-yellow-300 transition-colors">
              Projenitor
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center">
            {visibleNavItems.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-orange-700 hover:text-yellow-400 ${isActive(to, exact) ? 'bg-orange-700 text-yellow-400' : 'text-orange-100'}`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side: Auth Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Dashboard button */}
                <Link
                  to={isSuperAdmin ? '/dashboard/superadmin' : '/dashboard/admin'}
                  className="hidden sm:flex items-center gap-1.5 text-sm bg-yellow-500 hover:bg-yellow-400 text-orange-900 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                {/* User menu */}
                <div className="flex items-center gap-2">
                  <span className="hidden lg:block text-xs text-orange-200 max-w-[120px] truncate">{user.name}</span>
                  <button
                    onClick={() => navigate('/change-password')}
                    className="hidden md:flex items-center gap-1 text-xs text-orange-200 hover:text-white bg-orange-700 hover:bg-orange-600 px-2 py-1.5 rounded-lg transition-colors"
                    title="Change Password"
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-red-800 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                <UserCircle className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
