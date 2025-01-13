import React, { useState } from 'react';
import { MaintenanceChecklist, MaintenanceChecklistItem } from '../types';

interface MaintenanceChecklistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (checklist: Omit<MaintenanceChecklist, 'id'>) => void;
  editingChecklist?: MaintenanceChecklist;
}

const MaintenanceChecklistForm: React.FC<MaintenanceChecklistFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingChecklist
}) => {
  const [formData, setFormData] = useState({
    name: editingChecklist?.name || '',
    description: editingChecklist?.description || '',
    machineTypes: editingChecklist?.machineTypes || [],
    items: editingChecklist?.items || []
  });

  const [newItem, setNewItem] = useState<Omit<MaintenanceChecklistItem, 'id'>>({
    description: '',
    required: true,
    estimatedTime: 15,
    tools: [],
    instructions: '',
    safetyNotes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddItem = () => {
    const item: MaintenanceChecklistItem = {
      ...newItem,
      id: Math.max(...formData.items.map(i => i.id), 0) + 1
    };
    setFormData({
      ...formData,
      items: [...formData.items, item]
    });
    setNewItem({
      description: '',
      required: true,
      estimatedTime: 15,
      tools: [],
      instructions: '',
      safetyNotes: ''
    });
  };

  const handleRemoveItem = (id: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingChecklist ? 'Edit Checklist' : 'Create Checklist'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Checklist Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Machine Types (comma-separated)</label>
            <input
              type="text"
              value={formData.machineTypes.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                machineTypes: e.target.value.split(',').map(type => type.trim())
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="M001, M002"
              required
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist Items</h3>
            
            {formData.items.map((item) => (
              <div key={item.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-gray-600">
                      Estimated time: {item.estimatedTime} minutes
                    </p>
                    <p className="text-sm text-gray-600">
                      Tools: {item.tools.join(', ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Add New Item</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Time (minutes)</label>
                    <input
                      type="number"
                      value={newItem.estimatedTime}
                      onChange={(e) => setNewItem({ ...newItem, estimatedTime: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required</label>
                    <select
                      value={newItem.required ? 'true' : 'false'}
                      onChange={(e) => setNewItem({ ...newItem, required: e.target.value === 'true' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tools (comma-separated)</label>
                  <input
                    type="text"
                    value={newItem.tools.join(', ')}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      tools: e.target.value.split(',').map(tool => tool.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructions</label>
                  <textarea
                    value={newItem.instructions}
                    onChange={(e) => setNewItem({ ...newItem, instructions: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Safety Notes</label>
                  <textarea
                    value={newItem.safetyNotes}
                    onChange={(e) => setNewItem({ ...newItem, safetyNotes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Item
                </button>
              </div>
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
              {editingChecklist ? 'Save Changes' : 'Create Checklist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceChecklistForm;