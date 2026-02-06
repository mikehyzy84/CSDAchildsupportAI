import React from 'react';
import { TrendingUp, Search, Users, Activity } from 'lucide-react';
import { sampleAnalytics } from '../../data/mockData';

const Analytics: React.FC = () => {
  const { total_searches_today, total_searches_week, total_searches_month, top_searches, user_activity } = sampleAnalytics;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_today}</p>
              <p className="text-sm text-green-600">↑ 12% from yesterday</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_week}</p>
              <p className="text-sm text-green-600">↑ 8% from last week</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_month}</p>
              <p className="text-sm text-green-600">↑ 15% from last month</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-sm text-gray-500">of 3000 licenses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Searches */}
        <div className="ma-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Search Queries</h3>
          <div className="space-y-3">
            {top_searches.map((search, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{search.query}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{search.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(search.count / top_searches[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="ma-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Search Activity</h3>
          <div className="space-y-2">
            {user_activity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(activity.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">{activity.searches}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${(activity.searches / Math.max(...user_activity.map(a => a.searches))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Response Times</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average</span>
              <span className="text-sm font-medium">0.8s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">95th Percentile</span>
              <span className="text-sm font-medium">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">99th Percentile</span>
              <span className="text-sm font-medium">2.1s</span>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Search Success Rate</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Successful Queries</span>
              <span className="text-sm font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">No Results</span>
              <span className="text-sm font-medium text-orange-600">4.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Errors</span>
              <span className="text-sm font-medium text-red-600">1.0%</span>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Top Policy Sources</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">California</span>
              <span className="text-sm font-medium">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Federal</span>
              <span className="text-sm font-medium">33%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;