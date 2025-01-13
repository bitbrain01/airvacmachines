import React, { useState } from 'react';
import { MaintenanceChecklist, MaintenanceProcedure, InventoryPart } from '../types';
import MaintenanceChecklistForm from './MaintenanceChecklistForm';
import MaintenanceProcedureForm from './MaintenanceProcedureForm';

const initialChecklists: MaintenanceChecklist[] = [
  {
    id: 1,
    name: "Monthly Vacuum System Maintenance",
    description: "Standard monthly maintenance procedure for vacuum systems",
    machineTypes: ["M001", "M002"],
    items: [
      {
        id: 1,
        description: "Inspect and clean air filter",
        required: true,
        estimatedTime: 15,
        requiredParts: [{ partId: 1, quantity: 1 }],
        tools: ["Filter wrench", "Compressed air"],
        instructions: "1. Turn off machine\n2. Remove filter housing\n3. Inspect filter\n4. Clean or replace if necessary",
        safetyNotes: "Ensure machine is completely powered down before beginning"
      },
      {
        id: 2,
        description: "Check pressure gauge calibration",
        required: true,
        estimatedTime: 20,
        tools: ["Calibration kit"],
        instructions: "1. Connect calibration kit\n2. Compare readings\n3. Adjust if necessary",
        safetyNotes: "Verify system is depressurized before connecting calibration kit"
      }
    ]
  }
];

const MaintenanceChecklistComponent: React.FC = () => {
  const [checklists, setChecklists] = useState<MaintenanceChecklist[]>(initialChecklists);
  const [selectedChecklist, setSelectedChecklist] = useState<MaintenanceChecklist | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProcedureFormOpen, setIsProcedureFormOpen] = useState(false);

  const handleAddChecklist = (checklistData: Omit<MaintenanceChecklist, 'id'>) => {
    const newChecklist: MaintenanceChecklist = {
      ...checklistData,
      id: Math.max(...checklists.map(c => c.id)) + 1
    };
    setChecklists([...checklists, newChecklist]);
    setIsFormOpen(false);
  };

  const handleEditChecklist = (checklistData: Omit<MaintenanceChecklist, 'id'>) => {
    if (!selectedChecklist) return;
    
    const updatedChecklists = checklists.map(checklist =>
      checklist.id === selectedChecklist.id
        ? { ...checklistData, id: checklist.id }
        : checklist
    );
    
    setChecklists(updatedChecklists);
    setIsFormOpen(false);
    setSelectedChecklist(null);
  };

  const handleStartProcedure = (procedure: Omit<MaintenanceProcedure, 'id'>) => {
    // Handle starting a new maintenance procedure
    console.log('Starting procedure:', procedure);
    setIsProcedureFormOpen(false);
    setSelectedChecklist(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Checklists</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setSelectedChecklist(null);
            setIsFormOpen(true);
          }}
        >
          Create Checklist
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {checklists.map((checklist) => (
          <div
            key={checklist.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{checklist.name}</h3>
              <p className="text-sm text-gray-600">{checklist.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Machine Types:</span>{' '}
                {checklist.machineTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Items:</span> {checklist.items.length}
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedChecklist(checklist);
                  setIsProcedureFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Start Procedure
              </button>
              <button
                onClick={() => {
                  setSelectedChecklist(checklist);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <MaintenanceChecklistForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedChecklist(null);
        }}
        onSubmit={selectedChecklist ? handleEditChecklist : handleAddChecklist}
        editingChecklist={selectedChecklist || undefined}
      />

      {selectedChecklist && (
        <MaintenanceProcedureForm
          isOpen={isProcedureFormOpen}
          onClose={() => {
            setIsProcedureFormOpen(false);
            setSelectedChecklist(null);
          }}
          onSubmit={handleStartProcedure}
          checklist={selectedChecklist}
        />
      )}
    </div>
  );
};

export default MaintenanceChecklistComponent;