import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Search, Filter } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  category: string;
  source: string;
  url: string | null;
}

type FilterType = 'all' | 'federal' | 'state' | 'county';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Map filter types to database categories
  const getCategoryFilter = (filter: FilterType): string[] => {
    switch (filter) {
      case 'federal':
        return ['Federal'];
      case 'state':
        return ['California', 'State'];
      case 'county':
        return ['County', 'Local'];
      case 'all':
      default:
        return [];
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.source.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') {
      return matchesSearch;
    }

    const allowedCategories = getCategoryFilter(selectedFilter);
    const matchesCategory = allowedCategories.some(cat =>
      doc.category.toLowerCase().includes(cat.toLowerCase())
    );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Documents</h1>
          <p className="text-gray-600">
            Browse all available child support policy documents and resources
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by title or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all' as FilterType, label: 'All' },
                { value: 'federal' as FilterType, label: 'Federal' },
                { value: 'state' as FilterType, label: 'State' },
                { value: 'county' as FilterType, label: 'County' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-teal text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No documents found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                {/* Category Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal">
                    {doc.category}
                  </span>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {doc.title}
                </h3>

                {/* Source */}
                <p className="text-sm text-gray-600 mb-4">{doc.source}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/policy/${doc.id}`}
                    className="flex-1 px-3 py-2 text-sm font-medium text-teal bg-teal/10 rounded-lg hover:bg-teal/20 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-teal hover:bg-gray-100 rounded-lg transition-colors"
                      title="Open external link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
