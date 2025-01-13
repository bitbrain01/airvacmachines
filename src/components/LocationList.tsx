import React, { useState } from 'react';
import { Location, Machine } from '../types';
import LocationForm from './LocationForm';
import ManageMachinesForm from './ManageMachinesForm';

const initialLocations: Location[] = [
  {
    id: 1,
    name: "Downtown Gas Station",
    address: "123 Main Street",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    contactPerson: "John Doe",
    phoneNumber: "+1 (555) 123-4567",
    email: "downtown@example.com"
  },
  {
    id: 2,
    name: "Westside Fuel Stop",
    address: "456 West Avenue",
    city: "Chicago",
    state: "IL",
    zipCode: "60612",
    contactPerson: "Jane Smith",
    phoneNumber: "+1 (555) 987-6543",
    email: "westside@example.com"
  }
];

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

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();
  const [managingLocation, setManagingLocation] = useState<Location | undefined>();
  const [isMachinesFormOpen, setIsMachinesFormOpen] = useState(false);

  const handleAddLocation = (locationData: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...locationData,
      id: Math.max(...locations.map(l => l.id)) + 1
    };
    setLocations([...locations, newLocation]);
    setIsFormOpen(false);
  };

  const handleEditLocation = (locationData: Omit<Location, 'id'>) => {
    if (!editingLocation) return;
    
    const updatedLocations = locations.map(location =>
      location.id === editingLocation.id
        ? { ...locationData, id: location.id }
        : location
    );
    
    setLocations(updatedLocations);
    setIsFormOpen(false);
    setEditingLocation(undefined);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(location => location.id !== id));
      // Remove this location from all machines' locationIds
      setMachines(machines.map(machine => ({
        ...machine,
        locationIds: machine.locationIds.filter(locId => locId !== id)
      })));
    }
  };

  const handleManageMachines = (location: Location) => {
    setManagingLocation(location);
    setIsMachinesFormOpen(true);
  };

  const handleAddMachine = (machineId: string) => {
    if (!managingLocation) return;

    const existingMachine = machines.find(m => m.id === machineId);
    if (existingMachine) {
      // Check if machine is already installed at this location
      if (existingMachine.locationIds.includes(managingLocation.id)) {
        alert('This machine is already installed at this location.');
        return;
      }

      // Add this location to the machine's locations
      setMachines(machines.map(m => 
        m.id === machineId 
          ? { ...m, locationIds: [...m.locationIds, managingLocation.id] }
          : m
      ));
    } else {
      // Create new machine
      const newMachine: Machine = {
        id: machineId,
        locationIds: [managingLocation.id],
        status: 'Online',
        lastMaintenance: new Date().toISOString().split('T')[0],
        supplierName: 'AirVac Solutions',
        nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maintenanceHistory: []
      };

      setMachines([...machines, newMachine]);
    }
  };

  const handleRemoveMachine = (machineId: string) => {
    if (!managingLocation) return;

    if (window.confirm('Are you sure you want to remove this machine from this location?')) {
      setMachines(machines.map(machine => {
        if (machine.id === machineId) {
          const newLocationIds = machine.locationIds.filter(id => id !== managingLocation.id);
          // If machine is not installed anywhere else, remove it completely
          if (newLocationIds.length === 0) {
            return null;
          }
          return { ...machine, locationIds: newLocationIds };
        }
        return machine;
      }).filter((machine): machine is Machine => machine !== null));
    }
  };

  const getLocationMachines = (locationId: number) => {
    return machines.filter(machine => machine.locationIds.includes(locationId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setEditingLocation(undefined);
            setIsFormOpen(true);
          }}
        >
          Add Location
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.address}</p>
              <p className="text-sm text-gray-600">
                {location.city}, {location.state} {location.zipCode}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {location.contactPerson}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span>{' '}
                <a href={`tel:${location.phoneNumber}`} className="text-blue-600 hover:text-blue-800">
                  {location.phoneNumber}
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${location.email}`} className="text-blue-600 hover:text-blue-800">
                  {location.email}
                </a>
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-900">Installed Machines</h4>
                <button
                  onClick={() => handleManageMachines(location)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Manage Machines
                </button>
              </div>
              <div className="space-y-2">
                {getLocationMachines(location.id).map((machine) => (
                  <div
                    key={machine.id}
                    className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                  >
                    <span>{machine.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(location)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(location.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <LocationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLocation(undefined);
        }}
        onSubmit={editingLocation ? handleEditLocation : handleAddLocation}
        editingLocation={editingLocation}
      />

      {managingLocation && (
        <ManageMachinesForm
          isOpen={isMachinesFormOpen}
          onClose={() => {
            setIsMachinesFormOpen(false);
            setManagingLocation(undefined);
          }}
          locationId={managingLocation.id}
          locationName={managingLocation.name}
          machines={getLocationMachines(managingLocation.id)}
          onAddMachine={handleAddMachine}
          onRemoveMachine={handleRemoveMachine}
        />
      )}
    </div>
  );
};

export default LocationList;