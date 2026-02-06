import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/Search/SearchBox';
import { useSearch } from '../hooks/useSearch';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { search, isLoading } = useSearch();

  const handleSearch = (query: string, mode: 'summary' | 'steps') => {
    search(query, mode);
    navigate(`/search?q=${encodeURIComponent(query)}&mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="mx-auto mb-6 flex justify-center">
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img
                    src="/csdai-logo.png"
                    alt="CSDAI Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-[#14558f]">CSDAI</div>
                  <div className="text-lg font-semibold text-[#388557]">Child Support Directors</div>
                  <div className="text-lg font-semibold text-[#388557]">Association Intelligence</div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CSDAI — Child Support Directors Association Intelligence
          </h1>
          
          <p className="text-xl text-[#535353] mb-8 max-w-3xl mx-auto">
            Search federal and state child support policies, guidelines, and procedures. 
            Get intelligent summaries with policy citations to help you provide accurate guidance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#14558f] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-semibold text-lg">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-sm text-[#535353]">
                Natural language queries return relevant policies with highlighted matches
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#388557] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-semibold text-lg">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Summaries & Steps</h3>
              <p className="text-sm text-[#535353]">
                Choose between quick summaries or detailed step-by-step instructions
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-[#43956f] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-semibold text-lg">💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Annotations</h3>
              <p className="text-sm text-[#535353]">
                Add notes and share knowledge with your team for better case management
              </p>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="flex justify-center">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#14558f]">50+</div>
            <div className="text-sm text-[#535353]">California Counties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#388557]">5,000+</div>
            <div className="text-sm text-[#535353]">Policy Documents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#43956f]">1,200+</div>
            <div className="text-sm text-[#535353]">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#14558f]">24/7</div>
            <div className="text-sm text-[#535353]">Access Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;