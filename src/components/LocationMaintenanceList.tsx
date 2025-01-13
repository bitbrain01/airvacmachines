import React, { useState } from 'react';
import { format, addDays, addWeeks, addMonths, addQuarters, addYears } from 'date-fns';
import { LocationMaintenanceRequirement } from '../types';

const initialRequirements: LocationMaintenanceRequirement[] = [
  {
    id: 1,
    locationId: 1,
    requirement: "Check air pressure systems",
    frequency: "daily",
    lastCompleted: "2024-01-15",
    nextDue: "2024-01-16",
    notes: "Must be done at start of day"
  }
];

const LocationMaintenanceList: React.FC<{ locationId: number }> = ({ locationId }) => {
  const [requirements, setRequirements] = useState<LocationMaintenanceRequirement[]>(initialRequirements);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<LocationMaintenanceRequirement, 'id'>>({
    locationId,
    requirement: '',
    frequency: 'daily',
    nextDue: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const calculateNextDueDate = (date: string, frequency: LocationMaintenanceRequirement['frequency']) => {
    const baseDate = new Date(date);
    switch (frequency) {
      case 'daily':
        return addDays(baseDate, 1);
      case 'weekly':
        return addWeeks(baseDate, 1);
      case 'monthly':
        return addMonths(baseDate, 1);
      case 'quarterly':
        return addMonths(baseDate, 3);
      case 'yearly':
        return addYears(baseDate, 1);
      default:
        return baseDate;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequirement: LocationMaintenanceRequirement = {
      ...formData,
      id: Math.max(...requirements.map(r => r.id)) + 1,
      nextDue: calculateNextDueDate(formData.nextDue, formData.frequency).toISOString().split('T')[0]
    };
    setRequirements([...requirements, newRequirement]);
    setIsFormOpen(false);
    setFormData({
      locationId,
      requirement: '',
      frequency: 'daily',
      nextDue: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleComplete = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setRequirements(requirements.map(req => {
      if (req.id === id) {
        return {
          ...req,
          lastCompleted: today,
          nextDue: calculateNextDueDate(today, req.frequency).toISOString().split('T')[0]
        };
      }
      return req;
    }));
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Maintenance Requirements</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
        >
          Add Requirement
        </button>
      </div>

      <div className="space-y-4">
        {requirements
          .filter(req => req.locationId === locationId)
          .map((requirement) => (
            <div
              key={requirement.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{requirement.requirement}</h3>
                  <p className="text-sm text-gray-600">
                    Frequency: {requirement.frequency.charAt(0).toUpperCase() + requirement.frequency.slice(1)}
                  </p>
                  {requirement.lastCompleted && (
                    <p className="text-sm text-gray-600">
                      Last completed: {format(new Date(requirement.lastCompleted), 'MMM d, yyyy')}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Next due: {format(new Date(requirement.nextDue), 'MMM d, yyyy')}
                  </p>
                  {requirement.notes && (
                    <p className="text-sm text-gray-600 mt-2">{requirement.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleComplete(requirement.id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Maintenance Requirement</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Requirement</label>
                <input
                  type="text"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as LocationMaintenanceRequirement['frequency'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.nextDue}
                  onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMaintenanceList;