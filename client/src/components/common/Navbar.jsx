import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/recommend', label: 'Crop Recommendation' },
  { path: '/suitability', label: 'Crop Suitability' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-display font-bold text-xl">
            <Sprout className="w-7 h-7" />
            CropAI
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-600 border-b-2 border-primary-500 pb-1'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 transition">
                  <User className="w-5 h-5 text-primary-700" />
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-red-500">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block py-2 text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
