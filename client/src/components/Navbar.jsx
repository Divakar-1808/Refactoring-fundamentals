import React from 'react';
import { LayoutDashboard, CheckSquare, Users, UserCircle, Menu, X, LogOut } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentUser, users }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'users', label: 'Users', icon: UserCircle },
  ];

  const NavButton = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;
    
    return (
      <button
        onClick={() => {
          setActiveView(item.id);
          setMobileMenuOpen(false);
        }}
        className={`
          relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
          ${isActive 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <Icon className="w-4 h-4" />
        <span>{item.label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1 h-1 bg-white rounded-full" />
        )}
      </button>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-2 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                <p className="text-sm font-semibold text-gray-900">
                  {currentUser ? currentUser.name : users.length > 0 ? 'Select a user' : 'Loading...'}
                </p>
              </div>
            </div>

            {/* Mobile User Avatar */}
            <div className="sm:hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {navItems.map(item => (
                <NavButton key={item.id} item={item} />
              ))}
            </div>
            
            {/* Mobile User Info */}
            <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Logged in as</p>
                  <p className="text-base font-bold text-gray-900">
                    {currentUser ? currentUser.name : users.length > 0 ? 'Select a user' : 'Loading...'}
                  </p>
                  {currentUser && (
                    <p className="text-xs text-gray-600">{currentUser.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}