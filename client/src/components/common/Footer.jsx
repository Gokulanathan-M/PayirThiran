import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-green-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
              <Sprout className="w-6 h-6" /> CropAI
            </div>
            <p className="text-sm text-green-200">
              AI-powered sustainable crop recommendation platform helping farmers make data-driven decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/recommend" className="hover:text-white transition">Crop Recommendation</Link></li>
              <li><Link to="/suitability" className="hover:text-white transition">Crop Suitability</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">About</h4>
            <p className="text-sm text-green-200">
              Built to empower farmers with AI insights for better yield, sustainable practices, and higher profitability.
            </p>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-6 text-center text-sm text-green-300">
          &copy; {new Date().getFullYear()} CropAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
