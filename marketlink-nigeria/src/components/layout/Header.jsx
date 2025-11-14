import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { isAuthenticated, currentUser } = useAppContext();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="text-green-600 h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">MarketLink</span>
        </Link>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for commodities..."
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
            <Link to="/markets" className="text-gray-600 hover:text-green-600">Markets</Link>
            <Link to="/compare" className="text-gray-600 hover:text-green-600">Compare</Link>
          </nav>
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-2">
              <User className="h-6 w-6 text-gray-600" />
              <span className="hidden sm:inline">{currentUser.name}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-gray-600 hover:text-green-600">Login</Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;