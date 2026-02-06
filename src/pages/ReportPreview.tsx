import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, ArrowLeft, Calendar, Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { generateBibliography } from '../utils/citationGenerator';
import { Policy, CountyReport } from '../types';

interface ReportData {
  title: string;
  summary: string;
  policies: Policy[];
  countyReports?: CountyReport[];
  citationFormat: 'apa' | 'mla' | 'chicago';
  generatedDate: string;
}

const ReportPreview: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('reportData');
    console.log('Retrieved report data:', data); // Debug log
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log('Parsed report data:', parsedData); // Debug log
        setReportData(parsedData);
      } catch (error) {
        console.error('Error parsing report data:', error);
      }
    }
  }, []);

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Report Data Found</h1>
          <p className="text-gray-600 mb-6">Please generate a report from the Reports page.</p>
          <button
            onClick={() => navigate('/reports')}
            className="ma-btn-primary"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const downloadWord = () => {
    // Placeholder for Word download functionality
    alert('Word download functionality would be implemented here');
  };

  const downloadPDF = () => {
    // Placeholder for PDF download functionality
    alert('PDF download functionality would be implemented here');
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'California':
        return <Building2 className="h-5 w-5" />;
      case 'Federal':
        return <FileText className="h-5 w-5" />;
      case 'County':
        return <MapPin className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'California':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Federal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'County':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalItems = (reportData.policies?.length || 0) + (reportData.countyReports?.length || 0);
  const californiaCount = reportData.policies?.filter(p => p.source === 'California').length || 0;
  const federalCount = reportData.policies?.filter(p => p.source === 'Federal').length || 0;
  const countyCount = reportData.countyReports?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/reports')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Report Preview</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadWord}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <FileText className="h-4 w-4" />
                <span>Download Word</span>
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="ma-card p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{reportData.title}</h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-6">
              <Calendar className="h-4 w-4" />
              <span>Generated on {new Date(reportData.generatedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">{reportData.summary}</p>
            </div>
          </div>

          {/* Report Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{californiaCount}</div>
              <div className="text-sm text-gray-600">California Policies</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{federalCount}</div>
              <div className="text-sm text-gray-600">Federal Policies</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{countyCount}</div>
              <div className="text-sm text-gray-600">County Guides</div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* State and Federal Policies */}
          {reportData.policies && reportData.policies.length > 0 && (
            <div className="ma-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Policy Documents ({reportData.policies.length})
              </h2>
              
              <div className="space-y-6">
                {reportData.policies.map((policy, index) => (
                  <div key={policy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSourceIcon(policy.source)}
                          <h3 className="text-xl font-semibold text-gray-900">{policy.title}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="font-medium">{policy.document_number}</span>
                          <span>•</span>
                          <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSourceColor(policy.source)}`}>
                        {policy.source}
                      </span>
                    </div>
                    
                    <div className="prose max-w-none text-gray-700 mb-4">
                      <p>{policy.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Source:</span> {policy.url}
                      </div>
                      <div className="text-sm text-gray-500">
                        Item {index + 1} of {reportData.policies.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* County Reports */}
          {reportData.countyReports && reportData.countyReports.length > 0 && (
            <div className="ma-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-purple-600" />
                County Implementation Guides ({reportData.countyReports.length})
              </h2>
              
              <div className="space-y-8">
                {reportData.countyReports.map((county, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{county.title}</h3>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>Population: {county.county.population.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span>Cases: {county.county.caseload.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium border bg-purple-100 text-purple-800 border-purple-200">
                        County Guide
                      </span>
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                      <div className="prose max-w-none text-gray-700">
                        <p>{county.executive_summary.split('\n')[0]}</p>
                      </div>
                    </div>

                    {/* Key Sections Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Legal Framework</h5>
                        <p className="text-sm text-blue-800">
                          {county.legal_framework.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Establishment Procedures</h5>
                        <p className="text-sm text-green-800">
                          {county.establishment_procedures.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">Modification Procedures</h5>
                        <p className="text-sm text-purple-800">
                          {county.modification_procedures.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-900 mb-2">Enforcement Procedures</h5>
                        <p className="text-sm text-orange-800">
                          {county.enforcement_procedures.substring(0, 150)}...
                        </p>
                      </div>
                    </div>

                    {/* Next Steps Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-3">Key Next Steps ({county.next_steps.length})</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {county.next_steps.slice(0, 4).map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                            <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {stepIndex + 1}
                            </div>
                            <span>{step.substring(0, 80)}...</span>
                          </div>
                        ))}
                      </div>
                      {county.next_steps.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">
                          +{county.next_steps.length - 4} more steps included in full report
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bibliography */}
          {reportData.policies && reportData.policies.length > 0 && (
            <div className="ma-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bibliography</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Citations formatted in <span className="font-semibold uppercase">{reportData.citationFormat}</span> style
                  </p>
                  <span className="text-sm text-gray-500">
                    {reportData.policies.length} {reportData.policies.length === 1 ? 'source' : 'sources'}
                  </span>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white p-4 rounded border">
                    {generateBibliography(reportData.policies, reportData.citationFormat)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="ma-card p-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex space-x-2">
                <div className="w-6 h-8 bg-blue-600 rounded"></div>
                <div className="w-6 h-8 bg-yellow-400 rounded"></div>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-blue-600">CHILD SUPPORT</div>
                <div className="text-lg font-bold text-blue-600">DIRECTORS ASSOCIATION</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Generated by CSDA Policy Reference System
            </p>
            <p className="text-xs text-gray-500">
              Report generated on {new Date(reportData.generatedDate).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;