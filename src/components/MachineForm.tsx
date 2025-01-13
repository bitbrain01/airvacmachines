import React, { useState } from 'react';
import { Machine, CustomField } from '../types';

interface MachineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (machine: Omit<Machine, 'id'>) => void;
  editingMachine?: Machine;
}

const MachineForm: React.FC<MachineFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMachine
}) => {
  const [formData, setFormData] = useState({
    locationIds: editingMachine?.locationIds || [],
    status: editingMachine?.status || 'Online',
    lastMaintenance: editingMachine?.lastMaintenance || new Date().toISOString().split('T')[0],
    supplierName: editingMachine?.supplierName || '',
    nextMaintenanceDate: editingMachine?.nextMaintenanceDate || '',
    maintenanceHistory: editingMachine?.maintenanceHistory || [],
    productUrl: editingMachine?.productUrl || '',
    customFields: editingMachine?.customFields || []
  });

  const [newField, setNewField] = useState<Omit<CustomField, 'id'>>({
    name: '',
    value: '',
    type: 'text'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddCustomField = () => {
    if (newField.name && newField.value) {
      const field: CustomField = {
        ...newField,
        id: Math.max(...(formData.customFields?.map(f => f.id) || [0]), 0) + 1
      };
      setFormData({
        ...formData,
        customFields: [...(formData.customFields || []), field]
      });
      setNewField({ name: '', value: '', type: 'text' });
    }
  };

  const handleRemoveCustomField = (id: number) => {
    setFormData({
      ...formData,
      customFields: formData.customFields?.filter(field => field.id !== id) || []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingMachine ? 'Edit Machine' : 'Add New Machine'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location IDs (comma-separated)</label>
            <input
              type="text"
              value={formData.locationIds.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                locationIds: e.target.value.split(',').map(id => Number(id.trim()))
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="1, 2, 3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Machine['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Maintenance Date</label>
            <input
              type="date"
              value={formData.lastMaintenance}
              onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Next Maintenance Date</label>
            <input
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product URL</label>
            <input
              type="url"
              value={formData.productUrl}
              onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/product"
            />
          </div>

          {/* Custom Fields Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Fields</h3>
            
            {formData.customFields?.map((field) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-sm">{field.name}</p>
                  <p className="text-sm text-gray-600">{field.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(field.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Name</label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter field name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as CustomField['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="url">URL</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Field Value</label>
                {newField.type === 'date' ? (
                  <input
                    type="date"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : newField.type === 'number' ? (
                  <input
                    type="number"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : newField.type === 'url' ? (
                  <input
                    type="url"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                ) : (
                  <input
                    type="text"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Add Custom Field
              </button>
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
              {editingMachine ? 'Save Changes' : 'Add Machine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineForm;