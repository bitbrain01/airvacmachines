import React, { useState } from 'react';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor performance and trends</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">$24,567.89</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 12.5%</span>
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Maintenance Costs</h3>
          <p className="text-2xl font-bold text-gray-900">$3,842.50</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-600">↑ 8.2%</span>
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Machine Uptime</h3>
          <p className="text-2xl font-bold text-gray-900">98.3%</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 1.2%</span>
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Machines</h3>
          <p className="text-2xl font-bold text-gray-900">12/15</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-yellow-600">→ No change</span>
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Location</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Downtown Gas Station</p>
                <p className="text-sm text-gray-600">3 machines</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$8,245.32</p>
                <p className="text-sm text-green-600">↑ 15.3%</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Westside Fuel Stop</p>
                <p className="text-sm text-gray-600">2 machines</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$6,123.45</p>
                <p className="text-sm text-green-600">↑ 8.7%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Scheduled Maintenance</span>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Emergency Repairs</span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;