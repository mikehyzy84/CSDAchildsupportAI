import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Child Support Directors Association</h3>
            <p className="text-sm">
              Supporting child support professionals nationwide
            </p>
            <p className="text-sm">
              Advancing best practices and policy excellence
            </p>
            <p className="text-sm">
              1234 Professional Drive
            </p>
            <p className="text-sm">
              Washington, DC 20001
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.childsupportdirectors.org" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors duration-200">
                  <ExternalLink size={14} className="mr-2" />
                  CSDA Website
                </a>
              </li>
              <li>
                <a href="https://www.childsupportdirectors.org/resources" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors duration-200">
                  <ExternalLink size={14} className="mr-2" />
                  Resources
                </a>
              </li>
              <li>
                <a href="https://www.childsupportdirectors.org/membership" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors duration-200">
                  <ExternalLink size={14} className="mr-2" />
                  Membership
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">Member Support:</span>
                <br />
                <span>(202) 555-CSDA</span>
              </li>
              <li>
                <span className="text-gray-400">Hours:</span>
                <br />
                <span>Mon-Fri 8:00 AM - 5:00 PM</span>
              </li>
              <li>
                <span className="text-gray-400">Technical Support:</span>
                <br />
                <span>support@csda.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Child Support Directors Association. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            This system is for CSDA members and authorized users only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;