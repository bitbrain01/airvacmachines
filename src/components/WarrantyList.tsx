import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore } from 'date-fns';
import { Warranty } from '../types';
import WarrantyForm from './WarrantyForm';

const initialWarranties: Warranty[] = [
  {
    id: 1,
    machineId: "M001",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    type: "full",
    provider: "AirVac Solutions",
    coverage: "Full parts and labor coverage for all components",
    notificationSent: false
  },
  {
    id: 2,
    machineId: "M002",
    startDate: "2024-01-20",
    endDate: "2025-01-20",
    type: "limited",
    provider: "PressureMax Systems",
    coverage: "Parts only coverage for main components",
    notificationSent: false
  }
];

const WarrantyList: React.FC = () => {
  const [warranties, setWarranties] = useState<Warranty[]>(initialWarranties);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | undefined>();

  useEffect(() => {
    const checkWarrantyExpirations = () => {
      const thirtyDaysFromNow = addDays(new Date(), 30);
      const expiringWarranties = warranties.filter(warranty => {
        const endDate = new Date(warranty.endDate);
        return isBefore(endDate, thirtyDaysFromNow) && !warranty.notificationSent;
      });

      if (expiringWarranties.length > 0) {
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
          expiringWarranties.forEach(warranty => {
            new Notification('Warranty Expiring Soon', {
              body: `Warranty for Machine ${warranty.machineId} expires on ${format(new Date(warranty.endDate), 'MMM d, yyyy')}`,
            });
          });
        }

        // Update notification status
        setWarranties(warranties.map(w => 
          expiringWarranties.find(ew => ew.id === w.id)
            ? { ...w, notificationSent: true }
            : w
        ));
      }
    };

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // Check warranties daily
    checkWarrantyExpirations();
    const interval = setInterval(checkWarrantyExpirations, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [warranties]);

  const handleAddWarranty = (warrantyData: Omit<Warranty, 'id'>) => {
    const newWarranty: Warranty = {
      ...warrantyData,
      id: Math.max(...warranties.map(w => w.id)) + 1
    };
    setWarranties([...warranties, newWarranty]);
    setIsFormOpen(false);
  };

  const handleEditWarranty = (warrantyData: Omit<Warranty, 'id'>) => {
    if (!selectedWarranty) return;
    
    const updatedWarranties = warranties.map(warranty =>
      warranty.id === selectedWarranty.id
        ? { ...warrantyData, id: warranty.id }
        : warranty
    );
    
    setWarranties(updatedWarranties);
    setIsFormOpen(false);
    setSelectedWarranty(undefined);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this warranty?')) {
      setWarranties(warranties.filter(warranty => warranty.id !== id));
    }
  };

  const getStatusColor = (endDate: string) => {
    const today = new Date();
    const warrantyEnd = new Date(endDate);
    const thirtyDaysFromNow = addDays(today, 30);

    if (isBefore(warrantyEnd, today)) {
      return 'bg-red-100 text-red-800';
    } else if (isBefore(warrantyEnd, thirtyDaysFromNow)) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warranties</h1>
          <p className="text-gray-600">Manage machine warranties and track expirations</p>
        </div>
        <button
          onClick={() => {
            setSelectedWarranty(undefined);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Warranty
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warranties.map((warranty) => (
          <div
            key={warranty.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Machine {warranty.machineId}</h3>
                <p className="text-sm text-gray-600">{warranty.provider}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(warranty.endDate)}`}>
                {isBefore(new Date(warranty.endDate), new Date())
                  ? 'Expired'
                  : 'Active'}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{' '}
                {warranty.type.charAt(0).toUpperCase() + warranty.type.slice(1)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Start Date:</span>{' '}
                {format(new Date(warranty.startDate), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">End Date:</span>{' '}
                {format(new Date(warranty.endDate), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Coverage:</span>{' '}
                {warranty.coverage}
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedWarranty(warranty);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(warranty.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <WarrantyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedWarranty(undefined);
        }}
        onSubmit={selectedWarranty ? handleEditWarranty : handleAddWarranty}
        editingWarranty={selectedWarranty}
      />
    </div>
  );
};

export default WarrantyList;