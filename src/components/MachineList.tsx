import React, { useState } from 'react';
import { format } from 'date-fns';
import { Machine } from '../types';
import MaintenanceForm from './MaintenanceForm';
import MachineForm from './MachineForm';
import MachineDetails from './MachineDetails';

const initialMachines: Machine[] = [
  {
    id: "M001",
    locationIds: [1],
    status: "Online",
    lastMaintenance: "2024-01-15",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-15",
    maintenanceHistory: []
  },
  {
    id: "M002",
    locationIds: [2],
    status: "Offline",
    lastMaintenance: "2024-01-10",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-10",
    maintenanceHistory: []
  },
  {
    id: "M003",
    locationIds: [1, 2],
    status: "Maintenance",
    lastMaintenance: "2024-01-05",
    supplierName: "AirVac Solutions",
    nextMaintenanceDate: "2024-02-05",
    maintenanceHistory: []
  }
];

const getStatusColor = (status: Machine['status']) => {
  switch (status) {
    case 'Online':
      return 'bg-green-100 text-green-800';
    case 'Offline':
      return 'bg-red-100 text-red-800';
    case 'Maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MachineList: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);
  const [isMachineFormOpen, setIsMachineFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleExportToCSV = () => {
    // Prepare the data
    const data = machines.map(machine => ({
      'Machine ID': machine.id,
      'Status': machine.status,
      'Locations': machine.locationIds.join(', '),
      'Supplier': machine.supplierName,
      'Last Maintenance': format(new Date(machine.lastMaintenance), 'MMM d, yyyy'),
      'Next Maintenance': format(new Date(machine.nextMaintenanceDate), 'MMM d, yyyy'),
      'Purchase Price': machine.financialDetails?.purchasePrice || 'N/A',
      'Monthly Income': machine.financialDetails?.monthlyIncome || 'N/A',
      'Net Income': machine.financialDetails?.netIncome || 'N/A',
      'Maintenance Records': machine.maintenanceHistory.length,
      'Custom Fields': machine.customFields?.map(f => `${f.name}: ${f.value}`).join('; ') || 'N/A'
    }));

    // Create CSV header
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Handle values that might contain commas by wrapping in quotes
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `machines_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Machine List</h1>
        <div className="space-x-2">
          <button
            onClick={() => {
              setSelectedMachine(null);
              setIsMachineFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Machine
          </button>
          <button
            onClick={handleExportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Export to CSV
          </button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Machine {machine.id}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Installed at {machine.locationIds.length} location{machine.locationIds.length !== 1 ? 's' : ''}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  machine.status
                )}`}
              >
                {machine.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Maintenance:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {format(new Date(machine.lastMaintenance), 'MMM d, yyyy')}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next Maintenance:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {format(new Date(machine.nextMaintenanceDate), 'MMM d, yyyy')}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supplier: <span className="font-medium text-gray-900 dark:text-gray-100">{machine.supplierName}</span>
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedMachine(machine);
                  setIsDetailsOpen(true);
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  setSelectedMachine(machine);
                  setIsMaintenanceFormOpen(true);
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        ))}
      </div>

      <MachineForm
        isOpen={isMachineFormOpen}
        onClose={() => {
          setIsMachineFormOpen(false);
          setSelectedMachine(null);
        }}
        onSubmit={(machineData) => {
          if (selectedMachine) {
            setMachines(machines.map(m => 
              m.id === selectedMachine.id ? { ...machineData, id: m.id } : m
            ));
          } else {
            const newMachine: Machine = {
              ...machineData,
              id: `M${String(machines.length + 1).padStart(3, '0')}`
            };
            setMachines([...machines, newMachine]);
          }
          setIsMachineFormOpen(false);
          setSelectedMachine(null);
        }}
        editingMachine={selectedMachine || undefined}
      />

      {selectedMachine && (
        <>
          <MaintenanceForm
            isOpen={isMaintenanceFormOpen}
            onClose={() => {
              setIsMaintenanceFormOpen(false);
              setSelectedMachine(null);
            }}
            onSubmit={(maintenanceData) => {
              setMachines(machines.map(machine => {
                if (machine.id === selectedMachine.id) {
                  return {
                    ...machine,
                    maintenanceHistory: [
                      ...machine.maintenanceHistory,
                      { ...maintenanceData, id: Date.now() }
                    ],
                    lastMaintenance: maintenanceData.date,
                    status: maintenanceData.status === 'Completed' ? 'Online' : 'Maintenance'
                  };
                }
                return machine;
              }));
              setIsMaintenanceFormOpen(false);
              setSelectedMachine(null);
            }}
            machineId={selectedMachine.id}
          />

          <MachineDetails
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedMachine(null);
            }}
            onEdit={() => {
              setIsDetailsOpen(false);
              setIsMachineFormOpen(true);
            }}
            machine={selectedMachine}
          />
        </>
      )}
    </div>
  );
};

export default MachineList;