import React, { useState } from 'react';
import { Machine } from '../types';

interface ManageMachinesFormProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: number;
  locationName: string;
  machines: Machine[];
  onAddMachine: (machineId: string) => void;
  onRemoveMachine: (machineId: string) => void;
}

const ManageMachinesForm: React.FC<ManageMachinesFormProps> = ({
  isOpen,
  onClose,
  locationId,
  locationName,
  machines,
  onAddMachine,
  onRemoveMachine,
}) => {
  const [newMachineId, setNewMachineId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMachineId) {
      onAddMachine(newMachineId);
      setNewMachineId('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Manage Machines - {locationName}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMachineId}
              onChange={(e) => setNewMachineId(e.target.value)}
              placeholder="Enter Machine ID"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add Machine
            </button>
          </div>
        </form>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Installed Machines</h3>
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
            >
              <span>{machine.id}</span>
              <button
                onClick={() => onRemoveMachine(machine.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMachinesForm;