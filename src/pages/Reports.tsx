import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, CheckSquare, MapPin, Building } from 'lucide-react';
import { samplePolicies } from '../data/mockData';
import { californiaCounties } from '../data/mockData';
import { generateCountyReport } from '../utils/countyReportGenerator';
import { Policy, CountyInfo } from '../types';

// Extended policy type to include county reports
interface ExtendedPolicy extends Policy {
  type?: 'policy' | 'county';
  county?: CountyInfo;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [citationFormat, setCitationFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'California' | 'Federal' | 'County'>('all');

  // Create extended policies list that includes county reports
  const extendedPolicies: ExtendedPolicy[] = [
    ...samplePolicies.map(p => ({ ...p, type: 'policy' as const })),
    ...californiaCounties.map(county => ({
      id: `county-${county.code}`,
      source: 'County' as const,
      title: `${county.name} County Child Support Services Guide`,
      document_number: `COUNTY-${county.code}-2024`,
      effective_date: '2024-01-01',
      content: `Comprehensive guide for ${county.name} County child support services including establishment, modification, and enforcement procedures. Covers local office information, specialized programs, and county-specific implementation of California state policies.`,
      url: county.website,
      relevance_score: 0.95,
      type: 'county' as const,
      county: county
    }))
  ];

  // Filter policies based on source filter
  const filteredPolicies = extendedPolicies.filter(policy => {
    if (sourceFilter === 'all') return true;
    return policy.source === sourceFilter;
  });

  const handlePolicyToggle = (policyId: string) => {
    setSelectedPolicies(prev =>
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleSelectAll = () => {
    const currentFilteredIds = filteredPolicies.map(p => p.id);
    const allCurrentSelected = currentFilteredIds.every(id => selectedPolicies.includes(id));
    
    if (allCurrentSelected) {
      // Deselect all filtered policies
      setSelectedPolicies(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      // Select all filtered policies
      setSelectedPolicies(prev => [...new Set([...prev, ...currentFilteredIds])]);
    }
  };

  const generateReport = () => {
    const selectedItems = extendedPolicies.filter(p => selectedPolicies.includes(p.id));
    const policies = selectedItems.filter(p => p.type === 'policy' || !p.type) as Policy[];
    const countyItems = selectedItems.filter(p => p.type === 'county');

    const reportData = {
      title: reportTitle || 'Child Support Policy Report',
      summary: reportSummary || 'This report contains selected child support policies and procedures.',
      policies: policies,
      countyReports: countyItems.map(cr => generateCountyReport(cr.county!)),
      citationFormat: citationFormat,
      generatedDate: new Date().toISOString()
    };

    sessionStorage.setItem('reportData', JSON.stringify(reportData));
    navigate('/report-preview');
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'California':
        return 'bg-blue-100 text-blue-800';
      case 'Federal':
        return 'bg-green-100 text-green-800';
      case 'County':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'California':
        return <Building className="h-4 w-4" />;
      case 'Federal':
        return <FileText className="h-4 w-4" />;
      case 'County':
        return <MapPin className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-csdai-navy mb-2">Reports Generator</h1>
          <p className="text-gray-600">
            Generate comprehensive reports with policy citations and county-specific guidance
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Policy Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ma-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Select Policies & County Guides</h2>
              <div className="flex items-center space-x-3">
                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as typeof sourceFilter)}
                  className="ma-input text-sm w-auto"
                >
                  <option value="all">All Sources</option>
                  <option value="California">California State</option>
                  <option value="Federal">Federal</option>
                  <option value="County">County Guides</option>
                </select>
                
                <button
                  onClick={handleSelectAll}
                  className="ma-btn-outline text-sm"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {filteredPolicies.every(p => selectedPolicies.includes(p.id)) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="mb-4 flex items-center space-x-4 text-sm text-gray-600">
              <span>Showing {filteredPolicies.length} items</span>
              <span>•</span>
              <span>{selectedPolicies.length} selected</span>
            </div>
            
            <div className="space-y-3">
              {filteredPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedPolicies.includes(policy.id)
                      ? 'border-csdai-sky bg-csdai-sky/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePolicyToggle(policy.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPolicies.includes(policy.id)}
                      onChange={() => handlePolicyToggle(policy.id)}
                      className="mt-1 h-4 w-4 text-csdai-sky focus:ring-csdai-sky border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getSourceIcon(policy.source)}
                        <h3 className="font-medium text-gray-900">{policy.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{policy.document_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(policy.source)}`}>
                          {policy.source}
                        </span>
                        <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                      </div>
                      {policy.type === 'county' && policy.county && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Population:</span> {policy.county.population.toLocaleString()} • 
                          <span className="font-medium ml-2">Cases:</span> {policy.county.caseload.toLocaleString()} • 
                          <span className="font-medium ml-2">Programs:</span> {policy.county.special_programs.slice(0, 2).join(', ')}
                        </div>
                      )}
                      <p className="text-sm text-gray-700 mt-2">{policy.content.substring(0, 150)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="space-y-6">
          <div className="ma-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="ma-input"
                  placeholder="Child Support Policy Report"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Executive Summary
                </label>
                <textarea
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  className="ma-input h-24"
                  placeholder="Brief overview of the report contents..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Citation Format
                </label>
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value as 'apa' | 'mla' | 'chicago')}
                  className="ma-input"
                >
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="ma-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Selected:</span>
                <span className="font-medium">{selectedPolicies.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">California Policies:</span>
                <span className="font-medium">
                  {extendedPolicies.filter(p => 
                    selectedPolicies.includes(p.id) && p.source === 'California'
                  ).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Federal Policies:</span>
                <span className="font-medium">
                  {extendedPolicies.filter(p => 
                    selectedPolicies.includes(p.id) && p.source === 'Federal'
                  ).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">County Guides:</span>
                <span className="font-medium">
                  {extendedPolicies.filter(p => 
                    selectedPolicies.includes(p.id) && p.source === 'County'
                  ).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Citation Format:</span>
                <span className="font-medium uppercase">{citationFormat}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={generateReport}
                disabled={selectedPolicies.length === 0}
                className="w-full ma-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Report will open in a new window for preview and download
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="ma-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setReportTitle('California Child Support Legal Framework');
                  setReportSummary('Comprehensive overview of California child support statutes, regulations, and guidelines.');
                  setSelectedPolicies(['1', '2', '9']);
                  setSourceFilter('California');
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-csdai-sky hover:bg-csdai-sky/10 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">Legal Framework Report</div>
                <div className="text-sm text-gray-600">Focus on statutes and guidelines</div>
              </button>

              <button
                onClick={() => {
                  setReportTitle('County Implementation Guide');
                  setReportSummary('County-specific implementation of California child support policies and procedures.');
                  setSelectedPolicies(californiaCounties.slice(0, 3).map(c => `county-${c.code}`));
                  setSourceFilter('County');
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-csdai-sky hover:bg-csdai-sky/10 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">County Guide Report</div>
                <div className="text-sm text-gray-600">Focus on county-specific procedures</div>
              </button>

              <button
                onClick={() => {
                  setReportTitle('Federal and State Coordination Manual');
                  setReportSummary('Complete guide to federal requirements and California state implementation.');
                  setSelectedPolicies(['11', '12', '13', '1', '3', '4']);
                  setSourceFilter('all');
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-csdai-sky hover:bg-csdai-sky/10 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">Federal-State Manual</div>
                <div className="text-sm text-gray-600">Combined federal and state guidance</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Reports;