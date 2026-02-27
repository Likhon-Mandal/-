import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Search, Map, Home as HomeIcon, Trash2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">


        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="flex items-center space-x-1 hover:text-accent transition-colors">
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/explorer" className="flex items-center space-x-1 hover:text-accent transition-colors">
            <Map className="h-4 w-4" />
            <span>Lineage Explorer</span>
          </Link>
          <Link to="/directory" className="flex items-center space-x-1 hover:text-accent transition-colors">
            <Search className="h-4 w-4" />
            <span>Search User</span>
          </Link>
          <Link to="/relation" className="hover:text-accent transition-colors">
            <span>Find Relation</span>
          </Link>
          <Link to="/board" className="hover:text-accent transition-colors">
            <span>Events & Notices</span>
          </Link>
          <Link to="/committee" className="hover:text-accent transition-colors">
            <span>Committee Board</span>
          </Link>
          <Link to="/eminent" className="hover:text-accent transition-colors">
            <span>Eminent Figures</span>
          </Link>
          <Link to="/help" className="hover:text-accent transition-colors">
            <span>Help Desk</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="flex items-center space-x-1 bg-secondary hover:bg-red-900 px-3 py-1.5 rounded-md transition-colors text-sm font-medium">
            <UserCircle className="h-4 w-4" />
            <span>Login / Join</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
