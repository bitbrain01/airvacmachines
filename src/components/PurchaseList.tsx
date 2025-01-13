import React, { useState } from 'react';
import { format } from 'date-fns';
import { Machine, Supplier, Purchase } from '../types';
import PurchaseForm from './PurchaseForm';

interface PurchaseListProps {
  machines: Machine[];
  suppliers: Supplier[];
}

const initialPurchases: Purchase[] = [
  {
    id: 1,
    machineId: "M001",
    supplierId: 1,
    purchaseDate: "2024-01-15",
    purchasePrice: 5000,
    warrantyStartDate: "2024-01-15",
    warrantyEndDate: "2025-01-15"
  }
];

const PurchaseList: React.FC<PurchaseListProps> = ({ machines, suppliers }) => {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>();

  const handleAddPurchase = (purchaseData: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Math.max(...purchases.map(p => p.id)) + 1
    };
    setPurchases([...purchases, newPurchase]);
    setIsFormOpen(false);
  };

  const handleEditPurchase = (purchaseData: Omit<Purchase, 'id'>) => {
    if (!editingPurchase) return;
    
    const updatedPurchases = purchases.map(purchase =>
      purchase.id === editingPurchase.id
        ? { ...purchaseData, id: purchase.id }
        : purchase
    );
    
    setPurchases(updatedPurchases);
    setIsFormOpen(false);
    setEditingPurchase(undefined);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases(purchases.filter(purchase => purchase.id !== id));
    }
  };

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Records</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setEditingPurchase(undefined);
            setIsFormOpen(true);
          }}
        >
          Add Purchase
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Machine {purchase.machineId}
              </h3>
              <p className="text-sm text-gray-600">
                Supplier: {getSupplierName(purchase.supplierId)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Purchase Date:</span>{' '}
                {formatDate(purchase.purchaseDate)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price:</span>{' '}
                {formatPrice(purchase.purchasePrice)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Warranty:</span>{' '}
                {formatDate(purchase.warrantyStartDate)} - {formatDate(purchase.warrantyEndDate)}
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingPurchase(purchase);
                  setIsFormOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(purchase.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <PurchaseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPurchase(undefined);
        }}
        onSubmit={editingPurchase ? handleEditPurchase : handleAddPurchase}
        editingPurchase={editingPurchase}
        machines={machines}
        suppliers={suppliers}
      />
    </div>
  );
};

export default PurchaseList;