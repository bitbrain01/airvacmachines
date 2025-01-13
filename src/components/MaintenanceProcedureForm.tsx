import React, { useState } from 'react';
import { MaintenanceChecklist, MaintenanceProcedure, MaintenanceProcedureItem } from '../types';

interface MaintenanceProcedureFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (procedure: Omit<MaintenanceProcedure, 'id'>) => void;
  checklist: MaintenanceChecklist;
}

const MaintenanceProcedureForm: React.FC<MaintenanceProcedureFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  checklist
}) => {
  const [formData, setFormData] = useState<Omit<MaintenanceProcedure, 'id'>>({
    checklistId: checklist.id,
    machineId: '',
    technicianId: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    items: checklist.items.map(item => ({
      ...item,
      completed: false
    }))
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Start Maintenance Procedure</h2>
            <p className="text-sm text-gray-600">{checklist.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Machine ID</label>
              <input
                type="text"
                value={formData.machineId}
                onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Technician ID</label>
              <input
                type="text"
                value={formData.technicianId}
                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist Items</h3>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <p>Estimated time: {item.estimatedTime} minutes</p>
                        <p>Tools needed: {item.tools.join(', ')}</p>
                        {item.requiredParts && (
                          <p>Required parts: {item.requiredParts.map(p => `Part ${p.partId} (${p.quantity}x)`).join(', ')}</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">Instructions:</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{item.instructions}</p>
                      </div>
                      {item.safetyNotes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm font-medium text-yellow-800">Safety Notes:</p>
                          <p className="text-sm text-yellow-700">{item.safetyNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Start Procedure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceProcedureForm;