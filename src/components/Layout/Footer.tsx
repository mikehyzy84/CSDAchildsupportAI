import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Built By AI Product Studio
            </h3>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              CGI's innovation lab creating cutting-edge AI products for government solutions
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm">
            <a
              href="tel:3128139497"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Phone size={16} />
              <span>(312) 813-9497</span>
            </a>
            <a
              href="mailto:support@cgi.com"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Mail size={16} />
              <span>support@cgi.com</span>
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6 text-sm space-y-2">
            <p className="text-gray-400">&copy; 2026 CGI, Inc.</p>
            <p className="text-gray-500">
              For CGI clients and authorized users only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;