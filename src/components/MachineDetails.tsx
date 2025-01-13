import React from 'react';
import { format } from 'date-fns';
import { Machine } from '../types';

interface MachineDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  machine: Machine;
}

const MachineDetails: React.FC<MachineDetailsProps> = ({
  isOpen,
  onClose,
  onEdit,
  machine
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Machine {machine.id}</h2>
            <p className="text-gray-600">
              Status: <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                machine.status === 'Online' ? 'bg-green-100 text-green-800' :
                machine.status === 'Offline' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>{machine.status}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-medium">{machine.supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Locations</p>
                <p className="font-medium">{machine.locationIds.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Maintenance</p>
                <p className="font-medium">{format(new Date(machine.lastMaintenance), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Maintenance</p>
                <p className="font-medium">{format(new Date(machine.nextMaintenanceDate), 'MMM d, yyyy')}</p>
              </div>
              {machine.productUrl && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Product URL</p>
                  <a 
                    href={machine.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {machine.productUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {machine.financialDetails && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Purchase Price</p>
                  <p className="font-medium">{formatCurrency(machine.financialDetails.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="font-medium">{formatCurrency(machine.financialDetails.monthlyIncome)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance Costs</p>
                  <p className="font-medium">{formatCurrency(machine.financialDetails.maintenanceCosts)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Income</p>
                  <p className="font-medium">{formatCurrency(machine.financialDetails.netIncome)}</p>
                </div>
              </div>
            </div>
          )}

          {machine.maintenanceHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance History</h3>
              <div className="space-y-2">
                {machine.maintenanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{format(new Date(record.date), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-gray-600">{record.type} - {record.description}</p>
                        <p className="text-sm text-gray-600">Technician: {record.technician}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {machine.customFields && machine.customFields.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Fields</h3>
              <div className="grid grid-cols-2 gap-4">
                {machine.customFields.map((field) => (
                  <div key={field.id}>
                    <p className="text-sm text-gray-600">{field.name}</p>
                    <p className="font-medium">
                      {field.type === 'url' ? (
                        <a 
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {field.value}
                        </a>
                      ) : field.type === 'date' ? (
                        format(new Date(field.value), 'MMM d, yyyy')
                      ) : (
                        field.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Edit Machine
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;