import React, { useState } from 'react';
import { format } from 'date-fns';
import { InventoryPart, InventoryTransaction, Supplier } from '../types';
import InventoryForm from './InventoryForm';
import InventoryTransactionForm from './InventoryTransactionForm';

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "AirVac Solutions",
    contactPerson: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    emailAddress: "john.smith@airvac.com",
    address: "123 Industrial Park, Suite 100, Chicago, IL 60601"
  },
  {
    id: 2,
    name: "PressureMax Systems",
    contactPerson: "Sarah Johnson",
    phoneNumber: "+1 (555) 987-6543",
    emailAddress: "sarah.j@pressuremax.com",
    address: "456 Tech Boulevard, Detroit, MI 48201"
  }
];

const initialInventory: InventoryPart[] = [
  {
    id: 1,
    name: "Air Filter",
    partNumber: "AF-001",
    description: "High-efficiency air filter for vacuum systems",
    manufacturer: "FilterTech",
    currentStock: 15,
    minimumStock: 5,
    reorderPoint: 8,
    unitPrice: 29.99,
    location: "Shelf A1",
    category: "Filters",
    machineCompatibility: ["M001", "M002"],
    lastRestockDate: "2024-01-15",
    supplier: 1
  },
  {
    id: 2,
    name: "Pressure Gauge",
    partNumber: "PG-002",
    description: "Digital pressure gauge with LCD display",
    manufacturer: "PressurePro",
    currentStock: 8,
    minimumStock: 3,
    reorderPoint: 5,
    unitPrice: 49.99,
    location: "Shelf B2",
    category: "Gauges",
    machineCompatibility: ["M001", "M002", "M003"],
    lastRestockDate: "2024-01-10",
    supplier: 2
  }
];

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryPart[]>(initialInventory);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const handleAddPart = (partData: Omit<InventoryPart, 'id'>) => {
    const newPart: InventoryPart = {
      ...partData,
      id: Math.max(...inventory.map(p => p.id)) + 1
    };
    setInventory([...inventory, newPart]);
    setIsFormOpen(false);
  };

  const handleEditPart = (partData: Omit<InventoryPart, 'id'>) => {
    if (!selectedPart) return;
    
    const updatedInventory = inventory.map(part =>
      part.id === selectedPart.id
        ? { ...partData, id: part.id }
        : part
    );
    
    setInventory(updatedInventory);
    setIsFormOpen(false);
    setSelectedPart(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      setInventory(inventory.filter(part => part.id !== id));
    }
  };

  const handleTransaction = (transaction: Omit<InventoryTransaction, 'id'>) => {
    if (!selectedPart) return;

    const updatedInventory = inventory.map(part => {
      if (part.id === selectedPart.id) {
        const stockChange = transaction.type === 'Use' ? -transaction.quantity : transaction.quantity;
        return {
          ...part,
          currentStock: part.currentStock + stockChange,
          lastRestockDate: transaction.type === 'Restock' ? transaction.date : part.lastRestockDate,
          unitPrice: transaction.type === 'Restock' && transaction.unitPrice ? transaction.unitPrice : part.unitPrice
        };
      }
      return part;
    });

    setInventory(updatedInventory);
    setIsTransactionFormOpen(false);
    setSelectedPart(null);
  };

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parts Inventory</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setSelectedPart(null);
            setIsFormOpen(true);
          }}
        >
          Add Part
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((part) => (
          <div
            key={part.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{part.name}</h3>
                <p className="text-sm text-gray-600">Part #: {part.partNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                part.currentStock <= part.minimumStock
                  ? 'bg-red-100 text-red-800'
                  : part.currentStock <= part.reorderPoint
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                Stock: {part.currentStock}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Supplier:</span> {getSupplierName(part.supplier)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {part.location}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Unit Price:</span> ${part.unitPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last Restock:</span>{' '}
                {format(new Date(part.lastRestockDate), 'MMM d, yyyy')}
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedPart(part);
                  setIsTransactionFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Add Transaction
              </button>
              <button
                onClick={() => {
                  setSelectedPart(part);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(part.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPart(null);
        }}
        onSubmit={selectedPart ? handleEditPart : handleAddPart}
        editingPart={selectedPart || undefined}
        suppliers={suppliers}
      />

      <InventoryTransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => {
          setIsTransactionFormOpen(false);
          setSelectedPart(null);
        }}
        onSubmit={handleTransaction}
        part={selectedPart || undefined}
      />
    </div>
  );
};

export default InventoryList;